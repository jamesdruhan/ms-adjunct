/**
 * @file Manages all authentication actions for MS Adjunct.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { Settings } from "../config/Settings";
import { SignInMethod, AdjunctStorageKey } from "../utility/Constants";
import { BrowserStorage } from "../storage/BrowserStorage";
import { AuthenticationResult, AccountInfo } from "@azure/msal-browser";

/**
 * Class which manages all authentication actions for MS Adjunct.
 */
export class Authentication
{
    /**
     * Settings object which contains all necessary data to execute MS Adjunct commands.
     * 
     * @type { Settings }
     */
    protected context : Settings;

    /**
     * BrowserStorage object which manages browser storage actions.
     * 
     * @type { BrowserStorage }
     */
    protected browserStorage : BrowserStorage;

    /**
     * @class Create a new instance of the Auth class.
     * @constructs Auth
     * 
     * @example
     * const auth : Auth = new Auth( context );
     * 
     * @param { Settings } context - MS Adjunct settings object.
     * @returns { Authentication } - Object of the Auth class.
     */
    constructor ( context : Settings )
    {
        this.context        = context;
        this.browserStorage = new BrowserStorage( this.context.signInPersistance! );
    }

    /**
     * Prompt the user to sign-in (if not already logged in).
     * 
     * @returns { (Promise <AccountInfo | null>) } - Promise with resolve parameter of a @msal-browser AccountInfo object if logged in (null otherwise).
     */
    async login () : Promise <AccountInfo | null>
    {
        // Authenticate to Azure AD with Redirect method.
        if ( this.context.signInMethod === SignInMethod.REDIRECT )
        {
            try
            {
                // Check if there is a ongoing redirect login process happening.
                const redirectAuthResult : AuthenticationResult | null = await this.context.msalClient!.handleRedirectPromise();

                if ( redirectAuthResult !== null )
                {
                    // Finalize the login process.
                    return this.handleLoginResult( redirectAuthResult );
                }

                // Check if a user account is present as being already logged in.
                if ( this.isUserLoggedIn() === true )
                {
                    return this.getLoggedInAccount();
                }
                else
                {
                    // Initialize a MS Adjunct storage variables.
                    this.clearStorage();

                    // Request login via Microsoft redirection to URL.
                    this.context.msalClient!.loginRedirect( { scopes : this.context.appPermissions! } );
                }
            }
            catch ( e : any )
            {
                return null;
            }
        }

        // Authenticate to Azure AD with Popup method.
        if ( this.context.signInMethod === SignInMethod.POPUP )
        {
            try
            {
                // Check if a user account is present as being already logged in.
                if ( this.isUserLoggedIn() === true )
                {
                    return this.getLoggedInAccount();
                }
                
                // Initialize a MS Adjunct storage variables.
                this.clearStorage();

                // Request login via Microsoft popup window.
                const authResult : AuthenticationResult = await this.context.msalClient!.loginPopup( { scopes : this.context.appPermissions! } );

                // Process the login result.
                return this.handleLoginResult( authResult );
            }
            catch ( e : any )
            {
                return null;
            }
        }

        return null;
    }

    /**
     * Signs the currently logged in user out and clears their browser cache of MS Adjunct data.
     * 
     * @returns { (Promise <void>) } - Promise with no resolve parameter.
     */
    logout () : Promise <void>
    {
        // Check if a user account is present as being already logged in.
        if ( this.isUserLoggedIn() === false )
        {
            return Promise.resolve();
        }

        // Clear MS Adjunct data.
        this.clearStorage();

        if ( this.context.signInMethod === SignInMethod.POPUP )
        {
            return this.context.msalClient!.logoutPopup();
        }
        else
        {
            return this.context.msalClient!.logoutRedirect( { postLogoutRedirectUri : this.context.signOutUrl });
        }
    }

    /**
     * Checks if the user is logged in (true) or not (false).
     * Note: This does not guarantee the login is still valid on Azure AD.
     * 
     * @returns { boolean } - Indicates if user is logged in or not.
     */
    isUserLoggedIn () : boolean
    {
        let isUserLoggedIn = false;

        // Get the stored homeAccountId associated with a logged in account.
        const homeAccountId = this.browserStorage.getItem( AdjunctStorageKey.MS_ADJUNCT_ACCOUNT_HOMEACCOUNTID );
        
        if ( homeAccountId !== null )
        {
            const userAccount : AccountInfo[] = this.context.msalClient!.getAllAccounts();

            if ( userAccount.length > 0 )
            {
                userAccount.forEach( ( account : AccountInfo ) =>
                {
                    if ( account.homeAccountId === homeAccountId )
                    {
                        isUserLoggedIn = true;
                    }
                })
            }
        }

        return isUserLoggedIn;
    }

    /**
     * Returns the currently logged in users Microsoft Identity account information or null.
     * 
     * @returns { (AccountInfo | null) } - An @msal-browser/AccountInfo object.
     */
     getLoggedInAccount () : AccountInfo | null
     {
         // Get the stored homeAccountId associated with a logged in account.
         const homeAccountId = this.browserStorage.getItem( AdjunctStorageKey.MS_ADJUNCT_ACCOUNT_HOMEACCOUNTID );

         if ( homeAccountId !== null )
         {
             console.log(this.context.msalClient!.getAccountByHomeId( homeAccountId ))
             return this.context.msalClient!.getAccountByHomeId( homeAccountId );
         }
 
         return null;
     }

    /**
     * Handles the response from Microsoft Identity when a user sign-in is performed.
     * 
     * @returns { (AccountInfo | null ) } - Promise with no resolve parameter.
     */
    handleLoginResult ( authResult : AuthenticationResult | null ) : AccountInfo | null 
    {
        // Authentication to Azure AD was successful: A single account was returned.
        if ( authResult !== null && authResult.account !== null )
        {
            this.browserStorage.setItem( AdjunctStorageKey.MS_ADJUNCT_ACCOUNT_HOMEACCOUNTID, authResult.account.homeAccountId );

            return authResult.account;
        }

        // Get all the accounts returned by the login.
        const loggedInAccounts : AccountInfo [] = this.context.msalClient!.getAllAccounts();

        // No accounts returned by the login process.
        if ( loggedInAccounts.length < 1 )
        {
            return null;
        }

        // Authentication to Azure AD was successful: A single account was returned.
        if ( loggedInAccounts.length === 1 )
        {
            // Store the logged in account's homeAccountId in browser storage.
            this.browserStorage.setItem( AdjunctStorageKey.MS_ADJUNCT_ACCOUNT_HOMEACCOUNTID, loggedInAccounts[0].homeAccountId );

            return loggedInAccounts[0];
        }

        // Authentication to Azure AD was successful: Multiple accounts were returned.
        if ( loggedInAccounts.length > 1 )
        {
            const selectedAccount : AccountInfo = this.context.signInMultipleAccountsCallBack( loggedInAccounts );

            // Store the logged in account's homeAccountId in browser storage.
            this.browserStorage.setItem( AdjunctStorageKey.MS_ADJUNCT_ACCOUNT_HOMEACCOUNTID, selectedAccount.homeAccountId );

            return selectedAccount;
        }

        // Login failed.
        return null;
    }

    /**
     * Clears all MS Adjunct related cache data.
     */
    clearStorage () : void
    {
        this.browserStorage.removeItem( "msAdjunct.Account.homeAccountId" );
    }
}
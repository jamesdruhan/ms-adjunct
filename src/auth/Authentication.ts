/**
 * @file Manages all authentication actions for Adjunct Graph.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { IAuthentication } from "./IAuthentication";
import { BrowserStorage } from "../storage/BrowserStorage";
import { AuthenticationErrorMessage } from "../error/AuthenticationError";
import { SignInMethod, AdjunctStorageKey, TokenType, GraphErrorCode } from "../utility/Constants";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

import type { Settings } from "../config/Settings";
import type { AuthenticationResult, AccountInfo, SilentRequest } from "@azure/msal-browser";
import { Graph } from "../graph/Graph";

/**
 * Manages all authentication actions for Adjunct Graph.
 * 
 * @implements { IAuthentication }
 */
export class Authentication implements IAuthentication
{
    /**
     * Verified settings object which contains all necessary data to execute Adjunct commands.
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
     * @param { Settings } context - Adjunct settings object.
     * @returns { Authentication } - Object of the Auth class.
     */
    constructor ( context : Settings )
    {
        this.context        = context;
        this.browserStorage = new BrowserStorage( this.context.signInPersistance! );
    }

    /**
     * Starts and manages the login to Microsoft Identity server process. 
     * 
     * @returns { Promise <AuthenticationResult> } - Promise that returns a login response.
     */
    public login () : Promise <AuthenticationResult>
    {
        // Authenticate to Azure AD with Redirect method.
        if ( this.context.signInMethod === SignInMethod.REDIRECT )
        {
            return this.loginRedirect();
        }

        // Authenticate to Azure AD with Popup method.
        if ( this.context.signInMethod === SignInMethod.POPUP )
        {
            return this.loginPopup();
        }

        throw AuthenticationErrorMessage.signInMethodUnknown;
    }

    /**
     * Signs the currently logged in user out and clears their browser cache of Adjunct data.
     * 
     * @returns { Promise <void> } - Promise with no resolve parameter.
     */
    public logout () : Promise <void>
    {
        // Check if a user account is present as being already logged in.
        const foundAccount : AccountInfo | null = this.getLoggedInAccount();

        // Clear Adjunct data.
        this.clearStorage();

        // If no account was found, return null (user already logged out).
        if ( foundAccount === null )
        {
            return Promise.resolve();
        }
        // Log out the current user.
        else
        {
            if ( this.context.signInMethod === SignInMethod.POPUP )
            {
                return this.context.msalClient!.logoutPopup( { account : foundAccount, postLogoutRedirectUri : this.context.authRedirectUrl, mainWindowRedirectUri : this.context.signOutUrl } );
            }
            else
            {
                return this.context.msalClient!.logoutRedirect( { account : foundAccount, postLogoutRedirectUri : this.context.signOutUrl });
            }
        }
    }

    /**
     * Logs in a user to Microsoft Azure AD via the Redirect method.
     * This method will also handle the login attempt response from Azure AD.
     * 
     * @returns { Promise <AuthenticationResult> } - Promise that returns a valid token.
     */
    private async loginRedirect () : Promise <AuthenticationResult>
    {
        try
        {
            // Check if there is a ongoing redirect login process happening.
            const redirectAuthResult : AuthenticationResult | null = await this.context.msalClient!.handleRedirectPromise();

            if ( redirectAuthResult !== null )
            {
                // Finalize the login process.
                return this.processLoginResult( redirectAuthResult );
            }
            else
            {
                // Check if a user account is present as being already logged into the local app.
                const foundAccount : AccountInfo | null = this.getLoggedInAccount();

                // If there is no account found or an account was found but the login required flag is 'yes', trigger login.
                if ( foundAccount === null || ( foundAccount !== null && this.browserStorage.getItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED ) === "yes" ) )
                {
                    // Initialize a Adjunct storage variables.
                    this.clearStorage();

                    // Request login via Microsoft redirection to URL.
                    this.context.msalClient!.loginRedirect( { scopes : this.context.appPermissions!, redirectUri : this.context.authRedirectUrl } );

                    return {} as AuthenticationResult;
                }
                // If there is an account and the login required flag is no, get a valid token, even if login is necessary.
                else
                {
                    return this.getToken( TokenType.APP, true );
                }
            }
        }
        catch ( e : any )
        {
            return Promise.reject( { error : e, ...AuthenticationErrorMessage.signInErrorUnknown } );
        }
    }

    /**
     * Logs in a user to Microsoft Azure AD via the Popup method.
     * This method will also handle the login attempt response from Azure AD.
     * 
     * @returns { Promise <AuthenticationResult> } - Promise that returns a valid token.
     */
    private async loginPopup () : Promise <AuthenticationResult>
    {
        try
        {
            // Check if a user account is present as being already logged in.
            const foundAccount : AccountInfo | null = this.getLoggedInAccount();

            // If there is no account found or an account was found but the login required flag is 'yes', trigger login.
            if ( foundAccount === null || ( foundAccount !== null && this.browserStorage.getItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED) === "yes" ) )
            {
                // Initialize a Adjunct storage variables.
                this.clearStorage();

                // Request login via Microsoft popup window.
                const authResult : AuthenticationResult = await this.context.msalClient!.loginPopup( { scopes : this.context.appPermissions!, redirectUri : this.context.authRedirectUrl } );

                return this.processLoginResult( authResult );
            }
            // If there is an account and the login required flag is no, don't bother logging in.
            else
            {
                return this.getToken( TokenType.APP, true );
            }
        }
        catch ( e : any )
        {
            return Promise.reject( { error : e, ...AuthenticationErrorMessage.signInErrorUnknown } );
        }
    }

    /**
     * Handles the response from Microsoft Identity when a user sign-in is performed.
     * 
     * @param { AuthenticationResult } authResult - A MSAL AuthenticationResult contain account and token details.
     * @returns { Promise <AuthenticationResult> } - Promise with the AuthenticationResult object.
     */
    private async processLoginResult ( authResult : AuthenticationResult ) : Promise <AuthenticationResult>
    {
        // Indicates that login is still required unless otherwise noted.
        this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED, "yes" );

        // Authentication to Azure AD was successful: A single account was returned.
        if ( authResult !== null && authResult.account !== null )
        {
            // Register account details in storage.
            this.registerAccount( authResult );

            // Clear login requirement.
            this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED, "no" );

            return authResult;
        }

        // Get all the accounts returned by the login.
        const loggedInAccounts : AccountInfo [] = this.context.msalClient!.getAllAccounts();

        // Authentication to Azure AD was successful: A single account was returned.
        if ( loggedInAccounts.length === 1 )
        {
            this.context.msalClient!.setActiveAccount( loggedInAccounts[0] );

            try
            {
                // Get a valid token.
                const resultToken : AuthenticationResult = await this.getToken( TokenType.APP, false );

                // Register account details in storage.
                this.registerAccount( resultToken );

                // Clear login requirement.
                this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED, "no" );

                return resultToken;
            }
            catch ( e : any )
            {
                return Promise.reject( e );
            }
        }

        // Authentication to Azure AD was successful: Multiple accounts were returned.
        if ( loggedInAccounts.length > 1 )
        {
            try
            {
                // App callback which handles the logic for multiple accounts.
                const selectedAccount : AccountInfo = await this.context.signInMultipleAccountsCallBack( loggedInAccounts );

                this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_ACCOUNT_HOMEACCOUNTID, selectedAccount.homeAccountId );
                this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED, "no" );

                // Set the account in MSAL.
                this.context.msalClient!.setActiveAccount( selectedAccount );

                try
                {
                    // Get a valid token.
                    const resultToken : AuthenticationResult = await this.getToken( TokenType.APP, false );

                    // Register account details in storage.
                    this.registerAccount( resultToken );

                    // Clear login requirement.
                    this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED, "no" );
    
                    return resultToken;
                }
                catch ( e : any )
                {
                    return Promise.reject( e );
                }
            }
            catch ( e : any )
            {
                throw AuthenticationErrorMessage.processLoginMultipleAccountError;
            }
        }

        // No accounts returned by the login process.
        throw AuthenticationErrorMessage.processLoginNoAccounts;
    }
    
    /**
     * Requests a access token for either Microsoft Identity (APP) or Microsoft Graph (GRAPH). The forceLogin flag
     * can be used to trigger a login process if a token attempt is made but the user is no longer authenticated with Microsoft.
     * 
     * Note: Setting forceLogin to true works best with the signInMethod of POPUP.
     * 
     * @returns { Promise <AuthenticationResult> } - Indicates if user is logged in or not.
     */
    public async getToken ( tokenType : TokenType = TokenType.GRAPH, forceLogin : boolean = false ) : Promise <AuthenticationResult>
    {
        if ( forceLogin === true && this.browserStorage.getItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED ) === "yes" )
        {
            try
            {
                return await this.login();
            }
            catch ( e : any )
            {
                return Promise.reject( e );
            }
        }

        // Get the logged in user account data.
        const userAccount : AccountInfo | null = this.getLoggedInAccount();

        if ( userAccount !== null )
        {
            let requestScope = this.context.graphPermissions!;

            // Change the default scope to the application scopes if necessary.
            if ( tokenType === TokenType.APP )
            {
                requestScope = this.context.appPermissions!;
            }

            const request : SilentRequest =
            {
                account     : userAccount,
                scopes      : requestScope,
                redirectUri : this.context.renewTokenRedirectUrl
            };

            try
            {

                // Request an access token.
                const tokenResponse : AuthenticationResult = await this.context.msalClient!.acquireTokenSilent( request );

                this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED, "no" );

                return tokenResponse;
            }
            catch ( e : any )
            {
                if ( e instanceof InteractionRequiredAuthError )
                {
                    if ( e.errorCode === GraphErrorCode.MISSING_PERMISSION )
                    {
                        return Promise.reject( AuthenticationErrorMessage.getTokenMissingPermissionScope ); 
                    }

                    if ( e.errorCode === GraphErrorCode.EXPIRED_TOKEN || e.errorCode === GraphErrorCode.LOGIN_REQUIRED )
                    {
                        this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED, "yes" );
                    
                        if ( forceLogin === true )
                        {
                            try
                            {
                                return await this.login();
                            }
                            catch ( _e : any )
                            {
                                return Promise.reject( _e );
                            }
                        }
                        else
                        {
                            return Promise.reject( AuthenticationErrorMessage.getTokenAuthenticationRequired ); 
                        }
                    }

                    // Unknown error to Adjunct.
                    return Promise.reject( e );
                }
                else
                {
                    return Promise.reject( e ); 
                }
            }
        }
        else
        {
            return Promise.reject( AuthenticationErrorMessage.getTokenNotLoggedIn );  
        }
    }

    /**
     * Gets the currently logged in users Microsoft Identity account information or null.
     * 
     * @returns { (AccountInfo | null) } - An @msal-browser/AccountInfo object.
     */
    private getLoggedInAccount () : AccountInfo | null
    {
        // Get the stored homeAccountId associated with a logged in account.
        const homeAccountId = this.browserStorage.getItem( AdjunctStorageKey.ADJUNCT_ACCOUNT_HOMEACCOUNTID );

        if ( homeAccountId !== null )
        {
            return this.context.msalClient!.getAccountByHomeId( homeAccountId );
        }

        return null;
    }

    /**
     * Verifies with Adjunct to check if the user is logged in and has a valid token.
     * 
     * Note: This only checks locally in the app. This will not guarantee the user is still authenticated
     * with Microsoft Identity servers.
     * 
     * @returns { boolean } - Indicates if user is logged in or not.
     */
    public isUserLoggedIn () : boolean
    {
        if ( this.getLoggedInAccount() !== null )
        {
            return true;
        }

        return false;
    }

    /**
     * Storages relevant account information in browser storage for Adjunct use.
     * 
     * @param { AuthenticationResult } authResult - A MSAL AuthenticationResult contain account and token details.
     * @returns { void }
     */
    private registerAccount ( authResult : AuthenticationResult ) : void
    {
        if ( typeof authResult.account !== null )
        {
            this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_ACCOUNT_HOMEACCOUNTID, authResult.account!.homeAccountId );

            if ( typeof authResult.idTokenClaims !== "undefined" && typeof authResult.idTokenClaims["roles"] !== "undefined" && typeof authResult.idTokenClaims["roles"] === "object" )
            {
                this.browserStorage.setItem( AdjunctStorageKey.ADJUNCT_ACCOUNT_ROLES, JSON.stringify( authResult.idTokenClaims["roles"] ) );
            }
        }
    }

    /**
     * Clears all Adjunct related cache data from the browser.
     */
    private clearStorage () : void
    {
        this.browserStorage.removeItem( AdjunctStorageKey.ADJUNCT_ACCOUNT_HOMEACCOUNTID );
        this.browserStorage.removeItem( AdjunctStorageKey.ADJUNCT_ACCOUNT_ROLES );
        this.browserStorage.removeItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED );
    }
}
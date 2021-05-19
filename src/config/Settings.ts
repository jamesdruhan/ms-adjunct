/**
 * @file Type definition outlining the Settings object needed to initialize a Adjunct Graph instance.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { GraphVersion, SignInMethod, SignInPersistance } from "../utility/Constants";
import { PublicClientApplication } from "@azure/msal-browser";

import type { Configuration, AccountInfo } from "@azure/msal-browser";

/**
 * @typedef Type definition outlining the Settings object needed to initialize a Adjunct Graph instance.
 */
export type Settings =
{
    /**
     * Client ID of the application registered in Azure AD. Required 
     * unless otherwise defined in msalConfig or msalClient settings.
     * 
     * @type { string }
     */
    clientId? : string;

    /**
     * ID of the M365 tenant used for authenticating users. If provided,
     * will be used to authenticate against when performing user login (authority).
     * 
     * @type { string }
     */
    tenantId? : string;

    /**
     * URL of Microsoft Identity endpoint which will process user login requests. The authority URL
     * will be generated based on the tenantId or otherwise use common. However, this allows those
     * to be overrides with a custom authority if necceesary.
     * 
     * @type { string }
     */
    authority? : string;

    /**
     * List of permission scopes for Microsoft Identity (Azure AD) the application needs access to during Login.
     * 
     * @type { string }
     */
    appPermissions? : string [];

    /**
     * List of permission scopes for Microsoft Graph the application needs access to in order
     * to make a Graph call for the user.
     * 
     * @type { string }
     */
    graphPermissions? : string [];

    /**
     * The Microsoft Graph version to use when making API calls.
     * 
     * @type { GraphVersion }
     */
    graphVersion? : GraphVersion;

    /**
     * Instructs Adjunct to utilize cookies in addition to browser storage to store authentication information.
     * 
     * @type { boolean }
     */
    allowCookies? : boolean;

    /**
     * Forces cookie data to be sent over HTTPS (only used when when the allowCookies setting is true).
     * 
     * @type { boolean }
     */
    httpsCookies? : boolean;

    /**
     * Method users will use to login to application: A popup window or a redirection to a login page.
     * 
     * Tip: For best performance, use popup.
     * 
     * @type { SignInMethod }
     */
    signInMethod? : SignInMethod;

    /**
     * Indicates where to store user authentication details. This will dictate the sign-in experience for the user.
     * 
     * SESSION: Clears user login details when the browser is closed. Users will need to login each time the app is accessed.
     * REMEMBER: Will remember login details even if the browser is close. Users are automatically logged in when the app is re-visited.
     * 
     * @type { SignInPersistance }
     */
    signInPersistance? : SignInPersistance;

    /**
     * URL of a page or route in your application which will process a sign-in request.
     * This page must have a instantiated object of adjunct-graph and call the signIn()
     * method on load.
     * 
     * Note #1: When the sign in method of POPUP is used, the user will never see this page.
     * However, when the sign in method of REDIRECT is used, this is the page the user
     * will be redirected to from Microsoft after logging in.
     * 
     * Note #2: This URL must be registered in your App Registration on Azure AD.
     * 
     * @type { string }
     */
    authRedirectUrl : string;

    /**
     * URL used to silently renew authentication tokens. This URL must direct to a page
     * that does not require authentication. Best practice is to create a blank HTML page
     * with no content or JavaScript.
     * 
     * Note: This URL must be registered in your App Registration on Azure AD.
     * 
     * @type { string }
     */
    renewTokenRedirectUrl : string;
            
    /**
     * URL user is redirected to on successful sign-out of application.
     * 
     * Note: This URL must be registered in your App Registration on Azure AD.
     * 
     * @type { string }
     */
    signOutUrl? : string;
            
    /**
     * Configuration class object used it initialize a @msal-browser public client.
     * 
     * Note: This is for advanced use. Use this only when you need to set MSAL options not defined in Adjunct.
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
     * 
     * @type { Configuration }
     */
    msalConfig? : Configuration;  

    /**
     * MSAL client application used for authentication and getting tokens.
     * 
     * Note: This is for advanced use.Use this only when you need to instantiate a @msal-browser object with custom settings.
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser
     * 
     * @type { Configuration }
     */
    msalClient? : PublicClientApplication | undefined

    /**
     * Called in the scenario that a logged in user has multiple accounts to choose from.
     * This callback should contain logic that determines which account should be used for Adjunct.
     * 
     * @param { AccountInfo [] } accountChoices - Array of AccountInfo objects that belong to the logged in user.
     * @returns { Promise <AccountInfo> } - The selected account to be used for Adjunct calls.
     */
    signInMultipleAccountsCallBack : ( accountChoices : AccountInfo[] ) => Promise <AccountInfo>;
}
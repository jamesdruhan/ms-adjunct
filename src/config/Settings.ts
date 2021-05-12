/**
 * @file Type for MS Adjunct settings.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { GraphVersion, SignInMethod, SignInPersistance } from "../utility/Constants";
import { Configuration, AccountInfo, PublicClientApplication } from "@azure/msal-browser";

/**
 * @typedef Type for MS Adjunct settings.
 */
export type Settings =
{
    /**
     * Client ID of the application registered in Azure AD.
     * 
     * @type { string }
     */
    clientId? : string;

    /**
     * ID of the M365 tenant used for authenticating users.
     * 
     * @type { string }
     */
    tenantId? : string;

    /**
     * URL of Microsoft Identity endpoint which will process user login requests.
     * 
     * @type { string }
     */
     authority? : string;

    /**
     * List of scope permissions in Microsoft Identity (Azure AD) the application needs access to.
     * 
     * @type { string }
     */
    appPermissions? : string [];

    /**
     * Client ID of the application registered in Azure AD.
     * 
     * @type { string }
     */
    graphPermissions? : string [];

    /**
     * List of scope permissions in Microsoft Graph the application needs access to.
     * 
     * @type { GraphVersion }
     */
    graphVersion? : GraphVersion;

    /**
     * Allow storage of authenticate cache items in cookies.
     * 
     * @type { boolean }
     */
    allowCookies? : boolean;

    /**
     * Forces cookie data to be sent over HTTPS (active only when allowCookies is true).
     * 
     * @type { boolean }
     */
    httpsCookies? : boolean;

    /**
     * Method users will use to login to application: A popup window or a redirection to a login page.
     * 
     * @type { SignInMethod }
     */
    signInMethod? : SignInMethod;

    /**
     * Indicates where to store user authentication details.
     * SESSION: Clears user login details when the browser is closed.
     * REMEMBER: Will remember login details even if the browser is close.
     * 
     * @type { SignInPersistance }
     */
    signInPersistance? : SignInPersistance;

    /**
     * URL user is redirected to on successful sign-in to application.
     * 
     * @type { string }
     */
    signInUrl? : string;

    /**
     * URL user is redirected to on successful sign-out of application.
     * 
     * @type { string }
     */
    signOutUrl? : string;

    /**
     * Configuration object used it initialize a @msal-browser client.
     * Use this only when you need to set MSAL options not defined in MS Adjunct.
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
     * 
     * @type { Configuration }
     */
    msalConfig? : Configuration;  

    /**
     * MSAL client application used for authentication and getting tokens.
     * 
     * @type { Configuration }
     */
     msalClient? : PublicClientApplication | undefined

    /**
     * Called in the scenario that a logged in user has multiple accounts to choose from.
     * This callback should contain logic that determines which account should be used for MS Adjunct.
     * 
     * @param { AccountInfo [] } accountChoices - Array of AccountInfo objects that belong to the logged in user.
     * @returns { AccountInfo } - The selected account to be used for MS Adjunct calls.
     */
    signInMultipleAccountsCallBack : ( accountChoices : AccountInfo[] ) => AccountInfo;
}
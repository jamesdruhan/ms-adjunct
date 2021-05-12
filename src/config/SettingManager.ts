/**
 * @file Creates a validated set of settings for MS Adjunct.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { Settings } from "./Settings";
import { Helpers } from "../utility/Helpers";
import { GraphVersion, SignInMethod, SignInPersistance, URL } from "../utility/Constants";
import { Configuration, AccountInfo, PublicClientApplication } from "@azure/msal-browser";

/**
 * Class which creates a validated set of settings for MS Adjunct.
 */
export class SettingManager
{
    /**
     * Builds a validated version of the passed settings with defaults.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { (string | null) } - Validated collection of MS Adjunct settings.
     */
    static build ( settings : Settings ) : Settings
    {
        // Verified and compiled final settings MS Adjunct will use.
        const verifiedSettings : Settings =
        {
            clientId          : this.getClientId( settings ),
            tenantId          : this.getTenantId( settings ),
            authority         : undefined,
            appPermissions    : this.getAppPermissions( settings ),
            graphPermissions  : this.getGraphPermissions( settings ),
            graphVersion      : this.getGraphVersion( settings ),
            allowCookies      : this.getAllowCookies( settings ),
            httpsCookies      : this.getHTTPSCookies( settings ),
            signInMethod      : this.getSignInMethod( settings ),
            signInPersistance : this.getSignInPersistance( settings ),
            signInUrl         : this.getSignInUrl( settings ),
            signOutUrl        : this.getSignOutUrl( settings ),
            msalConfig        : this.getMSALConfig( settings ),
            msalClient        : undefined,
        
            signInMultipleAccountsCallBack : this.getSignInMultipleAccountsCallBack( settings )
        };

        // Generate or add the Microsoft Identity authority used for login.
        verifiedSettings.authority = this.getAuthority( settings, verifiedSettings );

        // Generate the MSAL client that will be used with MS Adjunct.
        verifiedSettings.msalClient = this.getMSALClient( settings, verifiedSettings );

        return verifiedSettings;
    }

    /**
     * Verifies the clientId is configured and returns it.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { string } - Validated clientId setting.
     */
    private static getClientId( settings : Settings ) : string
    {
        if ( typeof settings.msalClient !== 'undefined' && typeof settings.msalClient === 'object' )
        {
            return "";
        }
        else if ( typeof settings.msalConfig === "undefined" )
        {
            if ( typeof settings.clientId !== "undefined" && settings.clientId !== "" )
            {
                return settings.clientId;
            }
            else
            {
                throw "MS Adjunct: The setting 'clientId' cannot be undefined or blank.";
            }
        }
        else
        {
            if ( typeof settings.msalConfig.auth !== "undefined" && typeof settings.msalConfig.auth.clientId !== "undefined" && settings.msalConfig.auth.clientId !== "" )
            {
                return settings.msalConfig.auth.clientId;
            }
            else
            {
                throw "MS Adjunct: The MSAL configuration option 'auth.clientId' cannot be undefined or blank.";
            }
        }
    }

    /**
     * Returns a valid tenantId or undefined.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { string } - Validated tenantId setting.
     */
     private static getTenantId( settings : Settings ) : string | undefined
     {
         if ( typeof settings.tenantId === "undefined" || typeof settings.tenantId === "string" )
         {
             return settings.tenantId;
         }
         else
         {
             throw "MS Adjunct: The setting 'tenantId' must be either a string or undefined."
         }
     }

    /**
     * Returns a valid set of app permission scopes to be used when authenticating with Azure AD.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { string } - Validated appPermissions setting.
     */
     private static getAppPermissions( settings : Settings ) : string []
     {
         if ( typeof settings.appPermissions !== "undefined" && typeof settings.appPermissions === "object" )
         {
             if ( Helpers.doesArrayContainOnlyStrings( settings.appPermissions ) === true )
             {
                 return settings.appPermissions;
             }
             else
             {
                 throw "MS Adjunct: The setting 'appPermission' must be an array of strings."
             }
         }
         // Set default value.
         else
         {
             return [ 'openid', 'profile' ];
         }
     }

    /**
     * Returns a valid set of graph permission scopes to be used when making Graph API calls.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { string } - Validated graphPermissions setting.
     */
     private static getGraphPermissions( settings : Settings ) : string []
     {
         if ( typeof settings.graphPermissions !== "undefined" && typeof settings.graphPermissions === "object" )
         {
             if ( Helpers.doesArrayContainOnlyStrings( settings.graphPermissions ) === true )
             {
                 return settings.graphPermissions;
             }
             else
             {
                 throw "MS Adjunct: The setting 'graphPermissions' must be an array of strings."
             }
         }
         // Set default value.
         else
         {
             return [];
         }
     }

    /**
     * Returns a validated version of the Microsoft Graph to be used when making Graph API calls.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { GraphVersion } - Validated graphVersion setting.
     */
     private static getGraphVersion( settings : Settings ) : GraphVersion
     {
         if ( typeof settings.graphVersion !== "undefined" )
         {
             if ( settings.graphVersion === GraphVersion.ONE || settings.graphVersion === GraphVersion.BETA )
             {
                return settings.graphVersion;
             }
             else
             {
                 throw "MS Adjunct: The setting 'graphVersion' is not a valid value."
             }
         }
         // Set default value.
         else
         {
             return GraphVersion.CURRENT;
         }
     }

    /**
     * Returns a validated httpsCookies setting which forces cookies to only be transferred over HTTPS.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { boolean } - Validated httpsCookies setting.
     */
     private static getHTTPSCookies( settings : Settings ) : boolean
     {
         if ( typeof settings.httpsCookies !== "undefined" )
         {
             if ( typeof settings.httpsCookies === "boolean" )
             {
                return settings.httpsCookies;
             }
             else
             {
                 throw "MS Adjunct: The setting 'httpsCookies' must be either a true or false boolean value."
             }
         }
         // Set default value.
         else
         {
             return false;
         }
     }

    /**
     * Returns a validated allowCookies setting used for MS Adjunct and MSAL authentication browser storage.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { boolean } - Validated allowCookies setting.
     */
     private static getAllowCookies( settings : Settings ) : boolean
     {
         if ( typeof settings.allowCookies !== "undefined" )
         {
             if ( typeof settings.allowCookies === "boolean" )
             {
                return settings.allowCookies;
             }
             else
             {
                 throw "MS Adjunct: The setting 'allowCookies' must be either a true or false boolean value."
             }
         }
         // Set default value.
         else
         {
             return false;
         }
     }

    /**
     * Returns a validated signInMethod setting which determines how users are signed in.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { SignInMethod } - Validated signInMethod setting.
     */
     private static getSignInMethod( settings : Settings ) : SignInMethod
     {
         if ( typeof settings.signInMethod !== "undefined" )
         {
             if ( settings.signInMethod === SignInMethod.POPUP || settings.signInMethod === SignInMethod.REDIRECT )
             {
                if ( settings.signInMethod === SignInMethod.REDIRECT && ( typeof settings.signInUrl === "undefined" || settings.signInUrl === "" ) )
                {
                    throw "MS Adjunct: The setting 'signInMethod' cannot be set to REDIRECT without providing a redirect URL (signInUrl)."
                }
                else
                {
                    return settings.signInMethod;
                }
             }
             else
             {
                 throw "MS Adjunct: The setting 'signInMethod' is not a valid setting."
             }
         }
         // Set default value.
         else
         {
             return SignInMethod.POPUP;
         }
     }

    /**
     * Returns a validated signInPersistance setting used for MS Adjunct and MSAL authentication browser storage.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { SignInPersistance } - Validated signInPersistance setting.
     */
     private static getSignInPersistance( settings : Settings ) : SignInPersistance
     {
         if ( typeof settings.signInPersistance !== "undefined" )
         {
             if ( settings.signInPersistance === SignInPersistance.REMEMBER || settings.signInPersistance === SignInPersistance.SESSION )
             {
                return settings.signInPersistance;
             }
             else
             {
                 throw "MS Adjunct: The setting 'signInPersistance' is not a valid setting."
             }
         }
         // Set default value.
         else
         {
             return SignInPersistance.REMEMBER;
         }
     }

    /**
     * Returns a valid signInUrl or undefined.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { string } - Validated signInUrl setting.
     */
     private static getSignInUrl( settings : Settings ) : string | undefined
     {
         if ( typeof settings.signInUrl === "undefined" || typeof settings.signInUrl === "string" )
         {
             return settings.signInUrl;
         }
         else
         {
             throw "MS Adjunct: The setting 'signInUrl' must be either a string or undefined."
         }
     }

    /**
     * Returns a valid signOutUrl or undefined.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { string } - Validated signOutUrl setting.
     */
     private static getSignOutUrl( settings : Settings ) : string | undefined
     {
         if ( typeof settings.signOutUrl === "undefined" || typeof settings.signOutUrl === "string" )
         {
             return settings.signOutUrl;
         }
         else
         {
             throw "MS Adjunct: The setting 'signOutUrl' must be either a string or undefined."
         }
     }

    /**
     * Returns a valid msalConfig or undefined.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { string } - Validated msalConfig setting.
     */
     private static getMSALConfig( settings : Settings ) : Configuration | undefined
     {
         if ( typeof settings.msalConfig !== "undefined" || settings.msalConfig !== "object")
         {
             return settings.msalConfig;
         }
         else
         {
             throw "MS Adjunct: The setting 'msalConfig' must be either a string of type Configuration (@msal-browser) or undefined."
         }
     }

    /**
     * Returns a valid signInMultipleAccountsCallBack setting.
     * 
     * @param { Settings } settings - Raw collection of MS Adjunct settings.
     * @returns { ( accountChoices : AccountInfo [] ) => AccountInfo } - Validated signInMultipleAccountsCallBack setting.
     */
     private static getSignInMultipleAccountsCallBack( settings : Settings ) : ( accountChoices : AccountInfo [] ) => AccountInfo
     {
         if ( typeof settings.signInMultipleAccountsCallBack !== "undefined" )
         {
             if ( typeof settings.signInMultipleAccountsCallBack === "function" )
             {
                 return settings.signInMultipleAccountsCallBack;
             }
             else
             {
                throw "MS Adjunct: The setting 'signInMultipleAccountsCallBack' must be a function callback."
             }
         }
         // Set default value.
         else
         {
             return ( accountChoices : AccountInfo[] ) : AccountInfo => { return accountChoices[0]; }
         }
     }

    /**
     * Returns a valid authority URL used for Microsoft Identity login.
     * 
     * @param { Settings } verifiedSettings - Validated settings object.
     * @returns { string } - Validated authority URL.
     */
     private static getAuthority( settings : Settings, verifiedSettings : Settings ) : string
     {
         if ( typeof settings.authority !== 'undefined' )
         {
             if ( typeof settings.authority === 'string' )
             {
                return settings.authority;
             }
             else
             {
                throw "MS Adjunct: The setting 'authority' must be either a string or undefined."
             }
         }
         else
         {
             // Set a default value.
            if ( typeof verifiedSettings.tenantId === "undefined" )
            {
                return URL.MS_AUTHORITY_COMMON;
            }
            // Create an authority based on the tenant ID.
            else
            {
                return `${ URL.MS_AUTHORITY }/${ verifiedSettings.tenantId }/`;
            }
         }
     }

    /**
     * Returns a instantiated object of the class PublicClientApplication from @msal-browser used for authentication and getting tokens.
     * 
     * @param { Configuration } configuration - Verified MSAL configuration object.
     * @returns { PublicClientApplication } - Instantiated PublicClientApplication object.
     */
    private static getMSALClient( settings : Settings, verifiedSettings : Settings ) : PublicClientApplication
    {
        if ( typeof settings.msalClient !== "undefined" )
        {
            if ( typeof settings.msalClient === 'object' )
            {
                return settings.msalClient;
            }
            else
            {
                throw "MS Adjunct: The setting 'msalClient' is not a valid instance of PublicClientApplication (@msal-browser)."
            }
        }
        else
        {
            // Create a PublicClientApplication object from verified app msalConfig setting.
            if ( typeof verifiedSettings.msalConfig !== 'undefined' )
            {
                return new PublicClientApplication( verifiedSettings.msalConfig );
            }
            // Create a PublicClientApplication object from verified settings.
            else
            {
                return new PublicClientApplication
                ({
                    auth   :
                    {
                        clientId    : verifiedSettings.clientId!,
                        authority   : verifiedSettings.authority,
                        redirectUri : verifiedSettings.signInUrl
                    },
                    cache  :
                    {
                        cacheLocation          : verifiedSettings.signInPersistance,
                        storeAuthStateInCookie : verifiedSettings.allowCookies,
                        secureCookies          : verifiedSettings.httpsCookies
                    }
                });
            }
        }
    }
     
}
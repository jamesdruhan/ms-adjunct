/**
 * @file Manages the validation and creation of a Adjunct context object based on settings.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { Helpers } from "../utility/Helpers";
import { SettingErrorMessage } from "../error/SettingError";
import { GraphVersion, SignInMethod, SignInPersistance, URL } from "../utility/Constants";
import { PublicClientApplication } from "@azure/msal-browser";

import type { Settings } from "./Settings";
import type { Configuration, AccountInfo } from "@azure/msal-browser";

/**
 * Manages the validation and creation of a Adjunct context object based on settings.
 */
export class SettingManager
{
    /**
     * Builds a validated version of Settings object type based on the passed settings with defaults.
     * This will become the context used throughout the Adjunct Graph library.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { Settings } - Validated collection of Adjunct settings.
     */
    public static build ( settings : Settings ) : Settings
    {
        // Verified and compiled final settings Adjunct will use.
        const verifiedSettings : Settings =
        {
            clientId              : this.getClientId( settings ),
            tenantId              : this.getTenantId( settings ),
            authority             : undefined,
            appPermissions        : this.getAppPermissions( settings ),
            graphPermissions      : this.getGraphPermissions( settings ),
            graphVersion          : this.getGraphVersion( settings ),
            allowCookies          : this.getAllowCookies( settings ),
            httpsCookies          : this.getHTTPSCookies( settings ),
            signInMethod          : this.getSignInMethod( settings ),
            signInPersistance     : this.getSignInPersistance( settings ),
            authRedirectUrl       : this.getAuthRedirectUrl( settings ),
            signOutUrl            : this.getSignOutUrl( settings ),
            renewTokenRedirectUrl : this.getRenewTokenRedirectUrl( settings ),
            msalConfig            : this.getMSALConfig( settings ),
            msalClient            : undefined,
        
            signInMultipleAccountsCallBack : this.getSignInMultipleAccountsCallBack( settings )
        };

        // Generate or add the Microsoft Identity authority used for login.
        verifiedSettings.authority = this.getAuthority( settings, verifiedSettings );

        // Generate the MSAL client that will be used with Adjunct.
        verifiedSettings.msalClient = this.getMSALClient( settings, verifiedSettings );

        return verifiedSettings;
    }

    /**
     * Verifies the clientId is configured and returns it or generates an error.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { string } - Validated clientId setting.
     */
    private static getClientId ( settings : Settings ) : string
    {
        // clientId is not required if msalClient configuration data is present.
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
                throw SettingErrorMessage.clientIdMissing;
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
                throw SettingErrorMessage.authClientIdMissing;
            }
        }
    }

    /**
     * Returns a valid tenantId or undefined. Generates an error if necessary.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { string | undefined } - Validated tenantId setting.
     */
    private static getTenantId ( settings : Settings ) : string | undefined
    {
        if ( typeof settings.tenantId === "undefined" || typeof settings.tenantId === "string" )
        {
            return settings.tenantId;
        }
        else
        {
            throw SettingErrorMessage.tenantIdInvalid;
        }
    }

    /**
     * Returns a valid set of app permission scopes to be used when authenticating with Azure AD.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { string [] } - Validated appPermissions setting array.
     */
    private static getAppPermissions ( settings : Settings ) : string []
    {
        if ( typeof settings.appPermissions !== "undefined" && typeof settings.appPermissions === "object" )
        {
            if ( Helpers.doesArrayContainOnlyStrings( settings.appPermissions ) === true )
            {
                return settings.appPermissions;
            }
            else
            {
                throw SettingErrorMessage.appPermissionsInvalid;
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
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { string [] } - Validated graphPermissions setting.
     */
    private static getGraphPermissions ( settings : Settings ) : string []
    {
        if ( typeof settings.graphPermissions !== "undefined" && typeof settings.graphPermissions === "object" )
        {
            if ( Helpers.doesArrayContainOnlyStrings( settings.graphPermissions ) === true )
            {
                return settings.graphPermissions;
            }
            else
            {
                throw SettingErrorMessage.graphPermissionsInvalid;
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
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { GraphVersion } - Validated graphVersion setting.
     */
    private static getGraphVersion ( settings : Settings ) : GraphVersion
    {
        if ( typeof settings.graphVersion !== "undefined" )
        {
            if ( settings.graphVersion === GraphVersion.ONE || settings.graphVersion === GraphVersion.BETA )
            {
            return settings.graphVersion;
            }
            else
            {
                throw SettingErrorMessage.graphVersionInvalid;
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
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { boolean } - Validated httpsCookies setting.
     */
    private static getHTTPSCookies ( settings : Settings ) : boolean
    {
        if ( typeof settings.httpsCookies !== "undefined" )
        {
            if ( typeof settings.httpsCookies === "boolean" )
            {
            return settings.httpsCookies;
            }
            else
            {
                throw SettingErrorMessage.httpsCookiesInvalid;
            }
        }
        // Set default value.
        else
        {
            return false;
        }
    }

    /**
     * Returns a validated allowCookies setting used for Adjunct and MSAL authentication browser storage.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { boolean } - Validated allowCookies setting.
     */
    private static getAllowCookies ( settings : Settings ) : boolean
    {
        if ( typeof settings.allowCookies !== "undefined" )
        {
            if ( typeof settings.allowCookies === "boolean" )
            {
            return settings.allowCookies;
            }
            else
            {
                throw SettingErrorMessage.allowCookiesInvalid;
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
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { SignInMethod } - Validated signInMethod setting.
     */
    private static getSignInMethod ( settings : Settings ) : SignInMethod
    {
        if ( typeof settings.signInMethod !== "undefined" )
        {
            if ( settings.signInMethod === SignInMethod.POPUP || settings.signInMethod === SignInMethod.REDIRECT )
            {
            if ( settings.signInMethod === SignInMethod.REDIRECT && ( typeof settings.authRedirectUrl === "undefined" || settings.authRedirectUrl === "" ) )
            {
                throw SettingErrorMessage.signInMethodMissingRedirect;
            }
            else
            {
                return settings.signInMethod;
            }
            }
            else
            {
                throw SettingErrorMessage.signInMethodInvalid;
            }
        }
        // Set default value.
        else
        {
            return SignInMethod.POPUP;
        }
    }

    /**
     * Returns a validated signInPersistance setting used for Adjunct and MSAL authentication browser storage.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { SignInPersistance } - Validated signInPersistance setting.
     */
    private static getSignInPersistance ( settings : Settings ) : SignInPersistance
    {
        if ( typeof settings.signInPersistance !== "undefined" )
        {
            if ( settings.signInPersistance === SignInPersistance.REMEMBER || settings.signInPersistance === SignInPersistance.SESSION )
            {
            return settings.signInPersistance;
            }
            else
            {
                throw SettingErrorMessage.signInPersistanceInvalid;
            }
        }
        // Set default value.
        else
        {
            return SignInPersistance.REMEMBER;
        }
    }

    /**
     * Returns a valid authRedirectUrl or undefined.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { string } - Validated authRedirectUrl setting.
     */
    private static getAuthRedirectUrl ( settings : Settings ) : string
    {
        if ( typeof settings.authRedirectUrl === "string" )
        {
            return settings.authRedirectUrl;
        }
        else
        {
            throw SettingErrorMessage.authRedirectUrlInvalid;
        }
    }

    /**
     * Returns a valid signOutUrl or undefined.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { string | undefined } - Validated signOutUrl setting.
     */
    private static getSignOutUrl ( settings : Settings ) : string | undefined
    {
        if ( typeof settings.signOutUrl === "undefined" || typeof settings.signOutUrl === "string" )
        {
            return settings.signOutUrl;
        }
        else
        {
            throw SettingErrorMessage.signOutUrlInvalid;
        }
    }

    /**
     * Returns a valid renewTokenRedirectUrl.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { string } - Validated authRedirectUrl setting.
     */
    private static getRenewTokenRedirectUrl ( settings : Settings ) : string
    {
        if ( typeof settings.renewTokenRedirectUrl === "undefined" || typeof settings.renewTokenRedirectUrl === "string" )
        {
            return settings.renewTokenRedirectUrl;
        }
        else
        {
            throw SettingErrorMessage.renewTokenRedirectUrlInvalid;
        }
    }
    
    /**
     * Returns a valid msalConfig or undefined.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { Configuration | undefined } - Validated msalConfig setting.
     */
    private static getMSALConfig ( settings : Settings ) : Configuration | undefined
    {
        if ( typeof settings.msalConfig !== "undefined" || settings.msalConfig !== "object")
        {
            return settings.msalConfig;
        }
        else
        {
            throw SettingErrorMessage.msalConfigMissing;
        }
    }

    /**
     * Returns a valid signInMultipleAccountsCallBack setting.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @returns { ( accountChoices : AccountInfo [] ) => Promise <AccountInfo> } - Validated signInMultipleAccountsCallBack setting.
     */
    private static getSignInMultipleAccountsCallBack ( settings : Settings ) : ( accountChoices : AccountInfo [] ) => Promise <AccountInfo>
    {
        if ( typeof settings.signInMultipleAccountsCallBack !== "undefined" )
        {
            if ( typeof settings.signInMultipleAccountsCallBack === "function" )
            {
                return settings.signInMultipleAccountsCallBack;
            }
            else
            {
                throw SettingErrorMessage.signInMultipleAccountsCallbackInvalid;
            }
        }
        // Set default value.
        else
        {
            return ( accountChoices : AccountInfo [] ) : Promise <AccountInfo> =>
            {
                return new Promise( ( resolve ) =>
                {
                    resolve( accountChoices[0] );
                });
            }
        }
    }

    /**
     * Returns a valid authority URL used for Microsoft Identity login.
     * 
     * @param { Settings } settings - Raw collection of Adjunct settings.
     * @param { Settings } verifiedSettings - Validated settings object.
     * @returns { string } - Validated authority URL.
     */
    private static getAuthority ( settings : Settings, verifiedSettings : Settings ) : string
    {
        if ( typeof settings.authority !== 'undefined' )
        {
            if ( typeof settings.authority === 'string' )
            {
                return settings.authority;
            }
            else
            {
                throw SettingErrorMessage.authorityInvalid;
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
    private static getMSALClient ( settings : Settings, verifiedSettings : Settings ) : PublicClientApplication
    {
        if ( typeof settings.msalClient !== "undefined" )
        {
            if ( typeof settings.msalClient === 'object' )
            {
                return settings.msalClient;
            }
            else
            {
                throw SettingErrorMessage.msalClientInvalid;
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
                        redirectUri : verifiedSettings.authRedirectUrl
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
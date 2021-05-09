/**
 * @file Primary application class for ms-adjunct.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { IMSAdjunct } from "./IAppoint";
import { Configuration } from "../config/Configuration";
import { GraphVersion, LoginType, LoginPersistance } from "../utility/Utility";

import { PublicClientApplication } from "@azure/msal-browser";

export class Appoint implements IMSAdjunct
{
    // Configuration of the MSAdjunct object.
    protected config : Configuration;

    // Version of the Graph API to be used.
    protected graphVersion : GraphVersion;

    // Authentication method used to login a user: Redirect or Popup.
    protected loginType : LoginType;

    // List of Microsoft Identity scopes for the application.
    protected appScope : Array <string>;

    // List of Microsoft Graph scopes to be used on custom Graph API calls.
    protected graphScope : Array <string>;

    // Primary MSAL client object.
    protected msal : PublicClientApplication | null;

    /**
     * Constructor for the MSAdjunct used to instantiate the MSAdjunct object.
     * MSAL Configuration options: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
     */
    constructor ( configuration : Configuration )
    {
        // Set the configuration.
        this.config = configuration;

        // Set the version.
        this.graphVersion = this.config.graphVersion ?? GraphVersion.CURRENT;

        // Set the authentication method: Redirect or Popup.
        this.loginType = this.config.loginType ?? LoginType.POPUP;

        // Set the application scopes for Microsoft Identity.
        this.appScope = this.config.appScope ?? [ 'openid', 'profile' ];

        // Set the scopes when performing custom Graph API calls.
        this.graphScope = this.config.appScope ?? [];

        if ( typeof this.config.msalConfig === 'undefined' )
        {
            // Ensure the clientId option is provided when msalConfig is missing.
            if ( typeof this.config.clientId === 'undefined' )
            {
                throw "clientId is required when msalConfig is not set."
            }

            // Custom MSAL client initialization.
            this.msal = new PublicClientApplication
            ({
                auth   :
                {
					clientId    : this.config.clientId,
					authority   : this.config.authority ?? "https://login.microsoftonline.com/common",
					redirectUri : this.config.onSignInUri ?? 'undefined'
                },
                cache  :
                {
					cacheLocation          : this.config.loginPersistance ?? LoginPersistance.REMEMBER,
					storeAuthStateInCookie : this.config.ieSupport ?? true,
					secureCookies          : this.config.https ?? false
                }
            });
        }
        else
        {
            // MSAL client initialization with user specified PublicClientApplication.Configuration object.
            this.msal = new PublicClientApplication( this.config.msalConfig );
        }
    }
}
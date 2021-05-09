/**
 * @file Interface for Configuration object.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { GraphVersion, LoginType, LoginPersistance } from "../utility/Utility";
import { Configuration as MSALConfig } from "@azure/msal-browser";

export interface Configuration
{
    loginType?        : LoginType;
    graphVersion?     : GraphVersion;

    appScope?         : Array <string>;
    graphScope?       : Array <string>;

    // MSAL PublicClientApplication.Configuration:AuthOptions
    clientId?         : string;
    authority?        : string;
    onSignInUri?      : string;

    // MSAL PublicClientApplication.Configuration:CacheLocation
    loginPersistance? : LoginPersistance;
    ieSupport?        : boolean;
    https?            : boolean;

    // MSAL PublicClientApplication.Configuration
    // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
    msalConfig?       : MSALConfig;    
}
/**
 * @file Primary application class for ms-adjunct.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { IInitialize } from "./IInitialize";
import { Configuration } from "../config/Configuration";
import { GraphVersion, LoginType, LoginPersistance, URL } from "../utility/AppConstants";

import { PublicClientApplication } from "@azure/msal-browser";

export class Initialize implements IInitialize
{
    protected config : Configuration;

    constructor ( configuration : Configuration )
    {
        this.config = configuration;
    }

    createClient () : PublicClientApplication
    {
        if ( typeof this.config.msalConfig === 'undefined' )
        {
            // Ensure the clientId option is provided when msalConfig is missing.
            if ( typeof this.config.clientId === 'undefined' )
            {
                throw "clientId is required when configuration option msalConfig is not set."
            }

            // Custom MSAL client initialization.
            return new PublicClientApplication
            ({
                auth   :
                {
					clientId    : this.config.clientId,
					authority   : this.config.authority ?? URL.MS_AUTHORITY,
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
            return new PublicClientApplication( this.config.msalConfig );
        }
    }

    getGraphURL () : URL
    {
        if ( typeof this.config.graphVersion === 'undefined' )
        {
            return URL.GRAPH_CURRENT;
        }
        else
        {
            if ( this.config.graphVersion === GraphVersion.ONE )
            {
                return URL.GRAPH_ONE;
            }
            else if ( this.config.graphVersion === GraphVersion.BETA )
            {
                return URL.GRAPH_BETA;
            }
            else
            {
                return URL.GRAPH_CURRENT;
            }
        }
    }

    getLoginType () : LoginType
    {
        return this.config.loginType ?? LoginType.POPUP;
    }

    getAppScope () : Array <string>
    {
        return this.config.appScope ?? [ 'openid', 'profile' ];
    }

    getGraphScope () : Array <string>
    {
        return this.config.appScope ?? [];
    }
}
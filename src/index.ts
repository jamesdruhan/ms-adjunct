/**
 * @file Main input point for ms-adjunct module.
 * 
 * @author James Druhan
 * 
 * @license MIT
 * 
 * @module ms-adjunct
 */

import { Initialize } from "./config/Initialize";
import { Configuration } from "./config/Configuration";
import { LoginType, URL } from "./utility/AppConstants";
import { PublicClientApplication } from "@azure/msal-browser";

// Graph URL to be used for Graph requests.
let graphURL : URL;

// Authentication method used to login a user: Redirect or Popup.
let loginType : LoginType;

// List of Microsoft Identity scopes for the application.
let appScope : Array <string>;

// List of Microsoft Graph scopes to be used on custom Graph API calls.
let graphScope : Array <string>;

// Primary MSAL client object.
let msalClient : PublicClientApplication | null;

function Appoint ( configuration : Configuration ) : void
{
    const init : Initialize = new Initialize( configuration );

    graphURL   = init.getGraphURL();
    loginType  = init.getLoginType();
    appScope   = init.getAppScope();
    graphScope = init.getGraphScope();
    msalClient = init.createClient();
}

export { Appoint };

export { Configuration } from "./config/Configuration";
export { LoginType, GraphVersion, LoginPersistance } from "./utility/AppConstants";
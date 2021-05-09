/**
 * @file Primary application class for ms-adjunct.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { IMSAdjunct } from "./IMSAdjunct";
import { Configuration } from "../config/Configuration";
import { Version, AuthType } from "../graph/Utility";

import { PublicClientApplication } from "@azure/msal-browser";

export class MSAdjunct implements IMSAdjunct
{
    // Configuration of the MSAdjunct object.
    protected config : Configuration;

    // Version of the Graph API to be used.
    protected version : Version;

    // Authentication method used to login a user: Redirect or Popup.
    protected authType : AuthType;

    // Primary MSAL client object.
    protected msal : PublicClientApplication;

    /**
     * Constructor for the MSAdjunct used to instantiate the MSAdjunct object.
     */
    constructor ( configuration : Configuration )
    {
        // Set the configuration.
        this.config = configuration;

        //Initialize a new MSAL object using the Public Client. Only the appropriate parameters are shipped. 
        this.msal = new PublicClientApplication
        ({
            auth   : this.config.auth,
            cache  : this.config.cache,
            system : this.config.system
        });

        // Set the version.
        this.version = this.config.graphVersion ?? Version.CURRENT;

        // Set the authentication method: Redirect or Popup.
        this.authType = this.config.authType ?? AuthType.POPUP;
    }
}
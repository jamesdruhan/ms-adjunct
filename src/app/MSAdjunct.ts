/**
 * @file Primary application class for ms-adjunct.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { IMSAdjunct } from "./IMSAdjunct";
import { Configuration } from "../config/Configuration";
import { Version } from "../graph/Utility";

import { PublicClientApplication } from "@azure/msal-browser";

export class MSAdjunct implements IMSAdjunct
{
    // Configuration of the MSAdjunct object.
    protected config : Configuration;

    // Version of the Graph API to be used.
    protected version : Version;

    // Primary MSAL client object.
    protected msal : PublicClientApplication;

    /**
     * Constructor for the MSAdjunct used to instantiate the MSAdjunct object.
     * 
     * @class MSAdjunct
     * @implements { IMSAdjunct }
     * 
     * @example
     * const msAdjunct : MSAdjunct = new MSAdjunct( config );
     *
     * @param { Object } configuration - Config object used to initialize the MSAdjunct class.
     */
    constructor ( configuration : Configuration )
    {
        // Set the configuration.
        this.config = configuration;

        //Initalize a new MSAL object using the Public Client. Only the appropriate parameters are shipped. 
        this.msal = new PublicClientApplication
        ({
            auth   : this.config.auth,
            cache  : this.config.cache,
            system : this.config.system
        });

        // Set the version.
        this.version = this.config.graphVersion ?? Version.CURRENT;
    }
}
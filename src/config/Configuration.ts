/**
 * @file Interface for Configuration object.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { Version, AuthType } from "../graph/Utility";
import { Configuration as MSALConfig } from "@azure/msal-browser";

export interface Configuration extends MSALConfig
{
    authType?     : AuthType,
    graphVersion? : Version,
    appScope?     : Array <string>,
    graphScope?   : Array <string>
}
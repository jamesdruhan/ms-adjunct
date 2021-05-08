/**
 * @file Interface for Configuration object.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { Version } from "../graph/Utility";
import { Configuration as MSALConfig } from "@azure/msal-browser";

export interface Configuration extends MSALConfig
{
    graphVersion? : Version,
}
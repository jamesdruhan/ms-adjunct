/**
 * @file Interface for MSAdjunct class.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

import { LoginType, URL } from "../utility/Utility";
import { PublicClientApplication } from "@azure/msal-browser";

export interface IInitialize
{
    createClient ()  : PublicClientApplication;
    getGraphURL ()   : URL;
    getLoginType ()  : LoginType;
    getAppScope ()   : Array <string>;
    getGraphScope () : Array <string>;
}
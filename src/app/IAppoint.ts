/**
 * @file Interface for Appoint class.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { Graph } from "../graph/Graph";
import { TokenType, PhotoSizeM365 } from "../utility/Constants";

import type { User } from "../types/User";
import type { AuthenticationResult } from "@azure/msal-browser";

 /**
 * @interface Interface for IAppoint class.
 */
export interface IAppoint
{
    userInfo?  : User;
    userPhoto? : string;
    graph      : Graph;

    signIn ()                                                                              : Promise <void>;
    signOut ()                                                                             : Promise <void>;
    setUserProfile ()                                                                      : Promise <void>;
    isUserLoggedIn ()                                                                      : boolean;
    getToken ( tokenType : TokenType, forceLogin : boolean )                               : Promise <AuthenticationResult>;
    getUserProfile ( userId? : string, relationship? : string, queryParameters? : string ) : Promise <any>;
    getUserPhoto ( userId? : string, size? : PhotoSizeM365 )                               : Promise <any>;
}
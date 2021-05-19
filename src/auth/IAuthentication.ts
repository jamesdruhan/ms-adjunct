/**
 * @file Interface for Authentication class.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import type { TokenType } from "../utility/Constants";
import type { AuthenticationResult } from "@azure/msal-browser";

/**
 * @interface Interface for Authentication class.
 */
 export interface IAuthentication
 {
     login ()                        : Promise <AuthenticationResult>;
     logout ()                       : Promise <void>;
     isUserLoggedIn ()               : boolean;
     getToken ( TokenType, boolean ) : Promise <AuthenticationResult>
 }
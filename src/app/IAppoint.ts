/**
 * @file Interface for Appoint class.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { AccountInfo } from "@azure/msal-browser";

 /**
 * @interface Interface for IAppoint class.
 */
export interface IAppoint
{
    isUserLoggedIn () : boolean;
    signIn ()         : Promise <AccountInfo | null>;
    signOut ()        : Promise <void>;
}
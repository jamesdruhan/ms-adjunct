/**
 * @file Collection constants used in MS Adjunct.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * Indicates the version portion of a Graph request URL.
 * 
 * @readonly
 * @enum { string }
 */
export enum GraphVersion
{
    CURRENT = "v1.0",
    ONE     = "v1.0",
    BETA    = "beta"
}

/**
 * Represents the authentication method used for user sign-in: Redirect or Popup.
 * 
 * @readonly
 * @enum { string }
 */
 export enum SignInMethod
 {
     REDIRECT = "redirect",
     POPUP    = "popup"
 }

 /**
 * Indicates the storage type for login token and session data.
 * 
 * @readonly
 * @enum { string }
 */
  export enum SignInPersistance
  {
      SESSION  = "sessionStorage",
      REMEMBER = "localStorage"
  }

 /**
 * List of  URLs related to Microsoft Identity and Graph APIs.
 * 
 * @readonly
 * @enum { string }
 */
export enum URL
{
    MS_AUTHORITY        = "https://login.microsoftonline.com",
    MS_AUTHORITY_COMMON = "https://login.microsoftonline.com/common",
    GRAPH_CURRENT       = "https://graph.microsoft.com/v1.0",
    GRAPH_ONE           = "https://graph.microsoft.com/v1.0",
    GRAPH_BETA          = "https://graph.microsoft.com/beta"
}

 /**
 * List of MS Adjunct specific browser storage keys.
 * 
 * @readonly
 * @enum { string }
 */
  export enum AdjunctStorageKey
  {
      MS_ADJUNCT_ACCOUNT_HOMEACCOUNTID = "msAdjunct.Account.homeAccountId"
  }
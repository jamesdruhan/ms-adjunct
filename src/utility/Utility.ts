/**
 * @file Graph utility ENUM types.
 * 
 * @author James Druhan
 * 
 * @license MIT
 */

/**
 * Microsoft Graph version. Value indicates the version portion of a Graph request URL.
 * 
 * @readonly
 * 
 * @enum { string }
 */
export enum GraphVersion
{
    CURRENT = "v1.0",
    ONE     = "v1.0",
    BETA    = "beta"
}

/**
 * Represents the authentication method used for user login: Redirect or Popup.
 * 
 * @readonly
 * 
 * @enum { string }
 */
 export enum LoginType
 {
     REDIRECT = "redirect",
     POPUP    = "popup"
 }

 /**
 * Indicates the storage type for login token and session data.
 * 
 * @readonly
 * 
 * @enum { string }
 */
  export enum LoginPersistance
  {
      FORGET   = "sessionStorage",
      REMEMBER = "localStorage"
  }
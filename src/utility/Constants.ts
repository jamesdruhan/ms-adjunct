/**
 * @file Collection of named constants used throughout Adjunct Graph.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * Version choice of Microsoft Graph.
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
 * Browser sign in method choice for Adjunct Graph.
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
 * Browser storage choice for Adjunct Graph.
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
 * Microsoft Identity / Graph URL choice.
 * 
 * @readonly
 * @enum { string }
 */
export enum URL
{
    MS_AUTHORITY        = "https://login.microsoftonline.com",
    MS_AUTHORITY_COMMON = "https://login.microsoftonline.com/common",
    GRAPH_API_BASE      = "https://graph.microsoft.com",
}

 /**
 * Browser storage key for Adjunct Graph.
 * 
 * @readonly
 * @enum { string }
 */
export enum AdjunctStorageKey
{
    ADJUNCT_ACCOUNT_HOMEACCOUNTID = "msAdjunct.Account.homeAccountId",
    ADJUNCT_ACCOUNT_ROLES         = "msAdjunct.Account.Roles",
    ADJUNCT_TOKEN_LOGIN_REQUIRED  = "msAdjunct.Token.Login_Required"
}

/**
 * Adjunct supported fetch API method.
 * 
 * @readonly
 * @enum { string }
 */
export enum FetchMethod
{
    GET  = "GET",
    POST = "POST"
}

/**
 * Access token system choice.
 * 
 * @readonly
 * @enum { string }
 */
export enum TokenType
{
    APP   = "app",
    GRAPH = "graph"
}

/**
 * Microsoft Identity & Graph error code.
 * 
 * @readonly
 * @enum { string }
 */
export enum GraphErrorCode
{
    MISSING_PERMISSION  = "invalid_grant",
    EXPIRED_TOKEN       = "interaction_required",
    REQUEST_DENIED      = "Authorization_RequestDenied",
    ACCESS_DENIED       = "accessDenied",
    ERROR_ACCESS_DENIED = "ErrorAccessDenied"
}

/**
 * Microsoft Graph user photo choice.
 * 
 * @readonly
 * @enum { string }
 */
 export enum PhotoSizeM365
 {
     XXXSMALL = "48x48",
     XXSMALL  = "64x64",
     XSMALL   = "96x96",
     SMALL    = "120x120",
     MEDIUM   = "240x240",
     LARGE    = "360x360",
     XLarge   = "432x432",
     XXLarge  = "504x504",
     XXXLarge = "648x648"
 }
/**
 * @file Defines errors related to Authentication.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * AuthenticationErrorMessage object containing error messages related to authentication.
 */
export const AuthenticationErrorMessage =
{
    signInMethodUnknown :
    {
        code : "auth_signInMethod_unknown",
        desc : "The configured signInMethod is unknown. Login attempt failed."
    },
    signInErrorUnknown :
    {
        code : "auth_signIn_error_unknown",
        desc : "An unknown error occurred during login."
    },
    getTokenMissingPermissionScope :
    {
        code : "auth_getToken_missing_permission_scope",
        desc : "Attempted to get an access token with permission scopes that were not granted by Azure AD."
    },
    getTokenAuthenticationRequired :
    {
        code : "auth_getToken_authentication_required",
        desc : "Attempted to get an access token but the logged in user is no longer authenticated with Azure AD."
    },
    getTokenNotLoggedIn :
    {
        code : "auth_getToken_not_logged_in",
        desc : "Attempted to get an access token but the user needs to re-authenticate with Azure AD."
    },
    forceGetToken :
    {
        code : "auth_signInMethod_unknown",
        desc : "The configured signInMethod is unknown. Login attempt failed."
    },
    processLoginMultipleAccountError :
    {
        code : "auth_multiple_account_error",
        desc : "Multiple accounts were returned from Azure AD. One needed to be selected, but it wasn't. The signInMultipleAccountsCallBack setting is not setup correctly."
    },
    processLoginNoAccounts :
    {
        code : "auth_no_accounts",
        desc : "Login was successful but somehow no accounts were returned from Azure AD."
    }
};
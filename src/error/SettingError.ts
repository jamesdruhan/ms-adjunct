/**
 * @file Defines errors related to Settings.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * SettingErrorMessage object containing error messages related to settings.
 */
export const SettingErrorMessage =
{
    clientIdMissing :
    {
        code : "setting_clientId_missing",
        desc : "Invalid configuration settings for Adjunct. Unless the MSAL settings are configured, a clientId is required."
    },
    authClientIdMissing :
    {
        code : "setting_clientId_auth_missing",
        desc : "Invalid configuration settings for Adjunct. The clientId specified in msalConfig.auth is required or incorrectly defined."
    },
    tenantIdInvalid :
    {
        code : "setting_tenant_missing",
        desc : "Invalid configuration settings for Adjunct. The tenantId setting must a string or undefined."
    },
    appPermissionsInvalid :
    {
        code : "setting_appPermissions_invalid",
        desc : "Invalid configuration settings for Adjunct. The appPermissions setting must be an array of strings."
    },
    graphPermissionsInvalid :
    {
        code : "setting_graphPermissions_invalid",
        desc : "Invalid configuration settings for Adjunct. The graphPermissions setting must be an array of strings."
    },
    graphVersionInvalid :
    {
        code : "setting_graphVersion_invalid",
        desc : "Invalid configuration settings for Adjunct. The graphVersion setting is not a supported value."
    },
    httpsCookiesInvalid :
    {
        code : "setting_httpsCookies_invalid",
        desc : "Invalid configuration settings for Adjunct. The httpsCookies setting is not a supported value."
    },
    allowCookiesInvalid :
    {
        code : "setting_allowCookies_invalid",
        desc : "Invalid configuration settings for Adjunct. The allowCookies setting is not a supported value."
    },
    signInMethodInvalid :
    {
        code : "setting_signInMethod_invalid",
        desc : "Invalid configuration settings for Adjunct. The signInMethod setting is not a supported value."
    },
    signInMethodMissingRedirect :
    {
        code : "setting_signInMethod_missing_redirect",
        desc : "Invalid configuration settings for Adjunct. The setting signInMethod cannot be set to REDIRECT without providing a redirect URL (authRedirectUrl)."
    },
    signInPersistanceInvalid :
    {
        code : "setting_signInPersistance_invalid",
        desc : "Invalid configuration settings for Adjunct. The signInPersistance setting is not a supported value."
    },
    authRedirectUrlInvalid :
    {
        code : "setting_authRedirectUrl_invalid",
        desc : "Invalid configuration settings for Adjunct. The authRedirectUrl setting is missing or incorrectly defined."
    },
    signOutUrlInvalid :
    {
        code : "setting_signOutUrl_invalid",
        desc : "Invalid configuration settings for Adjunct. The signOutUrl setting is missing or incorrectly defined."
    },
    renewTokenRedirectUrlInvalid :
    {
        code : "setting_renewTokenRedirectUrl_invalid",
        desc : "Invalid configuration settings for Adjunct. The renewTokenRedirectUrl is missing or incorrectly defined."
    },
    msalConfigMissing :
    {
        code : "setting_msalConfig_missing",
        desc : "Invalid configuration settings for Adjunct. The msalConfig setting must be a object of type Configuration from @msal-browser or undefined."
    },
    signInMultipleAccountsCallbackInvalid :
    {
        code : "setting_signInMultipleAccountsCallback_invalid",
        desc : "Invalid configuration settings for Adjunct. The signInMultipleAccountsCallBack setting must be a callback to returns a promise."
    },
    authorityInvalid :
    {
        code : "setting_authority_invalid",
        desc : "Invalid configuration settings for Adjunct. The authority setting is not correctly defined."
    },
    msalClientInvalid :
    {
        code : "setting_msalClient_invalid",
        desc : "Invalid configuration settings for Adjunct. The msalClient setting is not a valid instance of PublicClientApplication (@msal-browser)."
    }
};
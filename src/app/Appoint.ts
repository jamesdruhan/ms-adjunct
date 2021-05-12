/**
 * @file Configures and provides all functionality of MS Adjunct.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { IAppoint } from "./IAppoint";
import { SettingManager } from "../config/SettingManager";
import { Settings } from "../config/Settings";
import { Authentication } from "../auth/Authentication";
import { AccountInfo } from "@azure/msal-browser";

/**
 * Class which configures and provides all functionality of MS Adjunct.
 * 
 * @implements { IAppoint }
 */
export class Appoint implements IAppoint
{
    /**
     * Settings object which contains all necessary data to execute MS Adjunct commands.
     * 
     * @type { Settings }
     */
    protected context : Settings;

    /**
     * Auth object for managing authentication tasks.
     * 
     * @type { Authentication }
     */
    protected auth : Authentication;

    /**
     * @class Create a new instance of the Appoint class.
     * @constructs Appoint
     * 
     * @example
     * const msAdjunct : Appoint = new Appoint( appSettings );
     * 
     * @param { Settings } settings - MS Adjunct settings object.
     * @returns { BrowserStorage } - Object of the Appoint class.
     */
    constructor ( settings : Settings )
    {
        this.context = SettingManager.build( settings );
        this.auth    = new Authentication( this.context );
    }

    /**
     * Checks if the user is logged in (true) or not (false).
     * Note: This does not guarantee the login is still valid on Azure AD.
     * 
     * @returns { boolean } - Indicates if user is logged in or not.
     */
    public isUserLoggedIn () : boolean
    {
        return this.auth.isUserLoggedIn();
    }

    /**
     * Prompt the user to sign-in (if not already logged in).
     * 
     * @throws When signInMethod is set to POPUP, promise will reject with error if user closes the popup login form without actually logging in.
     * @returns { (Promise <AccountInfo | null>) } - Promise with resolve parameter of a @msal-browser AccountInfo object if logged in (null otherwise).
     */
    public signIn () : Promise <AccountInfo | null>
    {
        return this.auth.login();
    }

    /**
     * Signs the currently logged in user out and clears their browser cache of MS Adjunct data.
     * 
     * @returns { (Promise <void>) } - Promise with no resolve parameter.
     */
    public signOut () : Promise <void>
    {
        return this.auth.logout();
    }
}
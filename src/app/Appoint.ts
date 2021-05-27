/**
 * @file Appoints an adjunct which provides the features and functions to authenticate and perform requests on the Microsoft Graph.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { IAppoint } from "./IAppoint";
import { SettingManager } from "../config/SettingManager";
import { Authentication } from "../auth/Authentication";
import { BrowserStorage } from "../storage/BrowserStorage";
import { Graph } from "../graph/Graph";
import { Helpers } from "../utility/Helpers";
import { AppointErrorMessage} from "../error/AppointError";
import { AdjunctStorageKey, TokenType, PhotoSizeM365 } from "../utility/Constants";

import type { Settings } from "../config/Settings";
import type { User } from "../types/User";
import type { BatchRequest } from "../types/BatchRequest";
import type { AuthenticationResult } from "@azure/msal-browser";

/**
 * Class which provides the features and functions to authenticate and perform requests on the Microsoft Graph..
 * 
 * @implements { IAppoint }
 */
export class Appoint implements IAppoint
{
    /**
     * User object that contains details of the logged in user.
     * 
     * @type { User }
     */
    public userInfo? : User;

    /**
     * Array of user roles assigned in Azure AD.
     * 
     * Note: User roles are established only immediately after a successful login. If a users 
     * role changes, they will need to log out then in for that change to be reflected.
     * 
     * @type { string [] }
     */
    public userRoles : string [];

    /**
     * Base64 code of the users M365 photo.
     * 
     * @type { string }
     */
    public userPhoto? : string;

    /**
     * Graph object for managing MS Graph API calls.
     * 
     * @type { Graph }
     */
    public graph : Graph;

    /**
     * Settings object which contains all necessary data to authenticate with Microsoft Identity.
     * 
     * @type { Settings }
     */
    protected context : Settings;

    /**
     * Authentication object for managing authentication tasks.
     * 
     * @type { Authentication }
     */
    protected auth : Authentication;

    /**
     * BrowserStorage object for managing Adjunct stored data.
     * 
     * @type { Authentication }
     */
    protected browserStorage : BrowserStorage;

    /**
     * @class Create a new instance of the Appoint class.
     * @constructs Appoint
     * 
     * @example
     * const myAdjunct : Appoint = new Appoint( appSettings );
     * 
     * @param { Settings } settings - Adjunct settings object.
     * @returns { Appoint } - Object of the Appoint class.
     */
    constructor ( settings : Settings )
    {
        this.context        = SettingManager.build( settings );
        this.auth           = new Authentication( this.context );
        this.graph          = new Graph( this.context, this.auth );
        this.browserStorage = new BrowserStorage( this.context.signInPersistance! );
        this.userRoles      = [];
    }

    /**
     * Prompt the user to sign-in (if not already logged in). This method will also process
     * a successful sign-in action. You can call this method in your app on load to ensure 
     * a user is logged in before they can access your app content.
     * 
     * Note: The URL defined in the setting 'authRedirectUrl' must call this method on page load.
     * 
     * @returns { Promise <void> } - Promise with a void resolve parameter.
     */
    public async signIn () : Promise <void>
    {
        console.log("Test");
        try
        {
            // Login the user.
            await this.auth.login();

            // Set the users profile data.
            await this.setUserProfile();

            return Promise.resolve();
        }
        catch ( e : any )
        {
            return Promise.reject( e );
        }
    }

    /**
     * Signs the currently logged in user out and clears their browser cache of Adjunct data.
     * 
     * @returns { Promise <void> } - Promise with no resolve parameter.
     */
    public signOut () : Promise <void>
    {
        return this.auth.logout();
    }

    /**
     * Checks if the user is logged in (true) or not (false).
     * 
     * Note: This only checks locally in the app. This will not guarantee the user is still authenticated
     * with Microsoft Identity servers
     * 
     * @returns { boolean } - Indicates if user is logged in or not.
     */
    public isUserLoggedIn () : boolean
    {
        return this.auth.isUserLoggedIn();
    }
    
    /**
     * Requests a valid current access token object.
     *
     * @param { TokenType } tokenType - Indicates the type of request which sets up the corresponding scope settings.
     * @param { boolean } forceLogin - Indicates if login should be prompted to the user when the call is made but the user's access token is no longer valid.
     * @returns { Promise <AuthenticationResult> } - Promise the authentication object as the resolved value.
     */
    public getToken ( tokenType : TokenType = TokenType.GRAPH, forceLogin : boolean = false ) : Promise <AuthenticationResult>
    {
        if ( this.browserStorage.getItem( AdjunctStorageKey.ADJUNCT_TOKEN_LOGIN_REQUIRED ) === "no" )
        {
            return this.auth.getToken( tokenType, forceLogin );
        }
        
        return Promise.reject( AppointErrorMessage.notLoggedIn );
    }

    /**
     * Get user profile specific information from the MS Graph API.
     * 
     * Graph property choices: https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0#properties
     * Graph relationship choices: https://docs.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0#relationships
     * Graph parameter choices: https://docs.microsoft.com/en-us/graph/query-parameters
     * 
     * Note: If requesting a user deletes for someone other than the logged in user, your app needs at least User.Read.All permissions.
     * 
     * @param { string | undefined } userId - Optional parameter. Leave undefined to request the logged in users details. Set to users Id or userPrincipalName to get a specific user.
     * @param { string | undefined } relationship - Optional parameter. Leave undefined to request normal properties of the user object or set to a corresponding relationship.
     * @param { string | undefined } queryParameters - Optional parameter. Leave undefined to get default response from MS Graph or add parameters to narrow down response.
     * @returns { Promise <any> } - Returns a promise with the JSON object containing the resulting data.
     */
    public async getUserProfile ( userId? : string, relationship? : string, queryParameters? : string ) : Promise <any>
    {
        try
        {
            let endPoint = "";

            // Set the request endpoint component.
            if ( typeof userId === "undefined" )
            {
                endPoint = "/me";
            }
            else
            {
                endPoint = `/users/${ userId }`;
            }

            // Set the relationship endpoint component.
            if ( typeof relationship !== "undefined" )
            {
                endPoint += `/${ relationship }`;
            }

            // Set the optional parameter component.
            if ( typeof queryParameters !== "undefined" )
            {
                endPoint += `?${ queryParameters }`;
            }

            // Carry out the Graph request.
            return await this.graph.get( endPoint );
        }
        catch ( e : any )
        {
            return Promise.reject( e );
        }       
    }

    /**
     * Get user photo from the MS Graph API.
     * 
     * Graph Photo details: https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0
     * 
     * Note: If requesting a user photo for someone other than the logged in user, your app needs at least User.Read.All permissions.
     * 
     * @param { string | undefined } userId - Optional parameter. Leave undefined to request the logged in users details. Set to users Id or userPrincipalName to get a specific user.
     * @param { PhotoSizeM365 | undefined } size - Optional parameter. Leave undefined for full size or specify a size.
     * @returns { Promise <any> } - Returns a promise with the JSON object containing the resulting data.
     */
    public async getUserPhoto ( userId? : string, size? : PhotoSizeM365 ) : Promise <any>
    {
        try
        {
            let endPoint = "";

            // Set the request endpoint component.
            if ( typeof userId === "undefined" )
            {
                if ( typeof size === "undefined" )
                {
                    endPoint = "/me/photo";
                }
                else
                {
                    endPoint += `/me/photos/${ size }`;
                }
            }
            else
            {
                if ( typeof size === "undefined" )
                {
                    endPoint = `/users/${ userId }/photo`;
                }
                else
                {
                    endPoint += `/users/${ userId }/photos/${ size }`;
                }
            }

            // Carry out the Graph request.
            return await this.graph.get( endPoint );
        }
        catch ( e : any )
        {
            return Promise.reject( e );
        }       
    }

    /**
     * Gets and sets the logged in users data to a property called userInfo on the Appoint object.
     * This method is executed automatically when the login() method is used and the graphPermissions
     * setting has appropriate scopes which allow access to user profile data such as 'User.Read'.
     * 
     * @returns { Promise <void> } - A void promise.
     */
    public async setUserProfile() : Promise <void>
    {
        // Defines the scope permissions needed for this action.
        const scopesUserProfile = ["User.Read", "User.ReadWrite", "User.Read.All", "User.ReadWrite.All", "Directory.Read.All", "Directory.ReadWrite.All", "Directory.AccessAsUser.All"];

        // Check if the required Graph access exists before pulling user profile data.
        if ( Helpers.includesScope( scopesUserProfile, this.context.graphPermissions! ) === true )
        {
            const batchRequest : BatchRequest = 
            {
                requests :
                [
                    {
                        id     : "1",
                        method : "GET",
                        url    : "/me?$select=id,employeeId,displayName,givenName,surname,userPrincipalName,mail,businessPhones,mobilePhone,faxNumber,jobTitle,preferredLanguage,officeLocation,streetAddress,city,companyName,state,postalCode,country,department"
                    },
                    {
                        id     : "2",
                        method : "GET",
                        url    : "/me/photo/$value",
                        headers :
                        {
                            "Content-Type" : "image/jpg"
                        }
                    }
                ]
            };

            // Get app roles (if any).
            const userRoles : string | null = this.browserStorage.getItem( AdjunctStorageKey.ADJUNCT_ACCOUNT_ROLES );

            if ( userRoles !== null )
            {
                this.userRoles = JSON.parse( userRoles );
            }

            try
            {
                // Carry out the Graph requests.
                const batchResult : any = await this.graph.batch( batchRequest, false );

                batchResult.responses.forEach ( ( result : any ) =>
                {
                    // Save the user data.
                    if ( result.id === "1" && result.status === 200 )
                    {
                        this.userInfo = result.body;
                    }

                    // Save the base64 code of the image to a variable.
                    if ( result.id === "2" && result.status === 200 )
                    {
                        this.userPhoto = result.body;
                    }
                });
            }
            catch ( e : any )
            {
                return Promise.reject( e );
            }
        }

        return Promise.resolve();
    }
}

export { Settings } from "../config/Settings";
export { SignInMethod, GraphVersion, SignInPersistance, GraphErrorCode, TokenType, FetchMethod } from "../utility/Constants";
/**
 * @file Manages Microsoft Graph communication.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { IGraph } from "./IGraph";
import { Authentication } from "../auth/Authentication";
import { GraphErrorMessage } from "../error/GraphError";
import { FetchMethod, URL, TokenType, GraphErrorCode } from "../utility/Constants";

import type { Settings } from "../config/Settings";
import type { BatchRequest } from "../types/BatchRequest";
import type { AuthenticationResult } from "@azure/msal-common";

/**
 * Manages Microsoft Graph communication.
 * 
 * @implements { IGraph }
 */
export class Graph implements IGraph
{
    /**
     * Adjunct Graph settings object containing validated Adjunct configuration data.
     * 
     * @type { Settings }
     */
    protected context : Settings;

    /**
     * Adjunct Authentication object used for obtaining access tokens.
     * 
     * @type { Authentication }
     */
    protected auth : Authentication;

    /**
     * @class Create a new instance of the Graph class.
     * @constructs Graph
     * 
     * @example
     * const adjunctGraph : Graph = new Graph( validatedContext );
     * 
     * @param { Settings } settings - Adjunct settings object of validated configuration data.
     * @param { Authentication } auth - Adjunct Authentication object used for obtaining access tokens.
     * @returns { Graph } - Object of the Graph class.
     */
    constructor ( context : Settings, auth : Authentication )
    {
        this.context = context;
        this.auth    = auth;
    }

    /**
     * Perform a simple GET call to the Microsoft Graph API. For a more advanced GET call which implements
     * headers and/or body options, please use the Graph.call() method. Use the 'forceLogin' parameter to trigger
     * a login process if the user is no longer authenticated with Microsoft Identity when the call is made.
     * The access token required for the request is generated automatically.
     * 
     * Note: See https://docs.microsoft.com/en-us/graph/permissions-reference for permission details.
     * 
     * @example
     * adjunct.graph.get( '/me' ); // { displayName : 'John Doe', mail : 'jdoe@mydomain.com', .... }
     * 
     * @param { string } endPoint - The end point URI to perform the Graph Get against.
     * @param { boolean } forceLogin - Indicates if login should be prompted to the user when the call is made but the user's access token is no longer valid.
     * @returns { Promise <any> } - Result of the API request.
     */
    public async get ( endPoint : string, forceLogin : boolean = false ) : Promise <any>
    {
        // Validate and build a proper Graph end point.
        const validEndPoint = this.getValidEndPoint( endPoint );

        // Create new header object for fetch request.
        const fetchHeaders : Headers = new Headers();

        // Set the content type in the header.
        fetchHeaders.append( "Content-Type", "application/json");

        // Create a new fetch request object.
        const fetchRequest : Request = new Request( validEndPoint,
        {
            method  : FetchMethod.GET,
            headers : fetchHeaders
        });

        return await this.call( fetchRequest, forceLogin );
    }

    /**
     * Performs a BATCH call to the Microsoft Graph API, allowing you to perform multiple actions. This includes
     * GET, POST, PATCH, etc. as defined in the BatchRequest object. Use the 'forceLogin' parameter to trigger
     * a login process if the user is no longer authenticated with Microsoft Identity when the call is made. The
     * access token required for the request is generated automatically.
     * 
     * Note #1: See how to format the BatchRequest object here: https://docs.microsoft.com/en-us/graph/json-batching
     * Note #2: See limitations of BATCH requests here: https://docs.microsoft.com/en-us/graph/known-issues#json-batching
     * 
     * @param { BatchRequest } batchRequest - A JavaScript object which will be formed as a JSON object, containing all the batch requests.
     * @param { boolean } forceLogin - Indicates if login should be prompted to the user when the call is made but the user's access token is no longer valid.
     * @returns { Promise <any> } - Result of the API request.
     */
    public async batch ( batchRequest : BatchRequest, forceLogin : boolean = false ) : Promise <any>
    {
        if ( batchRequest.requests.length > 20 )
        {
            throw GraphErrorMessage.batchRequestLimit;
        }

        try
        {
            // Create new header object for fetch.
            const fetchHeaders : Headers = new Headers();

            // Create new header object for fetch.
            fetchHeaders.append( "Accept", "application/json" );
            fetchHeaders.append( "Content-Type", "application/json" );

            // Create a new fetch request object.
            const fetchRequest : Request = new Request( `${ URL.GRAPH_API_BASE }/${ this.context.graphVersion }/$batch`,
            {
                method  : FetchMethod.POST,
                headers : fetchHeaders,
                body    : JSON.stringify( batchRequest )
            });

            return await this.call( fetchRequest, forceLogin );
        }
        catch ( e : any )
        {
            Promise.reject( e );
        }
    }

    /**
     * Performs an call to the Microsoft Graph API. Use the 'forceLogin' parameter to trigger
     * a login process if the user is no longer authenticated with Microsoft Identity when 
     * the call is made. The access token required for the request is generated automatically.
     * 
     * Note: The access token for the request will be injected into the header automatically.
     * 
     * @param { Request } request - Fetch Request object: https://developer.mozilla.org/en-US/docs/Web/API/Request
     * @param { boolean } forceLogin - Indicates if login should be prompted to the user when the call is made but the user's access token is no longer valid.
     * @returns { Promise <any> } - Result of the API request.
     */
    private async call ( request : Request, forceLogin : boolean = false ) : Promise <any>
    {
        try
        {
            if ( request instanceof Request )
            {
                // Get an access token.
                const tokenResult : AuthenticationResult = await this.auth.getToken( TokenType.GRAPH, forceLogin );

                // Add the token to the header.
                request.headers.append( "Authorization", `Bearer ${ tokenResult.accessToken }`);

                const fetchResult : Response = await fetch ( request );
                const fetchJson : any = await fetchResult.json();

                // Request was successful.
                if ( fetchResult.status === 200 )
                {
                    return fetchJson;
                }
                else
                {
                    if ( typeof fetchJson.error !== 'undefined' )
                    {
                        if ( fetchJson.error.code === GraphErrorCode.REQUEST_DENIED )
                        {
                            return Promise.reject( GraphErrorMessage.getRequestDenied );
                        }
                        
                        if ( fetchJson.error.code === GraphErrorCode.ACCESS_DENIED )
                        {
                            return Promise.reject( GraphErrorMessage.getAccessDenied );
                        }

                        if ( fetchJson.error.code === GraphErrorCode.ERROR_ACCESS_DENIED )
                        {
                            return Promise.reject( GraphErrorMessage.getRequestDenied );
                        }
                    }
                }

                return Promise.reject( { error : fetchJson, ...GraphErrorMessage.getUnknownError } );
            }
            else
            {
                return Promise.reject( { error : e, ...GraphErrorMessage.requestTypeInvalid } );
            }
        }
        catch ( e : any )
        {
            return Promise.reject( { error : e, ...GraphErrorMessage.getUnknownError } );
        }
    }

    /**
     * Takes a partial Microsoft Graph URI and forms a valid full URL request to the Graph API.
     * 
     * @param { string } endPoint - MS Graph endpoint to validate.
     * @returns { Promise <any> } - A valid (full) Microsoft Graph API URL.
     */
    private getValidEndPoint ( endPoint ) : string
    {
        if ( typeof endPoint === "string" )
        {
            if ( endPoint.charAt(0) !== "/" )
            {
                return `${ URL.GRAPH_API_BASE }/${ this.context.graphVersion }/${ endPoint }`;
            }
            else
            {
                return `${ URL.GRAPH_API_BASE }/${ this.context.graphVersion }${ endPoint }`;
            }
        }
        else
        {
            throw GraphErrorMessage.endPointInvalid;
        }
    }
}
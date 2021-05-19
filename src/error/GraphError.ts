/**
 * @file Defines errors related to MS Graph.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * GraphErrorMessage object containing error messages related to MS graph.
 */
 export const GraphErrorMessage =
 {
    getRequestDenied :
     {
         code : "graph_request_denied",
         desc : "The application has not been given the appropriate API scope permissions for this MS Graph request."
     },
     getAccessDenied :
     {
         code : "graph_access_denied",
         desc : "The user does not have permission to access the requested resource."
     },
     getUnknownError :
     {
         code : "graph_unknown_error",
         desc : "An unknown error occurred during the MS Graph get request."
     },
     endPointInvalid :
     {
         code : "graph_endPoint_invalid",
         desc : "An invalid end point was passed to a graph API request call."
     },
     batchRequestLimit :
     {
         code : "graph_batch_request_limit",
         desc : "A batch request cannot contain more than 20 requests."
     },
     requestTypeInvalid :
     {
         code : "graph_call_request_invalid",
         desc : "The request parameter is invalid or incorrectly formed."
     }
 }
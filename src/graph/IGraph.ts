/**
 * @file Interface for Graph class.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import type { BatchRequest } from "../types/BatchRequest";

/**
 * @interface Interface for Graph class.
 */
 export interface IGraph
 {
    get ( endPoint : string, forceLogin : boolean )          : Promise <any>;
    batch ( endPoints : BatchRequest, forceLogin : boolean ) : Promise <any>;
 }
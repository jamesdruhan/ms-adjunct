/**
 * @file Adjunct Request & BatchRequest object type definitions.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

 /**
 * Adjunct Request object type definition.
 * 
 * @typedef { Object } Request
 */
export type Request =
{
    id         : string,
    method     : string,
    url        : string,
    dependsOn? : string,
    body?      : Object,
    headers?   : Object
}

 /**
 * Adjunct BatchRequest object type definition.
 * 
 * @typedef { Object } BatchRequest
 */
export type BatchRequest =
{
    requests : Request[]
}
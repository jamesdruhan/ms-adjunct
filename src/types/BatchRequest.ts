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
 * @property { object } Request - Graph JSON batch object.
 */
export type Request =
{
    id         : string,
    method     : string,
    url        : string,
    dependsOn? : string,
    body?      : unknown,
    headers?   : unknown
}

/**
 * Adjunct BatchRequest object type definition.
 * 
 * @property { object } BatchRequest - Graph JSON Request object.
 */
export type BatchRequest =
{
    requests : Request[]
}
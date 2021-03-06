/**
 * @file Interface for BrowserStorage class.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * @interface Interface for BrowserStorage class.
 */
export interface IBrowserStorage
{
    getItem ( key : string )                 : string | null;
    setItem ( key : string, value : string ) : void;
    removeItem ( key : string )              : void;
    containsKey ( key: string )              : boolean;
    getKeys ()                               : string [];
}
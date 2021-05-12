/**
 * @file Collection of misc. helper methods.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * Collection of misc. helper methods.
 */
export class Helpers
{
    /**
     * Returns true if all items in an array are of type 'string', otherwise returns false.
     * @static
     * 
     * @param { x } [] - Array object to be tested.
     * @returns { boolean } - Result of string test.
     */
    static doesArrayContainOnlyStrings ( x : string [] ) : boolean
    {
        return x.every( item =>
        {
            return typeof item === "string";
        });
    }
}
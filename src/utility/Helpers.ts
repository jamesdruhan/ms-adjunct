/**
 * @file Collection of miscellaneous helper methods for Adjunct Graph.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

/**
 * Collection of miscellaneous helper methods for Adjunct Graph.
 */
export class Helpers
{
    /**
     * Checks if an array only consists of 'string' typed items. A return value of
     * true indicates all items in the array are strings, otherwise false is returned.
     * @static
     * 
     * @example
     * const myValue1 = [ 'a', 'b', 'c' ];
     * Helpers.doesArrayContainOnlyStrings( myValue ); // true
     * const myValue2 = [ 'a', 'b', 5 ];
     * Helpers.doesArrayContainOnlyStrings( myValue ); // false
     * 
     * @param { string [] } x - Array object to be tested for strings.
     * @returns { boolean } - Result of test.
     */
    public static doesArrayContainOnlyStrings ( x : string [] ) : boolean
    {
        return x.every( item =>
        {
            return typeof item === "string";
        });
    }

    /**
     * Checks if any values in one array (scopesToCheck) exist in another array (scopesToBeChecked).
     * A returned value of true indicates a scope in scopesToCheck exists in scopesToBeChecked. This
     * is handy to test of a Graph Permission scope is present in a array of scopes such as those
     * found in the Adjunct settings.
     * @static
     * 
     * @example
     * const requiredScopes = [ 'User.Read' ];
     * const myAppScopes    = [ 'openid', 'profile', 'mail', 'User.Read' ];
     * Helpers.includesScope( requiredScopes, myAppScopes ); // true
     * 
     * @param { string [] } scopesToCheck - Array of strings that need to be checked against scopesToBeChecked.
     * @param { string [] } scopesToBeChecked - Array of strings to be checked if it contains one of scopesToCheck.
     * @returns { boolean } - Result of test.
     */
    public static includesScope ( scopesToCheck : string [], scopesToBeChecked : string [] ) : boolean
    {
        if ( scopesToBeChecked.length < 1 || scopesToCheck.length < 1 )
        {
            return false;
        }

        let resultOfCheck = false;

        scopesToCheck.forEach( ( scope : string ) =>
        {
            if ( scopesToBeChecked.indexOf( scope ) !== -1 )
            {
                resultOfCheck = true;
            }
        });

        return resultOfCheck;
    }
}
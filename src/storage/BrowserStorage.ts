/**
 * @file BrowserStorage for Adjunct Graph which manages browser storage.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { SignInPersistance } from "../utility/Constants";
import { IBrowserStorage }  from "./IBrowserStorage";

/**
 * BrowserStorage for Adjunct Graph which manages browser storage.
 * 
 * @implements { IBrowserStorage }
 */
export class BrowserStorage implements IBrowserStorage
{
    /**
     * Identifies the type of browser storage to be used: localStorage or sessionStorage.
     * 
     * @type { Storage }
     */
    private windowStorage : Storage;

    /**
     * @class Create a new instance of the BrowserStorage class.
     * @constructs BrowserStorage
     * 
     * @example
     * const browserStorage : BrowserStorage = new BrowserStorage( SignInPersistance.REMEMBER );
     * 
     * @param { SignInPersistance } storageType - The storage method to used when performing browser storage actions.
     * @returns { BrowserStorage } - Object of the BrowserStorage class.
     */
    constructor ( storageType : SignInPersistance )
    {
        this.windowStorage = window [storageType];
    }

    /**
     * Get the value in browser storage assigned to the key parameter.
     * 
     * @example
     * browserStorage.setItem( 'myStorageKey', 'anInterestingValue' );
     * browserStorage.getItem( 'myStorageKey' ); // "anInterestingValue"
     * 
     * @param {string } key - Name of browser storage key.
     * @returns { (string | null) } - Value in browser storage matching key.
     */
    public getItem ( key : string ) : string | null
    {
        return this.windowStorage.getItem( key );
    }

    /**
     * Create a new key or update an existing key value in the browser storage.
     * 
     * @example
     * browserStorage.setItem( 'myStorageKey', 'anInterestingValue' );
     * 
     * @param { string } key - Name of the browser storage key to create or update.
     * @param { string } value - Value to set.
     * @returns { void }
     */
    public setItem ( key : string, value : string ) : void
    {
        this.windowStorage.setItem( key, value );
    }

    /**
     * Delete a key/value pair in the browser storage.
     * 
     * @example
     * browserStorage.setItem( 'myStorageKey', 'anInterestingValue' );
     * browserStorage.removeItem( 'myStorageKey' );
     * 
     * @param { string } key - Name of the browser storage key to delete.
     * @returns { void }
     */
    public removeItem ( key: string ) : void
    {
        this.windowStorage.removeItem( key );
    }

    /**
     * Get all the keys from the browser storage object as an iterable array of strings.
     * 
     * @example
     * browserStorage.setItem( 'myStorageKey', 'anInterestingValue' );
     * browserStorage.getKeys(); // [ 'myStorageKey' ]
     * 
     * @returns { string [] } - All the keys from the browser storage.
     */
    public getKeys () : string []
    {
        return Object.keys( this.windowStorage );
    }

    /**
     * Gets a true or false value, indicating if the key is present in browser storage.
     * 
     * @example
     * browserStorage.setItem( 'myStorageKey', 'anInterestingValue' );
     * browserStorage.containsKey( 'myStorageKey' ); // true
     * 
     * @param { string } key - Name of the key to check in browser storage.
     * @returns { boolean } - True or false value indicating if the key is present in browser storage.
     */
    public containsKey ( key : string ) : boolean
    {
        return this.windowStorage[ key ] !== null ? true : false;
    }
}
/**
 * @file Provides helpers to manage browser storage data.
 * @version 1.0.0
 * @since 1.0.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

import { SignInPersistance } from '../utility/Constants';
import { IBrowserStorage }  from "./IBrowserStorage";

/**
 * Class which manages browser storage.
 * 
 * @implements { IBrowserStorage }
 */
export class BrowserStorage implements IBrowserStorage
{
    /**
     * Name of the browser storage to use for storage commands.
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
        this.windowStorage = window[storageType];
    }

    /**
     * Get the value based on the passed key from the browser storage.
     * 
     * @param {string } key - Name of browser storage key.
     * @returns { (string | null) } - Value in browser storage matching key.
     */
    getItem( key : string ) : string | null
    {
        return this.windowStorage.getItem( key );
    }

    /**
     * Create or set the key value in the browser storage.
     * 
     * @param { string } key - Name of the browser storage key to create or set.
     * @param { string } value - Value to set in the browser storage matching key.
     * @returns { void }
     */
    setItem( key : string, value : string ) : void
    {
        this.windowStorage.setItem( key, value );
    }

    /**
     * Delete the key/value pair in the browser storage.
     * 
     * @param { string } key - Name of the browser storage key to delete.
     * @returns { void }
     */
    removeItem( key: string ) : void
    {
        this.windowStorage.removeItem( key );
    }

    /**
     * Get all the keys from the browser storage object as an iterable array of strings.
     * 
     * @returns { string[] } - All the keys from the browser storage.
     */
    getKeys() : string[]
    {
        return Object.keys( this.windowStorage );
    }

    /**
     * Gets a true or false value, indicating if the key is present in browser storage.
     * 
     * @param { string } key - Name of the key to check in browser storage.
     * @returns { boolean } - True or false value indicating if the key is present in browser storage.
     */
    containsKey( key : string ): boolean
    {
        return this.windowStorage.hasOwnProperty( key );
    }
}
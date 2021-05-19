/**
 * @file Adjunct user object type definition.
 * @version 0.1.0
 * @since 0.1.0
 * @author James Druhan <jdruhan.code@gmail.com>
 * @license MIT
 */

 /**
 * Adjunct user object type definition.
 * 
 * @typedef { Object } User
 */
export type User =
{
    id                : string | null;
    employeeId        : string | null;
    displayName       : string | null;
    givenName         : string | null;
    surname           : string | null;
    userPrincipalName : string | null;
    mail              : string | null;
    businessPhones    : string [];
    mobilePhone       : string | null;
    faxNumber         : string | null;
    jobTitle          : string | null;
    preferredLanguage : string | null;
    officeLocation    : string | null;
    streetAddress     : string | null;
    city              : string | null;
    companyName       : string | null;
    state             : string | null;
    postalCode        : string | null;
    country           : string | null;
    department        : string | null;
}
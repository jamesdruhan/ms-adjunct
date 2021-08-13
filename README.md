</h1><h3 align="center">THIS DOCUMENTATION FOR THIS PROJECT IS NOT COMPLETE</h3>

</h1><h3 align="center">THIS PROJECT IS NOT READY FOR PRODUCTION</h3>

<h1 align="center">
  Adjunct for Microsoft Graph
</h1>

Adjunct for Microsoft Graph manages user authentication with Microsoft Azure AD as well as API calls to Microsoft Graph. This library is especially designed for SPA's (Single Page Applications) and works well with popular frameworks such as React, Vue and Angular.

## ⚡️ Installation

Add Adjunct for Microsoft Graph to your project:

```bash
npm install @adjunct-js/adjunct-graph
```

## ✍ Usage
The `@adjunct/adjunct-graph` library acts as a wrapper around the MSAL `@azure/msal-browser` library which securely handles authentication, authorization and access token generation. In addition, it uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make REST calls.

1. [Application Setup](#application-setup)
1. [Initialization](#initialization)
1. [Authentication](#authentication)
1. [Authorization](#authorization)
1. [User Info](#user-info)
1. [Graph API](#graph-api)

## Application Setup

Before you can get started with `@adjunct/adjunct-graph` you need to register your application in the Azure Portal. You can follow the [Microsoft Instructions](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration) or the simple steps below.

1. Sign in to the [Azure Portal](https://portal.azure.com/)
1. Select the Azure Active Directory
1. Select App Registrations
1. Select New Registration
1. Configure your application

> Configure your app registration accordingly but ensure your *Redirect URL* is configured to the URL of the application page which will process user authentication (more details in [Authentication]#authentication).

> The minimum recommended API Permission to provide users is User.Read which allows your application to read the users details. However, depending on the Microsoft Graph resources you need for your application you will need to grant more permissions.

## Initialization



## Authentication



## Authorization



## User Info



## Graph API



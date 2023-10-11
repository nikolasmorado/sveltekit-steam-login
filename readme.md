# SvelteKit Steam Login

SvelteKit JavaScript library that simplifies Steam OpenID authentication and allows you to retrieve public Steam user information.

## Installation

You can install the library using npm or yarn:

```bash
npm install sveltekit-login-steam
```

or

```bash
yarn add sveltekit-login-steam
```

## Usage

To use the `Steam Login` library, you'll need to import it and create an instance with your configuration options. Here's a basic example of how to use it in a SvelteKit project:

```javascript
import Steam Login from 'sveltekit-login-steam';

// Create a new instance with your Steam API key and authentication settings.
const steamAuth = new Steam Login({
  realm: 'https://yourwebsite.com',
  returnUrl: 'https://yourwebsite.com/auth/steam/callback',
  apiKey: 'your-steam-api-key',
});

// Generate the URL for initiating Steam OpenID authentication.
const authURL = steamAuth.getURLRedirect();
console.log('Authentication URL:', authURL);

// Handle the OpenID response and authenticate the user.
// You can use Promises or async/await for this step.
```

For more details on available methods and how to handle the OpenID response, please refer to the library's [API documentation](#api-documentation).

## API Documentation

| Method                             | Description                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| `constructor(opt)`                 | Create a new `Steam Login` instance.                               |
| `getURLRedirect()`                 | Generate the URL for initiating Steam OpenID authentication.       |
| `getURLCheckAuthentication(query)` | Generate the URL for checking OpenID authentication.               |
| `getURLPublicInfo(query)`          | Generate the URL for retrieving public Steam user information.     |
| `isValid(query)`                   | Check if the OpenID response is valid.                             |
| `getPublicInfo(query)`             | Retrieve public Steam user information if authentication is valid. |
| `authenticate(query)`              | Authenticate the user with Steam OpenID.                           |
| `authenticatePromise(query)`       | Authenticate the user with Steam OpenID using Promises.            |

Module for make a login with steam credentials

# How to use
Import module

```
import loginSteam from 'simple-steam-login'
```

Generate steam api key on https://steamcommunity.com/dev/apikey

Create object login steam

```
const port = 3000;
const STEAM_API = `<your_api_key>`;
const STEAM_CALLBACK_URI = `http://localhost:${port}/login/callback`;
const REALM = `http://localhost`;
const opt = {
    realm: REALM, // Site name displayed to users on logon
    returnUrl: STEAM_CALLBACK_URI, // Your return route
    apiKey: STEAM_API //Steam API key   
}
new loginSteam(opts)
```

In your route redirect to this url
```
const url = this.loginSteam.get_URL_redirect()
```

In your callback route (STEAM_CALLBACK_URI) get user info by passing query params object to authenticate() method
```
const data = await this.loginSteam.authenticate(request.query);
```

data cointains all public user info
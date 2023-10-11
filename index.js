import axios from 'axios';

class SteamLogin {
  /**
   * Create a new LoginSteam instance.
   * @param {Object} opt - Configuration options.
   * @param {string} opt.realm - The realm for OpenID authentication.
   * @param {string} opt.returnUrl - The return URL after authentication.
   * @param {string} opt.apiKey - Your Steam API key.
   */
  constructor(opt) {
    this.realm = opt.realm;
    this.returnUrl = opt.returnUrl;
    this.apiKey = opt.apiKey;
  }

  /**
   * Generate the URL for initiating the Steam OpenID authentication.
   * @returns {string} The authentication URL.
   */
  getURLRedirect() {
    const queryParams = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.return_to': this.returnUrl,
      'openid.realm': this.realm,
      'openid.mode': 'checkid_setup',
    });

    return `https://steamcommunity.com/openid/login?${queryParams.toString()}`;
  }

  /**
   * Generate the URL for checking OpenID authentication.
   * @param {Object} query - The query parameters from the OpenID response.
   * @returns {string} The URL for checking authentication.
   */
  getURLCheckAuthentication(query) {
    const sp = new URLSearchParams(query.url.searchParams);
    sp.set('openid.mode', 'check_authentication');
    return `https://steamcommunity.com/openid/login?${sp}`;
  }

  /**
   * Generate the URL for retrieving public Steam user information.
   * @param {Object} query - The query parameters from the OpenID response.
   * @returns {string} The URL for fetching user information.
   */
  getURLPublicInfo(query) {
    const queryParams = new URLSearchParams({
      steamids: query['openid.claimed_id'],
      key: this.apiKey,
      format: 'json',
    });

    return `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?${queryParams.toString()}`;
  }

  /**
   * Check if the OpenID response is valid.
   * @param {Object} query - The query parameters from the OpenID response.
   * @returns {Promise<boolean>} A Promise that resolves to true if valid, or false if not.
   */
  isValid(query) {
    return axios.get(this.getURLCheckAuthentication(query))
      .then((response) => response.data.includes("is_valid:true"));
  }

  /**
   * Retrieve public Steam user information if authentication is valid.
   * @param {Object} query - The query parameters from the OpenID response.
   * @returns {Promise<Object>} A Promise that resolves to the user information.
   */
  getPublicInfo(query) {
    return axios.get(this.getURLPublicInfo(query))
      .then((response) => response.data.response.players[0]);
  }

  /**
   * Authenticate the user with Steam OpenID.
   * @param {Object} query - The query parameters from the OpenID response.
   * @returns {Promise<Object>} A Promise that resolves to the user information if authentication is successful.
   * @throws {Error} Throws an error with the message 'is_valid: false' if authentication fails.
   */
  async authenticate(query) {
    try {
      const valid = await this.isValid(query);
      if (valid) {
        return this.getPublicInfo(query);
      } else {
        throw new Error('is_valid: false');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authenticate the user with Steam OpenID using Promises.
   * @param {Object} query - The query parameters from the OpenID response.
   * @returns {Promise<Object>} A Promise that resolves to the user information if authentication is successful.
   * @throws {Error} Throws an error with the message 'is_valid: false' if authentication fails.
   */
  authenticatePromise(query) {
    return this.authenticate(query);
  }
}

export default SteamLogin;

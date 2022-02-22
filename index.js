import sget from 'simple-get'

function loginSteam(opt) {
    this.realm = opt.realm;
    this.returnUrl = opt.returnUrl;
    this.apiKey = opt.apiKey;
    
    this.get_URL_redirect = function () {//url for redirect to steam openid2.0 login site (https://steamcommunity.com/openid/login)
        let queryParams = {
            'openid.ns': 'http://specs.openid.net/auth/2.0',
            'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
            'openid.return_to': this.returnUrl,
            'openid.realm': this.realm,
            'openid.mode': 'checkid_setup'
        }
        return 'https://steamcommunity.com/openid/login?' + new URLSearchParams(queryParams).toString(); // Get redirect url for Steam
    }
    this.get_URL_check_authentication = function (query) {//url for server check that is really authenticate
        query['openid.mode'] = 'check_authentication';
        return 'https://steamcommunity.com/openid/login?' + new URLSearchParams(query).toString();
    }
    this.get_URL_publicInfo = function (query) {//url for get public info from steam api, need api key from https://steamcommunity.com/dev/apikey 
        let queryParams = {
            steamids: query['openid.claimed_id'],
            key: this.apiKey,
            format: 'json'
        }
        return 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?' + new URLSearchParams(queryParams).toString();
    }

    this.is_valid = (query, cbTrue, cbFalse) => {//server send request to steam to check that user is really authenticate
        sget.concat({
            url: this.get_URL_check_authentication(query),
            method: 'GET'
        }, (err, res, data) => {
            if (err) {
                cbFalse(err);
                return
            }
            data.toString().includes("is_valid:true") ? cbTrue() : cbFalse('is_valid: false');
        })
    }

    this.get_publicInfo = (query, cbTrue, cbFalse) => {//server send request to steam api to get public info
        sget.concat({
            url: this.get_URL_publicInfo(query),
            method: 'GET',
            json: true
        }, (err, res, data) => {
            if (err) {
                cbFalse(err);
                return
            }
            cbTrue(data.response.players[0]);
        })
    }

    this.authenticate = (query, cbTrue, cbFalse) => {//return the info if user is authenticate or errore
        if(cbTrue === undefined || cbFalse === undefined){
            return this.authenticatePromise(query);
        }
        this.is_valid(
            query,
            () => {
                this.get_publicInfo(query, cbTrue, cbFalse)
            },
            cbFalse
        )
    }

    this.authenticatePromise = (query) => {//return the info if user is authenticate or error        
        return new Promise((resolve, reject) => {  
            this.authenticate(query, resolve, reject)
        })
    }
}
export default loginSteam;
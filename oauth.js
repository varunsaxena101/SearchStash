let userAuthToken;
let retryLogin = true;

function loginUser() {
    return new Promise(function(resolve, reject) {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            console.log(token);
            userAuthToken = token;

            let init = {
                method: 'GET',
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            };

            getServerToken(userAuthToken)
                .then(function (userInfo) {

                    fetch(
                    'https://accounts.google.com/o/oauth2/revoke?token=' + userAuthToken,
                    init)
                    .then((response) => response.json())
                    .then(function(data) {
                        console.log(data);
                        chrome.identity.removeCachedAuthToken(
                            {'token': userAuthToken}, function() {
                            userAuthToken = undefined;
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                })
                .then(() => {
                    chrome.storage.local.get(['givenName',
                    'userID', 'imgSRC'], function(result) {
                        console.log(result);
                        resolve([result.givenName, result.userID, result.imgSRC]);
                    });
                })
                .catch ((err) => {
                    if (retryLogin) {
                        retryLogin = false;
                        chrome.identity.removeCachedAuthToken(
                            {'token': userAuthToken}, loginUser);
                    } else {
                        reject(err);
                    }
                });
        });
    });
}

// gets a SearchStash server access token and stores in chrome.storage
function getServerToken(oauthToken) {
    return new Promise(function (resolve, reject) {
        // send token to server
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == XMLHttpRequest.DONE) {
                console.log(xhttp.responseText);
                const response = JSON.parse(xhttp.responseText);
                console.log(response.userInfo);
                console.log(response.token);

                if (response.userInfo) {
                    chrome.storage.local.set(response.userInfo);
                    chrome.storage.local.set({ 'token': response.token });
                    chrome.storage.local.get('token', function (result) {
                        console.log(result);
                    });
                    resolve(response.userInfo);
                } else {
                    reject(new Error('There was no userInfo'));
                }
                
            }
        };

        const params = '?oauthToken=' + oauthToken;
        // const targetURL = 'https://api.searchstash.com/create-token' + params;
        const targetURL = 'http://localhost:3000/create-token' + params;
        xhttp.open('GET', targetURL);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    });
}

function deleteServerToken(token) {
    // send token to server
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
		if (xhttp.readyState == XMLHttpRequest.DONE) {
            console.log(xhttp.responseText);
			const response = JSON.parse(xhttp.responseText);
            console.log(response);
            console.log(response.token);

            chrome.storage.local.remove('token');
            chrome.storage.local.get('token', function(result) {
                console.log(result);
            });
		}
	};

    // const targetURL = 'https://api.searchstash.com/delete-token';
    const targetURL = 'http://localhost:3000/delete-token';
	xhttp.open('DELETE', targetURL);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xhttp.send();
}

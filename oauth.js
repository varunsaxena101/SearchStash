function getAuthtoken() {
	return new Promise(function(resolve, reject) {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
        	if ( token ) {
        		console.log(token);
                return resolve( token );
            }
            return reject( 'FAIL_GET_G_AUTH_TOKEN' );
        });
	});
}

function removeCachedAuthToken( token ) {
	return new Promise(function(resolve) {
        chrome.identity.removeCachedAuthToken(
            {token: token}, function() {
                console.log('cached auth token removed.')
                resolve(true);
            });
	});
}

async function loginUser() {
    let retryCount = 3;
    let token;

    while ( retryCount-- !== 0) {
        try {
            token = await getAuthtoken();
            console.log(token);
            const userInfo = await getServerToken(token);
            console.log(userInfo);
            const fetchResp = await fetch(
                'https://accounts.google.com/o/oauth2/revoke?token=' + token,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });
    
            console.log(fetchResp);
            return true;
        }
        catch(err) {
            console.log(err);
            if ( err === 'FAIL_GET_USER_INFO' ) {
                const removed = await removeCachedAuthToken( token );
                console.log(removed);
            }
        }
    }

    return false;
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
                    reject('FAIL_GET_USER_INFO');
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

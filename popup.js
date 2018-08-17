window.name = 'myPopup';
let loggedIn = false;
console.log(window.name);
// import {getUserInfo} from 'module';

const loginButton = document.createElement('button');
loginButton.innerHTML = 'Log in';
loginButton.className = 'btn btn-login';
loginButton.addEventListener('click', function() {
    loginUser().then((userInfo) => {
        renderLoggedIn(userInfo);
    }, function(error) {
        console.log(error);
    });
});

const logoutButton = document.createElement('button');
logoutButton.innerHTML = 'Log out';
logoutButton.className = 'btn btn-login';
logoutButton.addEventListener('click', function() {
    chrome.storage.local.get('token', (result) => {
        console.log(result);
        deleteServerToken(result.token);
    });
    chrome.storage.local.remove(['givenName', 'userID', 'imgSRC', 'token']);
    renderLoggedOut();
});

function renderLoggedIn(userInfo) {
    'use strict';
    const img = document.getElementById('picture');
    const div = document.getElementById('buttons');
    const searchButton = document.createElement('a');
    const p = document.createElement('p');

    img.src = userInfo[2];
    img.className = 'avatar';

    div.innerHTML = '';

    searchButton.innerHTML = 'Search Stash';
    searchButton.href = 'searchPage.html';
    searchButton.className = 'btn btn-search';
    searchButton.target = '_blank';

    p.innerHTML = 'Hello, ' + userInfo[0];

    div.appendChild(p);
    div.appendChild(searchButton);
    div.appendChild(logoutButton);

    loggedIn = true;
}

function renderLoggedOut() {
    const img = document.getElementById('picture');
    const div = document.getElementById('buttons');
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    const terms = document.createElement('p');

    img.src = 'images/logo_128.png';
    img.className = 'logo';

    div.innerHTML = '';

    p2.innerHTML = 'Welcome to SearchStash';
    p2.className = 'welcome';

    p.innerHTML = 'Sign in with Google to Begin!';

    terms.innerHTML = 'By logging in I agree to the Terms of Service';
    terms.className = 'terms-of-service';

    div.appendChild(p2);
    div.appendChild(p);
    div.appendChild(loginButton);
    div.appendChild(terms);

    loggedIn = false;
}

getUserInfo().then(function(result) {
    console.log(result);
    loggedIn = true;
    result = [result.givenName, result.userID, result.imgSRC];
    console.log(result);
    renderLoggedIn(result);
}).catch(function(error) {
    console.log(error);
    loggedIn = false;
    renderLoggedOut();
});


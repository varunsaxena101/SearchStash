const loginButton = document.createElement('button');
loginButton.innerHTML = 'Log in';
loginButton.className = 'btn btn-login';
loginButton.addEventListener('click', function() {
    chrome.tabs.create({url: 'loginPage.html'});
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

}

function renderLoggedOut() {
    const img = document.getElementById('picture');
    const div = document.getElementById('buttons');
    const p = document.createElement('p');
    const p2 = document.createElement('p');
    const terms = document.createElement('a');

    img.src = 'images/logo_128.png';
    img.className = 'logo';

    div.innerHTML = '';

    p2.innerHTML = 'Welcome to SearchStash';
    p2.className = 'welcome';

    p.innerHTML = 'Sign in with Google to Begin!';

    terms.innerHTML = 'By logging in I agree to the Terms of Service';
    terms.className = 'terms-of-service';
    terms.href = 'https://www.searchstash.com/tos.html';
    terms.target = '_blank';

    div.appendChild(p2);
    div.appendChild(p);
    div.appendChild(loginButton);
    div.appendChild(terms);

}

function renderPage() {
    getUserInfo().then(function(result) {
        console.log(result);
        result = [result.givenName, result.userID, result.imgSRC];
        renderLoggedIn(result);
    }).catch(function(error) {
        console.log(error);
        renderLoggedOut();
    });
}

window.onload = function() {
    this.renderPage();
}





const loginButton = document.getElementsByClassName('btn-login')[0];
const p = document.getElementById('status');

loginButton.addEventListener('click', function() {
    // alert('hello');
    loginUser().then((userInfo) => {
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.update(tab.id, {url: 'searchPage.html'});
        });
    }, function(error) {
        console.log(error);
    });
});

window.onload = function() {
    getUserInfo().then(function(result) {
        console.log(result);
        result = [result.givenName, result.userID, result.imgSRC];
        console.log(result);
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.update(tab.id, {url: 'searchPage.html'});
        });
    }).catch(function(error) {
        console.log('user is not logged in.');
    });
}
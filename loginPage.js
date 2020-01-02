
const loginButton = document.getElementsByClassName('btn-login')[0];
const p = document.getElementById('status');

loginButton.addEventListener('click', function() {
    loginUser().then((result) => {
        if (result === true) {
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.update(tab.id, {url: 'searchPage.html'});
            });
        } else {
            alert('failed to login, please try again!!');
            console.log('failed to login user');
        }
    })
    .catch((err) => {
        console.log(err)
    });
});

function checkLogin() {
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

window.onload = checkLogin
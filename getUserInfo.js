/*
    Retrieves user info from Chrome Storage
*/


// chrome storage sends an empty object if nothing is found
function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function getUserInfo() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(['givenName', 'userID', 'imgSRC'],
        function(result) {
            console.log(result);
            console.log(isEmpty(result));
            if (!isEmpty(result)) {
                resolve(result);
            } else {
                reject(Error('User is not logged in'));
            }
        });
    });
}

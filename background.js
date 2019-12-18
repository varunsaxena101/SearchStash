/*
    Background.js listens for stash click in context menu. When stash is clicked,
    the user's info is retrieved and then stash request is sent to backend
*/

/**
 * creates context menu item when extension is first installed
 */
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      "id": "save",
      "title": "Stash It!",
      "contexts": ["selection"]
    });
  });

chrome.contextMenus.onClicked.addListener(function(clickInfo) {
    if (clickInfo.menuItemId == 'save' && clickInfo.selectionText) {
        // alert(clickInfo.selectionText);
        // highlight();

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const url = tabs[0].url;
            console.log(url);
            const xhttp = new XMLHttpRequest();
            getUserInfo().then((userInfo) => {
                const payload = {
                    userId: userInfo.userID,
                    addrURL: url,
                    title: tabs[0].title,
                    highlight: clickInfo.selectionText
                    // label: "General"
                };
                console.log(payload);

                xhttp.onreadystatechange = function() {
                    console.log('callback called');
                    if (xhttp.readyState == XMLHttpRequest.DONE) {
                        console.log(xhttp.responseText);
                    }
                };

                xhttp.open('POST', 'https://api.searchstash.com/urls');
                xhttp.setRequestHeader('Content-Type', 'application/json');
                xhttp.send(JSON.stringify(payload));
            }).catch((error) => {
                console.log(error);
                alert("You are not logged in!");
            });
        });
    }
});

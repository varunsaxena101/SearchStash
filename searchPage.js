let searchButton = document.getElementById('search');
// let textArea = document.getElementById('searchTextArea');
let textArea = document.getElementById('searchInput');

//If user hits enter it will search
textArea.addEventListener("keyup", (event) => {
	event.preventDefault();
	if (event.keyCode === 13) {
        searchButton.click();
    }
});

searchButton.onclick = function() {
	const searchText = textArea.value;
	console.log(searchText);

	if (searchText == "") {
		loadRecentStashes();
		return;
	}

	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == XMLHttpRequest.DONE) {
			console.log(xhttp.responseText);
			const response = JSON.parse(xhttp.responseText);
			console.log(response);
			console.log(typeof response);
			if (response.error) {
				document.getElementById('urlList').innerHTML =
                  'Error - Please sign in to search!';
				alert('You are not logged in!');
				window.location.reload(false)
			} else if (response.length != 0) {
				populateList(response, searchText);
			} else {
				noResults();
			}
		}
	};

	chrome.storage.local.get(['token', 'userID'], function(result) {
		console.log(result);
		const params = 'search=' + searchText;
		// const targetURL = 'https://api.searchstash.com/urls?' + params;
		const targetURL = 'http://localhost:3000/urls?' + params;
		xhttp.open('GET', targetURL);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('Authorization', 'Bearer ' + result.token);
		xhttp.setRequestHeader('X-id', result.userID);
		xhttp.send();
	});
};

function populateList(list, searchText) {
	const ul = document.getElementById('urlList');

	// clear the contents of the last search
	ul.innerHTML = '';

	for (let i = 0; i < list.length; i++) {
		const li = document.createElement('li');
		const a = document.createElement('a');
		const p = document.createElement('p');
		const del = document.createElement('a');

		a.setAttribute('href', list[i].addrURL);
		a.setAttribute('target', '_blank');
		a.innerHTML = highlightWords(list[i].title, searchText);
		a.className = 'li-title';

		p.innerHTML = highlightWords(list[i].highlight, searchText);
		p.className = 'li-p';

		del.innerHTML = 'Delete'
		del.className = 'li-delete'
		del.onclick = function() {deleteStash(list[i]._id)};

		if (i % 2 != 0) {
			li.className = 'li-highlight';
		}

		li.appendChild(a);
		li.appendChild(del);
		li.appendChild(p);
		ul.appendChild(li);
	}

	// this will select the text after a search
	// textArea.select();
}

function highlightWords(str, search) {
	let pattern = new RegExp(search, 'ig');
	let highlighted = str.replace(pattern, function(x) {
		return '<span class=\'highlight\'>' + x + '</span>';
	});
	return highlighted;
}

function noResults() {
	const ul = document.getElementById('urlList');

	// clear the contents of the last search
	ul.innerHTML = '';

	const li = document.createElement('li');
	const p = document.createElement('p');

	p.innerHTML = 'No results found - Please check' +
	'spelling errors and punctuation such as apostrophes.';
	p.className = 'li-p';

	li.appendChild(p);
	ul.appendChild(li);
}

function loadRecentStashes() {
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == XMLHttpRequest.DONE) {
			console.log(xhttp.responseText);
			const response = JSON.parse(xhttp.responseText);
			console.log(response);
			console.log(typeof response);
			if (response.error) {
				document.getElementById('urlList').innerHTML =
                  'Error - Please sign in to search!';
				alert('You are not logged in!');
			} else if (response.length != 0) {
				populateList(response, "");
			} else {
				noResults();
			}
		}
	};

	chrome.storage.local.get(['token', 'userID'], function(result) {
		console.log(result);
		// const targetURL = 'https://api.searchstash.com/urls?' + params;
		const targetURL = 'http://localhost:3000/get-recent-stashes?';
		xhttp.open('GET', targetURL);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('Authorization', 'Bearer ' + result.token);
		xhttp.setRequestHeader('X-id', result.userID);
		xhttp.send();
	});
}

function deleteStash(docID) {
	const xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == XMLHttpRequest.DONE) {
			console.log(xhttp.responseText);
			const response = xhttp.responseText;
			console.log(response);

			searchButton.click();
		}
	};

	chrome.storage.local.get(['token', 'userID'], function(result) {
		console.log(result);
		const params = 'docID=' + docID;
		// const targetURL = 'https://api.searchstash.com/urls?' + params;
		const targetURL = 'http://localhost:3000/delete-stash?' + params;
		xhttp.open('DELETE', targetURL);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('Authorization', 'Bearer ' + result.token);
		xhttp.setRequestHeader('X-id', result.userID);
		xhttp.send();
	});
}

searchButton.click()

window.onload = function() {
    getUserInfo().then(function(result) {
        console.log(result);
        result = [result.givenName, result.userID, result.imgSRC];
        console.log(result);
    }).catch(function(error) {
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.update(tab.id, {url: 'loginPage.html'});
        });
    });
}

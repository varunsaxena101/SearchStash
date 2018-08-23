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
				populateList(response, searchText);
			} else {
				noResults();
			}
		}
	};

	chrome.storage.local.get(['token', 'userID'], function(result) {
		console.log(result);
		const params = 'search=' + searchText;
		const targetURL = 'https://api.searchstash.com/urls?' + params;
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
		a.setAttribute('href', list[i].addrURL);
		a.setAttribute('target', '_blank');
		a.innerHTML = list[i].title;
		a.className = 'li-title';

		p.innerHTML = highlightWords(list[i].highlight, searchText);
		p.className = 'li-p';

		if (i % 2 != 0) {
			li.className = 'li-highlight';
		}

		li.appendChild(a);
		li.appendChild(p);
		ul.appendChild(li);
	}

	// this will select the text after a search
	// textArea.select();
}

function highlightWords(str, search) {
	let i = str.search(new RegExp(search, 'i'));
	if (i != -1) {
		str = str.substring(0, i) +
        '<span class=\'highlight\'>' +
		str.substring(i, i + search.length) + '</span>' +
		str.substring(i + search.length);
	} else {
		let strArr = search.split(' ');
		for (let a = 0; a < strArr.length; a++) {
			let i = str.search(new RegExp(strArr[a], 'i'));
			if (i != -1) {
				str = str.substring(0, i) +
				'<span class=\'highlight\'>' +
				str.substring(i, i + strArr[a].length) + '</span>' +
				str.substring(i + strArr[a].length);
			}
		}
	}

	return str;
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

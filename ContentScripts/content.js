

/*
document.addEventListener("mouseup", highlight);

chrome.contextMenus.onClicked.addListener(function(clickInfo) {
    if (clickInfo.menuItemId == 'save' && clickInfo.selectionText) {
        // alert(clickInfo.selectionText);
        highlight();
    }
});

function highlight() {
	const selection = document.getSelection();
	if (selection.toString() !== '') {
		const range = selection.getRangeAt(0);
		const span = document.createElement('span');
		span.className = 'highlighted-text';
		span.style.backgroundColor = 'yellow';
		span.style.cursor = 'pointer';
		span.innerHTML = range.toString();
		range.deleteContents();
		range.insertNode(span);
		// addCSS();
	}
}

function addCSS() {
	var head = document.getElementsByTagName('head')[0];
	var style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = 'test.css';
	style.type = 'text/css';
	head.appendChild(style);
}
*/

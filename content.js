/**
 *  This page currently adds no functionality and does not work properly.
 *  It will eventually be used to highlight the selected text on a webpage.
 */

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
export function detectBoGridPresence() {
	const hasBoGrid = document.querySelector('body.is-bo-grid-enabled');
	if (!hasBoGrid) {
		console.warn(
			'%cBO Grid not detected on <main>. Please ensure your theme uses .bo-grid',
			'color: orange; font-weight: bold;'
		);
		return false;
	}
	return true;
}


export function detectHoveredCol(clientX, clientY) {

	// iframe for the editor canvas in tablet and mobile view
	const iframe = document.querySelector('iframe[name="editor-canvas"]');
	if (iframe && iframe.contentDocument) {
	
		const els = iframe.contentDocument.elementsFromPoint(clientX, clientY);
		const hoveredCol = Array.from(els).find(el => el.classList?.contains('gutengrid-overlay__col'));
		if (hoveredCol) {
			return Number(hoveredCol.dataset.col);
		}
		return null;
	}

	const els = document.elementsFromPoint(clientX, clientY);
	const hoveredCol = els.find(el => el.classList?.contains('gutengrid-overlay__col'));
	if (hoveredCol) {
		return Number(hoveredCol.dataset.col);
	}
	return null;
}
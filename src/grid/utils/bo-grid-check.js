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
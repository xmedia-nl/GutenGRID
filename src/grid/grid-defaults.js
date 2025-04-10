/**
 * Internal dependencies
 */
const GRID_COLUMNS = {
	Desktop: 14,
	Tablet: 14,
	Mobile: 10,
};

export function getGridWidth(device) { // BO-GRID defaults. Unfortunatly we can't get the actual value from the CSS
	return GRID_COLUMNS[device] || 12;
}

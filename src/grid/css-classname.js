/**
 * Internal dependencies
 */


export function removeColumnClasses(classes, device = 'd') {
	if (!classes) return classes;

	const classString = String(classes);
	let result = classString
		.replace(/column\d-\w*-grid__\w*-\d*/g, '')
		.replace(/column\d-grid__\w*-\d*/g, '')
		.replace(/\s{2,}/, ' ')
		.replace(/wp-block-jetpack-layout-gutter__\w*/, '')
		.replace(/is-vertically-aligned-\w*/, '')
		.replace(/is-style-[A-Za-z-_]*/, '')
		.replace(/are-vertically-aligned-\w*/, '');

	// Als 'all', strip dan alle grid-classes voor desktop (d), tablet (t) en mobile (m)
	if (device === 'all') {
		result = result
			.replace(/d-grid-\d+-\d+/g, '')
			.replace(/t-grid-\d+-\d+/g, '')
			.replace(/m-grid-\d+-\d+/g, '');
	} else {
		const deviceTypeId = device.charAt(0).toLowerCase();
		result = result.replace(new RegExp(`${deviceTypeId}-grid-\\d+-\\d+`, 'g'), '');
	}

	return result.trim();
}

export function removeRowClasses(classes, device) {
	if (!classes) {
		return classes;
	}

	const deviceTypeId = device.charAt(0).toLowerCase();
	const classString = String(classes);

	return classString
		.replace(new RegExp(`${deviceTypeId}-row-\\d+-\\d+`, 'g'), '')
		.trim();
}

export function replaceColumnValuesInClass(className, device, start, end) {
	const prefix = device.charAt(0).toLowerCase();
	const newClass = (typeof start === 'number' && typeof end === 'number' && start < end)
		? `${prefix}-grid-${start}-${end}`
		: '';

	const cleaned = className
		?.split(' ')
		.filter(cls => !new RegExp(`${prefix}-grid-\\d+-\\d+`).test(cls))
		.join(' ') || '';

	return `${cleaned} ${newClass}`.trim();
}
export function replaceRowValuesInClass(className, device, start, end) {
	const prefix = device.charAt(0).toLowerCase();
	let newClass = '';

	if (typeof start === 'number' && typeof end === 'number' && start < end) {
		newClass = `${prefix}-row-${start}-${end}`;
	} else if (typeof start === 'number') {
		newClass = `${prefix}-row-${start}`;
	}

	const cleaned = className
		?.split(' ')
		.filter(cls => !new RegExp(`${prefix}-row-\\d+(-\\d+)?`).test(cls))
		.join(' ') || '';

	return `${cleaned} ${newClass}`.trim();
}
export function nudgeRowValuesInClass(className = '', device = 'Desktop', direction = 1) {
	const prefix = device.charAt(0).toLowerCase();
	const rowRegex = new RegExp(`${prefix}-row-(\\d+)(?:-(\\d+))?`);
	const match = className.match(rowRegex);

	if (!match) {
		return className;
	}

	let start = parseInt(match[1]);
	let end = match[2] ? parseInt(match[2]) : start + 1;

	start += direction;
	end += direction;

	const newClass = `${prefix}-row-${start}-${end}`;
	const cleaned = className.replace(rowRegex, '').trim();
	return `${cleaned} ${newClass}`.trim();
}
export function getStartEndColFromClassName(className = '', device = 'Desktop') {

	const prefix = device.charAt(0).toLowerCase();
	const match = className.match(new RegExp(`${prefix}-grid-(\\d+)-(\\d+)`));
	return match ? { start: parseInt(match[1], 10), end: parseInt(match[2], 10) } : { start: 1, end: 12 };
}
export function getStartEndRowFromClassName(className = '', device = 'Desktop') {
	const prefix = device.charAt(0).toLowerCase();
	const match = className.match(new RegExp(`${prefix}-row-(\\d+)(?:-(\\d+))?`));
	return match
		? {
			start: parseInt(match[1], 10),
			end: match[2] ? parseInt(match[2], 10) : undefined,
		}
		: { start: null, end: null };
}
export function getStartEndFromDom(el, device) {
	if (!el) return { start: 1, end: 12 };
	const prefix = device.charAt(0).toLowerCase();
	const match = Array.from(el.classList).find((cls) =>
		new RegExp(`${prefix}-grid-(\\d+)-(\\d+)`).test(cls)
	);
	if (match) {
		const [, start, end] = match.match(/(\d+)-(\d+)/);
		return { start: parseInt(start), end: parseInt(end) };
	}
	return { start: 1, end: 12 };
}
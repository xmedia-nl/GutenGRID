import { useSelect } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';

import { getStartEndRowFromClassName } from './../css-classname';

export function useSupportsClassName(clientId) {
	return useSelect((select) => {
		const block = select('core/block-editor').getBlock(clientId);
		const blockType = getBlockType(block?.name);
		return blockType?.supports?.className !== false;
	}, [clientId]);
}

export function getMaxRowClassNames(innerBlocks) {
	const max = { d: 1, t: 1, m: 1 };

	innerBlocks.forEach((block) => {
		console.log('Row check for block:', block);
		const className = block.attributes?.className || '';
		['Desktop', 'Tablet', 'Mobile'].forEach((device) => {
			let { start, end } = getStartEndRowFromClassName(className, device);
			console.log('Start and end:', device, start, end);

			// start might not be set if the block is locked in one row (eg. d-row-2 instead of from-to like d-row-2-3)
			// if end is not set, we assume it is the same as start
			end = end || start;
			if (end && end > max[device.charAt(0).toLowerCase()]) {
				max[device.charAt(0).toLowerCase()] = end;
			}
		});
	});

	return [
		`d-row-1-${max.d}`,
		`t-row-1-${max.t}`,
		`m-row-1-${max.m}`,
	];
}
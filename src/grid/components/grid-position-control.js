import { __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

import {
	getStartEndColFromClassName,
	getStartEndRowFromClassName,
	replaceColumnValuesInClass,
	replaceRowValuesInClass
} from '../css-classname';
import { getGridWidth } from '../../grid/grid-defaults';

const GridPositionControl = ({ clientId }) => {
	const { className = '' } = useSelect((select) =>
		select('core/block-editor').getBlockAttributes(clientId),
		[clientId]
	);

	const device = useSelect((select) =>
		select('core/edit-post')?.__experimentalGetPreviewDeviceType?.() || 'Desktop'
	);

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const [colStart, setColStart] = useState('');
	const [colEnd, setColEnd] = useState('');
	const [rowStart, setRowStart] = useState('');
	const [rowEnd, setRowEnd] = useState('');

	// Initial values bij load of class/device change
	useEffect(() => {
		const { start: cs, end: ce } = getStartEndColFromClassName(className, device);
        const { start: rs, end: re } = getStartEndRowFromClassName(className, device);

		setColStart(cs || '');
		setColEnd(ce || '');
		setRowStart(rs || '');
		setRowEnd(re || '');
	}, [className, device]);

	// Class updater
	const updateColClass = (start, end) => {
        const isValid = (val) => val === '' || (!isNaN(val) && Number(val) > 0);
        if (!isValid(start) || !isValid(end)) return;
    
        const newClassName = replaceColumnValuesInClass(className, device, Number(start), Number(end));
        updateBlockAttributes(clientId, { className: newClassName });
    };

	const updateRowClass = (start, end) => {
        const isValid = (val) => val === '' || (!isNaN(val) && Number(val) > 0);
        if (!isValid(start) || !isValid(end)) return;
    
        const newClassName = replaceRowValuesInClass(className, device, Number(start), Number(end));
        updateBlockAttributes(clientId, { className: newClassName });
    };

	const colMax = getGridWidth(device);

	return (
		<div className="vwe-grid-controls">
			<NumberControl
				label="Column start"
				value={colStart}
				onChange={(value) => {
					setColStart(value);
					updateColClass(value, colEnd);
				}}
				min={1}
				max={colMax}
				placeholder="Auto"
			/>
			<NumberControl
				label="Column end"
				value={colEnd}
				onChange={(value) => {
					setColEnd(value);
					updateColClass(colStart, value);
				}}
				min={1}
				max={colMax + 1}
				placeholder="Auto"
			/>
			<NumberControl
				label="Row start"
				value={rowStart}
				onChange={(value) => {
					setRowStart(value);
					updateRowClass(value, rowEnd);
				}}
				min={1}
				placeholder="Auto"
			/>
			<NumberControl
				label="Row end"
				value={rowEnd}
				onChange={(value) => {
					setRowEnd(value);
					updateRowClass(rowStart, value);
				}}
				min={1}
				placeholder="Auto"
			/>
		</div>
	);
};

export default GridPositionControl;

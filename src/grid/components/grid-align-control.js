import {
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	alignWide,
	alignFull,
} from '@wordpress/icons';

const ALIGN_OPTIONS = [
	{ label: 'Start', value: 'start', icon: justifyLeft },
	{ label: 'Center', value: 'center', icon: justifyCenter },
	{ label: 'End', value: 'end', icon: justifyRight },
	{ label: 'Space-between', value: 'space-between', icon: alignWide },
	{ label: 'Stretch', value: 'stretch', icon: alignFull },
];

const getValueFromClass = (className = '', key) => {
	const match = className.match(new RegExp(`has-${key}-([a-z-]+)`));
	return match ? match[1] : '';
};

const replaceAlignClass = (className, key, value) => {
	const cleaned = className.replace(new RegExp(`has-${key}-[a-z-]+`, 'g'), '').trim();
	if (!value) return cleaned;
	return `${cleaned} has-${key}-${value}`.trim();
};

const GridAlignControl = ({ clientId, toolbar = false }) => {
	const { className = '' } = useSelect((select) =>
		select('core/block-editor').getBlockAttributes(clientId),
		[clientId]
	);
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const justifyValue = getValueFromClass(className, 'justify');
	const alignValue = getValueFromClass(className, 'align');

	const update = (key, value) => {
		const newClassName = replaceAlignClass(className, key, value);
		updateBlockAttributes(clientId, { className: newClassName });
	};

	if (toolbar) {
		return (
			<ToolbarGroup>
				{ALIGN_OPTIONS.map((option) => (
					<ToolbarButton
						key={`justify-${option.value}`}
						icon={option.icon}
						label={`Justify ${option.label}`}
						isPressed={justifyValue === option.value}
						onClick={() =>
							update('justify', justifyValue === option.value ? '' : option.value)
						}
					/>
				))}
			</ToolbarGroup>
		);
	}

	return (
		<>
			<SelectControl
				label="Justify content"
				value={justifyValue}
				options={[
					{ label: 'Auto', value: '' },
					...ALIGN_OPTIONS.map(({ label, value }) => ({ label, value })),
				]}
				onChange={(value) => update('justify', value)}
			/>
			<SelectControl
				label="Align content"
				value={alignValue}
				options={[
					{ label: 'Auto', value: '' },
					...ALIGN_OPTIONS.map(({ label, value }) => ({ label, value })),
				]}
				onChange={(value) => update('align', value)}
			/>
		</>
	);
};

export default GridAlignControl;

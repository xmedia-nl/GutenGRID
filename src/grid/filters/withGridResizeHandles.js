import { addFilter } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import ResizeGridSingle from '../resize-grid-single';
import { removeColumnClasses, replaceColumnValuesInClass } from '../css-classname'
import { useSupportsClassName } from '../utils/block-support';


const withGridResizeHandles = (BlockListBlock) => (props) => {
	const { clientId, attributes, name } = props;

	// Alleen directe children van gutengrid/grid
	const isDirectChildOfGrid = useSelect((select) => {
		const editor = select('core/block-editor');
		const parentId = editor.getBlockRootClientId(clientId);
		const parentBlock = editor.getBlock(parentId);
		return parentBlock?.name === 'gutengrid/grid';
	}, [clientId]);

	// Sla wrapper-achtige bloktypes over
	const skipTypes = ['core/group', 'core/columns'];
	if (!isDirectChildOfGrid || skipTypes.includes(name)) {
		return <BlockListBlock {...props} />;
	}

	// Update functie om className aan te passen op basis van drag
	const { updateBlockAttributes } = useDispatch('core/block-editor');
	const supportsClass = useSupportsClassName(clientId);

	return (
		<ResizeGridSingle
			clientId={clientId}
			gridWidth={12}
			onResize={({ direction, start, end, device = 'Desktop' }) => {
				if (typeof start !== 'number' || typeof end !== 'number') {
					return;
				}

				const prefix = {
					Desktop: 'd',
					Tablet: 't',
					Mobile: 'm',
				}[device];

				let newStart = start;
				let newEnd = end;

				// Fallback
				if (newStart >= newEnd) {
					return;
				}
				const newGridClass = `${prefix}-grid-${newStart}-${newEnd}`;
				// const cleanClass = removeColumnClasses(attributes.className || '', device);
				// const newClassName = `${cleanClass} ${newGridClass}`.trim();
				const newClassName = replaceColumnValuesInClass(
					attributes.className || '',
					device,
					newStart,
					newEnd
				);

				updateBlockAttributes(clientId, {
					className: newClassName,
					wrapperClassname: !supportsClass ? newClassName : undefined,

				});
			}}
		>
			<BlockListBlock {...props} />
		</ResizeGridSingle>
	);
};

addFilter(
	'editor.BlockListBlock',
	'gutengrid/with-grid-resize-handles',
	withGridResizeHandles
);


// this registers the handles for the grid
import { addFilter } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import ResizeGridSingle from '../resize-grid-single';
import { removeGridClasses } from '../css-classname'

// import { getOffsetForDevice, getSpanForDevice} from '../../constants'




const withGridResizeHandles = (BlockListBlock) => (props) => {
	const { clientId, attributes, name } = props;

	// Alleen directe children van vwe/grid
	const isDirectChildOfGrid = useSelect((select) => {
		const editor = select('core/block-editor');
		const parentId = editor.getBlockRootClientId(clientId);
		const parentBlock = editor.getBlock(parentId);
		return parentBlock?.name === 'vwe/grid';
	}, [clientId]);

	// Sla wrapper-achtige bloktypes over
	const skipTypes = ['core/group', 'core/columns'];
	if (!isDirectChildOfGrid || skipTypes.includes(name)) {
		return <BlockListBlock {...props} />;
	}

	// Update functie om className aan te passen op basis van drag
	const { updateBlockAttributes } = useDispatch('core/block-editor');

	return (
		<ResizeGridSingle
			clientId={clientId}
			gridWidth={12}
			onResize={({ direction, delta, start, end, device = 'Desktop' }) => {
				if (typeof start !== 'number' || typeof end !== 'number' || isNaN(delta)) return;

				const prefix = {
					Desktop: 'd',
					Tablet: 't',
					Mobile: 'm',
				}[device];

				let newStart = start;
				let newEnd = end;

				if (direction === 'left') {
					newStart = Math.max(1, Math.min(end - 1, start + delta));
				}
				if (direction === 'right') {
					newEnd = Math.min(12, Math.max(start + 1, end + delta));
				}

				// Fallback
				if (newStart >= newEnd) return;

				// want to know the type of attributes.className
				console.log("attributes.className", attributes.className);
				console.log(typeof attributes.className);

				const newGridClass = `${prefix}-grid-${newStart}-${newEnd}`;
				const cleanClass = removeGridClasses(attributes.className || '', device);
				const newClassName = `${cleanClass} ${newGridClass}`.trim();

				updateBlockAttributes(clientId, {
					className: newClassName,
				});
			}}
		>
			<BlockListBlock {...props} />
		</ResizeGridSingle>
	);
};

addFilter(
	'editor.BlockListBlock',
	'vwe/with-grid-resize-handles',
	withGridResizeHandles
);


// this registers the handles for the grid
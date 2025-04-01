import { addFilter } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import ResizeGridSingle from '../resize-grid-single';
import {getGridClassesForBlock, removeGridClasses} from '../css-classname'
import { getOffsetForDevice, getSpanForDevice} from '../../constants'



/**
 * Haalt huidige span uit className, bv. d-grid-1-6
 */
function getSpanFromClassName(className = '') {
	const match = className.match(/d-grid-1-(\d+)/);
	return match ? parseInt(match[1], 10) : 4;
}

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
			onResize={({ direction, delta }) => {
				const current = getSpanFromClassName(attributes?.className);
				const next = Math.min(12, Math.max(1, direction === 'right'
					? current + delta
					: current - delta));
				
				// Update alleen de Desktop span
				const spanAttr = getSpanForDevice(0, 'Desktop');
				const offsetAttr = getOffsetForDevice(0, 'Desktop');
				const newAttributes = {
					[spanAttr]: next,
					[offsetAttr]: attributes[offsetAttr] || 0,
				};

				// Bereken nieuwe className
				const cleanClass = removeGridClasses(attributes.className || '');
				const gridClass = getGridClassesForBlock({ ...attributes, ...newAttributes });
				const newClassName = `${cleanClass} ${gridClass}`.trim();
				console.log(gridClass);
				console.log("clientId (direct) ", clientId);
				updateBlockAttributes(clientId, {
					...newAttributes,
					className: gridClass,
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
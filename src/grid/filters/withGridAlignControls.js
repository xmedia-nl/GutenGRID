import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';

import GridAlignControl from '../components/grid-align-control';

const withGridAlignControls = createHigherOrderComponent((BlockEdit) => (props) => {
	const { clientId, name, isSelected } = props;

	// Check of dit een child is van een vwe/grid
	const parentIsGrid = useSelect((select) => {
		const parentId = select('core/block-editor').getBlockRootClientId(clientId);
		const parentBlock = select('core/block-editor').getBlock(parentId);
		return parentBlock?.name === 'vwe/grid';
	}, [clientId]);

	if (!isSelected || !parentIsGrid) {
		return <BlockEdit {...props} />;
	}

	return (
		<>
			<BlockEdit {...props} />
			<BlockControls>
				<GridAlignControl clientId={clientId} toolbar />
			</BlockControls>
			<InspectorControls>
				<GridAlignControl clientId={clientId} />
			</InspectorControls>
		</>
	);
}, 'withGridAlignControls');

addFilter(
	'editor.BlockEdit',
	'vwe/grid-align-controls',
	withGridAlignControls
);

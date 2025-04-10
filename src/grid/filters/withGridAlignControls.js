import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';

import GridAlignControl from '../components/grid-align-control';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const withGridAlignControls = createHigherOrderComponent((BlockEdit) => (props) => {
	const { clientId, isSelected } = props;

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
				<PanelBody title={__('Uitlijning binnen grid', 'layout-grid')}>
					<GridAlignControl clientId={clientId} />
				</PanelBody>
			</InspectorControls>
		</>
	);
}, 'withGridAlignControls');

addFilter(
	'editor.BlockEdit',
	'vwe/with-grid-align-controls',
	withGridAlignControls
);
import { useSelect } from '@wordpress/data';
import { getBlockType } from '@wordpress/blocks';

export function useSupportsClassName(clientId) {
	return useSelect((select) => {
		const block = select('core/block-editor').getBlock(clientId);
		const blockType = getBlockType(block?.name);
		return blockType?.supports?.className !== false;
	}, [clientId]);
}
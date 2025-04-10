/**
 * WordPress dependencies
 */
import { withSelect, withDispatch } from '@wordpress/data';


function isSiteEditor() {
	const siteEditorWrapper = document.querySelector( '#edit-site-editor' );
	return !! siteEditorWrapper;
}

export function withUpdateAlignment() {
	return withDispatch( ( dispatch, ownProps, registry ) => {
		return {
			/**
			 * Update all child Column blocks with a new vertical alignment setting
			 * based on whatever alignment is passed in. This allows change to parent
			 * to overide anything set on a individual column basis.
			 *
			 * @param {string} verticalAlignment the vertical alignment setting
			 */
			updateAlignment( verticalAlignment ) {
				const { clientId, setAttributes } = ownProps;
				const { updateBlockAttributes } = dispatch(
					'core/block-editor'
				);
				const { getBlockOrder } = registry.select(
					'core/block-editor'
				);

				// Update own alignment.
				setAttributes( { verticalAlignment } );

				// Update all child Column Blocks to match
				const innerBlockClientIds = getBlockOrder( clientId );
				innerBlockClientIds.forEach( ( innerBlockClientId ) => {
					updateBlockAttributes( innerBlockClientId, {
						verticalAlignment,
					} );
				} );
			},
		};
	} );
}


export function withSetPreviewDeviceType() {
	return withDispatch( ( dispatch ) => {
		return {
			setPreviewDeviceType( type ) {
				if ( isSiteEditor() ) {
					return dispatch(
						'core/edit-site'
					)?.__experimentalSetPreviewDeviceType( type );
				}

				dispatch(
					'core/edit-post'
				)?.__experimentalSetPreviewDeviceType( type );
			},
		};
	} );
}


export function withPreviewDeviceType() {
	return withSelect( ( select ) => {
		if ( isSiteEditor() ) {
			return {
				previewDeviceType: select(
					'core/edit-site'
				)?.__experimentalGetPreviewDeviceType(),
			};
		}

		return {
			previewDeviceType: select(
				'core/edit-post'
			)?.__experimentalGetPreviewDeviceType(),
		};
	} );
}

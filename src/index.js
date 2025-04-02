/**
 * WordPress dependencies
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
// import metadata from './block.json';
import '../style.scss';
import '../editor.scss';

/**
 * Internal dependencies
 */
// import './grid/filters/withGridBlockResizing';
import './grid/filters/withGridResizeHandles';

import editGrid from './grid/edit';
import saveGrid from './grid/save';
import { GridIcon } from './icons';
import {
	getSpanForDevice,
	getOffsetForDevice,
	DEVICE_BREAKPOINTS,
	MAX_COLUMNS,
} from './constants';



function getColumnAttributes( total, breakpoints ) {
	const attributes = {};

	for ( let index = 0; index < total; index++ ) {
		breakpoints.map( ( breakpoint ) => {
			attributes[ getSpanForDevice( index, breakpoint ) ] = {
				type: 'number',
			};
			attributes[ getOffsetForDevice( index, breakpoint ) ] = {
				type: 'number',
				default: 0,
			};
		} );
	}

	return attributes;
}

export function registerBlock() {
	console.debug('registerBlock');
	registerBlockType( 'vwe/grid', {
		title: __( 'Layout Grid', 'layout-grid' ),
		description: __(
			'Align blocks to a global grid, with support for responsive breakpoints.',
			'layout-grid'
		),
		icon: GridIcon,
		category: 'design',
		supports: {
			align: [ 'full' ],
			html: false,
		},
		example: {
			attributes: {
				columns: 2,
			},
			innerBlocks: [
				
			],
		},
		attributes: {
			gutterSize: {
				type: 'string',
				default: 'large',
			},
			addGutterEnds: {
				type: 'boolean',
				default: true,
			},
			verticalAlignment: {
				type: 'string',
			},
			...getColumnAttributes( MAX_COLUMNS, DEVICE_BREAKPOINTS ),
		},
		edit: editGrid,
		save: saveGrid,
	} );

}
registerBlock();
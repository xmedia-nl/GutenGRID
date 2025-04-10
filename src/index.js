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
import './grid/filters/withGridPositionControl';

import editGrid from './grid/edit';
import saveGrid from './grid/save';
import { GridIcon } from './icons';

export function registerBlock() {
	console.debug('registerBlock');
	registerBlockType('vwe/grid', {
		title: __('Layout Grid', 'layout-grid'),
		description: __(
			'Align blocks to a global grid, with support for responsive breakpoints.',
			'layout-grid'
		),
		icon: GridIcon,
		category: 'layout',
		supports: {
			align: ['full'],
			html: false,
		},
		keywords: ['grid', 'layout', '_structure'],
		example: {
			attributes: {
				className: 'has-preview-style',
			},
			innerBlocks: [
				...Array.from({ length: 14 }).map((_, i) => {
					const index = i + 1;
					const isEdge = index === 1 || index === 14;
					const background = isEdge ? '#000' : '#B9E5FB';
					return {
						name: 'core/group',
						attributes: {
							className: `preview-col d-row-1-3 t-row-1-3 m-row-1-3 d-grid-${index}-${index} t-grid-${index}-${index} m-grid-${index}-${index} `,
							style: {
								color: { background },
								layout: { display: 'block' },
								dimensions: { minHeight: '120px', height: '100%' },
							},
						},
					};
				}),
				{
					name: 'core/paragraph',
					attributes: {
						content: '<strong>Snow Patrol</strong>',
						align: 'center',
						style: {
							typography: {
								fontSize: 48,
							},
						},
						className: 'd-row-1-2 t-row-1-2 d-grid-2-6 t-grid-2-6 m-grid-2-5 preview-handles',
					},
				},
				{
					name: 'core/paragraph',
					attributes: {
						content:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						align: 'left',
						className: 'd-row-1-4 t-row-1-4 d-grid-7-14 t-grid-7-14 m-grid-5-10 preview-handles',
						style: {
							dimensions: {
								height: '100%'
							},
							layout: { display: 'block' },
						},
					},
				},
				{
					name: 'core/buttons',
					innerBlocks: [
						{
							name: 'core/button',
							attributes: {
								text: 'Meer informatie',
								className: 'is-style-fill',
							},
						},
					],
					attributes: {
						className: 'd-row-2-3 t-row-2-3 d-grid-3-6 t-grid-3-6 m-grid-3-5 preview-handles',
					},
				},
			],
		},
		attributes: {
		},
		edit: editGrid,
		save: saveGrid,
	});

}
registerBlock();
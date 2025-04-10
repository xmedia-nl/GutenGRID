/**
 * External dependencies
 */
import { times } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import { Component, createRef } from '@wordpress/element';
import {
	PanelBody,
	TextControl,
	ButtonGroup,
	Button,
	IconButton,
	Placeholder,
	ToggleControl,
	SelectControl,
	Disabled,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { compose } from '@wordpress/compose';
import { detectBoGridPresence } from './utils/bo-grid-check';


/**
 * Internal dependencies
 */

import {
	removeColumnClasses
} from './css-classname';
import {
	getLayouts,
} from '../constants';
import { getGridWidth } from './grid-defaults';
import PreviewDevice from './preview-device';
import { Notice } from '@wordpress/components';

import {
	withUpdateAlignment,
	withSetPreviewDeviceType,
	withPreviewDeviceType,
} from './higher-order';
import GridOverlay from './grid-overlay';

const MINIMUM_RESIZE_SIZE = 50; // Empirically determined to be a good size

const BLOCKS_TEMPLATE = [
	[
		'core/heading',
		{
			content: 'Lorum Ipsum',
			className: 'd-row-1 d-grid-2-6 t-grid-2-6 m-grid-2-5',
			style: {
				typography: { fontSize: '48px' },
				color: { text: '#ffffff' },
			},
		},
	],
	[
		'core/paragraph',
		{
			content: 'Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
			className: 'd-row-1 d-grid-6-14 t-grid-6-14 m-grid-5-10',
		},
	],
	[
		'core/buttons',
		{
			className: 'd-row-2 d-grid-2-6 t-grid-2-6 m-grid-2-10',
		},
		[
			[
				'core/button',
				{
					text: 'Click here',
					className: 'is-style-fill',
				},
			],
		],
	],
];


class Edit extends Component {
	constructor(props) {
		super(props);

		this.overlayRef = createRef();
		this.state = {
			inspectorDeviceType: 'Desktop',
			viewPort: 'Desktop',
			hasBoGrid: true,
			hoveredColumn: null,
		};
	}
	componentDidMount() {
		const hasGrid = detectBoGridPresence();
		this.setState({ hasBoGrid: hasGrid });
		this.addEditorGridClasses();

	}
	componentDidUpdate() {
		this.addEditorGridClasses();
	}
	componentWillUnmount() {
	}
	addEditorGridClasses = () => {
		const container = this.overlayRef.current;
		if (!container) return;

		const innerBlocksLayout = container.querySelector('.block-editor-block-list__layout');
		if (!innerBlocksLayout) return;

		['d-full', 't-full', 'm-full', 'bo-grid'].forEach((cls) => {
			if (!innerBlocksLayout.classList.contains(cls)) {
				innerBlocksLayout.classList.add(cls);
			}
		});
	};

	canResizeBreakpoint(device) {
		if (this.overlayRef && this.overlayRef.current) {
			const { width } = this.overlayRef.current.getBoundingClientRect();

			return width / getGridWidth(device) > MINIMUM_RESIZE_SIZE;
		}

		return false;
	}

	updateInspectorDevice(device) {
		this.setState({ inspectorDeviceType: device });

		// Only update if not on mobile
		if (this.state.viewPort !== 'Mobile') {
			this.props.setPreviewDeviceType(device);
		}
	}

	getPreviewMode() {
		// If we're rendering within a pattern preview, use the desktop layout for the preview.
		if (this.props.isBlockOrPatternPreview) {
			return 'Desktop';
		}

		// If we're on desktop, or the preview is set to mobile, then return the preview mode
		if (
			this.state.viewPort === 'Desktop' ||
			this.props.previewDeviceType === 'Mobile'
		) {
			return this.props.previewDeviceType;
		}

		// Return something appropriate for the viewport (mobile or tablet)
		return this.state.viewPort;
	}

	getInspectorMode() {
		if (this.state.viewPort === 'Desktop') {
			return this.props.previewDeviceType;
		}

		// Return something appropriate for the viewport (mobile or tablet)
		return this.state.inspectorDeviceType;
	}
	handleGridHover = (e) => {
		this.setState({ hoveredColumn: e.detail.col });
	};
	render() {
		const {
			className,
			attributes = {},
			isSelected,
			columns,
			setAttributes,
			updateAlignment,
			columnAttributes,
		} = this.props;
		const { viewPort } = this.state;
		const previewMode = this.getPreviewMode();
		const inspectorDeviceType = this.getInspectorMode();

		const { verticalAlignment } = attributes;
		// const layoutGrid = new LayoutGrid(attributes, previewMode, columns);
		const classes = classnames(
			removeColumnClasses(className, previewMode).replace(
				'layout-grid',
				'layout-grid-editor'
			),
			'wp-block-gutengrid-editor',
			{
				'wp-block-jetpack-layout-tablet': previewMode === 'Tablet',
				'wp-block-jetpack-layout-desktop': previewMode === 'Desktop',
				'wp-block-jetpack-layout-mobile': previewMode === 'Mobile',
				'wp-block-jetpack-layout-resizable': this.canResizeBreakpoint(
					previewMode
				),
				[`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
			},
		);



		return (
			<>
				<PreviewDevice
					currentViewport={viewPort}
					updateViewport={(newPort) =>
						this.setState({
							viewPort: newPort,
							inspectorDeviceType: newPort,
						})
					}
				/>

				<div className={classes} ref={this.overlayRef}>
					<GridOverlay device={previewMode} />
					{!this.state.hasBoGrid && (
						<Notice status="warning" isDismissible={false}>
							<strong>{__('BO Grid missing', 'gutengrid')}</strong>
							<p>
								{__(
									'This block requires the theme to implement a .bo-grid layout on the <main> element. Please ensure your theme supports BO Grid for correct layout behavior. A starter theme will be available soon.',
									'gutengrid'
								)}
							</p>
						</Notice>
					)}

					<InnerBlocks
						template={BLOCKS_TEMPLATE}
						templateLock={false}
						allowedBlocks={undefined}
					/>
				</div>

				<InspectorControls>
					<PanelBody title={__('Responsive Breakpoints', 'gutengrid')}>
						<p className="gutengrid-help">
							{__(
								"Previewing your post will show your browser's breakpoint, not the currently selected one.",
								'gutengrid'
							)}
						</p>
						<ButtonGroup>
							{getLayouts().map((layout) => (
								<Button
									key={layout.value}
									isPrimary={
										layout.value === inspectorDeviceType
									}
									onClick={() =>
										this.updateInspectorDevice(layout.value)
									}
								>
									{layout.label}
								</Button>
							))}
						</ButtonGroup>

					</PanelBody>


				</InspectorControls>

				<BlockControls>
					<BlockVerticalAlignmentToolbar
						onChange={updateAlignment}
						value={verticalAlignment}
					/>
				</BlockControls>
			</>
		);

	}
}

function MaybeDisabledEdit(props) {
	return (
		<Disabled.Consumer>
			{(isDisabled) => {
				return (
					<Edit {...props} isBlockOrPatternPreview={isDisabled} />
				);
			}}
		</Disabled.Consumer>
	);
}

export default compose([
	withUpdateAlignment(),
	withSetPreviewDeviceType(),
	withPreviewDeviceType(),
])(MaybeDisabledEdit);

// Edit.js
// External dependencies
import classnames from 'classnames';

// WordPress dependencies
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import { Component, createRef, useEffect } from '@wordpress/element';
import {
	PanelBody,
	ButtonGroup,
	Button,
	Disabled,
	Notice,
} from '@wordpress/components';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';

// Internal utilities & constants
import { detectBoGridPresence } from './utils/bo-grid-check';
import { removeColumnClasses } from './css-classname';
import { getLayouts } from '../constants';
import { getGridWidth } from './grid-defaults';

// Internal components
import GridBackgroundControl from './components/grid-background-control';
import GridSpacingControl from './components/grid-spacing-control';
import GridBackground from './grid-background';
import PreviewDevice from './preview-device';
import GridOverlay from './grid-overlay';
import { getMaxRowClassNames } from './utils/block-support';

// Internal HOCs
import {
	withUpdateAlignment,
	withSetPreviewDeviceType,
	withPreviewDeviceType,
} from './higher-order';



const MINIMUM_RESIZE_SIZE = 50;
const BLOCKS_TEMPLATE = [
	['core/heading', { content: 'Lorum Ipsum', className: 'd-row-1 d-grid-2-6 t-grid-2-6 m-grid-2-5' }],
	['core/paragraph', { content: 'Lorem ipsum...', className: 'd-row-1 d-grid-6-14 t-grid-6-14 m-grid-5-10' }],
	['core/buttons', { className: 'd-row-2 d-grid-2-6 t-grid-2-6 m-grid-2-10' }, [[
		'core/button', { text: 'Click here', className: 'is-style-fill' }
	]]],
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
		const { attributes, setAttributes, clientId } = this.props;


		if (!attributes.maxRowClasses) {
			const maxRowClasses = this.getTheRowClasses();
			setAttributes({ maxRowClasses });
		}
		if (!attributes.uniqueId) {
			setAttributes({ uniqueId: clientId });
		}

	}
	getTheRowClasses = () => {
		const { attributes } = this.props;
		const innerBlocks = select('core/block-editor').getBlock(this.props.clientId)?.innerBlocks || [];
		const maxRowClasses = getMaxRowClassNames(innerBlocks);
		return maxRowClasses;
	}
	addEditorGridClasses = () => {
		const container = this.overlayRef.current;
		if (!container) return;
		const layout = container.querySelector('.block-editor-block-list__layout');
		if (!layout) return;
		['d-full', 't-full', 'm-full', 'bo-grid'].forEach((cls) => layout.classList.add(cls));
	};
	canResizeBreakpoint(device) {
		const rect = this.overlayRef.current?.getBoundingClientRect();
		return rect && rect.width / getGridWidth(device) > MINIMUM_RESIZE_SIZE;
	}
	updateInspectorDevice(device) {
		this.setState({ inspectorDeviceType: device });
		if (this.state.viewPort !== 'Mobile') {
			this.props.setPreviewDeviceType(device);
		}
	}
	getPreviewMode() {
		if (this.props.isBlockOrPatternPreview) return 'Desktop';
		if (this.state.viewPort === 'Desktop' || this.props.previewDeviceType === 'Mobile') {
			return this.props.previewDeviceType;
		}
		return this.state.viewPort;
	}
	getInspectorMode() {
		return this.state.viewPort === 'Desktop' ? this.props.previewDeviceType : this.state.inspectorDeviceType;
	}
	render() {
		const {
			className,
			attributes = {},
			isSelected,
			setAttributes,
			updateAlignment,
			clientId,
		} = this.props;
		const previewMode = this.getPreviewMode();
		const inspectorDeviceType = this.getInspectorMode();
		const {
			verticalAlignment,
			backgroundType,
			backgroundColorSlug,
			backgroundGradientSlug,
			backgroundImage,
			backgroundWidth,
			gridPadding = {},
		} = attributes;
		const paddingClass =
			(previewMode === 'Mobile' && gridPadding.mobile) ||
			(previewMode === 'Tablet' && gridPadding.tablet) ||
			gridPadding.desktop || '';

		let inlineStyle = {};

		const currentPadValue =
			(previewMode === 'Mobile' && gridPadding.mobile) ||
			(previewMode === 'Tablet' && gridPadding.tablet) ||
			gridPadding.desktop || '';

		if (currentPadValue?.startsWith('c-')) {
			const px = parseInt(currentPadValue.replace('c-', ''), 10);
			if (!isNaN(px)) {
				inlineStyle = {
					paddingTop: `${px}px`,
					paddingBottom: `${px}px`,
				};
			}
		}

		const classes = classnames(
			removeColumnClasses(className || '', previewMode).replace('layout-grid', 'layout-grid-editor'),
			'wp-block-gutengrid-editor',
			{
				'wp-block-jetpack-layout-tablet': previewMode === 'Tablet',
				'wp-block-jetpack-layout-desktop': previewMode === 'Desktop',
				'wp-block-jetpack-layout-mobile': previewMode === 'Mobile',
				'wp-block-jetpack-layout-resizable': this.canResizeBreakpoint(previewMode),
				[`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
			},
			{
				[`d-pad-vert-${gridPadding.desktop}`]: previewMode === 'Desktop' && gridPadding.desktop && !gridPadding.desktop.startsWith('c-'),
				[`t-pad-vert-${gridPadding.tablet}`]: previewMode === 'Tablet' && gridPadding.tablet && !gridPadding.tablet.startsWith('c-'),
				[`m-pad-vert-${gridPadding.mobile}`]: previewMode === 'Mobile' && gridPadding.mobile && !gridPadding.mobile.startsWith('c-'),
			}
		);



		return (
			<>
				<PreviewDevice
					currentViewport={this.state.viewPort}
					updateViewport={(newPort) => this.setState({ viewPort: newPort, inspectorDeviceType: newPort })}
				/>

				<div className={classes} ref={this.overlayRef} style={inlineStyle}>
					<GridOverlay device={previewMode} />
					<GridBackground
						clientId={clientId}
						backgroundType={backgroundType || 'none'}
						backgroundColorSlug={backgroundColorSlug || ''}
						backgroundGradientSlug={backgroundGradientSlug || ''}
						backgroundImage={backgroundImage || ''}
						backgroundWidth={backgroundWidth || 'main'}
						maxRowClasses={this.getTheRowClasses()}
						isEditor={true}
					/>

					{!this.state.hasBoGrid && (
						<Notice status="warning" isDismissible={false}>
							<strong>{__('BO Grid missing', 'gutengrid')}</strong>
							<p>{__('This block requires the theme to implement a .bo-grid layout.', 'gutengrid')}</p>
						</Notice>
					)}
					<InnerBlocks template={BLOCKS_TEMPLATE} templateLock={false} />
				</div>

				<InspectorControls>
					<GridBackgroundControl clientId={clientId} />
					<GridSpacingControl
						clientId={clientId}
						currentViewport={previewMode}
					/>
					<PanelBody title={__('Responsive Breakpoints', 'gutengrid')}>
						<ButtonGroup>
							{getLayouts().map((layout) => (
								<Button
									key={layout.value}
									isPrimary={layout.value === inspectorDeviceType}
									onClick={() => this.updateInspectorDevice(layout.value)}
								>
									{layout.label}
								</Button>
							))}
						</ButtonGroup>
					</PanelBody>
				</InspectorControls>

				<BlockControls>
					<BlockVerticalAlignmentToolbar onChange={updateAlignment} value={verticalAlignment} />
				</BlockControls>
			</>
		);
	}
}

function MaybeDisabledEdit(props) {
	return (
		<Disabled.Consumer>
			{(isDisabled) => <Edit {...props} isBlockOrPatternPreview={isDisabled} />}
		</Disabled.Consumer>
	);
}

export default compose([
	withUpdateAlignment(),
	withSetPreviewDeviceType(),
	withPreviewDeviceType(),
])(MaybeDisabledEdit);

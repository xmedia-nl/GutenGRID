/**
 * External dependencies
 */
import { View, Dimensions } from 'react-native';
/**
 * WordPress dependencies
 */
import {
	InnerBlocks,
	InspectorControls,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} from '@wordpress/block-editor';
import { PanelBody, alignmentHelpers } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { compose, useResizeObserver } from '@wordpress/compose';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import variations from './variations';
import VariationControl from './variation-control';
import {
	DEVICE_BREAKPOINTS,
	getSpanForDevice,
	getOffsetForDevice,
} from './../constants';
import { getDefaultSpan } from './grid-defaults';
import {
	withUpdateAlignment,
	withUpdateColumns,
	withColumns,
	withColumnAttributes,
} from './higher-order';
import styles from './edit.native.scss';


const DEFAULT_TEMPLATE = [
	[ 'vwe/grid-column', {}, [] ],
	[ 'vwe/grid-column', {}, [] ],
];

const { isFullWidth } = alignmentHelpers;

function ColumnsEdit( {
	clientId,
	attributes = {},
	columns,
	updateAlignment,
	updateColumns,
} ) {
	const { verticalAlignment, align } = attributes;

	const [ isDefaultColumns, setDefaultColumns ] = useState( false );
	if ( ! columns ) {
		// Set the default column on the next tick.
		// This is done so that the insertion of the Layout Grid Block inside other blocks
		// such as thr group block or itself doesn't conflict with removal BlockPicker BottomSheet
		// and the VariationControl BottomSheet.
		// And we end up with a state where the VariationControl is set to be visible
		// but not dismissible.
		// eslint-disable-next-line @wordpress/react-no-unsafe-timeout
		setTimeout( () => {
			setDefaultColumns( true );
		}, 0 );
	}

	const [ resizeListener, sizes ] = useResizeObserver();
	const { width } = sizes || {};

	const onChangeLayout = ( selectedColumn ) => {
		const columnValues = {};
		const numberOfColumns = selectedColumn.innerBlocks.length;
		// An array containing the [ 0, 1 ... numberOfColumns ]
		const columnsArray = [ ...Array( numberOfColumns ).keys() ];
		columnsArray.forEach( ( position ) => {
			DEVICE_BREAKPOINTS.forEach( ( deviceName ) => {
				const defaultSpan = getDefaultSpan(
					deviceName,
					numberOfColumns,
					position
				);
				columnValues[
					getSpanForDevice( position, deviceName )
				] = defaultSpan;

				columnValues[ getOffsetForDevice( position, deviceName ) ] = 0;
			} );
		} );

		setDefaultColumns( false );
		updateColumns( columns, numberOfColumns, columnValues );
	};

	const screenWidth = Math.floor( Dimensions.get( 'window' ).width );
	const selectedColumnsName = columns ? variations[ columns - 1 ].name : null;

	return (
		<>
			{ resizeListener }
			<View style={ styles[ 'grid-columns' ] }>
				<InnerBlocks
					template={ isDefaultColumns ? DEFAULT_TEMPLATE : null }
					templateLock="all"
					allowedBlocks={ undefined }
					orientation={ columns !== 1 ? 'horizontal' : undefined }
					horizontal={ columns !== 1 }
					contentResizeMode="stretch"
					parentWidth={ isFullWidth( align ) ? screenWidth : width }
					blockWidth={ isFullWidth( align ) ? screenWidth : width }
					contentStyle={ {
						width: width ? width : screenWidth,
					} }
				/>
			</View>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'layout-grid' ) }>
					<VariationControl.Inner
						variations={ variations }
						onChange={ onChangeLayout }
						selected={ selectedColumnsName }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={ updateAlignment }
					value={ verticalAlignment }
				/>
			</BlockControls>
			<VariationControl
				variations={ variations }
				onClose={ () => {
					setDefaultColumns( false );
				} }
				clientId={ clientId }
				onChange={ onChangeLayout }
				hasLeftButton={ true }
				isVisible={ isDefaultColumns }
			/>
		</>
	);
}

export default compose( [
	withUpdateAlignment(),
	withUpdateColumns(),
	withColumns(),
	withColumnAttributes(),
] )( ColumnsEdit );

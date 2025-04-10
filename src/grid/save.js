/**
 * External dependencies
 */

import classnames from 'classnames';

/**
 * WordPress dependencies
 */

import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */

import { getAsCSS, removeColumnClasses } from './css-classname';

const save = ({ attributes, innerBlocks }) => {
	const device = attributes.device;
	const {
		className,
	} = attributes;
	const classes = classnames(
		removeColumnClasses(className, device),
		'd-full',
		't-full',
		'm-full',
		'bo-grid',
	);

	return (
		<div className={classes}>
			<InnerBlocks.Content />
		</div>
	);
};

export default save;

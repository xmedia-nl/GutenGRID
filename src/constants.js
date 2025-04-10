/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { mobile, tablet, desktop } from '@wordpress/icons';


export const DEVICE_DESKTOP = 'Desktop';
export const DEVICE_TABLET = 'Tablet';
export const DEVICE_MOBILE = 'Mobile';

export const getLayouts = () => [
	{
		value: DEVICE_DESKTOP,
		label: __( 'Desktop', 'layout-grid' ),
		icon: desktop,
	},
	{
		value: DEVICE_TABLET,
		label: __( 'Tablet', 'layout-grid' ),
		icon: tablet,
	},
	{
		value: DEVICE_MOBILE,
		label: __( 'Mobile', 'layout-grid' ),
		icon: mobile,
	},
];


export const DEVICE_BREAKPOINTS = [
	DEVICE_DESKTOP,
	DEVICE_TABLET,
	DEVICE_MOBILE,
];

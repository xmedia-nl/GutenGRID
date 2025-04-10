/**
 * WordPress dependencies
 */

import { Path, SVG, Rect } from '@wordpress/components';


export const HalfLeftIcon = (props) => (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
		<Path d="M4 4h8v16H4zM14 4h6v16h-6z" fill="#ccc" />
	</SVG>
);

export const HalfRightIcon = (props) => (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
		<Path d="M4 4h6v16H4zM12 4h8v16h-8z" fill="#ccc" />
	</SVG>
);

export const FullCenterIcon = (props) => (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
		<Path d="M4 4h16v16H4z" fill="#ccc" />
	</SVG>
);

export const GridIcon = (props) => (
	<SVG
		viewBox="0 0 20.5 16"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<Rect x="3.5" y="0" width="3" height="16" fill="#27aae1" />
		<Rect x="0" y="0" width="3" height="16" fill="#b9e5fb" />
		<Rect x="7" y="0" width="3" height="16" fill="#27aae1" />
		<Rect x="10.5" y="0" width="3" height="16" fill="#27aae1" />
		<Rect x="14" y="0" width="3" height="16" fill="#27aae1" />
		<Rect x="17.5" y="0" width="3" height="16" fill="#b9e5fb" />
	</SVG>
);

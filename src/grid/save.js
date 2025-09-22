// Save.js
import classnames from 'classnames';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { removeColumnClasses } from './css-classname';
import GridBackground from './grid-background';

const getAllCustomPaddings = (padding) => {
	const paddings = [];
	if (padding?.desktop?.startsWith('c-')) {
		paddings.push({ px: parseInt(padding.desktop.replace('c-', ''), 10), breakpoint: 'd' });
	}
	if (padding?.tablet?.startsWith('c-')) {
		paddings.push({ px: parseInt(padding.tablet.replace('c-', ''), 10), breakpoint: 't' });
	}
	if (padding?.mobile?.startsWith('c-')) {
		paddings.push({ px: parseInt(padding.mobile.replace('c-', ''), 10), breakpoint: 'm' });
	}
	return paddings;
};

const save = ({ attributes }) => {
	const {
		className,
		maxRowClasses,
		uniqueId,
		gridPadding = {},
	} = attributes;

	// Helper function to get responsive background values with proper fallback
	const getResponsiveBackgroundValue = (attribute, device = '') => {
		let devicePrefix = device;
		if (!devicePrefix) {
			// For save, we need to determine which values to use
			// Priority: Desktop -> Tablet -> Mobile -> Base
			const dValue = attributes[`d${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`];
			const tValue = attributes[`t${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`];
			const mValue = attributes[`m${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`];
			const baseValue = attributes[attribute];
			
			// Use desktop value if available, otherwise fallback chain
			return dValue !== '' && dValue !== undefined ? dValue : 
				   tValue !== '' && tValue !== undefined ? tValue :
				   mValue !== '' && mValue !== undefined ? mValue :
				   baseValue;
		}
		
		const deviceValue = attributes[`${devicePrefix}${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`];
		const baseValue = attributes[attribute];
		return deviceValue !== '' && deviceValue !== undefined ? deviceValue : baseValue;
	};

	// Get responsive background values (prioritize desktop for save)
	const backgroundType = getResponsiveBackgroundValue('backgroundType') || 'none';
	const backgroundColorSlug = getResponsiveBackgroundValue('backgroundColorSlug') || '';
	const backgroundGradientSlug = getResponsiveBackgroundValue('backgroundGradientSlug') || '';
	const backgroundImage = getResponsiveBackgroundValue('backgroundImage') || '';
	const backgroundWidth = getResponsiveBackgroundValue('backgroundWidth') || 'main';
	const backgroundRepeat = getResponsiveBackgroundValue('backgroundRepeat') || 'no';
	const backgroundSize = getResponsiveBackgroundValue('backgroundSize') || 'cover';
	const backgroundSizeX = getResponsiveBackgroundValue('backgroundSizeX') || '100%';
	const backgroundSizeY = getResponsiveBackgroundValue('backgroundSizeY') || '100%';
	const backgroundPosition = getResponsiveBackgroundValue('backgroundPosition') || 'center';
	const backgroundPositionX = getResponsiveBackgroundValue('backgroundPositionX') || '50';
	const backgroundPositionY = getResponsiveBackgroundValue('backgroundPositionY') || '50';

	const paddingClasses = [];
	if (gridPadding.desktop && !gridPadding.desktop.startsWith('c-')) paddingClasses.push(`d-pad-vert-${gridPadding.desktop}`);
	if (gridPadding.tablet && !gridPadding.tablet.startsWith('c-')) paddingClasses.push(`t-pad-vert-${gridPadding.tablet}`);
	if (gridPadding.mobile && !gridPadding.mobile.startsWith('c-')) paddingClasses.push(`m-pad-vert-${gridPadding.mobile}`);

	const allCustomPaddings = getAllCustomPaddings(gridPadding);

	const customPadding = allCustomPaddings.find(Boolean); // pick the first custom padding for inline styles (fallback)

	const customStyleTag = uniqueId && allCustomPaddings.length > 0 ? (
		<style
			dangerouslySetInnerHTML={{
				__html: allCustomPaddings.map(({ px, breakpoint }) => {
					const media = breakpoint === 'm'
						? '(max-width: 767px)'
						: breakpoint === 't'
							? '(max-width: 1199px)'
							: '(min-width: 1200px)';
					return `
					@media ${media} {
						[data-id="block_${uniqueId}"] {
							padding-top: ${px}px;
							padding-bottom: ${px}px;
						}
					}`;
				}).join('\n')
			}}
		/>
	) : null;

	const blockProps = useBlockProps.save({
		className: classnames(
			removeColumnClasses(className, 'all'),
			'd-full',
			't-full',
			'm-full',
			'bo-grid',
			...paddingClasses
		),
		'data-id': uniqueId ? `block_${uniqueId}` : undefined
	});

	return (
		<>
			{customStyleTag}
			<div {...blockProps}>
				<GridBackground
					clientId={uniqueId}
					backgroundType={backgroundType}
					backgroundColorSlug={backgroundColorSlug}
					backgroundGradientSlug={backgroundGradientSlug}
					backgroundImage={backgroundImage}
					backgroundWidth={backgroundWidth}
					backgroundRepeat={backgroundRepeat}
					backgroundSize={backgroundSize}
					backgroundSizeX={backgroundSizeX}
					backgroundSizeY={backgroundSizeY}
					backgroundPosition={backgroundPosition}
					backgroundPositionX={backgroundPositionX}
					backgroundPositionY={backgroundPositionY}
					isEditor={false}
					maxRowClasses={maxRowClasses}
				/>
				<InnerBlocks.Content />
			</div>
		</>
	);
};

export default save;

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
		backgroundType = 'none',
		backgroundColorSlug = '',
		backgroundGradientSlug = '',
		backgroundImage = '',
		backgroundWidth = 'main',
		maxRowClasses,
		uniqueId,
		padding = {},
	} = attributes;

	console.log('Save attributes:', attributes);
	const paddingClasses = [];
	if (padding.desktop && !padding.desktop.startsWith('c-')) paddingClasses.push(`d-pad-${padding.desktop}`);
	if (padding.tablet && !padding.tablet.startsWith('c-')) paddingClasses.push(`t-pad-${padding.tablet}`);
	if (padding.mobile && !padding.mobile.startsWith('c-')) paddingClasses.push(`m-pad-${padding.mobile}`);

	const allCustomPaddings = getAllCustomPaddings(padding);

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
					backgroundType={backgroundType || 'none'}
					backgroundColorSlug={backgroundColorSlug || ''}
					backgroundGradientSlug={backgroundGradientSlug || ''}
					backgroundImage={backgroundImage || ''}
					backgroundWidth={backgroundWidth || 'main'}
					isEditor={false}
					maxRowClasses={maxRowClasses}
				/>
				<InnerBlocks.Content />
			</div>
		</>
	);
};

export default save;

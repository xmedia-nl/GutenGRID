//  grid-background.js
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';

const GridBackground = (props) => {

    const { attributes } = props;
    // .check if attributes.disableGutengridBackground is true. If so, return null.
    if (attributes && attributes.disableGutengridBackground === true) {
        console.debug('GridBackground: Background disabled via attributes.');
        return null;
    }else{
        console.debug('GridBackground: Rendering background with attributes:', attributes);
    }

    const {
        backgroundType = 'none',
        backgroundColorSlug = '',
        backgroundGradientSlug = '',
        backgroundImage = '',
        backgroundWidth = 'main',
        backgroundRepeat = 'no',
        backgroundSize = 'cover',
        backgroundSizeX = 'auto',
        backgroundSizeY = 'auto',
        backgroundPosition = 'center',
        backgroundPositionX = '50',
        backgroundPositionY = '50',
        isEditor = false,
        clientId = ''
    } = props;
    let { maxRowClasses } = props;
    // Early return if no background type or it's none
    if (!backgroundType || backgroundType === 'none') {
        return null;
    }

    try {
        if (!maxRowClasses) {
            maxRowClasses = [];
        }
        // Compute background style with validation
        let bgStyle = {};
        
        if (backgroundType === 'color' && backgroundColorSlug) {
            bgStyle.backgroundColor = `var(--wp--preset--color--${backgroundColorSlug})`;
        }

        if (backgroundType === 'gradient' && backgroundGradientSlug) {
            bgStyle.background = `var(--wp--preset--gradient--${backgroundGradientSlug})`;
        }
        
        if (backgroundImage && backgroundType === 'image') {
            bgStyle.backgroundImage = `url(${backgroundImage})`;
            
            // Apply repeat
            const repeatMap = {
                no: 'no-repeat',
                yes: 'repeat',
                x: 'repeat-x',
                y: 'repeat-y'
            };
            bgStyle.backgroundRepeat = repeatMap[backgroundRepeat] || 'no-repeat';

            // Handle manual positioning with absolute layout
            if (backgroundPosition === 'manual') {
                bgStyle.position = 'absolute';
                // Use the values directly as they can now contain units
                bgStyle.top = backgroundPositionY || '50%';
                bgStyle.left = backgroundPositionX || '50%';
                
                // Apply size for absolute positioning
                if (backgroundSize === 'manual') {
                    // For manual size: set container dimensions AND background size
                    bgStyle.width = backgroundSizeX || '100%';
                    bgStyle.height = backgroundSizeY || '100%';
                    bgStyle.backgroundSize = `${backgroundSizeX || '100%'} ${backgroundSizeY || '100%'}`;
                } else {
                    // For cover/contain: set container dimensions and let background-size handle the image
                    bgStyle.width = backgroundSizeX || '100%';
                    bgStyle.height = backgroundSizeY || '100%';
                    bgStyle.backgroundSize = backgroundSize; // cover or contain
                }
            } else {
                // Normal positioning flow
                if (backgroundSize === 'manual') {
                    bgStyle.backgroundSize = `${backgroundSizeX || '100%'} ${backgroundSizeY || '100%'}`;
                } else {
                    bgStyle.backgroundSize = backgroundSize;
                }

                // Apply standard position
                const positionMap = {
                    'top-left': 'top left',
                    'top': 'top center',
                    'top-right': 'top right',
                    'left': 'center left',
                    'center': 'center center',
                    'right': 'center right',
                    'bottom-left': 'bottom left',
                    'bottom': 'bottom center',
                    'bottom-right': 'bottom right'
                };
                bgStyle.backgroundPosition = positionMap[backgroundPosition] || 'center center';
            }
        }

        // Compute classes with validation
        let bgClass = '';
        if (backgroundType === 'color' && backgroundColorSlug) {
            bgClass = `has-${backgroundColorSlug}-background-color`;
        } else if (backgroundType === 'gradient' && backgroundGradientSlug) {
            bgClass = `has-${backgroundGradientSlug}-gradient-background`;
        }

        // Compute class names safely
        const widthClasses = backgroundWidth === 'full' ? 'd-full t-full m-full' : 'd-main t-main m-main';

        const bgClasses = classnames('gutengrid-background', {
            [widthClasses]: backgroundPosition !== 'manual', // Only apply width classes when not absolutely positioned
            [bgClass]: bgClass !== '',
            'is-absolute': backgroundPosition === 'manual' && backgroundType === 'image'
        });

        // Add relative positioning to wrapper when using absolute positioning
        const wrapperStyle = backgroundPosition === 'manual' && backgroundType === 'image' ? { position: 'relative' } : {};

        return (
            <div className="gutengrid-background__wrapper d-full t-full m-full bo-grid" style={wrapperStyle} aria-hidden="true">
                <div className={bgClasses} style={bgStyle} />
            </div>
        );

    } catch (err) {
        console.error('Error in GridBackground:', err);
        return null;
    }
};

export default GridBackground;
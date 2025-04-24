//  grid-background.js
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';

const GridBackground = (props) => {
    console.log('GridBackground received props:', props);

    // Destructure with default values
    const {
        backgroundType = 'none',
        backgroundColorSlug = '',
        backgroundGradientSlug = '',
        backgroundImage = '',
        backgroundWidth = 'main',
        isEditor = false,
        clientId = ''
    } = props;
    let { maxRowClasses } = props;
    // Early return if no background type or it's none
    if (!backgroundType || backgroundType === 'none') {
        console.log('Early return with no background');
        return null;
    }

    try {
        if (!maxRowClasses) {
            maxRowClasses = [];
        }
        // Compute background style with validation
        let bgStyle = {};
        if (backgroundImage && backgroundType === 'image') {
            bgStyle = { backgroundImage: `url(${backgroundImage})` };
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
            [widthClasses]: true,
            [bgClass]: bgClass !== ''
        });




        console.log('Rendering background with:', { bgClasses, bgStyle });

        console.log('Rendering background for editor');
        return (
            <div className="gutengrid-background__wrapper d-full t-full m-full bo-grid" aria-hidden="true">
                <div className={bgClasses} style={bgStyle} />
            </div>
        );

    } catch (err) {
        console.error('Error in GridBackground:', err);
        return null;
    }
};

export default GridBackground;
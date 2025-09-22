// grid-background-control.js
import {
    PanelBody,
    SelectControl,
    Button,
    RangeControl,
    TextControl,
    __experimentalHStack as HStack,
} from '@wordpress/components';
import {
    MediaUpload,
    __experimentalColorGradientControl as ColorGradientControl} from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

const GridBackgroundControl = ({ clientId, currentViewport = 'Desktop' }) => {
    const attributes = useSelect(
        (select) => select('core/block-editor').getBlockAttributes(clientId),
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch('core/block-editor');

    const themeSettings = useSelect((select) => select('core/block-editor').getSettings());
    const themeColors = themeSettings.colors || [];
    const themeGradients = themeSettings.gradients || [];

    // Get device prefix
    const getDevicePrefix = () => {
        switch (currentViewport) {
            case 'Desktop': return 'd';
            case 'Tablet': return 't';
            case 'Mobile': return 'm';
            default: return '';
        }
    };

    const devicePrefix = getDevicePrefix();

    // Get responsive attribute value with fallback
    const getResponsiveValue = (attribute) => {
        const deviceValue = attributes[`${devicePrefix}${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`];
        const baseValue = attributes[attribute];
        return deviceValue !== '' && deviceValue !== undefined ? deviceValue : baseValue;
    };

    const setAttr = (key, value) => {
        const responsiveKey = devicePrefix ? `${devicePrefix}${key.charAt(0).toUpperCase()}${key.slice(1)}` : key;
        updateBlockAttributes(clientId, {
            [responsiveKey]: value,
        });
    };

    const backgroundType = getResponsiveValue('backgroundType');
    const backgroundColorSlug = getResponsiveValue('backgroundColorSlug');
    const backgroundGradientSlug = getResponsiveValue('backgroundGradientSlug');
    const backgroundImage = getResponsiveValue('backgroundImage');
    const backgroundWidth = getResponsiveValue('backgroundWidth');
    const backgroundRepeat = getResponsiveValue('backgroundRepeat');
    const backgroundSize = getResponsiveValue('backgroundSize');
    const backgroundSizeX = getResponsiveValue('backgroundSizeX');
    const backgroundSizeY = getResponsiveValue('backgroundSizeY');
    const backgroundPosition = getResponsiveValue('backgroundPosition');
    const backgroundPositionX = getResponsiveValue('backgroundPositionX');
    const backgroundPositionY = getResponsiveValue('backgroundPositionY');
    const backgroundAdvancedOpen = attributes.backgroundAdvancedOpen;

    const getColorValue = () => {
        if (!backgroundColorSlug) return '';
        const match = themeColors.find((c) => c.slug === backgroundColorSlug);
        return match?.color || '';
    };

    const getGradientValue = () => {
        if (!backgroundGradientSlug) return '';
        const match = themeGradients.find((g) => g.slug === backgroundGradientSlug);
        return match?.gradient || '';
    };

    const deviceLabel = currentViewport === 'Desktop' ? __('Desktop', 'gutengrid') : 
                       currentViewport === 'Tablet' ? __('Tablet', 'gutengrid') : 
                       __('Mobile', 'gutengrid');

    return (
        <PanelBody title={__(`Background settings (${deviceLabel})`, 'gutengrid')}>
            <SelectControl
                label={__('Background type', 'gutengrid')}
                value={backgroundType || 'none'}
                options={[
                    { label: __('None', 'gutengrid'), value: 'none' },
                    { label: __('Color', 'gutengrid'), value: 'color' },
                    { label: __('Gradient', 'gutengrid'), value: 'gradient' },
                    { label: __('Image', 'gutengrid'), value: 'image' },
                ]}
                onChange={(val) => {
                    const updates = {};
                    const responsiveKey = devicePrefix ? `${devicePrefix}BackgroundType` : 'backgroundType';
                    updates[responsiveKey] = val;

                    if (val === 'color') {
                        const gradientKey = devicePrefix ? `${devicePrefix}BackgroundGradientSlug` : 'backgroundGradientSlug';
                        const imageKey = devicePrefix ? `${devicePrefix}BackgroundImage` : 'backgroundImage';
                        updates[gradientKey] = '';
                        updates[imageKey] = '';
                    } else if (val === 'gradient') {
                        const colorKey = devicePrefix ? `${devicePrefix}BackgroundColorSlug` : 'backgroundColorSlug';
                        const imageKey = devicePrefix ? `${devicePrefix}BackgroundImage` : 'backgroundImage';
                        updates[colorKey] = '';
                        updates[imageKey] = '';
                    } else if (val === 'image') {
                        const colorKey = devicePrefix ? `${devicePrefix}BackgroundColorSlug` : 'backgroundColorSlug';
                        const gradientKey = devicePrefix ? `${devicePrefix}BackgroundGradientSlug` : 'backgroundGradientSlug';
                        updates[colorKey] = '';
                        updates[gradientKey] = '';
                    } else if (val === 'none') {
                        const colorKey = devicePrefix ? `${devicePrefix}BackgroundColorSlug` : 'backgroundColorSlug';
                        const gradientKey = devicePrefix ? `${devicePrefix}BackgroundGradientSlug` : 'backgroundGradientSlug';
                        const imageKey = devicePrefix ? `${devicePrefix}BackgroundImage` : 'backgroundImage';
                        updates[colorKey] = '';
                        updates[gradientKey] = '';
                        updates[imageKey] = '';
                    }

                    updateBlockAttributes(clientId, updates);
                }}
            />

            {backgroundType === 'color' && themeColors.length > 0 && (
                <ColorGradientControl
                    colors={themeColors}
                    value={getColorValue()}
                    onColorChange={(value) => {
                        let slug = '';
                        
                        if (typeof value === 'string') {
                            if (value.startsWith('var:preset|color|')) {
                                slug = value.split('|').pop();
                            } else if (themeColors.find((c) => c.slug === value)) {
                                slug = value;
                            } else {
                                const match = themeColors.find((c) => c.color === value);
                                slug = match?.slug || '';
                            }
                        }
                        
                        setAttr('backgroundColorSlug', slug);
                    }}
                    clearable
                />
            )}

            {backgroundType === 'gradient' && themeGradients.length > 0 && (
                <ColorGradientControl
                    gradients={themeGradients}
                    value={getGradientValue()}
                    onGradientChange={(value) => {
                        let slug = '';
                        
                        if (typeof value === 'string') {
                            if (value.startsWith('var:preset|gradient|')) {
                                slug = value.split('|').pop();
                            } else if (themeGradients.find((g) => g.slug === value)) {
                                slug = value;
                            } else {
                                const match = themeGradients.find((g) => g.gradient === value);
                                slug = match?.slug || '';
                            }
                        }
                        
                        setAttr('backgroundGradientSlug', slug);
                    }}
                    clearable
                />
            )}

            {backgroundType === 'image' && (
                <>
                    <MediaUpload
                        onSelect={(media) => {
                            if (media?.url) {
                                setAttr('backgroundImage', media.url);
                            }
                        }}
                        type="image"
                        render={({ open }) => (
                            <Button onClick={open} isSecondary>
                                {backgroundImage ? __('Change image', 'gutengrid') : __('Select background image', 'gutengrid')}
                            </Button>
                        )}
                    />
                    
                    {backgroundImage && (
                        <>
                            <Button 
                                onClick={() => updateBlockAttributes(clientId, { backgroundAdvancedOpen: !backgroundAdvancedOpen })}
                                variant="tertiary"
                                style={{ marginTop: '8px', width: '100%' }}
                            >
                                {backgroundAdvancedOpen ? __('Hide advanced settings', 'gutengrid') : __('Show advanced settings', 'gutengrid')}
                            </Button>

                            {backgroundAdvancedOpen && (
                                <div style={{ marginTop: '12px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <SelectControl
                                        label={__('Repeat', 'gutengrid')}
                                        value={backgroundRepeat || 'no'}
                                        options={[
                                            { label: __('No repeat', 'gutengrid'), value: 'no' },
                                            { label: __('Repeat', 'gutengrid'), value: 'yes' },
                                            { label: __('Repeat X', 'gutengrid'), value: 'x' },
                                            { label: __('Repeat Y', 'gutengrid'), value: 'y' },
                                        ]}
                                        onChange={(val) => setAttr('backgroundRepeat', val)}
                                    />

                                    <SelectControl
                                        label={__('Size', 'gutengrid')}
                                        value={backgroundSize || 'cover'}
                                        options={[
                                            { label: __('Cover', 'gutengrid'), value: 'cover' },
                                            { label: __('Contain', 'gutengrid'), value: 'contain' },
                                            { label: __('Manual', 'gutengrid'), value: 'manual' },
                                        ]}
                                        onChange={(val) => {
                                            const updates = {};
                                            const sizeKey = devicePrefix ? `${devicePrefix}BackgroundSize` : 'backgroundSize';
                                            updates[sizeKey] = val;

                                            if (val === 'manual' && (!backgroundSizeX || backgroundSizeX === 'auto') && (!backgroundSizeY || backgroundSizeY === 'auto')) {
                                                const sizeXKey = devicePrefix ? `${devicePrefix}BackgroundSizeX` : 'backgroundSizeX';
                                                const sizeYKey = devicePrefix ? `${devicePrefix}BackgroundSizeY` : 'backgroundSizeY';
                                                updates[sizeXKey] = '50%';
                                                updates[sizeYKey] = '50%';
                                            }
                                            updateBlockAttributes(clientId, updates);
                                        }}
                                    />

                                    {backgroundSize === 'manual' && (
                                        <HStack>
                                            <TextControl
                                                label={__('Width', 'gutengrid')}
                                                value={backgroundSizeX || '100%'}
                                                onChange={(val) => setAttr('backgroundSizeX', val)}
                                                placeholder="50%, 200px, 100vw"
                                                help={__('Use %, px, vw, em, etc.', 'gutengrid')}
                                            />
                                            <TextControl
                                                label={__('Height', 'gutengrid')}
                                                value={backgroundSizeY || '100%'}
                                                onChange={(val) => setAttr('backgroundSizeY', val)}
                                                placeholder="50%, 200px, 100vh"
                                                help={__('Use %, px, vh, em, etc.', 'gutengrid')}
                                            />
                                        </HStack>
                                    )}

                                    <SelectControl
                                        label={__('Position', 'gutengrid')}
                                        value={backgroundPosition || 'center'}
                                        options={[
                                            { label: __('Top Left', 'gutengrid'), value: 'top-left' },
                                            { label: __('Top Center', 'gutengrid'), value: 'top' },
                                            { label: __('Top Right', 'gutengrid'), value: 'top-right' },
                                            { label: __('Center Left', 'gutengrid'), value: 'left' },
                                            { label: __('Center', 'gutengrid'), value: 'center' },
                                            { label: __('Center Right', 'gutengrid'), value: 'right' },
                                            { label: __('Bottom Left', 'gutengrid'), value: 'bottom-left' },
                                            { label: __('Bottom Center', 'gutengrid'), value: 'bottom' },
                                            { label: __('Bottom Right', 'gutengrid'), value: 'bottom-right' },
                                            { label: __('Manual', 'gutengrid'), value: 'manual' },
                                        ]}
                                        onChange={(val) => setAttr('backgroundPosition', val)}
                                    />

                                    {backgroundPosition === 'manual' && (
                                        <HStack>
                                            <TextControl
                                                label={__('X Position', 'gutengrid')}
                                                value={backgroundPositionX || '50%'}
                                                onChange={(val) => setAttr('backgroundPositionX', val)}
                                                placeholder="50%, 100px, -20px"
                                                help={__('Use %, px, em, vw, etc.', 'gutengrid')}
                                            />
                                            <TextControl
                                                label={__('Y Position', 'gutengrid')}
                                                value={backgroundPositionY || '50%'}
                                                onChange={(val) => setAttr('backgroundPositionY', val)}
                                                placeholder="50%, 100px, -20px"
                                                help={__('Use %, px, em, vh, etc.', 'gutengrid')}
                                            />
                                        </HStack>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            <SelectControl
                label={__('Background width', 'gutengrid')}
                value={backgroundWidth || 'main'}
                options={[
                    { label: __('Main grid (2–14)', 'gutengrid'), value: 'main' },
                    { label: __('Full width', 'gutengrid'), value: 'full' },
                ]}
                onChange={(val) => setAttr('backgroundWidth', val)}
            />
        </PanelBody>
    );
};

export default GridBackgroundControl;

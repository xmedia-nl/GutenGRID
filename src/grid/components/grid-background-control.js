// grid-background-control.js
import {
    PanelBody,
    SelectControl,
    Button,
} from '@wordpress/components';
import {
    MediaUpload,
    __experimentalColorGradientControl as ColorGradientControl} from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

const GridBackgroundControl = ({ clientId }) => {
    const {
        backgroundType,
        backgroundColorSlug,
        backgroundGradientSlug,
        backgroundImage,
        backgroundWidth,
    } = useSelect(
        (select) => select('core/block-editor').getBlockAttributes(clientId),
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch('core/block-editor');

    const themeSettings = useSelect((select) => select('core/block-editor').getSettings());
    const themeColors = themeSettings.colors || [];
    const themeGradients = themeSettings.gradients || [];

    const setAttr = (key, value) => {
        updateBlockAttributes(clientId, {
            [key]: value,
        });
    };

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

    return (
        <PanelBody title={__('Background settings', 'gutengrid')}>
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
                    // Reset related properties when changing type
                    const updates = { backgroundType: val };
                    console.log('Background type changed:', val);
                    if (val === 'color') {
                        updates.backgroundGradientSlug = '';
                        updates.backgroundImage = '';
                    } else if (val === 'gradient') {
                        updates.backgroundColorSlug = '';
                        updates.backgroundImage = '';
                    } else if (val === 'image') {
                        updates.backgroundColorSlug = '';
                        updates.backgroundGradientSlug = '';
                    } else if (val === 'none') {
                        updates.backgroundColorSlug = '';
                        updates.backgroundGradientSlug = '';
                        updates.backgroundImage = '';
                    }

                    updateBlockAttributes(clientId, updates);
                    console.log('Updated attributes:', updates);
                }}
            />

            {backgroundType === 'color' && themeColors.length > 0 && (
                <ColorGradientControl
                    colors={themeColors}
                    value={getColorValue()}
                    onColorChange={(value) => {
                        const match = themeColors.find((c) => c.color === value);
                        if (!match) {
                            console.warn('[GutenGrid] Geen match voor color:', value);
                        }
                        setAttr('backgroundColorSlug', match?.slug || '');
                    }}
                    clearable
                />
            )}

            {backgroundType === 'gradient' && themeGradients.length > 0 && (
                <ColorGradientControl
                    gradients={themeGradients}
                    value={getGradientValue()}
                    onGradientChange={(value) => {
                        const match = themeGradients.find((g) => g.gradient === value);
                        setAttr('backgroundGradientSlug', match?.slug || '');
                    }}
                    clearable
                />
            )}

            {backgroundType === 'image' && (
                <MediaUpload
                    onSelect={(media) => {
                        if (media?.url) {
                            setAttr('backgroundImage', media.url);
                        }
                    }}
                    type="image"
                    render={({ open }) => (
                        <Button onClick={open} isSecondary>
                            {__('Select background image', 'gutengrid')}
                        </Button>
                    )}
                />
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

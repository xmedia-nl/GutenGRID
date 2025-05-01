// grid-spacing-control.js
import {
    PanelBody,
    SelectControl,
    TextControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

const GridSpacingControl = ({ clientId, currentViewport = 'Desktop' }) => {
    const {
        gridPadding = {},
    } = useSelect(
        (select) => select('core/block-editor').getBlockAttributes(clientId),
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch('core/block-editor');

    const currentPadding = gridPadding[currentViewport.toLowerCase()] ||
        gridPadding[(currentViewport === 'Mobile' && 'tablet')] ||
        gridPadding[(currentViewport === 'Mobile' || currentViewport === 'Tablet') && 'desktop'] ||
        '';

    const setCurrentPadding = (value) => {
        updateBlockAttributes(clientId, {
            gridPadding: {
                ...gridPadding,
                [currentViewport.toLowerCase()]: value,
            },
        });
    };

    const isCustom = currentPadding?.startsWith('c-');
    const customValue = isCustom ? currentPadding.replace('c-', '') : '';

    return (
        <PanelBody title={__('Grid spacing (padding top/bottom)', 'gutengrid')} initialOpen={false}>
            <SelectControl
                label={__('Spacing for ' + currentViewport, 'gutengrid')}
                value={isCustom ? 'custom' : currentPadding}
                options={[
                    { label: __('Inherit', 'gutengrid'), value: '' },
                    { label: __('Small (80px)', 'gutengrid'), value: 's' },
                    { label: __('Medium (115px)', 'gutengrid'), value: 'm' },
                    { label: __('Large (155px)', 'gutengrid'), value: 'l' },
                    { label: __('Custom', 'gutengrid'), value: 'custom' },
                ]}
                onChange={(val) => {
                    if (val === 'custom') {
                        setCurrentPadding('c-');
                    } else {
                        setCurrentPadding(val);
                    }
                }}
            />
            {isCustom && (
                <TextControl
                    label={__('Custom padding (' + currentViewport + ', px)', 'gutengrid')}
                    value={customValue}
                    onChange={(val) => setCurrentPadding(`c-${val}`)}
                />
            )}
        </PanelBody>
    );
};

export default GridSpacingControl;

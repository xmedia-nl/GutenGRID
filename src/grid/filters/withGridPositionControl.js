import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, ButtonGroup, Button, } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { getLayouts } from '../../constants';

import LayoutPresetToolbar from '../components/layout-preset-toolbar';
import GridPositionControl from '../components/grid-position-control';

const withGridPositionControl = createHigherOrderComponent((BlockEdit) => (props) => {
    const { clientId, name, isSelected } = props;

    const parentIsGrid = useSelect((select) => {
        const parentId = select('core/block-editor').getBlockRootClientId(clientId);
        const parentBlock = select('core/block-editor').getBlock(parentId);
        return parentBlock?.name === 'gutengrid/grid';
    }, [clientId]);

    const currentDevice = useSelect((select) => {
        return (
            select('core/edit-site')?.__experimentalGetPreviewDeviceType?.() ||
            select('core/edit-post')?.__experimentalGetPreviewDeviceType?.() ||
            'Desktop'
        );
    }, []);

    const { __experimentalSetPreviewDeviceType: setDevice } =
        useDispatch('core/edit-site') || useDispatch('core/edit-post');


    if (!isSelected || !parentIsGrid) return <BlockEdit {...props} />;

    return (
        <>
            <BlockControls>
                <LayoutPresetToolbar clientId={clientId} />
            </BlockControls>
            <BlockEdit {...props} />
            <InspectorControls>
                <PanelBody title={__('Responsive Breakpoints', 'gutengrid')}>
                    <p className="gutengrid-help">
                        {__(
                            "Previewing your post will show your browser's breakpoint, not the currently selected one.",
                            'gutengrid'
                        )}
                    </p>
                    <ButtonGroup>
                        {getLayouts().map((layout) => (
                            <Button
                                key={layout.value}
                                isPrimary={layout.value === currentDevice}
                                onClick={() => setDevice(layout.value)}
                            >
                                {layout.label}
                            </Button>
                        ))}
                    </ButtonGroup>

                </PanelBody>
                <PanelBody title={__("Grid position", 'gutengrid')}>
                    <GridPositionControl clientId={clientId} />
                </PanelBody>
            </InspectorControls>
        </>
    );
}, 'withGridPositionControl');

// export default withGridPositionControl;
addFilter(
    'editor.BlockEdit',
    'gutengrid/grid-position-controls',
    withGridPositionControl
);
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { InspectorControls, BlockControls  } from '@wordpress/block-editor';
import { PanelBody, TextControl, ButtonGroup, Button, } from '@wordpress/components';
import GridPositionControl from '../components/grid-position-control';
import { addFilter } from '@wordpress/hooks';
// import {updateInspectorDevice, getInspectorMode} from '../../grid/edit.js';
import { __ } from '@wordpress/i18n';
import { getLayouts } from '../../constants';

import LayoutPresetToolbar from '../components/layout-preset-toolbar';
import GridPositionControl from '../components/grid-position-control';
import GridAlignControls from './grid-align-controls';

const withGridPositionControl = createHigherOrderComponent((BlockEdit) => (props) => {
    const { clientId, name, isSelected } = props;

    const parentIsGrid = useSelect((select) => {
        const parentId = select('core/block-editor').getBlockRootClientId(clientId);
        const parentBlock = select('core/block-editor').getBlock(parentId);
        return parentBlock?.name === 'vwe/grid';
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
                <PanelBody title={__('Responsive Breakpoints', 'layout-grid')}>
                    <p className="vwe-grid-help">
                        {__(
                            "Previewing your post will show your browser's breakpoint, not the currently selected one.",
                            'layout-grid'
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
                <PanelBody title="Grid positie">
                    <GridPositionControl clientId={clientId} />
                </PanelBody>
            </InspectorControls>
        </>
    );
}, 'withGridPositionControl');

// export default withGridPositionControl;
addFilter(
    'editor.BlockEdit',
    'vwe/grid-position-controls',
    withGridPositionControl
);
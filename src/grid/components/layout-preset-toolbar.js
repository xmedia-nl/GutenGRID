import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { replaceColumnValuesInClass, getStartEndColFromClassName } from '../css-classname';
import { HalfLeftIcon, FullCenterIcon, HalfRightIcon, } from '../../icons';


const PRESETS = {
    Desktop: {
        left: [2, 8],
        center: [2, 14],
        right: [8, 14],
    },
    Tablet: {
        left: [2, 8],
        center: [2, 14],
        right: [8, 14],
    },
    Mobile: {
        left: [2, 6],
        center: [2, 10],
        right: [6, 10],
    },
};

const LayoutPresetToolbar = ({ clientId }) => {
    const { className = '' } = useSelect((select) =>
        select('core/block-editor').getBlockAttributes(clientId),
        [clientId]
    );
    const device = useSelect((select) =>
        select('core/edit-post')?.__experimentalGetPreviewDeviceType?.() || 'Desktop'
    );

    const { updateBlockAttributes } = useDispatch('core/block-editor');

    const applyPreset = (type) => {
        const [start, end] = PRESETS[device][type];
        const newClassName = replaceColumnValuesInClass(className, device, start, end);
        updateBlockAttributes(clientId, { className: newClassName });
    };
    const currentMatches = (type) => {
        const [expectedStart, expectedEnd] = PRESETS[device][type];
        const { start, end } = getStartEndColFromClassName(className, device);
        return start === expectedStart && end === expectedEnd;
    };
    return (
        <ToolbarGroup label={__('Layout presets', 'gutengrid')}>
            <ToolbarButton
                icon={<HalfLeftIcon />}
                label={__('Left', 'gutengrid')}
                onClick={() => applyPreset('left')}
                isPressed={currentMatches('left')}
            />
            <ToolbarButton
                icon={<FullCenterIcon />}
                label={__('Main center', 'gutengrid')}
                onClick={() => applyPreset('center')}
                isPressed={currentMatches('center')}
            />
            <ToolbarButton
                icon={<HalfRightIcon />}
                label={__('Right', 'gutengrid')}
                onClick={() => applyPreset('right')}
                isPressed={currentMatches('right')}
            />
        </ToolbarGroup>
    );
};

export default LayoutPresetToolbar;

import { __ } from '@wordpress/i18n';
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components'; import { useSelect, useDispatch } from '@wordpress/data';
import { DEVICE_BREAKPOINTS } from '../../constants';

const ALIGN_ITEMS_OPTIONS = [
    { label: __('Auto', 'gutengrid'), value: '' },
    { label: __('Start', 'gutengrid'), value: 'start' },
    { label: __('Center', 'gutengrid'), value: 'center' },
    { label: __('End', 'gutengrid'), value: 'end' },
    { label: __('Stretch', 'gutengrid'), value: 'stretch' },
];

const JUSTIFY_SELF_OPTIONS = [
    { label: __('Auto', 'gutengrid'), value: '' },
    { label: __('Start', 'gutengrid'), value: 'start' },
    { label: __('Center', 'gutengrid'), value: 'center' },
    { label: __('End', 'gutengrid'), value: 'end' },
];

const getResponsiveClass = (className = '', type, device) => {
    const prefix = device.charAt(0).toLowerCase();
    const match = className.match(new RegExp(`${prefix}-self-${type}-([a-z]+)`));
    return match ? match[1] : '';
};

const replaceResponsiveClass = (className = '', type, device, value) => {
    const prefix = device.charAt(0).toLowerCase();
    const regex = new RegExp(`${prefix}-self-${type}-[a-z]+`, 'g');
    const cleaned = className.replace(regex, '').trim();
    if (!value) return cleaned;
    return `${cleaned} ${prefix}-self-${type}-${value}`.trim();
};

const GridSelfAlignControl = ({ clientId }) => {
    const className = useSelect((select) =>
        select('core/block-editor').getBlockAttributes(clientId)?.className || ''
        , [clientId]);
    const device = useSelect((select) =>
        select('core/edit-post')?.__experimentalGetPreviewDeviceType?.() || 'Desktop'
    );

    const { updateBlockAttributes } = useDispatch('core/block-editor');

    const alignSelf = getResponsiveClass(className, 'align', device);
    const justifySelf = getResponsiveClass(className, 'justify', device);

    const setAlign = (val) => {
        const newClass = replaceResponsiveClass(className, 'align', device, val);
        updateBlockAttributes(clientId, { className: newClass });
    };

    const setJustify = (val) => {
        const newClass = replaceResponsiveClass(className, 'justify', device, val);
        updateBlockAttributes(clientId, { className: newClass });
    };

    return (
        <div className="gutengrid-controls">
            <label>{__('Align self (vertical)', 'gutengrid')}</label>
            <ToggleGroupControl value={alignSelf} onChange={setAlign} isBlock>
                {ALIGN_ITEMS_OPTIONS.map(opt => (
                    <ToggleGroupControlOption key={opt.value} value={opt.value} label={opt.label} />
                ))}
            </ToggleGroupControl>

            <label style={{ marginTop: '1em' }}>{__('Justify self (horizontal)', 'gutengrid')}</label>
            <ToggleGroupControl value={justifySelf} onChange={setJustify} isBlock>
                {JUSTIFY_SELF_OPTIONS.map(opt => (
                    <ToggleGroupControlOption key={opt.value} value={opt.value} label={opt.label} />
                ))}
            </ToggleGroupControl>
        </div>
    );
};

export default GridSelfAlignControl;

import { useEffect, useRef } from '@wordpress/element';

const GridOverlay = ({ device }) => {
    const columns = {
        Desktop: 14,
        Tablet: 14,
        Mobile: 10,
    }[device] || 14;

    const overlayRef = useRef();

    return (
        <div className="gutengrid-overlay bo-grid" ref={overlayRef}>
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className={`gutengrid-overlay__col d-grid-${i + 1}-${i + 1} t-grid-${i + 1}-${i + 1} m-grid-${i + 1}-${i + 1}`}
                    data-col={i + 1}
                />
            ))}
        </div>
    );
};

export default GridOverlay;

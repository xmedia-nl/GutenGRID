import { useRef, useState, useEffect } from '@wordpress/element';
import classnames from 'classnames';
// import ResizeHandle from '../resize-grid-single/resize-handle';
import ResizeHandle from './resize-handle';
import { useSelect } from '@wordpress/data';

const ResizeGridSingle = ({
	// className = '',
	children,
	isSelected,
	onResize,
	gridWidth = 12,
	clientId,
}) => {
	const containerRef = useRef(null);
	const [resizing, setResizing] = useState(false);
	const [dragState, setDragState] = useState({
		xPos: 0,
		width: 0,
		height: 0,
		top: 0,
		direction: null,
	});
	const className = useSelect((select) => {
		return select('core/block-editor')
			.getBlockAttributes(clientId)?.className || '';
	}, [clientId]);

	// Apply grid classes to the editor wrapper div (like d-grid-1-6 etc.)
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		Array.from(el.classList).forEach((cls) => {
			if (/^[dtm]-grid-\d+-\d+$/.test(cls)) {
				el.classList.remove(cls);
			}
		});

		className
			.split(' ')
			.filter((cls) => /^[dtm]-grid-\d+-\d+$/.test(cls))
			.forEach((cls) => el.classList.add(cls));
	}, [className]);

	const getMouseX = (event) => {
		const { clientX, targetTouches } = event;
		return clientX || (targetTouches && targetTouches[0]?.clientX);
	};

	const onMouseDown = (ev) => {
		const { target } = ev;
		if (
			(ev.button === 0 || ev.touches) &&
			(target.dataset.resizeRight || target.dataset.resizeLeft)
		) {
			const block = target.closest('.wp-block');
			const isLeft = target.dataset.resizeLeft;
			const { width, right, left, top, height } = block.getBoundingClientRect();
			const parentWidth = block.parentNode?.offsetWidth || 1200;
			const pixelPerColumn = parentWidth / gridWidth;

			setDragState({
				xPos: getMouseX(ev),
				width,
				height,
				top,
				direction: isLeft ? 'left' : 'right',
				gridPixelWidth: pixelPerColumn,
			});

			setResizing(true);

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
			ev.preventDefault();
			ev.stopPropagation();
		}
	};

	const onMouseMove = (ev) => {
		ev.stopPropagation();
		const mouseX = getMouseX(ev);
		const delta = mouseX - dragState.xPos;
		const spanDelta = Math.round(delta / dragState.gridPixelWidth);

		if (onResize && spanDelta !== 0) {
			onResize({
				direction: dragState.direction,
				delta: spanDelta,
			});
		}
	};

	const onMouseUp = () => {
		setResizing(false);
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	};

	const wrapperClasses = classnames(className, {
		'wp-block-vwe-grid__resizing': resizing,
		'wp-block-vwe-grid__resizable': true,
	});

	return (
		<div
			className={wrapperClasses}
			onMouseDown={onMouseDown}
			onTouchStart={onMouseDown}
			ref={containerRef}
		>
			{/* Overlay handle during drag */}
			{resizing && (
				<ResizeHandle
					direction={dragState.direction}
					height={dragState.height}
					xPos={dragState.xPos}
					top={dragState.top}
					isSelected={isSelected}
				/>
			)}

			{/* Static resize handles */}
			<span className="wp-blocks-vwe-grid__resize-handles">
				<div
					className="components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-right"
					data-resize-right
				/>
				<div
					className="components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-left"
					data-resize-left
				/>
			</span>

			{children}
		</div>
	);
};

export default ResizeGridSingle;

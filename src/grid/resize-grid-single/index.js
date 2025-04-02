import { useRef, useState, useEffect } from '@wordpress/element';
import classnames from 'classnames';
// import ResizeHandle from '../resize-grid-single/resize-handle';
import ResizeHandle from './resize-handle';
import { useSelect } from '@wordpress/data';
import { getStartEndFromClassName } from '../css-classname';

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

	const device = useSelect((select) =>
		select('core/edit-post')?.__experimentalGetPreviewDeviceType?.() || 'Desktop'
	);

	// Apply grid classes to the editor wrapper div (like d-grid-1-6 etc.)
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		// Alle bestaande grid-classes verwijderen
		Array.from(el.classList).forEach((cls) => {
			if (/^[dtm]-grid-\d+-\d+$/.test(cls)) {
				el.classList.remove(cls);
			}
		});

		// Alleen de unieke d-/t-/m- classes uit className toevoegen
		const uniqueGridClasses = Array.from(
			new Set(
				className
					.split(' ')
					.filter((cls) => /^[dtm]-grid-\d+-\d+$/.test(cls))
			)
		);

		uniqueGridClasses.forEach((cls) => el.classList.add(cls));

		console.log("Applying grid classes to wrapper:", uniqueGridClasses);

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
			const { start, end } = getStartEndFromClassName(className, device);
			console.log("start onMouseDown", start, end);
			setDragState({
				xPos: getMouseX(ev),
				width,
				height,
				top,
				direction: isLeft ? 'left' : 'right',
				gridPixelWidth: pixelPerColumn,
				start,
				end,
			});


			setResizing(true);
			const gutenDoc = containerRef.current?.ownerDocument || document;
			gutenDoc.addEventListener('mousemove', onMouseMove);
			gutenDoc.addEventListener('mouseup', onMouseUp);
			ev.preventDefault();
			ev.stopPropagation();
		}
	};

	const onMouseMove = (ev) => {
		ev.stopPropagation();
		const mouseX = getMouseX(ev);

		setDragState((prev) => {
			const delta = mouseX - prev.xPos;
			const spanDelta = Math.round(delta / prev.gridPixelWidth);

			// Alleen activeren bij daadwerkelijke delta
			if (!onResize || spanDelta === 0) return prev;

			let newStart = prev.start;
			let newEnd = prev.end;

			if (prev.direction === 'left') {
				newStart = Math.max(1, Math.min(prev.end - 1, prev.start + spanDelta));
			}
			if (prev.direction === 'right') {
				newEnd = Math.min(12, Math.max(prev.start + 1, prev.end + spanDelta));
			}

			// Nu pas onResize met deze actuele waardes
			onResize({
				direction: prev.direction,
				delta: spanDelta,
				start: newStart,
				end: newEnd,
				device: device, // 👈 dit is alles wat je nog moest toevoegen
			});

			// Reset de reference point voor de volgende beweging
			return {
				...prev,
				start: newStart,
				end: newEnd,
				xPos: mouseX,
			};
		});
	};

	const onMouseUp = () => {
		console.log("onMouseUp");

		setResizing(false);
		const gutenDoc = containerRef.current?.ownerDocument || document;
		gutenDoc.removeEventListener('mousemove', onMouseMove);
		gutenDoc.removeEventListener('mouseup', onMouseUp);
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

import { useRef, useState, useEffect } from '@wordpress/element';
import classnames from 'classnames';
// import ResizeHandle from '../resize-grid-single/resize-handle';
import ResizeHandle from './resize-handle';
import { useSelect } from '@wordpress/data';
import { getStartEndColFromClassName, getStartEndFromDom, nudgeRowValuesInClass } from '../css-classname';
import { detectHoveredCol } from '../utils/bo-grid-check';
import DragAndNudgeHandle from './drag-handle';
import { useSupportsClassName } from '../utils/block-support';
import { useDispatch } from '@wordpress/data';




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
	const [dragging, setDragging] = useState(false);
	const [dragState, _setDragState] = useState({
		xPos: 0,
		width: 0,
		height: 0,
		top: 0,
		direction: null,
		start: 0,
		end: 0,
		span: 0,
		gridPixelWidth: 1,
		initialX: 0,
	});
	const dragStateRef = useRef(dragState);

	// Vervang setDragState door deze custom functie:
	const setDragState = (val) => {
		const newVal = typeof val === 'function' ? val(dragStateRef.current) : val;
		dragStateRef.current = newVal;
		_setDragState(newVal);
	};
	const [hoveredColumn, setHoveredColumn] = useState(null);
	const className = useSelect((select) => {
		return select('core/block-editor')
			.getBlockAttributes(clientId)?.className || select('core/block-editor')
				.getBlockAttributes(clientId)?.wrapperClassname || '';
	}, [clientId]);

	const device = useSelect((select) =>
		select('core/edit-post')?.__experimentalGetPreviewDeviceType?.() || 'Desktop'
	);

	const { updateBlockAttributes } = useDispatch('core/block-editor');
	const supportsClass = useSupportsClassName(clientId);
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

	}, [className]);

	useEffect(() => {
		const handleHoverCol = (e) => {
			const hovered = e.detail.col;
			setHoveredColumn(hovered);
		};

		window.addEventListener('gridHoverColumn', handleHoverCol);
		return () => window.removeEventListener('gridHoverColumn', handleHoverCol);
	}, []);


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
			const { start, end } = getStartEndColFromClassName(className, device);

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

			// Zoek de juiste overlay van dit grid blok
			const overlay = containerRef.current?.closest('.wp-block-gutengrid-editor')?.querySelector('.gutengrid-overlay');
			if (overlay) {
				overlay.classList.add('is-resizing');
			}


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
			const hoveredCol = detectHoveredCol(ev.clientX, ev.clientY);
			if (!onResize || hoveredCol === null) return prev;

			let newStart = Number(prev.start);
			let newEnd = Number(prev.end);

			if (prev.direction === 'left') {
				newStart = hoveredCol ? hoveredCol : prev.start;
			}
			if (prev.direction === 'right') {
				newEnd = hoveredCol ? hoveredCol + 1 : prev.end;
			}


			onResize({
				direction: prev.direction,
				start: newStart,
				end: newEnd,
				device: device,
			});

			return {
				...prev,
				start: newStart,
				end: newEnd,
				xPos: mouseX,
			};
		});

	};


	const onMouseUp = () => {

		setResizing(false);
		const overlay = containerRef.current?.closest('.wp-block-gutengrid-editor')?.querySelector('.gutengrid-overlay');
		if (overlay) {
			overlay.classList.remove('is-resizing');
		}

		const gutenDoc = containerRef.current?.ownerDocument || document;
		gutenDoc.removeEventListener('mousemove', onMouseMove);
		gutenDoc.removeEventListener('mouseup', onMouseUp);
		setHoveredColumn(null);
	};




	/***
	 * Dragging the entire block
	 */
	const onDragStart = (e) => {
		const block = containerRef.current;
		if (!block) return;

		const overlay = containerRef.current?.closest('.wp-block-gutengrid-editor')?.querySelector('.gutengrid-overlay');
		if (overlay) {
			overlay.classList.add('is-resizing');
		}

		const { start, end } = getStartEndFromDom(block, device); // of getStartEndColFromClassName(className, device)
		const parentWidth = block.parentNode?.offsetWidth || 1200;
		const pixelPerColumn = parentWidth / gridWidth;

		setDragState((prev) => ({
			...prev,
			start,
			end,
			span: end - start,
			gridPixelWidth: pixelPerColumn,
			initialX: e.clientX,
		}));

		setDragging(true);

		document.addEventListener('mousemove', onDrag);
		document.addEventListener('mouseup', onDragEnd);
		e.preventDefault();
		e.stopPropagation();
	};

	const onDrag = (e) => {
		const { span } = dragStateRef.current;
		const hoveredCol = detectHoveredCol(e.clientX, e.clientY);
		if (!onResize || !hoveredCol || span < 1) return;



		let newEnd = hoveredCol + 1;
		let newStart = newEnd - span;

		if (newStart < 1) {
			newStart = 1;
			newEnd = newStart + span;
		}
		// if (newEnd > gridWidth + 1) {
		// 	newEnd = gridWidth + 1;
		// 	newStart = newEnd - span;
		// }

		onResize({
			direction: 'move',
			start: newStart,
			end: newEnd,
			device,
		});
	};

	const onDragEnd = () => {
		setDragging(false);
		document.removeEventListener('mousemove', onDrag);
		document.removeEventListener('mouseup', onDragEnd);
		const overlay = containerRef.current?.closest('.wp-block-gutengrid-editor')?.querySelector('.gutengrid-overlay');
		if (overlay) {
			overlay.classList.remove('is-resizing');
		}

		const { start, end } = getStartEndColFromClassName(className, device);
	};
	const handleNudge = (direction) => {
		const newClassName = nudgeRowValuesInClass(className, device, direction);

		updateBlockAttributes(clientId, {
			className: newClassName,
			wrapperClassname: !supportsClass ? newClassName : undefined,
		});
	};

	const wrapperClasses = classnames(className, {
		'wp-block-gutengrid__resizing': resizing,
		'wp-block-gutengrid__resizable': true,
		'gutengrid-dragging': dragging,
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
			<span className="wp-blocks-gutengrid__resize-handles">
				<div
					className="components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-right"
					data-resize-right
				/>
				<div
					className="components-resizable-box__handle components-resizable-box__side-handle components-resizable-box__handle-left"
					data-resize-left
				/>
			</span>
			<DragAndNudgeHandle
				onStartDrag={onDragStart}
				onNudgeUp={() => handleNudge(-1)}
				onNudgeDown={() => handleNudge(1)}
				isSelected={isSelected}
			/>

			{children}
		</div>
	);
};

export default ResizeGridSingle;

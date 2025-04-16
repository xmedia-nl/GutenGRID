import { useEffect, useRef } from '@wordpress/element';
import classnames from 'classnames';

const DragAndNudgeHandle = ({ onStartDrag, onNudgeUp, onNudgeDown, isSelected }) => {
	const dragRef = useRef(null);

	useEffect(() => {
		const handle = dragRef.current;
		if (!handle || !onStartDrag) return;

		const onMouseDown = (e) => {
			e.preventDefault();
			e.stopPropagation();
			onStartDrag(e);
		};

		handle.addEventListener('mousedown', onMouseDown);
		handle.addEventListener('touchstart', onMouseDown);

		return () => {
			handle.removeEventListener('mousedown', onMouseDown);
			handle.removeEventListener('touchstart', onMouseDown);
		};
	}, [onStartDrag]);

	const classes = classnames('gutengrid__drag-handle-group', {
		'is-selected': isSelected,
	});

	return (
		<div className={classes}>
			<div ref={dragRef} className="gutengrid__drag-handle"></div>
			<button className="gutengrid__nudge-button" onClick={onNudgeUp}></button>
			<button className="gutengrid__nudge-button" onClick={onNudgeDown}></button>
		</div>
	);
};

export default DragAndNudgeHandle;

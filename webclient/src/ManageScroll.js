import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

let scrollPositions = {};
let timeout = null;

export function ManageScroll() {
	const location = useLocation();

	const scrollListener = useCallback(() => {
		if (timeout) {
			window.cancelAnimationFrame(timeout);
		}

		timeout = window.requestAnimationFrame(() => {
			const key = location.key;
			if (key in scrollPositions) {
				scrollPositions[key] = window.scrollY;
			}
		});
	}, [location]);

	useEffect(() => {
		window.addEventListener('scroll', scrollListener);
		return () => {
			window.removeEventListener('scroll', scrollListener);
		}
	}, [scrollListener]);

	useEffect(() => {
		const key = location.key;

		if (key in scrollPositions) {
			window.scrollTo(0, scrollPositions[key]);
		} else {
			window.scrollTo(0, 0);
			scrollPositions[key] = 0;
		}
	}, [location]);

	return (
		null
	);
};

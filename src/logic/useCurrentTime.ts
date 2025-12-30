import { useEffect, useState } from "react";

/**
 * Hook to get current time, synchronized to the top of every minute.
 */
export function useCurrentTime() {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const tick = () => setNow(new Date());
		let intervalId: ReturnType<typeof setInterval> | null = null;

		// Sync to the next full minute
		const msToNextMin = 60000 - (Date.now() % 60000);
		const timeoutId = setTimeout(() => {
			tick();
			intervalId = setInterval(tick, 60000);
		}, msToNextMin);

		return () => {
			clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
		};
	}, []);

	return now;
}

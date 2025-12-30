import { AnimatePresence, motion } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ActivityDisplay from "./components/ActivityDisplay";
import IntroOverlay from "./components/IntroOverlay";
import SettingsModal from "./components/SettingsModal";
import { getSchedule } from "./logic/scheduler";
import { type Settings, SettingsStore } from "./store/settings";
import "./styles/app.css";

export default function App() {
	const [settings, setSettings] = useState<Settings>(SettingsStore.load());
	const [now, setNow] = useState(new Date());
	const [showSettings, setShowSettings] = useState(false);
	const [showIntro, setShowIntro] = useState(!settings.hasSeenIntro);

	const schedule = getSchedule(now, settings);

	// Time Loop: Sync to minute
	useEffect(() => {
		const tick = () => setNow(new Date());
		let intervalId: ReturnType<typeof setInterval> | null = null;

		// Initial sync
		const msToNextMin = 60000 - (Date.now() % 60000);
		const timerId = setTimeout(() => {
			tick();
			intervalId = setInterval(tick, 60000);
		}, msToNextMin);

		return () => {
			clearTimeout(timerId);
			if (intervalId) clearInterval(intervalId);
		};
	}, []);

	// Update title
	useEffect(() => {
		document.title = `${schedule.label} - Office Simulator`;
	}, [schedule.label]);

	const handleDismissIntro = () => {
		setShowIntro(false);
		const updated = SettingsStore.save({ hasSeenIntro: true });
		setSettings(updated);
	};

	return (
		<main className="app-container">
			<AnimatePresence>
				{showIntro && <IntroOverlay onDismiss={handleDismissIntro} />}
			</AnimatePresence>

			<ActivityDisplay activity={schedule} />

			<motion.button
				type="button"
				className="settings-trigger"
				onClick={() => setShowSettings(true)}
				aria-label="Settings"
				whileHover={{ scale: 1.1, rotate: 15 }}
				whileTap={{ scale: 0.9 }}
				transition={{ type: "spring", stiffness: 400, damping: 17 }}
			>
				<SettingsIcon size={24} strokeWidth={1.5} />
			</motion.button>

			<SettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				currentSettings={settings}
				onUpdate={setSettings}
			/>
		</main>
	);
}

import { AnimatePresence, motion } from "framer-motion";

interface Props {
	onDismiss: () => void;
}

export default function IntroOverlay({ onDismiss }: Props) {
	return (
		<AnimatePresence>
			<motion.div
				className="intro-overlay"
				onClick={onDismiss}
				exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
			>
				<div className="intro-content">
					<p>This app shows what a normal office day feels like.</p>
					<p>There is nothing to do.</p>
					<span className="intro-hint">Tap to begin</span>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}

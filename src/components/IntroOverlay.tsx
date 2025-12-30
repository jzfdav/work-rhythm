import { motion } from "framer-motion";

interface Props {
	onDismiss: () => void;
}

export default function IntroOverlay({ onDismiss }: Props) {
	return (
		<motion.div
			className="intro-overlay"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onDismiss}
		>
			<div className="intro-content">
				<p>This app shows what a normal office day feels like.</p>
				<p>There is nothing to do.</p>
				<span className="intro-hint">(Tap to begin)</span>
			</div>
		</motion.div>
	);
}

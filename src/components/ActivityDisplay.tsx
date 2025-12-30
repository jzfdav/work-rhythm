import { AnimatePresence, motion } from "framer-motion";
import type { Activity } from "../logic/scheduler";

interface Props {
	activity: Activity;
}

export default function ActivityDisplay({ activity }: Props) {
	return (
		<div className="activity-container">
			<AnimatePresence mode="wait">
				<motion.div
					key={activity.label}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					className="activity-content"
				>
					<h1 className="activity-label">{activity.label}</h1>
					<p className="activity-context">{activity.context}</p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

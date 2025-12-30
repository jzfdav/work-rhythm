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
					key={activity.label} // Key change triggers exit/enter
					initial="hidden"
					animate="visible"
					exit="exit"
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: {
							opacity: 1,
							y: 0,
							transition: {
								staggerChildren: 0.15, // Delay context after label
								duration: 0.8,
								ease: [0.16, 1, 0.3, 1], // Elegant easeOut
							},
						},
						exit: {
							opacity: 0,
							y: -10,
							transition: { duration: 0.5, ease: "anticipate" },
						},
					}}
					className="activity-content"
				>
					<motion.h1
						className="activity-label"
						variants={{
							hidden: { opacity: 0, y: 15 },
							visible: {
								opacity: 1,
								y: 0,
								transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
							},
						}}
					>
						{activity.label}
					</motion.h1>
					<motion.p
						className="activity-context"
						variants={{
							hidden: { opacity: 0 },
							visible: { opacity: 1, transition: { duration: 1 } },
						}}
					>
						{activity.context}
					</motion.p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

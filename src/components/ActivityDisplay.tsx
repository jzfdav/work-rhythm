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
							hidden: { opacity: 0, y: 15, fontWeight: 300 },
							visible: {
								opacity: 1,
								y: 0,
								fontWeight: 500,
								transition: {
									opacity: { duration: 0.8 },
									y: { duration: 0.8 },
									fontWeight: { duration: 2, ease: "easeInOut" },
								},
							},
						}}
					>
						{activity.label}
					</motion.h1>
					<motion.p
						className="activity-context"
						variants={{
							hidden: { opacity: 0, fontWeight: 300 },
							visible: {
								opacity: 1,
								fontWeight: 400,
								transition: {
									opacity: { duration: 1 },
									fontWeight: { duration: 2.5, ease: "easeInOut" },
								},
							},
						}}
					>
						{activity.context}
					</motion.p>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

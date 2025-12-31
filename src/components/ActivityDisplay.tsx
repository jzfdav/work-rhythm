import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";
import type { Activity } from "../logic/scheduler";
import ActivityInfoModal from "./ActivityInfoModal";

interface Props {
	activity: Activity;
}

export default function ActivityDisplay({ activity }: Props) {
	const [showInfo, setShowInfo] = useState(false);

	return (
		<>
			<ActivityInfoModal
				isOpen={showInfo}
				onClose={() => setShowInfo(false)}
				activityLabel={activity.label}
			/>
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
							<span
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: "10px",
								}}
							>
								{activity.label}
								{activity.label !== "Off Hours" && (
									<motion.button
										type="button"
										onClick={() => setShowInfo(true)}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 0.4, scale: 1 }}
										whileHover={{ opacity: 1, scale: 1.1 }}
										style={{
											background: "none",
											border: "none",
											color: "#fff",
											cursor: "pointer",
											padding: "4px",
											display: "flex",
										}}
									>
										<Info size={18} strokeWidth={2} />
									</motion.button>
								)}
							</span>
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
		</>
	);
}

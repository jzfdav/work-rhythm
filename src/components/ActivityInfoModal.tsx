import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	activityLabel: string;
}

const DEFINITIONS: Record<string, string> = {
	"Core Work":
		"High-value, uninterrupted tasks requiring deep cognitive load. This is where meaningful progress happens.",
	"Urgent Task":
		"Unplanned issues demanding immediate attention. Disrupters of flow, but necessary to maintain stability.",
	"Team Sync":
		"Collaborative alignment. A time to share context and unblock teammates.",
	"Check-in": "A brief morning alignment to set intentions for the day.",
	Lunch:
		"Refuel and disconnect. Essential for sustaining energy in the afternoon.",
	Break: "A deliberate pause to reset compliance and focus.",
};

const GENERIC_DEFINITION =
	"A simulated office activity designed to create rhythmic structure.";

export default function ActivityInfoModal({
	isOpen,
	onClose,
	activityLabel,
}: Props) {
	// Fuzzy match or default
	const matchingKey = Object.keys(DEFINITIONS).find((k) =>
		activityLabel.includes(k),
	);
	const definition =
		DEFINITIONS[activityLabel] ||
		(matchingKey ? DEFINITIONS[matchingKey] : GENERIC_DEFINITION);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="modal-backdrop"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={(e) => {
						if (e.target === e.currentTarget) onClose();
					}}
					style={{
						// Specialized styling for info modal - simpler, floating
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<motion.div
						className="modal-card"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						style={{ maxWidth: "360px", padding: "1.5rem" }}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "1rem",
							}}
						>
							<h3
								style={{
									margin: 0,
									fontSize: "0.9rem",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									color: "rgba(255,255,255,0.6)",
								}}
							>
								{activityLabel}
							</h3>
							<button type="button" className="icon-btn" onClick={onClose}>
								<X size={18} />
							</button>
						</div>
						<p
							style={{
								fontSize: "1.1rem",
								lineHeight: "1.5",
								color: "#fff",
								fontWeight: 400,
							}}
						>
							{definition}
						</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

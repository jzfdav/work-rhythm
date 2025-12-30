import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { type Settings, SettingsStore } from "../store/settings";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	currentSettings: Settings;
	onUpdate: (s: Settings) => void;
}

export default function SettingsModal({
	isOpen,
	onClose,
	currentSettings,
	onUpdate,
}: Props) {
	const [start, setStart] = useState(currentSettings.workdayStart);
	const [end, setEnd] = useState(currentSettings.workdayEnd);

	const handleSave = () => {
		const updated = SettingsStore.save({
			workdayStart: start,
			workdayEnd: end,
		});
		onUpdate(updated);
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="modal-backdrop"
					initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
					animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
					exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
					transition={{ duration: 0.4 }}
				>
					<motion.div
						className="modal-card"
						initial={{ scale: 0.96, opacity: 0, y: 10 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.96, opacity: 0, y: 10 }}
						transition={{
							type: "spring",
							stiffness: 350,
							damping: 25,
							mass: 0.8,
						}}
					>
						<div className="modal-header">
							<h2>Workday Window</h2>
							<button type="button" onClick={onClose} className="icon-btn">
								<X size={20} />
							</button>
						</div>

						<div className="modal-body">
							<label>
								Start Hour
								<input
									type="number"
									min="0"
									max="23"
									value={start}
									onChange={(e) => setStart(Number(e.target.value))}
								/>
							</label>

							<label>
								End Hour
								<input
									type="number"
									min="0"
									max="23"
									value={end}
									onChange={(e) => setEnd(Number(e.target.value))}
								/>
							</label>
						</div>

						<div className="modal-footer">
							<button type="button" onClick={handleSave} className="save-btn">
								<Check size={18} /> Save
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

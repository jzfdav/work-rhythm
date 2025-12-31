import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";

interface Props {
	onClick: () => void;
}

export default function CalendarButton({ onClick }: Props) {
	return (
		<motion.button
			type="button"
			className="calendar-trigger"
			onClick={onClick}
			aria-label="Calendar"
			initial={{ y: 20, opacity: 0, x: "-50%" }}
			animate={{ y: 0, opacity: 1, x: "-50%" }}
			transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
		>
			<CalendarIcon size={18} strokeWidth={1.5} />
		</motion.button>
	);
}

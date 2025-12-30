import { motion } from "framer-motion";

interface Props {
	progress: number;
}

export default function ProgressLine({ progress }: Props) {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				height: "1px",
				background: "rgba(255, 255, 255, 0.05)",
				zIndex: 100,
			}}
		>
			<motion.div
				style={{
					height: "100%",
					background: "rgba(255, 255, 255, 0.6)",
					boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
					width: "0%",
				}}
				animate={{ width: `${progress * 100}%` }}
				transition={{ duration: 1, ease: "linear" }}
			/>
		</div>
	);
}

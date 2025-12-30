interface Option<T> {
	label: string;
	value: T;
}

interface Props<T> {
	options: Option<T>[];
	value: T;
	onChange: (val: T) => void;
	label: string;
}

export default function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	label,
}: Props<T>) {
	const activeIndex = options.findIndex((opt) => opt.value === value);

	return (
		<div className="segmented-control" role="radiogroup" aria-label={label}>
			{options.map((opt) => (
				<button
					key={opt.value}
					type="button"
					aria-pressed={value === opt.value}
					className={`segmented-option ${value === opt.value ? "active" : ""}`}
					onClick={() => onChange(opt.value)}
				>
					{opt.label}
				</button>
			))}
			<div
				className="segmented-slider"
				style={{
					left: "2px",
					width: `calc(${100 / options.length}% - 2px)`,
					transform: `translateX(${activeIndex * 100}%)`,
					transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				}}
			/>
		</div>
	);
}

/**
 * Scheduler Logic
 *
 * Pure, deterministic, stateless.
 * Maps (Date + Settings) -> Activity.
 */

import type { Settings } from "../store/settings";

export interface Activity {
	label: string;
	context: string;
}

const OFF_HOURS: Activity = { label: "Off Hours", context: "Personal Time" };

// Weekday variations (0=Sun, 6=Sat)
const PATTERNS: Record<number, string> = {
	1: "NORMAL", // Mon
	2: "NORMAL", // Tue
	3: "MEETING_HEAVY", // Wed
	4: "NORMAL", // Thu
	5: "LIGHT_FRIDAY", // Fri
};

/**
 * Returns the schedule for a given date and user settings.
 */
export function getSchedule(date: Date, settings: Settings): Activity {
	const day = date.getDay();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const totalMinutes = hours * 60 + minutes;

	// 1. Weekend Check
	if (day === 0 || day === 6) return OFF_HOURS;

	// 2. Workday Window Check
	const { workdayStart: start, workdayEnd: end } = settings;
	if (start === end) return OFF_HOURS;

	const startMins = start * 60;
	const endMins = (end < start ? end + 24 : end) * 60; // Absolute end in minutes from day start

	// Normalize current time relative to window start
	// If it's 1am and start is 10pm, normalized is 3 hours (180 mins)
	const normalizedCurrent =
		totalMinutes < startMins ? totalMinutes + 1440 : totalMinutes;

	if (normalizedCurrent < startMins || normalizedCurrent >= endMins) {
		return OFF_HOURS;
	}

	// 3. Define Blocks based on pattern
	const pattern = PATTERNS[day] || "NORMAL";
	const blocks = getBlocksForPattern(pattern, startMins, endMins);

	// 4. Find current block
	const currentBlock = blocks.find(
		(b) => normalizedCurrent >= b.start && normalizedCurrent < b.end,
	);

	return currentBlock
		? { label: currentBlock.label, context: currentBlock.context }
		: { label: "Focus", context: "General Work" };
}

interface Block {
	start: number;
	end: number;
	label: string;
	context: string;
}

function getBlocksForPattern(
	pattern: string,
	startMins: number,
	endMins: number,
): Block[] {
	// Normalize relative to start time
	const t = (offsetHours: number, offsetMins = 0) =>
		startMins + offsetHours * 60 + offsetMins;

	const baseSchedule: Block[] = [
		{ start: t(0), end: t(1), label: "Daily Check-in", context: "Morning" },
		{ start: t(1), end: t(3), label: "Deep Focus", context: "Morning" },
		{ start: t(3), end: t(4), label: "Lunch Break", context: "Midday" },
		{ start: t(4), end: t(5, 30), label: "Team Sync", context: "Afternoon" },
		{ start: t(5, 30), end: endMins, label: "Focus", context: "Afternoon" },
	];

	// Filter out blocks that fall entirely outside the window
	let blocks = baseSchedule.filter((b) => b.start < endMins);

	// Clamp the last block to endMins
	if (blocks.length > 0) {
		blocks[blocks.length - 1].end = endMins;
	}

	// Pattern-specific overrides
	if (pattern === "MEETING_HEAVY") {
		const meetingStart = t(5);
		const meetingEnd = t(6);
		if (meetingEnd < endMins) {
			blocks = [
				...blocks.filter((b) => b.end <= meetingStart),
				{
					start: meetingStart,
					end: meetingEnd,
					label: "All-Hands",
					context: "Afternoon",
				},
				...blocks.filter((b) => b.start >= meetingEnd),
			];
		}
	}

	if (pattern === "LIGHT_FRIDAY") {
		const wrapUpStart = Math.max(startMins, endMins - 30);
		blocks = [
			...blocks.filter((b) => b.end <= wrapUpStart),
			{
				start: wrapUpStart,
				end: endMins,
				label: "Wrap Up",
				context: "Weekend Ready",
			},
		];
	}

	return blocks;
}

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
	const startMins = settings.workdayStart * 60;
	const endMins = settings.workdayEnd * 60;

	if (totalMinutes < startMins || totalMinutes >= endMins) {
		return OFF_HOURS;
	}

	// 3. Define Blocks based on pattern
	const pattern = PATTERNS[day] || "NORMAL";
	const blocks = getBlocksForPattern(pattern, startMins, endMins);

	// 4. Find current block
	const currentBlock = blocks.find(
		(b) => totalMinutes >= b.start && totalMinutes < b.end,
	);

	return currentBlock
		? { label: currentBlock.label, context: currentBlock.context }
		: { label: "Transition", context: "Flow" }; // Fallback
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

	// Apply Enhancements
	if (pattern === "MEETING_HEAVY") {
		// Wed: Extra meeting at 2pm (relative to start) if it fits
		// Replacing part of Team Sync or Focus
		const meetingStart = t(5);
		const meetingEnd = t(6);
		if (meetingEnd < endMins) {
			// Insert/Overwrite logic would go here.
			// For simplicity/robustness, we'll just override the specific time range lookup
			// But since we are generating blocks, let's just patch the list.
			// Actually, easiest to just map the special cases in the finder, but let's stick to list.
			return [
				...baseSchedule.filter((b) => b.end <= meetingStart), // Before
				{
					start: meetingStart,
					end: meetingEnd,
					label: "All-Hands",
					context: "Afternoon",
				},
				...baseSchedule.filter((b) => b.start >= meetingEnd), // After
			];
		}
	}

	if (pattern === "LIGHT_FRIDAY") {
		// Fri: Wrap up 1 hr early (Display 'Wrap Up' instead of Focus)
		const lastBlock = baseSchedule[baseSchedule.length - 1];
		if (lastBlock) {
			return [
				...baseSchedule.slice(0, -1),
				{
					start: lastBlock.start,
					end: endMins - 30,
					label: "Focus",
					context: "Afternoon",
				},
				{
					start: endMins - 30,
					end: endMins,
					label: "Wrap Up",
					context: "Weekend Ready",
				},
			];
		}
	}

	return baseSchedule;
}

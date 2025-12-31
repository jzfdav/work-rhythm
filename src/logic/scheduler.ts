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
	progress: number;
}

export interface AgendaItem {
	start: number; // Minutes from midnight (can be > 1440 for overnight)
	end: number;
	label: string;
	context: string;
	type: "meeting" | "work" | "break";
}

export type DayFlavor =
	| "MEETING_HEAVY"
	| "FOCUS_HEAVY"
	| "BALANCED"
	| "LIGHT"
	| "CHAOTIC";

const OFF_HOURS: Activity = {
	label: "Off Hours",
	context: "Personal Time",
	progress: 1,
};

/**
 * Random Number Generator seeded by integer.
 * Source: Mulberry32
 */
function mulberry32(a: number) {
	return () => {
		a += 0x6d2b79f5;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function getSeedFromDate(date: Date): number {
	return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
}

/**
 * Determines the "Flavor" of the day deterministically.
 */
export function getDayFlavor(date: Date): DayFlavor {
	const day = date.getDay();
	if (day === 0 || day === 6) return "LIGHT"; // Weekends

	const seed = getSeedFromDate(date);
	const rng = mulberry32(seed);
	const rand = rng();

	if (rand < 0.2) return "MEETING_HEAVY";
	if (rand < 0.5) return "FOCUS_HEAVY";
	if (rand < 0.8) return "BALANCED";
	if (rand < 0.95) return "LIGHT";
	return "CHAOTIC";
}

/**
 * Generates the full agenda for a specific date.
 */
export function generateDailyAgenda(
	date: Date,
	settings: Settings,
): AgendaItem[] {
	const { workdayStart, workdayEnd } = settings;
	if (workdayStart === workdayEnd) return [];

	const flavor = getDayFlavor(date);
	const seed = getSeedFromDate(date);
	const rng = mulberry32(seed + 100); // Distinct seed for blocks

	// Calculate absolute minutes
	const startMins = workdayStart * 60;
	// Handle overnight shifts: if end < start, it ends the next day (add 24h)
	const isOvernight = workdayEnd < workdayStart;
	const endMins = (isOvernight ? workdayEnd + 24 : workdayEnd) * 60;

	const duration = endMins - startMins;
	const items: AgendaItem[] = [];
	let current = startMins;

	// Helper to generate blocks
	const addBlock = (
		dur: number,
		label: string,
		context: string,
		type: AgendaItem["type"],
	) => {
		const next = Math.min(current + dur, endMins);
		if (next > current) {
			items.push({ start: current, end: next, label, context, type });
			current = next;
		}
	};

	// 1. Initial Check-in (always present)
	addBlock(15 + Math.floor(rng() * 15), "Check-in", "Morning", "meeting");

	while (current < endMins) {
		const remaining = endMins - current;
		if (remaining <= 0) break;

		const r = rng();

		// Logic variants based on Flavor
		if (flavor === "MEETING_HEAVY") {
			// Many short blocks, interruptions
			if (r < 0.7) {
				const len = 15 + Math.floor(rng() * 45); // 15-60m
				addBlock(len, getRandomMeetingLabel(rng), "Sync", "meeting");
			} else {
				const len = 30 + Math.floor(rng() * 30);
				addBlock(len, "task", "Between Meetings", "work");
			}
		} else if (flavor === "FOCUS_HEAVY") {
			// Long blocks
			if (r < 0.8) {
				const len = 60 + Math.floor(rng() * 120); // 1-3h
				addBlock(len, "Core Work", "Primary Project", "work");
			} else {
				const len = 15 + Math.floor(rng() * 30);
				addBlock(len, "Break", "Rest", "break");
			}
		} else if (flavor === "CHAOTIC") {
			// Random sizes
			const len = 10 + Math.floor(rng() * 50);
			const typeRand = rng();
			if (typeRand < 0.5) addBlock(len, "Urgent Task", "Priority", "work");
			else addBlock(len, getRandomMeetingLabel(rng), "Ad-hoc", "meeting");
		} else {
			// Balanced / Light
			if (
				current > startMins + duration * 0.4 &&
				current < startMins + duration * 0.6 &&
				items.every((i) => i.label !== "Lunch")
			) {
				addBlock(45, "Lunch", "Break", "break"); // Try to squeeze lunch in middle
			} else {
				if (r < 0.4) {
					addBlock(30 + Math.floor(rng() * 60), "Core Work", "Project", "work");
				} else {
					addBlock(30, "Team Sync", "Recurring", "meeting");
				}
			}
		}
	}

	// Ensure the last block ends exactly at endMins
	if (items.length > 0) {
		const last = items[items.length - 1];
		if (last.end !== endMins) {
			last.end = endMins;
		}
	}

	return items;
}

function getRandomMeetingLabel(rng: () => number) {
	const labels = [
		"Weekly Sync",
		"Client Call",
		"Design Review",
		"1:1",
		"Retrospective",
		"Planning",
		"Standup",
	];
	return labels[Math.floor(rng() * labels.length)];
}

/**
 * Returns the schedule for a given date and user settings.
 */
export function getSchedule(date: Date, settings: Settings): Activity {
	const { workdayStart, workdayEnd } = settings;
	if (workdayStart === workdayEnd) return OFF_HOURS;

	const mins = date.getHours() * 60 + date.getMinutes();
	// Check if today is a workday or if we are in an overnight shift from yesterday
	// This simple logic assumes the user is asking for "now"

	// We need to determine if we are "in" a specific workday window.
	// 1. Check Today's window
	const startMins = workdayStart * 60;
	const isOvernight = workdayEnd < workdayStart;
	const endMins = (isOvernight ? workdayEnd + 24 : workdayEnd) * 60;

	// Shift TODAY
	if (mins >= startMins && mins < endMins) {
		const agenda = generateDailyAgenda(date, settings);
		const block = agenda.find((b) => mins >= b.start && mins < b.end);
		if (block) return blockToActivity(block, mins);
	}

	// Shift YESTERDAY (only relevant for overnight shifts)
	if (isOvernight && mins < workdayEnd * 60) {
		const yesterday = new Date(date);
		yesterday.setDate(yesterday.getDate() - 1);
		const agenda = generateDailyAgenda(yesterday, settings);
		// Adjust mins to be relative to yesterday's start (e.g. 01:00 is 25:00)
		const relativeMins = mins + 1440;
		const block = agenda.find(
			(b) => relativeMins >= b.start && relativeMins < b.end,
		);
		if (block) return blockToActivity(block, relativeMins);
	}

	return OFF_HOURS;
}

function blockToActivity(block: AgendaItem, currentMins: number): Activity {
	const duration = block.end - block.start;
	const elapsed = currentMins - block.start;
	return {
		label: block.label,
		context: block.context,
		progress: Math.max(0, Math.min(1, elapsed / duration)),
	};
}

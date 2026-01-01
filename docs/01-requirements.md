# Functional Requirements

## Core Functionality
- **Display Activity**: The UI must prominently display the current "workplace activity" (e.g., "Team Sync", "Lunch") based on the user's local system time.
- **Display Context**: A secondary label must provide context (e.g., "Morning", "Afternoon").
- **Real-time Updates**: The display must update automatically as time progresses, accurate to the minute.
- **Offline Capability**: The app must function fully without an internet connection.
- **Installability**: The app must be installable as a PWA on mobile and desktop devices.
- **Configurable Schedule**: Users can define their workday window (Start/End) and project name via a settings interface.
- **Daily Agenda**: Users can view the full daily schedule, which is deterministically generated based on the date and selected flavor.

## Constraints (Non-Functional)
- **Passive by Default**: The primary interface should require no interaction. Buttons/controls must be unobtrusive or hidden until needed.
- **Privacy First**: All data (schedule settings) must be stored locally. No server communication.
- **Determinism**: The same time on the same day of the week must always yield the same result for the same settings.
- **Performance**: The app should be extremely lightweight (<2MB) and load instantly.
- **Aesthetics**: The design should be "Business Zen"—minimal, dark mode, reliable, and premium.

## Correct Behavior
- Opening the app and seeing a static text label (e.g., "Off Hours") for hours on end is **correct behavior**.
- The app appearing "broken" because nothing is happening is **correct behavior** (it matches the stillness of the design).
- The "Work Rhythm" branding should be consistent across all screens.

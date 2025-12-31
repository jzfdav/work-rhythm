# Functional Requirements

## Core Functionality
- **Display Activity**: The UI must prominently display the current "workplace activity" (e.g., "Team Sync", "Lunch") based on the user's local system time.
- **Display Context**: A secondary label must provide context (e.g., "Morning", "Afternoon").
- **Real-time Updates**: The display must update automatically as time progresses, accurate to the minute.
- **Offline Capability**: The app must function fully without an internet connection.
- **Installability**: The app must be installable as a PWA on mobile and desktop devices.

## Constraints (Non-Functional)
- **Zero Input**: There must be no buttons, forms, or interactive elements that require user input.
- **Statelessness**: The app must not store any user progress or history. Every day starts fresh based on the clock.
- **Determinism**: The same time on the same day of the week must always yield the same result.
- **Performance**: The app should be extremely lightweight (<2MB) and load instantly.

## Correct Behavior
- Opening the app and seeing a static text label (e.g., "Off Hours") for hours on end is **correct behavior**.
- The app appearing "broken" because nothing is happening is **correct behavior** (it matches the stillness of the design).

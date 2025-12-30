# System Design

## Architecture

## Architecture

The application is a **React 18+** application built with **Vite** and **TypeScript**.

### Components

1.  **Entry (`main.tsx`)**
    *   Mounts the React root.
    *   Imports global styles.

2.  **Orchestrator (`App.tsx`)**
    *   **Role**: The "Heartbeat".
    *   **State**: Holds current `Date`.
    *   **Hook**: Custom `useTimeLoop` hook aligns to minute boundaries.

3.  **Components (`src/components/`)**
    *   `ActivityDisplay`: Displays the main text. Uses `framer-motion` for `AnimatePresence` transitions.
    *   `ContextLabel`: Displays "Morning/Afternoon".

4.  **Logic (`simulation.ts`)**
    *   **Role**: The "Truth".
    *   **Type**: Pure function `(date: Date) => Activity`.
    *   **Schedule**: Hardcoded, deterministic.

## Data Flow

`Time (useTimeLoop)` -> `App Component State` -> `simulation.ts` -> `Activity Object` -> `Framer Motion Props` -> `DOM`

# Operational Constraints

## 1. Zero Trust in Persistence
The app must assume it will be killed by the OS at any moment. It must restore its state instantly upon reopening solely by reading the current time.

## 2. Privacy Absolute
Data must never leave the device. In fact, data should barely exist *on* the device.

## 3. The "Burnt-Out User" Persona
Assume the user is currently suffering from high stress or burnout.
- Any UI element that looks like a "task" is a bug.
- Any text that sounds "judgemental" (e.g., "You missed your check-in") is a critical failure.

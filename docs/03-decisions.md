# Technical Decisions Log

## 001. React + TypeScript
*   **Decision**: Migrate to React stack.
*   **Rationale**: Leveraging `framer-motion` for high-quality, "calm" transitions is difficult in vanilla JS. React provides a declarative way to handle these visual states.

## 002. Biome
*   **Decision**: Use Biome over ESLint/Prettier.
*   **Rationale**: Faster, zero-config, handles both linting and formatting uniformly.

## 003. Framer Motion
*   **Decision**: Use for all text transitions.
*   **Rationale**: The text changing instantly can be jarring. Smooth cross-fades align with the "Calm" philosophy.

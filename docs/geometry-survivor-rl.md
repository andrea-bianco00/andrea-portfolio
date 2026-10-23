# Geometry Survivor — Phase 2: Reinforcement Learning

Status: **environment design started; no trained model or AI mode deployed yet**.

## Product experience
- PLAY: keep the current game, controls, verified score submission and leaderboard unchanged.
- WATCH AI: reuse the **same canvas and game physics**; never create a second arena on the homepage.
- Show live survival time, episode number, AI best and current action.
- Optional AI VISION: visualize actual model inputs (player velocity and tracked threats). Do not draw fictitious sensors.
- Training results and reproducible evaluation belong on the project detail page, not in a crowded homepage.
- A public GitHub training repository will contain training code, checkpoints (where practical), reproducibility instructions, baseline comparisons and real evaluation metrics.

## Exact simulator contract
Source of truth: `app/lib/geometry-core.ts`. Dimensions 720×405, fixed physics step 1/120 second, deterministic seed, obstacle spawning, collisions, drag and movement must stay identical to PLAY.

Observation v1: `app/lib/geometry-ai-observation.ts`. Fixed 53 float vector:
- 4 player values: normalized position x/y, velocity vx/vy.
- 8 most threatening obstacles, each with normalized relative position x/y, relative velocity vx/vy, collision radius and a presence mask. Empty slots are zero.
- 1 elapsed-difficulty scalar.

Threat ranking is based on closest predicted approach over the next two seconds; this is **an observation heuristic**, not an AI policy. The agent still must learn actions from rewards.

Actions: 9 discrete controls: idle, cardinal and diagonal directions. Use the same `aiAction` mapping in both training and inference. A policy decision should be held for a configurable number of physics ticks (initial experiment: 6 ticks = 20 Hz).

## Training and evaluation plan
1. Make a headless training environment that reproduces the TypeScript game step-for-step. Prefer a single simulator implementation or automated cross-language parity tests over independent implementations that silently drift.
2. Define an episode reward: +survival time; collision ends episode. Test a modest negative terminal reward. Avoid shaping that rewards camping or exploiting boundaries.
3. Train a random-policy baseline and a simple deterministic baseline first. Evaluate on fixed held-out seeds, not just training seeds.
4. Train PPO (candidate: Python + Stable-Baselines3) with several seeds, evaluate survival time distribution, median, mean, p90, and collision rate.
5. Validate observations, action timing, seed reproducibility and identical behavior in browser inference. Export a compact inference model only after successful evaluation.
6. Add WATCH AI with model loading on demand. Never load the model for PLAY visitors; do not require Supabase or an AI inference server.
7. Publish the real learning curves and metrics. No invented best runs, fabricated training graphs, or claims of learning before evidence.

## Acceptance criteria
- Existing PLAY mode and global leaderboard unchanged.
- AI runs the **real trained policy**, not scripted avoidance.
- AI deaths restart an episode; AI runs do not submit to the human leaderboard.
- Visual overlay is optional, legible on mobile and corresponds to actual observation features.
- Deterministic evaluation and a repeatable training command documented on GitHub.
- Clear loading/error fallback if the model is unavailable.

## Security and privacy
Never publish Supabase keys, session secrets, player identifiers or production environment variables. Public model files must not contain private credentials. AI inference is local in the visitor's browser.

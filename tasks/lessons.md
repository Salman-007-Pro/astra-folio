# Lessons

## Card tilt targets the outer chrome

When a visual style wraps art + title in a padded card (Glass, Clay, Aurora, …), `data-tilt` belongs on that outer surface (`.project-item`), not the inner diagram (`.project-art`). Nested inner tilt reads as the wrong card moving.

## Mouse-follow needs a lerp, not a short CSS transition

Updating `--tilt-*` every pointer frame with a 60ms CSS transition fights itself and feels snappy. Interpolate the pose in JS (`lerpTilt`) each animation frame, and keep CSS transitions for lift/shine/shadow only.

## High-refresh lerp must be time-based

A fixed follow amount like `0.14` per rAF is ~250ms at 60Hz and ~130ms at 120Hz, so the ease disappears on high-refresh laptops. Use `1 - exp(-dt / tau)` (`tiltStep`) so follow and return feel the same at any refresh rate.

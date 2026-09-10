# Performance evidence and limits

Targets: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.10 at field p75. These require production observation and are not inferred from compilation.

Scene assets: procedural geometry, zero external model/texture downloads. Initial scene transfer budget 3 MB compressed. Whole static JS compression checked by `pnpm budget`; reading HTML must not import the world.

Quality caps DPR at 1.5 / 1.25 / 1.0. Particle counts are 28 / 14 / 6. Low quality removes contact shadows and antialiasing. Rendering pauses when offscreen or hidden. A 120-frame post-warmup sample downgrades when average frame time exceeds 34 ms.

Tests report build sizes and browser behavior separately. Headless/desktop emulation does not establish actual mid-range phone performance, Safari compatibility, or field Core Web Vitals. Those remain launch validation tasks.

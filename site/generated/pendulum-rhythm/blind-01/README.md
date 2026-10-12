# Pendulum Rhythm Lab — blind text-only candidate

A portable, offline static Three.js 0.183.2 experiment. The only design input was `INPUT-PROMPT.md`. Every instrument part, texture, label, environment light panel, and animation was generated in this candidate directory. The continuous recording shows the running browser; it is not used by the application.

## Run

From this directory:

```sh
node server.mjs
```

Open `http://127.0.0.1:4187`. Set `PORT` to change the port. A normal static web server also works. `index.html`, `app.js`, `model.js`, `style.css`, and `vendor/` use relative URLs and can be hosted under `/generated/pendulum-rhythm/blind-01/`. An iframe is suitable when embedding in another application. No install, network fetch, backend, account, build step, or machine-specific path is required to run the page.

## Use

- Drag the background to orbit, right-drag to pan, scroll to zoom. Touch gestures are provided by OrbitControls.
- Click a bob to push it. Drag it vertically to change its length; drag sideways to change the common release amplitude. Releasing a drag starts both swings together.
- Drag a real instrument dial to tune length. Click it to advance to the next reachable simple finite-bob period ratio. The two semantic range controls also support keyboard adjustment and ratio snapping.
- Drag the glass time band to scrub; click near a sync marker to jump. Its central playhead stays fixed while the traces and events scroll.
- Select Drift, 5:4, 3:2, Twins, or Wave. Wave has fifteen model-driven bobs swinging in depth. The displayed formation is measured from phase coherence, not a timed animation.
- Lab, Exploded and Studio views preserve time. Mobile secondary controls expand via “Experiment settings”; both length controls remain exposed.
- Space pause/play; comma/period step; brackets previous/next in-step; 1–5 presets; Shift+O/P push; 0 release; Shift+V views; R reset camera; C cinematic; slash hide interface.

## Model

`model.js` is an independent, editable ES module. It implements damped nonlinear pendulum dynamics using RK4 at 1/480 s and stores angle, angular velocity and unwrapped estimated phase at 120 Hz for the whole 0–180 s interval. The finite spherical bob correction is `L + 0.4r²/L`. Period estimates use the AGM nonlinear formula. Sync/anti-sync markers come from phase crossings in the same cache. Floating-point crossings below 1e-9 rad are ignored, so exactly matched periods do not invent reunions.

An impulse is recorded at the nearest 1/480 s integration instant, amplitude-limited, and replayed deterministically. Adding an impulse in the past discards the later branch. Length and release-amplitude changes clear impulses and release both bobs together. The render clock does not feed into the integrator.

## Test API

`window.pendulumLab.ready` is a boolean. Its methods are:

```js
snapshot()
setPreset('Drift' | '5:4' | '3:2' | 'Twins' | 'Wave')
setTime(seconds)       // 0–180, redraws synchronously
play(); pause()
setSpeed(1 | 0.5 | 0.25)
setLength(index, cm)   // pair mode, 0=blue / 1=amber
push(index, deltaOmega) // rad/s, capped to ±1.2 before energy limit
release()
setView('Lab' | 'Exploded' | 'Studio')
resetCamera()
setCinematic(boolean)
```

`snapshot()` creates independent values and arrays. Actual field names are:

`time`, `playing`, `speed`, `mode` (`pair` or `wave`), `preset`, `lengths` (meters), `radii` (meters), `angles` (radians), `angularVelocities` (rad/s), `periods` (seconds), `phases` (unwrapped radians), `syncEvents`, `pushEvents`, `view`, `camera`, `renderCount`, `interactive`, `formation`, `amplitude`, `repairCount`.

`syncEvents` entries are `{time, kind:'in'|'anti'}`. `pushEvents` entries are `{time,index,deltaOmega}`. `camera` has `position`, `target`, and `fov`. `formation` contains phase coherence for m=1,2,3,4.

`interactive` entries are `{type,index,x,y}`. Types are `bob`, `knob`, `band`, `previous`, `next`; `x/y` are current viewport CSS pixels suitable for real pointer tests. Hidden pair/wave groups are excluded. Coordinates are projections, so another UI surface may cover a point after arbitrary camera movements.

## Reproduce verification

```sh
node tests/model.mjs
```

For browser tests, make Playwright available as a Node module, or set `PLAYWRIGHT_MODULE` to an installed Playwright module directory. The tests use installed Chrome by default; `BROWSER_CHANNEL` can override this. Hardware arguments used on this machine are `--use-angle=metal --enable-gpu`.

```sh
node tests/browser.mjs
node tests/record.mjs
```

Set `LAB_URL` to target a different running URL. Recording writes a native continuous WebM. Set `FFMPEG` to an ffmpeg executable to additionally produce MP4. Recording runs continuously at real 1× for at least 24 model seconds, retains initial navigation/setup, and makes no cuts or time changes during the run.

Evidence is in `artifacts/`: model and browser JSON, desktop/default mobile screenshots, Wave/Exploded/Studio screenshots, continuous WebM and MP4, and wall/model clock sampling. Detailed delivery and source hashes are in `DELIVERY.json` and `PROVENANCE.json`.

## Honest implementation limits

- The floor uses PBR environment reflections and shadow maps; it has no planar or screen-space reflection of the instrument. Contact shading is approximated by soft PCF shadows rather than ray tracing or a dedicated contact-shadow pass.
- The thin glass is intentionally translucent. It does not claim physical refraction. Bloom uses Three’s standard UnrealBloomPass and OutputPass.
- Exploded view separates washers, pins, hubs, rods and bobs and labels them; its labels are deliberately small and it does not implement a mechanical reassembly animation or individually draggable parts.
- Sideways bob drags set the common release amplitude. Clicks supply an impulse; there is no separate velocity-sensitive flick recognition.
- The time-band trace in Wave shows the first two of fifteen model channels; wave formation uses all fifteen phases. Pair length controls and dials are hidden in Wave.
- Wave reunions are approximate with damping. Speed controls apply to the model clock; rendering may be slower on other machines. No universal frame-rate claim is made.
- The initial camera distance is fitted to viewport and controls rather than fixed at 17.32 units. Mobile uses a separate fit and reserve around controls. Very small hardware detail and labels are necessarily less readable on phone screens.
- The rigid support, massless rods/hubs, independent pendulums and no-collision assumptions follow the supplied model specification.

Four self-repair passes were made after viewing/testing only this candidate. No reference project, screenshot, target site, previous candidate, or parent evaluation was inspected.

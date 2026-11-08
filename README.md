# AMS2 Brake & Throttle Trace

Real-time pedal input visualizer for [Automobilista 2](https://www.automobilistagame.com/). Connects to AMS2's UDP telemetry, draws live throttle and brake traces on a translucent floating dashboard.

![Dashboard](screenshot.png)

## Features

- **Live trace** of throttle and brake inputs with scrolling window (3-60s)
- **Stats row** showing Speed, Gear, RPM, Throttle %, Brake %
- **Translucent UI** — floats over the game window
- **Grid & fill toggles** — clean up the view
- **Simulation mode** — demo drive cycle without AMS2 running
- **Export PNG** — save traces as images
- **6 launch modes** — full, no stats, trace only, stats + trace, trace + infill, stats + trace + infill

## Requirements

- [Node.js](https://nodejs.org/) (LTS)
- Windows 10/11
- AMS2 with UDP telemetry enabled

## Setup

1. Clone or download this repo
2. In AMS2: Options → Telemetry → set UDP port to `5606`, disable Shared Memory
3. Double-click `start-ams2.bat`
4. Pick a mode (1-6) from the menu

The relay binds to UDP `0.0.0.0:5606` and HTTP `localhost:15608`. The dashboard opens in your default browser.

## Modes

| Mode | Description | Size |
|------|-------------|------|
| 1 | Full (Trace + Stats + Controls) | 800×300 |
| 2 | No Stats (Trace + Controls) | 800×240 |
| 3 | Trace Only | 800×180 |
| 4 | Stats + Trace | 800×200 |
| 5 | Trace + Infill | 800×180 |
| 6 | Stats + Trace + Infill | 800×200 |

Individual `.bat` files for each mode are in the `launchers/` folder.

## Controls

- **Grid** — show/hide grid lines and axis ticks
- **Fill** — show/hide coloured fill below trace lines
- **Sim** — toggle simulation mode (demo drive cycle)
- **Clear** — clear the trace buffer
- **Export PNG** — save current trace as image
- **Window** — adjust scroll window (3-60 seconds)
- **W / H** — custom window size (saved across sessions)
- **Reset 800** — restore default 800×300 size

## Resource Usage

~80-150MB RAM, ~2-4% CPU. Very light — just a Node.js process and a browser tab.

## UDP Protocol

Uses AMS2 Telemetry Data Packet (Packet Type 0, 559 bytes):

| Offset | Type | Field |
|--------|------|-------|
| 13 | uint8 | Throttle (0-255) |
| 14 | uint8 | Brake (0-255) |
| 36 | float32 LE | Speed (km/h) |
| 40 | uint16 LE | RPM |
| 45 | uint8 | Gear (bitmask) |

## Troubleshooting

- **Relay won't start / EADDRINUSE** — AMS2 is already bound to port 5606. Close AMS2, then run the launcher.
- **No data on trace** — check AMS2 UDP port is set to 5606 and Shared Memory is disabled.
- **Trace looks squished** — adjust W/H inputs in the controls row.

## Recording with OBS

To overlay the trace on your streaming/recording setup:

1. In OBS, add a **Browser Source**
2. Set URL to `http://localhost:15608/?mode=X` (replace X with mode 1-6)
3. Set Width/Height to match your preferred size (e.g. 800×300 for mode 1)
4. Position the source over your game capture
5. Right-click → **Interact** to toggle grid/fill/sim while streaming

Pick mode 3 (trace only) or 5 (trace + infill) for the cleanest overlay with no UI controls visible.

## License

MIT

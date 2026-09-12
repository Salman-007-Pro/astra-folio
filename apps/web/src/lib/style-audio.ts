import type { Preferences } from "./preferences";
import type { VisualStyle } from "./visual-styles";

const voices: Record<VisualStyle, [OscillatorType, number, number]> = {
  default: ["sine", 520, 1.5],
  cyberpunk: ["sawtooth", 160, 2],
  holographic: ["sine", 740, 1.5],
  pixel: ["square", 330, 2],
  parallax: ["sine", 220, 1.5],
  glass: ["sine", 880, 1.25],
  neumorphism: ["sine", 280, 1.125],
  paper: ["triangle", 180, 1.33],
  editorial: ["triangle", 392, 1.25],
  aurora: ["sine", 440, 1.5],
  cartoon: ["triangle", 480, 2],
  scrollytelling: ["sine", 294, 1.33],
  vintage: ["triangle", 349, 1.5],
  clay: ["sine", 240, 1.25],
  doodle: ["triangle", 587, 1.125],
};
let context: AudioContext | undefined;
let generation = 0;
let lastClick = 0;
const playing = new Set<OscillatorNode>();
export function stopStyleSound() {
  generation++;
  playing.forEach((node) => {
    try {
      node.stop();
    } catch {}
  });
  playing.clear();
}
export function playStyleSound(
  style: VisualStyle,
  kind: "click" | "change" = "click",
) {
  if (document.hidden) return;
  if (kind === "click" && performance.now() - lastClick < 80) return;
  lastClick = performance.now();
  stopStyleSound();
  const request = generation;
  try {
    context ||= new AudioContext();
    const audio = context;
    const start = () => {
      if (request !== generation || document.hidden) return;
      const [type, base, interval] = voices[style];
      const notes =
        kind === "change" ? [base, base * interval, base * 2] : [base];
      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const at = audio.currentTime + index * 0.065;
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, at);
        const volume = type === "square" || type === "sawtooth" ? 0.012 : 0.035;
        gain.gain.setValueAtTime(0, at);
        gain.gain.linearRampToValueAtTime(volume, at + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        playing.add(oscillator);
        oscillator.onended = () => {
          playing.delete(oscillator);
          oscillator.disconnect();
          gain.disconnect();
        };
        oscillator.start(at);
        oscillator.stop(at + 0.13);
      });
    };
    if (audio.state === "running") start();
    else
      void audio
        .resume()
        .then(start)
        .catch(() => {});
  } catch {
    /* Audio is optional in browsers that disallow playback. */
  }
}
window.addEventListener("garden:preferences", (event) => {
  if (!(event as CustomEvent<Preferences>).detail.sound) stopStyleSound();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopStyleSound();
});

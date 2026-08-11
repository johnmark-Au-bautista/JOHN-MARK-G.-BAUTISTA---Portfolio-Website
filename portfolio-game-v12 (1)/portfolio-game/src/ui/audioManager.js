// ============================================================
// AUDIO MANAGER — plain HTML5 <audio> elements, deliberately NOT
// Phaser's built-in sound loader. Phaser's loader fetches audio
// files over the network (XHR/fetch, same as any other asset),
// and that does not reliably work for base64 data: URIs when
// index.html is opened directly from disk (file:// protocol, no
// local server) — the load just hangs and the game gets stuck on
// the loading screen. A native <audio> element instead plays a
// data: URI directly, no network request involved, so this keeps
// every sound embedded (no separate audio files) while actually
// working when double-clicked.
// ============================================================

const AudioManager = (() => {
  const opening = new Audio(AUDIO_OPENING);
  const walkConcrete = new Audio(AUDIO_WALK_CONCRETE);
  const walkGrass = new Audio(AUDIO_WALK_GRASS);
  const achievement = new Audio(AUDIO_ACHIEVEMENT);

  const OPENING_VOLUME = 0.6;
  opening.volume = OPENING_VOLUME;
  walkConcrete.loop = true;
  walkConcrete.volume = 0.45;
  walkGrass.loop = true;
  walkGrass.volume = 0.45;
  achievement.volume = 0.6;

  let openingFadeTimer = null;
  let currentFootstep = null;

  // Autoplay may be blocked by the browser until the user interacts
  // with the page at all (standard browser policy, not a bug here) —
  // .play() failing silently in that case is expected and harmless.
  function safePlay(el) { el.play().catch(() => {}); }

  function playOpening() {
    if (openingFadeTimer) { clearInterval(openingFadeTimer); openingFadeTimer = null; }
    opening.currentTime = 0;
    opening.volume = OPENING_VOLUME;
    safePlay(opening);
  }

  function fadeOutOpening(duration = 400) {
    if (opening.paused) return;
    if (openingFadeTimer) clearInterval(openingFadeTimer);
    const steps = 20;
    let i = 0;
    openingFadeTimer = setInterval(() => {
      i++;
      opening.volume = Math.max(0, OPENING_VOLUME * (1 - i / steps));
      if (i >= steps) {
        clearInterval(openingFadeTimer);
        openingFadeTimer = null;
        opening.pause();
        opening.currentTime = 0;
      }
    }, duration / steps);
  }

  // surface: 'concrete' (indoors) or 'grass' (outdoors)
  function playFootstep(surface) {
    const track = surface === 'grass' ? walkGrass : walkConcrete;
    if (currentFootstep === track && !track.paused) return;
    stopFootstep();
    currentFootstep = track;
    track.currentTime = 0;
    safePlay(track);
  }

  function stopFootstep() {
    if (currentFootstep) {
      currentFootstep.pause();
      currentFootstep.currentTime = 0;
      currentFootstep = null;
    }
  }

  function playAchievement() {
    achievement.currentTime = 0;
    safePlay(achievement);
  }

  return { playOpening, fadeOutOpening, playFootstep, stopFootstep, playAchievement };
})();

// ============================================================
// MOBILE CONTROLS — an on-screen D-pad + interact button, always
// shown (works with mouse too, not just touch). RoomScene.js
// reads MobileControls.state each frame alongside the keyboard,
// so both work at the same time.
// ============================================================

const MobileControls = (() => {
  const state = { up: false, down: false, left: false, right: false };
  let interactPressed = false;

  function init() {
    const panel = document.getElementById('mobile-controls');
    panel.classList.add('visible'); // always visible — works for mouse or touch

    document.querySelectorAll('.mc-btn').forEach(btn => {
      const dir = btn.dataset.dir;
      const press = (e) => { e.preventDefault(); state[dir] = true; };
      const release = (e) => { e.preventDefault(); state[dir] = false; };
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    });

    const interactBtn = document.getElementById('mc-interact-btn');
    const pressInteract = (e) => { e.preventDefault(); interactPressed = true; };
    interactBtn.addEventListener('touchstart', pressInteract, { passive: false });
    interactBtn.addEventListener('mousedown', pressInteract);
  }

  // Called once per frame by RoomScene — returns true once, then resets,
  // so a single tap triggers one interaction (not a repeat every frame).
  function consumeInteract() {
    if (interactPressed) { interactPressed = false; return true; }
    return false;
  }

  return { init, state, consumeInteract };
})();

// ============================================================
// WINDOW MANAGER — retro OS-style popup windows, built as plain
// DOM elements layered over the game canvas (not inside Phaser).
// This is what gives the "Windows 95" feel: title bar, close
// button, chunky pixel border. No dragging yet (see README TODO).
//
// Usage: UI.openWindow({ id, title, html, width })
//        UI.closeWindow(id)
// ============================================================

const UI = (() => {
  const root = document.getElementById('ui-root');
  const openWindows = {};
  let stackOffset = 0;

  function openWindow({ id, title, html, width = 480 }) {
    if (openWindows[id]) {
      closeWindow(id);
    }

    const win = document.createElement('div');
    win.className = 'retro-window';
    win.style.width = width + 'px';
    win.style.left = `calc(50% - ${width / 2}px + ${stackOffset}px)`;
    win.style.top = `calc(50% - 200px + ${stackOffset}px)`;
    stackOffset = (stackOffset + 24) % 96;

    win.innerHTML = `
      <div class="retro-titlebar">
        <span class="retro-title">${title}</span>
        <button class="retro-close" aria-label="Close">✕</button>
      </div>
      <div class="retro-body">${html}</div>
    `;

    win.querySelector('.retro-close').addEventListener('click', () => closeWindow(id));
    root.appendChild(win);
    openWindows[id] = win;
    return win;
  }

  function closeWindow(id) {
    if (openWindows[id]) {
      openWindows[id].remove();
      delete openWindows[id];
    }
  }

  function closeAll() {
    Object.keys(openWindows).forEach(closeWindow);
  }

  return { openWindow, closeWindow, closeAll };
})();

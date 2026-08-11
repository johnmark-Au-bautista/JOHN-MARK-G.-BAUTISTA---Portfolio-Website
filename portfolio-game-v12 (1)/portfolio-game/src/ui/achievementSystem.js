// ============================================================
// ACHIEVEMENT SYSTEM — tracks unlocks in the Phaser registry,
// shows a small toast when one unlocks, and checks for the
// "completionist" achievement automatically.
// ============================================================

const AchievementSystem = (() => {
  let sceneRef = null;

  function init(scene) {
    sceneRef = scene;
    if (!scene.registry.has('achievements')) {
      const initial = {};
      ACHIEVEMENTS.forEach(a => { initial[a.id] = false; });
      scene.registry.set('achievements', initial);
    }
  }

  function unlock(id) {
    if (!sceneRef) return;
    const achievements = sceneRef.registry.get('achievements');
    if (achievements[id]) return; // already unlocked

    achievements[id] = true;
    sceneRef.registry.set('achievements', achievements);
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (def) showToast(def);

    // Check completionist (every achievement except itself)
    const others = ACHIEVEMENTS.filter(a => a.id !== 'completionist');
    if (others.every(a => achievements[a.id]) && !achievements.completionist) {
      achievements.completionist = true;
      sceneRef.registry.set('achievements', achievements);
      showToast(ACHIEVEMENTS.find(a => a.id === 'completionist'));
    }
  }

  function showToast(def) {
    AudioManager.playAchievement();

    const root = document.getElementById('ui-root');
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="achievement-toast-icon">🏆</div>
      <div>
        <div class="achievement-toast-title">Achievement Unlocked</div>
        <div class="achievement-toast-name">${def.title}</div>
      </div>
    `;
    root.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  function getAll(scene) {
    const achievements = scene.registry.get('achievements') || {};
    return ACHIEVEMENTS.map(a => ({ ...a, unlocked: !!achievements[a.id] }));
  }

  return { init, unlock, getAll };
})();

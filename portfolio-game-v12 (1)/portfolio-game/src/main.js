const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#1A1C22',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, RoomScene]
};

// Wait for the pixel fonts to actually finish loading before Phaser draws
// any text. Without this, the very first text drawn (the loading-screen
// title) can render with the wrong font metrics and clip/drop letters —
// this is what caused the missing "H" in "JOHN MARK BAUTISTA".
const fontChecks = [
  '16px "Press Start 2P"',
  '22px "Press Start 2P"',
  '11px "Press Start 2P"',
  '12px "Press Start 2P"',
  '13px "VT323"',
  '18px "VT323"'
].map(spec => document.fonts.load(spec).catch(() => {}));

Promise.all(fontChecks).finally(() => {
  new Phaser.Game(config);
});

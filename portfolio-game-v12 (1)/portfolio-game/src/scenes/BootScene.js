// ============================================================
// BOOT SCENE — a real loading/splash screen. Loads real art from
// embedded base64 data (ASSET_DATA, see assetData.js), draws the
// player/door placeholders, then waits for the "Press Start 2P"
// web font to actually finish loading (document.fonts.ready)
// BEFORE rendering any text in it — rendering pixel-font text
// before the font is ready causes corrupted/missing glyphs
// (that's what caused the missing "H" in the title before).
// ============================================================

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#2B2E38');

    // Plain system-font progress text only here — safe immediately,
    // no custom webfont dependency during the actual asset load.
    this.progressText = this.add.text(width / 2, height / 2, "Loading... 0%", {
      fontFamily: 'monospace', fontSize: '16px', color: '#F4EBDD'
    }).setOrigin(0.5);
    const barBg = this.add.rectangle(width / 2, height / 2 + 40, 340, 20, 0x1A1C22).setStrokeStyle(2, 0x4A6FA5);
    this.bar = this.add.rectangle(width / 2 - 164, height / 2 + 40, 4, 14, 0x2FB8AC).setOrigin(0, 0.5);

    this.load.on('progress', (v) => {
      this.bar.width = 328 * v;
      this.progressText.setText(`Loading... ${Math.floor(v * 100)}%`);
    });

    Object.keys(ASSET_DATA).forEach((key) => {
      this.load.image(key, ASSET_DATA[key]);
    });
  }

  create() {
    this.makeDoorTexture();
    this.makeKitchenTextures();
    this.makeTreeTexture();
    MobileControls.init();

    // Wait for the pixel font to actually be ready before drawing any
    // text with it — this is what fixes the corrupted-title bug.
    const fontReady = document.fonts ? document.fonts.load('22px "Press Start 2P"') : Promise.resolve();
    fontReady.finally(() => this.showTitleScreen());
  }

  makeTreeTexture() {
    // Simple pixel-style tree for filling dead space outside — no tree
    // sprite was in either supplied tileset, so this is procedural like
    // the door and kitchen appliances.
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x6E4A2E, 1);
    g.fillRect(24, 44, 12, 20);
    g.fillStyle(0x3D8C3D, 1);
    g.fillCircle(30, 26, 24);
    g.fillStyle(0x4CA84C, 1);
    g.fillCircle(20, 20, 15);
    g.fillCircle(42, 22, 15);
    g.fillStyle(0x5FBD5F, 1);
    g.fillCircle(30, 12, 13);
    g.generateTexture('decor_tree', 60, 64);
    g.destroy();
  }

  makeKitchenTextures() {
    // Simple, readable procedural kitchen pieces — mining exact sprites
    // for these from the tilesets wasn't reliable, so these stay
    // procedurally drawn like the door, matching that visual style.
    let g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xE8ECEF, 1);
    g.fillRoundedRect(0, 0, 44, 60, 4);
    g.fillStyle(0xC7D0D6, 1);
    g.fillRect(2, 26, 40, 3);
    g.fillStyle(0x8A8272, 1);
    g.fillRoundedRect(18, 10, 8, 4, 1);
    g.fillRoundedRect(18, 38, 8, 4, 1);
    g.generateTexture('decor_fridge', 44, 60);
    g.destroy();

    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x3A3D48, 1);
    g.fillRoundedRect(0, 6, 52, 34, 3);
    g.fillStyle(0x1A1C22, 1);
    g.fillRect(4, 10, 44, 12);
    g.fillStyle(0xE8896A, 1);
    g.fillCircle(14, 30, 5);
    g.fillCircle(30, 30, 5);
    g.fillCircle(42, 30, 5);
    g.generateTexture('decor_stove', 52, 40);
    g.destroy();

    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x8B5E3C, 1);
    g.fillRoundedRect(0, 0, 40, 34, 3);
    g.fillStyle(0x6E4A2E, 1);
    g.fillRect(4, 6, 32, 10);
    g.fillRect(4, 20, 32, 10);
    g.fillStyle(0xF2B138, 1);
    g.fillCircle(20, 11, 1.6);
    g.fillCircle(20, 25, 1.6);
    g.generateTexture('decor_drawer', 40, 34);
    g.destroy();
  }

  showTitleScreen() {
    // Clear the plain loading text now that we're ready for the real title.
    this.progressText.destroy();
    this.bar.destroy();

    // Opening track plays here, at the loading/title screen, and fades
    // out once the player actually starts the game.
    AudioManager.playOpening();

    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2 - 90, "JOHN MARK BAUTISTA", {
      fontFamily: '"Press Start 2P", monospace', fontSize: '20px', color: '#F2B138'
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 50, "— Portfolio —", {
      fontFamily: 'monospace', fontSize: '16px', color: '#8A8272'
    }).setOrigin(0.5);

    const prompt = this.add.text(width / 2, height / 2 + 40, "Press SPACE or click to start", {
      fontFamily: 'monospace', fontSize: '15px', color: '#F2B138'
    }).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    const start = () => {
      AudioManager.fadeOutOpening(400);
      this.scene.start('RoomScene', { roomId: 'house' });
    };
    this.input.keyboard.once('keydown-SPACE', start);
    this.input.once('pointerdown', start);
  }

  makeDoorTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x5D3F2A, 1);
    g.fillRoundedRect(0, 0, 44, 76, 4);
    g.fillStyle(0x8B5E3C, 1);
    g.fillRoundedRect(4, 4, 36, 68, 3);
    g.fillStyle(0x6E4A2E, 1);
    g.fillRoundedRect(8, 8, 12, 28, 2);
    g.fillRoundedRect(24, 8, 12, 28, 2);
    g.fillRoundedRect(8, 40, 12, 28, 2);
    g.fillRoundedRect(24, 40, 12, 28, 2);
    g.fillStyle(0xF2B138, 1);
    g.fillCircle(32, 38, 2.5);
    g.generateTexture('door_deco', 44, 76);
    g.destroy();
  }
}

// ============================================================
// ROOM SCENE — generic room engine, data-driven from ROOM_CONFIGS
// (see rooms.js). Handles:
//   - indoor/outdoor look (walls+window vs sky+grass+path)
//   - a dividing wall with a doorway gap between zones (house only)
//   - solid decor/props that block movement (collision)
//   - dynamic zone lighting: the zone you're standing in is lit,
//     every other zone stays dimmed, continuously updating as you
//     move (not a one-time permanent reveal)
//   - doors between DIFFERENT scenes (house <-> yard), including
//     "hole" doors that render as a plain gap, not a drawn door
//   - achievement unlocks (replaces the old lighting-as-progress
//     mechanic entirely — lighting is now purely visual/ambient)
//   - mobile on-screen controls (see mobileControls.js), read
//     alongside the keyboard every frame
// ============================================================

const INTERACT_RADIUS = 70;
const OUTDOOR_MARGIN = 40;

class RoomScene extends Phaser.Scene {
  constructor() { super('RoomScene'); }

  init(data) {
    this.roomId = (data && data.roomId) || 'house';
    this.entrySpawn = data && data.spawnX != null ? { x: data.spawnX, y: data.spawnY } : null;
  }

  create() {
    AchievementSystem.init(this);

    this.room = ROOM_CONFIGS[this.roomId];
    this.isOutdoor = this.room.type === 'outdoor';
    this.topMargin = this.isOutdoor ? OUTDOOR_MARGIN : (this.room.wallHeight || 110);

    this.physics.world.setBounds(40, this.topMargin, this.room.width - 80, this.room.height - this.topMargin - 40);
    this.solidGroup = this.physics.add.staticGroup();

    this.buildFloorAndWalls();
    this.buildDecor();
    this.buildDoors();
    this.buildProps();
    this.buildPlayer();
    this.buildPrompt();
    this.buildZoneLighting();
    this.buildHint();
    this.buildRoomLabel();
    this.buildFootstepAudio();

    this.physics.add.collider(this.player, this.solidGroup);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.input.keyboard.on('keydown-SPACE', () => this.tryInteract());
    this.input.keyboard.on('keydown-E', () => this.tryInteract());

    const viewW = this.sys.game.config.width;
    const viewH = this.sys.game.config.height;
    if (this.room.width > viewW || this.room.height > viewH) {
      this.cameras.main.setBounds(0, 0, this.room.width, this.room.height);
      this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    } else {
      // Room is smaller than the viewport (e.g. the Yard) — set bounds
      // sized to the viewport itself, offset so the room sits dead
      // center on screen, instead of relying on clamped centerOn().
      const boundsX = (this.room.width - viewW) / 2;
      const boundsY = (this.room.height - viewH) / 2;
      this.cameras.main.setBounds(boundsX, boundsY, viewW, viewH);
      this.cameras.main.centerOn(this.room.width / 2, this.room.height / 2);
    }
    this.cameras.main.fadeIn(250);

    this.doorCheckReady = false;
    this.time.delayedCall(500, () => { this.doorCheckReady = true; });

    this.wireDesktopClicks();
    this.unlockEntryAchievement();
  }

  unlockEntryAchievement() {
    const map = { house: null, yard: 'entered_yard' }; // house handled per-zone instead
    if (map[this.roomId]) AchievementSystem.unlock(map[this.roomId]);
  }

  // --- Environment -----------------------------------------------------

  buildFloorAndWalls() {
    const { width, height } = this.room;

    if (this.isOutdoor) {
      this.cameras.main.setBackgroundColor('#0A0B10');
      this.add.tileSprite(width / 2, height / 2, width, height, 'outdoor_grass');
      this.add.tileSprite(width / 2, height / 2 + 60, 220, height - 140, 'outdoor_path');
      return;
    }

    this.add.tileSprite(width / 2, (height + this.topMargin) / 2, width, height - this.topMargin, 'floor_tile');
    this.add.tileSprite(width / 2, this.topMargin / 2 - 16, width, this.topMargin - 32, 'wall_fill');
    this.add.tileSprite(width / 2, this.topMargin - 16, width, 32, 'wall_trim');
    this.add.rectangle(width / 2, (height + this.topMargin) / 2 + 20, width - 80, height - this.topMargin - 40)
      .setStrokeStyle(3, 0x5D3F2A, 0.4);

    this.buildMiddleWall();
  }

  // A dividing wall between zones, with a gap in the middle to walk
  // through — this is what makes the house read as two actual rooms
  // instead of one open floor with an invisible zone boundary.
  buildMiddleWall() {
    if (!this.room.zones || this.room.zones.length < 2) return;
    const wallX = this.room.zones[0].x2;
    const gapHalf = 65;
    const topY = this.topMargin;
    const bottomY = this.room.height - 40;
    const midY = this.room.height / 2;

    const segTop = this.add.rectangle(wallX, (topY + midY - gapHalf) / 2, 18, (midY - gapHalf) - topY, 0x8B5E3C);
    const segBottom = this.add.rectangle(wallX, (midY + gapHalf + bottomY) / 2, 18, bottomY - (midY + gapHalf), 0x8B5E3C);
    [segTop, segBottom].forEach(seg => {
      this.physics.add.existing(seg, true);
      this.solidGroup.add(seg);
    });

    this.add.text(wallX, midY, 'Doorway', {
      fontFamily: 'monospace', fontSize: '10px', color: '#4A3A2A', backgroundColor: '#F4EBDD99'
    }).setOrigin(0.5).setPadding(2).setDepth(5);
  }

  buildDecor() {
    if (!this.isOutdoor && this.room.windowX) {
      this.add.image(this.room.windowX, this.topMargin / 2 - 6, 'window_deco').setScale(1.1);
    }
    if (this.room.rug) {
      const rugKey = this.room.rug.key || 'rug_deco';
      this.add.image(this.room.rug.x, this.room.rug.y, rugKey).setAlpha(0.9).setScale(this.room.rug.scale || 1.6);
    }
    (this.room.decor || []).forEach(d => this.placeItem(d));
  }

  buildProps() {
    this.props = (this.room.props || []).map(p => ({ ...p }));
    this.propSprites = this.props.map(p => {
      const sprite = this.placeItem(p, true);
      sprite.on('pointerdown', () => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y);
        if (dist < INTERACT_RADIUS * 1.6) this.handlePropAction(p);
      });
      this.add.text(p.x, p.y + sprite.displayHeight / 2 + 14, p.label, {
        fontFamily: 'monospace', fontSize: '11px', color: '#4A3A2A', backgroundColor: '#F4EBDD99'
      }).setOrigin(0.5).setPadding(2);
      return sprite;
    });
  }

  // Places a decor or prop image, and if it's marked `solid`, adds an
  // invisible static collision body sized to roughly its base footprint
  // (not the full sprite bounds — most of these are top-down icons taller
  // than their actual "footprint", so a slightly smaller box feels right).
  placeItem(item, interactive) {
    const img = this.add.image(item.x, item.y, item.key).setScale(item.scale || 1);
    if (interactive) img.setInteractive({ useHandCursor: true });

    if (item.solid) {
      const w = img.displayWidth * 0.65;
      const h = img.displayHeight * 0.45;
      const cy = item.y + img.displayHeight * 0.22; // bias toward the base
      const block = this.add.rectangle(item.x, cy, w, h, 0x000000, 0);
      this.physics.add.existing(block, true);
      this.solidGroup.add(block);
    }
    return img;
  }

  // --- Doors -------------------------------------------------------------

  buildDoors() {
    this.doorZones = (this.room.doors || []).map(d => {
      if (!this.isOutdoor && !d.hole) {
        this.add.image(d.x, d.y, 'door_deco');
      } else if (d.hole) {
        // A plain opening, not a drawn door — a darker gap in the floor
        // marks the threshold instead of an ornate door sprite.
        this.add.rectangle(d.x, d.y, d.w, d.h, 0x1A1C22, 0.35);
      }
      this.add.text(d.x, d.y - (d.hole ? 30 : 52), `To: ${d.label}`, {
        fontFamily: 'monospace', fontSize: '11px', color: '#4A3A2A', backgroundColor: '#F4EBDD99'
      }).setOrigin(0.5).setPadding(2);
      const zone = this.add.zone(d.x, d.y, d.w, d.h);
      this.physics.add.existing(zone, true);
      zone.doorData = d;
      return zone;
    });
  }

  // --- Player & fog-of-war zones -----------------------------------------

  buildPlayer() {
    const spawn = this.entrySpawn || this.room.playerSpawn || { x: this.room.width / 2, y: this.room.height / 2 };
    this.player = this.physics.add.sprite(spawn.x, spawn.y, 'player_sprite');
    this.player.setScale(0.55);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(30, 20).setOffset(13, 68);
    this.player.setDepth(10);
  }

  buildPrompt() {
    this.promptText = this.add.text(0, 0, 'Press SPACE', {
      fontFamily: 'monospace', fontSize: '12px', color: '#F2B138', backgroundColor: '#1A1C22'
    }).setOrigin(0.5).setPadding(4).setVisible(false).setDepth(20);
  }

  buildZoneLighting() {
    // Each zone has its own dim overlay. The zone the player is
    // currently standing in fades to fully bright; every other zone
    // stays dimmed (not pitch black) until you walk into it — updated
    // continuously, not a one-time reveal.
    this.zoneLights = [];
    if (!this.room.zones) return;

    if (!this.registry.has('zonesEnteredOnce')) this.registry.set('zonesEnteredOnce', {});

    this.room.zones.forEach(z => {
      const w = z.x2 - z.x1;
      const startsInZone = this.player.x > z.x1 && this.player.x < z.x2;
      const overlay = this.add.rectangle((z.x1 + z.x2) / 2, this.room.height / 2, w, this.room.height, 0x0A0B10, startsInZone ? 0.04 : 0.6)
        .setDepth(25);
      this.zoneLights.push({ zone: z, overlay, dimmed: !startsInZone });
      if (startsInZone) this.markZoneEntered(z);
    });
  }

  updateZoneLighting() {
    if (!this.zoneLights || !this.zoneLights.length) return;
    this.zoneLights.forEach(zl => {
      const inZone = this.player.x > zl.zone.x1 && this.player.x < zl.zone.x2;
      if (inZone && zl.dimmed) {
        zl.dimmed = false;
        this.tweens.add({ targets: zl.overlay, fillAlpha: 0.04, duration: 450, ease: 'Sine.easeInOut' });
        this.markZoneEntered(zl.zone);
      } else if (!inZone && !zl.dimmed) {
        zl.dimmed = true;
        this.tweens.add({ targets: zl.overlay, fillAlpha: 0.6, duration: 450, ease: 'Sine.easeInOut' });
      }
    });
  }

  markZoneEntered(zone) {
    const key = `${this.roomId}:${zone.id}`;
    const entered = this.registry.get('zonesEnteredOnce');
    if (entered[key]) return;
    entered[key] = true;
    this.registry.set('zonesEnteredOnce', entered);
    const achId = zone.id === 'bedroom' ? 'entered_bedroom' : zone.id === 'livingroom' ? 'entered_livingroom' : null;
    if (achId) AchievementSystem.unlock(achId);
  }

  buildHint() {
    this.add.text(this.room.width / 2, 8, 'WASD / Arrow keys to move — SPACE to interact', {
      fontFamily: 'monospace', fontSize: '13px', color: this.isOutdoor ? '#2B2E38' : '#3A2E27'
    }).setOrigin(0.5, 0).setDepth(16);
  }

  buildRoomLabel() {
    this.add.text(16, 16, this.room.name, {
      fontFamily: 'Press Start 2P, monospace', fontSize: '12px', color: '#F4EBDD', backgroundColor: '#1A1C22cc'
    }).setPadding(6).setScrollFactor(0).setDepth(30);
  }

  // Footstep sound depends on the surface: concrete indoors (the
  // house), grass outdoors (the yard). Looped while the player is
  // actually moving, stopped the instant they stop. Uses AudioManager
  // (native <audio> elements) rather than Phaser's sound loader — see
  // audioManager.js for why.
  buildFootstepAudio() {
    this.footstepSurface = this.isOutdoor ? 'grass' : 'concrete';
  }

  updateFootstepAudio(isMoving) {
    if (isMoving) {
      AudioManager.playFootstep(this.footstepSurface);
    } else {
      AudioManager.stopFootstep();
    }
  }

  // --- Update loop --------------------------------------------------------

  update() {
    const speed = 220;
    const mc = MobileControls.state;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.wasd.A.isDown || mc.left) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.D.isDown || mc.right) vx = speed;
    if (this.cursors.up.isDown || this.wasd.W.isDown || mc.up) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.S.isDown || mc.down) vy = speed;

    if (vx !== 0 && vy !== 0) { vx *= 0.7071; vy *= 0.7071; }
    this.player.setVelocity(vx, vy);

    if (MobileControls.consumeInteract()) this.tryInteract();

    this.updateInteractionPrompt();
    this.updateDoorCheck();
    this.updateZoneLighting();
    this.updateFootstepAudio(vx !== 0 || vy !== 0);
  }

  updateInteractionPrompt() {
    let nearest = null, nearestDist = Infinity;
    this.props.forEach(p => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y);
      if (dist < INTERACT_RADIUS && dist < nearestDist) { nearest = p; nearestDist = dist; }
    });

    if (nearest) {
      this.promptText.setPosition(nearest.x, nearest.y - 60).setVisible(true);
      this.nearbyProp = nearest;
    } else {
      this.promptText.setVisible(false);
      this.nearbyProp = null;
    }
  }

  updateDoorCheck() {
    if (!this.doorZones || !this.doorCheckReady) return;
    for (const zone of this.doorZones) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, zone.x, zone.y);
      if (dist < 45) {
        const d = zone.doorData;
        AudioManager.stopFootstep();
        this.cameras.main.fadeOut(200);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('RoomScene', { roomId: d.target, spawnX: d.spawnX, spawnY: d.spawnY });
        });
        this.doorCheckReady = false;
        return;
      }
    }
  }

  tryInteract() {
    if (this.nearbyProp) this.handlePropAction(this.nearbyProp);
  }

  // --- Content windows + achievements -------------------------------------

  handlePropAction(p) {
    const actions = {
      desktop: () => this.openDesktop(),
      projects: () => this.openWindow('projects', 'Projects.exe', Renderers.projects(), 520, 'viewed_projects'),
      skills: () => this.openWindow('skills', 'Skills.exe', Renderers.skills(), 560, 'viewed_skills'),
      experience: () => this.openWindow('experience', 'Experience.exe', Renderers.experience(), 560, 'viewed_experience'),
      contact: () => this.openWindow('contact', 'Contact.lnk', Renderers.contact(), 360, 'viewed_contact')
    };
    if (actions[p.action]) actions[p.action]();
  }

  openDesktop() {
    UI.openWindow({ id: 'desktop', title: 'MyOS 95 — Desktop', html: Renderers.desktop(), width: 420 });
  }

  openWindow(sectionKey, title, html, width, achievementId) {
    UI.openWindow({ id: sectionKey, title, html, width });
    if (achievementId) AchievementSystem.unlock(achievementId);
  }

  wireDesktopClicks() {
    if (this._desktopClicksWired) return;
    this._desktopClicksWired = true;
    document.getElementById('ui-root').addEventListener('click', (e) => {
      const icon = e.target.closest('.desktop-icon');
      if (!icon) return;
      const action = icon.dataset.action;
      const map = {
        about: () => this.openWindow('about', 'About.txt', Renderers.about(), 520),
        education: () => this.openWindow('education', 'Education.txt', Renderers.education(), 480),
        projects: () => this.openWindow('projects', 'Projects.exe', Renderers.projects(), 520, 'viewed_projects'),
        experience: () => this.openWindow('experience', 'Experience.exe', Renderers.experience(), 560, 'viewed_experience'),
        skills: () => this.openWindow('skills', 'Skills.exe', Renderers.skills(), 560, 'viewed_skills'),
        contact: () => this.openWindow('contact', 'Contact.lnk', Renderers.contact(), 360, 'viewed_contact'),
        achievements: () => UI.openWindow({ id: 'achievements', title: 'Achievements', html: Renderers.achievements(this), width: 420 })
      };
      if (map[action]) map[action]();
    });
  }
}

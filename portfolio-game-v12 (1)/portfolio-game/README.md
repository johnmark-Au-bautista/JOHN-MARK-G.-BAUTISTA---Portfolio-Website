# Portfolio game — v12: sound effects, education logos, framed borders

## What changed in v12 (your 5 requests)
1. **Sound effects added.** Footsteps play while you walk — concrete
   indoors (the house), grass outdoors (the Yard) — the achievement
   toast now plays a coin-pickup chime, and an opening track plays on
   the loading/title screen (fades out once you press start).
2. **Achievement toast spacing fixed** — "Achievement Unlocked" and
   the achievement name no longer crowd each other.
3. **School logos added** to the Education section, next to each
   school's entry.
4. **Brown side borders** framing the game screen.
5. **Outside (Yard) scene** — the sky is now blackened instead of
   light blue, and the scene is precisely centered on screen.

A retro, walkable portfolio: one house (Bedroom + Living Room, separated
by a real wall with a doorway), plus an outdoor Yard. Real pixel art,
your character, your photo, and your certificates — all embedded
directly in the code so it works reliably by double-clicking
`index.html`.

## Run it
Unzip the project, open the `portfolio-game` folder, double-click
`index.html`. Needs an internet connection (Phaser loads from a CDN) —
everything else is bundled in already.

## What changed in v11 (your 8 requests)

1. **A real dividing wall.** Bedroom and Living Room are now separated
   by an actual wall with a gap you walk through — not just an
   invisible boundary.
2. **Dynamic room lighting.** The room you're standing in is lit; the
   other one is dimmed (not pitch black) — and it updates continuously
   as you move back and forth, not a one-time reveal.
3. **Furniture and decoration are bigger** across every room — the
   long table, chairs, bed, bookshelf, treasure chest, bushes, trees,
   all scaled up.
4. **Trees added to the Yard's dead space** — four of them filling the
   empty corners.
5. **Your photo is in the About section**, cropped into a small round
   portrait.
6. **Your 5 certificates are in the About section** too, as a small
   thumbnail grid with titles.
7. **A new Education section** — both schools you gave me, with your
   exact descriptions, accessible from a new "Education" icon on the
   Computer's desktop.
8. **On-screen mobile controls** — a D-pad and a "USE" button in the
   corners, always visible, working with touch or mouse, alongside the
   keyboard (whichever you use, it just works).

## Also fixed while I was in there
- Real collision now applies correctly with the bigger furniture sizes.
- The wall segments themselves block movement too (you can't walk
  through where the wall is, only through the doorway gap).

## How it works
- **Move** with WASD, arrow keys, or the on-screen D-pad.
- **Walk up to a prop**, then press SPACE, click it, or tap the on-
  screen USE button.
- **Computer** → the Desktop (About/Education/Projects/Experience/
  Skills/Contact/Achievements icons)
- **Framed Photo** → Experience · **Treasure Chest** → Projects ·
  **Bookshelf** → Skills · **Market Stall** (Yard) → Contact
- **Achievements** unlock as you explore and view content — a toast
  pops up in the corner, and they're all listed in the Achievements
  window.

## What's real art vs. placeholder
- **Everything except doors, kitchen appliances, and trees** — real
  pixel art (including your character and photo), embedded in
  `assetData.js` / `media.js`.
- **Doors, the fridge/stove/drawer, and trees** — procedurally drawn
  (no matching sprites were in the supplied tilesets).

## Still to come
- **Minimap** and **collectible-card-style popups** — still queued from
  the peteroravec.com reference, whenever you want them.
- **Music** — still waiting on a track or direction from you.
- **Character animation** — still a single static frame.
- **True irregular (non-rectangular) house shape** — flagged as a
  bigger follow-up if you still want it; what exists now is a
  rectangular house with a clearly zoned kitchen corner, not actual
  jutting wall geometry.

## File map
```
index.html                    entry point, CSS, mobile control buttons, loads everything
src/main.js                   Phaser config + waits for fonts before starting
src/data/content.js           ALL game text/copy (now includes education)
src/data/media.js             your profile photo + certificate thumbnails
src/data/assetData.js         ALL real art (incl. your character), base64
src/data/achievements.js      achievement definitions
src/data/rooms.js             room layouts — zones, decor, props, doors
src/scenes/
  BootScene.js                  loading screen, procedural door/kitchen/tree art
  RoomScene.js                  room engine — dividing wall, dynamic lighting,
                                 collision, doors, achievements, mobile controls
src/ui/
  windowManager.js               retro DOM windows
  achievementSystem.js           tracks unlocks, shows toasts
  mobileControls.js              on-screen D-pad + interact button
  contentRenderers.js            builds each window's HTML (now incl. education)
```

## Known TODOs
- No player walk-cycle animation.
- No audio yet.
- Windows don't drag.
- True irregular room geometry (see note above).

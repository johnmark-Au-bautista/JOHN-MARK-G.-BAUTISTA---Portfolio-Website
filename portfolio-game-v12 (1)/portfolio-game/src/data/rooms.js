// ============================================================
// ROOM CONFIGS
//
// `house` is ONE continuous scene containing both the Bedroom and
// Living Room as adjacent zones, separated by an actual dividing
// wall with a doorway gap (see RoomScene.js buildMiddleWall()) —
// not just an invisible boundary. Walking through the gap is just
// walking, no scene change.
//
// `zones` also powers the dynamic lighting: the zone you're
// currently standing in is lit; every other zone stays dimmed,
// continuously, updating as you move — not a one-time reveal.
//
// `yard` is a separate scene (stepping fully outside), reached
// through a plain opening in the house wall rather than a drawn
// door — a "hole" as requested.
//
// `decor` = visual furniture. Add `solid: true` to make it block
// movement (chairs, tables, bookshelf, appliances, bushes, trees).
// `props` = interactive furniture that opens a retro window.
// `doors` = walk-into transitions to a DIFFERENT scene (house<->yard
// only — moving between zones within the house is not a door).
// ============================================================

const ROOM_CONFIGS = {

  house: {
    name: 'Home',
    type: 'indoor',
    width: 1560,
    height: 620,
    wallHeight: 100,
    windowX: 1350,
    zones: [
      { id: 'bedroom', label: 'Bedroom', x1: 0, x2: 770 },
      { id: 'livingroom', label: 'Living Room', x1: 770, x2: 1560 }
    ],
    rug: { x: 380, y: 380, key: 'rug_deco', scale: 1.3 },
    decor: [
      // --- Bedroom zone: computer+table+book+chair, bed, mat, plant by the doorway ---
      { key: 'decor_table_cream', x: 150, y: 215, scale: 1.6, solid: true },
      { key: 'decor_books_stack', x: 215, y: 195, scale: 1.4 },
      { key: 'decor_chair2', x: 95, y: 270, scale: 1.6, solid: true },
      { key: 'decor_bed_blue', x: 630, y: 165, scale: 1.8, solid: true },
      { key: 'decor_plant2', x: 690, y: 420, scale: 1.7, solid: true },

      // --- Living room zone: long table + 5 chairs ---
      { key: 'decor_table_cream', x: 1130, y: 300, scale: 2.2, solid: true },
      { key: 'decor_chair2', x: 1050, y: 205, scale: 1.5, solid: true },
      { key: 'decor_chair2', x: 1130, y: 195, scale: 1.5, solid: true },
      { key: 'decor_chair2', x: 1210, y: 205, scale: 1.5, solid: true },
      { key: 'decor_chair2', x: 1050, y: 400, scale: 1.5, solid: true },
      { key: 'decor_chair2', x: 1210, y: 400, scale: 1.5, solid: true },

      // --- Kitchen nook (back-right of living room), windows behind it ---
      { key: 'window_deco', x: 1440, y: 60, scale: 1.4 },
      { key: 'window_deco', x: 1350, y: 60, scale: 1.4 },
      { key: 'decor_fridge', x: 1470, y: 155, scale: 1.5, solid: true },
      { key: 'decor_stove', x: 1370, y: 160, scale: 1.5, solid: true },

      // --- Bookshelf + drawer, lower-left of living room ---
      { key: 'decor_drawer', x: 935, y: 545, scale: 1.4, solid: true }
    ],
    props: [
      { key: 'prop_computer', x: 150, y: 155, label: 'Computer', scale: 1.6, action: 'desktop', solid: true },
      { key: 'prop_experience', x: 850, y: 150, label: 'Framed Photo', scale: 1.6, action: 'experience' },
      { key: 'prop_projects', x: 1500, y: 420, label: 'Treasure Chest', scale: 1.7, action: 'projects', solid: true },
      { key: 'prop_skills', x: 850, y: 545, label: 'Bookshelf', scale: 1.4, action: 'skills', solid: true }
    ],
    doors: [
      // A hole in the wall, not a drawn door — see RoomScene.js buildDoors()
      { x: 1150, y: 600, w: 140, h: 30, label: 'Outside', target: 'yard', spawnX: 450, spawnY: 280, hole: true }
    ],
    playerSpawn: { x: 150, y: 320 }
  },

  yard: {
    name: 'Yard',
    type: 'outdoor',
    width: 900,
    height: 560,
    decor: [
      { key: 'decor_house_facade', x: 450, y: 110, scale: 1.1 },
      { key: 'decor_bush', x: 90, y: 300, scale: 1.6, solid: true },
      { key: 'decor_bush', x: 810, y: 300, scale: 1.6, solid: true },
      { key: 'decor_bush', x: 250, y: 470, scale: 1.5, solid: true },
      { key: 'decor_bush', x: 650, y: 470, scale: 1.5, solid: true },
      { key: 'decor_planter_plants', x: 220, y: 380, scale: 2, solid: true },
      { key: 'decor_planter_plants', x: 680, y: 380, scale: 2, solid: true },
      { key: 'decor_lamp_post', x: 150, y: 230, scale: 1.5, solid: true },
      { key: 'decor_lamp_post', x: 750, y: 230, scale: 1.5, solid: true },
      // Trees filling the dead space in the corners
      { key: 'decor_tree', x: 60, y: 150, scale: 1.4, solid: true },
      { key: 'decor_tree', x: 840, y: 150, scale: 1.4, solid: true },
      { key: 'decor_tree', x: 60, y: 500, scale: 1.4, solid: true },
      { key: 'decor_tree', x: 840, y: 500, scale: 1.4, solid: true }
    ],
    props: [
      { key: 'decor_market_stall', x: 450, y: 460, label: 'Contact Stall', scale: 1.7, action: 'contact', solid: true }
    ],
    doors: [
      { x: 450, y: 95, w: 120, h: 40, label: 'Home', target: 'house', spawnX: 1150, spawnY: 500, hole: true }
    ],
    playerSpawn: { x: 450, y: 350 }
  }

};

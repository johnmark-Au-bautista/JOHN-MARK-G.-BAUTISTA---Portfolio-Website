// ============================================================
// CONTENT.JS — single source of truth for all game text/data.
// Edit THIS file to change copy anywhere in the game.
// ============================================================

const GAME_CONTENT = {

  palette: {
    dark:  { tint: 0x5a6a8a, flash: [26, 28, 34] },
    mid:   { tint: 0x9fb0a8, flash: [217, 165, 102] },
    bright:{ tint: 0xffffff, flash: [242, 177, 56] }
  },

  dialogue: {
    opening: [
      "...Another late night. Another half-finished idea sitting on the desk.",
      "Sometimes I wonder if any of this actually goes anywhere.",
      "...Well. Might as well show you what I've been working on.",
      "Walk around. Interact with stuff. See what you find."
    ],
    midTransition: "Huh. Guess it doesn't look so bad in here anymore.",
    growingTransition: "Okay— now it's starting to look like a real workshop.",
    outro: [
      "So that's the workshop — messy beginnings, one very stubborn radar prototype, and a lot of late nights that were actually worth it.",
      "I'm not going to pretend it's finished, though — there's still a loose wire on that shelf, and a new stack of parts I haven't touched yet. I'm still figuring a lot of this out.",
      "But it's a good kind of unfinished. Thanks for exploring. If any of this resonated — let's talk."
    ]
  },

  // Objects placed in the room. Each maps to a content scene.
  // x/y are world positions in RoomScene.
  roomObjects: [
    { key: 'obj_computer', id: 'desktop', label: 'Computer', prompt: 'Press SPACE to use the computer', x: 1000, y: 200, scene: 'DesktopScene', tracksVisit: false },
    { key: 'obj_radar', id: 'projects', label: 'AirSentrix prototype', prompt: 'Press SPACE to inspect the prototype', x: 260, y: 220, scene: 'ProjectsScene', tracksVisit: true },
    { key: 'obj_corkboard', id: 'experience', label: 'Corkboard', prompt: 'Press SPACE to read the corkboard', x: 1000, y: 500, scene: 'ExperienceScene', tracksVisit: true },
    { key: 'obj_toolbox', id: 'skills', label: 'Toolbox', prompt: 'Press SPACE to open the toolbox', x: 260, y: 500, scene: 'SkillsScene', tracksVisit: true }
  ],

  desktopIcons: [
    { label: 'Projects.exe', scene: 'ProjectsScene', tracksVisit: true, id: 'projects' },
    { label: 'Experience.exe', scene: 'ExperienceScene', tracksVisit: true, id: 'experience' },
    { label: 'Skills.exe', scene: 'SkillsScene', tracksVisit: true, id: 'skills' },
    { label: 'About_Me.exe', scene: 'AboutScene', tracksVisit: false, id: null }
  ],

  project: {
    title: "Operation AirSentrix",
    difficulty: "Solo Run",
    description: "The skies don't defend themselves. Armed with an Arduino Uno, an ESP32-CAM, and a small mountain of corrugated cardboard, this quest was to build a working airspace intrusion simulator from scratch — one that scans, streams live video, challenges unidentified targets, and locks on within a 3-second window. Thirty trials. Real statistics. Zero teammates to lean on.",
    status: "Complete",
    skills: ["Arduino / C++", "Circuit design & breadboarding", "Processing (data viz)", "Experimental research & statistics", "Technical documentation"],
    context: "Practical Research II — Las Piñas City National Senior High School, Talon Dos Campus, 2026"
  },

  experience: [
    {
      chapter: "Keeper of the Toolshed",
      role: "ICT & Robotics Club — Committee Lead for Inventory and Maintenance",
      description: "Every workshop needs someone who knows where everything is — and keeps it working. Managing the club's tools and equipment, all while running an independent research project on the side."
    },
    {
      chapter: "First Responder",
      role: "BERT Club — Batang Emergency Response Team",
      description: "Daily patrols to check every room, careful documentation of every earthquake drill, and standing by as first aider whenever Intramurals turns competitive."
    },
    {
      chapter: "The Reporter",
      role: "Luntian — News Writer",
      description: "Tracking down what's happening around campus and putting it into words other people can actually read — a different kind of documentation skill."
    }
  ],

  skills: [
    { name: "Python", icon: "P", blurb: "the core spell for scripting logic and automation" },
    { name: "HTML", icon: "H", blurb: "the foundation stone of every web-based build" },
    { name: "Analytical Skills", icon: "A", blurb: "see the pattern before anyone else does" },
    { name: "Research Skills", icon: "R", blurb: "turn raw data into real answers" },
    { name: "Communication", icon: "C", blurb: "make the complex sound simple" },
    { name: "Documentation", icon: "D", blurb: "no quest log, no proof it happened" },
    { name: "Rubik's Cube", icon: "#", blurb: "passive skill: pattern recognition +10" },
    { name: "Chess", icon: "K", blurb: "passive skill: patience & foresight +10" }
  ],

  about: {
    text: "STEM student at Talon Dos Campus, Las Piñas, pursuing computer science while actively building hands-on engineering projects — AirSentrix being the clearest evidence of that drive. Also completed a set of Elsevier Researcher Academy modules on scientific writing and research integrity.",
    quirk: "Solves Rubik's Cubes and plays chess — both pattern-recognition, patience-driven pursuits that mirror the debugging/iteration mindset AirSentrix required."
  },

  contact: {
    github: "https://github.com/johnmark-Au-bautista",
    linkedin: "https://www.linkedin.com/in/john-mark-bautista/"
  },

  education: [
    {
      school: "Las Piñas East National High School",
      description: "Completed Junior High School education With Honors at Las Piñas East National High School, building a strong academic foundation.",
      logo: "SCHOOL_JUNIOR_LOGO"
    },
    {
      school: "Las Piñas City National Senior High School — Talon Dos Campus",
      description: "Currently attending Las Piñas City National Senior High School – Talon Dos Campus, where I manage technical equipment for the ICT & Robotics Club, contribute to campus safety and school journalism, and lead engineering projects like Project AirSentrix.",
      logo: "SCHOOL_SENIOR_LOGO"
    }
  ]

};

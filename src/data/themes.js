// src/data/themes.js

const targetRange = (min, max) => ({ min, max });

export const THEMES = [
  {
    key: "beach",
    name: "Sunny Beach",
    backgroundColor: 0x87ceeb,
    groundColor: 0xfff1c1,
    worldWidth: 2400,
    worldHeight: 1400,
    minDistance: 55,          // was 70 – slightly closer spacing
    decorCount: 220,          // 🔼 more objects
    targetRange: targetRange(2, 4),
    timeLimit: 90,
    hintTextureKey: "hint_smile",   // 🔹 NEW
    objects: [
      {
        key: "beach_umbrella",
        label: "Umbrella",
        shape: "circle",
        size: 72,
        color: 0xff6384,
        isTarget: false
      },
      {
        key: "beach_towel",
        label: "Towel",
        shape: "rect",
        width: 96,
        height: 32,
        color: 0xffc107,
        isTarget: false
      },
      {
        key: "beach_crab",
        label: "Crab",
        shape: "rect",
        width: 40,
        height: 30,
        color: 0xe91e63,
        isTarget: true
      },
      {
        key: "beach_ball",
        label: "Beach Ball",
        shape: "circle",
        size: 48,
        color: 0x4bc0c0,
        isTarget: true
      }
    ]
  },

  {
    key: "museum",
    name: "Dinosaur Museum",
    backgroundColor: 0xe0f7fa,
    groundColor: 0xfdf5e6,
    worldWidth: 2400,
    worldHeight: 1400,
    minDistance: 55,
    decorCount: 200,          // 🔼 more objects
    targetRange: targetRange(3, 5),
    timeLimit: 90,
    hintTextureKey: "hint_scary",   // 🔹 NEW
    objects: [
      {
        key: "museum_pedestal",
        label: "Pedestal",
        shape: "rect",
        width: 80,
        height: 50,
        color: 0xb0bec5,
        isTarget: false
      },
      {
        key: "museum_skeleton",
        label: "Dino Skull",
        shape: "triangle",
        size: 80,
        color: 0x8d6e63,
        isTarget: true
      },
      {
        key: "museum_sign",
        label: "Sign",
        shape: "rect",
        width: 100,
        height: 30,
        color: 0xffca28,
        isTarget: false
      },
      {
        key: "museum_fossil",
        label: "Fossil",
        shape: "circle",
        size: 48,
        color: 0x6d4c41,
        isTarget: true
      }
    ]
  },

  {
    key: "spaceport",
    name: "Busy Spaceport",
    backgroundColor: 0x050816,
    groundColor: 0x101624,
    worldWidth: 2600,
    worldHeight: 1500,
    minDistance: 55,
    decorCount: 240,          // 🔼 more objects
    targetRange: targetRange(3, 5),
    timeLimit: 100,
    hintTextureKey: "hint_alien",   // 🔹 NEW
    objects: [
      {
        key: "space_ship",
        label: "Ship",
        shape: "triangle",
        size: 80,
        color: 0x03a9f4,
        isTarget: false
      },
      {
        key: "space_crate",
        label: "Cargo Crate",
        shape: "rect",
        width: 72,
        height: 48,
        color: 0x9e9e9e,
        isTarget: false
      },
      {
        key: "space_alien",
        label: "Alien",
        shape: "circle",
        size: 56,
        color: 0x9c27b0,
        isTarget: true
      },
      {
        key: "space_robot",
        label: "Robot",
        shape: "rect",
        width: 56,
        height: 56,
        color: 0x00e5ff,
        isTarget: true
      }
    ]
  }
];

export function getThemeByKey(key) {
  return THEMES.find((t) => t.key === key);
}

export function getRandomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

// src/scenes/BootScene.js
import { THEMES } from "../data/themes.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Audio disabled for now – you can add back later if you provide files.
    // this.load.audio("sfx-find", "assets/audio/find.wav");
    // this.load.audio("sfx-miss", "assets/audio/miss.wav");
    // this.load.audio("sfx-tick", "assets/audio/tick.wav");
    // this.load.audio("music-loop", "assets/audio/loop.mp3");
  }

  create() {
    this.createProceduralTextures();
    this.createHintTextures();
    this.scene.start("Menu");
  }

  createProceduralTextures() {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    const textures = this.textures;

    // tiny white circle for sparkles
    gfx.clear();
    gfx.fillStyle(0xffffff, 1);
    gfx.fillCircle(8, 8, 8);
    gfx.generateTexture("spark", 16, 16);

    // simple shapes for theme objects
    THEMES.forEach((theme) => {
      theme.objects.forEach((obj) => {
        if (textures.exists(obj.key)) return;

        const size = obj.size || 64;
        const width = obj.width || size;
        const height = obj.height || size;

        gfx.clear();
        gfx.fillStyle(obj.color, 1);

        switch (obj.shape) {
          case "circle":
            gfx.fillCircle(width / 2, height / 2, Math.min(width, height) / 2);
            break;
          case "triangle":
            gfx.fillTriangle(
              width / 2,
              0,
              0,
              height,
              width,
              height
            );
            break;
          case "rect":
          default:
            gfx.fillRoundedRect(0, 0, width, height, 10);
            break;
        }

        gfx.generateTexture(obj.key, width, height);
      });
    });

    gfx.destroy();
  }

  createHintTextures() {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });

    // 😊 SUNNY BEACH – yellow smiley
    gfx.clear();
    gfx.fillStyle(0xffeb3b, 1);
    gfx.fillCircle(16, 16, 16);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(11, 13, 2);
    gfx.fillCircle(21, 13, 2);
    gfx.lineStyle(2, 0x000000, 1);
    gfx.beginPath();
    gfx.arc(16, 18, 7, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
    gfx.strokePath();
    gfx.generateTexture("hint_smile", 32, 32);

    // 😱 DINO – pale face with open mouth
    gfx.clear();
    gfx.fillStyle(0xfff3e0, 1);
    gfx.fillCircle(16, 16, 16);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(11, 11, 3);
    gfx.fillCircle(21, 11, 3);
    gfx.fillRect(13, 18, 6, 7); // mouth
    gfx.generateTexture("hint_scary", 32, 32);

    // 👽 SPACE – green alien with three eyes
    gfx.clear();
    gfx.fillStyle(0x8bc34a, 1);
    gfx.fillCircle(16, 16, 16);
    gfx.fillStyle(0xffffff, 1);
    gfx.fillCircle(10, 13, 3);
    gfx.fillCircle(16, 11, 3);
    gfx.fillCircle(22, 13, 3);
    gfx.fillStyle(0x000000, 1);
    gfx.fillCircle(10, 13, 1.5);
    gfx.fillCircle(16, 11, 1.5);
    gfx.fillCircle(22, 13, 1.5);
    gfx.generateTexture("hint_alien", 32, 32);

    gfx.destroy();
  }
}

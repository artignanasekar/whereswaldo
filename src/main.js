import BootScene from "./scenes/BootScene.js";
import MenuScene from "./scenes/MenuScene.js";
import GameScene from "./scenes/GameScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 1280,
  height: 720,
  backgroundColor: "#000000",
  pixelArt: true,
  scene: [BootScene, MenuScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: { debug: false }
  }
};

window.addEventListener("load", () => {
  new Phaser.Game(config);
});

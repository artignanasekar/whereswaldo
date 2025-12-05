import { getRandomTheme } from "../data/themes.js";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#000000");

    const title = this.add
      .text(width / 2, 80, "Pick a theme (or random) to start", {
        fontSize: "26px",
        color: "#ffffff",
        fontStyle: "bold"
      })
      .setOrigin(0.5);

    const buttonData = [
      { label: "Sunny Beach", key: "beach", color: 0x3949ab },
      { label: "Dinosaur Museum", key: "museum", color: 0x6a1b9a },
      { label: "Busy Spaceport", key: "spaceport", color: 0x00838f }
    ];

    const startY = 150;
    const spacing = 70;
    const buttonWidth = 260;
    const buttonHeight = 44;

    buttonData.forEach((btn, index) => {
      const y = startY + index * spacing;
      this.createButton(width / 2, y, buttonWidth, buttonHeight, btn, false);
    });

    // Random theme button (green) with emoji
    this.createButton(
      width / 2,
      startY + buttonData.length * spacing + 20,
      buttonWidth,
      buttonHeight,
      { label: "Random Theme", key: "random", color: 0x2e7d32, emoji: "🎲" },
      true
    );

    // Instructions footer
    this.add
      .text(
        width / 2,
        height - 40,
        "Drag to pan • Scroll to zoom • Click targets",
        {
          fontSize: "16px",
          color: "#cccccc"
        }
      )
      .setOrigin(0.5);
  }

  createButton(cx, cy, w, h, btnData, isRandom) {
    const bg = this.add
      .rectangle(cx, cy, w, h, btnData.color, 1)
      .setStrokeStyle(2, 0xffffff, 0.7)
      .setInteractive({ useHandCursor: true });

    const labelText =
      (btnData.emoji ? `${btnData.emoji} ` : "") + btnData.label;

    const text = this.add.text(cx, cy, labelText, {
      fontSize: "20px",
      color: "#ffffff"
    });
    text.setOrigin(0.5);

    const onClick = () => {
      bg.disableInteractive();

      let themeKey = btnData.key;
      if (themeKey === "random") {
        const theme = getRandomTheme();
        themeKey = theme.key;
      }

      this.scene.start("Game", { themeKey });
    };

    bg.on("pointerover", () => {
      bg.setFillStyle(Phaser.Display.Color.IntegerToColor(btnData.color).brighten(15).color);
    });

    bg.on("pointerout", () => {
      bg.setFillStyle(btnData.color, 1);
    });

    bg.on("pointerup", () => onClick());
    text.setInteractive({ useHandCursor: true }).on("pointerup", () => onClick());
  }
}

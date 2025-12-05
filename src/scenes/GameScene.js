import { getThemeByKey, getRandomTheme } from "../data/themes.js";
import { generatePoissonPoints } from "../utils/poisson.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");

    this.theme = null;
    this.objects = [];
    this.targets = [];
    this.foundCount = 0;
    this.timeLeft = 0;
    this.ui = {};
    this.dragging = false;
    this.lastDragPos = new Phaser.Math.Vector2();
    this.particles = null;
  }

  init(data) {
    const themeKey = data?.themeKey;
    this.theme = themeKey ? getThemeByKey(themeKey) : getRandomTheme();
    if (!this.theme) {
      this.theme = getRandomTheme();
    }
  }

  create() {
    const theme = this.theme;
    const worldWidth = theme.worldWidth;
    const worldHeight = theme.worldHeight;
    const { width } = this.scale;

    const cam = this.cameras.main;
    cam.setBounds(0, 0, worldWidth, worldHeight);
    cam.setBackgroundColor(theme.backgroundColor);
    cam.setZoom(0.75);

    const zoom = cam.zoom;
    cam.scrollY = 0;
    cam.scrollX = worldWidth / 2 - (width / (2 * zoom));

    this.add
      .rectangle(
        worldWidth / 2,
        worldHeight / 2,
        worldWidth,
        worldHeight,
        theme.groundColor
      )
      .setDepth(-20);

    this.objects = [];
    this.targets = [];
    this.createSceneObjects(theme, worldWidth, worldHeight);

    this.particles = this.add.particles(0, 0, "spark", {
      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.7, end: 0 },
      lifespan: 600,
      quantity: 24,
      emitting: false
    });

    this.createUI();

    this.setupCameraControls();
    this.setupClickHandling();

    this.timeLeft = theme.timeLimit;
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.tickTimer()
    });

    this.startHintTimer();
  }


  createSceneObjects(theme, worldWidth, worldHeight) {
    const points = generatePoissonPoints(
      worldWidth - 200,
      worldHeight - 200,
      theme.minDistance,
      theme.decorCount
    );

    const innerOffsetX = 100;
    const innerOffsetY = 100;

    const candidateObjects = theme.objects.filter((o) => o.isTarget);
    const targetMin = theme.targetRange.min;
    const targetMax = theme.targetRange.max;
    const targetCount =
      targetMin +
      Math.floor(Math.random() * (targetMax - targetMin + 1));

    const targets = [];

    const shuffledIndices = Phaser.Utils.Array.NumberArray(0, points.length - 1);
    Phaser.Utils.Array.Shuffle(shuffledIndices);

    for (let i = 0; i < targetCount && i < shuffledIndices.length; i++) {
      const idx = shuffledIndices[i];
      const point = points[idx];
      const objDef =
        candidateObjects[Math.floor(Math.random() * candidateObjects.length)];
      if (!objDef) break;
      const sprite = this.createObjectSprite(
        point.x + innerOffsetX,
        point.y + innerOffsetY,
        objDef,
        true
      );
      targets.push(sprite);
    }

    this.targets = targets;
    this.foundCount = 0;

    points.forEach((pt, index) => {
      const alreadyTarget = shuffledIndices.slice(0, targetCount).includes(index);
      if (alreadyTarget) return;

      const objDef =
        theme.objects[Math.floor(Math.random() * theme.objects.length)];
      this.createObjectSprite(
        pt.x + innerOffsetX,
        pt.y + innerOffsetY,
        objDef,
        false
      );
    });
  }

  createObjectSprite(x, y, objDef, isTarget) {
    const sprite = this.add
      .image(x, y, objDef.key)
      .setInteractive({ useHandCursor: true })
      .setDepth(y);

      sprite.baseX = x;
    sprite.baseY = y;
    sprite.bobPhase = Math.random() * Math.PI * 2;
    sprite.bobAmplitude = Phaser.Math.Between(2, 8);
    sprite.bobSpeed = Phaser.Math.FloatBetween(0.5, 1.2);

    sprite.isTarget = isTarget;
    sprite.found = false;
    sprite.label = objDef.label;
    sprite.hint = null;
    sprite.hintOffset = 40;

    if (isTarget) {
      sprite.setTint(0xffffff);

      const hintKey = this.theme.hintTextureKey || "hint_smile";
      const hint = this.add
        .image(x, y - sprite.hintOffset, hintKey)
        .setDepth(sprite.depth + 20)
        .setVisible(false);
      sprite.hint = hint;
    } else {
      sprite.setTint(0xffffff);
      sprite.alpha = 0.95;
    }

    this.objects.push(sprite);
    return sprite;
  }

  createUI() {
    const { width } = this.scale;

    this.add
      .rectangle(width / 2, 32, width, 64, 0x05060a, 0.9)
      .setScrollFactor(0)
      .setDepth(1000);

    this.add
      .rectangle(width / 2, 64, width, 2, 0xffffff, 0.15)
      .setScrollFactor(0)
      .setDepth(1000);

    const pillHeight = 40;

    this.add
      .rectangle(170, 32, 280, pillHeight, 0x22263a, 0.95)
      .setScrollFactor(0)
      .setDepth(1001);

    this.ui.titleText = this.add
      .text(40, 19, `📍 ${this.theme.name}`, {
        fontSize: "20px",
        color: "#f5f5f5",
        fontStyle: "bold"
      })
      .setScrollFactor(0)
      .setDepth(1002);

    // TIMER pill
    this.add
      .rectangle(width / 2, 32, 210, pillHeight, 0x2e7d32, 0.95)
      .setScrollFactor(0)
      .setDepth(1001);

    this.ui.timerText = this.add
      .text(width / 2, 19, "", {
        fontSize: "20px",
        color: "#e8f5e9",
        fontStyle: "bold"
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1002);

    const rightCenter = width - 180;

    this.add
      .rectangle(rightCenter, 32, 260, pillHeight, 0x1e3a5f, 0.95)
      .setScrollFactor(0)
      .setDepth(1001);

    this.ui.targetText = this.add
      .text(rightCenter, 19, "", {
        fontSize: "20px",
        color: "#e3f2fd",
        align: "right"
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1002);

    // Message
    this.ui.messageText = this.add
      .text(width / 2, 86, "", {
        fontSize: "26px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 14, y: 8 }
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1003)
      .setVisible(false);

    this.updateTargetText();
    this.updateTimerText();
  }

  updateTargetText() {
    const total = this.targets.length;
    this.ui.targetText.setText(`🎯 Targets: ${this.foundCount}/${total}`);
  }

  updateTimerText() {
    const time = Math.max(0, Math.ceil(this.timeLeft));
    this.ui.timerText.setText(`⏱ Time: ${time}s`);
  }

  showMessage(text) {
    this.ui.messageText.setText(text).setVisible(true);
    this.time.delayedCall(2000, () => {
      this.ui.messageText.setVisible(false);
    });
  }

  tickTimer() {
    if (this.timeLeft <= 0) return;

    this.timeLeft -= 1;
    this.updateTimerText();

    if (this.timeLeft <= 10 && this.timeLeft > 0) {
      this.cameras.main.flash(100, 255, 50, 50, false);
    }

    if (this.timeLeft <= 0) {
      this.handleTimeUp();
    }
  }

  handleTimeUp() {
    this.timeLeft = 0;
    this.updateTimerText();
    this.showMessage("⏰ Time's up!");
    this.input.enabled = false;

    this.time.delayedCall(2500, () => {
      this.scene.start("Menu");
    });
  }

  setupCameraControls() {
    const cam = this.cameras.main;

    this.input.on("pointerdown", (pointer) => {
      this.dragging = true;
      this.lastDragPos.set(pointer.x, pointer.y);
    });

    this.input.on("pointerup", () => {
      this.dragging = false;
    });

    this.input.on("pointermove", (pointer) => {
      if (!this.dragging || !pointer.isDown) return;
      const dx = pointer.x - this.lastDragPos.x;
      const dy = pointer.y - this.lastDragPos.y;

      cam.scrollX -= dx / cam.zoom;
      cam.scrollY -= dy / cam.zoom;

      this.lastDragPos.set(pointer.x, pointer.y);
    });

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      const zoomFactor = 1.05;
      const maxZoom = 2;
      const minZoom = 0.5;

      if (deltaY > 0) {
        cam.setZoom(Phaser.Math.Clamp(cam.zoom / zoomFactor, minZoom, maxZoom));
      } else if (deltaY < 0) {
        cam.setZoom(Phaser.Math.Clamp(cam.zoom * zoomFactor, minZoom, maxZoom));
      }
    });
  }

  setupClickHandling() { //click on sprite (error and success)
    this.input.on("gameobjectdown", (pointer, gameObject) => {
      if (!this.input.enabled) return;
      this.handleSpriteClick(pointer, gameObject);
    });
  }

  handleSpriteClick(pointer, sprite) {
    if (sprite.found) return;

    if (sprite.isTarget) {
      this.onFoundTarget(sprite);
    } else {
      this.tweens.add({
        targets: sprite,
        angle: { from: -5, to: 5 },
        yoyo: true,
        repeat: 2,
        duration: 60
      });
    }
  }

  onFoundTarget(sprite) {
    sprite.found = true;
    this.foundCount += 1;
    this.updateTargetText();

    if (sprite.hint) {
      sprite.hint.destroy();
      sprite.hint = null;
    }

    this.particles.explode(24, sprite.x, sprite.y);

    this.tweens.add({
      targets: sprite,
      scaleX: sprite.scaleX * 1.3,
      scaleY: sprite.scaleY * 1.3,
      yoyo: true,
      duration: 180,
      onComplete: () => {
        sprite.setTint(0x999999);
        sprite.alpha = 0.6;
      }
    });

    if (this.foundCount === this.targets.length) {
      this.onAllTargetsFound();
    }
  }

  onAllTargetsFound() {
    this.input.enabled = false;
    this.showMessage("🎉 You found them all!");
    this.time.delayedCall(2500, () => {
      this.scene.start("Menu");
    });
  }

  startHintTimer() {
    const hintInterval = 5000;
    const hintDuration = 400;

    this.time.addEvent({
      delay: hintInterval,
      loop: true,
      callback: () => {
        this.targets.forEach((sprite) => {
          if (sprite.found || !sprite.hint) return;
          sprite.hint.setVisible(true);
          sprite.hint.setAlpha(1);
          this.tweens.add({
            targets: sprite.hint,
            scaleX: { from: 1.2, to: 1 },
            scaleY: { from: 1.2, to: 1 },
            duration: hintDuration
          });
        });

        this.time.delayedCall(hintDuration, () => {
          this.targets.forEach((sprite) => {
            if (sprite.hint) sprite.hint.setVisible(false);
          });
        });
      }
    });
  }

  update(time, delta) {
    const t = time / 1000;

    this.objects.forEach((sprite) => {
      if (sprite.baseX == null || sprite.baseY == null) return;

      const amp = sprite.bobAmplitude || 0;
      const speed = sprite.bobSpeed || 0;
      const phase = sprite.bobPhase || 0;

      if (amp === 0 || speed === 0) return;

      const offY = Math.sin(t * speed * 2 * Math.PI + phase) * amp;
      const offX = Math.cos(t * speed * 2 * Math.PI + phase) * (amp * 0.5);

      sprite.x = sprite.baseX + offX;
      sprite.y = sprite.baseY + offY;

      sprite.setDepth(sprite.y);

      if (sprite.hint) {
        const offset = sprite.hintOffset || 40;
        sprite.hint.x = sprite.x;
        sprite.hint.y = sprite.y - offset;
      }
    });
  }
}

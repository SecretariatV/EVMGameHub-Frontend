import { GameObjects, Scene, Structs } from "phaser";
import { Boot, CustomScene } from "./boot";
import { EventBus } from "@/utils/phaser";

export class End extends Scene implements CustomScene {
  background: GameObjects.Image | null = null;
  boom: GameObjects.Image | null = null;
  x: number = 0;
  y: number = 0;
  frameIndex: number = 1;

  parent: Structs.Size;
  sizer: Structs.Size;
  width: number;
  height: number;
  canvasWidth: number | null = null;
  canvasHeight: number | null = null;
  bootScene: Boot | null = null;
  sceneStopped: boolean = false;

  private groundSprite!: Phaser.GameObjects.Sprite;
  private tweenCompleted: boolean = false;

  constructor() {
    super("End");
    this.parent = new Structs.Size();
    this.sizer = new Structs.Size();
    this.width = 0;
    this.height = 0;
  }

  init(data: any) {
    this.setEndPosition(data.current.bombX, data.current.bombY);
    this.frameIndex = data.current.index;
  }

  create() {
    this.width = Number(this.sys.game.config.width);
    this.height = Number(this.sys.game.config.height);

    this.bootScene = this.scene.get("Boot") as Boot;
    this.bootScene.sceneRunning = "end";

    this.bootScene.updateResize(this);

    const groundframes: any = [];
    const startFrame = this.frameIndex;
    for (let i = startFrame; i >= 1; i--) {
      groundframes.push({ key: "groundAtlas", frame: `${i}.jpg` });
    }

    this.anims.create({
      key: "reverse_groundAnimation",
      frames: groundframes,
      frameRate: 50,
      delay: 500,
    });

    this.groundSprite = this.add
      .sprite(0, this.height, "groundAtlas", `${this.frameIndex}.jpg`)
      .setOrigin(0, 1)
      .setScale(1.045, 1);

    this.boom = this.add
      .image(this.x, this.y, "bomb")
      .setOrigin(0.5)
      .setScale(0.1)
      .setAlpha(1);

    this.tweens.add({
      targets: this.boom,
      scale: 0.4,
      alpha: 0,
      yoyo: false,
      duration: 800,
      onComplete: () => {
        this.tweenCompleted = true;
      },
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    if (this.tweenCompleted && !this.groundSprite.anims.isPlaying) {
      this.groundSprite.play("reverse_groundAnimation");
      this.tweenCompleted = false; // Optionally reset the flag if needed
    }

    this.boom?.setPosition(this.x, this.y);
  }

  setEndPosition(bombX: number, bombY: number) {
    this.x = bombX;
    this.y = bombY;
  }

  growthFunc = (ms: number) =>
    Math.floor(100 * Math.pow(Math.E, 0.00000000001 * ms));

  changeScene() {
    this.scene.stop("End");
    if (this.bootScene) {
      this.bootScene.launchScene("Prepare", 0);
    }
  }

  drawBomb() {
    this.boom?.setPosition(80, 80);
  }
}

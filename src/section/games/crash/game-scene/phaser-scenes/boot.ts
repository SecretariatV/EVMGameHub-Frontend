import { CCrashGameScreen } from "@/constants/data";
import { EventBus } from "@/utils/phaser";
import { GameObjects, Scene, Structs } from "phaser";

export interface CustomScene extends Scene {
  parent: Structs.Size;
  sizer: Structs.Size;
  width: number;
  height: number;
  sceneStopped: boolean;
}

export class Boot extends Scene implements CustomScene {
  parent: Structs.Size;
  sizer: Structs.Size;
  width: number;
  height: number;
  sceneStopped: boolean = false;
  sceneRunning: string | null = null;
  gameScene: Scene | null = null;
  loadBar: GameObjects.Graphics | null = null;
  progressBar: GameObjects.Graphics | null = null;

  constructor() {
    super("Boot");
    this.parent = new Structs.Size();
    this.sizer = new Structs.Size();
    this.width = 0;
    this.height = 0;
  }

  preload() {
    this.createBars();
    this.load.on(
      "progress",
      (value) => {
        if (this.progressBar) {
          this.progressBar.clear();
          this.progressBar.fillStyle(0xffedc2, 1);
          this.progressBar.fillRect(
            this.cameras.main.width / 4,
            this.cameras.main.height / 2 - 16,
            (this.cameras.main.width / 2) * value,
            16
          );
        }
      },
      this
    );
    this.load.on(
      "complete",
      () => {
        EventBus.emit("current-scene-ready", this);
      },
      this
    );
    this.load.multiatlas({
      key: "groundAtlas",
      atlasURL: "ground/ground.json",
      path: "ground/",
    });
  }

  create() {
    this.launchScene("Preloader", 0);
  }

  launchScene(scene: string, data: any) {
    this.scene.launch(scene, { current: data });
    this.gameScene = this.scene.get(scene);
  }

  updateResize(scene: CustomScene) {
    scene.scale.on("resize", this.resize, scene);

    const scaleWidth = scene.scale.gameSize.width;
    const scaleHeight = scene.scale.gameSize.height;

    scene.parent = new Phaser.Structs.Size(scaleWidth, scaleHeight);
    scene.sizer = new Phaser.Structs.Size(
      scene.width,
      scene.height,
      Phaser.Structs.Size.FIT,
      scene.parent
    );

    scene.parent.setSize(scaleWidth, scaleHeight);
    scene.sizer.setSize(scaleWidth, scaleHeight);

    this.updateCamera(scene);
  }

  resize() {
    if (!this.sceneStopped) {
      const width = this.scale.gameSize.width;
      const height = this.scale.gameSize.height;

      this.parent.setSize(width, height);
      this.sizer.setSize(width, height);

      const camera = this.cameras.main;

      if (camera) {
        const scaleX = this.sizer.width / CCrashGameScreen.width;
        const scaleY = this.sizer.height / CCrashGameScreen.height;

        camera.setZoom(Math.max(scaleX, scaleY));
        camera.centerOn(
          CCrashGameScreen.width / 2,
          CCrashGameScreen.height / 2
        );
      }
    }
  }

  updateCamera(scene: CustomScene) {
    const camera = scene.cameras.main;

    const scaleX = scene.sizer.width / CCrashGameScreen.width;
    const scaleY = scene.sizer.height / CCrashGameScreen.height;

    camera.setZoom(Math.max(scaleX, scaleY));
    camera.centerOn(CCrashGameScreen.width / 2, CCrashGameScreen.height / 2);
  }

  createBars() {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0x21313d, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }
}

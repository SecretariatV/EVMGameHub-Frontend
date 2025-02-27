import { AUTO, Game } from "phaser";
import { Boot, Preloader, Prepare, Play, End } from ".";
import { CCrashGameScreen } from "@/constants/data";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  backgroundColor: "#FFEDC2",
  scale: {
    parent: "game-container",
    width: CCrashGameScreen.width,
    height: CCrashGameScreen.height,
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
  scene: [Boot, Preloader, Prepare, Play, End],
};

const StartGame = (_parent: string) => {
  return new Game({ ...config });
};

export default StartGame;

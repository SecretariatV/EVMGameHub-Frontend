import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./phaser-scenes/main";
import { EventBus } from "@/utils/phaser";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
  height: number;
}

const CrashGameScene = forwardRef<IRefPhaserGame, IProps>(function CrashGame(
  { currentActiveScene, height },
  ref
) {
  const game = useRef<Phaser.Game | null>(null!);

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame("game-container");

      if (typeof ref === "function") {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    };
  }, [ref, height]);

  useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
      if (currentActiveScene && typeof currentActiveScene === "function") {
        currentActiveScene(scene_instance);
      }
      if (typeof ref === "function") {
        ref({ game: game.current, scene: scene_instance });
      } else if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
        // if (crash.scene !== scene_instance) {
        //     setCrash((prevState) => ({ ...prevState, scene: scene_instance }));
        // }
      }
    });
  }, [ref, currentActiveScene]);

  return <div id="game-container"></div>;
});

export default CrashGameScene;

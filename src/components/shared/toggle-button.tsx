"use client";

import { useAppDispatch, useAppSelector } from "@/store/redux";
import { settingsActions } from "@/store/redux/actions";
import { Music, Volume2 } from "lucide-react";

export default function ToggleButton() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((store: any) => store.settings);

  const handleMusic = () => {
    dispatch(settingsActions.musicPlay(!settings.isMusicPlay));
  };

  const handleSound = () => {
    dispatch(settingsActions.soundPlay(!settings.isSoundPlay));
  };

  return (
    <>
      <div className="flex items-center dark:text-white">
        <div className="relative mx-2 flex items-center gap-2 rounded-full border-2 border-[#4a278da1] bg-transparent shadow-sm hover:bg-transparent">
          <div className="z-20 flex h-7 flex-row items-center justify-between gap-3.5 rounded-full bg-transparent px-2.5">
            <Music
              className={`z-10 w-5 cursor-pointer ${settings.isMusicPlay ? "text-purple" : "text-white"}`}
              onClick={handleMusic}
            />
            <Volume2
              className={`z-10 w-5 cursor-pointer ${settings.isSoundPlay ? "text-purple" : "text-white"}`}
              onClick={handleSound}
            />
          </div>
        </div>
      </div>
    </>
  );
}

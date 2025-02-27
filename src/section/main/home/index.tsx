"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import InvitedFriends from "/assets/home/invite.png";
import {
  casino_game_list,
  casinoGameSrc,
  minigame_list,
  minigameSrc,
} from "@/constants/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Vector } from "@/components/icon/icons/Vector";

type TCasinoGames = {
  bgColor: string;
  logoImage: string;
  starLogo?: string;
  cloudLogo?: string;
  linkTo: string;
  description: string;
  title: string;
  isActive: boolean;
  shortDescription: string;
  onClick: () => void;
};

type TMinigame = {
  bgColor: string;
  logoImage: string;
  linkTo: string;
  description: string;
  title: string;
  isActive: boolean;
  shortDescription: string;
  onClick: () => void;
  starLogo?: string;
  cloudLogo?: string;
};

const CasinoGames = ({
  bgColor,
  logoImage,
  linkTo,
  description,
  title,
  isActive,
  onClick,
  shortDescription,
  starLogo,
  cloudLogo,
}: TCasinoGames) => {
  return (
    <div
      className={`h-[250px] cursor-pointer ${isActive ? "w-8/12" : "w-4/12"}`}
      onClick={onClick}
    >
      <div
        className="relative h-full w-full border-2 border-black"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className={`z-50 flex ${isActive ? `flex-row` : `flex-col-reverse`} h-full w-full items-start gap-5 px-6 py-7`}
        >
          <div className="absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
            {isActive && title === "crash" && (
              <>
                <img
                  src={starLogo}
                  alt="star"
                  className="absolute right-3 top-[-10px] z-50"
                />
                <img
                  src={cloudLogo}
                  alt="cloud"
                  className="absolute right-36 top-10 z-50"
                />
                <img
                  src={starLogo}
                  alt="star"
                  className="w-50 absolute bottom-10 right-24 z-50"
                />
                <img
                  src={starLogo}
                  alt="star"
                  className="absolute bottom-16 right-36 z-50 w-8"
                />
              </>
            )}
            <Vector
              width={876}
              height={220}
              viewBox="0 0 876 220"
              color="#ffffff4c"
              className="absolute left-0 top-24 z-10"
            />
            <Vector
              width={876}
              height={110}
              viewBox="0 0 876 110"
              color="#ffffff4c"
              className="absolute left-0 top-48 z-10"
            />
          </div>
          <div className="flex h-full w-full flex-col items-start justify-between gap-4">
            <div className="flex flex-col items-start gap-2">
              <h1 className="z-50 font-tertiary text-xl font-bold capitalize text-black">
                {title}
              </h1>
              <p className="z-50 max-w-[300px] font-secondary text-sm text-black">
                {isActive ? description : shortDescription}
              </p>
            </div>
            <Link
              to={linkTo}
              className="active-card-shadow z-10 border border-black bg-white px-3 py-2 font-primary text-base text-black"
            >
              Play Now
            </Link>
          </div>
          <img
            src={logoImage}
            alt="title"
            className={`bottom-5 left-5 z-50 rounded-md ${isActive ? `w-40` : `w-16`}`}
          />
        </div>
      </div>
    </div>
  );
};

const Minigame = ({
  bgColor,
  logoImage,
  linkTo,
  description,
  title,
  isActive,
  onClick,
  shortDescription,
  starLogo,
  cloudLogo,
}: TMinigame) => {
  return (
    <div
      className={`h-[250px] cursor-pointer transition-all duration-100 ease-in-out ${isActive ? "w-8/12" : "w-4/12"}`}
      onClick={onClick}
    >
      <div
        className="relative h-full w-full border-2 border-black"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className={`z-50 flex ${isActive ? `flex-row` : `flex-col-reverse`} h-full w-full items-start gap-2 px-6 py-6`}
        >
          <div className="absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
            {isActive && title === "rocket rush" && (
              <>
                <img
                  src={starLogo}
                  alt="star"
                  className="absolute right-3 top-[-10px] z-50"
                />
                <img
                  src={cloudLogo}
                  alt="cloud"
                  className="absolute right-[-70px] top-10 z-50 w-40"
                />
                <img
                  src={cloudLogo}
                  alt="cloud"
                  className="absolute bottom-10 right-52 z-50"
                />
                <img
                  src={starLogo}
                  alt="star"
                  className="w-50 absolute bottom-16 right-56 z-50"
                />
                <img
                  src={starLogo}
                  alt="star"
                  className="absolute bottom-24 right-64 z-50 w-8"
                />
              </>
            )}
            <Vector
              width={876}
              height={220}
              viewBox="0 0 876 220"
              color="#ffffff4c"
              className="absolute left-0 top-24 z-10"
            />
            <Vector
              width={876}
              height={110}
              viewBox="0 0 876 110"
              color="#ffffff4c"
              className="absolute left-0 top-48 z-10"
            />
          </div>
          <div className="flex h-full w-full flex-col items-start justify-between gap-4">
            <div className="flex flex-col items-start gap-2">
              <h1 className="z-50 font-tertiary text-2xl font-bold capitalize leading-7 text-black">
                {title}
              </h1>
              <p className="z-50 max-w-[300px] font-secondary text-sm leading-7 text-black">
                {isActive ? description : shortDescription}
              </p>
            </div>
            <Link
              to={linkTo}
              className="active-card-shadow z-10 border border-black bg-white px-3 py-2 font-primary text-base text-black"
            >
              Play Now
            </Link>
          </div>
          <img
            src={logoImage}
            alt="title"
            className={`z-50 rounded-md ${isActive ? `mr-10 mt-8 w-52` : `w-16`}`}
          />
        </div>
      </div>
    </div>
  );
};

export default function HomeSection() {
  const [activeGame, setActiveGame] = useState<string>(casino_game_list[0]);
  const [activeMinigame, setActiveMinigame] = useState<string>(
    minigame_list[0]
  );
  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="flex w-full flex-col items-stretch gap-8 p-12">
        <div className="flex flex-col items-stretch gap-5">
          <div className="flex h-full w-full flex-row gap-6 border-2 border-black">
            <div className="relative w-full rounded-md">
              <img
                src={InvitedFriends}
                alt="Banner Image"
                className="aspect-auto w-full"
              />
              <div className="absolute top-0 flex h-full w-full flex-col items-start justify-center gap-5 p-10">
                <h2 className="max-w-[450px] font-primary text-3xl font-bold uppercase leading-10 text-white">
                  Reffer to your friends & Get reward up to $100
                </h2>
                <p className="text-center font-secondary text-lg leading-7 text-white">
                  Join the Affiliate and get reward up to $100.
                </p>
                <Button className="active-card-shadow border border-black bg-white px-6 py-4 font-primary text-xl text-black">
                  Invite Friends
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <span className="font-primary text-2xl capitalize text-black">
              Casino
            </span>
            <div className="flex items-center justify-center space-x-4">
              {casino_game_list.map((item, index) => (
                <Button
                  key={index}
                  className={`h-2.5 w-2.5 border border-black ${activeGame === item ? "bg-black" : "bg-white"}`}
                  onClick={() => setActiveGame(item)}
                />
              ))}
            </div>
          </div>
          <div className="flex h-full w-full flex-row justify-between gap-8">
            {casinoGameSrc.map((item, index) => {
              return (
                <CasinoGames
                  key={index}
                  logoImage={item.logoImage}
                  title={item.title}
                  bgColor={item.bgColor}
                  linkTo={item.href}
                  description={item.description}
                  shortDescription={item.shortDescription}
                  isActive={activeGame === item.title}
                  onClick={() => setActiveGame(item.title)}
                  starLogo={item.starLogo}
                  cloudLogo={item.cloudLogo}
                />
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-between">
            <span className="font-primary text-2xl capitalize text-black">
              Mini Games
            </span>
          </div>
          <div className="flex h-full w-full flex-row justify-between gap-8">
            {minigameSrc.map((item, index) => {
              return (
                <Minigame
                  key={index}
                  logoImage={item.logoImage}
                  title={item.title}
                  bgColor={item.bgColor}
                  linkTo={item.href}
                  description={item.description}
                  shortDescription={item.shortDescription}
                  isActive={activeMinigame === item.title}
                  onClick={() => setActiveMinigame(item.title)}
                  starLogo={item.starLogo}
                  cloudLogo={item.cloudLogo}
                />
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

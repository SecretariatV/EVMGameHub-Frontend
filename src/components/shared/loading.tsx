export default function Loading() {
  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="relative mx-8 w-full max-w-xs text-center text-black">
        <div className="text-3vw mb-5 flex justify-evenly leading-[30px] tracking-widest">
          <span className="animate-moveLetters font-bold opacity-0">L</span>
          <span className="animate-moveLetters font-bold opacity-0">O</span>
          <span className="animate-moveLetters font-bold opacity-0">A</span>
          <span className="animate-moveLetters font-bold opacity-0">D</span>
          <span className="animate-moveLetters font-bold opacity-0">I</span>
          <span className="animate-moveLetters font-bold opacity-0">N</span>
          <span className="animate-moveLetters font-bold opacity-0">G</span>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full animate-movingLine rounded-full bg-black"></div>
      </div>
    </div>
  );
}

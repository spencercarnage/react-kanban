import classNames from "classnames";

// Tailwind needs whole class names at build time, so each particle's
// direction (--x/--y), spin (--r) and color is spelled out here.
const PARTICLES = [
  "[--x:-70px] [--y:-50px] [--r:200deg] bg-lime-400",
  "[--x:-40px] [--y:-80px] [--r:-120deg] bg-cyan-400",
  "[--x:0px] [--y:-90px] [--r:90deg] bg-yellow-300",
  "[--x:40px] [--y:-80px] [--r:-200deg] bg-pink-400",
  "[--x:70px] [--y:-50px] [--r:160deg] bg-lime-300",
  "[--x:90px] [--y:-10px] [--r:-90deg] bg-cyan-300",
  "[--x:70px] [--y:40px] [--r:240deg] bg-yellow-400",
  "[--x:20px] [--y:60px] [--r:-160deg] bg-lime-500",
  "[--x:-20px] [--y:60px] [--r:120deg] bg-pink-300",
  "[--x:-70px] [--y:40px] [--r:-240deg] bg-cyan-500",
  "[--x:-90px] [--y:-10px] [--r:90deg] bg-yellow-200",
  "[--x:-55px] [--y:-95px] [--r:-60deg] bg-lime-400",
];

type CelebrationProps = {
  /** Called when the animation finishes. */
  onComplete: () => void;
};

export default function Celebration({ onComplete }: CelebrationProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          aria-hidden
          className={classNames(
            "absolute size-2 rounded-sm motion-safe:animate-confetti motion-reduce:hidden",
            particle,
          )}
        />
      ))}
      <span
        role="status"
        onAnimationEnd={onComplete}
        className="absolute -top-3 whitespace-nowrap rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-zinc-900 shadow-lg motion-safe:animate-celebrate motion-reduce:animate-fade-out"
      >
        Wubba lubba dub dub!
      </span>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import "./App.css";
import Confetti from "react-confetti";
import useSound from "use-sound";
import clickSound from "/sounds/click.mp3";
import successSound from "/sounds/success.mp3";
import bgMusic from "/sounds/bg.mp3";

const teamMembers = [
  { name: "0xSuccinct", image: "/members/0xsuccinct.jpg" },
  { name: "0xRaaz", image: "/members/0xraaz.jpg" },
  { name: "Nalin", image: "/members/nalin.jpg" },
  { name: "Tiancheng", image: "/members/tiancheng.jpg" },
  { name: "Jay", image: "/members/jay.jpg" },
  { name: "Nathan", image: "/members/nathan.jpg" },
  { name: "Gautam", image: "/members/gautam.jpg" },
  { name: "Nick", image: "/members/nick.jpg" },
  { name: "Daniel", image: "/members/daniel.jpg" },
  { name: "Victor", image: "/members/victor.jpg" },
  { name: "Andy", image: "/members/andy.jpg" },
  { name: "Zhen", image: "/members/zhen.jpg" },
  { name: "Max", image: "/members/max.jpg" },
  { name: "Pau", image: "/members/pau.jpg" },
  { name: "Anna", image: "/members/anna.jpg" },
  { name: "Charlotte", image: "/members/charlotte.jpg" },
];

const generateShuffledTiles = (image) => {
  const tiles = [];
  for (let i = 0; i < 16; i++) {
    tiles.push({ id: i, img: image, pos: i });
  }
  return tiles.sort(() => Math.random() - 0.5);
};

export default function App() {
  const [stage, setStage] = useState(0);
  const [tiles, setTiles] = useState(generateShuffledTiles(teamMembers[0].image));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playClick] = useSound(clickSound, { volume: 0.5 });
  const [playSuccess] = useSound(successSound, { volume: 0.6 });
  const [bgAudio] = useSound(bgMusic, { volume: 0.2, loop: true });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (solved) {
      playSuccess();
      setShowConfetti(true);
      setTimeout(() => {
        if (stage + 1 < teamMembers.length) {
          const nextStage = stage + 1;
          setStage(nextStage);
          setTiles(generateShuffledTiles(teamMembers[nextStage].image));
          setSolved(false);
          setSelected(null);
        }
        setShowConfetti(false);
      }, 3000);
    }
  }, [solved]);

  const handleTileClick = (index) => {
    if (!isRunning) return;
    playClick();
    if (selected === null) {
      setSelected(index);
    } else {
      const newTiles = [...tiles];
      [newTiles[selected], newTiles[index]] = [newTiles[index], newTiles[selected]];
      setTiles(newTiles);
      setSelected(null);
      checkSolved(newTiles);
    }
  };

  const checkSolved = (tiles) => {
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].pos !== i) return;
    }
    setSolved(true);
  };

  const formatTime = (t) => {
    const m = String(Math.floor(t / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setTimer(0);
    bgAudio();
  };

  const handlePause = () => setIsRunning(false);
  const handlePlay = () => setIsRunning(true);

  return (
    <div className="min-h-screen bg-cover bg-center relative text-white" style={{ backgroundImage: `url('/succinct-bg.jpg')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md z-0" />
      {showConfetti && <Confetti className="absolute w-full h-full z-50" />}
      <div className="relative z-10 flex flex-col items-center justify-center py-10 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">ZK Puzzle Grid</h1>
        <h2 className="text-lg md:text-xl mb-6">{teamMembers[stage].name}</h2>
        <div className="flex flex-wrap w-[320px] md:w-[400px] aspect-square">
          {tiles.map((tile, i) => (
            <div
              key={tile.id}
              className="w-1/4 h-1/4 p-[2px] cursor-pointer transition hover:scale-105"
              onClick={() => handleTileClick(i)}
            >
              <img
                src={tile.img}
                alt="tile"
                className="w-full h-full object-cover rounded shadow-inner"
                style={{ objectPosition: `${(tile.pos % 4) * 25}% ${(Math.floor(tile.pos / 4)) * 25}%` }}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4 items-center">
          {!isRunning ? (
            <button onClick={handleStart} className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-semibold">
              Start
            </button>
          ) : (
            <>
              <button onClick={handlePause} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-semibold">
                Pause
              </button>
              <button onClick={handlePlay} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold">
                Play
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-sm md:text-base">⏱ Timer: {formatTime(timer)} | 🧩 Stage {stage + 1} of 16</div>
        <footer className="mt-8 text-xs text-white opacity-80">Made with ❤️ by everdon for Succinct community</footer>
      </div>
    </div>
  );
}
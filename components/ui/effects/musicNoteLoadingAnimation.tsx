"use client";
import React, { useState, useEffect } from "react";

interface MusicNote {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  type: string;
}

const MusicNotesLoadingAnimation: React.FC<{
  phrases?: string[];
  phraseChangeInterval?: number;
  notesCount?: number;
}> = ({
  phrases = [
    "Don't know what's taking so long...",
    "Thinking about the best tune to rock to...",
    "Prep your ears for something good!",
    "Almost ready to jam!",
    "Tuning up the virtual instruments...",
    "Loading your musical experience...",
  ],
  phraseChangeInterval = 2000,
  notesCount = 15,
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [notes, setNotes] = useState<MusicNote[]>([]);

  // Musical note types
  const noteTypes = ["♩", "♪", "♫", "♬", "𝅗𝅥", "𝄞"];

  // Initialize music notes
  useEffect(() => {
    const initialNotes: MusicNote[] = [];
    for (let i = 0; i < notesCount; i++) {
      initialNotes.push({
        id: i,
        x: Math.random() * 100, // position across width (%)
        y: 100 + Math.random() * 50, // start below container
        size: 15 + Math.random() * 20,
        rotation: Math.random() * 360,
        speed: 0.3 + Math.random() * 0.7,
        type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
      });
    }
    setNotes(initialNotes);
  }, [notesCount]);

  // Animate notes
  useEffect(() => {
    const animateNotes = () => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          // Move note upward
          let newY = note.y - note.speed;
          
          // If note goes off screen, reset to bottom with new random x
          if (newY < -10) {
            newY = 100 + Math.random() * 20;
            return {
              ...note,
              y: newY,
              x: Math.random() * 100,
              rotation: Math.random() * 360,
              type: noteTypes[Math.floor(Math.random() * noteTypes.length)],
            };
          }
          
          // Update rotation slightly for spinning effect
          const newRotation = (note.rotation + note.speed * 0.5) % 360;
          
          return { ...note, y: newY, rotation: newRotation };
        })
      );
    };

    const animationFrame = requestAnimationFrame(function animate() {
      animateNotes();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Change phrase periodically
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, phraseChangeInterval);

    return () => clearInterval(phraseInterval);
  }, [phrases, phraseChangeInterval]);

  // Simulate loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + (1 - prev / 100) * 0.05;
        return newProgress >= 95 ? 95 + Math.random() * 5 : newProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="relative w-full h-64 md:h-80 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black to-gray-900 rounded-lg p-4">
      {/* Music notes animation */}
      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute text-primary pointer-events-none transition-transform"
          style={{
            left: `${note.x}%`,
            top: `${note.y}%`,
            fontSize: `${note.size}px`,
            transform: `rotate(${note.rotation}deg)`,
            opacity: 0.6 + Math.random() * 0.4,
          }}
        >
          {note.type}
        </div>
      ))}

      {/* Loading text */}
      <div className="z-10 text-center p-6 bg-black/50 rounded-lg">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
          {phrases[currentPhraseIndex]}
        </h3>
        
        {/* Progress bar */}
        <div className="w-full max-w-md h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        
        
      </div>
    </div>
  );
};

export default MusicNotesLoadingAnimation;
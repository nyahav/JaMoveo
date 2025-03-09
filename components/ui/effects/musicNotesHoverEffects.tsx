"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';

// Define types for our note objects
interface Note {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  size: number;
  opacity: number;
  rotation: number;
  char: string;
  color: string;
}

// Define props interface
interface MusicNotesHoverEffectProps {
  children: ReactNode;
}

const MusicNotesHoverEffect: React.FC<MusicNotesHoverEffectProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastNoteTime = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // Create a new note, but throttle creation to avoid too many notes
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const container = containerRef.current;
    if (!container) return;
    
    const now = Date.now();
    // Only create a new note every 100ms to avoid excessive notes
    if (now - lastNoteTime.current < 100) return;
    
    lastNoteTime.current = now;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Random note character from a variety of music symbols
    const noteChars = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
    const noteChar = noteChars[Math.floor(Math.random() * noteChars.length)];
    
    // Random gentle movement
    const velocityX = (Math.random() - 0.5) * 2;
    const velocityY = -Math.random() * 2 - 1; // Always move upward
    
    // Random color from a predefined palette
    const colors = [
      'var(--primary)', 
      '#1E90FF', 
      '#4169E1', 
      '#6495ED',
      '#4682B4'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const note: Note = {
      id: now,
      x,
      y,
      velocityX,
      velocityY,
      size: Math.random() * 15 + 10,
      opacity: 1,
      rotation: Math.random() * 360,
      char: noteChar,
      color,
    };

    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const animateNotes = (): void => {
    setNotes((prevNotes) =>
      prevNotes
        .map((note) => ({
          ...note,
          x: note.x + note.velocityX,
          y: note.y + note.velocityY,
          opacity: Math.max(0, note.opacity - 0.015),
          rotation: note.rotation + 0.5,
        }))
        .filter((note) => note.opacity > 0.01)
    );
    
    requestRef.current = window.requestAnimationFrame(animateNotes);
  };

  useEffect(() => {
    requestRef.current = window.requestAnimationFrame(animateNotes);
    
    return () => {
      if (requestRef.current !== null) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            position: 'absolute',
            left: note.x,
            top: note.y,
            fontSize: `${note.size}px`,
            opacity: note.opacity,
            pointerEvents: 'none',
            color: note.color,
            transform: `rotate(${note.rotation}deg)`,
            transition: 'opacity 0.3s ease',
            textShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
          }}
        >
          {note.char}
        </div>
      ))}
    </div>
  );
};

export default MusicNotesHoverEffect;
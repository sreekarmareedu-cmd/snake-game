import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Track } from './types';
import { Disc, Gamepad2, Layers } from 'lucide-react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyberpulse',
    artist: 'AI GEN ZEN',
    coverUrl: 'https://picsum.photos/seed/cyber/800/800',
    audioUrl: '',
    color: '#00f2fe',
  },
  {
    id: '2',
    title: 'Midnight Grid',
    artist: 'NEON NOIR',
    coverUrl: 'https://picsum.photos/seed/synth/800/800',
    audioUrl: '',
    color: '#f900dc',
  },
  {
    id: '3',
    title: 'Bass Vector',
    artist: 'DIGITAL DRIFT',
    coverUrl: 'https://picsum.photos/seed/bass/800/800',
    audioUrl: '',
    color: '#39ff14',
  },
];

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#000] text-white font-sans selection:bg-[#ff00ff] selection:text-white">
      <div className="noise-overlay" />
      
      {/* Background Visual Artifacts */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10 transition-colors duration-2000"
          style={{ 
            background: `radial-gradient(circle at 70% 30%, ${currentTrack.color}66 0%, transparent 70%)` 
          }}
        />
        <div className="absolute top-0 left-[20%] h-full w-[1px] bg-[#00ffff11]" />
        <div className="absolute top-0 left-[80%] h-full w-[1px] bg-[#ff00ff11]" />
      </div>

      <header className="relative z-10 flex h-20 items-center justify-between border-b-2 border-[#00ffff22] px-6 md:px-12">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center bg-[#00ffff] text-black">
               <Layers size={24} />
          </div>
          <span className="font-pixel text-sm tracking-tighter text-[#00ffff] uppercase leading-none mt-2">
            NEON_PULSE_OS<br/><span className="text-[8px] opacity-60">KERNEL_V2.04</span>
          </span>
        </div>
        
        <nav className="hidden items-center gap-12 font-mono text-xs tracking-[0.5em] text-[#00ffff88] uppercase md:flex">
          <a href="#" className="text-[#00ffff] border-b-2 border-[#ff00ff] pb-1">TERMINAL</a>
          <a href="#" className="hover:text-white transition-all">ARCHIVE</a>
          <a href="#" className="hover:text-white transition-all">DECODE</a>
        </nav>

        <div className="flex items-center gap-6">
           <div className="h-10 w-24 border-2 border-[#ff00ff] flex items-center justify-center bg-black/50">
             <span className="font-mono text-[10px] text-[#ff00ff] animate-pulse">UP_TIME: 44:12</span>
           </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 py-8 md:px-12 md:py-16">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          
          {/* Main Game Window */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 font-pixel text-[10px] tracking-widest text-[#00ffff] uppercase">
                  <Gamepad2 size={16} />
                  SIM_CORE
               </div>
               <div className="h-[2px] flex-grow bg-gradient-to-r from-[#00ffff] to-transparent opacity-30" />
            </div>

            <div className="flex justify-center border-4 border-[#00ffff44] p-8 bg-black/40 backdrop-blur-xl relative">
               <div className="absolute top-0 right-4 font-mono text-[8px] text-[#00ffff22]">ENCRYPTION: AES-256</div>
               <SnakeGame accentColor={currentTrack.color} />
            </div>
          </div>

          {/* Music Controls Sidebar */}
          <div className="flex flex-col gap-10 lg:col-span-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 font-pixel text-[10px] tracking-widest text-[#ff00ff] uppercase">
                  <Disc size={16} />
                  SIG_RECEIVER
               </div>
               <div className="h-[2px] flex-grow bg-gradient-to-r from-[#ff00ff] to-transparent opacity-30" />
            </div>

            <div className="border-4 border-[#ff00ff22] p-8 bg-black/40 backdrop-blur-xl">
              <MusicPlayer 
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </div>

            <section className="flex flex-col gap-4">
               <span className="font-mono text-[10px] tracking-[0.5em] text-[#ff00ff] uppercase">BUFFER_QUEUE</span>
               <div className="flex flex-col gap-3">
                 {DUMMY_TRACKS.map((track, idx) => (
                   <button
                    key={track.id}
                    onClick={() => setCurrentTrackIndex(idx)}
                    className={`group relative flex items-center gap-6 border-b-2 p-4 transition-all ${
                      idx === currentTrackIndex 
                      ? 'border-[#00ffff] bg-[#00ffff11]' 
                      : 'border-[#ff00ff11] hover:bg-white/[0.05]'
                    }`}
                   >
                     <div className="h-12 w-12 border border-[#00ffff22] overflow-hidden grayscale contrast-150">
                        <img src={track.coverUrl} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                     </div>
                     <div className="flex flex-col items-start truncate text-left">
                        <span className={`font-pixel text-[10px] tracking-tighter ${idx === currentTrackIndex ? 'text-[#00ffff]' : 'text-white/60'}`}>
                          {track.title}
                        </span>
                        <span className="font-mono text-[10px] text-[#ff00ff] opacity-60">UUID: 00{track.id}</span>
                     </div>
                     {idx === currentTrackIndex && (
                       <div className="ml-auto animate-pulse flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[#00ffff]" />
                       </div>
                     )}
                   </button>
                 ))}
               </div>
            </section>
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-8 border-t-2 border-[#00ffff11] pt-12 md:flex-row font-mono">
           <div className="text-[10px] tracking-[0.4em] text-[#00ffff66] uppercase">
             HARDWARE: <span className="text-white">PULSE_RACK_01</span> // CORE_STATUS: NOMINAL
           </div>
           <div className="flex gap-12 text-[10px] tracking-[0.4em] text-[#ff00ff99] uppercase">
              <a href="#" className="hover:text-white underline-offset-4 decoration-white/20 underline">SEC_LOGS</a>
              <a href="#" className="hover:text-white underline-offset-4 decoration-white/20 underline">EULA_DECRYPT</a>
           </div>
        </footer>
      </main>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music2, Disc } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-start">
      <div className="relative h-48 w-48 flex-shrink-0">
        <motion.div
          key={currentTrack.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-full w-full border-2 border-[#00ffff] bg-[#000] p-1"
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="h-full w-full object-cover contrast-150 saturate-0 hue-rotate-180 transition-all hover:saturate-200"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-[#ff00ff]" />
        </motion.div>
        
        {isPlaying && (
          <div className="absolute -right-2 -bottom-2 bg-[#ff00ff] px-2 py-1 font-pixel text-[8px] text-white animate-pulse">
            TRANSMITTING...
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col items-center md:items-start">
        <div className="mb-4 text-center md:text-left">
          <motion.div
            key={currentTrack.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="animate-glitch font-pixel text-xl tracking-tight text-[#00ffff] uppercase md:text-3xl"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </motion.div>
          <motion.div
            key={currentTrack.artist}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 font-mono text-sm tracking-[0.4em] text-[#ff00ff] uppercase"
          >
            SOURCE: {currentTrack.artist}
          </motion.div>
        </div>

        <div className="my-8 flex w-full items-center justify-center gap-8 md:justify-start">
          <button
            onClick={onPrev}
            className="text-[#00ffff] transition-transform hover:-translate-x-1 active:scale-95"
          >
            <SkipBack size={32} />
          </button>
          
          <button
            onClick={onTogglePlay}
            className="flex h-20 w-20 items-center justify-center border-4 border-[#00ffff] bg-transparent text-[#00ffff] transition-all hover:bg-[#00ffff] hover:text-black active:scale-90 shadow-[0_0_20px_#00ffff44]"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>

          <button
            onClick={onNext}
            className="text-[#00ffff] transition-transform hover:translate-x-1 active:scale-95"
          >
            <SkipForward size={32} />
          </button>
        </div>

        <div className="w-full">
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-[#00ffff]">
             <span>0101-STREAM</span>
             <span>BIT_RATE: 320KBPS</span>
          </div>
          <div className="h-4 flex-grow overflow-hidden border-2 border-[#ff00ff] bg-black">
             <motion.div 
               animate={{ x: isPlaying ? ['-100%', '0%'] : '0%' }}
               transition={{ duration: isPlaying ? 1 : 0, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
               className="h-full w-full"
               style={{ 
                 background: `repeating-linear-gradient(90deg, ${currentTrack.color}, ${currentTrack.color} 10px, transparent 10px, transparent 20px)` 
               }}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

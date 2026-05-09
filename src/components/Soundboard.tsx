import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { Sound } from '../types';

interface SoundboardProps {
  sounds: Sound[];
}

export default function Soundboard({ sounds }: SoundboardProps) {
  const playSound = (id: string) => {
    // In a real app, we'd have audio files. For now, we'll simulate the interaction.
    console.log(`Playing sound: ${id}`);
    const utterance = new SpeechSynthesisUtterance(id);
    utterance.volume = 0.5;
    utterance.rate = 1.5;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-display font-bold neon-text-pink">SOUNDS</h2>
        <p className="text-gray-500 font-mono text-xs">AUDIO_OUTPUT // {sounds.length} BUFFERS READY</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sounds.map((sound, index) => (
          <motion.button
            key={sound.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => playSound(sound.id)}
            className="group relative h-32 bg-cyber-dark border border-cyber-border rounded-xl flex flex-col items-center justify-center gap-3 hover:neon-border transition-all duration-300 active:scale-95"
          >
            <div className={`w-12 h-12 rounded-lg ${sound.color} bg-opacity-10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
              {sound.emoji}
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-500 group-hover:text-white uppercase">
              {sound.name}
            </span>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Volume2 size={12} className="text-cyber-cyan" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Visualizer Simulation */}
      <div className="h-24 glass rounded-xl flex items-end justify-between px-8 py-4 gap-1">
        {Array.from({ length: 48 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: [20, Math.random() * 60 + 20, 20] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.random() * 0.5 + 0.5,
              ease: "easeInOut"
            }}
            className="w-1 bg-cyber-cyan/30 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

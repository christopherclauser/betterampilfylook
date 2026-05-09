import { motion } from 'motion/react';
import { Play, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-display font-bold neon-text-cyan">MOVIES</h2>
        <p className="text-gray-500 font-mono text-xs">CINEMA_UPLOADS // {movies.length} STREAMS DETECTED</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => onSelect(movie)}
          >
            <div className="aspect-video relative rounded-2xl overflow-hidden border border-cyber-border group-hover:border-cyber-cyan/50 transition-all duration-500">
              <img 
                src={movie.thumbnail} 
                alt={movie.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Play size={32} className="text-white fill-white ml-1" />
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <div className="px-2 py-1 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-cyan-400">
                  4K // 60FPS
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-xl group-hover:text-cyber-cyan transition-colors">{movie.title}</h3>
                <p className="text-gray-500 text-sm font-sans mt-1">{movie.description}</p>
              </div>
              <Film size={20} className="text-gray-700" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

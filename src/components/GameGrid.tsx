import { motion } from 'motion/react';
import { Grid, Heart, Play } from 'lucide-react';
import { Game } from '../types';

interface GameGridProps {
  games: Game[];
  searchQuery: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelect: (game: Game) => void;
  isFavoritesView?: boolean;
}

export default function GameGrid({ 
  games, 
  searchQuery, 
  favorites, 
  onToggleFavorite, 
  onSelect,
  isFavoritesView 
}: GameGridProps) {
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {!isFavoritesView && !searchQuery && (
        <section className="relative overflow-hidden rounded-3xl bg-cyber-dark border border-cyber-border py-12 px-8 flex flex-col md:flex-row items-center gap-12 group">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-l from-cyber-cyan/20 to-transparent" />
             <Grid className="w-full h-full text-cyber-cyan" strokeWidth={0.5} />
          </div>

          <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-8xl font-display font-bold tracking-tight leading-none overflow-visible"
            >
              TOPHER'S <br/> 
              <span className="text-cyber-cyan neon-text-cyan">GAMES</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed"
            >
              TOPHER IS 11 YEARS OLD AND MADE THIS WEBSITE WITH HIS CODE WITH A BIT OF 4-7 VERSIONS
            </motion.p>
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4"
            >
               <div className="px-4 py-2 glass rounded-full flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-mono font-bold uppercase tracking-tighter">WELCOME BACK, USER // SECTOR 4 ACTIVE</span>
               </div>
            </motion.div>
          </div>

          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-cyber-border relative group-hover:neon-border transition-all duration-500 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
              alt="Cyber Visual"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-black to-transparent" />
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-gray-400">SYSTEM_VISUAL_01</div>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-display font-bold neon-text-cyan uppercase">
          {isFavoritesView ? 'FAVORITES' : searchQuery ? 'SEARCH RESULTS' : 'RECENT MODULES'}
        </h2>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
          {isFavoritesView ? 'SECURE_STORAGE' : 'GRID_DIRECTORY'} // {filteredGames.length} MODULES DETECTED
        </p>
      </div>

      {isFavoritesView && filteredGames.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600 font-mono italic">
          <Heart size={48} className="mb-4 opacity-20" />
          <p>NO DATA FLAGGED AS FAVORITE</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-cyber-dark border border-cyber-border rounded-xl overflow-hidden hover:neon-border transition-all duration-300"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={game.thumbnail} 
                alt={game.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent" />
              
              <button 
                onClick={() => onToggleFavorite(game.id)}
                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border ${favorites.includes(game.id) ? 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'} transition-all`}
              >
                <Heart size={16} fill={favorites.includes(game.id) ? 'currentColor' : 'none'} />
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-gray-400 uppercase tracking-tighter">
                  {game.category}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-display font-bold text-lg tracking-tight group-hover:text-cyber-cyan transition-colors">{game.title}</h3>
              <p className="text-gray-500 text-xs line-clamp-2 font-sans leading-relaxed">{game.description}</p>
              
              <button 
                onClick={() => onSelect(game)}
                className="w-full mt-4 py-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase hover:bg-cyber-cyan hover:text-black hover:border-cyber-cyan transition-all duration-300 group/btn"
              >
                <Play size={12} fill="currentColor" className="group-hover/btn:translate-x-0.5 transition-transform" />
                DEPLOY_NODE
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

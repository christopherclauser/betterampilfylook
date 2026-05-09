/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Volume2, 
  Film, 
  MessageSquare, 
  Heart, 
  Calculator as CalcIcon, 
  LayoutDashboard,
  Search,
  Grid,
  User,
  Bell,
  X
} from 'lucide-react';
import data from './data.json';
import { Game, Movie, Sound, View } from './types';

// Components
import GameGrid from './components/GameGrid';
import Soundboard from './components/Soundboard';
import MovieGrid from './components/MovieGrid';
import ChatTerminal from './components/ChatTerminal';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activeView, setActiveView] = useState<View>('games');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<Game | Movie | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('topher-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('topher-favorites', JSON.stringify(newFavs));
  };

  const navItems = [
    { id: 'games', icon: <Gamepad2 size={20} />, label: 'GAMES' },
    { id: 'sounds', icon: <Volume2 size={20} />, label: 'SOUNDS' },
    { id: 'movies', icon: <Film size={20} />, label: 'MOVIES' },
    { id: 'chat', icon: <MessageSquare size={20} />, label: 'CHAT' },
    { id: 'favorites', icon: <Heart size={20} />, label: 'FAVORITES' },
    { id: 'calculator', icon: <CalcIcon size={20} />, label: 'CALCULATOR' },
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'DASHBOARD' },
  ];

  return (
    <div id="app-container" className="min-h-screen bg-cyber-black text-white selection:bg-cyber-cyan/30">
      <div className="scanline" />
      
      {/* Sidebar / Navbar */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-border z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyber-cyan rounded-sm flex items-center justify-center font-bold text-black text-xl italic" id="logo-icon">T</div>
            <h1 className="font-display font-bold text-xl tracking-wider neon-text-cyan hidden md:block" id="logo-text">
              TOPHER'S <span className="text-cyber-cyan">GAMES</span>
            </h1>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={`flex items-center gap-2 text-xs font-bold tracking-widest transition-all duration-300 hover:text-cyber-cyan group ${activeView === item.id ? 'text-cyber-cyan' : 'text-gray-500'}`}
                id={`nav-${item.id}`}
              >
                <span className={`transition-transform duration-300 group-hover:scale-110 ${activeView === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
                {item.label}
                {activeView === item.id && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-cyber-cyan shadow-[0_0_10px_#00F3FF]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block" id="search-container">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyber-cyan transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH THE GRID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-cyber-black border border-cyber-border rounded-full py-2 pl-10 pr-4 text-xs font-mono tracking-tighter focus:outline-none focus:border-cyber-cyan/50 w-48 transition-all duration-300 focus:w-64"
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-cyber-cyan transition-colors rounded-full hover:bg-white/5" id="bell-btn">
            <Bell size={20} />
          </button>
          <div className="w-9 h-9 rounded-full bg-cyber-border p-[1px] cursor-pointer hover:neon-border" id="user-profile">
            <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center">
              <User size={18} className="text-gray-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'games' && (
              <GameGrid 
                games={data.games as Game[]} 
                searchQuery={searchQuery} 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelect={setSelectedItem}
              />
            )}
            {activeView === 'sounds' && <Soundboard sounds={data.sounds as Sound[]} />}
            {activeView === 'movies' && (
              <MovieGrid 
                movies={data.movies as Movie[]} 
                onSelect={setSelectedItem}
              />
            )}
            {activeView === 'chat' && <ChatTerminal />}
            {activeView === 'favorites' && (
              <GameGrid 
                games={data.games.filter(g => favorites.includes(g.id)) as Game[]} 
                searchQuery={searchQuery}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelect={setSelectedItem}
                isFavoritesView
              />
            )}
            {activeView === 'calculator' && <Calculator />}
            {activeView === 'dashboard' && <Dashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border py-8 px-6 mt-12 bg-cyber-dark/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            SYSTEM_ACTIVE // SECTOR_4 // BUILD_24.0
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-cyber-cyan transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-cyber-cyan transition-colors">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-cyber-cyan transition-colors">CONTACT</a>
          </div>
          <div id="footer-logo">© TOPHERSHAPES // TOPHER_OS</div>
        </div>
      </footer>

      {/* Item Overlay (Iframe Player) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-cyber-black/95 backdrop-blur-xl"
            id="item-overlay"
          >
            <div className="relative w-full h-full max-w-6xl max-h-[85vh] bg-cyber-dark rounded-xl border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-cyber-border">
                <div className="flex items-center gap-4">
                  <h3 className="font-display font-bold text-lg text-cyber-cyan tracking-wider uppercase">{selectedItem.title}</h3>
                  <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/20 text-[10px] font-mono text-cyber-cyan uppercase">
                    SYSTEM_LINK_ACTIVE
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                  id="close-overlay"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 bg-black relative">
                <iframe 
                  src={selectedItem.iframeUrl} 
                  className="w-full h-full border-none"
                  allowFullScreen
                  title={selectedItem.title}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


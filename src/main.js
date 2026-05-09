
let activeView = 'games';
let favorites = JSON.parse(localStorage.getItem('topher-favorites') || '[]');
let data = null;
let searchQuery = '';

async function init() {
  try {
    const response = await fetch('./src/data.json');
    if (!response.ok) throw new Error('DATA_LOAD_FAILURE');
    data = await response.json();
    render();
  } catch (error) {
    console.error('Core system error:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[50vh] font-mono text-cyber-pink">
          <div class="text-4xl mb-4">CRITICAL_ERROR</div>
          <p>FAILED TO LOAD SYSTEM DATA [data.json]</p>
          <button onclick="location.reload()" class="mt-8 px-6 py-2 border border-cyber-pink bg-cyber-pink/10 hover:bg-cyber-pink hover:text-black transition-all">REBOOT_SYSTEM</button>
        </div>
      `;
    }
  }
}

window.handleSearch = (query) => {
  searchQuery = query;
  render();
  // Keep focus on input after re-render
  const input = document.getElementById('search-input');
  if (input) {
    input.focus();
    input.value = searchQuery;
    // Set cursor at the end
    input.setSelectionRange(searchQuery.length, searchQuery.length);
  }
};

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <nav class="fixed top-0 left-0 w-full h-16 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-border z-50 flex items-center justify-between px-6">
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-2 cursor-pointer" onclick="setView('games')">
          <div class="w-8 h-8 bg-cyber-cyan rounded-sm flex items-center justify-center font-bold text-black text-xl italic">T</div>
          <h1 class="font-display font-bold text-xl tracking-wider neon-text-cyan hidden md:block">
            TOPHER'S <span class="text-cyber-cyan">GAMES</span>
          </h1>
        </div>
        <div class="hidden lg:flex items-center gap-6">
          ${renderNavItems()}
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative group hidden sm:block">
          <input type="text" id="search-input" placeholder="SEARCH THE GRID..." oninput="handleSearch(this.value)" class="bg-cyber-black border border-cyber-border rounded-full py-2 px-4 pl-10 text-xs font-mono focus:outline-none focus:border-cyber-cyan/50 w-48 transition-all">
        </div>
      </div>
    </nav>

    <main class="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
      ${renderActiveView()}
    </main>

    <footer class="border-t border-cyber-border py-8 px-6 mt-12 bg-cyber-dark/50">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 text-xs font-mono">
        <div>SYSTEM_ACTIVE // SECTOR_4 // BUILD_24.0</div>
        <div>© TOPHERSHAPES // TOPHER_OS</div>
      </div>
    </footer>

    <div id="modal-container"></div>
  `;
}

function renderNavItems() {
  const items = [
    { id: 'games', label: 'GAMES' },
    { id: 'sounds', label: 'SOUNDS' },
    { id: 'movies', label: 'MOVIES' },
    { id: 'chat', label: 'CHAT' },
    { id: 'favorites', label: 'FAVORITES' },
    { id: 'calculator', label: 'CALCULATOR' },
  ];
  return items.map(item => `
    <button onclick="setView('${item.id}')" class="text-xs font-bold tracking-widest ${activeView === item.id ? 'text-cyber-cyan' : 'text-gray-500'} hover:text-white transition-colors uppercase">
      ${item.label}
    </button>
  `).join('');
}

function renderActiveView() {
  if (!data) return '<div class="text-center py-24 font-mono">LOADING_DATA...</div>';

  const filteredGames = data.games.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  switch(activeView) {
    case 'games': return renderGameGrid(filteredGames);
    case 'sounds': return renderSoundboard();
    case 'movies': return renderMovieGrid();
    case 'chat': return renderChat();
    case 'favorites': return renderGameGrid(filteredGames.filter(g => favorites.includes(g.id)));
    case 'calculator': return renderCalculator();
    case 'dashboard': return renderDashboard();
    default: return '';
  }
}

function renderGameGrid(games) {
  return `
    <div class="space-y-12">
      ${activeView === 'games' ? `
        <section class="relative overflow-hidden rounded-3xl bg-cyber-dark border border-cyber-border py-12 px-8 flex flex-col md:flex-row items-center gap-12 group">
          <div class="flex-1 space-y-6 relative z-10">
            <h2 class="text-6xl md:text-8xl font-display font-bold tracking-tight leading-none text-white">
              TOPHER'S <br/> 
              <span class="text-cyber-cyan neon-text-cyan">GAMES</span>
            </h2>
            <p class="text-gray-500 font-mono text-sm max-w-md uppercase tracking-widest">
              UNBLOCKED ACCESS // SECTOR 4 READY
            </p>
          </div>
          <div class="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden border border-cyber-border">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover">
          </div>
        </section>
      ` : ''}
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${games.map(game => `
          <div class="bg-cyber-dark border border-cyber-border rounded-xl overflow-hidden group hover:neon-border transition-all">
            <div class="aspect-video relative">
              <img src="${game.thumbnail}" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity">
              <button onclick="toggleFav('${game.id}')" class="absolute top-2 right-2 p-2 rounded-full bg-black/40 ${favorites.includes(game.id) ? 'text-cyber-pink' : 'text-white/40'}">
                ♥
              </button>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg">${game.title}</h3>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2">${game.description}</p>
              <button onclick="openModal('${game.id}', 'game')" class="w-full mt-4 py-2 border border-white/10 rounded font-mono text-[10px] tracking-widest hover:bg-cyber-cyan hover:text-black transition-all">
                DEPLOY_MODULE
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSoundboard() {
  return `
    <div class="space-y-8">
      <h2 class="text-4xl font-display font-bold neon-text-pink">SOUNDBOARD</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        ${data.sounds.map(sound => `
          <button onclick="playSound('${sound.name}')" class="h-24 bg-cyber-dark border border-cyber-border rounded-xl flex flex-col items-center justify-center gap-2 hover:neon-border transition-all">
            <span class="text-2xl">${sound.emoji}</span>
            <span class="text-[10px] font-mono text-gray-500">${sound.name}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderMovieGrid() {
  return `
    <div class="space-y-8">
      <h2 class="text-4xl font-display font-bold neon-text-cyan">CINEMA</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${data.movies.map(movie => `
          <div onclick="openModal('${movie.id}', 'movie')" class="cursor-pointer group">
            <div class="aspect-video rounded-xl overflow-hidden border border-cyber-border">
              <img src="${movie.thumbnail}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all">
            </div>
            <h3 class="mt-4 font-bold text-xl">${movie.title}</h3>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderChat() {
  return `
    <div class="bg-cyber-dark border border-cyber-border rounded-xl h-[60vh] flex flex-col">
      <div class="p-4 border-b border-cyber-border font-mono text-xs text-gray-500">CHAT_TERMINAL_V1.0</div>
      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2">
        <div class="text-cyber-cyan">SYSTEM // CONNECTION established...</div>
        <div class="text-gray-500">[14:02:11] Guest_32: Ready for 2048?</div>
      </div>
      <div class="p-4 border-t border-cyber-border flex gap-2">
        <input type="text" placeholder="WRITE_MESSAGE..." class="flex-1 bg-black border border-cyber-border rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-cyber-cyan">
        <button class="px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan/20 rounded text-cyber-cyan font-bold text-xs uppercase hover:bg-cyber-cyan hover:text-black transition-all">SEND</button>
      </div>
    </div>
  `;
}

function renderCalculator() {
  return `
    <div class="flex flex-col items-center py-12">
      <h2 class="text-5xl font-display font-bold neon-text-cyan mb-12 uppercase tracking-tighter">CALCULATOR</h2>
      <div class="w-96 bg-cyber-dark border border-cyber-border rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div id="calc-display" class="bg-black p-8 rounded-2xl text-5xl font-display font-bold text-right mb-8 text-cyber-cyan border border-white/5 break-all shadow-inner">0</div>
        <div class="grid grid-cols-4 gap-4">
          ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'].map(btn => `
            <button onclick="handleCalc('${btn}')" class="h-16 rounded-xl bg-white/5 border border-white/5 text-xl text-white font-bold hover:bg-cyber-cyan hover:text-black hover:scale-105 transition-all active:scale-95 shadow-lg">
              ${btn}
            </button>
          `).join('')}
        </div>
      </div>
      <p class="mt-8 font-mono text-[9px] text-gray-700 tracking-[0.3em] uppercase">TOPHER_CALC_OS // V.2.1 // ENCRYPTED_LINK</p>
    </div>
  `;
}

function renderDashboard() {
  return `
    <div class="space-y-8">
      <h2 class="text-4xl font-display font-bold">SYSTEM <span class="text-cyber-cyan">DASHBOARD</span></h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-cyber-dark border border-cyber-border rounded-xl">
          <div class="text-[10px] text-gray-500 uppercase">Status</div>
          <div class="text-xl font-bold text-green-500">ONLINE</div>
        </div>
        <div class="p-4 bg-cyber-dark border border-cyber-border rounded-xl">
          <div class="text-[10px] text-gray-600 uppercase">Node</div>
          <div class="text-xl font-bold">SECTOR_4</div>
        </div>
        <div class="p-4 bg-cyber-dark border border-cyber-border rounded-xl">
          <div class="text-[10px] text-gray-600 uppercase">Uptime</div>
          <div class="text-xl font-bold">99.9%</div>
        </div>
        <div class="p-4 bg-cyber-dark border border-cyber-border rounded-xl">
          <div class="text-[10px] text-gray-600 uppercase">Alerts</div>
          <div class="text-xl font-bold">0</div>
        </div>
      </div>
    </div>
  `;
}

// Actions
window.setView = (view) => {
  activeView = view;
  render();
};

window.toggleFav = (id) => {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem('topher-favorites', JSON.stringify(favorites));
  render();
};

window.playSound = (name) => {
  const msg = new SpeechSynthesisUtterance(name);
  window.speechSynthesis.speak(msg);
};

let currentCalc = '0';
window.handleCalc = (btn) => {
  const display = document.getElementById('calc-display');
  if (btn === 'C') {
    currentCalc = '0';
  } else if (btn === '=') {
    if (currentCalc === '2782014') {
      setView('dashboard');
      return;
    }
    try { 
      currentCalc = eval(currentCalc).toString(); 
    } catch { 
      currentCalc = 'ERROR'; 
    }
  } else {
    if (currentCalc === '0') currentCalc = btn;
    else currentCalc += btn;
  }
  if (display) display.innerText = currentCalc;
};

window.openModal = (id, type) => {
  const item = type === 'game' ? data.games.find(g => g.id === id) : data.movies.find(m => m.id === id);
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div class="w-full h-full max-w-6xl flex flex-col bg-cyber-dark border border-cyber-cyan/30 rounded-xl overflow-hidden">
        <div class="p-4 border-b border-cyber-border flex justify-between items-center">
          <h3 class="font-bold text-cyber-cyan uppercase">${item.title}</h3>
          <button onclick="closeModal()" class="text-gray-500 hover:text-white">CLOSE [X]</button>
        </div>
        <iframe src="${item.iframeUrl}" class="flex-1 border-none bg-black"></iframe>
      </div>
    </div>
  `;
};

window.closeModal = () => {
  document.getElementById('modal-container').innerHTML = '';
};

init();

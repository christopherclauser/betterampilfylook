
import { auth, db } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

let activeView = 'games';
let favorites = JSON.parse(localStorage.getItem('topher-favorites') || '[]');
let data = null;
let searchQuery = '';
let currentUser = null;
let authReady = false;

// Global listener for announcements
let announcementUnsubscribe = null;

async function init() {
  // Listen for auth changes
  onAuthStateChanged(auth, async (user) => {
    authReady = true;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      currentUser = userDoc.exists() ? { ...userDoc.data(), uid: user.uid } : null;
      
      // Start listeners
      setupAnnouncements();
      setupPings();
    } else {
      currentUser = null;
      if (announcementUnsubscribe) announcementUnsubscribe();
    }
    render();
  });

  try {
    const response = await fetch('./src/data.json');
    if (!response.ok) throw new Error('DATA_LOAD_FAILURE');
    data = await response.json();
    render();
  } catch (error) {
    console.error('Core system error:', error);
    // ... error handling remains same
  }
}

function setupAnnouncements() {
  const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'), limit(1));
  announcementUnsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const msg = change.doc.data();
        // Don't show toast for very old messages (older than 1 minute)
        const ageInMs = Date.now() - (msg.timestamp?.toMillis() || Date.now());
        if (ageInMs < 60000) {
          showAnnouncementToast(msg);
        }
      }
    });
  });
}

function showAnnouncementToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-20 right-6 z-[200] max-w-sm glass rounded-xl p-4 border border-cyber-cyan/50 animate-bounce shadow-2xl';
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-cyber-cyan flex items-center justify-center text-black text-xl">📢</div>
      <div>
        <div class="text-[10px] font-mono text-cyber-cyan uppercase tracking-widest">MESSAGE_RECV // ${msg.author.toUpperCase()}</div>
        <div class="font-bold text-sm text-white">${msg.message}</div>
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 8000);
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
  
  if (!authReady) {
    app.innerHTML = '<div class="flex items-center justify-center min-screen pt-48 font-mono animate-pulse">INIT_AUTH...</div>';
    return;
  }

  if (!currentUser) {
    app.innerHTML = renderAuthView();
    return;
  }

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
        <div class="flex items-center gap-4 pl-4 border-l border-cyber-border">
          <span class="text-[10px] font-mono text-gray-500 uppercase">${currentUser.username}</span>
          <button onclick="logout()" class="text-[10px] font-mono text-cyber-pink hover:underline uppercase">Logout</button>
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

function renderAuthView() {
  return `
    <div class="min-h-screen flex items-center justify-center p-6 bg-cyber-black relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan rounded-full blur-[150px]"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-pink rounded-full blur-[150px]"></div>
      </div>

      <div class="w-full max-w-md glass border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 bg-cyber-cyan rounded-xl flex items-center justify-center font-bold text-black text-4xl mb-4 italic">T</div>
          <h1 class="text-3xl font-display font-bold tracking-tighter text-white uppercase italic">
            Topher's <span class="text-cyber-cyan">Games</span>
          </h1>
          <p class="text-[10px] font-mono text-gray-500 mt-2 tracking-[0.4em] uppercase">Security Protocol v4.0</p>
        </div>

        <div class="space-y-6" id="auth-form">
          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-mono text-gray-500 uppercase mb-2">Username</label>
              <input type="text" id="auth-username" class="w-full bg-black border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:border-cyber-cyan outline-none transition-all" placeholder="USER_ID">
            </div>
            <div>
              <label class="block text-[10px] font-mono text-gray-500 uppercase mb-2">Password</label>
              <input type="password" id="auth-password" class="w-full bg-black border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:border-cyber-cyan outline-none transition-all" placeholder="••••••••">
            </div>
          </div>
          
          <div id="auth-error" class="text-cyber-pink text-[10px] font-mono text-center hidden uppercase"></div>

          <button onclick="handleAuthSubmit()" class="w-full py-4 bg-cyber-cyan text-black font-bold rounded-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
            ACCESS_SYSTEM
          </button>

          <p class="text-center text-[10px] font-mono text-gray-500 uppercase mt-8">
            Dont have an account? <button onclick="toggleAuthMode()" class="text-cyber-cyan hover:underline" id="auth-toggle-label">Create Registry</button>
          </p>
        </div>
      </div>
    </div>
  `;
}

let isLoginPage = true;
window.toggleAuthMode = () => {
  isLoginPage = !isLoginPage;
  const label = document.getElementById('auth-toggle-label');
  if (label) label.innerText = isLoginPage ? 'Create Registry' : 'Access Grid';
  render();
};

window.handleAuthSubmit = async () => {
  const username = document.getElementById('auth-username')?.value;
  const password = document.getElementById('auth-password')?.value;
  const errorEl = document.getElementById('auth-error');

  if (!username || !password) {
    if (errorEl) {
      errorEl.innerText = 'FIELDS_REQUIRED';
      errorEl.classList.remove('hidden');
    }
    return;
  }

  try {
    if (isLoginPage) {
      // Login - first get the UID for this username
      const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
      if (!usernameDoc.exists()) throw new Error('USER_NOT_FOUND');
      
      const email = `${username.toLowerCase()}@tophergames.com`;
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Register
      if (username.length < 3) throw new Error('USERNAME_TOO_SHORT');
      
      // Check uniqueness
      const usernameLower = username.toLowerCase();
      const usernameRef = doc(db, 'usernames', usernameLower);
      const usernameSnap = await getDoc(usernameRef);
      
      if (usernameSnap.exists()) throw new Error('USERNAME_TAKEN');

      const email = `${usernameLower}@tophergames.com`;
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user documents
      await setDoc(doc(db, 'users', userCred.user.uid), {
        username: username,
        createdAt: serverTimestamp(),
        isAdmin: false
      });
      
      await setDoc(usernameRef, { uid: userCred.user.uid });
    }
  } catch (error) {
    console.error('Auth Error:', error);
    if (errorEl) {
      errorEl.innerText = error.code || error.message;
      errorEl.classList.remove('hidden');
    }
  }
};

window.logout = async () => {
  await signOut(auth);
};

window.announceMessage = async () => {
  const input = document.getElementById('dash-announce-input');
  if (!input || !input.value.trim()) return;

  try {
    await addDoc(collection(db, 'announcements'), {
      message: input.value.trim(),
      author: currentUser.username,
      timestamp: serverTimestamp()
    });
    input.value = '';
    alert('ANNOUNCEMENT_DEPLOYED');
  } catch (error) {
    alert('ERR: ACCESS_DENIED_TO_COMMS');
  }
};

// Shared Ripple Feature
window.addEventListener('mousedown', async (e) => {
  if (!currentUser || activeView === 'games' || activeView === 'movies') return; // Don't spam in games/movies
  
  if (e.target.closest('button') || e.target.closest('input')) return;

  try {
    await addDoc(collection(db, 'pings'), {
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
      author: currentUser.username,
      timestamp: serverTimestamp()
    });
  } catch (e) {}
});

function setupPings() {
  const q = query(collection(db, 'pings'), orderBy('timestamp', 'desc'), limit(5));
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const ping = change.doc.data();
        const age = Date.now() - (ping.timestamp?.toMillis() || Date.now());
        if (age < 5000) showRipple(ping);
      }
    });
  });
}

function showRipple(ping) {
  const colors = ['#00F3FF', '#FF007F', '#BC13FE', '#FFFB00'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const ripple = document.createElement('div');
  ripple.className = 'fixed pointer-events-none z-[300] w-12 h-12 -ml-6 -mt-6 border-4 rounded-full animate-ping';
  ripple.style.borderColor = color;
  ripple.style.left = ping.x + '%';
  ripple.style.top = ping.y + '%';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);
}

function renderActiveView() {
  if (!data) return '<div class="text-center py-24 font-mono text-gray-500">LOADING_ASSETS...</div>';

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
    <div class="flex flex-col items-center py-12 animate-in zoom-in duration-500">
      <h2 class="text-7xl font-display font-bold neon-text-cyan mb-12 uppercase tracking-tighter italic">CALC_OS</h2>
      <div class="w-[480px] bg-cyber-dark border-4 border-cyber-border rounded-[3.5rem] p-12 shadow-[0_0_100px_rgba(0,243,255,0.1)]">
        <div id="calc-display" class="bg-black p-10 rounded-3xl text-6xl font-display font-bold text-right mb-10 text-cyber-cyan border-2 border-white/5 break-all shadow-inner font-mono">0</div>
        <div class="grid grid-cols-4 gap-6">
          ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'].map(btn => `
            <button onclick="handleCalc('${btn}')" class="h-24 rounded-2xl bg-white/5 border border-white/10 text-3xl text-white font-bold hover:bg-cyber-cyan hover:text-black hover:scale-105 transition-all active:scale-95 shadow-[0_4px_0_rgba(255,255,255,0.05)]">
              ${btn}
            </button>
          `).join('')}
        </div>
      </div>
      <p class="mt-12 font-mono text-xs text-gray-700 tracking-[0.5em] uppercase">ACCESS_KEY_REQUIRED_FOR_ROOT_SHELL</p>
    </div>
  `;
}

function renderDashboard() {
  return `
    <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex items-center justify-between">
        <h2 class="text-5xl font-display font-bold tracking-tighter">ADMIN <span class="text-cyber-cyan neon-text-cyan">CONTROL_GRID</span></h2>
        <div class="px-4 py-1 rounded-full bg-cyber-pink/20 border border-cyber-pink/30 text-cyber-pink text-[10px] font-mono uppercase tracking-widest animate-pulse">SECRET_ACCESS_ENABLED</div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Live Comms -->
        <div class="lg:col-span-2 glass p-8 rounded-3xl border border-cyber-cyan/20">
          <h3 class="font-display font-bold text-2xl mb-6 text-white italic uppercase tracking-tighter flex items-center gap-3">
            <span class="w-2 h-8 bg-cyber-cyan"></span>
            Broadcast Announcement
          </h3>
          <p class="text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest">Transmit a real-time message to every user currently on the grid.</p>
          
          <div class="space-y-4">
            <textarea id="dash-announce-input" class="w-full bg-black border border-white/10 rounded-2xl p-6 font-mono text-sm focus:border-cyber-cyan outline-none transition-all h-32 resize-none" placeholder="ENCRYPTED_MESSAGE_HERE..."></textarea>
            <button onclick="announceMessage()" class="w-full py-4 bg-cyber-cyan text-black font-bold rounded-xl uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition-all">
              BROADCAST_NOW_//_DEPLOY
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="space-y-8">
          <div class="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <div class="text-[10px] font-mono text-gray-600 uppercase tracking-widest">System_Uptime</div>
            <div class="text-4xl font-display font-bold text-white">99.999%</div>
            <div class="h-1 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-cyber-cyan w-4/5 animate-pulse"></div>
            </div>
          </div>
          
          <div class="glass p-6 rounded-3xl border border-white/5 space-y-4">
            <div class="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Grid_Users</div>
            <div class="text-4xl font-display font-bold text-cyber-pink">ACTTIVE</div>
            <p class="text-[10px] font-mono text-gray-500 uppercase">Sector 4 population tracking active...</p>
          </div>
        </div>
      </div>

      <!-- Log Trace -->
      <div class="bg-black/50 border border-white/5 rounded-2xl p-6 font-mono text-[10px] text-gray-600 space-y-1">
        <div>[LOG] SYSTEM_INITIALIZED...</div>
        <div>[LOG] SECURITY_OVERRIDE_DETECTED // KEY: 2782014</div>
        <div class="text-cyber-cyan">[LOG] ADMIN_USER: ${currentUser.username.toUpperCase()}</div>
        <div class="animate-pulse">_</div>
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

// Keyboard listener for calculator
window.addEventListener('keydown', (e) => {
  if (activeView !== 'calculator' || !currentUser) return;
  if (e.key >= '0' && e.key <= '9' || ['+', '-', '*', '/', '.'].includes(e.key)) {
    handleCalc(e.key);
  } else if (e.key === 'Enter') {
    handleCalc('=');
  } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
    handleCalc('C');
  } else if (e.key === 'Backspace') {
    currentCalc = currentCalc.length > 1 ? currentCalc.slice(0, -1) : '0';
    const display = document.getElementById('calc-display');
    if (display) display.innerText = currentCalc;
  }
});

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

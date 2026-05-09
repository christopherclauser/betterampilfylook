import { motion } from 'motion/react';
import { 
  Users, 
  Activity, 
  Database, 
  ShieldAlert, 
  Wifi, 
  Cpu, 
  Globe,
  Radio
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'ACTIVE_PLAYERS', value: '1,284', icon: <Users size={16} />, color: 'text-cyber-cyan' },
    { label: 'SERVER_LOAD', value: '42%', icon: <Cpu size={16} />, color: 'text-yellow-500' },
    { label: 'DATA_THROUGHPUT', value: '8.4 GB/s', icon: <Activity size={16} />, color: 'text-green-500' },
    { label: 'GLOBAL_NODES', value: '14', icon: <Globe size={16} />, color: 'text-blue-500' },
  ];

  const activities = [
    { id: 1, user: 'Axel_V', action: 'Playing SLOPE', time: 'LIVE', icon: <Wifi size={12} className="text-green-500" /> },
    { id: 2, user: 'Kat_2392', action: 'Favorite added: 2048', time: '2m ago', icon: <Database size={12} className="text-blue-500" /> },
    { id: 3, user: 'Sys_9913', action: 'Chat initialized', time: '5m ago', icon: <Radio size={12} className="text-cyber-pink" /> },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-display font-bold">OWNER <span className="text-cyber-cyan">DASHBOARD</span></h2>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">ROOT_ACCESS // MONITORING_STATION</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/20">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
          <span className="text-[10px] font-mono font-bold text-cyber-cyan uppercase">3 SYSTEMS ONLINE</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-cyber-dark border border-cyber-border rounded-xl flex flex-col gap-4 hover:neon-border transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 tracking-tighter uppercase">{stat.label}</span>
              <div className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`}>{stat.icon}</div>
            </div>
            <div className="text-3xl font-display font-bold tracking-tight">{stat.value}</div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '60%' }}
                 transition={{ delay: 0.5, duration: 2 }}
                 className={`h-full ${stat.color} bg-opacity-70`} 
               />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 bg-cyber-dark border border-cyber-border rounded-xl flex-1">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-display font-bold text-sm tracking-widest uppercase">LIVE_MONITORING</h3>
               <span className="text-[9px] font-mono text-gray-600">SECURE_FEED_01</span>
             </div>
             
             <div className="space-y-4">
               {activities.map((act) => (
                 <div key={act.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-lg hover:border-cyber-cyan/30 transition-all cursor-crosshair">
                   <div className="flex items-center gap-4">
                     <div className="p-2 rounded bg-white/5">{act.icon}</div>
                     <div>
                       <div className="text-sm font-mono font-bold text-gray-300">{act.user}</div>
                       <div className="text-[10px] text-gray-600 uppercase italic">{act.action}</div>
                     </div>
                   </div>
                   <div className="text-[10px] font-mono text-cyber-cyan">{act.time}</div>
                 </div>
               ))}
             </div>
          </div>

          <div className="p-6 glass rounded-xl border-dashed border-cyber-purple/30 relative overflow-hidden group">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-cyber-pink/20 rounded-full text-cyber-pink">
                <ShieldAlert size={24} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold uppercase tracking-widest text-cyber-pink">SYSTEM_ARCHIVE</div>
                <div className="text-xs text-gray-400 mt-1">Reviewing mission critical data logs from sector 7.</div>
              </div>
              <button className="px-4 py-2 bg-cyber-pink/10 hover:bg-cyber-pink hover:text-black text-cyber-pink text-[10px] font-bold tracking-widest rounded-md transition-all uppercase border border-cyber-pink/20">
                ACCESS_LOGS
              </button>
            </div>
            {/* Visual background noise */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <div className="grid grid-cols-12 gap-1 p-2">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="h-4 bg-white" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="flex flex-col gap-8">
          <div className="p-6 bg-cyber-dark border border-cyber-border rounded-xl">
            <h3 className="font-display font-bold text-sm tracking-widest uppercase mb-4">GRID_BROADCAST</h3>
            <textarea 
              placeholder="GLOBAL_MESSAGE..."
              className="w-full h-32 bg-black/40 border border-cyber-border rounded-lg p-4 text-xs font-mono focus:outline-none focus:border-cyber-cyan/50 resize-none transition-all"
            />
            <button className="w-full mt-4 py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan hover:text-black text-cyber-cyan text-[10px] font-bold tracking-widest uppercase rounded-lg border border-cyber-cyan/20 transition-all flex items-center justify-center gap-2">
              <Radio size={14} />
              EXECUTE BROADCAST
            </button>
          </div>

          <div className="p-6 bg-cyber-dark border border-cyber-border rounded-xl">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-display font-bold text-sm tracking-widest uppercase">GRID_STATISTICS</h3>
               <Database size={14} className="text-gray-700" />
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                  <span className="text-gray-500">Total Transmissions</span>
                  <span className="text-cyber-cyan">34.2K</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                  <span className="text-gray-500">Sector Status</span>
                  <span className="text-green-500">STABLE</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
                  <span className="text-gray-500">Uptime</span>
                  <span className="text-gray-300">99.98%</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

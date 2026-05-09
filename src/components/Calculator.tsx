import { useState } from 'react';
import { motion } from 'motion/react';
import { Hash, Delete, CornerDownLeft } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleNumber = (n: string) => {
    setDisplay(prev => prev === '0' ? n : prev + n);
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullExpr = expression + display;
      // Note: In a real app we'd use a proper math parser, but for a simple demo:
      const result = eval(fullExpr.replace(/x/g, '*'));
      setDisplay(String(result));
      setExpression('');
    } catch (e) {
      setDisplay('ERROR');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const buttons = [
    { label: 'AC', action: clear, color: 'text-cyber-pink' },
    { label: '/', action: () => handleOperator('/'), color: 'text-cyber-cyan' },
    { label: 'x', action: () => handleOperator('x'), color: 'text-cyber-cyan' },
    { label: 'DEL', action: () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0'), color: 'text-gray-500' },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '-', action: () => handleOperator('-'), color: 'text-cyber-cyan' },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '+', action: () => handleOperator('+'), color: 'text-cyber-cyan' },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '=', action: calculate, color: 'bg-cyber-cyan text-black', large: true },
    { label: '0', action: () => handleNumber('0'), large: true },
    { label: '.', action: () => handleNumber('.') },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex flex-col gap-2 mb-12 text-center">
        <h2 className="text-4xl font-display font-bold neon-text-cyan flex items-center justify-center gap-4">
          <Hash size={32} />
          CALCULATOR
        </h2>
        <p className="text-gray-500 font-mono text-xs italic tracking-widest uppercase">MATH_ENGINE // ACTIVE</p>
      </div>

      <div className="w-full max-w-[360px] bg-cyber-dark border border-cyber-border rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col gap-6">
        {/* Display */}
        <div className="bg-black/60 border border-cyber-border rounded-2xl p-6 flex flex-col items-end gap-1">
          <span className="text-xs font-mono text-gray-600 h-4 uppercase tracking-tighter">{expression}</span>
          <span className="text-4xl font-display font-bold tracking-tight overflow-hidden text-white neon-text-cyan animate-pulse-subtle">{display}</span>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((btn, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={btn.action}
              className={`
                h-14 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all
                ${btn.large ? 'col-span-2' : ''}
                ${btn.color || 'bg-white/5 border border-white/5 hover:border-white/10 text-gray-300'}
                ${btn.label === '=' ? 'hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]' : ''}
              `}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
        
        <div className="mt-2 text-[8px] font-mono text-center text-gray-700 tracking-widest uppercase">
          TOPHER_CALC_OS // SYSTEM_READY
        </div>
      </div>
    </div>
  );
}

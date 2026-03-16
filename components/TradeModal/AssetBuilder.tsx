"use client";
import { useState } from 'react';

interface AssetBuilderProps {
  teamName: string;
  onClose: () => void;
  onInject: (name: string, pos: string, val: number) => void;
  getValueLabel: (val: number) => string;
}

export default function AssetBuilder({ teamName, onClose, onInject, getValueLabel }: AssetBuilderProps) {
  const [name, setName] = useState("");
  const [pos, setPos] = useState("WR");
  const [val, setVal] = useState(600);

  return (
    <div className="absolute inset-0 z-[110] bg-white/95 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-200 p-6 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8 my-auto shrink-0">
        <div className="text-center shrink-0">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">Asset Injection</p>
          <h3 className="font-black uppercase text-2xl italic text-slate-900">Add to {teamName}</h3>
        </div>
        <div className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player Name..." className="w-full border-2 border-slate-100 rounded-2xl p-5 font-bold outline-none focus:border-blue-500 text-lg shadow-sm" />
          <select value={pos} onChange={(e) => setPos(e.target.value)} className="w-full border-2 border-slate-100 rounded-2xl p-5 font-black outline-none bg-slate-50 uppercase">
            {["QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DL", "LB", "CB", "S"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="flex flex-col"><label className="text-xs font-black uppercase text-slate-400">Assessment</label><span className="text-[10px] font-black text-blue-600 uppercase italic">{getValueLabel(val)}</span></div>
            <span className="text-blue-600 font-black text-3xl italic">{val} PTS</span>
          </div>
          <input type="range" min="5" max="3000" step="10" value={val} onChange={(e) => setVal(parseInt(e.target.value))} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <button onClick={onClose} className="order-2 md:order-1 flex-1 font-black uppercase text-xs py-5 text-slate-400 hover:text-slate-600">Cancel</button>
          <button onClick={() => onInject(name, pos, val)} className="order-1 md:order-2 flex-[2] bg-blue-600 text-white font-black uppercase text-xs py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">Inject Asset</button>
        </div>
      </div>
    </div>
  );
}
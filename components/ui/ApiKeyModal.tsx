'use client';

import React, { useState } from 'react';
import { useAuraCare } from '@/lib/context';
import { Key, CheckCircle, ShieldAlert, X, Cpu } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { customApiKey, setCustomApiKey } = useAuraCare();
  const [inputKey, setInputKey] = useState(customApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setInputKey('');
    setCustomApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Engine Configuration</h3>
              <p className="text-xs text-slate-500">OpenAI GPT-4o / Clinical Heuristics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 leading-relaxed">
            <div className="flex items-start gap-2">
              <Cpu className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Zero-Config Live Demo Ready:</strong> AuraCare operates out-of-the-box with our high-fidelity
                clinical heuristics engine (NEWS2 + ESI guidelines). If you have an OpenAI API Key (<code>sk-...</code>), you can paste it below to enable live GPT-4o-mini inference!
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              OpenAI API Key (Optional)
            </label>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full text-xs font-mono px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Stored securely in local browser session only. Never saved to public servers.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {customApiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:underline"
              >
                Clear Saved Key
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Configuration</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

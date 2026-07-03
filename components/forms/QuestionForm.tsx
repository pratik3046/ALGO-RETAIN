// components/forms/QuestionForm.tsx
"use client"; // Required because this component uses state and event listeners

import { useState } from "react";
import { CheckCircle2, Bot, Users, MonitorPlay, CircleDashed, Loader2 } from "lucide-react";

export default function QuestionForm() {
  // Form State
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [questionNumber, setQuestionNumber] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [status, setStatus] = useState("NOT_ATTEMPTED");
  const [notes, setNotes] = useState("");
  const [patternInput, setPatternInput] = useState("");
  const [patterns, setPatterns] = useState<string[]>([]);
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Status Options configuration matching your Figma design
  const statusOptions = [
    { id: "MASTERED", label: "Completed on my own", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
    { id: "PARTIAL_AI", label: "Partial idea + AI help", icon: Bot, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
    { id: "EXTERNAL_HELP", label: "No idea + External help", icon: Users, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
    { id: "YOUTUBE", label: "YouTube Solution", icon: MonitorPlay, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/30" },
    { id: "NOT_ATTEMPTED", label: "Not Attempted", icon: CircleDashed, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-600" },
  ];

  // Handle adding a pattern tag
  const addPattern = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && patternInput.trim() !== "") {
      e.preventDefault();
      if (!patterns.includes(patternInput.trim())) {
        setPatterns([...patterns, patternInput.trim()]);
      }
      setPatternInput("");
    }
  };

  const removePattern = (tagToRemove: string) => {
    setPatterns(patterns.filter(tag => tag !== tagToRemove));
  };

  // The main submit handler that talks to our API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          platform,
          questionNumber,
          difficulty,
          status,
          notes,
          patternNames: patterns,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Question logged successfully!" });
        // Optional: Reset form fields here
        setTitle("");
        setQuestionNumber("");
        setNotes("");
        setPatterns([]);
        setStatus("NOT_ATTEMPTED");
      } else {
        setMessage({ type: "error", text: data.error || "Something went wrong." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to connect to the server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8 bg-[#0F172A] p-8 rounded-xl border border-slate-800 shadow-xl">
      {/* 1. Header Information */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1">Question Title *</label>
          <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Two Sum" className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="w-48">
          <label className="block text-xs text-slate-400 mb-1">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500">
            <option value="LeetCode">LeetCode</option>
            <option value="HackerRank">HackerRank</option>
            <option value="Codeforces">Codeforces</option>
          </select>
        </div>
        <div className="w-32">
          <label className="block text-xs text-slate-400 mb-1">Number</label>
          <input type="text" value={questionNumber} onChange={(e) => setQuestionNumber(e.target.value)} placeholder="# 1" className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      {/* 2. Custom Attempt Status Selector */}
      <div>
        <label className="block text-xs text-slate-400 mb-3 uppercase tracking-wider">Attempt Status</label>
        <div className="flex flex-col gap-2">
          {statusOptions.map((opt) => {
            const isSelected = status === opt.id;
            const Icon = opt.icon;
            return (
              <div 
                key={opt.id} 
                onClick={() => setStatus(opt.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? `${opt.bg} ${opt.border}` : 'border-slate-800 bg-[#0B1120] hover:border-slate-700'}`}
              >
                <Icon size={18} className={isSelected ? opt.color : 'text-slate-500'} />
                <span className={`text-sm font-medium ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Pattern Tags (Press Enter to add) */}
      <div>
        <label className="block text-xs text-slate-400 mb-2">Pattern Tags (Press Enter to add)</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {patterns.map((tag) => (
            <span key={tag} className="flex items-center gap-1 bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-700">
              {tag}
              <button type="button" onClick={() => removePattern(tag)} className="text-slate-500 hover:text-white">&times;</button>
            </span>
          ))}
        </div>
        <input type="text" value={patternInput} onChange={(e) => setPatternInput(e.target.value)} onKeyDown={addPattern} placeholder="Type pattern e.g., Sliding Window..." className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
      </div>

      {/* 4. Notes Area */}
      <div>
        <label className="block text-xs text-slate-400 mb-1">Notes / Logic</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Write down your approach or what you learned..." className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none" />
      </div>

      {/* Submit Button & Feedback */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div>
          {message && (
            <span className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {message.text}
            </span>
          )}
        </div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Saving..." : "Save Attempt"}
        </button>
      </div>
    </form>
  );
}

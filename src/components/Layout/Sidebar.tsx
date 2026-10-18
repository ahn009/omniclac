import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  X,
  Calculator,
  DollarSign,
  Clock,
  Timer,
  Scale,
  Zap,
  Target,
  Home as HomeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "Time" | "Finance" | "Health" | "Math" | "General";

type Tool = {
  id: string;
  name: string;
  description?: string;
  category: Category;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
};

const CATEGORIES: Category[] = ["General", "Math", "Finance", "Health", "Time"];

const TOOLS: Tool[] = [
  {
    id: "home",
    name: "Home",
    description: "Overview",
    category: "General",
    icon: HomeIcon,
    path: "/",
  },

  { id: "scientific-calculator", name: "Scientific Calculator", description: "Advanced calculator", category: "Math", icon: Calculator, path: "/scientific-calculator" },
  { id: "standard-calculator", name: "Standard Calculator", description: "Basic arithmetic", category: "Math", icon: Calculator, path: "/standard-calculator" },
  { id: "unit-converter", name: "Unit Converter", description: "Convert units", category: "Math", icon: Zap, path: "/unit-converter" },

  { id: "tip-calculator", name: "Tip Calculator", description: "Tips and split bills", category: "Finance", icon: Target, path: "/tip-calculator" },
  { id: "loan-calculator", name: "Loan Calculator", description: "Loan payments", category: "Finance", icon: DollarSign, path: "/loan-calculator" },
  { id: "mortgage-calculator", name: "Mortgage Calculator", description: "Mortgage estimate", category: "Finance", icon: DollarSign, path: "/mortgage-calculator" },

  { id: "bmi-calculator", name: "BMI Calculator", description: "Body Mass Index", category: "Health", icon: Scale, path: "/bmi-calculator" },

  { id: "pomodoro-timer", name: "Pomodoro Timer", description: "Work/break timer", category: "Time", icon: Timer, path: "/pomodoro-timer" },
  { id: "stopwatch", name: "Stopwatch", description: "Laps + timing", category: "Time", icon: Clock, path: "/stopwatch" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((t) =>
      `${t.name} ${t.description ?? ""} ${t.category}`.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toolsByCategory = useMemo(() => {
    const map: Record<Category, Tool[]> = {
      General: [],
      Math: [],
      Finance: [],
      Health: [],
      Time: [],
    };
    for (const t of filteredTools) map[t.category].push(t);
    return map;
  }, [filteredTools]);

  return (
    <>
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-80",
          "glass border-r border-white/40 dark:border-white/10",
          "transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Tools navigation"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-elevation-2">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  OmniCalc
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Calculator Toolbox
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Close menu"
              type="button"
            >
              <X className="w-5 h-5 text-slate-900 dark:text-slate-100" />
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              aria-label="Search tools"
              className={cn(
                "w-full pl-10 pr-4 py-2.5 text-sm",
                "bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl",
                "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
                "shadow-inset focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              )}
            />
          </div>

          <nav className="flex-1 overflow-y-auto space-y-6 scrollbar-thin pr-1">
            {CATEGORIES.map((category) =>
              toolsByCategory[category].length ? (
                <div key={category}>
                  <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-4">
                    {category}
                  </h2>

                  <div className="space-y-1">
                    {toolsByCategory[category].map((tool) => (
                      <NavLink
                        key={tool.id}
                        to={tool.path}
                        onClick={() => {
                          onClose();
                          setSearchQuery("");
                        }}
                        className={({ isActive }) =>
                          cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                            "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset",
                            isActive
                              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-elevation-2"
                              : "text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:shadow-elevation-1"
                          )
                        }
                      >
                        <tool.icon className="w-5 h-5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{tool.name}</div>
                          {tool.description && (
                            <div className="text-xs opacity-70 truncate">
                              {tool.description}
                            </div>
                          )}
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : null
            )}
            {filteredTools.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 px-4 py-8 text-center">
                No tools match “{searchQuery}”.
              </p>
            )}
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-300">OmniCalc v1.0.0</p>
            <p className="mt-1">All calculations are estimates</p>
          </div>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  DollarSign,
  Timer,
  ArrowRight,
  Compass,
  Tablet,
  Box,
} from "lucide-react";

// Tools
import { BMICalculator } from "./components/tools/BMICalculator";
import { ScientificCalculator } from "./components/tools/ScientificCalculator";
import { StandardCalculator } from "./components/tools/StandardCalculator";
import { TipCalculator } from "./components/tools/Tip-Calculator";
import { LoanCalculator } from "./components/tools/LoanCalculator";
import { MortgageCalculator } from "./components/tools/MortgageCalculator";
import { PomodoroTimer } from "./components/tools/PomodroTimer";
import { Stopwatch } from "./components/tools/Stopwatch";
import { UnitConverter } from "./components/tools/Unit-Convertor";

const ToolRoute: React.FC<{ children: React.ReactNode; maxWidth?: string }> = ({
  children,
  maxWidth = "max-w-4xl",
}) => <div className={`${maxWidth} mx-auto w-full`}>{children}</div>;

const FEATURED_TOOLS = [
  {
    path: "/scientific-calculator",
    name: "Scientific Calculator",
    description: "Trig, logs, powers & roots with a tactile 3D keypad.",
    icon: Calculator,
    accent: "from-indigo-500 to-violet-600",
  },
  {
    path: "/loan-calculator",
    name: "Loan Calculator",
    description: "Monthly payments, total interest & AI analysis.",
    icon: DollarSign,
    accent: "from-emerald-500 to-teal-600",
  },
  {
    path: "/pomodoro-timer",
    name: "Pomodoro Timer",
    description: "Focus sessions with auto-advancing breaks.",
    icon: Timer,
    accent: "from-orange-500 to-rose-600",
  },
];

const Home: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Hero */}
      <div className="panel-3d relative overflow-hidden animate-enter">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(600px 300px at 15% 10%, rgba(99,102,241,0.16), transparent 60%), radial-gradient(500px 260px at 85% 90%, rgba(249,115,22,0.12), transparent 60%)",
          }}
        />
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Toolbox</Badge>
              <Badge variant="neutral">9 tools</Badge>
              <Badge variant="success">3D interface</Badge>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Meet <span className="gradient-text">OmniCalc</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl">
              Your all-in-one calculator dashboard — finance, math, health and
              time tools with a tactile 3D interface. Pick a tool and start calculating.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/scientific-calculator">
                <Button size="lg">
                  Open Scientific Calculator <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/loan-calculator">
                <Button size="lg" variant="secondary">
                  Try Loan Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured tools */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_TOOLS.map((tool, i) => (
          <Link
            key={tool.path}
            to={tool.path}
            className={`panel-3d p-6 group hover:-translate-y-1 transition-transform animate-enter-${i + 1}`}
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.accent} flex items-center justify-center shadow-elevation-2 mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              {tool.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{tool.description}</p>
          </Link>
        ))}
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="animate-enter-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" /> How it works
            </CardTitle>
            <CardDescription>Navigation-first design</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            Use the sidebar to pick a tool. The URL updates automatically, and the tool loads instantly.
          </CardContent>
        </Card>

        <Card className="animate-enter-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tablet className="w-5 h-5 text-emerald-500" /> Mobile ready
            </CardTitle>
            <CardDescription>From 320px to 2K+</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            On mobile, tap the menu button in the header to open the sidebar.
          </CardContent>
        </Card>

        <Card className="animate-enter-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="w-5 h-5 text-orange-500" /> 3D interface
            </CardTitle>
            <CardDescription>Tactile by design</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            Physical-feeling keys, layered depth and glass surfaces — in light and dark mode.
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400">
        All results are estimates. Verify critical calculations with trusted sources.
      </div>
    </div>
  );
};

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Ambient aurora background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-400/20 dark:bg-indigo-600/15 blur-[100px]" />
        <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-orange-400/15 dark:bg-orange-600/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full bg-teal-400/15 dark:bg-teal-600/10 blur-[100px]" />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-80 transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="p-4 sm:p-6 md:p-8">
          <ErrorBoundary
            fallback={
              <div className="max-w-3xl mx-auto w-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                    <CardDescription>
                      This tool ran into an unexpected error. Try reloading the page or picking another tool.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => window.location.reload()}>Reload page</Button>
                  </CardContent>
                </Card>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scientific-calculator" element={<ToolRoute><ScientificCalculator /></ToolRoute>} />
              <Route path="/standard-calculator" element={<ToolRoute><StandardCalculator /></ToolRoute>} />
              <Route path="/tip-calculator" element={<ToolRoute><TipCalculator /></ToolRoute>} />
              <Route path="/bmi-calculator" element={<ToolRoute><BMICalculator /></ToolRoute>} />
              <Route path="/loan-calculator" element={<ToolRoute maxWidth="max-w-6xl"><LoanCalculator /></ToolRoute>} />
              <Route path="/mortgage-calculator" element={<ToolRoute maxWidth="max-w-6xl"><MortgageCalculator /></ToolRoute>} />
              <Route path="/pomodoro-timer" element={<ToolRoute><PomodoroTimer /></ToolRoute>} />
              <Route path="/stopwatch" element={<ToolRoute><Stopwatch /></ToolRoute>} />
              <Route path="/unit-converter" element={<ToolRoute maxWidth="max-w-xl"><UnitConverter /></ToolRoute>} />
              <Route
                path="*"
                element={
                  <div className="max-w-3xl mx-auto w-full">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">404 — Tool not found</CardTitle>
                        <CardDescription>
                          This route doesn't match any tool. Use the sidebar or go home.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col sm:flex-row gap-3">
                        <Link to="/">
                          <Button>Go Home</Button>
                        </Link>
                        <Link to="/scientific-calculator">
                          <Button variant="secondary">Open Scientific Calculator</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <AppShell />
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

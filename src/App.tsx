import React, { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Sidebar } from "./components/Layout/Sidebar";
import { Header } from "./components/Layout/Header";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100" />
  </div>
);

const ToolRoute: React.FC<{ children: React.ReactNode; maxWidth?: string }> = ({
  children,
  maxWidth = "max-w-4xl",
}) => <div className={`${maxWidth} mx-auto w-full`}>{children}</div>;

const Home: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Toolbox</Badge>
              <Badge variant="neutral">Fast</Badge>
              <Badge variant="success">Clean UI</Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              OmniCalc
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl">
              Your all-in-one calculator dashboard. Pick a tool from the sidebar to begin.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/scientific-calculator">
                <Button size="lg">Open Scientific Calculator</Button>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>Navigation-first design</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            Use the sidebar to pick a tool. The URL updates automatically, and the tool loads instantly.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile ready</CardTitle>
            <CardDescription>From 320px to 2K+</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            On mobile, tap the menu button in the header to open the sidebar.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consistent UI</CardTitle>
            <CardDescription>Reusable components</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-400">
            Buttons and cards are standardized so every tool can share the same polished look.
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-80 transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="p-4 sm:p-6 md:p-8">
          <Suspense fallback={<LoadingSpinner />}>
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
          </Suspense>
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

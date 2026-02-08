import React from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isSidebarOpen,
  onSidebarToggle,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex">
        <Sidebar isOpen={isSidebarOpen} onClose={onSidebarToggle} />

        <main className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
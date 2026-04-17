import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore, usePomodoroStore } from "@/store";
import { useThemeStore } from "../store/useThemeStore";
import {
  Home, Clock, BookOpen, Brain, Target, FolderOpen,
  LogOut, ChevronLeft, ChevronRight, Sun, Moon,
} from "lucide-react";

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export function Sidebar({ onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const { isRunning } = usePomodoroStore();
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <FolderOpen size={20} />, label: "Matérias", path: "/subjects" },
    { icon: <Clock size={20} />, label: "Pomodoro", path: "/pomodoro" },
    { icon: <BookOpen size={20} />, label: "Flashcards", path: "/flashcards" },
    { icon: <Brain size={20} />, label: "Mapas Mentais", path: "/mindmaps" },
    { icon: <Target size={20} />, label: "Metas", path: "/goals" },
  ];

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onToggle?.(next);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    if (isRunning && path !== "/pomodoro") {
      alert("⏱️ O timer está ativo! Pare o Pomodoro antes de navegar.");
      return;
    }
    navigate(path);
  };

  return (
    <aside className={`bg-white dark:bg-gray-900 min-h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-64"}`}>
      {/* Header */}
      <div className={`p-4 border-b dark:border-gray-700 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-primary-600">🎓 FocusFlow</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Plataforma de Estudos</p>
          </div>
        )}
        <button
          onClick={handleToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 mt-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isBlocked = isRunning && item.path !== "/pomodoro";
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${collapsed ? "justify-center" : ""} ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium"
                      : isBlocked
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme toggle + Logout */}
      <div className="p-2 border-t dark:border-gray-700 space-y-1">
        <button
          onClick={toggleTheme}
          title={collapsed ? (isDark ? "Modo claro" : "Modo escuro") : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${collapsed ? "justify-center" : ""}`}
        >
          <span className="flex-shrink-0">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </span>
          {!collapsed && <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>}
        </button>

        <button
          onClick={handleLogout}
          title={collapsed ? "Sair" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <span className="flex-shrink-0"><LogOut size={20} /></span>
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
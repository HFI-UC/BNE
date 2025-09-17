import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { cn } from "../lib/cn";

const navItems = [
  { to: "/", label: "首页" },
  { to: "/archive", label: "往期文章" },
  { to: "/bookings", label: "导师预约" },
  { to: "/resources", label: "资料共享" },
];

export const MainLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    );

  const roleLabels: Record<string, string> = {
    admin: "管理员",
    mentor: "导师",
    student: "学生",
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100/70">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-slate-900">
            <span className="text-xl font-semibold">HFI 学习中心</span>
            <span className="hidden text-xs text-slate-500 sm:inline">Learning Hub</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName} onClick={handleCloseMenu}>
                {item.label}
              </NavLink>
            ))}
            {user?.role === "admin" ? (
              <NavLink to="/admin" className={navClassName} onClick={handleCloseMenu}>
                管理后台
              </NavLink>
            ) : null}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 sm:flex">
                  <span>{user.name}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
                    {roleLabels[user.role] ?? user.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    void logout();
                    handleCloseMenu();
                  }}
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:border-primary hover:text-primary"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={handleCloseMenu}
                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                登录
              </Link>
            )}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:border-primary hover:text-primary md:hidden"
              onClick={handleToggleMenu}
              aria-label="切换导航"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <line x1="4" x2="20" y1="7" y2="7" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="17" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {isMenuOpen ? (
          <nav className="border-t border-slate-200 bg-white/95 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={handleCloseMenu}
                >
                  {item.label}
                </NavLink>
              ))}
              {user?.role === "admin" ? (
                <NavLink
                  to="/admin"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  onClick={handleCloseMenu}
                >
                  管理后台
                </NavLink>
              ) : null}
              <div className="pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      void logout();
                      handleCloseMenu();
                    }}
                    className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    退出登录
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={handleCloseMenu}
                    className="block w-full rounded-lg border border-primary px-3 py-2 text-center text-sm font-medium text-primary"
                  >
                    立即登录
                  </Link>
                )}
              </div>
            </div>
          </nav>
        ) : null}
      </header>
      <main className="flex-1">
        <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-semibold text-slate-900">HFI 学习中心</p>
            <p className="text-xs text-slate-500">连接导师与同学的学习与成长平台</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/bookings" className="text-sm hover:text-primary">
              导师预约
            </Link>
            <Link to="/resources" className="text-sm hover:text-primary">
              资料共享
            </Link>
            <span className="text-xs text-slate-400">© {new Date().getFullYear()} HFI 学习中心</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

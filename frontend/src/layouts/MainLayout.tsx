import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const navItems = [
  { to: "/", label: "首页" },
  { to: "/archive", label: "往期文章" },
  { to: "/bookings", label: "导师预约" },
  { to: "/resources", label: "资料共享" },
];

export const MainLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-semibold tracking-wide">
            HFI 学习中心
          </Link>
          <nav className="hidden md:flex gap-6 text-sm uppercase">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `hover:text-accent transition ${isActive ? "text-accent" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `hover:text-accent transition ${isActive ? "text-accent" : ""}`
                }
              >
                管理后台
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="hidden sm:block">{user.name}</span>
                <button
                  onClick={() => void logout()}
                  className="bg-white/10 border border-white/20 px-3 py-1 rounded hover:bg-white/20"
                >
                  退出
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-accent text-white px-4 py-2 rounded hover:bg-orange-500"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-slate-900 text-slate-300 text-center text-sm py-6">
        版权所有 © {new Date().getFullYear()} HFI 学习中心
      </footer>
    </div>
  );
};

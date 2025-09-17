import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string })?.from ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? "登录失败");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-800">登录 HFI 账号</h1>
      <p className="mt-2 text-sm text-slate-500">未登录也可浏览文章，但预约与上传功能仅对登录用户开放。</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">密码</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
            required
          />
        </div>
        {(error || formError) && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError ?? error}
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
};

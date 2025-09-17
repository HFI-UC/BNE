import { Link } from "react-router-dom";
import { useArchive } from "../api/hooks";

type QuickArchiveProps = {
  className?: string;
};

export const QuickArchive = ({ className = "" }: QuickArchiveProps) => {
  const { data, isLoading } = useArchive(1);
  const containerClasses =
    "rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm transition-shadow hover:shadow-md";

  return (
    <div className={`${containerClasses} ${className}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            📰
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">往期精选</h3>
            <p className="text-xs text-slate-500">最新六篇文章速览</p>
          </div>
        </div>
        <Link
          to="/archive"
          className="text-sm font-medium text-primary transition hover:text-primary/80"
        >
          查看全部
        </Link>
      </div>

      <div className="mt-5">
        {isLoading && <p className="text-sm text-slate-500">加载中...</p>}
        {!isLoading && (!data || data.items.length === 0) && (
          <p className="text-sm text-slate-500">暂无文章</p>
        )}
        {!isLoading && data && data.items.length > 0 && (
          <ul className="space-y-2">
            {data.items.slice(0, 6).map((article) => (
              <li key={article.id}>
                <Link
                  to={`/articles/${article.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2 transition hover:border-primary/20 hover:bg-primary/5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 group-hover:text-primary">
                      {article.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    className="h-4 w-4 text-slate-300 transition group-hover:text-primary"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path d="m7.5 5 5 5-5 5" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

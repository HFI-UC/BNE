import { useState } from "react";
import { Link } from "react-router-dom";
import { useArchive } from "../api/hooks";

export const ArchivePage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useArchive(page);

  const totalPages = data ? Math.ceil(data.total / data.perPage) : 1;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-800">往期文章</h1>
        <p className="text-sm text-slate-500">回顾历次分享与公告</p>
      </header>

      {isLoading && <div className="text-slate-500">加载中...</div>}

      {data && (
        <div className="space-y-4">
          {data.items.map((article) => (
            <article
              key={article.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary/60"
            >
              <h2 className="text-2xl font-semibold text-slate-800">{article.title}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {article.published_at ? new Date(article.published_at).toLocaleString() : ""}
              </p>
              <p className="mt-3 text-slate-600 line-clamp-3">{article.summary}</p>
              <Link
                to={`/articles/${article.slug}`}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                阅读详情
              </Link>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <button
            className="rounded border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </button>
          <span className="text-sm text-slate-500">
            第 {page} / {totalPages} 页
          </span>
          <button
            className="rounded border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
};

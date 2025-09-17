import { useState } from "react";
import { useArchive } from "../api/hooks";
import { ArticleList } from "../components/ArticleList";
import { PageHeader } from "../components/PageHeader";

export const ArchivePage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useArchive(page);

  const totalPages = data ? Math.ceil(data.total / data.perPage) : 1;

  return (
    <div className="space-y-8">
      <PageHeader title="往期文章" description="回顾历次分享与公告，随时查阅需要的内容。" />

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">加载中...</p>
        ) : data ? (
          <ArticleList articles={data.items} showSummary emptyHint="暂无历史文章" />
        ) : (
          <p className="text-sm text-slate-500">暂无文章</p>
        )}
      </section>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </button>
          <span>
            第 {page} / {totalPages} 页
          </span>
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            下一页
          </button>
        </div>
      ) : null}
    </div>
  );
};

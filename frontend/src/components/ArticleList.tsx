import { Link } from "react-router-dom";
import type { Article } from "../api/hooks";
import { cn } from "../lib/cn";

type ArticleListProps = {
  articles: Article[];
  className?: string;
  showSummary?: boolean;
  emptyHint?: string;
};

export const ArticleList = ({
  articles,
  className,
  showSummary = true,
  emptyHint = "暂无文章",
}: ArticleListProps) => {
  if (articles.length === 0) {
    return <p className="text-sm text-slate-500">{emptyHint}</p>;
  }

  return (
    <ul className={cn("space-y-3", className)}>
      {articles.map((article) => (
        <li
          key={article.id}
          className="group rounded-2xl border border-slate-200 bg-white/90 p-4 transition hover:border-primary/40"
        >
          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <Link
                to={`/articles/${article.slug}`}
                className="text-base font-semibold text-slate-900 transition group-hover:text-primary"
              >
                {article.title}
              </Link>
              {article.published_at ? (
                <p className="text-xs text-slate-400">
                  {new Date(article.published_at).toLocaleDateString()}
                </p>
              ) : null}
            </div>
            {showSummary && article.summary ? (
              <p className="text-sm text-slate-600 line-clamp-3">{article.summary}</p>
            ) : null}
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <span>阅读全文</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path d="m7.5 5 5 5-5 5" />
              </svg>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

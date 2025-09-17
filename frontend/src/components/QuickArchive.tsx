import { Link } from "react-router-dom";
import { useArchive } from "../api/hooks";

export const QuickArchive = () => {
  const { data, isLoading } = useArchive(1);

  if (isLoading) {
    return <div className="text-sm text-slate-500">加载中...</div>;
  }

  if (!data || data.items.length === 0) {
    return <div className="text-sm text-slate-500">暂无文章</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800">快捷栏 · 往期文章</h3>
        <Link to="/archive" className="text-sm text-primary hover:underline">
          查看全部
        </Link>
      </div>
      <ul className="space-y-3">
        {data.items.slice(0, 6).map((article) => (
          <li key={article.id} className="group">
            <Link
              to={`/articles/${article.slug}`}
              className="flex flex-col"
            >
              <span className="text-sm font-medium text-slate-700 group-hover:text-primary">
                {article.title}
              </span>
              <span className="text-xs text-slate-400">
                {article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

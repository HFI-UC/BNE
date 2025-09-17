import { useParams } from "react-router-dom";
import { useArticle } from "../api/hooks";
import { PageHeader } from "../components/PageHeader";

export const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticle(slug ?? "");

  if (isLoading) {
    return <div className="text-sm text-slate-500">加载中...</div>;
  }

  if (isError || !article) {
    return <div className="text-sm text-slate-500">文章不存在</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={article.title} description={article.summary} />
      <article className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs text-slate-400">
          发布于 {article.published_at ? new Date(article.published_at).toLocaleString() : "未知时间"}
        </p>
        <div
          className="prose prose-slate mt-6 max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
        />
      </article>
    </div>
  );
};

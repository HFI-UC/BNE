import { useParams } from "react-router-dom";
import { useArticle } from "../api/hooks";

export const ArticleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticle(slug ?? "");

  if (isLoading) {
    return <div className="text-slate-500">加载中...</div>;
  }

  if (isError || !article) {
    return <div className="text-slate-500">文章不存在</div>;
  }

  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm text-slate-500">
        发布于 {article.published_at ? new Date(article.published_at).toLocaleString() : "未知"}
      </p>
      <h1>{article.title}</h1>
      <p className="text-lg text-slate-600">{article.summary}</p>
      <div
        className="mt-6 space-y-4"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />
    </article>
  );
};

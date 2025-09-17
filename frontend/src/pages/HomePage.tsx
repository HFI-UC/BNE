import { Link } from "react-router-dom";
import { useHomepageFeed } from "../api/hooks";
import { QuickArchive } from "../components/QuickArchive";

export const HomePage = () => {
  const { data, isLoading } = useHomepageFeed();

  if (isLoading) {
    return <div className="text-center text-slate-500">加载首页内容...</div>;
  }

  if (!data) {
    return <div className="text-center text-slate-500">暂时没有内容</div>;
  }

  const featured = data.featured[0];
  const secondary = data.featured.slice(1);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-8">
        {featured && (
          <article className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg">
            {featured.hero_image_url && (
              <img
                src={featured.hero_image_url}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
            )}
            <div className="relative z-10 p-8 md:p-12">
              <p className="text-sm uppercase tracking-widest text-slate-200">推荐文章</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">
                {featured.title}
              </h1>
              <p className="mt-4 text-lg text-slate-200 max-w-2xl">
                {featured.summary}
              </p>
              <Link
                to={`/articles/${featured.slug}`}
                className="mt-6 inline-block rounded bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow hover:bg-orange-500"
              >
                阅读全文
              </Link>
            </div>
          </article>
        )}

        {secondary.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {secondary.map((article) => (
              <article key={article.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-800">{article.title}</h2>
                <p className="mt-3 text-sm text-slate-600 line-clamp-3">{article.summary}</p>
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

        <section>
          <h2 className="text-2xl font-semibold text-slate-800">最新发布</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.latest.map((article) => (
              <Link
                to={`/articles/${article.slug}`}
                key={article.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-primary/60"
              >
                <h3 className="text-lg font-medium text-slate-800">{article.title}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{article.summary}</p>
                <span className="mt-2 block text-xs text-slate-400">
                  {article.published_at ? new Date(article.published_at).toLocaleString() : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-800">公告栏</h2>
          <ul className="mt-4 space-y-4">
            {data.announcements.map((announcement) => (
              <li key={announcement.id} className="border-l-4 border-accent pl-4">
                <p className="text-sm text-slate-500">
                  {new Date(announcement.published_at).toLocaleString()}
                </p>
                <h3 className="text-lg font-semibold text-slate-800">{announcement.title}</h3>
                <p className="mt-1 text-slate-600">{announcement.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <aside className="space-y-6">
        <QuickArchive />
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">导师预约说明</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            登录 HFI 账号即可预约导师，一对一选择科目、时间与地点。预约状态支持追踪，管理员审核后将发送提醒。
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">资料共享说明</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            所有同学均可上传学习资料，管理员审核后对全体公开。文件安全存储在腾讯云 COS，下载链接为限时有效。
          </p>
        </div>
      </aside>
    </div>
  );
};

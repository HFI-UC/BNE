import { Link } from "react-router-dom";
import { useHomepageFeed } from "../api/hooks";
import { QuickArchive } from "../components/QuickArchive";

export const HomePage = () => {
  const { data, isLoading } = useHomepageFeed();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div
          className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 text-center text-sm text-slate-500 shadow-sm"
        >
          <p className="py-6">加载首页内容...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-slate-500">暂时没有内容</div>;
  }

  const featured = data.featured[0];
  const secondary = data.featured.slice(1);

  const guideLinks = [
    {
      href: "/bookings",
      title: "导师预约",
      description: "查看导师档案并快速预约合适的时间。",
      icon: "📅",
    },
    {
      href: "/resources",
      title: "资料共享",
      description: "上传或下载学习资料，共享最新备考资源。",
      icon: "📁",
    },
    {
      href: "/archive",
      title: "往期文章",
      description: "查阅历史内容，回顾活动与学习总结。",
      icon: "📰",
    },
  ];

  const highlightItems = [
    {
      icon: "🎯",
      title: "重点复盘",
      description: "精选文章帮助你聚焦每周学习亮点。",
    },
    {
      icon: "🤝",
      title: "导师陪伴",
      description: "经验导师提供一对一答疑与规划建议。",
    },
    {
      icon: "🚀",
      title: "持续成长",
      description: "资料共享与活动公告同步更新，保持节奏。",
    },
  ];

  const surfaceCardClasses =
    "rounded-3xl border border-slate-200 bg-white/95 shadow-sm transition-shadow hover:shadow-md";

  return (
    <div className="space-y-12">
      <section className="grid gap-6 xl:grid-cols-[2fr_1.1fr]">
        <div className="space-y-6">
          {featured && (
            <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl">
              {featured.hero_image_url && (
                <img
                  src={featured.hero_image_url}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/70 to-slate-900/10" />
              <div className="absolute -right-24 top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
              <div className="relative z-10 flex flex-col gap-4 p-8 md:p-12">
                <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest">
                  精选文章
                </span>
                <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{featured.title}</h1>
                <p className="max-w-2xl text-sm text-slate-200 md:text-base">{featured.summary}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to={`/articles/${featured.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-orange-500"
                  >
                    <span>阅读全文</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path d="m8 5 4 5-4 5" />
                    </svg>
                  </Link>
                  <Link to="/archive" className="text-sm font-medium text-white/80 hover:text-white">
                    浏览更多文章
                  </Link>
                </div>
              </div>
            </article>
          )}

          {secondary.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {secondary.map((article) => (
                <article
                  key={article.id}
                  className={`${surfaceCardClasses} h-full p-6`.trim()}
                >
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <h2 className="text-lg font-semibold text-slate-900">{article.title}</h2>
                      <p className="text-sm text-slate-600 line-clamp-3">{article.summary}</p>
                    </div>
                    <Link
                      to={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
                    >
                      阅读详情
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        className="h-4 w-4"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path d="m8 5 4 5-4 5" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <QuickArchive className="h-full" />
          <div className={`${surfaceCardClasses} p-6`.trim()}>
            <h3 className="text-lg font-semibold text-slate-900">学习服务导航</h3>
            <div className="mt-4 space-y-3">
              {guideLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-primary/20 hover:bg-primary/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
                    {link.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-primary">{link.title}</p>
                    <p className="text-xs text-slate-500">{link.description}</p>
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
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className={`${surfaceCardClasses} p-8`.trim()}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">最新发布</h2>
            <p className="text-sm text-slate-500">掌握学习中心的最新文章与公告动态</p>
          </div>
          <Link to="/archive" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
            浏览全部文章
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              className="h-4 w-4"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path d="m8 5 4 5-4 5" />
            </svg>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.latest.map((article) => (
            <Link
              to={`/articles/${article.slug}`}
              key={article.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white/90 p-5 transition hover:border-primary/20 hover:bg-primary/5"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">{article.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-3">{article.summary}</p>
              </div>
              <span className="mt-3 block text-xs text-slate-400">
                {article.published_at ? new Date(article.published_at).toLocaleString() : ""}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className={`${surfaceCardClasses} p-8`.trim()}>
          <h2 className="text-2xl font-semibold text-slate-900">公告栏</h2>
          <div className="mt-6 space-y-4">
            {data.announcements.length > 0 ? (
              data.announcements.map((announcement) => (
                <article key={announcement.id} className="rounded-2xl border border-slate-200/80 p-5 transition hover:border-primary/30">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    {new Date(announcement.published_at).toLocaleString()}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{announcement.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{announcement.content}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-500">暂无公告</p>
            )}
          </div>
        </div>
        <div className={`rounded-3xl border border-slate-200 bg-gradient-to-br from-primary/5 via-white to-accent/10 p-8 shadow-sm transition-shadow hover:shadow-md`}>
          <h3 className="text-lg font-semibold text-slate-900">校园服务亮点</h3>
          <p className="mt-2 text-sm text-slate-600">
            我们将活动、预约与资料同步在学习中心，随时随地保持学习节奏。
          </p>
          <ul className="mt-5 space-y-4">
            {highlightItems.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

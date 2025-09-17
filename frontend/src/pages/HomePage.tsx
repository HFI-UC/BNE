import { Link } from "react-router-dom";
import { useHomepageFeed } from "../api/hooks";
import { ArticleList } from "../components/ArticleList";
import { PageHeader } from "../components/PageHeader";
import { QuickArchive } from "../components/QuickArchive";

export const HomePage = () => {
  const { data, isLoading } = useHomepageFeed();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
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
      description: "查看导师档案并快速预约合适时间",
      icon: "📅",
    },
    {
      href: "/resources",
      title: "资料共享",
      description: "上传或下载学习资料，保持最新进度",
      icon: "📁",
    },
    {
      href: "/archive",
      title: "往期文章",
      description: "查阅历史内容，回顾活动与总结",
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

  return (
    <div className="space-y-10">
      <PageHeader
        title="HFI 学习中心"
        description="集中查看精选文章、导师预约与学习资料，帮助你高效安排每一步学习计划。"
      />

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {featured ? (
            <article className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex-1 space-y-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    精选文章
                  </span>
                  <h2 className="text-3xl font-semibold text-slate-900">{featured.title}</h2>
                  <p className="text-sm text-slate-600 md:text-base">{featured.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <Link
                      to={`/articles/${featured.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90"
                    >
                      阅读全文
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="h-4 w-4"
                      >
                        <path d="m7.5 5 5 5-5 5" />
                      </svg>
                    </Link>
                    <Link to="/archive" className="text-primary hover:text-primary/80">
                      浏览更多文章
                    </Link>
                  </div>
                </div>
                {featured.hero_image_url ? (
                  <div className="overflow-hidden rounded-xl border border-slate-100">
                    <img
                      src={featured.hero_image_url}
                      alt={featured.title}
                      className="h-full w-full max-h-64 object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </article>
          ) : null}

          {secondary.length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">更多推荐</h3>
                <Link to="/archive" className="text-sm text-primary hover:text-primary/80">
                  查看全部
                </Link>
              </div>
              <ArticleList articles={secondary} className="mt-4" showSummary />
            </section>
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">学习服务导航</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {guideLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 px-3 py-3 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg">
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
          </section>
        </div>

        <aside className="space-y-6">
          <QuickArchive />
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">学习亮点</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {highlightItems.map((item) => (
                <li key={item.title} className="flex gap-3 rounded-xl border border-slate-200 px-3 py-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">最新发布</h3>
            <p className="text-sm text-slate-500">掌握学习中心的最新文章与公告动态。</p>
          </div>
          <Link to="/archive" className="text-sm font-medium text-primary hover:text-primary/80">
            浏览全部文章
          </Link>
        </div>
        <ArticleList articles={data.latest} className="mt-6" />
      </section>

      {data.announcements.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">学习中心公告</h3>
          <ul className="mt-4 space-y-3">
            {data.announcements.map((announcement) => (
              <li key={announcement.id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-medium text-slate-900">{announcement.title}</p>
                <p className="mt-1 text-xs text-slate-400">
                  发布于 {new Date(announcement.published_at).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm text-slate-600">{announcement.content}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
};

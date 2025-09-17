import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { useAuthStore } from "../store/auth";
import {
  useResources,
  useMyResources,
  useUploadResource,
  useDownloadResource,
} from "../api/hooks";
import { PageHeader } from "../components/PageHeader";

export const ResourcesPage = () => {
  const { user } = useAuthStore();
  const { data: publicResources } = useResources();
  const { data: myResources } = useMyResources(Boolean(user));
  const uploadMutation = useUploadResource();
  const downloadMutation = useDownloadResource();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
      setUploadMessage("请选择文件");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        title,
        description,
        file: fileInputRef.current.files[0],
      });
      setUploadMessage("上传成功，等待审核");
      setTitle("");
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      setUploadMessage(error?.response?.data?.message ?? "上传失败");
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const url = await downloadMutation.mutateAsync(id);
      window.open(url, "_blank");
    } catch (error: any) {
      alert(error?.response?.data?.message ?? "获取下载链接失败");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="资料共享"
        description="浏览已审核的学习资料，或上传自己的文件等待审核。"
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">公开资料</h2>
            <div className="mt-4 space-y-3">
              {publicResources && publicResources.length > 0 ? (
                publicResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800">{resource.title}</p>
                      <p className="text-xs text-slate-500">{resource.description}</p>
                      <p className="text-xs text-slate-400">
                        上传时间：{new Date(resource.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(resource.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
                    >
                      下载
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">暂无公开资料</p>
              )}
            </div>
          </div>

          {user ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">上传资料</h2>
              <form onSubmit={handleUpload} className="mt-4 space-y-4 text-sm text-slate-700">
                <div>
                  <label className="text-sm font-medium text-slate-700">标题</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">描述</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">选择文件</label>
                  <input type="file" ref={fileInputRef} className="mt-1 block w-full text-sm" required />
                </div>
                {uploadMessage ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                    {uploadMessage}
                  </div>
                ) : null}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "上传中..." : "提交审核"}
                </button>
              </form>
            </div>
          ) : null}

          {user ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">我的上传记录</h2>
              <div className="mt-3 space-y-3">
                {myResources && myResources.length > 0 ? (
                  myResources.map((resource) => (
                    <div key={resource.id} className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                      <p className="font-medium text-slate-800">{resource.title}</p>
                      <p className="text-xs text-slate-500">状态：{resource.status}</p>
                      <p className="text-xs text-slate-400">{new Date(resource.created_at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">暂无上传记录</p>
                )}
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <h3 className="text-lg font-semibold text-slate-900">审核流程</h3>
            <ol className="mt-3 space-y-2">
              <li>1. 上传资料后进入待审核列表</li>
              <li>2. 管理员在后台进行审批</li>
              <li>3. 审核通过后所有人可下载</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
};

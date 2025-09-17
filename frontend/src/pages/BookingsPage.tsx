import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useAuthStore } from "../store/auth";
import { useCreateBooking, useBookings, useMentors } from "../api/hooks";
import { PageHeader } from "../components/PageHeader";

export const BookingsPage = () => {
  const { user } = useAuthStore();
  const { data: mentors } = useMentors();
  const { data: bookings } = useBookings();
  const createBooking = useCreateBooking();
  const [formState, setFormState] = useState({
    mentor_id: "",
    subject: "",
    location: "",
    date: "",
    start: "",
    end: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const availability = useMemo(() => {
    if (!formState.mentor_id) return [];
    return mentors?.find((mentor) => mentor.id === Number(formState.mentor_id))?.availability ?? [];
  }, [formState.mentor_id, mentors]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    if (!user) {
      setMessage("请先登录再预约导师");
      return;
    }

    const startDateTime = `${formState.date}T${formState.start}`;
    const endDateTime = `${formState.date}T${formState.end}`;

    try {
      await createBooking.mutateAsync({
        mentor_id: Number(formState.mentor_id),
        subject: formState.subject,
        location: formState.location,
        start_time: startDateTime,
        end_time: endDateTime,
      });
      setMessage("预约已提交，等待审核。");
      setFormState({ mentor_id: "", subject: "", location: "", date: "", start: "", end: "" });
    } catch (error: any) {
      setMessage(error?.response?.data?.message ?? "预约失败，请稍后再试");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="导师预约"
        description="选择导师、科目与时间，管理员审核后即可确认预约安排。"
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-6">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">提交预约</h2>
            <p className="mt-1 text-xs text-slate-500">请填写完整信息，确保导师可以快速确认安排。</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-slate-700">
                导师
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={formState.mentor_id}
                  onChange={(event) => setFormState((prev) => ({ ...prev, mentor_id: event.target.value }))}
                  required
                >
                  <option value="">请选择导师</option>
                  {mentors?.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-700">
                科目
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={formState.subject}
                  onChange={(event) => setFormState((prev) => ({ ...prev, subject: event.target.value }))}
                  required
                />
              </label>
              <label className="text-sm text-slate-700">
                日期
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={formState.date}
                  onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value }))}
                  required
                />
              </label>
              <label className="text-sm text-slate-700">
                地点
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={formState.location}
                  onChange={(event) => setFormState((prev) => ({ ...prev, location: event.target.value }))}
                  required
                />
              </label>
              <label className="text-sm text-slate-700">
                开始时间
                <input
                  type="time"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={formState.start}
                  onChange={(event) => setFormState((prev) => ({ ...prev, start: event.target.value }))}
                  required
                />
              </label>
              <label className="text-sm text-slate-700">
                结束时间
                <input
                  type="time"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={formState.end}
                  onChange={(event) => setFormState((prev) => ({ ...prev, end: event.target.value }))}
                  required
                />
              </label>
            </div>

            {availability.length > 0 ? (
              <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
                <p className="font-semibold">导师可预约时段</p>
                <ul className="mt-2 space-y-1">
                  {availability.map((item) => (
                    <li key={item.day}>
                      {item.day}: {item.slots.join(" / ")}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {message ? (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? "提交中..." : "提交预约"}
            </button>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">我的预约</h2>
            <div className="mt-4 space-y-3">
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>导师：{booking.mentor_name}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        状态：{booking.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">科目：{booking.subject}</p>
                    <p className="text-sm text-slate-600">地点：{booking.location}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">暂无预约记录</p>
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">导师团队</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              {mentors?.map((mentor) => (
                <li key={mentor.id} className="rounded-xl border border-slate-200 px-3 py-3">
                  <p className="font-medium text-slate-800">{mentor.name}</p>
                  {mentor.subjects.length > 0 ? (
                    <p className="text-xs text-slate-500">擅长：{mentor.subjects.join("、")}</p>
                  ) : null}
                  {mentor.locations.length > 0 ? (
                    <p className="text-xs text-slate-400">可预约地点：{mentor.locations.join("、")}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

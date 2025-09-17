import {
  useAdminBookings,
  usePendingResources,
  useApproveResource,
  useUpdateBookingStatus,
} from "../api/hooks";

export const AdminDashboard = () => {
  const { data: pendingResources } = usePendingResources();
  const { data: adminBookings } = useAdminBookings();
  const approveResource = useApproveResource();
  const updateBookingStatus = useUpdateBookingStatus();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-slate-800">管理员控制台</h1>
        <p className="mt-2 text-sm text-slate-500">审核资料与管理导师预约。</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">待审核资料</h2>
        <div className="mt-4 space-y-3">
          {pendingResources && pendingResources.length > 0 ? (
            pendingResources.map((resource) => (
              <div key={resource.id} className="rounded border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-700">{resource.title}</p>
                    <p className="text-sm text-slate-500">{resource.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveResource.mutate({ id: resource.id, action: "approve" })}
                      className="rounded bg-primary px-3 py-1 text-sm text-white hover:bg-primary/90"
                    >
                      审核通过
                    </button>
                    <button
                      onClick={() => approveResource.mutate({ id: resource.id, action: "reject" })}
                      className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      驳回
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">暂无待审核资料</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">预约管理</h2>
        <div className="mt-4 space-y-3">
          {adminBookings && adminBookings.length > 0 ? (
            adminBookings.map((booking) => (
              <div key={booking.id} className="rounded border border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-700">
                      {booking.student_name ?? ""} → {booking.mentor_name}
                    </p>
                    <p className="text-sm text-slate-500">{booking.subject}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(["approved", "rejected", "cancelled"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateBookingStatus.mutate({ id: booking.id, status })}
                        className="rounded border border-slate-300 px-3 py-1 text-xs uppercase tracking-wide hover:border-primary"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">暂无预约记录</p>
          )}
        </div>
      </section>
    </div>
  );
};

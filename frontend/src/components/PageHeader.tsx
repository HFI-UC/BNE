import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export const PageHeader = ({ title, description, action, className = "" }: PageHeaderProps) => {
  return (
    <header
      className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`.trim()}
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </header>
  );
};

import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card grid min-h-56 place-items-center p-8 text-center">
      <div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950"><Icon /></span><h2 className="mt-4 text-xl font-black">{title}</h2><p className="muted mx-auto mt-2 max-w-md text-sm">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
    </div>
  );
}

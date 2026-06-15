import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card grid min-h-56 place-items-center p-8 text-center">
      <div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-400/15 text-indigo-600 dark:text-cyan-300"><Icon /></span><h2 className="mt-4 text-xl font-black">{title}</h2><p className="muted mx-auto mt-2 max-w-md text-sm">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
    </div>
  );
}

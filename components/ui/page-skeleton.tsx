export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse">
      <div className="h-4 w-28 rounded bg-indigo-100 dark:bg-indigo-950" />
      <div className="mt-3 h-10 w-72 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-32 rounded-3xl bg-slate-200/70 dark:bg-slate-800/70" />)}
      </div>
      <div className="mt-6 h-80 rounded-3xl bg-slate-200/70 dark:bg-slate-800/70" />
    </div>
  );
}

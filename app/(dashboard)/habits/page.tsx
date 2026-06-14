import { CheckCircle2, Circle } from "lucide-react";
import { toggleHabit } from "@/app/(dashboard)/actions";
import { requireUser } from "@/lib/auth";

export default async function HabitsPage() {
  const { supabase, user } = await requireUser();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase.from("habits").select("*").eq("user_id", user.id).eq("active", true).order("created_at"),
    supabase.from("habit_logs").select("habit_id,completed").eq("user_id", user.id).eq("log_date", today),
  ]);
  const completed = new Set((logs ?? []).filter((log) => log.completed).map((log) => log.habit_id));

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-black text-emerald-600">CONSISTÊNCIA</p>
      <h1 className="mt-1 text-4xl font-black">Hábitos de hoje</h1>
      <p className="muted mt-2">Pequenas ações contam mais do que perfeição.</p>
      <div className="mt-7 grid gap-3">
        {(habits ?? []).map((habit) => {
          const isCompleted = completed.has(habit.id);
          return (
            <form action={toggleHabit} key={habit.id}>
              <input type="hidden" name="habitId" value={habit.id} />
              <input type="hidden" name="completed" value={String(isCompleted)} />
              <button className="card flex w-full items-center justify-between p-5 text-left">
                <span><b>{habit.title}</b><span className="muted mt-1 block text-xs">Meta diária</span></span>
                {isCompleted ? <CheckCircle2 className="text-emerald-600" /> : <Circle className="text-slate-300" />}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}

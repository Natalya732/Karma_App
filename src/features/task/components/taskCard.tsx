import { useState } from "react";
import {
  MessageSquareText,
  Check,
  X,
  Clock,
  ChevronDown,
  Calendar,
} from "lucide-react";
import type { TaskData } from "@/features/task/views/taskView";
import { capitalizeString } from "@/lib/utils";
import { useDb } from "@/shared/context/dbProvider";
import { Database } from "@/shared/utils/constants";

type TaskStatus = "pending" | "done" | "failed";

const statusConfig: Record<
  TaskStatus,
  {
    icon: React.ReactNode;
    bgClass: string;
    textClass: string;
    borderClass: string;
    glowClass: string;
    label: string;
  }
> = {
  pending: {
    icon: <Clock className="w-3.5 h-3.5" />,
    bgClass: "bg-amber-500/20",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/40",
    glowClass: "shadow-amber-500/20",
    label: "Pending",
  },
  done: {
    icon: <Check className="w-3.5 h-3.5" />,
    bgClass: "bg-emerald-500/20",
    textClass: "text-emerald-400",
    borderClass: "border-emerald-500/40",
    glowClass: "shadow-emerald-500/20",
    label: "Done",
  },
  failed: {
    icon: <X className="w-3.5 h-3.5" />,
    bgClass: "bg-rose-500/20",
    textClass: "text-rose-400",
    borderClass: "border-rose-500/40",
    glowClass: "shadow-rose-500/20",
    label: "Failed",
  },
};

export default function TaskCard({
  title,
  taskArr,
  onTaskUpdate,
}: {
  title: string;
  taskArr: TaskData[];
  onTaskUpdate?: () => void;
}) {
  const { updateValue } = useDb();
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    await updateValue({
      tableName: Database.taskTable,
      id: Number(taskId),
      newItem: { status: newStatus },
    });
    onTaskUpdate?.();
  };

  const cycleStatus = (currentStatus: TaskStatus): TaskStatus => {
    const order: TaskStatus[] = ["pending", "done", "failed"];
    const currentIndex = order.indexOf(currentStatus);
    return order[(currentIndex + 1) % order.length];
  };

  const completedCount = taskArr.filter((task) => task.status === "done").length;
  const progressPercent = taskArr.length > 0 ? (completedCount / taskArr.length) * 100 : 0;

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-white tracking-tight">
              {capitalizeString(title)}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-medium text-white">{completedCount}</span>
            <span>/</span>
            <span>{taskArr.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-60 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div
        className="cardBody px-3 pb-3 flex flex-col gap-1.5 overflow-auto"
        style={{ maxHeight: "280px" }}
      >
        {taskArr.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-3 border border-slate-700/50">
              <Calendar className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">No tasks yet</p>
            <p className="text-slate-500 text-xs">Add your first task to get started</p>
          </div>
        ) : (
          taskArr.map((item) => {
            const status = (item.status || "pending") as TaskStatus;
            const config = statusConfig[status];
            const isExpanded = expandedTask === item.id;

            return (
              <div
                key={item.id}
                className={`
                  group rounded-xl transition-all duration-300
                  ${isExpanded ? "bg-slate-800/60" : "hover:bg-slate-800/40"}
                `}
              >
                {/* Task Row */}
                <div
                  onClick={() => setExpandedTask(isExpanded ? null : item.id)}
                  className="flex items-center gap-3 p-3 cursor-pointer"
                >
                  {/* Status Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(item.id, cycleStatus(status));
                    }}
                    className={`
                      relative flex-shrink-0 w-7 h-7 rounded-lg border
                      flex items-center justify-center
                      transition-all duration-200 cursor-pointer
                      ${config.bgClass} ${config.borderClass} ${config.textClass}
                      hover:scale-110 hover:shadow-lg ${config.glowClass}
                    `}
                    title={`${config.label} - Click to change`}
                  >
                    {config.icon}
                  </button>

                  {/* Task Title */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                        text-sm font-medium truncate transition-all duration-200
                        ${status === "done" ? "text-slate-500 line-through" : "text-slate-200"}
                        ${status === "failed" ? "text-rose-400/80" : ""}
                      `}
                    >
                      {item.title}
                    </p>
                  </div>

                  {/* Right side info */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.notes && item.notes.length > 0 && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <MessageSquareText className="w-3.5 h-3.5" />
                        <span className="text-xs">{item.notes.length}</span>
                      </div>
                    )}
                    <ChevronDown
                      className={`
                        w-4 h-4 text-slate-500 transition-transform duration-300
                        ${isExpanded ? "rotate-180" : ""}
                      `}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                      {/* Due Date */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due {new Date(item.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}</span>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Notes */}
                      {item.notes && item.notes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {item.notes.map((note) => (
                            <span
                              key={note.id}
                              className="inline-flex items-center px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-xs text-slate-300"
                            >
                              {note.note}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Status Actions */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-700/30">
                        {(["pending", "done", "failed"] as TaskStatus[]).map((s) => {
                          const sConfig = statusConfig[s];
                          const isActive = status === s;
                          return (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(item.id, s);
                              }}
                              className={`
                                flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs
                                transition-all duration-200 cursor-pointer border
                                ${
                                  isActive
                                    ? `${sConfig.bgClass} ${sConfig.borderClass} ${sConfig.textClass} font-medium`
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                                }
                              `}
                            >
                              {sConfig.icon}
                              {sConfig.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {taskArr.length > 0 && (
        <div className="px-5 py-3 bg-slate-900/50 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {progressPercent === 100 ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  All tasks completed!
                </span>
              ) : (
                `${Math.round(progressPercent)}% complete`
              )}
            </span>
            <div className="flex items-center gap-3">
              {Object.entries(statusConfig).map(([key, value]) => {
                const count = taskArr.filter((t) => (t.status || "pending") === key).length;
                if (count === 0) return null;
                return (
                  <span key={key} className={`flex items-center gap-1 ${value.textClass}`}>
                    {value.icon}
                    <span>{count}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

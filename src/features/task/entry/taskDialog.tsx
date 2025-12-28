import { X, ClipboardList } from "lucide-react";
import { TaskForm } from "../components/taskForm";

export default function TaskDialog({
  onHide,
  edit = false,
}: {
  onHide: () => void;
  edit: boolean;
}) {
  console.log({ onHide, edit });
  return (
    <div className="dialogOverlay">
      <div
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 text-slate-300 rounded-2xl p-5 z-20 shadow-2xl shadow-black/50"
        style={{ width: "85%", maxHeight: "420px", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Create New Task</h2>
              <p className="text-xs text-slate-500">Add a task to your board</p>
            </div>
          </div>
          <button
            onClick={onHide}
            className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="dialogForm">
          <TaskForm onHide={onHide} />
        </div>
      </div>
    </div>
  );
}

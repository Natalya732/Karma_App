import { XCircle } from "lucide-react";
import React from "react";
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
      <div className="dialogBox bg-zinc-50 border-0 text-zinc-500 rounded-xl p-4 border-2 z-20 border-zinc-300">
        <div className="dialogheader flex text-zinc-700 font-bold text-xl justify-between items-center">
          Create New Task
          <XCircle
            className=" text-zinc-400
          cursor-pointer"
            onClick={onHide}
          />
        </div>

        <div className="dialogForm mt-6">
          <TaskForm />
        </div>
      </div>
    </div>
  );
}

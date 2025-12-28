import { useEffect, useState } from "react";
import TaskCard from "../components/taskCard";
import { Database } from "@/shared/utils/constants";
import type { formSchema } from "@/features/task/components/taskForm";
import type z from "zod";
import { useDb } from "@/shared/context/dbProvider";

export type TaskData = z.infer<typeof formSchema> & { id: string };

interface TaskViewProps {
  selectedBoardId: string;
  boardName: string;
}

export default function TaskView({ selectedBoardId, boardName }: TaskViewProps) {
  const { getAllValue, isDbConnecting } = useDb();
  const [tasks, setTasks] = useState<TaskData[]>([]);

  async function getTasksForBoard() {
    if (!selectedBoardId) {
      setTasks([]);
      return;
    }
    
    const allTasks = await getAllValue(Database.taskTable);
    const filteredTasks = allTasks.filter(
      (task) => task.selectedBoardId === selectedBoardId
    );
    setTasks(filteredTasks);
  }

  useEffect(() => {
    if (!isDbConnecting) {
      getTasksForBoard();
    }
  }, [isDbConnecting, selectedBoardId]);

  if (!selectedBoardId) {
    return (
      <div className="flex justify-center items-center mt-6 w-full text-zinc-400">
        No board selected. Create a board to get started.
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-8 md:grid-cols-1 items-center mt-6 w-full flex-wrap">
      <TaskCard title={boardName} taskArr={tasks} onTaskUpdate={getTasksForBoard} />
    </div>
  );
}

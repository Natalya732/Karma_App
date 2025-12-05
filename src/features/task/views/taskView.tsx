import React, { useEffect, useState } from "react";
import TaskCard from "../components/taskCard";
import { Database } from "@/shared/utils/constants";
import type { formSchema } from "@/features/task/components/taskForm";
import type z from "zod";
import { useDb } from "@/shared/context/dbProvider";

export type TaskData = z.infer<typeof formSchema> & { id: string };
export type TaskMap = Record<string, TaskData[]>;

export default function TaskView() {
  const { getAllValue, isDbConnecting } = useDb();
  const [tasks, setTasks] = useState<TaskMap>({});

  async function getTasksValue() {
    const allTasks = await getAllValue(Database.taskTable);
    const allBoards = await getAllValue(Database.boardTable);
    let arrangedTasks: TaskMap = {};

    allTasks.forEach((task) => {
      const selectedBoard = allBoards.find(
        (board) => task.selectedBoardId == board.id
      );

      const boardName = selectedBoard.boardName;
      if (!boardName) return;
      if (!arrangedTasks[boardName]) {
        arrangedTasks[boardName] = [];
      }
      arrangedTasks[boardName].push(task);
    });

    setTasks(arrangedTasks);
  }

  useEffect(() => {
    if (!isDbConnecting) {
      getTasksValue();
    }
  }, [isDbConnecting]);

  return (
    <div className="flex justify-center gap-8 md:grid-cols-1 items-center mt-6 w-full flex-wrap">
      {Object.keys(tasks).map((title, idx) => {
        return <TaskCard key={idx} title={title} taskArr={tasks[title]} />;
      })}
    </div>
  );
}

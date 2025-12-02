import { useEffect, useState } from "react";
import TaskDialog from "@/features/task/entry/taskDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BoardDialog from "@/features/board/entry/boardDialog";
import { DBProvider, useDb } from "./shared/context/dbProvider";
import { Database } from "./shared/utils/constants";
import type { formSchema } from "./features/task/components/taskForm";
import type z from "zod";
import TaskView from "./features/task/views/taskView";

type TaskData = z.infer<typeof formSchema>;
type TaskMap = Record<string, TaskData[]>;

function App() {
  const { getAllValue, isDbConnecting } = useDb();
  const [tasks, setTasks] = useState<TaskMap>({});
  const [showDialog, setShowDialog] = useState(false);
  const [showBoardDialog, setShowBoardDialog] = useState(false);

  async function getTasksValue() {
    const allTasks = await getAllValue(Database.taskTable);
    let arrangedTasks: TaskMap = {};
    allTasks.forEach((task) => {
      const boardName = task.boards[0].boardName;
      if (!boardName) return;
      if (!arrangedTasks[boardName]) {
        arrangedTasks[boardName] = [];
      }
      arrangedTasks[boardName].push(task);
    });

    setTasks(arrangedTasks);
  }

  console.log("taks", tasks);

  useEffect(() => {
    if (!isDbConnecting) {
      getTasksValue();
    }
  }, []);

  return (
    <>
      <div className="bg-gray-50 p-10 flex flex-col gap-4 px-14 min-h-screen text-zinc-400">
        <div className="flex w-full justify-between items-center">
          Hey Nicolas, you have 13 ongoing tasks
          <div className="flex gap-3">
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => setShowBoardDialog(true)}
            >
              <Plus /> New Board
            </Button>
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => setShowDialog(true)}
            >
              <Plus />
              New Task
            </Button>
          </div>
        </div>
        
          <TaskView />
      </div>
      {showDialog && (
        <TaskDialog edit={false} onHide={() => setShowDialog(false)} />
      )}

      {showBoardDialog && (
        <BoardDialog edit={false} onHide={() => setShowBoardDialog(false)} />
      )}
    </>
  );
}

export default function AppWrapped() {
  return (
    <DBProvider>
      <App />
    </DBProvider>
  );
}

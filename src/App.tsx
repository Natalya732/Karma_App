import {  useState } from "react";
import TaskDialog from "@/features/task/entry/taskDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BoardDialog from "@/features/board/entry/boardDialog";
import { DBProvider } from "./shared/context/dbProvider";
import TaskView from "./features/task/views/taskView";


function App() {

  const [showDialog, setShowDialog] = useState(false);
  const [showBoardDialog, setShowBoardDialog] = useState(false);

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

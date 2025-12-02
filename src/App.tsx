import { useState } from "react";
import TaskDialog from "@/features/task/entry/taskDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BoardDialog from "@/features/board/entry/boardDialog";
import { DBProvider } from "./shared/context/dbProvider";

function App() {
  const [showDialog, setShowDialog] = useState(true);
  const [showBoardDialog, setShowBoardDialog] = useState(false);
  
  return (
    <>
      <div className="bg-gray-50 p-10 flex flex-col gap-2 h-screen w-screen text-zinc-400">
        <div className="flex w-full justify-between">
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

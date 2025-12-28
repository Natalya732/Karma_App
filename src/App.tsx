import { useEffect, useState } from "react";
import TaskDialog from "@/features/task/entry/taskDialog";
import { Button } from "@/components/ui/button";
import { Plus, Layout, Sparkles } from "lucide-react";
import BoardDialog from "@/features/board/entry/boardDialog";
import { DBProvider, useDb } from "./shared/context/dbProvider";
import TaskView from "./features/task/views/taskView";
import BoardSelector, { type Board } from "./features/board/components/boardSelector";
import { Database } from "./shared/utils/constants";

function App() {
  const [showDialog, setShowDialog] = useState(false);
  const [showBoardDialog, setShowBoardDialog] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { getAllValue, isDbConnecting } = useDb();

  async function loadBoards() {
    const allBoards = await getAllValue(Database.boardTable);
    setBoards(allBoards);
    
    // Set first board as default if available and no board is selected
    if (allBoards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(String(allBoards[0].id));
    }
  }

  useEffect(() => {
    if (!isDbConnecting) {
      loadBoards();
    }
  }, [isDbConnecting]);

  const handleBoardCreated = () => {
    setShowBoardDialog(false);
    loadBoards();
  };

  const handleTaskCreated = () => {
    setShowDialog(false);
    // Force TaskView to refresh by incrementing the refresh key
    setRefreshKey((prev) => prev + 1);
  };

  const selectedBoard = boards.find((b) => String(b.id) === selectedBoardId);

  return (
    <>
      <div className="app bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex w-full justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">Karma Tasks</h1>
              <p className="text-xs text-slate-400">Manage your daily tasks</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600"
              onClick={() => setShowBoardDialog(true)}
            >
              <Layout className="w-3.5 h-3.5 mr-1" /> Board
            </Button>
            <Button
              size="sm"
              className="cursor-pointer text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/25"
              onClick={() => setShowDialog(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Task
            </Button>
          </div>
        </div>

        {/* Board Selector */}
        <div className="flex items-center gap-3 px-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Board</span>
          <div className="h-px flex-1 bg-slate-800" />
          {boards.length > 0 ? (
            <BoardSelector
              boards={boards}
              selectedBoardId={selectedBoardId}
              onBoardChange={setSelectedBoardId}
            />
          ) : (
            <span className="text-xs text-slate-500 italic">
              No boards yet
            </span>
          )}
        </div>

        {/* Task View */}
        <TaskView
          key={refreshKey}
          selectedBoardId={selectedBoardId}
          boardName={selectedBoard?.boardName || ""}
        />
      </div>

      {showDialog && (
        <TaskDialog edit={false} onHide={handleTaskCreated} />
      )}

      {showBoardDialog && (
        <BoardDialog edit={false} onHide={handleBoardCreated} />
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

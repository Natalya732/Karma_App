import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "lucide-react";

export interface Board {
  id: number;
  boardName: string;
  boardDescription: string;
}

interface BoardSelectorProps {
  boards: Board[];
  selectedBoardId: string;
  onBoardChange: (boardId: string) => void;
}

export default function BoardSelector({
  boards,
  selectedBoardId,
  onBoardChange,
}: BoardSelectorProps) {
  return (
    <Select value={selectedBoardId} onValueChange={onBoardChange}>
      <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700/50 text-white cursor-pointer hover:bg-slate-700/50 transition-colors rounded-lg h-9">
        <div className="flex items-center gap-2">
          <Layout className="w-3.5 h-3.5 text-slate-400" />
          <SelectValue placeholder="Select board" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700 text-white">
        {boards.map((board) => (
          <SelectItem
            key={board.id}
            value={String(board.id)}
            className="cursor-pointer focus:bg-slate-700 focus:text-white"
          >
            {board.boardName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

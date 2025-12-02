import React from "react";
import { XCircle } from "lucide-react";
import BoardForm from "@/features/board/components/boardForm";
export default function BoardDialog({
  onHide,
  edit = false,
}: {
  onHide: () => void;
  edit: boolean;
}) {
  console.log({ onHide, edit });
  return (
    <div className="dialogOverlay">
      <div className="w-xl bg-zinc-50 border-0 text-zinc-500 rounded-xl p-4 border-2 z-20 border-zinc-300">
        <div className="dialogheader flex text-zinc-700 font-bold text-xl justify-between items-center">
          Create New Board
          <XCircle
            className=" text-zinc-400
          cursor-pointer"
            onClick={onHide}
          />
        </div>

        <div className="dialogForm mt-6">
          <BoardForm onHide={onHide} />
        </div>
      </div>
    </div>
  );
}

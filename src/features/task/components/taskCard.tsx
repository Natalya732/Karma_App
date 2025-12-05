import { useEffect, useState } from "react";
import { MessageSquareText, MoreHorizontal } from "lucide-react";
import type { TaskData } from "@/features/task/views/taskView";
import { capitalizeString } from "@/lib/utils";

export default function TaskCard({
  title,
  taskArr,
}: {
  title: string;
  taskArr: TaskData[];
}) {
  console.log("title", title, taskArr);
  
  const [activeTab, setActiveTab] = useState("tasks");
  const [showOverview, setShowOverview] = useState<string | null>(null);
  
  return (
    <div className="border-1 text-sm flex flex-col gap-3 border-gray-300 rounded-xl w-md py-5 px-7 h-lg">
      <div className="cardHeader flex w-full justify-between items-center">
        <div className="cardTitle font-bold text-gray-600">
          {capitalizeString(title)}
        </div>

        {/* --- Segmented Slider --- */}
        <div className="relative w-32 bg-gray-100 rounded-4xl p-2 flex justify-between gap-3 text-xs font-medium">
          {/* Highlight slider */}
          <div
            className={`
              absolute top-1 bottom-1 w-1/2 rounded-3xl bg-white shadow 
              transition-transform duration-300
              ${activeTab === "tasks" ? "-translate-x-1.5" : "translate-x-full"}
            `}
          />

          {/* Buttons */}
          <button
            onClick={() => setActiveTab("tasks")}
            className={`z-10 w-1/2 transition-colors cursor-pointer ${
              activeTab === "tasks" ? "text-black" : "text-gray-400"
            }`}
          >
            tasks
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`z-10 w-1/2 transition-colors cursor-pointer ${
              activeTab === "notes" ? "text-black" : "text-gray-400"
            }`}
          >
            notes
          </button>
        </div>

        <MoreHorizontal />
      </div>

      {/* --- Card Body --- */}
      <div
        className="cardBody flex flex-col overflow-auto p-3 gap-3"
        style={{ maxHeight: "300px" }}
      >
        {taskArr.map((item, idx) => (
          <>
            <div
              onClick={() => {
                setShowOverview(item.id);
              }}
              key={idx}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex gap-4 items-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm
              checked:bg-gray-600 checked:border-gray-600"
                />
                <p className="font-bold text-gray-600">{item.title}</p>
              </div>
              <div className="flex gap-3">
                {/* <span className="text-xs">
                  {item.dueDate.toLocaleDateString()}
                </span> */}
                <MessageSquareText className="w-4 h-4" />
              </div>
            </div>
            {showOverview === item.id && (
              <div className="bg-gray-100 p-4 flex flex-col gap-3 text-xs rounded-xl">
                <div className="flex items-center">
                  <div className="font-bold text-gray-400 flex flex-wrap gap-1">
                    {item.notes?.length
                      ? item.notes?.map((note) => (
                          <div className="border-2 border-gray-300 px-2 py-1 rounded-2xl">
                            {note.note}
                          </div>
                        ))
                      : "No Notes Found"}
                  </div>
                  <span className="text-xs ml-auto">
                    Due By {item.dueDate.toLocaleDateString()}
                  </span>
                </div>
                {item.description}
              </div>
            )}
          </>
        ))}
      </div>

      <div className="cardFooter mt-8">36 completed items</div>
    </div>
  );
}

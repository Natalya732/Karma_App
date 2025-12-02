import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export default function TaskCard() {
  const arr = ["afdlsalasdlaf;sdfsldfa;s", "Afdasdfasdaf", "adfadfa"];

  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div className="border-1 text-sm flex flex-col gap-3 border-gray-300 rounded-xl w-md py-5 px-7 h-lg">
      <div className="cardHeader flex w-full justify-between items-center">
        <div className="cardTitle font-bold text-gray-600">Work</div>

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
        {arr.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center cursor-pointer">
            <input
              type="checkbox"
              className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm
              checked:bg-gray-600 checked:border-gray-600"
            />
            <p className="font-bold text-gray-600">{item}</p>
          </div>
        ))}
      </div>

      <div className="cardFooter mt-8">36 completed items</div>
    </div>
  );
}

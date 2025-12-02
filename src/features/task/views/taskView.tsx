import React from "react";
import TaskCard from "../components/taskCard";

export default function TaskView() {
  return (
    <div className="flex justify-center gap-8 md:grid-cols-1 items-center mt-6 w-full flex-wrap">
      {Array.from({ length: 1 }).map((item, idx) => (
        <TaskCard />
      ))}
    </div>
  );
}

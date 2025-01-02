"use client";
import React, { useState } from "react";
// If you don't want icons, remove import & <Plus /> below.

interface Action {
  id: number;
  text: string;
  weight: number;
  completed: boolean;
}

export default function WeightedTodoList() {
  const [actions, setActions] = useState<Action[]>([]);
  const [newAction, setNewAction] = useState("");
  const [newWeight, setNewWeight] = useState("");

  // Add new action
  function handleAdd() {
    if (newAction.trim() && newWeight) {
      setActions((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: newAction,
          weight: Number(newWeight),
          completed: false,
        },
      ]);
      setNewAction("");
      setNewWeight("");
    }
  }

  // Reset entire list
  function handleReset() {
    setActions([]);
  }

  // Progress calculation
  const totalImpact = actions.reduce((sum, a) => sum + a.weight, 0);
  const completedImpact = actions.reduce(
    (sum, a) => sum + (a.completed ? a.weight : 0),
    0
  );
  const progressPercent = totalImpact
    ? (completedImpact / totalImpact) * 100
    : 0;

  return (
    <div
      className="
        relative
        min-h-screen
        bg-fixed bg-cover bg-center
        p-6 
        scroll-smooth
        flex items-center justify-center
      "
      style={{ backgroundImage: "url('/images/mountains.jpg')" }}
    >
      {/* 1) Subtle gradient overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-white/40
          to-white/80
          pointer-events-none
        "
      />

      {/* 2) Translucent Card */}
      <div
        className="
          relative
          z-10
          w-full max-w-2xl
          bg-white/90
          backdrop-blur-md
          rounded-3xl
          p-8
          shadow-2xl
          transition-all duration-300
        "
      >
        {/* Header + Progress Bar */}
        <div className="mb-4">
          <h1 className="text-3xl text-[#2B4C7E] font-bold text-center mb-2">
            Today is Your Masterpiece!
          </h1>
          <div className="flex items-center justify-between text-sm text-[#4A7AB8]">
            <span>{progressPercent.toFixed(1)}% Complete</span>
            <span className="opacity-60 text-gray-500">
              {completedImpact} / {totalImpact} Impact
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#4A7AB8] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Input + Button Row */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <input
            type="text"
            value={newAction}
            onChange={(e) => setNewAction(e.target.value)}
            placeholder="Add a new action"
            className="
              flex-1
              bg-transparent
              border-b border-gray-300
              py-2
              text-gray-700
              placeholder:text-gray-400
              focus:border-[#4A7AB8]
              focus:ring-2 focus:ring-[#4A7AB8]
              focus:outline-none
              transition-all duration-300
            "
          />
          <select
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="
              bg-transparent
              border-b border-gray-300
              py-2 min-w-[100px]
              text-gray-700
              focus:border-[#4A7AB8]
              focus:ring-2 focus:ring-[#4A7AB8]
              focus:outline-none
              transition-all duration-300
            "
          >
            <option value="" disabled>
              Impact
            </option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="
              w-10 h-10
              bg-[#4A7AB8]
              rounded-lg
              flex items-center justify-center
              hover:bg-[#2B4C7E]
              transform hover:scale-105
              active:scale-95
              focus:ring-2 focus:ring-[#4A7AB8]
              transition-all duration-300
              shadow-md
            "
          >
            +
          </button>
        </div>

        {/* Reset link */}
        <div className="text-right mt-6">
          <button
            onClick={handleReset}
            className="
              text-[#4A7AB8] text-sm
              hover:text-[#2B4C7E]
              focus:outline-none
              focus:ring-2 focus:ring-[#4A7AB8]
              transition-colors duration-300
            "
          >
            Reset List
          </button>
        </div>

        {/* Task list */}
        <ul className="mt-6 space-y-3">
          {actions.map((action) => (
            <li
              key={action.id}
              className="
                flex items-center gap-3
                text-gray-700
                p-2
                bg-white/70
                rounded-lg
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <input
                type="checkbox"
                checked={action.completed}
                onChange={() => {
                  setActions((prev) =>
                    prev.map((item) =>
                      item.id === action.id
                        ? { ...item, completed: !item.completed }
                        : item
                    )
                  );
                }}
                className="
                  cursor-pointer
                  rounded
                  focus:ring-[#4A7AB8]
                  focus:outline-none
                "
              />
              <span
                className={
                  action.completed
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }
              >
                {action.text} (Impact: {action.weight})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

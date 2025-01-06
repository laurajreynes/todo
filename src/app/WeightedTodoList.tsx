"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react"; // Optional icon, remove if not needed

interface Action {
  id: number;
  text: string;
  weight: number;
  completed: boolean;
  isEditing?: boolean; // to toggle edit mode
}

export default function WeightedTodoList() {
  const [actions, setActions] = useState<Action[]>([]);
  const [newAction, setNewAction] = useState("");
  const [newWeight, setNewWeight] = useState("");

  // 1) Load from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem("weightedActions");
    if (saved) {
      setActions(JSON.parse(saved));
    }
  }, []);

  // 2) Save to localStorage whenever actions change
  useEffect(() => {
    localStorage.setItem("weightedActions", JSON.stringify(actions));
  }, [actions]);

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
          isEditing: false,
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

  // Toggle completed
  function toggleComplete(id: number) {
    setActions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  // Enter/Exit edit mode
  function toggleEdit(id: number) {
    setActions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  }

  // Save edited text/weight
  function handleEditSave(id: number, newText: string, newWt: number) {
    setActions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, text: newText, weight: newWt, isEditing: false }
          : item
      )
    );
  }

  // Sort completed tasks to bottom
  const sortedActions = [...actions].sort((a, b) => {
    // If A is completed and B is not, move A down => return 1
    // If B is completed and A is not, move B down => return -1
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  // Calculate progress
  const totalImpact = actions.reduce((sum, a) => sum + a.weight, 0);
  const completedImpact = actions.reduce(
    (sum, a) => sum + (a.completed ? a.weight : 0),
    0
  );

  // Convert to integer, no decimals:
  const progressPercent = totalImpact
    ? Math.floor((completedImpact / totalImpact) * 100)
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
      {/* Gradient Overlay */}
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
        {/* Header + Progress */}
        <div className="mb-4">
          <h1 className="text-3xl text-[#2B4C7E] font-bold text-center mb-2">
            Today is Your Masterpiece!
          </h1>
          <div className="flex items-center justify-between text-sm text-[#4A7AB8]">
            <span>{progressPercent}% Complete</span>
            <span className="opacity-60 text-gray-500">
              {completedImpact} / {totalImpact}
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

        {/* New Action Inputs */}
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
            <Plus className="text-white" size={20} />
          </button>
        </div>

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

        {/* Render the sorted list of tasks */}
        <ul className="mt-6 space-y-3">
          {sortedActions.map((action) => (
            <li
              key={action.id}
              className="
                flex flex-col sm:flex-row 
                items-start sm:items-center
                justify-between
                text-gray-700
                p-2
                bg-white/70
                rounded-lg
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-0">
                {/* Complete Checkbox */}
                <input
                  type="checkbox"
                  checked={action.completed}
                  onChange={() => toggleComplete(action.id)}
                  className="
                    cursor-pointer
                    rounded
                    focus:ring-[#4A7AB8]
                    focus:outline-none
                  "
                />

                {/* Display vs Edit */}
                {action.isEditing ? (
                  // Editing mode
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={action.text}
                      id={`edit-text-${action.id}`}
                      className="
                        bg-transparent
                        border-b border-gray-300
                        text-gray-700
                        focus:border-[#4A7AB8]
                        focus:ring-2 focus:ring-[#4A7AB8]
                        focus:outline-none
                        transition-all
                        duration-300
                      "
                    />
                    <select
                      defaultValue={action.weight}
                      id={`edit-weight-${action.id}`}
                      className="
                        bg-transparent
                        border-b border-gray-300
                        text-gray-700
                        focus:border-[#4A7AB8]
                        focus:ring-2 focus:ring-[#4A7AB8]
                        focus:outline-none
                        transition-all
                        duration-300
                      "
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  // Normal display mode
                  <span
                    className={
                      action.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }
                  >
                    {action.text} ({action.weight})
                  </span>
                )}
              </div>

              {/* Edit/Save Buttons */}
              <div className="flex items-center gap-3">
                {action.isEditing ? (
                  <button
                    onClick={() => {
                      // Grab the values from inputs
                      const newText = (
                        document.getElementById(
                          `edit-text-${action.id}`
                        ) as HTMLInputElement
                      )?.value;
                      const newWt = parseInt(
                        (
                          document.getElementById(
                            `edit-weight-${action.id}`
                          ) as HTMLSelectElement
                        )?.value
                      );
                      handleEditSave(action.id, newText, newWt);
                    }}
                    className="
                      text-sm
                      bg-green-500
                      text-white
                      px-3 py-1
                      rounded
                      hover:bg-green-600
                      transition
                    "
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => toggleEdit(action.id)}
                    className="
                      text-sm
                      bg-gray-200
                      text-gray-700
                      px-3 py-1
                      rounded
                      hover:bg-gray-300
                      transition
                    "
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

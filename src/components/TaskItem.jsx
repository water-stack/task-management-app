import React, { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit, categories = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    priority: task.priority || "medium",
    category: task.category || "Other",
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
  });

  const id = task.id || task._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await onEdit(id, {
      ...task,
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
    });
    setIsEditing(false);
  };

  const priorityColor =
    (task.priority === "high" && "bg-red-100 text-red-800") ||
    (task.priority === "medium" && "bg-yellow-100 text-yellow-800") ||
    "bg-green-100 text-green-800";

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={!!task.completed}
            onChange={() => onToggle(id)}
            className="mt-1 h-5 w-5"
          />
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                />
                <textarea
                  className="w-full border rounded px-2 py-1"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  >
                    {(categories.length ? categories : ["Work","Personal","Shopping","Health","Finance","Other"]).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className={`font-semibold ${task.completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-600"}`}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                  {task.dueDate && (
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColor}`}>
                    {task.priority || "medium"}
                  </span>
                  {task.category && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                      {task.category}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
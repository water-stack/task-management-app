import React, { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit, categories }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editCategory, setEditCategory] = useState(task.category || "");
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

  const handleSave = () => {
    onEdit(task.id, {
      title: editTitle,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`border rounded-lg p-4 ${task.completed ? "bg-gray-50" : "bg-white"} ${isOverdue ? "border-red-300 bg-red-50" : ""}`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Task title"
          />
          <div className="flex space-x-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 border rounded text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-grow">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="mt-1 h-5 w-5"
            />
            <div className="flex-grow">
              <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.title}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.priority === "high" ? "bg-red-100 text-red-800" :
                  task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {task.priority}
                </span>
                {task.category && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {task.category}
                  </span>
                )}
                {task.dueDate && (
                  <span className={`px-2 py-1 rounded-full text-xs ${isOverdue ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                    {isOverdue ? "Overdue: " : "Due: "}{formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
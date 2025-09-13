export default function PriorityLegend() {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-sm font-medium text-gray-700">Priority:</span>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="text-sm">High</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="text-sm">Medium</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="text-sm">Low</span>
      </div>
    </div>
  );
}
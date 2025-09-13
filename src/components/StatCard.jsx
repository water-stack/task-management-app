export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 text-xl mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
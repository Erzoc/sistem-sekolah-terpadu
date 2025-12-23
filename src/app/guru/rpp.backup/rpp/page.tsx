export default function RPPPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">RPP Workspace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Kaldik', 'Prota', 'Prosem', 'Library'].map((item) => (
          <div key={item} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900">{item}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Kelola {item.toLowerCase()} pembelajaran Anda
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

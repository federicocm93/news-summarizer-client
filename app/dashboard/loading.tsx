export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1e3b] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-[#0a1e3b]">Loading your dashboard...</h2>
      </div>
    </div>
  )
}

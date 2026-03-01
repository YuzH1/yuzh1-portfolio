import { AdminDashboard } from '@/components/AdminDashboard'

export default function AdminPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">后台管理</h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理你的项目和个人资料
          </p>
        </div>

        {/* Dashboard */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800">
          <AdminDashboard />
        </div>
      </div>
    </div>
  )
}
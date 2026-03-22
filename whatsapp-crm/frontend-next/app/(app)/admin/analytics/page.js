'use client'

import { motion } from 'framer-motion'
import { BarChart3Icon, UsersIcon, MessageSquareIcon, SendIcon, DownloadIcon } from 'lucide-react'
import { mockUsers } from '@/data/mockData'

const SEED = [42341, 3821, 18204, 47392, 9103, 28571, 11234, 39482]

export default function AdminAnalyticsPage() {
  const analyticsData = mockUsers.map((u, i) => ({
    ...u,
    totalMessages: (SEED[i] % 50000) + 1000,
    messagesThisMonth: (SEED[i] % 5000) + 100,
    campaignsRun: (SEED[i] % 50) + 2,
    activeContacts: (SEED[i] % 10000) + 500,
  })).sort((a, b) => b.totalMessages - a.totalMessages)

  const totalPlatformMessages = analyticsData.reduce((acc, curr) => acc + curr.totalMessages, 0)
  const totalPlatformCampaigns = analyticsData.reduce((acc, curr) => acc + curr.campaignsRun, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-500 mt-1">Global usage statistics across all tenants.</p>
        </div>
        <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm cursor-pointer">
          <DownloadIcon className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: mockUsers.length, icon: UsersIcon, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Total Messages Sent', value: totalPlatformMessages.toLocaleString(), icon: MessageSquareIcon, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Total Campaigns', value: totalPlatformCampaigns.toLocaleString(), icon: SendIcon, bg: 'bg-purple-50', color: 'text-purple-600' },
          { label: 'Active Sessions', value: Math.floor(mockUsers.length * 0.8), icon: BarChart3Icon, bg: 'bg-amber-50', color: 'text-amber-600' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <h4 className="text-gray-500 text-sm font-medium mb-1">{label}</h4>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50"><h3 className="font-semibold text-gray-900">Usage by User</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                {['User', 'Total Messages', 'This Month', 'Campaigns', 'Contacts'].map((h) => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'User' ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analyticsData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.username}</div>
                    <div className="text-xs text-gray-500">{data.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">{data.totalMessages.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{data.messagesThisMonth.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{data.campaignsRun.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{data.activeContacts.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

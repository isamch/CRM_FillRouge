'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SendIcon, BellIcon, UsersIcon } from 'lucide-react'
import { mockUsers, mockNotifications } from '@/data/mockData'

export default function AdminNotificationsPage() {
  const [recipient, setRecipient] = useState('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const adminSentNotifications = mockNotifications.filter((n) => n.senderId === 'u1')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="lg:col-span-2 mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Broadcast Notifications</h1>
        <p className="text-gray-500 mt-1">Send in-app alerts and updates to users.</p>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center">
          <BellIcon className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="font-semibold text-gray-900">Compose Message</h2>
        </div>
        <div className="p-6 flex-1 flex flex-col space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <div className="relative">
              <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none bg-white appearance-none">
                <option value="all">All Users (Broadcast)</option>
                {mockUsers.filter((u) => u.role !== 'admin').map((u) => (
                  <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                ))}
              </select>
              <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Scheduled Maintenance Notice" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none" />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type your notification message here..." className="w-full flex-1 min-h-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none" />
          </div>
          <button disabled={!subject || !body} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <SendIcon className="w-4 h-4 mr-2" /> Send Notification
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200 bg-gray-50"><h2 className="font-semibold text-gray-900">Sent History</h2></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-gray-100">
            {adminSentNotifications.map((notification) => (
              <div key={notification.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{notification.subject}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{new Date(notification.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-blue-600 font-medium mb-2">To: {notification.recipientId === 'u1' ? 'All Users' : 'Specific User'}</div>
                <p className="text-sm text-gray-600 line-clamp-2">{notification.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

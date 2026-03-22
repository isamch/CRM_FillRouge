'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BellIcon, Trash2Icon, CheckIcon } from 'lucide-react'
import { mockNotifications } from '@/data/mockData'
import { PageHeader, EmptyState } from '@/components/ui'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [expandedId, setExpandedId] = useState(null)

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n))
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications"
        description="Updates and alerts from the platform admin."
        action={
          <button onClick={markAllRead} className="text-sm font-medium text-whatsapp hover:text-whatsapp-hover flex items-center transition-colors cursor-pointer">
            <CheckIcon className="w-4 h-4 mr-1" /> Mark all as read
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-5 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50/30' : ''}`} onClick={() => handleExpand(notification.id)}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start flex-1">
                    <div className="mt-1 mr-4">
                      {!notification.isRead ? <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"></div> : <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-base ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notification.subject}</h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                      {expandedId === notification.id ? (
                        <div className="mt-3 text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">{notification.body}</div>
                      ) : (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{notification.body}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={(e) => handleDelete(e, notification.id)} className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={BellIcon} title="All caught up!" description="You don't have any notifications right now." />
        )}
      </div>
    </motion.div>
  )
}

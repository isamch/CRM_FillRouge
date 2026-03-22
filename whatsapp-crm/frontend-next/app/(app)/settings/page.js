'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { UserIcon, LockIcon, SmartphoneIcon, ShieldAlertIcon } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { PageHeader, FormField } from '@/components/ui'

export default function SettingsPage() {
  const { user, sessionStatus, setSessionStatus } = useApp()
  const currentUser = user || {}
  const router = useRouter()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-4xl mx-auto">
      <PageHeader title="Account Settings" description="Manage your profile, security, and connections." />

      <div className="space-y-8">
        {/* Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center bg-gray-50">
            <UserIcon className="w-5 h-5 text-gray-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden mr-6">
                {currentUser.avatarUrl ? <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-8 h-8 text-gray-400" />}
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Change Avatar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Username">
                <input type="text" defaultValue={currentUser.username} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none" />
              </FormField>
              <FormField label="Email Address">
                <input type="email" defaultValue={currentUser.email} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none bg-gray-50" readOnly />
              </FormField>
            </div>
            <div className="flex justify-end pt-2">
              <button className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>

        {/* WhatsApp Connection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center bg-gray-50">
            <SmartphoneIcon className="w-5 h-5 text-gray-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp Connection</h2>
          </div>
          <div className="p-6">
            {sessionStatus === 'connected' ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-green-50 border border-green-100 rounded-lg p-5">
                <div>
                  <div className="flex items-center mb-1"><span className="flex h-2.5 w-2.5 bg-whatsapp rounded-full mr-2"></span><h3 className="font-semibold text-green-800">Connected</h3></div>
                  <p className="text-sm text-green-700">Your account is linked to <strong className="font-mono">+1 (555) 123-4567</strong></p>
                </div>
                <button onClick={() => setSessionStatus('disconnected')} className="mt-4 md:mt-0 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center cursor-pointer">
                  <ShieldAlertIcon className="w-4 h-4 mr-2" /> Disconnect Device
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div>
                  <div className="flex items-center mb-1"><span className="flex h-2.5 w-2.5 bg-gray-400 rounded-full mr-2"></span><h3 className="font-semibold text-gray-700">Disconnected</h3></div>
                  <p className="text-sm text-gray-500">Connect your WhatsApp to start sending campaigns.</p>
                </div>
                <button onClick={() => router.push('/')} className="mt-4 md:mt-0 px-4 py-2 bg-whatsapp text-white rounded-lg text-sm font-medium hover:bg-whatsapp-hover transition-colors cursor-pointer">Go to Dashboard to Connect</button>
              </div>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center bg-gray-50">
            <LockIcon className="w-5 h-5 text-gray-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Current Password">
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none" />
              </FormField>
              <div className="hidden md:block"></div>
              <FormField label="New Password">
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none" />
              </FormField>
              <FormField label="Confirm New Password">
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none" />
              </FormField>
            </div>
            <div className="flex justify-end pt-2">
              <button className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">Update Password</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

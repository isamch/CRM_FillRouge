'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  MessageSquareIcon, UsersIcon, SendIcon, TrendingUpIcon,
  SmartphoneIcon, QrCodeIcon, CheckCircle2Icon, PlusIcon,
  UploadIcon, FileTextIcon, ActivityIcon,
} from 'lucide-react'
import { mockCampaigns } from '@/data/mockData'
import { useApp } from '@/context/AppContext'
import { StatCard, Modal } from '@/components/ui'

export default function DashboardPage() {
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrScanned, setQrScanned] = useState(false)
  const { sessionStatus, setSessionStatus } = useApp()
  const router = useRouter()

  const handleConnect = () => {
    setShowQrModal(true)
    setTimeout(() => {
      setQrScanned(true)
      setTimeout(() => {
        setSessionStatus('connected')
        setShowQrModal(false)
        setQrScanned(false)
      }, 1500)
    }, 3000)
  }

  const activeCampaignsCount = mockCampaigns.filter((c) => c.status === 'running' || c.status === 'paused').length
  const completedThisMonth = mockCampaigns.filter((c) => c.status === 'completed').length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto">

      {/* WhatsApp Connection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${sessionStatus === 'connected' ? 'bg-green-100 text-whatsapp' : 'bg-red-100 text-red-500'}`}>
            <SmartphoneIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp Connection</h2>
            {sessionStatus === 'connected' ? (
              <div className="flex items-center mt-1">
                <span className="flex h-2.5 w-2.5 bg-whatsapp rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Connected as <strong className="text-gray-900">+1 (555) 123-4567</strong></span>
              </div>
            ) : (
              <div className="flex items-center mt-1">
                <span className="flex h-2.5 w-2.5 bg-red-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Disconnected. Scan QR code to connect.</span>
              </div>
            )}
          </div>
        </div>
        {sessionStatus === 'disconnected' ? (
          <button onClick={handleConnect} className="bg-whatsapp hover:bg-whatsapp-hover text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-sm">
            <QrCodeIcon className="w-5 h-5 mr-2" /> Connect WhatsApp
          </button>
        ) : (
          <button onClick={() => setSessionStatus('disconnected')} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium transition-colors">
            Disconnect
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Messages Today" value="1,248" icon={MessageSquareIcon} trend="+12%" trendUp={true} />
        <StatCard title="Messages This Week" value="8,430" icon={TrendingUpIcon} trend="+5%" trendUp={true} />
        <StatCard title="Total Contacts" value="4,585" icon={UsersIcon} trend="+120 new" trendUp={true} />
        <StatCard title="Active Campaigns" value={activeCampaignsCount.toString()} icon={SendIcon} />
      </div>

      {/* Campaign Overview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Overview</h3>
            <button onClick={() => router.push('/campaigns')} className="text-sm text-whatsapp hover:text-whatsapp-hover font-medium">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Running</p>
              <p className="text-2xl font-bold text-gray-900">{activeCampaignsCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Completed (Month)</p>
              <p className="text-2xl font-bold text-gray-900">{completedThisMonth}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-green-700 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-700">98.4%</p>
            </div>
          </div>
          <div className="space-y-4">
            {mockCampaigns.slice(0, 3).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${campaign.status === 'running' ? 'bg-whatsapp animate-pulse' : campaign.status === 'completed' ? 'bg-gray-400' : 'bg-amber-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-xs text-gray-500">{campaign.sentCount} / {campaign.totalContacts} sent • {campaign.status}</p>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${campaign.status === 'running' ? 'bg-whatsapp' : 'bg-gray-400'}`} style={{ width: `${campaign.sentCount / campaign.totalContacts * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'New Campaign', icon: PlusIcon, href: '/campaigns' },
                { label: 'Import Contacts', icon: UploadIcon, href: '/contacts' },
                { label: 'Create Template', icon: FileTextIcon, href: '/templates' },
              ].map(({ label, icon: Icon, href }) => (
                <button key={label} onClick={() => router.push(href)} className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-whatsapp hover:bg-green-50 transition-colors group">
                  <div className="bg-gray-100 group-hover:bg-whatsapp/10 p-2 rounded-md mr-3 text-gray-600 group-hover:text-whatsapp transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-whatsapp transition-colors">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ActivityIcon className="w-5 h-5 mr-2 text-gray-400" /> Recent Activity
            </h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              <ActivityItem title="Campaign Completed" desc="March Webinar Invites finished." time="2 hours ago" type="success" />
              <ActivityItem title="Contacts Imported" desc="850 contacts added to Leads." time="5 hours ago" type="info" />
              <ActivityItem title="Template Created" desc="Feedback Request template saved." time="1 day ago" type="default" />
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <Modal onClose={() => setShowQrModal(false)}>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect WhatsApp</h2>
            <p className="text-gray-600 mb-8">Open WhatsApp on your phone, tap Menu or Settings and select Linked Devices. Point your phone to this screen to capture the code.</p>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 inline-block mb-8 relative">
              {qrScanned ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-48 h-48 flex flex-col items-center justify-center text-whatsapp">
                  <CheckCircle2Icon className="w-16 h-16 mb-4" />
                  <span className="font-medium">Connected successfully!</span>
                </motion.div>
              ) : (
                <div className="w-48 h-48 bg-white border-8 border-white shadow-sm relative">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className={`bg-gray-900 ${Math.random() > 0.5 ? 'rounded-sm' : 'rounded-none'}`} style={{ opacity: Math.random() > 0.3 ? 1 : 0 }}></div>
                    ))}
                  </div>
                  <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0 h-0.5 bg-whatsapp shadow-[0_0_8px_2px_rgba(37,211,102,0.5)] z-10" />
                </div>
              )}
            </div>
            <button onClick={() => setShowQrModal(false)} className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors">Cancel</button>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}



function ActivityItem({ title, desc, time, type }) {
  const config = {
    success: { bg: 'bg-whatsapp', icon: <CheckCircle2Icon className="w-4 h-4 text-white" /> },
    info: { bg: 'bg-blue-500', icon: <UsersIcon className="w-4 h-4 text-white" /> },
    default: { bg: 'bg-gray-500', icon: <FileTextIcon className="w-4 h-4 text-white" /> },
  }
  const { bg, icon } = config[type] || config.default
  return (
    <div className="relative flex items-start space-x-3">
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm ${bg}`}>{icon}</div>
      <div className="flex-1 min-w-0 bg-gray-50 rounded-lg p-3 border border-gray-100">
        <div className="flex justify-between items-center mb-0.5">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  )
}

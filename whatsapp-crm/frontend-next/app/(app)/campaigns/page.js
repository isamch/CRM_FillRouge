'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon, PlayIcon, PauseIcon, SquareIcon, ClockIcon,
  CheckCircle2Icon, AlertTriangleIcon, SearchIcon, FilterIcon, ChevronRightIcon,
} from 'lucide-react'
import { mockCampaigns, mockTemplates, mockContactLists } from '@/data/mockData'
import { Badge, SearchInput, PageHeader } from '@/components/ui'

function getStatusBadge(status) {
  return <Badge status={status} />
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  const filteredCampaigns = mockCampaigns.filter((c) => activeTab === 'all' || c.status === activeTab)

  if (selectedCampaign) return <CampaignDetail campaign={selectedCampaign} onBack={() => setSelectedCampaign(null)} />
  if (isCreating) return <CampaignCreate onCancel={() => setIsCreating(false)} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <PageHeader
        title="Campaigns"
        description="Manage and track your bulk messaging campaigns."
        action={
          <button onClick={() => setIsCreating(true)} className="bg-whatsapp hover:bg-whatsapp-hover text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-sm cursor-pointer">
            <PlusIcon className="w-5 h-5 mr-2" /> New Campaign
          </button>
        }
      />

      <div className="bg-white border-b border-gray-200 rounded-t-xl px-4 flex space-x-6">
        {['all', 'running', 'scheduled', 'completed', 'stopped'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors capitalize cursor-pointer ${activeTab === tab ? 'border-whatsapp text-whatsapp' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab}</button>
        ))}
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between bg-gray-50/50">
          <SearchInput value="" onChange={() => {}} placeholder="Search campaigns..." className="w-72" />
          <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 cursor-pointer">
            <FilterIcon className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {['Campaign Name', 'Status', 'Progress', 'Sent / Failed', 'Date', 'Action'].map((h) => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Action' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCampaigns.map((campaign) => {
                const progress = (campaign.sentCount + campaign.failedCount) / campaign.totalContacts * 100
                const list = mockContactLists.find((l) => l.id === campaign.listId)
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedCampaign(campaign)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">List: {list?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap w-48">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div className={`h-2 rounded-full ${campaign.status === 'running' ? 'bg-whatsapp' : 'bg-gray-400'}`} style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 w-8">{Math.round(progress)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-green-600 font-medium">{campaign.sentCount}</span> / <span className="text-red-500">{campaign.failedCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.startedAt ? new Date(campaign.startedAt).toLocaleDateString() : campaign.scheduledAt ? new Date(campaign.scheduledAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 group-hover:text-whatsapp transition-colors cursor-pointer"><ChevronRightIcon className="w-5 h-5" /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

function CampaignDetail({ campaign, onBack }) {
  const progress = (campaign.sentCount + campaign.failedCount) / campaign.totalContacts * 100
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 max-w-5xl mx-auto">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-900 mb-6 flex items-center text-sm font-medium transition-colors cursor-pointer">
        <ChevronRightIcon className="w-4 h-4 mr-1 rotate-180" /> Back to Campaigns
      </button>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1" /> Started: {campaign.startedAt ? new Date(campaign.startedAt).toLocaleString() : 'N/A'}</span>
              <span>•</span>
              <span>Rate: {campaign.ratePerMinute} msgs/min</span>
            </div>
          </div>
          <div className="flex space-x-3">
            {campaign.status === 'running' && (
              <>
                <button className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-medium flex items-center hover:bg-amber-200 transition-colors cursor-pointer"><PauseIcon className="w-4 h-4 mr-2" /> Pause</button>
                <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium flex items-center hover:bg-red-200 transition-colors cursor-pointer"><SquareIcon className="w-4 h-4 mr-2" /> Stop</button>
              </>
            )}
            {campaign.status === 'paused' && (
              <button className="px-4 py-2 bg-whatsapp text-white rounded-lg font-medium flex items-center hover:bg-whatsapp-hover transition-colors cursor-pointer"><PlayIcon className="w-4 h-4 mr-2" /> Resume</button>
            )}
          </div>
        </div>
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-2xl font-bold text-gray-900">{campaign.sentCount + campaign.failedCount} / {campaign.totalContacts} <span className="text-gray-400 text-lg font-normal ml-2">— {Math.round(progress)}%</span></span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="flex h-full">
              <div className="bg-whatsapp h-full transition-all duration-500" style={{ width: `${campaign.sentCount / campaign.totalContacts * 100}%` }}></div>
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${campaign.failedCount / campaign.totalContacts * 100}%` }}></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Status', value: campaign.status, cls: 'bg-gray-50 border-gray-100 text-gray-900', lCls: 'text-gray-500' },
            { label: 'Successfully Sent', value: campaign.sentCount, cls: 'bg-green-50 border-green-100 text-green-700', lCls: 'text-green-700' },
            { label: 'Failed', value: campaign.failedCount, cls: 'bg-red-50 border-red-100 text-red-700', lCls: 'text-red-700' },
            { label: 'Pending', value: campaign.totalContacts - campaign.sentCount - campaign.failedCount, cls: 'bg-gray-50 border-gray-100 text-gray-900', lCls: 'text-gray-500' },
          ].map(({ label, value, cls, lCls }) => (
            <div key={label} className={`rounded-lg p-4 border ${cls}`}>
              <p className={`text-sm mb-1 ${lCls}`}>{label}</p>
              <p className={`text-lg font-semibold capitalize ${cls.includes('gray-900') ? 'text-gray-900' : ''}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50"><h3 className="font-semibold text-gray-900">Delivery Log</h3></div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>{['Contact', 'Phone', 'Status', 'Time'].map((h) => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-6 py-3 text-sm text-gray-900">Contact Name {i}</td>
                <td className="px-6 py-3 text-sm text-gray-500 font-mono">+1 555 000 {i}000</td>
                <td className="px-6 py-3">{i === 3 ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Failed</span> : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Sent</span>}</td>
                <td className="px-6 py-3 text-sm text-gray-500">10:{10 + i} AM</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function CampaignCreate({ onCancel }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Create New Campaign</h2>
          <p className="text-sm text-gray-500 mt-1">Configure your bulk message broadcast.</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <input type="text" placeholder="e.g., Spring Promo 2026" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Template</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none bg-white">
                <option value="">Choose a template...</option>
                {mockTemplates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Contact List</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp outline-none bg-white">
                <option value="">Choose a list...</option>
                {mockContactLists.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.contactCount} contacts)</option>)}
              </select>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
            <AlertTriangleIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Variable Mapping Required</h4>
              <p className="text-xs text-blue-600 mt-1">The selected template uses variables. Map them to contact fields below.</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex items-center text-sm">
                  <span className="font-mono bg-white px-2 py-1 rounded border border-blue-200 text-blue-800 mr-2">{`{{name}}`}</span>
                  <span className="text-gray-500 mr-2">→</span>
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs"><option>Contact Name</option></select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sending Speed (Rate Limit)</label>
            <div className="flex items-center space-x-4">
              <input type="range" min="1" max="60" defaultValue="15" className="flex-1 accent-whatsapp" />
              <span className="text-sm font-medium text-gray-900 w-24 text-right">15 msgs/min</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Slower speeds reduce the risk of WhatsApp bans.</p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button onClick={onCancel} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">Cancel</button>
          <div className="flex space-x-3">
            <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center cursor-pointer"><ClockIcon className="w-4 h-4 mr-2" /> Schedule</button>
            <button className="px-5 py-2.5 bg-whatsapp text-white rounded-lg font-medium hover:bg-whatsapp-hover transition-colors shadow-sm flex items-center cursor-pointer"><PlayIcon className="w-4 h-4 mr-2" /> Run Now</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

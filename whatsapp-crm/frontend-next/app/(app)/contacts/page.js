'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRightIcon, ChevronDownIcon, PlusIcon, UploadIcon,
  CheckCircle2Icon, XCircleIcon, HelpCircleIcon, SearchIcon,
  EditIcon, Trash2Icon, RefreshCwIcon,
} from 'lucide-react'
import { mockCategories, mockContactLists, mockContacts } from '@/data/mockData'
import { Badge, SearchInput } from '@/components/ui'

export default function ContactsPage() {
  const [expandedCategories, setExpandedCategories] = useState({ cat1: true, cat2: true })
  const [selectedListId, setSelectedListId] = useState(mockContactLists[0].id)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleCategory = (id) => setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }))

  const selectedList = mockContactLists.find((l) => l.id === selectedListId)
  const categoryForList = mockCategories.find((c) => c.id === selectedList?.categoryId)
  const listContacts = mockContacts.filter((c) => c.listId === selectedListId)
  const filteredContacts = listContacts.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phoneNumber.includes(searchQuery)
  )

  const validCount = listContacts.filter((c) => c.validationStatus === 'valid').length
  const invalidCount = listContacts.filter((c) => c.validationStatus === 'invalid').length
  const unknownCount = listContacts.filter((c) => c.validationStatus === 'unknown').length

  const getStatusBadge = (status) => <Badge status={status} />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-800">Categories</h2>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors cursor-pointer"><PlusIcon className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {mockCategories.map((category) => {
            const isExpanded = expandedCategories[category.id]
            const categoryLists = mockContactLists.filter((l) => l.categoryId === category.id)
            return (
              <div key={category.id} className="mb-2">
                <button onClick={() => toggleCategory(category.id)} className="w-full flex items-center px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors group cursor-pointer">
                  {isExpanded ? <ChevronDownIcon className="w-4 h-4 mr-1 text-gray-400" /> : <ChevronRightIcon className="w-4 h-4 mr-1 text-gray-400" />}
                  {category.name}
                </button>
                {isExpanded && (
                  <div className="mt-1 ml-5 space-y-1 border-l border-gray-200 pl-2">
                    {categoryLists.map((list) => (
                      <button key={list.id} onClick={() => setSelectedListId(list.id)} className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${selectedListId === list.id ? 'bg-green-50 text-whatsapp font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <span className="truncate pr-2">{list.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedListId === list.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{list.contactCount}</span>
                      </button>
                    ))}
                    <button className="w-full flex items-center px-3 py-1.5 text-xs text-gray-400 hover:text-whatsapp transition-colors mt-1 cursor-pointer">
                      <PlusIcon className="w-3 h-3 mr-1" /> Add List
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-page overflow-hidden">
        {selectedList ? (
          <>
            <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{categoryForList?.name}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">Created {new Date(selectedList.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedList.name}</h1>
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                    <UploadIcon className="w-4 h-4 mr-2" /> Import CSV
                  </button>
                  <button className="flex items-center px-4 py-2 bg-whatsapp text-white rounded-lg text-sm font-medium hover:bg-whatsapp-hover transition-colors shadow-sm cursor-pointer">
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Contact
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                <div className="flex space-x-6">
                  {[{ color: 'bg-green-500', count: validCount, label: 'Valid' }, { color: 'bg-red-500', count: invalidCount, label: 'Invalid' }, { color: 'bg-gray-400', count: unknownCount, label: 'Unknown' }].map(({ color, count, label }) => (
                    <div key={label} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${color} mr-2`}></div>
                      <span className="text-sm text-gray-600"><strong className="text-gray-900">{count}</strong> {label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                    <RefreshCwIcon className="w-4 h-4 mr-1.5" /> Validate All
                  </button>
                  <button className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer">
                    <Trash2Icon className="w-4 h-4 mr-1.5" /> Clear Invalid
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <div className="relative w-64">
                    <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search contacts..." className="w-64" />
                  </div>
                  <div className="text-sm text-gray-500">Showing {filteredContacts.length} of {listContacts.length} contacts</div>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        {['', 'Name', 'Phone Number', 'Status', 'Notes', 'Actions'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h === '' ? <input type="checkbox" className="rounded border-gray-300 text-whatsapp focus:ring-whatsapp" /> : h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300 text-whatsapp focus:ring-whatsapp" /></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{contact.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(contact.validationStatus)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]">{contact.notes || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-gray-400 hover:text-blue-600 mx-2 transition-colors cursor-pointer"><EditIcon className="w-4 h-4" /></button>
                            <button className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"><Trash2Icon className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                      {filteredContacts.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No contacts found matching your search.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a list to view contacts</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

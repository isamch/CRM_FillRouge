'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, SearchIcon, CopyIcon, EditIcon, Trash2Icon, MessageSquareIcon, AlertCircleIcon, BookOpenIcon } from 'lucide-react'
import { mockTemplates } from '@/data/mockData'
import { SearchInput } from '@/components/ui'

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [body, setBody] = useState('')

  const filteredTemplates = mockTemplates.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template)
    setName(template.name)
    setBody(template.body)
    setIsEditing(true)
  }

  const handleNewTemplate = () => {
    setSelectedTemplate(null)
    setName('')
    setBody('')
    setIsEditing(true)
  }

  const insertVariable = (variable) => setBody((prev) => prev + `{{${variable}}}`)

  const generatePreview = (text) =>
    text
      .replace(/\{\{name\}\}/g, 'John Doe')
      .replace(/\{\{company\}\}/g, 'Acme Corp')
      .replace(/\{\{offer\}\}/g, '20% OFF')
      .replace(/\{\{discount\}\}/g, '20%')
      .replace(/\{\{code\}\}/g, 'SAVE20')
      .replace(/\{\{topic\}\}/g, 'Future of AI')
      .replace(/\{\{link\}\}/g, 'https://zoom.us/j/123')
      .replace(/\{\{plan\}\}/g, 'Pro Tier')
      .replace(/\{\{[^}]+\}\}/g, '[Value]')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex p-6 space-x-6 max-w-[1600px] mx-auto">
      {/* Template List */}
      <div className="w-1/3 min-w-[350px] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Message Templates</h2>
          <button onClick={handleNewTemplate} className="p-2 bg-whatsapp text-white rounded-lg hover:bg-whatsapp-hover transition-colors shadow-sm cursor-pointer"><PlusIcon className="w-4 h-4" /></button>
        </div>
        <div className="p-4 border-b border-gray-100">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search templates..." />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredTemplates.map((template) => (
            <div key={template.id} onClick={() => handleSelectTemplate(template)} className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedTemplate?.id === template.id ? 'bg-green-50 border-l-4 border-l-whatsapp' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"><CopyIcon className="w-3.5 h-3.5" /></button>
                  <button className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"><Trash2Icon className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{template.body}</p>
              <div className="flex items-center text-xs text-gray-400">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 mr-2">{template.variables.length} variables</span>
                <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isEditing ? (
          <>
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">{selectedTemplate ? 'Edit Template' : 'Create New Template'}</h2>
              <div className="flex space-x-3">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button className="px-4 py-2 bg-whatsapp text-white rounded-lg text-sm font-medium hover:bg-whatsapp-hover transition-colors shadow-sm cursor-pointer">Save Template</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Welcome Message" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp" />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-medium text-gray-700">Message Body</label>
                    <span className="text-xs text-gray-500">{body.length} / 1024 chars</span>
                  </div>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Type your message here..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp/50 focus:border-whatsapp resize-none font-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insert Variables</label>
                  <div className="flex flex-wrap gap-2">
                    {['name', 'company', 'offer', 'link'].map((v) => (
                      <button key={v} onClick={() => insertVariable(v)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md text-sm font-mono text-gray-700 transition-colors cursor-pointer">{`{{${v}}}`}</button>
                    ))}
                    <button className="px-3 py-1.5 border border-dashed border-gray-300 hover:border-gray-400 rounded-md text-sm text-gray-500 transition-colors flex items-center cursor-pointer"><PlusIcon className="w-3 h-3 mr-1" /> Custom</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-start"><AlertCircleIcon className="w-4 h-4 mr-1 flex-shrink-0" />Variables will be replaced with actual contact data when sending campaigns.</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col">
                <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center"><MessageSquareIcon className="w-4 h-4 mr-2" /> Live Preview</h3>
                <div className="flex-1 bg-[#efeae2] rounded-lg border border-gray-300 overflow-hidden relative flex flex-col p-4 shadow-inner">
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")' }} />
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%] relative z-10 self-start rounded-tl-none mt-2">
                    <div className="absolute top-0 -left-2 w-3 h-3 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                    <p className="text-[15px] text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {body ? generatePreview(body) : <span className="text-gray-400 italic">Start typing to see preview...</span>}
                    </p>
                    <div className="text-right mt-1"><span className="text-[10px] text-gray-400">12:00 PM</span></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg">Select a template to edit or create a new one.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

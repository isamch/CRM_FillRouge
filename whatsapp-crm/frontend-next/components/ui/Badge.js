import { CheckCircle2Icon, XCircleIcon, HelpCircleIcon, PauseIcon, ClockIcon, SquareIcon } from 'lucide-react'

const variants = {
  valid:     { cls: 'bg-green-100 text-green-700',  Icon: CheckCircle2Icon, label: 'Valid' },
  invalid:   { cls: 'bg-red-100 text-red-700',      Icon: XCircleIcon,      label: 'Invalid' },
  unknown:   { cls: 'bg-gray-100 text-gray-700',    Icon: HelpCircleIcon,   label: 'Unknown' },
  running:   { cls: 'bg-green-100 text-green-800',  pulse: true,            label: 'Running' },
  completed: { cls: 'bg-gray-100 text-gray-800',    Icon: CheckCircle2Icon, label: 'Completed' },
  paused:    { cls: 'bg-amber-100 text-amber-800',  Icon: PauseIcon,        label: 'Paused' },
  scheduled: { cls: 'bg-blue-100 text-blue-800',    Icon: ClockIcon,        label: 'Scheduled' },
  stopped:   { cls: 'bg-red-100 text-red-800',      Icon: SquareIcon,       label: 'Stopped' },
}

export default function Badge({ status, label }) {
  const v = variants[status]
  if (!v) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{label || status}</span>

  const { cls, Icon, pulse } = v
  const text = label || v.label

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {pulse && <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse" />}
      {Icon && !pulse && <Icon className="w-3 h-3 mr-1" />}
      {text}
    </span>
  )
}

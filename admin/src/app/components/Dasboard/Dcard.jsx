import React from 'react'

const Dcard = (Props) => {
  return (
    <div className={`saturated-card p-6 rounded-2xl border border-emerald-100 shadow-lg ${Props.bg} text-white flex items-center gap-4`}>
      <div className="info">
        <p className="text-sm text-white/85">{Props.title}</p>
        <p className="text-3xl font-bold tracking-tight">{Props.count}</p>
      </div>
    </div>
  )
}

export default Dcard

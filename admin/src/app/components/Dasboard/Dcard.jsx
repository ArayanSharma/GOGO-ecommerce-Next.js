import React from 'react'

const Dcard = (Props) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg bg-gradient-to-br ${Props.bg} text-white flex items-center gap-4`}  >
      <div className="info">
        <p className="text-sm text-slate-300">{Props.title}</p>
        <p className="text-2xl font-bold">{Props.count}</p>
      </div>
    </div>
  )
}

export default Dcard

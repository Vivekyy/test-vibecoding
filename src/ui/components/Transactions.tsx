import React from 'react'
import dayjs from 'dayjs'

export default function Transactions({logs}:{logs:any[]}){
  if(logs.length===0) return <div className="empty" />
  return (
    <div className="logs">
      {logs.map((l,i)=> (
        <div className="log" key={i}>
          <div className="time">{dayjs(l.time).format('MMM D, h:mm a')}</div>
          <div className="desc">{l.type} — {l.desc || JSON.stringify(l)}</div>
        </div>
      ))}
    </div>
  )
}

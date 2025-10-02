import React from 'react'

export default function Elephant(){
  return (
    <div className="elephant-callout">
      <svg
        className="elephant-art"
        width="180"
        height="140"
        viewBox="0 0 180 140"
        role="img"
      >
        <title>Friendly elephant illustration</title>
        <defs>
          <linearGradient id="elephant-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
        <ellipse cx="85" cy="78" rx="56" ry="42" fill="url(#elephant-body)" />
        <ellipse cx="120" cy="64" rx="30" ry="26" fill="url(#elephant-body)" />
        <ellipse cx="96" cy="58" rx="26" ry="24" fill="#e2e8f0" opacity="0.4" />
        <path
          d="M139 68c12 2 20 10 20 18 0 11-11 20-28 20-10 0-18-6-18-12 0-6 6-12 17-14l-4-12z"
          fill="#475569"
        />
        <circle cx="129" cy="62" r="6" fill="#0f172a" />
        <circle cx="131" cy="60" r="2" fill="#f8fafc" />
        <path
          d="M139 77c9 2 15 4 15 10 0 4-3 7-9 7-10 0-16-7-16-14 0-3 3-5 10-3z"
          fill="#1e293b"
        />
        <path
          d="M45 108c8 10 20 16 32 16 17 0 34-9 46-16l-12-24H57z"
          fill="#1e293b"
        />
        <path
          d="M43 104c-6 0-11 5-11 10 0 3 2 6 6 6 7 0 12-5 12-10 0-3-3-6-7-6z"
          fill="#0f172a"
        />
        <path
          d="M112 113c-5 0-9 4-9 8 0 3 2 5 5 5 6 0 10-4 10-8 0-3-2-5-6-5z"
          fill="#0f172a"
        />
      </svg>
      <div className="elephant-caption">Elephants remember every transaction.</div>
    </div>
  )
}

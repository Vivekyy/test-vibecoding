import React from 'react'

export default function PinkDragon() {
  return (
    <div className="dragon-callout">
      <svg
        className="dragon-art"
        width="200"
        height="150"
        viewBox="0 0 200 150"
        role="img"
        aria-labelledby="pink-dragon-title pink-dragon-desc"
      >
        <title id="pink-dragon-title">Playful pink dragon illustration</title>
        <desc id="pink-dragon-desc">
          A bright pink dragon with shimmering wings keeping watch over the treasury.
        </desc>
        <defs>
          <linearGradient id="dragon-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="dragon-wing" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <linearGradient id="dragon-belly" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef3f2" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
        </defs>
        <path
          d="M40 96c8 26 34 42 68 42 30 0 54-14 66-38 7-14 6-30-4-42-9-10-24-16-38-14 3-11-4-20-16-24-16-5-34 4-38 19-12 0-23 6-30 15-9 12-12 28-8 42z"
          fill="url(#dragon-body)"
        />
        <path
          d="M126 44c15-8 34-10 48-2 8 5 14 12 16 21 2 8-1 16-6 24-14-26-33-36-58-43z"
          fill="url(#dragon-wing)"
          opacity="0.85"
        />
        <path
          d="M58 106c6 12 20 22 34 26 14 4 30 1 42-6 5-3 8-8 5-12-2-4-7-5-12-3-12 5-25 6-38 4-12-2-23-6-31-9z"
          fill="url(#dragon-belly)"
          opacity="0.9"
        />
        <path
          d="M160 116c10 5 18 12 18 20 0 7-6 12-16 12-14 0-26-9-26-20 0-10 12-16 24-12z"
          fill="#9d174d"
        />
        <path
          d="M106 38c-2 14-10 20-10 30 0 6 4 10 10 10 9 0 14-8 14-18 0-12-4-20-14-22z"
          fill="#fbcfe8"
        />
        <circle cx="128" cy="60" r="6" fill="#1f2937" />
        <circle cx="130" cy="58" r="2" fill="#f8fafc" />
        <path
          d="M116 72c12 0 22 6 22 14 0 5-5 10-13 12-10 2-22-4-22-12 0-8 7-14 13-14z"
          fill="#be185d"
          opacity="0.6"
        />
        <path
          d="M70 128c-8 0-14 6-14 12 0 5 4 8 10 8 10 0 18-6 18-12 0-4-5-8-14-8z"
          fill="#831843"
        />
        <path
          d="M102 132c-6 0-10 4-10 8 0 4 3 6 8 6 8 0 14-4 14-8 0-4-5-6-12-6z"
          fill="#831843"
        />
      </svg>
      <div className="dragon-caption">Pink dragons guard your yield.</div>
    </div>
  )
}

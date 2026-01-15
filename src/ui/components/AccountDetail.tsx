import React, {useEffect, useMemo, useRef, useState} from 'react'

type ChartPoint = {label:string, value:number}
type LedgerEntry = {label:string, value:string}

type AccountDetailProps = {
  onClose: ()=>void
  title: string
  balance: number
  balanceLabel?: string
  chart: {
    title: string
    range: string
    points: ChartPoint[]
  }
  card: {
    brand: string
    number: string
    holder: string
    exp: string
  }
  ledger: LedgerEntry[]
}

const svgWidth = 900
const svgHeight = 280
const verticalPadding = 32

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

export default function AccountDetail({onClose, title, balance, balanceLabel = 'Current Balance', chart, card, ledger}:AccountDetailProps){
  const chartRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState(Math.max(0, chart.points.length - 1))
  const [hoverCoords, setHoverCoords] = useState<{left:number, top:number} | null>(null)

  const points = useMemo(()=>{
    const values = chart.points.map(r=>r.value)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const range = Math.max(maxValue - minValue, 1)
    const innerHeight = svgHeight - verticalPadding * 2
    return chart.points.map((entry, idx)=>{
      const x = chart.points.length === 1 ? svgWidth / 2 : (svgWidth / (chart.points.length - 1)) * idx
      const normalized = (entry.value - minValue) / range
      const y = svgHeight - verticalPadding - normalized * innerHeight
      return {x, y}
    })
  }, [chart.points])

  const linePath = useMemo(()=>{
    if(points.length === 0) return ''
    return points.map((point, idx)=> `${idx === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')
  }, [points])

  const areaPath = useMemo(()=>{
    if(points.length === 0) return ''
    const baselineY = svgHeight - verticalPadding
    const segments = [
      `M ${points[0].x.toFixed(2)} ${baselineY.toFixed(2)}`,
      ...points.map(point=> `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
      `L ${points[points.length - 1].x.toFixed(2)} ${baselineY.toFixed(2)}`,
      'Z'
    ]
    return segments.join(' ')
  }, [points])

  useEffect(()=>{
    function handleKey(event:KeyboardEvent){
      if(event.key === 'Escape'){
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return ()=> window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(()=>{
    const container = chartRef.current
    if(!container || points.length === 0) return
    const lastPoint = points[Math.max(0, chart.points.length - 1)]
    const bounds = container.getBoundingClientRect()
    setHoverCoords({
      left: (lastPoint.x / svgWidth) * bounds.width,
      top: (lastPoint.y / svgHeight) * bounds.height
    })
  }, [points, chart.points.length])

  function updateHover(clientX:number){
    const container = chartRef.current
    if(!container || chart.points.length === 0) return
    const bounds = container.getBoundingClientRect()
    const clampedX = Math.max(bounds.left, Math.min(clientX, bounds.right))
    const ratio = (clampedX - bounds.left) / bounds.width
    const index = Math.round(ratio * (chart.points.length - 1))
    const safeIndex = Math.max(0, Math.min(chart.points.length - 1, index))
    setHoverIndex(safeIndex)
    const point = points[safeIndex]
    if(point){
      setHoverCoords({
        left: (point.x / svgWidth) * bounds.width,
        top: (point.y / svgHeight) * bounds.height
      })
    }
  }

  function handleMouseMove(event:React.MouseEvent<SVGSVGElement>){
    updateHover(event.clientX)
  }

  function handleTouchMove(event:React.TouchEvent<SVGSVGElement>){
    if(event.touches.length === 0) return
    updateHover(event.touches[0].clientX)
  }

  function handleOverlayClick(event:React.MouseEvent<HTMLDivElement>){
    if(event.target === event.currentTarget){
      onClose()
    }
  }

  const activePoint = points[hoverIndex]
  const activeData = chart.points[hoverIndex]

  return (
    <div className="treasury-detail-overlay" onClick={handleOverlayClick}>
      <div className="treasury-detail" role="dialog" aria-modal="true" aria-label={`${title} detail`} onClick={event=>event.stopPropagation()}>
        <button className="treasury-close" onClick={onClose} aria-label="Close account detail">×</button>

        <header className="treasury-header">
          <div>
            <h2>{title}</h2>
          </div>
          <div className="treasury-balance">
            <span>{balanceLabel}</span>
            <strong>{currencyFormatter.format(balance)}</strong>
          </div>
        </header>

        <div className="treasury-body">
          <div className="treasury-chart" ref={chartRef}>
            <div className="chart-header">
              <h3>{chart.title}</h3>
              <span>{chart.range}</span>
            </div>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              <defs>
                <linearGradient id="treasuryGlow" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(37,99,235,0.4)" />
                  <stop offset="100%" stopColor="rgba(37,99,235,0)" />
                </linearGradient>
              </defs>

              <path d={areaPath} fill="url(#treasuryGlow)" />
              <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

              {activePoint && (
                <>
                  <line
                    x1={activePoint.x}
                    y1={verticalPadding}
                    x2={activePoint.x}
                    y2={svgHeight - verticalPadding}
                    stroke="rgba(37,99,235,0.4)"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                  <circle cx={activePoint.x} cy={activePoint.y} r="8" fill="#2563eb" stroke="#fff" strokeWidth="3" />
                </>
              )}
            </svg>

            {activePoint && hoverCoords && activeData && (
              <div
                className="chart-tooltip"
                style={{left: hoverCoords.left, top: hoverCoords.top}}
              >
                <div className="tooltip-month">{activeData.label}</div>
                <div className="tooltip-value">{currencyFormatter.format(activeData.value)}</div>
              </div>
            )}

            <div className="chart-months">
              {chart.points.map((entry)=> (
                <span key={entry.label}>{entry.label.split(' ')[0]}</span>
              ))}
            </div>
          </div>

          <div className="treasury-card-stack">
            <div className="treasury-card-visual" aria-label={`${title} debit card`}>
              <div className="card-top">
                <div className="card-reader">
                  <span className="card-chip" />
                  <span className="card-slot" />
                </div>
                <div className="card-brand">{card.brand}</div>
              </div>
              <div className="card-number">{card.number}</div>
              <div className="card-footer">
                <div>
                  <span>Account Holder</span>
                  <strong>{card.holder}</strong>
                </div>
                <div>
                  <span>Exp</span>
                  <strong>{card.exp}</strong>
                </div>
              </div>
            </div>

            <div className="treasury-ledger">
              {ledger.map(item=>(
                <div key={item.label}>
                  <span className="ledger-label">{item.label}</span>
                  <span className="ledger-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

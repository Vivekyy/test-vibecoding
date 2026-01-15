import React from 'react'

type AnalysisModalProps = {
  title: string
  content: string
  onClose: ()=>void
}

export default function AnalysisModal({title, content, onClose}:AnalysisModalProps){
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={e=>{ if(e.target === e.currentTarget) onClose()}}>
      <div className="modal-card analysis">
        <button className="modal-close" aria-label="Close analysis" onClick={onClose}>×</button>
        <h3>{title}</h3>
        <div className="analysis-content">{content}</div>
        <div className="modal-actions">
          <button type="button" className="primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

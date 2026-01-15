import React from 'react'

type Detail = {
  label: string
  value: string
}

type ConfirmModalProps = {
  title: string
  description?: string
  details?: Detail[]
  confirmLabel: string
  cancelLabel: string
  onConfirm: ()=>void
  onCancel: ()=>void
}

export default function ConfirmModal({
  title,
  description,
  details = [],
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel
}:ConfirmModalProps){
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={e=>{ if(e.target === e.currentTarget) onCancel()}}>
      <div className="modal-card confirm">
        <h3>{title}</h3>
        {description && <p className="modal-description">{description}</p>}
        {details.length > 0 && (
          <ul className="modal-detail-list">
            {details.map(detail=>(
              <li key={detail.label}>
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </li>
            ))}
          </ul>
        )}
        <div className="modal-actions">
          <button type="button" className="ghost" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className="primary" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

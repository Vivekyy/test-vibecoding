import React from 'react'
import dayjs from 'dayjs'

type WorkflowDetailModalProps = {
  workflow: any
  onClose: ()=>void
}

export default function WorkflowDetailModal({workflow, onClose}:WorkflowDetailModalProps){
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`${workflow.name} workflow detail`} onClick={e=>{ if(e.target === e.currentTarget) onClose()}}>
      <div className="modal-card workflow">
        <button className="modal-close" aria-label="Close workflow detail" onClick={onClose}>×</button>
        <header className="workflow-detail-header">
          <div>
            <h3>{workflow.name}</h3>
            <p>Created {dayjs(workflow.createdAt).format('MMM D, YYYY • h:mm a')}</p>
          </div>
          <div className="workflow-header-actions">
            <button type="button" className="ghost" disabled aria-disabled="true">Edit Workflow</button>
          </div>
        </header>

        <div className="workflow-summary">
          {workflow.amount && (
            <div>
              <span>Bonus Amount</span>
              <strong>${Number(workflow.amount).toLocaleString()}</strong>
            </div>
          )}
          <div>
            <span>Status</span>
            <strong>Active</strong>
          </div>
          <div>
            <span>Trigger Window</span>
            <strong>Daily at 9:00 AM</strong>
          </div>
        </div>

        <div className="workflow-steps">
          {workflow.blocks?.map((block:any, index:number)=>(
            <div key={block.label} className="workflow-block">
              <div className="workflow-block-index">{index + 1}</div>
              <div className="workflow-block-body">
                <h4>{block.label}</h4>
                <p>{block.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {workflow.prompt && (
          <div className="workflow-origin">
            <span>Prompt</span>
            <p>{workflow.prompt}</p>
          </div>
        )}
      </div>
    </div>
  )
}

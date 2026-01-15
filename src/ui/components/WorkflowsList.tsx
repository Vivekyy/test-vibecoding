import React from 'react'
import dayjs from 'dayjs'

type WorkflowListProps = {
  workflows: any[]
  onSelect: (workflow:any)=>void
}

export default function WorkflowsList({workflows, onSelect}:WorkflowListProps){
  if(workflows.length === 0){
    return <p className="no-workflows">No workflows created yet.</p>
  }

  return (
    <div className="workflow-list">
      {workflows.map(workflow=>(
        <button
          key={workflow.id}
          className="workflow-item"
          type="button"
          onClick={()=>onSelect(workflow)}
        >
          <div className="workflow-header">
            <span className="workflow-name">{workflow.name}</span>
            {workflow.amount && (
              <span className="workflow-amount">${Number(workflow.amount).toLocaleString()}</span>
            )}
          </div>
          <div className="workflow-meta">
            Created {dayjs(workflow.createdAt).format('MMM D, h:mm a')}
          </div>
          {workflow.description && (
            <div className="workflow-desc">{workflow.description}</div>
          )}
        </button>
      ))}
    </div>
  )
}

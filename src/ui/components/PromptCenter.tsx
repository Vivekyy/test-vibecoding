import React, {useState} from 'react'
import dayjs from 'dayjs'

const analysisResponse = `Runpay will produce a finance stack that fits your company: commissions, inventory automations, CRM tables, and controls mapped to your policies.`

function roofingStackBlueprint(timestamp:number){
  return [
    {
      id: `wf-commission-${timestamp}`,
      name: 'Commission Payouts from Hotspot',
      amount: 0.1,
      createdAt: timestamp,
      description: 'Calculate 10% commissions from Hotspot closed-won deals and pay reps Fridays at 5pm.',
      blocks: [
        {label:'Trigger', detail:'Hotspot stage: Closed Won'},
        {label:'Rule', detail:'10% of deal value to assigned rep'},
        {label:'Control', detail:'Dual approval over $25k'},
        {label:'Payout', detail:'USDC or USD off-ramp'}
      ]
    },
    {
      id: `wf-reorder-${timestamp}`,
      name: 'Biweekly Roofing Supplies Reorder',
      amount: null,
      createdAt: timestamp,
      description: 'Reorder shingles, sealant, and paint every other Friday with Slack confirmation.',
      blocks: [
        {label:'Trigger', detail:'Biweekly Friday 10am'},
        {label:'Data', detail:'Inventory spreadsheet + vendor catalog'},
        {label:'Action', detail:'Create PO and pay vendor'},
        {label:'Notify', detail:'Send summary to #ops'}
      ]
    },
    {
      id: `wf-crm-${timestamp}`,
      name: 'Field Ops CRM Table',
      amount: null,
      createdAt: timestamp,
      description: 'Generate CRM table with commissions owed and AR aging alerts.',
      blocks: [
        {label:'Schema', detail:'Contact, Deal Value, Stage, Assigned Rep'},
        {label:'Sync', detail:'Imports CSV + Hotspot webhook'},
        {label:'Outputs', detail:'Commission sheet + aging alerts'}
      ]
    }
  ]
}

// naive prompt parser for demo purposes
function parsePrompt(text:string, employees:any[]){
  const t = text.toLowerCase()

  const roofingOnboarding = /(onboard|morph).*roof/i.exec(t) || /i'?m a roofer/i.exec(t)
  if(roofingOnboarding){
    const timestamp = Date.now()
    return {
      type:'stack-onboarding',
      desc:'Runpay morphed your banking stack for roofing: commissions, inventory reorder, and CRM.',
      generatedWorkflows: roofingStackBlueprint(timestamp)
    }
  }

  const commissionFlow = /(commission|sales rep).*(hotspot|crm)/i.exec(t)
  if(commissionFlow){
    return {
      type:'workflow-commission',
      name:'Commission Payouts from Hotspot',
      amount: null,
      desc:'Calculate and pay 10% commissions from Hotspot closed-won deals every Friday.',
      blocks:[
        {label:'Trigger', detail:'Hotspot closed-won'},
        {label:'Rule', detail:'10% of deal value to assigned rep'},
        {label:'Control', detail:'Dual approval over $25k'},
        {label:'Payout', detail:'Auto payout Friday 5pm'}
      ]
    }
  }

  const reorderFlow = /(reorder|restock|suppl(?:y|ies)).*(friday|biweekly|every other)/i.exec(t)
  if(reorderFlow){
    return {
      type:'workflow-reorder',
      name:'Biweekly Roofing Supplies Reorder',
      desc:'Reorder shingles, sealant, and paint every other Friday at 10am.',
      blocks:[
        {label:'Trigger', detail:'Every other Friday 10am'},
        {label:'Data', detail:'Inventory spreadsheet ingestion'},
        {label:'Action', detail:'Generate PO + pay preferred vendor'},
        {label:'Notify', detail:'Send summary to #ops'}
      ]
    }
  }

  const crmFlow = /(crm|table|sheet).*(commission|deal)/i.exec(t)
  if(crmFlow){
    return {
      type:'workflow-crm',
      name:'Field Ops CRM Table',
      desc:'Create CRM table with deals, stages, reps, and commissions owed.',
      blocks:[
        {label:'Schema', detail:'Contact, Deal Value, Stage, Assigned Rep'},
        {label:'Sync', detail:'Hotspot webhook + CSV import'},
        {label:'Outputs', detail:'Commission summary + AR alerts'}
      ]
    }
  }

  const analysis = /give me an analysis of my q3 revenue from 2024 and 2025/i.exec(t)
  const compareAnalysis = /compare my q3 revenue (?:from|of)?\s*last year to this year/i.exec(t)
  if(analysis || compareAnalysis){
    return {type:'analysis-q3', desc: analysisResponse, analysisText: analysisResponse}
  }

  const directSend = /send (\w+)\s+\$?(\d+)(?:\s*dollars?)?/i.exec(t)
  if(directSend){
    const name = directSend[1]
    const amount = Number(directSend[2])
    const emp = employees.find(e=> e.name.toLowerCase() === name.toLowerCase())
    if(emp){
      return {
        type:'transfer',
        from:'treasury',
        to: emp.id,
        amount,
        desc: `Send $${amount.toLocaleString()} to ${emp.name}`,
        requiresConfirmation: true,
        confirmationType: 'employee-transfer',
        targetName: emp.name
      }
    }
  }

  const workflowBirthday = /create (?:a )?workflow.*send(?:s)?(?: (?:all )?employees)? a \$?(\d+).*birthday bonus/i.exec(t)
  if(workflowBirthday){
    const amount = Number(workflowBirthday[1])
    return {
      type:'workflow-birthday',
      amount,
      desc: `Automate a $${amount.toLocaleString()} birthday bonus for all employees`,
      requiresConfirmation: true
    }
  }

  // transfer from treasury to employee raise
  const raise = /give (\w+) a (\d+)% pay raise/.exec(t)
  if(raise){
    const name = raise[1]
    const pct = Number(raise[2])
    const emp = employees.find(e=> e.name.toLowerCase()===name)
    if(emp) return {type:'transfer', from:'treasury', to: emp.id, amount: Math.round(emp.balance * pct/100), desc: `Pay raise ${pct}% to ${emp.name}`}
  }

  const bonus = /on every employee's birthday, send them a \$(\d+) bonus/.exec(t)
  if(bonus){
    const amt = Number(bonus[1])
    return {type:'loop-birthday', desc:`Send $${amt} to each employee on birthday`, amount: amt}
  }

  const transfer = /send (?:a wire to|send) (\d+)?\s*(?:of )?usdc to (0x[0-9a-fA-F]+)/.exec(t)
  if(transfer){
    const amt = Number(transfer[1]) || 1000
    const to = transfer[2]
    return {type:'send-usdc', from:'treasury', to, amount: amt, desc: `Send ${amt} USDC to ${to}`}
  }

  const withdraw = /withdraw (\d+)% of the company's revenue and deposit it into the linked chase account/i.exec(t)
  if(withdraw){
    const pct = Number(withdraw[1])
    return {type:'withdraw-to-bank', desc:`Withdraw ${pct}% of revenue every 6 months (demo)`, amountPct: pct}
  }

  return {type:'unknown', desc: text}
}

export default function PromptCenter({onAction, employees, logs}:{onAction:any, employees:any[], logs:any[]}){
  const [text,setText] = useState('')

  function submit(){
    const trimmed = text.trim()
    if(!trimmed) return
    runPrompt(trimmed)
    setText('')
  }

  function runPrompt(input:string){
    const normalized = input.trim()
    if(!normalized) return
    const action = parsePrompt(normalized, employees)
    onAction({...action, prompt: normalized})
  }

  return (
    <div>
      <textarea className="prompt-input" placeholder="Describe your company and policies... e.g. 'Onboard us as a roofing company with 10% commissions and biweekly reorders'" value={text} onChange={e=>setText(e.target.value)} />
      <div className="prompt-actions">
        <button onClick={submit} className="primary">Run Prompt</button>
      </div>

      <div className="activity">
        <h4>Activity</h4>
        {logs.length > 0 && (
          <ul>
            {logs.map((log, index)=> (
              <li key={index} className="activity-entry">
                <div className="activity-prompt">{log.prompt || log.desc}</div>
                {log.desc && log.desc !== log.prompt && (
                  <div className="activity-desc">{log.desc}</div>
                )}
                {log.time && (
                  <div className="activity-time">{dayjs(log.time).format('MMM D, h:mm a')}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

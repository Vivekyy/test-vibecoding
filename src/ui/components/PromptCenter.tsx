import React, {useState} from 'react'

// naive prompt parser for demo purposes
function parsePrompt(text:string, employees:any[]){
  const t = text.toLowerCase()
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

export default function PromptCenter({onAction, employees}:{onAction:any, employees:any[]}){
  const [text,setText] = useState('')

  function submit(){
    const action = parsePrompt(text, employees)
    onAction(action)
    setText('')
  }

  function runExample(t:string){
    setText(t)
    const a = parsePrompt(t, employees)
    onAction(a)
  }

  return (
    <div>
      <textarea className="prompt-input" placeholder="Describe what you want to do... e.g. 'Give Ben a 20% pay raise'" value={text} onChange={e=>setText(e.target.value)} />
      <div className="prompt-actions">
        <button onClick={submit} className="primary">Run Prompt</button>
        <button onClick={()=>onAction({type:'summary'})} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.06)',color:'var(--text)',padding:'10px 14px',borderRadius:8}}>Run Summary</button>
      </div>

      <div className="examples">
        <h4>Examples</h4>
        <ul>
          <li><button className="example-btn" onClick={()=>runExample("Give Ben a 20% pay raise")}>Give Ben a 20% pay raise</button></li>
          <li><button className="example-btn" onClick={()=>runExample("On every employee's birthday, send them a $100 bonus")}>Send $100 bonus on birthdays</button></li>
          <li><button className="example-btn" onClick={()=>runExample("Send 1000 of USDC to 0x123")}>Send 1000 USDC to 0x123</button></li>
          <li><button className="example-btn" onClick={()=>runExample("Withdraw 20% of the company's revenue and deposit it into the linked chase account")}>Withdraw 20% to Chase</button></li>
        </ul>
      </div>
    </div>
  )
}

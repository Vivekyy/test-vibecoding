import React, { useState } from 'react'
import ZionLogo from './ZionLogo'
import AccountCard from './components/AccountCard'
import PromptCenter from './components/PromptCenter'
import Elephant from './components/Elephant'
import Transactions from './components/Transactions'

const mockAccounts = {
  treasury: { name: 'Company Treasury', balance: 250000, yieldRate: 0.07 },
  employees: [
    { id: 'e1', name: 'Ben', balance: 5000, yieldRate: 0.06 },
    { id: 'e2', name: 'Aisha', balance: 7200, yieldRate: 0.06 }
  ]
}

export default function App(){
  const [accounts, setAccounts] = useState(mockAccounts)
  const [logs, setLogs] = useState<any[]>([])
  const [revenue, setRevenue] = useState(120000)

  function handleAction(action:any){
    setLogs(l=>[{time: Date.now(), ...action}, ...l])
    // naive state updates for demo
    if(action.type === 'transfer' || action.type === 'send-usdc'){
      const {from,to,amount,desc} = action
      if(from === 'treasury' && to){
        setAccounts((a:any)=>({
          ...a,
          treasury: {...a.treasury, balance: Math.max(0, a.treasury.balance - amount)},
          employees: a.employees.map((e:any)=> e.id===to ? {...e, balance: e.balance + amount}: e)
        }))
      } else if(to === 'treasury' && from){
        setAccounts((a:any)=>({
          ...a,
          treasury: {...a.treasury, balance: a.treasury.balance + amount},
          employees: a.employees.map((e:any)=> e.id===from ? {...e, balance: e.balance - amount}: e)
        }))
      }
    } else if(action.type === 'withdraw-to-bank'){
      // for the demo we'll deduct a fixed demo amount from treasury
      const demoAmount = Math.round(accounts.treasury.balance * ((action.amountPct||20)/100))
      setAccounts((a:any)=>({
        ...a,
        treasury: {...a.treasury, balance: Math.max(0, a.treasury.balance - demoAmount)}
      }))
      setLogs(l=>[{time: Date.now(), type:'bank-withdraw', desc: `Withdrew ${action.amountPct}% (~$${demoAmount.toLocaleString()}) to linked bank`, amount: demoAmount}, ...l])
    } else if(action.type === 'loop-birthday'){
      const amt = action.amount || 100
      setAccounts((a:any)=>({
        ...a,
        treasury: {...a.treasury, balance: Math.max(0, a.treasury.balance - a.employees.length * amt)},
        employees: a.employees.map((e:any)=> ({...e, balance: e.balance + amt}))
      }))
    } else if(action.type === 'summary'){
      // push a fake summary log
      const payroll = 42000
      const vendors = 18000
      const yieldEarned = Math.round(accounts.treasury.balance * accounts.treasury.yieldRate / 4)
      setLogs(l=>[{time: Date.now(), type:'summary', desc:`Last quarter: payroll $${payroll.toLocaleString()} (${((payroll/(payroll+vendors))*100).toFixed(0)}%), vendors $${vendors.toLocaleString()} (${((vendors/(payroll+vendors))*100).toFixed(0)}%), yield $${yieldEarned.toLocaleString()}`, payroll, vendors, yieldEarned}, ...l])
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <ZionLogo />
        <div className="top-actions">
          <div className="yield">Treasury Yield: <strong>{(accounts.treasury.yieldRate*100).toFixed(2)}%</strong></div>
        </div>
      </header>

      <main className="main-grid">
        <section className="panel left">
          <h2>Treasury</h2>
          <AccountCard account={accounts.treasury} id="treasury" />
          <div style={{marginTop:8,color:'var(--accent)'}}>Revenue (this month): <strong>${revenue.toLocaleString()}</strong></div>
          <h3>Employees</h3>
          {accounts.employees.map((e:any)=> <AccountCard key={e.id} account={e} id={e.id} />)}
        </section>

        <section className="panel center">
          <h2>Prompt Center</h2>
          <Elephant />
          <PromptCenter onAction={handleAction} employees={accounts.employees} />
        </section>

        <section className="panel right">
          <h2>Activity</h2>
          <Transactions logs={logs} />
        </section>
      </main>
    </div>
  )
}

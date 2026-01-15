import React, { useMemo, useState } from 'react'
import RunpayLogo from './RunpayLogo'

type Tab = 'home' | 'connections' | 'employees' | 'automations'

type Integration = {
  id: 'intercom' | 'linear' | 'calendly'
  name: string
  description: string
  logo: string
  connected: boolean
}

type Message = {
  id: string
  role: 'user' | 'assistant' | 'status'
  content: React.ReactNode
}

type Employee = {
  id: string
  name: string
  role: string
  email: string
  balance: number
}

type AutomationStatus = 'active' | 'paused' | 'disabled'

type Automation = {
  id: string
  name: string
  description: string
  recipients: string[]
  amount: number
  processed: number
  status: AutomationStatus
}

type FlowId = 'linear' | 'calendly' | 'intercom'

type FlowState = { id: FlowId; step: number } | null

type FlowStep = {
  status?: boolean
  message: React.ReactNode
  final?: boolean
  onComplete?: (input?: string) => void
}

const integrationsSeed: Integration[] = [
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Customer support ratings and payouts',
    logo: new URL('../assets/logos/intercom.png', import.meta.url).toString(),
    connected: false
  },
  {
    id: 'linear',
    name: 'Linear',
    description: 'Sprint completion bonuses',
    logo: new URL('../assets/logos/linear.png', import.meta.url).toString(),
    connected: false
  },
  {
    id: 'calendly',
    name: 'Calendly',
    description: 'Demo booking incentives',
    logo: new URL('../assets/logos/calendly.png', import.meta.url).toString(),
    connected: false
  }
]

const promptSeeds = {
  linear: 'Send all my engineers a $15 dollar bonus if they hit at least 80% of their sprint on Linear',
  calendly: 'Send all my sales people a $2 dollar bonus for every booked demo on Calendly',
  intercom: 'Send all my customer service agents a $5 dollar bonus for every 5 star rating they get on Intercom'
}

const employeeBalanceSeed: Record<string, number> = {
  Sarah: 45,
  James: 30,
  Maya: 22,
  Tyler: 18,
  Alex: 25,
  Priya: 19
}

const defaultEmail = ''

function normalizePrompt(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractEmails(value: string) {
  return value.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? []
}

function formatMoney(value: number) {
  return `$${value.toLocaleString()}`
}

function statusLabel(status: AutomationStatus) {
  if (status === 'paused') return 'Paused'
  if (status === 'disabled') return 'Disabled'
  return 'Active'
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [integrations, setIntegrations] = useState<Integration[]>(integrationsSeed)
  const [messages, setMessages] = useState<Message[]>([])
  const [promptInput, setPromptInput] = useState('')
  const [flowState, setFlowState] = useState<FlowState>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [automations, setAutomations] = useState<Automation[]>([])
  const [connectionModal, setConnectionModal] = useState<Integration | null>(null)
  const [connectionForm, setConnectionForm] = useState({ email: '', password: '' })
  const [connectionLoading, setConnectionLoading] = useState(false)
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', role: '' })
  const [automationModal, setAutomationModal] = useState<Automation | null>(null)
  const [automationDraft, setAutomationDraft] = useState<Automation | null>(null)

  const normalizedPrompts = useMemo(() => {
    return {
      linear: normalizePrompt(promptSeeds.linear),
      calendly: normalizePrompt(promptSeeds.calendly),
      intercom: normalizePrompt(promptSeeds.intercom)
    }
  }, [])

  function pushMessage(role: Message['role'], content: React.ReactNode) {
    setMessages((prev) => [
      ...prev,
      { id: `${role}-${Date.now()}-${Math.random()}`, role, content }
    ])
  }

  function addEmployees(names: string[], role: string, emails: string[]) {
    setEmployees((prev) => {
      const next = [...prev]
      names.forEach((name, index) => {
        const existing = next.find((emp) => emp.name.toLowerCase() === name.toLowerCase())
        const email = emails[index] ?? defaultEmail
        if (existing) {
          existing.role = role
          if (email) {
            existing.email = email
          }
          return
        }
        next.push({
          id: `emp-${name.toLowerCase()}-${Date.now()}`,
          name,
          role,
          email,
          balance: employeeBalanceSeed[name] ?? 0
        })
      })
      return next
    })
  }

  function addAutomation(automation: Automation) {
    setAutomations((prev) => [automation, ...prev])
  }

  function createAutomationLink(label: string) {
    return (
      <button
        className="inline-link"
        onClick={() => {
          setActiveTab('automations')
        }}
      >
        {label}
      </button>
    )
  }

  function enqueueFlowStep(step: FlowStep, userInput?: string) {
    const deliver = () => {
      pushMessage('assistant', step.message)
      if (step.onComplete) {
        step.onComplete(userInput)
      }
      setFlowState((prev) => {
        if (!prev) return prev
        if (step.final) return null
        return { ...prev, step: prev.step + 1 }
      })
    }

    if (step.status) {
      pushMessage('status', 'Configuring...')
      setTimeout(deliver, 750)
      return
    }

    deliver()
  }

  function buildFlowSteps(flowId: FlowId): FlowStep[] {
    if (flowId === 'linear') {
      return [
        {
          status: true,
          message: 'Ok! Creating employee accounts for Sarah and James. Are there any engineers you are missing that you want to receive the bonus?'
        },
        {
          message: 'OK. Please let me know the emails for Sarah and James so I can email them their Runpay accounts to sign up.'
        },
        {
          status: true,
          final: true,
          onComplete: (input) => {
            addEmployees(['Sarah', 'James'], 'Engineer', extractEmails(input ?? ''))
            addAutomation({
              id: `auto-linear-${Date.now()}`,
              name: 'Linear Sprint Completion Bonus',
              description: 'Send $15 when an engineer hits at least 80% of their sprint completion in Linear.',
              recipients: ['Sarah', 'James'],
              amount: 15,
              processed: 90,
              status: 'active'
            })
          },
          message: (
            <span>
              Success! Your automation is ready to go! Check it out here:{' '}
              {createAutomationLink('Open Linear automation')}
            </span>
          )
        }
      ]
    }

    if (flowId === 'calendly') {
      return [
        {
          status: true,
          message: 'Ok! Connecting to Calendly and pulling your event types + team members. Which meeting type should count as a demo: your Product Demo link, or all Calendly events?'
        },
        {
          message: 'Got it. I found 2 sales reps booking that event: Maya and Tyler. Do you want to include both?'
        },
        {
          message: (
            <span>
              Perfect. Quick confirmation: should the bonus only apply when the invitee email is unique{' '}
              <strong>per rep</strong> (each rep can earn $2 per unique email), or unique{' '}
              <strong>across the whole team</strong> (only the first rep to book that email earns it)?
            </span>
          )
        },
        {
          message: 'OK. Please share the work emails for Maya and Tyler so I can create their Runpay accounts and invite them to sign up.'
        },
        {
          status: true,
          final: true,
          onComplete: (input) => {
            addEmployees(['Maya', 'Tyler'], 'Sales', extractEmails(input ?? ''))
            addAutomation({
              id: `auto-calendly-${Date.now()}`,
              name: 'Calendly Product Demo Bonus',
              description: 'Send $2 for every Product Demo booked with a unique invitee email per rep within the next two weeks.',
              recipients: ['Maya', 'Tyler'],
              amount: 2,
              processed: 64,
              status: 'active'
            })
          },
          message: (
            <span>
              Success! Your automation is ready to go! Check it out here:{' '}
              {createAutomationLink('Open Calendly automation')}
            </span>
          )
        }
      ]
    }

    return [
      {
        status: true,
      message: 'Ok! Connecting to Intercom and pulling your teammates. I found 2 support agents: Alex and Priya. Do you want to include both?'
      },
      {
        message: 'Great. One quick detail: should this trigger on Conversation Ratings (the 1-5 star rating after a chat), or CSAT surveys if you are using those too?'
      },
      {
        message: 'Perfect. Do you want to pay out the $5 immediately after each 5-star rating, or batched (daily or weekly) to reduce transaction noise?'
      },
      {
      message: 'OK. Please share the work emails for Alex and Priya so I can create their Runpay accounts and email them invitations.'
      },
      {
        status: true,
        final: true,
        onComplete: (input) => {
          addEmployees(['Alex', 'Priya'], 'Support', extractEmails(input ?? ''))
          addAutomation({
            id: `auto-intercom-${Date.now()}`,
            name: 'Intercom 5-Star Rating Bonus',
            description: 'Send $5 for every 5-star conversation rating, paid out in daily batches.',
            recipients: ['Alex', 'Priya'],
            amount: 5,
            processed: 120,
            status: 'active'
          })
        },
        message: (
          <span>
            Success! Your automation is ready to go! Check it out here:{' '}
            {createAutomationLink('Open Intercom automation')}
          </span>
        )
      }
    ]
  }

  function handlePromptSubmit() {
    const trimmed = promptInput.trim()
    if (!trimmed) return

    pushMessage('user', trimmed)
    setPromptInput('')

    if (flowState) {
      const steps = buildFlowSteps(flowState.id)
      const step = steps[flowState.step]
      if (step) {
        enqueueFlowStep(step, trimmed)
      }
      return
    }

    const normalized = normalizePrompt(trimmed)
    let matched: FlowId | null = null

    if (normalized === normalizedPrompts.linear) {
      matched = 'linear'
    } else if (normalized === normalizedPrompts.calendly) {
      matched = 'calendly'
    } else if (normalized === normalizedPrompts.intercom) {
      matched = 'intercom'
    }

    if (matched) {
      setFlowState({ id: matched, step: 0 })
      const steps = buildFlowSteps(matched)
      enqueueFlowStep(steps[0], trimmed)
      return
    }

    pushMessage('assistant', 'I can help you set up incentive automations. Try one of the sample prompts above to see a full flow.')
  }

  function handleConnectionSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!connectionModal || connectionLoading) return

    setConnectionLoading(true)
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === connectionModal.id ? { ...item, connected: true } : item
        )
      )
      setConnectionLoading(false)
      setConnectionModal(null)
      setConnectionForm({ email: '', password: '' })
    }, 850)
  }

  function handleEmployeeSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!employeeForm.name.trim() || !employeeForm.email.trim() || !employeeForm.role.trim()) return

    addEmployees([employeeForm.name.trim()], employeeForm.role.trim(), [employeeForm.email.trim()])
    setEmployeeForm({ name: '', email: '', role: '' })
    setEmployeeModalOpen(false)
  }

  function handleAutomationSave(event: React.FormEvent) {
    event.preventDefault()
    if (!automationDraft) return

    setAutomations((prev) =>
      prev.map((item) => (item.id === automationDraft.id ? automationDraft : item))
    )
    setAutomationModal(null)
    setAutomationDraft(null)
  }

  const employeeCards = employees.map((employee) => {
    const assigned = automations.filter((automation) =>
      automation.recipients.some((recipient) => recipient.toLowerCase() === employee.name.toLowerCase())
    )

    return { employee, assigned }
  })

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <RunpayLogo />
        </div>
        <div className="nav">
          <button
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`nav-item ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            Connections
          </button>
          <button
            className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Team Members
          </button>
          <button
            className={`nav-item ${activeTab === 'automations' ? 'active' : ''}`}
            onClick={() => setActiveTab('automations')}
          >
            Automations
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">BN</div>
          <div>
            <div className="profile-name">Benjamin Nguyen</div>
            <div className="profile-sub">Admin</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="main-header">
          <div className="header-title" />
          {activeTab === 'home' && (
            <div className="balance-card">
              <p className="muted">Balance</p>
              <div className="balance-value">$50,000</div>
              <div className="balance-actions">
                <button className="primary">Add funds</button>
                <button className="ghost">Send to bank</button>
              </div>
            </div>
          )}
        </header>

        {activeTab === 'home' && (
          <section className="chat-section">
            <div className="chat-hero">
              <h2>
                <em>What do you want to incentivize?</em>
              </h2>
              <p className="muted">Design incentives like a conversation.</p>
            </div>

            <div className="chat-window">
              {messages.length === 0 && (
                <div className="empty-state">
                  Suggestions:
                  <div className="sample">{promptSeeds.linear}</div>
                  <div className="sample">{promptSeeds.calendly}</div>
                  <div className="sample">{promptSeeds.intercom}</div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="message-bubble">{message.content}</div>
                </div>
              ))}
            </div>

            <form
              className="prompt-box"
              onSubmit={(event) => {
                event.preventDefault()
                handlePromptSubmit()
              }}
            >
              <textarea
                className="prompt-input"
                placeholder="Describe the incentive you want to launch..."
                value={promptInput}
                onChange={(event) => setPromptInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handlePromptSubmit()
                  }
                }}
              />
              <button className="primary" type="submit">
                Send
              </button>
            </form>
          </section>
        )}

        {activeTab === 'connections' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Connections</h2>
                <p className="muted">Plug in the systems that power your payouts.</p>
              </div>
            </div>
            <div className="integration-list">
              {integrations.map((integration) => (
                <button
                  key={integration.id}
                  className="integration-row"
                  onClick={() => {
                    setConnectionModal(integration)
                    setConnectionForm({ email: '', password: '' })
                  }}
                >
                  <div className="integration-info">
                    <div className="integration-logo">
                      <img src={integration.logo} alt={`${integration.name} logo`} />
                    </div>
                    <div>
                      <div className="integration-name">{integration.name}</div>
                      <div className="muted small">{integration.description}</div>
                    </div>
                  </div>
                  <div className="integration-status">
                    <span className={`status-dot ${integration.connected ? 'on' : 'off'}`} />
                    <span className="status-label">
                      {integration.connected ? 'Connected' : 'Not connected'}
                    </span>
                    <span className="plus">+</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'employees' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Team Members</h2>
                <p className="muted">Active team members and their current incentives.</p>
              </div>
              <button className="ghost" onClick={() => setEmployeeModalOpen(true)}>
                + Add employee
              </button>
            </div>

            {employeeCards.length === 0 ? (
              <div className="empty-panel">No team members yet. Add your first team member to start tracking incentives.</div>
            ) : (
              <div className="card-grid">
                {employeeCards.map(({ employee, assigned }) => (
                    <div className="employee-card" key={employee.id}>
                    <div className="employee-name">{employee.name}</div>
                    <div className="employee-role">{employee.role}</div>
                    <div className="employee-meta">{employee.email || 'No email on file'}</div>
                    <div className="employee-automations">
                      <span className="muted small">Active automations</span>
                      {assigned.length === 0 ? (
                        <div className="empty-automations">No automations yet</div>
                      ) : (
                        <div className="automation-tags">
                          {assigned.map((automation) => (
                            <span className="tag" key={automation.id}>
                              {automation.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'automations' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Automations</h2>
                <p className="muted">Manage live incentive workflows.</p>
              </div>
            </div>
            {automations.length === 0 ? (
              <div className="empty-panel">Create automations in your console.</div>
            ) : (
              <div className="card-grid">
                {automations.map((automation) => (
                  <button
                    className="automation-card"
                    key={automation.id}
                    onClick={() => {
                      setAutomationModal(automation)
                      setAutomationDraft({ ...automation })
                    }}
                  >
                    <div className="automation-header">
                      <div>
                        <div className="automation-name">{automation.name}</div>
                        <div className="muted small">{automation.description}</div>
                      </div>
                      <span className={`status-pill ${automation.status}`}>{statusLabel(automation.status)}</span>
                    </div>
                    <div className="automation-recipients">
                      <span className="muted small">Recipients</span>
                      <div className="recipient-list">{automation.recipients.join(', ')}</div>
                    </div>
                    <div className="automation-footer">
                      <div className="automation-amount">{formatMoney(automation.amount)} per trigger</div>
                      <div className="automation-processed">{formatMoney(automation.processed)} processed</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {connectionModal && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal">
            <div className="modal-header">
              <h3>Connect to {connectionModal.name}</h3>
              <button
                className="ghost"
                type="button"
                onClick={() => setConnectionModal(null)}
              >
                Close
              </button>
            </div>
            <form className="modal-body" onSubmit={handleConnectionSubmit}>
              <label className="field">
                Email
                <input
                  type="email"
                  value={connectionForm.email}
                  onChange={(event) =>
                    setConnectionForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="field">
                Password
                <input
                  type="password"
                  value={connectionForm.password}
                  onChange={(event) =>
                    setConnectionForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </label>
              <button className="primary" type="submit" disabled={connectionLoading}>
                {connectionLoading ? 'Connecting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {employeeModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal">
            <div className="modal-header">
              <h3>Add employee</h3>
              <button className="ghost" type="button" onClick={() => setEmployeeModalOpen(false)}>
                Close
              </button>
            </div>
            <form className="modal-body" onSubmit={handleEmployeeSubmit}>
              <label className="field">
                Employee name
                <input
                  type="text"
                  value={employeeForm.name}
                  onChange={(event) =>
                    setEmployeeForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="field">
                Employee email
                <input
                  type="email"
                  value={employeeForm.email}
                  onChange={(event) =>
                    setEmployeeForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="field">
                Role
                <input
                  type="text"
                  value={employeeForm.role}
                  onChange={(event) =>
                    setEmployeeForm((prev) => ({ ...prev, role: event.target.value }))
                  }
                  required
                />
              </label>
              <button className="primary" type="submit">
                Add employee
              </button>
            </form>
          </div>
        </div>
      )}

      {automationModal && automationDraft && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal wide">
            <div className="modal-header">
              <h3>Edit automation</h3>
              <button className="ghost" type="button" onClick={() => setAutomationModal(null)}>
                Close
              </button>
            </div>
            <form className="modal-body" onSubmit={handleAutomationSave}>
              <label className="field">
                Automation name
                <input
                  type="text"
                  value={automationDraft.name}
                  onChange={(event) =>
                    setAutomationDraft((prev) =>
                      prev ? { ...prev, name: event.target.value } : prev
                    )
                  }
                  required
                />
              </label>
              <label className="field">
                What it does
                <textarea
                  value={automationDraft.description}
                  onChange={(event) =>
                    setAutomationDraft((prev) =>
                      prev ? { ...prev, description: event.target.value } : prev
                    )
                  }
                  required
                />
              </label>
              <label className="field">
                Recipients (comma separated)
                <input
                  type="text"
                  value={automationDraft.recipients.join(', ')}
                  onChange={(event) =>
                    setAutomationDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            recipients: event.target.value
                              .split(',')
                              .map((name) => name.trim())
                              .filter(Boolean)
                          }
                        : prev
                    )
                  }
                />
              </label>
              <label className="field">
                Amount per trigger
                <input
                  type="number"
                  min="0"
                  value={automationDraft.amount}
                  onChange={(event) =>
                    setAutomationDraft((prev) =>
                      prev ? { ...prev, amount: Number(event.target.value) } : prev
                    )
                  }
                  required
                />
              </label>
              <label className="field">
                Status
                <select
                  value={automationDraft.status}
                  onChange={(event) =>
                    setAutomationDraft((prev) =>
                      prev ? { ...prev, status: event.target.value as AutomationStatus } : prev
                    )
                  }
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>
              <button className="primary" type="submit">
                Save changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

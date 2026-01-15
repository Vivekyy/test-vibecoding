import React from 'react'

type AccountCardProps = {
  account: any
  hideBalance?: boolean
  onClick?: ()=>void
}

export default function AccountCard({account, hideBalance, onClick}:AccountCardProps){
  const isInteractive = typeof onClick === 'function'

  function handleKeyDown(event:React.KeyboardEvent<HTMLDivElement>){
    if(!isInteractive) return
    if(event.key === 'Enter' || event.key === ' '){
      event.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={`account-card${isInteractive ? ' interactive' : ''}`}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={isInteractive ? `${account.name} details` : undefined}
    >
      <div className="account-name">{account.name}</div>
      {!hideBalance && (
        <div className="account-balance">${account.balance.toLocaleString()}</div>
      )}
      <div className="account-yield">Yield: {(account.yieldRate*100).toFixed(2)}%</div>
    </div>
  )
}

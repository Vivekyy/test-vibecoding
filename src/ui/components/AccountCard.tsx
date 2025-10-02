import React from 'react'

export default function AccountCard({account}:{account:any}){
  return (
    <div className="account-card">
      <div className="account-name">{account.name}</div>
      <div className="account-balance">${account.balance.toLocaleString()}</div>
      <div className="account-yield">Yield: {(account.yieldRate*100).toFixed(2)}%</div>
    </div>
  )
}

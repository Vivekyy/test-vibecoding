import React from 'react'
import runpayLogo from '../assets/logos/runpay_blue.svg'

export default function RunpayLogo() {
  return (
    <div className="runpay-logo" aria-label="Runpay brand">
      <img className="runpay-logo-image" src={runpayLogo} alt="Runpay" />
    </div>
  )
}

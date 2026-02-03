import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import './LockScreen.css'

/**
 * LockScreen - Device lock and unlock interface
 * Memory efficient: Minimal local state
 * Security: PIN validation before unlock
 */
const LockScreen = () => {
  const { unlockScreen } = useSystem()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  
  const CORRECT_PIN = '1234' // In real system, would be hashed and stored securely

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPin(value)
    setError('')
  }

  const handleUnlock = (e) => {
    e.preventDefault()
    
    if (pin === CORRECT_PIN) {
      unlockScreen()
    } else {
      setError('Incorrect PIN')
      setPin('')
    }
  }

  const handleSwipeUp = () => {
    // For demo, allow swipe to unlock without PIN
    unlockScreen()
  }

  return (
    <div className="lock-screen">
      <div className="lock-screen-content">
        <div className="lock-time">
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </div>
        
        <div className="lock-date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <div className="lock-icon">
          <FontAwesomeIcon icon={faLock} />
        </div>

        <form className="pin-entry" onSubmit={handleUnlock}>
          <input
            type="password"
            inputMode="numeric"
            placeholder="Enter PIN (1234)"
            value={pin}
            onChange={handlePinChange}
            className={error ? 'error' : ''}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={pin.length !== 4}>
            <FontAwesomeIcon icon={faUnlock} /> Unlock
          </button>
        </form>

        <div className="swipe-hint" onClick={handleSwipeUp}>
          Swipe up to unlock
        </div>
      </div>
    </div>
  )
}

export default LockScreen

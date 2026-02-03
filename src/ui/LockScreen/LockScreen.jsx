import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import { useBatteryManager } from '../../services/BatteryManager'
import { useConnectivityManager } from '../../services/ConnectivityManager'
import './LockScreen.css'

/**
 * LockScreen - Device lock and unlock interface
 * Memory efficient: Minimal local state
 * Security: PIN validation before unlock
 * Double-tap anywhere to turn screen off/on
 */
const LockScreen = () => {
  const { unlockScreen } = useSystem()
  const { batteryLevel, isCharging } = useBatteryManager()
  const { wifi, cellular } = useConnectivityManager()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [touchStart, setTouchStart] = useState(0)
  const [screenOff, setScreenOff] = useState(false)
  const lastTapRef = useRef(0)
  
  const CORRECT_PIN = '1234' // In real system, would be hashed and stored securely

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num
      setPin(newPin)
      setError('')
      
      if (newPin.length === 4) {
        setTimeout(() => checkPin(newPin), 100)
      }
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
    setError('')
  }

  const checkPin = (pinToCheck) => {
    if (pinToCheck === CORRECT_PIN) {
      unlockScreen()
    } else {
      setError('Incorrect PIN')
      setTimeout(() => {
        setPin('')
        setError('')
      }, 1000)
    }
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientY
    if (touchStart - touchEnd > 50) {
      unlockScreen() // Swipe up
    }
  }

  // Double-tap to turn screen off/on
  const handleDoubleTap = () => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected - toggle screen
      setScreenOff(!screenOff)
    }

    lastTapRef.current = now
  }

  // If screen is off, show blank screen
  if (screenOff) {
    return (
      <div 
        className="lock-screen screen-off"
        onClick={handleDoubleTap}
      >
      </div>
    )
  }

  return (
    <div 
      className="lock-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleDoubleTap}
    >
      <div className="lock-status-bar">
        <div className="status-left">
          {currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
          })}
        </div>
        <div className="status-right">
          {(wifi || cellular) && (
            <div className="status-icon">📶</div>
          )}
          <div className="status-icon">
            {isCharging ? '⚡' : batteryLevel <= 20 ? '🪫' : '🔋'}
          </div>
        </div>
      </div>

      <div className="lock-screen-content">
        <div className="lock-time">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </div>
        
        <div className="lock-date">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <div className="lock-notifications">
          <div className="notification-badge">
            <FontAwesomeIcon icon={faLock} />
          </div>
        </div>

        <div className="pin-display">
          {error ? (
            <div className="pin-error">{error}</div>
          ) : (
            <div className="pin-dots">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`pin-dot ${i < pin.length ? 'filled' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pin-pad">
          <div className="pin-row">
            {[1, 2, 3].map(num => (
              <button 
                key={num} 
                className="pin-button"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="pin-row">
            {[4, 5, 6].map(num => (
              <button 
                key={num} 
                className="pin-button"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="pin-row">
            {[7, 8, 9].map(num => (
              <button 
                key={num} 
                className="pin-button"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="pin-row">
            <button className="pin-button empty"></button>
            <button 
              className="pin-button"
              onClick={() => handleNumberClick('0')}
            >
              0
            </button>
            <button 
              className="pin-button delete"
              onClick={handleDelete}
            >
              <FontAwesomeIcon icon={faDeleteLeft} />
            </button>
          </div>
        </div>

        <div className="swipe-hint">
          Swipe up to unlock
        </div>
      </div>
    </div>
  )
}

export default LockScreen

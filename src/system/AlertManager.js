import { useState, useCallback } from 'react'

/**
 * AlertManager - System-level notification and alert handling
 * Memory efficient: Uses simple state array with max limit
 * Security: Sanitizes alert messages
 */
export const useAlertManager = () => {
  const [alerts, setAlerts] = useState([])
  const MAX_ALERTS = 5

  const showAlert = useCallback((message, type = 'info', duration = 3000) => {
    const alert = {
      id: Date.now(),
      message: sanitizeMessage(message),
      type, // info, warning, error, success
      timestamp: new Date()
    }

    setAlerts(prev => {
      const updated = [alert, ...prev].slice(0, MAX_ALERTS)
      return updated
    })

    if (duration > 0) {
      setTimeout(() => {
        dismissAlert(alert.id)
      }, duration)
    }

    return alert.id
  }, [])

  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }, [])

  const clearAllAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  const sanitizeMessage = (message) => {
    if (typeof message !== 'string') return String(message)
    // Basic XSS prevention
    return message.replace(/<script>/gi, '').substring(0, 200)
  }

  return {
    alerts,
    showAlert,
    dismissAlert,
    clearAllAlerts
  }
}

export default useAlertManager

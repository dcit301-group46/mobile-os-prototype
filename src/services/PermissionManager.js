import { useCallback } from 'react'
import { useSystem } from '../system/SystemContext'

/**
 * PermissionManager - Access control and permission enforcement
 * Memory efficient: Uses SystemContext for permission state
 * Security: Validates all permission requests, prevents unauthorized access
 */
const PERMISSION_TYPES = {
  CAMERA: 'camera',
  LOCATION: 'location',
  STORAGE: 'storage',
  INTERNET: 'internet',
  MICROPHONE: 'microphone',
  CONTACTS: 'contacts',
  NOTIFICATIONS: 'notifications'
}

const PERMISSION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PENDING: 'pending'
}

export const usePermissionManager = () => {
  const { systemState, grantPermission, denyPermission } = useSystem()

  // Check if app has specific permission
  const hasPermission = useCallback((appId, permissionType) => {
    if (!appId || !permissionType) return false
    
    const appPermissions = systemState.permissions[appId]
    if (!appPermissions) return false

    return appPermissions[permissionType] === PERMISSION_STATUS.GRANTED
  }, [systemState.permissions])

  // Get permission status
  const getPermissionStatus = useCallback((appId, permissionType) => {
    if (!appId || !permissionType) return PERMISSION_STATUS.PENDING
    
    const appPermissions = systemState.permissions[appId]
    if (!appPermissions) return PERMISSION_STATUS.PENDING

    return appPermissions[permissionType] || PERMISSION_STATUS.PENDING
  }, [systemState.permissions])

  // Request permission (returns current status)
  const requestPermission = useCallback((appId, permissionType) => {
    if (!appId || !permissionType) {
      console.error('[PermissionManager] Invalid permission request')
      return PERMISSION_STATUS.DENIED
    }

    // Validate permission type
    if (!Object.values(PERMISSION_TYPES).includes(permissionType)) {
      console.error('[PermissionManager] Invalid permission type:', permissionType)
      return PERMISSION_STATUS.DENIED
    }

    // Check existing permission
    const currentStatus = getPermissionStatus(appId, permissionType)
    
    // If already decided, return current status
    if (currentStatus !== PERMISSION_STATUS.PENDING) {
      return currentStatus
    }

    // In real implementation, this would show a permission dialog
    // For now, return pending (UI will handle the prompt)
    return PERMISSION_STATUS.PENDING
  }, [getPermissionStatus])

  // Grant permission to app
  const handleGrantPermission = useCallback((appId, permissionType) => {
    if (!appId || !permissionType) {
      console.error('[PermissionManager] Invalid grant request')
      return false
    }

    grantPermission(appId, permissionType)
    console.log(`[PermissionManager] Granted ${permissionType} to ${appId}`)
    return true
  }, [grantPermission])

  // Deny permission to app
  const handleDenyPermission = useCallback((appId, permissionType) => {
    if (!appId || !permissionType) {
      console.error('[PermissionManager] Invalid deny request')
      return false
    }

    denyPermission(appId, permissionType)
    console.log(`[PermissionManager] Denied ${permissionType} to ${appId}`)
    return true
  }, [denyPermission])

  // Revoke permission
  const revokePermission = useCallback((appId, permissionType) => {
    return handleDenyPermission(appId, permissionType)
  }, [handleDenyPermission])

  // Get all permissions for an app
  const getAppPermissions = useCallback((appId) => {
    if (!appId) return {}
    return systemState.permissions[appId] || {}
  }, [systemState.permissions])

  // Check if app needs permission
  const needsPermission = useCallback((appId, permissionType) => {
    const app = systemState.installedApps.find(a => a.id === appId)
    if (!app || !app.permissions) return false
    
    return app.permissions.includes(permissionType)
  }, [systemState.installedApps])

  return {
    PERMISSION_TYPES,
    PERMISSION_STATUS,
    
    // Query methods
    hasPermission,
    getPermissionStatus,
    getAppPermissions,
    needsPermission,
    
    // Action methods
    requestPermission,
    grantPermission: handleGrantPermission,
    denyPermission: handleDenyPermission,
    revokePermission
  }
}

export default usePermissionManager

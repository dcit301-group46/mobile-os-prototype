# System Applications Development
**Module Documentation - Asaph**

## Overview

The System Applications module provides essential built-in applications that demonstrate OS functionality and give users control over system features. These applications serve as both functional tools and demonstrations of OS concepts including process management, resource access, and inter-process communication.

## Responsibilities

As System Applications developer, responsibilities include:

1. **Settings Application** - System configuration and control center
2. **Calculator Application** - Mathematical operations (already implemented)
3. **Notes Application** - Text editing with storage permissions
4. **File Manager Application** - File system simulation and management
5. **App Integration** - Proper use of system services and permissions
6. **UI Consistency** - Maintaining iPhone design language across all apps

## Module Structure

### Application Files

```
src/apps/
├── Settings/
│   ├── Settings.jsx
│   ├── Settings.css
│   └── components/
│       ├── ConnectivitySection.jsx
│       ├── BatterySection.jsx
│       ├── AppManagementSection.jsx
│       └── PermissionsSection.jsx
├── Calculator/
│   ├── Calculator.jsx          # ✅ Already implemented
│   └── Calculator.css
├── Notes/
│   ├── Notes.jsx
│   ├── Notes.css
│   └── components/
│       ├── NotesList.jsx
│       └── NoteEditor.jsx
└── FileManager/
    ├── FileManager.jsx
    ├── FileManager.css
    └── components/
        ├── FileList.jsx
        ├── FolderView.jsx
        └── FileActions.jsx
```

## Technical Implementation

### 1. Settings Application

The Settings app serves as the system control center, integrating all system services.

#### Features:
- **Connectivity Controls**: WiFi, Cellular, Airplane Mode toggles
- **Battery Information**: Level, charging status, power save mode
- **App Management**: Running apps list, memory usage, force stop
- **Permission Manager**: View and revoke app permissions
- **System Information**: OS version, device info, storage

#### Implementation Pattern:
```javascript
import { useSystem } from '../../system/SystemContext'
import { useConnectivityManager } from '../../services/ConnectivityManager'
import { useBatteryManager } from '../../services/BatteryManager'
import { usePermissionManager } from '../../services/PermissionManager'
import { useAppManager } from '../../system/AppManager'

const Settings = () => {
  const { systemState } = useSystem()
  const { wifi, cellular, toggleWifi, toggleCellular } = useConnectivityManager()
  const { batteryLevel, isCharging, powerSaveMode } = useBatteryManager()
  const { runningApps, memoryUsage, terminateApp } = useAppManager()
  const { getAppPermissions, revokePermission } = usePermissionManager()

  return (
    <div className="settings-app">
      <ConnectivitySection />
      <BatterySection />
      <AppManagementSection />
      <PermissionsSection />
    </div>
  )
}
```

#### Sections:

**Connectivity Section**:
- WiFi toggle with connection status
- Cellular toggle with signal strength
- Airplane mode toggle
- Network type indicator (WiFi/Cellular/None)

**Battery Section**:
- Visual battery indicator
- Percentage display
- Charging status
- Power save mode toggle
- Battery health information

**App Management Section**:
- List of running apps
- Memory usage per app
- Total memory usage vs limit
- Force stop button per app
- App state indicator

**Permissions Section**:
- List of all installed apps
- Permissions granted to each app
- Revoke permission buttons
- Permission descriptions

### 2. Notes Application

A text editing application demonstrating storage permissions and file operations.

#### Features:
- Create, edit, delete notes
- Save notes to localStorage/IndexedDB
- List view of all notes
- Search functionality
- Note metadata (created, modified dates)
- Storage permission requirement

#### Storage Pattern:
```javascript
import { usePermissionManager } from '../../services/PermissionManager'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const { hasPermission, requestPermission } = usePermissionManager()

  useEffect(() => {
    // Check storage permission
    if (!hasPermission('notes', 'storage')) {
      requestPermission('notes', 'storage')
    } else {
      loadNotes()
    }
  }, [])

  const loadNotes = async () => {
    const saved = localStorage.getItem('notes-data')
    if (saved) setNotes(JSON.parse(saved))
  }

  const saveNote = (note) => {
    const updated = [...notes, { ...note, id: Date.now() }]
    setNotes(updated)
    localStorage.setItem('notes-data', JSON.stringify(updated))
  }

  return <div className="notes-app">...</div>
}
```

#### Data Structure:
```javascript
{
  id: number,           // Unique identifier
  title: string,        // Note title
  content: string,      // Note body
  created: timestamp,   // Creation date
  modified: timestamp,  // Last modified
  color: string        // UI color tag
}
```

### 3. File Manager Application

Simulates a file system with folders and files.

#### Features:
- Folder navigation (hierarchical)
- File creation, rename, delete
- File properties (size, type, date)
- Search files
- Storage usage visualization
- Storage permission enforcement

#### File System Structure:
```javascript
{
  name: string,        // File/folder name
  type: 'file' | 'folder',
  size: number,        // Bytes (for files)
  created: timestamp,
  modified: timestamp,
  path: string,        // Full path
  parent: string,      // Parent folder path
  children: [],        // For folders
  content: string      // For text files
}
```

#### Navigation Pattern:
```javascript
const FileManager = () => {
  const [currentPath, setCurrentPath] = useState('/')
  const [files, setFiles] = useState(initialFileSystem)

  const navigateToFolder = (folderPath) => {
    setCurrentPath(folderPath)
  }

  const getCurrentFiles = () => {
    return files.filter(f => f.parent === currentPath)
  }

  return (
    <div className="file-manager">
      <PathBreadcrumb path={currentPath} />
      <FileList files={getCurrentFiles()} />
    </div>
  )
}
```

## Design Guidelines

### iPhone Design Language

All apps must follow these design principles:

**Colors**:
- Primary: #007AFF (blue)
- Background: #FFFFFF (white)
- Secondary: #8E8E93 (gray)
- Text: #000000 (black)
- Destructive: #FF3B30 (red)

**Typography**:
- Headings: 17px, weight 600
- Body: 15px, weight 400
- Caption: 13px, weight 400
- Font: -apple-system, system-ui

**Spacing**:
- Section padding: 20px
- Item spacing: 12px
- Border radius: 12px
- Icon size: 24px

**Components**:
- Toggles: iOS-style switches
- Lists: Grouped with dividers
- Buttons: Rounded, 12px radius
- Icons: Font Awesome only

### App Window Template

All apps should use consistent window structure:

```jsx
<div className="app-window">
  <div className="app-header">
    <span className="app-title">App Name</span>
    <button className="app-close" onClick={() => closeApp('app-id')}>
      <FontAwesomeIcon icon={faXmark} />
    </button>
  </div>
  <div className="app-body">
    {/* App content */}
  </div>
</div>
```

```css
.app-window {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.app-header {
  padding: 16px 20px;
  padding-top: 62px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.app-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
```

## Integration with System Services

### Using SystemContext

```javascript
import { useSystem } from '../../system/SystemContext'

const App = () => {
  const { systemState, launchApp, closeApp } = useSystem()
  
  // Access system state
  const { installedApps, runningApps } = systemState
}
```

### Using BatteryManager

```javascript
import { useBatteryManager } from '../../services/BatteryManager'

const BatterySection = () => {
  const { batteryLevel, isCharging, powerSaveMode } = useBatteryManager()
  
  return (
    <div className="battery-info">
      <div>Battery: {Math.round(batteryLevel)}%</div>
      {isCharging && <div>Charging...</div>}
    </div>
  )
}
```

### Using ConnectivityManager

```javascript
import { useConnectivityManager } from '../../services/ConnectivityManager'

const ConnectivitySection = () => {
  const { wifi, cellular, toggleWifi, toggleCellular } = useConnectivityManager()
  
  return (
    <div className="connectivity">
      <Toggle checked={wifi} onChange={toggleWifi} label="WiFi" />
      <Toggle checked={cellular} onChange={toggleCellular} label="Cellular" />
    </div>
  )
}
```

### Using PermissionManager

```javascript
import { usePermissionManager } from '../../services/PermissionManager'

const App = () => {
  const { hasPermission, requestPermission } = usePermissionManager()
  
  useEffect(() => {
    if (!hasPermission('app-id', 'storage')) {
      requestPermission('app-id', 'storage')
    }
  }, [])
}
```

### Using AppManager

```javascript
import { useAppManager } from '../../system/AppManager'

const AppList = () => {
  const { runningApps, memoryUsage, terminateApp } = useAppManager()
  
  return (
    <div>
      <div>Memory: {memoryUsage}MB / 512MB</div>
      {runningApps.map(app => (
        <div key={app.id}>
          {app.name} - {app.memoryUsage}MB
          <button onClick={() => terminateApp(app.id)}>Stop</button>
        </div>
      ))}
    </div>
  )
}
```

## App Registration

Each app must be registered in BootManager during system initialization:

```javascript
// In BootManager.js
const systemApps = [
  {
    id: 'settings',
    name: 'Settings',
    iconType: 'fontawesome',
    icon: 'cog',
    category: 'system',
    permissions: [],
    memoryUsage: 20
  },
  {
    id: 'notes',
    name: 'Notes',
    iconType: 'fontawesome',
    icon: 'sticky-note',
    category: 'productivity',
    permissions: ['storage'],
    memoryUsage: 25
  },
  {
    id: 'files',
    name: 'File Manager',
    iconType: 'fontawesome',
    icon: 'folder',
    category: 'system',
    permissions: ['storage'],
    memoryUsage: 30
  }
]
```

## OS Concepts Demonstrated

### 1. Process Management
- Each app runs as a separate "process" in runningApps array
- Apps can be paused, resumed, or terminated
- Memory allocation per app tracked

### 2. Permission System
- Apps declare required permissions
- Runtime permission checks before accessing resources
- User can grant/deny permissions
- Settings app allows permission management

### 3. Inter-Process Communication
- Apps communicate via SystemContext (shared state)
- Settings app can control other apps (force stop)
- Apps read system state (battery, connectivity)

### 4. File System Simulation
- Notes and File Manager demonstrate file operations
- Storage permission required
- File metadata tracking
- Hierarchical folder structure

### 5. Resource Management
- Apps consume memory based on memoryUsage property
- System enforces memory limits
- Apps can be terminated to free memory

## Testing Checklist

### Settings App
- [ ] WiFi toggle works and updates status bar
- [ ] Cellular toggle works and updates status bar
- [ ] Airplane mode disables both WiFi and Cellular
- [ ] Battery section shows correct percentage
- [ ] Battery section shows charging status
- [ ] Running apps list displays correctly
- [ ] Memory usage totals correctly
- [ ] Force stop terminates apps
- [ ] Permissions section lists all apps
- [ ] Revoke permission works

### Notes App
- [ ] Permission request shown on first launch
- [ ] Can create new note
- [ ] Can edit existing note
- [ ] Can delete note
- [ ] Notes persist after app close
- [ ] Search filters notes correctly
- [ ] Note metadata displays correctly

### File Manager
- [ ] Permission request shown on first launch
- [ ] Can navigate folders
- [ ] Can create files/folders
- [ ] Can rename items
- [ ] Can delete items
- [ ] Storage usage displayed correctly
- [ ] File properties shown correctly
- [ ] Search finds files

## Performance Considerations

### Memory Efficiency
- Use lazy loading for large file lists
- Implement virtual scrolling for long lists
- Clean up event listeners on unmount
- Minimize state updates

### Storage Efficiency
- Use IndexedDB for large data (>5MB)
- Compress data when storing
- Implement storage quotas
- Clean up old data

### Rendering Optimization
- Memoize expensive calculations
- Use React.memo for list items
- Debounce search inputs
- Virtualize long lists

## Code Examples

### Settings Toggle Component

```javascript
const ToggleRow = ({ label, checked, onChange, icon }) => (
  <div className="setting-row">
    <div className="setting-label">
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </div>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider"></span>
    </label>
  </div>
)
```

### Notes List Item

```javascript
const NoteItem = ({ note, onSelect, onDelete }) => (
  <div className="note-item" onClick={() => onSelect(note)}>
    <h3>{note.title || 'Untitled'}</h3>
    <p>{note.content.substring(0, 50)}...</p>
    <div className="note-meta">
      {new Date(note.modified).toLocaleDateString()}
    </div>
    <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>
      <FontAwesomeIcon icon={faTrash} />
    </button>
  </div>
)
```

### File Item Component

```javascript
const FileItem = ({ file, onOpen }) => (
  <div className="file-item" onClick={() => onOpen(file)}>
    <FontAwesomeIcon icon={file.type === 'folder' ? faFolder : faFile} />
    <div className="file-info">
      <div className="file-name">{file.name}</div>
      <div className="file-meta">
        {file.type === 'file' && formatSize(file.size)}
        {' • '}
        {new Date(file.modified).toLocaleDateString()}
      </div>
    </div>
  </div>
)
```

## Common Patterns

### Permission Check Pattern

```javascript
const useStoragePermission = () => {
  const { hasPermission, requestPermission } = usePermissionManager()
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const checkPermission = async () => {
      const hasAccess = hasPermission('app-id', 'storage')
      if (!hasAccess) {
        const status = await requestPermission('app-id', 'storage')
        setGranted(status === 'granted')
      } else {
        setGranted(true)
      }
    }
    checkPermission()
  }, [])

  return granted
}
```

### Storage Pattern

```javascript
const usePersistedState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}
```

## Error Handling

### Permission Denied

```javascript
if (!hasPermission('notes', 'storage')) {
  return (
    <div className="permission-required">
      <FontAwesomeIcon icon={faLock} size="3x" />
      <h3>Storage Permission Required</h3>
      <p>Notes needs storage access to save your notes.</p>
      <button onClick={() => requestPermission('notes', 'storage')}>
        Grant Permission
      </button>
    </div>
  )
}
```

### Memory Limit

```javascript
const handleLaunchApp = () => {
  const { allowed, reason } = canLaunchApp('app-id')
  if (!allowed) {
    showAlert({
      type: 'error',
      message: `Cannot launch app: ${reason}`
    })
    return
  }
  launchApp('app-id')
}
```

## Future Enhancements

1. **Settings App**
   - Display settings with sliders
   - Notification settings
   - App data management
   - System reset option

2. **Notes App**
   - Rich text formatting
   - Note categories/tags
   - Note sharing
   - Cloud sync simulation

3. **File Manager**
   - File preview
   - File compression
   - File sharing
   - Cloud storage integration

## Documentation Standards

### Component Documentation

```javascript
/**
 * Settings Application
 * 
 * System control center providing access to:
 * - Connectivity settings (WiFi, Cellular)
 * - Battery information and power management
 * - Running apps and memory usage
 * - App permissions management
 * 
 * Memory Usage: 20MB
 * Permissions: None required
 * 
 * @returns {JSX.Element} Settings application component
 */
const Settings = () => {
  // Implementation
}
```

## Integration Timeline

**Phase 1**: Settings App (Priority)
- Connectivity section
- Battery section
- Basic layout

**Phase 2**: Settings Enhancement
- App management section
- Permissions section
- System info

**Phase 3**: Notes App
- Basic CRUD operations
- Storage permission
- List view

**Phase 4**: Notes Enhancement
- Search functionality
- Note metadata
- UI polish

**Phase 5**: File Manager
- Folder navigation
- File operations
- Storage visualization

**Phase 6**: File Manager Enhancement
- File search
- Storage management
- Advanced features

## Contact

**Module Owner**: Asaph  
**Role**: System Applications Developer  
**Responsibilities**: Settings, Notes, File Manager, and all system apps

For questions about system applications, app integration, or UI consistency, reach out via the team communication channel.

---

**Last Updated**: February 3, 2026  
**Version**: 1.0  
**Status**: Ready for Implementation

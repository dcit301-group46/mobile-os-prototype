import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faXmark, 
  faFolder,
  faFile,
  faChevronRight,
  faChevronLeft,
  faPlus,
  faTrash,
  faImage,
  faFileAlt,
  faFileVideo,
  faFileAudio,
  faMagnifyingGlass,
  faEllipsisVertical,
  faGripVertical,
  faList,
  faHardDrive,
  faHome,
  faPencil
} from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import { usePermissionManager } from '../../services/PermissionManager'
import './FileManager.css'

/**
 * File Manager Application - Simulated file system
 * Demonstrates storage permission and file operations
 * Features: Browse, Create, Delete, Search, Grid/List view
 */
const FileManager = () => {
  const { closeApp } = useSystem()
  const { requestPermission, checkPermission, PERMISSION_TYPES } = usePermissionManager()
  
  const [hasPermission, setHasPermission] = useState(false)
  const [fileSystem, setFileSystem] = useState(null)
  const [currentPath, setCurrentPath] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showNewMenu, setShowNewMenu] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [contextMenu, setContextMenu] = useState(null)

  useEffect(() => {
    checkStoragePermission()
    loadFileSystem()
  }, [])

  const checkStoragePermission = async () => {
    const permission = await checkPermission('files', PERMISSION_TYPES.STORAGE)
    setHasPermission(permission === 'granted')
  }

  const requestStoragePermission = async () => {
    const granted = await requestPermission('files', PERMISSION_TYPES.STORAGE)
    setHasPermission(granted)
    if (granted) {
      loadFileSystem()
    }
  }

  const loadFileSystem = () => {
    try {
      const savedFS = localStorage.getItem('mobile-os-filesystem')
      if (savedFS) {
        setFileSystem(JSON.parse(savedFS))
      } else {
        // Initialize default file system
        const defaultFS = {
          name: 'Root',
          type: 'folder',
          children: [
            {
              name: 'Documents',
              type: 'folder',
              children: [
                { name: 'Welcome.txt', type: 'file', size: 245, modified: new Date().toISOString() }
              ]
            },
            {
              name: 'Photos',
              type: 'folder',
              children: []
            },
            {
              name: 'Downloads',
              type: 'folder',
              children: []
            }
          ]
        }
        setFileSystem(defaultFS)
        saveFileSystem(defaultFS)
      }
    } catch (error) {
      console.error('[FileManager] Failed to load filesystem:', error)
    }
  }

  const saveFileSystem = (fs) => {
    try {
      localStorage.setItem('mobile-os-filesystem', JSON.stringify(fs))
      setFileSystem(fs)
    } catch (error) {
      console.error('[FileManager] Failed to save filesystem:', error)
    }
  }

  const getCurrentFolder = () => {
    let current = fileSystem
    for (const pathItem of currentPath) {
      current = current.children.find(item => item.name === pathItem)
    }
    return current
  }

  const navigateToFolder = (folderName) => {
    setCurrentPath([...currentPath, folderName])
    setSelectedItem(null)
  }

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1))
    setSelectedItem(null)
  }

  const createNewFolder = () => {
    const folderName = prompt('Enter folder name:')
    if (!folderName) return

    const newFolder = {
      name: folderName,
      type: 'folder',
      children: []
    }

    const updatedFS = { ...fileSystem }
    const currentFolder = getCurrentFolderRef(updatedFS)
    currentFolder.children.push(newFolder)
    saveFileSystem(updatedFS)
    setShowNewMenu(false)
  }

  const createNewFile = () => {
    const fileName = prompt('Enter file name:')
    if (!fileName) return

    const newFile = {
      name: fileName,
      type: 'file',
      size: 0,
      modified: new Date().toISOString()
    }

    const updatedFS = { ...fileSystem }
    const currentFolder = getCurrentFolderRef(updatedFS)
    currentFolder.children.push(newFile)
    saveFileSystem(updatedFS)
    setShowNewMenu(false)
  }

  const getCurrentFolderRef = (fs) => {
    let current = fs
    for (const pathItem of currentPath) {
      current = current.children.find(item => item.name === pathItem)
    }
    return current
  }

  const deleteItem = (itemName) => {
    setDeleteConfirm(itemName)
  }

  const confirmDelete = () => {
    const itemName = deleteConfirm
    const updatedFS = { ...fileSystem }
    const currentFolder = getCurrentFolderRef(updatedFS)
    currentFolder.children = currentFolder.children.filter(item => item.name !== itemName)
    saveFileSystem(updatedFS)
    setSelectedItem(null)
    setDeleteConfirm(null)
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const getFileIcon = (item) => {
    if (item.type === 'folder') return faFolder
    
    const ext = item.name.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return faImage
    if (['mp4', 'mov', 'avi'].includes(ext)) return faFileVideo
    if (['mp3', 'wav', 'aac'].includes(ext)) return faFileAudio
    return faFileAlt
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const calculateTotalStorage = (folder) => {
    let total = 0
    const traverse = (item) => {
      if (item.type === 'file') {
        total += item.size || 0
      } else if (item.children) {
        item.children.forEach(traverse)
      }
    }
    traverse(folder)
    return total
  }

  const filterItems = (items) => {
    if (!searchQuery) return items
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const renameItem = (oldName, newName) => {
    const updatedFS = { ...fileSystem }
    const currentFolder = getCurrentFolderRef(updatedFS)
    const item = currentFolder.children.find(i => i.name === oldName)
    if (item) {
      item.name = newName
      saveFileSystem(updatedFS)
    }
    setContextMenu(null)
  }

  const getFileColor = (item) => {
    if (item.type === 'folder') return '#007AFF'
    const ext = item.name.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '#FF3B30'
    if (['mp4', 'mov', 'avi'].includes(ext)) return '#FF9500'
    if (['mp3', 'wav', 'aac'].includes(ext)) return '#34C759'
    return '#8E8E93'
  }

  if (!hasPermission) {
    return (
      <div className="app-window filemanager-app">
        <div className="app-header">
          <span className="app-title">Files</span>
          <button className="app-close" onClick={() => closeApp('files')}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="app-body">
          <div className="permission-request">
            <div className="permission-modal">
              <div className="permission-content">
                <div className="permission-icon">
                  <FontAwesomeIcon icon={faFolder} />
                </div>
                <h3>Storage Access Required</h3>
                <p>Files needs access to storage to manage your files and folders.</p>
              </div>
              <div className="permission-buttons">
                <button className="permission-btn cancel" onClick={() => closeApp('files')}>
                  Don't Allow
                </button>
                <button className="permission-btn primary" onClick={requestStoragePermission}>
                  Allow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentFolder = getCurrentFolder()
  const items = filterItems(currentFolder?.children || [])
  const totalStorage = fileSystem ? calculateTotalStorage(fileSystem) : 0
  const maxStorage = 512 * 1024 * 1024 // 512MB

  return (
    <div className="app-window filemanager-app">
      <div className="app-header">
        <span className="app-title">Files</span>
        <button className="app-close" onClick={() => closeApp('files')}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className="app-body">
        {/* Storage Info */}
        <div className="storage-info">
          <div className="storage-icon">
            <FontAwesomeIcon icon={faHardDrive} />
          </div>
          <div className="storage-details">
            <div className="storage-bar">
              <div 
                className="storage-fill" 
                style={{ width: `${(totalStorage / maxStorage) * 100}%` }}
              ></div>
            </div>
            <span className="storage-text">
              {formatSize(totalStorage)} of {formatSize(maxStorage)} used
            </span>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <button 
            className="breadcrumb-item"
            onClick={() => setCurrentPath([])}
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </button>
          {currentPath.map((path, index) => (
            <div key={index} className="breadcrumb-segment">
              <FontAwesomeIcon icon={faChevronRight} className="breadcrumb-separator" />
              <button 
                className="breadcrumb-item"
                onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              >
                {path}
              </button>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="filemanager-toolbar">
          <div className="search-bar-files">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search files"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <button 
              className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            <button 
              className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FontAwesomeIcon icon={faGripVertical} />
            </button>
            <button 
              className="btn-new" 
              onClick={() => setShowNewMenu(!showNewMenu)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            {showNewMenu && (
              <div className="new-menu">
                <button onClick={createNewFolder}>
                  <FontAwesomeIcon icon={faFolder} />
                  New Folder
                </button>
                <button onClick={createNewFile}>
                  <FontAwesomeIcon icon={faFileAlt} />
                  New File
                </button>
              </div>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FontAwesomeIcon icon={searchQuery ? faMagnifyingGlass : faFolder} />
            </div>
            <h3>{searchQuery ? 'No Results' : 'Empty Folder'}</h3>
            <p>{searchQuery ? 'No files match your search' : 'This folder is empty'}</p>
          </div>
        ) : (
          <div className={`file-list ${viewMode}-view`}>
            {items.map((item, index) => (
              <div
                key={index}
                className={`file-item ${selectedItem === item.name ? 'selected' : ''}`}
                onClick={() => {
                  if (item.type === 'folder') {
                    navigateToFolder(item.name)
                  } else {
                    setSelectedItem(item.name)
                  }
                }}
              >
                <div className="file-item-icon" style={{ color: getFileColor(item) }}>
                  <FontAwesomeIcon 
                    icon={getFileIcon(item)}
                  />
                </div>
                <div className="file-item-content">
                  <h3 className="file-item-name">{item.name}</h3>
                  {viewMode === 'list' && (
                    <p className="file-item-meta">
                      {item.type === 'folder' 
                        ? `${item.children?.length || 0} items` 
                        : `${formatSize(item.size)} • ${formatDate(item.modified)}`
                      }
                    </p>
                  )}
                </div>
                <div className="file-item-actions">
                  <button 
                    className="btn-menu"
                    onClick={(e) => {
                      e.stopPropagation()
                      setContextMenu(contextMenu === item.name ? null : item.name)
                    }}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                  {contextMenu === item.name && (
                    <div className="context-menu">
                      <button onClick={() => {
                        const newName = prompt('Rename to:', item.name)
                        if (newName && newName !== item.name) {
                          renameItem(item.name, newName)
                        }
                      }}>
                        <FontAwesomeIcon icon={faPencil} />
                        Rename
                      </button>
                      <button 
                        className="delete-option"
                        onClick={() => {
                          deleteItem(item.name)
                          setContextMenu(null)
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="delete-confirmation">
          <div className="delete-modal">
            <div className="delete-content">
              <h3>Delete "{deleteConfirm}"?</h3>
              <p>This item will be permanently deleted. This action cannot be undone.</p>
            </div>
            <div className="delete-buttons">
              <button className="delete-btn cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-btn confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileManager

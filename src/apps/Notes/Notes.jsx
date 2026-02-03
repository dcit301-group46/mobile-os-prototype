import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faXmark, 
  faPlus, 
  faChevronRight,
  faChevronLeft,
  faTrash,
  faFolder,
  faMagnifyingGlass,
  faEllipsisVertical,
  faCheck,
  faClock,
  faPencil
} from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import { usePermissionManager } from '../../services/PermissionManager'
import './Notes.css'

/**
 * Notes Application - Text note creation and management
 * Demonstrates storage permission usage
 * Features: Create, Edit, Delete, Search, Auto-save
 */
const Notes = () => {
  const { closeApp } = useSystem()
  const { requestPermission, checkPermission, PERMISSION_TYPES } = usePermissionManager()
  
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [saveStatus, setSaveStatus] = useState('saved') // 'saving', 'saved'
  const [showNoteMenu, setShowNoteMenu] = useState(false)

  useEffect(() => {
    checkStoragePermission()
    loadNotes()
  }, [])

  const checkStoragePermission = async () => {
    const permission = await checkPermission('notes', PERMISSION_TYPES.STORAGE)
    setHasPermission(permission === 'granted')
  }

  const requestStoragePermission = async () => {
    const granted = await requestPermission('notes', PERMISSION_TYPES.STORAGE)
    setHasPermission(granted)
    if (granted) {
      loadNotes()
    }
  }

  const loadNotes = () => {
    try {
      const savedNotes = localStorage.getItem('mobile-os-notes')
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    } catch (error) {
      console.error('[Notes] Failed to load notes:', error)
    }
  }

  const saveNotes = (updatedNotes) => {
    try {
      setSaveStatus('saving')
      localStorage.setItem('mobile-os-notes', JSON.stringify(updatedNotes))
      setNotes(updatedNotes)
      setTimeout(() => setSaveStatus('saved'), 300)
    } catch (error) {
      console.error('[Notes] Failed to save notes:', error)
      setSaveStatus('saved')
    }
  }

  const createNewNote = () => {
    if (!hasPermission) {
      requestStoragePermission()
      return
    }

    const newNote = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedNotes = [newNote, ...notes]
    saveNotes(updatedNotes)
    setSelectedNote(newNote)
    setIsEditing(true)
  }

  const updateNote = (noteId, updates) => {
    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    )
    saveNotes(updatedNotes)
    setSelectedNote({ ...selectedNote, ...updates })
  }

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    saveNotes(updatedNotes)
    setSelectedNote(null)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getPreviewText = (content) => {
    return content.substring(0, 100) || 'No additional text'
  }

  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return note.title.toLowerCase().includes(query) || 
           note.content.toLowerCase().includes(query)
  })

  const getNoteWordCount = (content) => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  if (!hasPermission) {
    return (
      <div className="app-window notes-app">
        <div className="app-header">
          <span className="app-title">Notes</span>
          <button className="app-close" onClick={() => closeApp('notes')}>
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
                <p>Notes would like to access storage to save and retrieve your notes.</p>
              </div>
              <div className="permission-buttons">
                <button className="permission-btn cancel" onClick={() => closeApp('notes')}>
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

  if (selectedNote && isEditing) {
    return (
      <div className="app-window notes-app">
        <div className="app-header">
          <button className="back-btn" onClick={() => {
            setIsEditing(false)
            setSelectedNote(null)
            setShowNoteMenu(false)
          }}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>Notes</span>
          </button>
          <div className="editor-actions">
            <div className="save-indicator">
              {saveStatus === 'saving' ? (
                <span className="saving">Saving...</span>
              ) : (
                <span className="saved">
                  <FontAwesomeIcon icon={faCheck} /> Saved
                </span>
              )}
            </div>
            <button className="menu-btn" onClick={() => setShowNoteMenu(!showNoteMenu)}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
          <button className="app-close" onClick={() => closeApp('notes')}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {showNoteMenu && (
          <div className="note-menu">
            <button 
              className="menu-item delete-item"
              onClick={() => {
                deleteNote(selectedNote.id)
                setShowNoteMenu(false)
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Delete Note</span>
            </button>
          </div>
        )}

        <div className="app-body editor-view">
          <input
            type="text"
            className="note-title-input"
            value={selectedNote.title}
            onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
            placeholder="Title"
            autoFocus={!selectedNote.title || selectedNote.title === 'New Note'}
          />
          <textarea
            className="note-content-input"
            value={selectedNote.content}
            onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
            placeholder="Start writing..."
          />
          <div className="editor-footer">
            <div className="note-info">
              <span className="note-timestamp">
                <FontAwesomeIcon icon={faClock} />
                {formatDate(selectedNote.updatedAt)}
              </span>
              <span className="note-stats">
                {getNoteWordCount(selectedNote.content)} words
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-window notes-app">
      <div className="app-header">
        <span className="app-title">Notes</span>
        <button className="app-close" onClick={() => closeApp('notes')}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className="app-body">
        <div className="notes-header">
          <h2>{notes.length} {notes.length === 1 ? 'Note' : 'Notes'}</h2>
          <button className="btn-new-note" onClick={createNewNote}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        {notes.length > 0 && (
          <div className="search-bar">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FontAwesomeIcon icon={faPencil} />
            </div>
            <h3>No Notes</h3>
            <p>Create your first note to get started</p>
            <button className="btn-primary" onClick={createNewNote}>
              <FontAwesomeIcon icon={faPlus} />
              <span>New Note</span>
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <h3>No Results</h3>
            <p>No notes match your search</p>
          </div>
        ) : (
          <div className="notes-list">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="note-item"
                onClick={() => {
                  setSelectedNote(note)
                  setIsEditing(true)
                }}
              >
                <div className="note-item-content">
                  <h3 className="note-item-title">{note.title}</h3>
                  <div className="note-item-meta">
                    <span className="note-item-date">
                      {formatDate(note.updatedAt)}
                    </span>
                    <span className="note-separator">•</span>
                    <span className="note-item-preview">{getPreviewText(note.content)}</span>
                  </div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="note-chevron" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notes

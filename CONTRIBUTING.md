# Contributing to Mobile OS Prototype

## Git Workflow

We use a three-stage branching strategy:

```
feature/* → dev → review → prod
```

### Branch Purposes

- **dev**: Default branch for active development (protected)
- **review**: Integration testing and QA (protected)
- **prod**: Production-ready code for demos and submission (protected)
- **feature/***: Individual feature development
- **main**: Historical reference (rarely used)

### Rules

1. Never commit directly to `dev`, `review`, or `prod`
2. All work must be done in feature branches
3. Only the Team Lead (Calyx Ish) merges between main branches
4. All code must pass review before merging

## Development Workflow

**Important:** The default branch is `dev`. When you clone the repository, you'll automatically be on `dev`.

### 1. Start New Feature

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

### 2. Work on Your Feature

Make your changes and commit regularly:

```bash
git add .
git commit -m "[MODULE] Description of changes"
git push origin feature/your-feature-name
```

### 3. Create Pull Request

- Go to GitHub repository
- Click "New Pull Request"
- Base branch: `dev`
- Compare branch: `feature/your-feature-name`
- Fill out the PR template
- Request review from Team Lead

### 4. Address Review Comments

If changes are requested:

```bash
git add .
git commit -m "[MODULE] Address review comments"
git push origin feature/your-feature-name
```

### 5. After Merge

Once your PR is merged, delete your feature branch:

```bash
git checkout dev
git pull origin dev
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

## Commit Message Format

Use this format for all commits:

```
[MODULE] Short description

Optional detailed explanation
```

### Examples

```
[Permissions] Add camera permission request dialog
[Battery] Implement power consumption algorithm
[UI] Create home screen layout
[AppManager] Add app pause and resume logic
[Connectivity] Implement WiFi toggle
```

## Code Standards

### React Rules

- Use functional components only (no class components)
- Use hooks for state and side effects
- Follow React 18 best practices
- Keep components small and focused

### JavaScript Standards

- Use ES2020+ features
- Use `const` and `let` (never `var`)
- Use arrow functions
- Use destructuring where appropriate
- Use optional chaining (`?.`)

### File Naming

- Components: `PascalCase.jsx` (e.g., `AppManager.jsx`)
- Utilities: `camelCase.js` (e.g., `batteryUtils.js`)
- Styles: `ComponentName.css` or `componentName.module.css`

### Code Organization

```javascript
import statements

constants

helper functions

main component/function

export statement
```

### Example Component Structure

```javascript
import { useState, useEffect } from 'react'
import './Component.css'

const INITIAL_STATE = {}

const Component = () => {
  const [state, setState] = useState(INITIAL_STATE)

  useEffect(() => {
    // side effects
  }, [])

  const handleAction = () => {
    // handler logic
  }

  return (
    <div className="component">
      {/* JSX */}
    </div>
  )
}

export default Component
```

## Module Responsibilities

| Member | Module | Folder |
|--------|--------|--------|
| Calyx Ish | System Core | `src/system/`, `src/navigation/` |
| Herbert | UI/UX | `src/ui/` |
| Mabel | App Lifecycle | `src/system/AppManager.js` |
| Obed | Permissions | `src/services/PermissionManager.js` |
| Jonas | Connectivity | `src/services/ConnectivityManager.js` |
| James | Battery | `src/services/BatteryManager.js` |
| Asaph | System Apps | `src/apps/` |
| Joy | Testing/Docs | `tests/`, `docs/` |

## Common Issues

### Merge Conflicts

If you encounter merge conflicts:

1. Pull latest `dev` branch:
```bash
git checkout dev
git pull origin dev
```

2. Merge into your feature branch:
```bash
git checkout feature/your-feature-name
git merge dev
```

3. Resolve conflicts in your editor
4. Commit and push:
```bash
git add .
git commit -m "[MODULE] Resolve merge conflicts"
git push origin feature/your-feature-name
```

### Sync with Latest Code

Before starting work each day:

```bash
git checkout dev
git pull origin dev
git checkout feature/your-feature-name
git merge dev
```

## Testing

Before creating a PR:

1. Run the development server:
```bash
npm run dev
```

2. Test your feature thoroughly
3. Check browser console for errors
4. Test on different screen sizes

## Questions?

Contact Team Lead (Calyx Ish) or ask in the team group chat.

## Remember

- No feature branch, no merge
- No pull request, no review
- No review, no production

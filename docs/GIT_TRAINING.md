# Git Training Guide - Group 46
## 10-Minute Quick Start

### What We're Using

Three-stage workflow:
- **feature/*** - Your individual work
- **dev** - Default branch, active development (you start here)
- **review** - Integration testing
- **prod** - Final release for submission
- **main** - Historical (ignore this)

### The Golden Rules

1. Never work directly on dev, review, or prod
2. Always create a feature branch
3. Always pull latest dev before starting
4. Commit often with clear messages

## Part 1: Initial Setup (2 minutes)

### Clone the Repository

```bash
git clone https://github.com/dcit301-group46/mobile-os-prototype.git
cd mobile-os-prototype
```

**Note:** You'll automatically be on the `dev` branch (our default branch).

### Configure Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Check Your Setup

```bash
git status
git branch -a
```

You should see `dev`, `review`, and `prod` branches.

## Part 2: Daily Workflow (5 minutes)

### Step 1: Start Your Day

Always get the latest code:

```bash
git checkout dev
git pull origin dev
```

### Step 2: Create Feature Branch

Name format: `feature/short-description`

```bash
git checkout -b feature/permission-dialog
```

Examples:
- `feature/wifi-toggle`
- `feature/battery-indicator`
- `feature/calculator-app`
- `feature/home-screen-layout`

### Step 3: Work and Commit

Make changes to your files, then:

```bash
git status
git add .
git commit -m "[Permissions] Add permission request dialog"
git push origin feature/permission-dialog
```

### Commit Message Format

```
[MODULE] Short description
```

Examples:
```
[Battery] Implement drain algorithm
[UI] Add status bar component
[AppManager] Add app pause logic
[Connectivity] Create WiFi service
```

### Step 4: Create Pull Request

1. Go to GitHub repository
2. You'll see a prompt: "Compare & pull request"
3. Click it
4. Base branch: `dev`
5. Fill out the template
6. Click "Create pull request"

### Step 5: Wait for Review

Team Lead (Calyx) will:
- Review your code
- Request changes if needed
- Merge when approved

### Step 6: After Merge

Clean up your local branches:

```bash
git checkout dev
git pull origin dev
git branch -d feature/permission-dialog
```

## Part 3: Common Commands (2 minutes)

### Check Status

```bash
git status
```

Shows what files changed.

### See All Branches

```bash
git branch -a
```

### Switch Branches

```bash
git checkout branch-name
```

### See Commit History

```bash
git log --oneline
```

### Undo Last Commit (Not Pushed)

```bash
git reset --soft HEAD~1
```

### Discard Local Changes

```bash
git checkout -- filename
```

Or all files:
```bash
git checkout -- .
```

## Part 4: Handling Conflicts (1 minute)

If Git says there's a conflict:

### Step 1: Pull Latest Dev

```bash
git checkout dev
git pull origin dev
```

### Step 2: Merge Into Your Branch

```bash
git checkout feature/your-feature
git merge dev
```

### Step 3: Fix Conflicts

Open the conflicting file. You'll see:

```javascript
<<<<<<< HEAD
your code
=======
incoming code
>>>>>>> dev
```

Choose which to keep, remove the markers, then:

```bash
git add .
git commit -m "[MODULE] Resolve merge conflicts"
git push origin feature/your-feature
```

## Quick Reference Card

### Starting Work
```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
```

### Saving Work
```bash
git add .
git commit -m "[MODULE] Description"
git push origin feature/my-feature
```

### Finishing Work
```bash
# Create PR on GitHub
# After merge:
git checkout dev
git pull origin dev
git branch -d feature/my-feature
```

## What NOT to Do

- Don't commit directly to dev
- Don't force push (`git push -f`)
- Don't commit large files
- Don't commit `node_modules/`
- Don't leave merge conflict markers
- Don't use vague commit messages like "fix" or "update"

## Need Help?

1. Check `git status` first
2. Ask in team group chat
3. Contact Calyx (Team Lead)

## Practice Exercise

Try this now:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/test-feature
echo "# Test" > test.md
git add test.md
git commit -m "[Test] Add test file"
git push origin feature/test-feature
```

Then create a PR on GitHub!

## Remember

**No feature branch, no merge.**  
**No pull request, no review.**  
**No review, no production.**

Good luck!

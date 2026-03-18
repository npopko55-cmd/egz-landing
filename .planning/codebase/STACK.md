# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- Markdown - Documentation and artifact generation across agent workflows
- Python - PDF processing and manipulation scripts via smithery.ai skill

**Secondary:**
- JSON - Configuration files and data serialization (`settings.json`, `skills-lock.json`)

## Runtime

**Environment:**
- Claude Code (Anthropic) - AI framework for multi-agent orchestration
- Python 3.x - Execution environment for PDF skill scripts

**Package Manager:**
- smithery.ai - Well-known skills registry for `pdf` skill distribution
- Lockfile: Present (`skills-lock.json`)

## Frameworks

**Core:**
- Claude Agent Teams - Multi-agent orchestration framework (experimental, requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)
- Markdown-based workflow - File-first architecture for agent communication and artifacts

**Testing:**
- None detected - Demo-focused project with manual validation through artifact inspection

**Build/Dev:**
- tmux - Required terminal multiplexer for split-pane agent execution
- iTerm2 (optional) - Alternative multiplexer with `tmux -CC` support

## Key Dependencies

**Critical:**
- `pdf` skill (smithery.ai, version hash: cfbc539377088ca7e44a813b30c306327385bbd973cd7a721e1743f60837dd62) - Handles PDF operations: reading, extracting, merging, filling forms, creating PDFs
- `WebSearch` - Built-in Claude capability for web research, required by `web-researcher` agent
- `Skill(gsd:map-codebase)` - Codebase analysis skill for project documentation

**Infrastructure:**
- pypdf - Python library for PDF manipulation (merge, split, rotate, extract text)
- pdfplumber - Python library for advanced PDF text and table extraction
- reportlab - Python library for PDF creation and document generation
- pdf2image - Python library for converting PDF pages to images
- pytesseract - Python library for OCR on scanned PDFs (optional, for accessibility)
- Pillow (PIL) - Python image processing (implied dependency of pdf2image)

## Configuration

**Environment:**
- `.claude/settings.json` - Project-level Claude Code settings:
  - `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` - Enables multi-agent team functionality (mandatory)
  - `teammateMode: "tmux"` - Specifies terminal multiplexer for split-pane execution (mandatory)
- `.claude/settings.local.json` - Local permissions:
  - `WebSearch` - Allowed for research agents
  - `Skill(gsd:map-codebase)` - Allowed for codebase analysis

**Build:**
- No build configuration files present (Markdown-first, no compilation)
- `skills-lock.json` - Locks `pdf` skill to specific version hash for reproducibility

## Platform Requirements

**Development:**
- macOS (Darwin) - Primary development platform
- tmux or iTerm2 - Terminal multiplexer required for multi-pane agent execution
- Python 3.x with pip - For PDF manipulation scripts
- Font support - Arial Unicode font at `/Library/Fonts/Arial Unicode.ttf` (required for PDF generation with reportlab)

**Production:**
- Claude Code environment - Cloud-based AI runtime
- macOS/Linux environment - For Python script execution in agent workflows
- PDF skill runtime - Managed by smithery.ai registry

---

*Stack analysis: 2026-03-18*

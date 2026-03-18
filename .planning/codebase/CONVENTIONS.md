# Coding Conventions

**Analysis Date:** 2026-03-18

## Project Nature

This is a demonstration project for Claude Code Agent Teams — a multi-agent system where specialized AI agents collaborate through shared artifacts, explicit handoff messages, and asynchronous communication. The project emphasizes **visible coordination** and **artifact-driven workflows** over hidden state.

## Naming Patterns

**Files:**
- Agent role definitions: `<role-name>.md` — lowercase with hyphens (e.g., `showrunner.md`, `web-researcher.md`, `fact-checker.md`)
- Artifact files: descriptive English names with hyphens (e.g., `research-summary.md`, `verified-claims.md`, `script-outline.md`, `visual-plan.md`)
- Handoff messages: `message-template.md` for templates, `msg-<nnn>.md` for instances (e.g., `msg-001`)
- Configuration: `settings.json`, `settings.local.json`
- Template files: `<name>.template.md` (e.g., `brief.template.md`)
- Python scripts: `generate_<output>.py` (e.g., `generate_pdf.py`)

**Directories:**
- Agent definitions: `.claude/agents/`
- Runtime artifacts: `agent-runtime/` with subdirectories: `shared/`, `messages/`, `state/`, `outputs/`
- Planning documentation: `.planning/codebase/`

**Variables & Constants (Python):**
- UPPERCASE_SNAKE_CASE for constants: `FONT_PATH`, `OUTPUT_PDF`, `ACCENT`, `SCRIPT_DIR`
- snake_case for functions: `get_styles()`, `cover_page()`, `build_pdf()`
- snake_case for local variables: `story`, `styles_dict`, `col_widths`
- CamelCase for class names: `ColorBar`, `SimpleDocTemplate`

## Code Style

**Python Formatting:**
- Module docstring at top: `"""Generate final PDF report for Claude Code Agent Teams YouTube demo."""`
- Imports grouped: standard library first, then reportlab imports, then custom code
- Line length: practical 80–100 characters for readability
- Comments: line-level comments for non-obvious decisions, section markers with `# --- Section Name ---`
- Style dictionaries using comprehensible keys: `s["title"]`, `s["body"]`, `s["h1"]`, `s["visual"]`

**Markdown Conventions:**
- Agent instruction files: heading structure `# Агент: [Role]`, `## Миссия`, `## Обязанности`, `## Контракт выхода`
- Artifact files: metadata header (дата, автор, статус) followed by content sections
- Claim/thesis format: `### Тезис N`, **Утверждение:**, **Статус:**, **Уровень доверия:**, **Источник проверки:**
- Handoff message template: YAML-like key-value pairs: `id:`, `from:`, `to:`, `type:`, `artifacts:`, `needs:`, `deadline:`

**Colors & Styling (reportlab):**
- Define color constants at module top: `DARK`, `ACCENT`, `ACCENT_LIGHT`, `GRAY`, `LIGHT_BG`
- Use ParagraphStyle for all text: never raw canvas text properties
- Style objects stored in dictionary returned by `styles()` or `get_styles()` function

## Import Organization

**Order:**
1. `#!/usr/bin/env python3` shebang
2. Module docstring
3. Standard library imports (`os`, `from reportlab.lib.pagesizes`, etc.)
4. Third-party imports (reportlab)
5. Local imports (none in this project yet, but would go last)

**Path Aliases:**
Not used in this codebase. File paths are absolute: `os.path.dirname(os.path.abspath(__file__))` to resolve relative to script location.

## Error Handling

**Strategy:** No explicit error handling in current Python scripts.

**Patterns observed:**
- Font registration assumes Arial Unicode exists at `/Library/Fonts/Arial Unicode.ttf`
- Reportlab methods are called directly without try-catch
- File operations are straightforward writes
- Recommendation for extensions: wrap PDF build in try-finally to ensure cleanup

**Markdown validation:**
- Agent role files assume correct markdown syntax — no validation
- Artifact files follow consistent metadata header pattern

## Logging

**Framework:** No logging library used.

**Patterns:**
- Print statements for progress: `print(f"PDF generated: {OUTPUT_PDF}")`
- Status messages embedded in PDF as text: "Статус: FINAL | 14/15 approved | 6 agents | 12+ sources"
- Metadata comments in artifacts: `**Дата:** 2026-03-13`, `**Автор:** web-researcher`, `**Статус:** Готово к проверке`

## Comments

**When to Comment:**
- Complex reportlab style definitions: `# --- Colors ---`, `# --- Font setup ---`
- Section boundaries in story building: `# ============ COVER ============`, `# ============ SECTION 1: HOOK ============`
- Non-obvious tuning parameters: `# Gradient-like background`, `# Bottom accent bar`
- No comments on simple variable assignments or self-documenting code

**Documentation Style:**
- Module-level docstring explaining purpose
- Function docstrings: single-line for simple functions (`"""Build the complete PDF report."""`)
- Markdown files use headers and bold text for structure, not inline code comments

## Function Design

**Size:** Functions are utility-focused and reasonably compact.

**Examples:**
- `get_styles()` — ~60 lines, returns style dictionary
- `build_pdf()` — ~450 lines, orchestrates entire PDF generation
- `cover_page()` — ~12 lines, canvas callback
- `ColorBar.draw()` — ~8 lines, custom flowable drawing

**Parameters:**
- Minimal — most state passed via closure (s, story, doc, color constants)
- Callback functions receive canvas and doc: `def cover_page(canvas_obj, doc):`
- No default parameters with mutable defaults

**Return Values:**
- Functions return built objects: `doc.build(story, ...)` modifies in place
- Style function returns dictionary
- Main `build()` function has no explicit return (modifies filesystem)

## Module Design

**Exports:**
- `if __name__ == "__main__": build()` — single entry point
- No module-level exports, only function definitions
- Constants at module level for reuse within file

**Structure:**
- Constants (fonts, colors, paths) at top
- Utility functions in middle (styles, page callbacks)
- Main orchestration function last (`build()`)
- Executed immediately when script runs

## Communication Patterns (Agent Protocol)

**Artifact Format:**
All intermediate results stored as markdown files with metadata headers:
```
# [Title]

**Дата:** YYYY-MM-DD
**Автор:** [agent-name]
**Статус:** [status]

---

[Content sections]
```

**Handoff Messages:**
Stored in `agent-runtime/messages/`:
```
id: msg-NNN
from: [agent]
to: [agent or list]
type: assignment | approval | blocker | revision
topic: [what this is about]
artifacts:
  - path/to/artifact1.md
  - path/to/artifact2.md
needs:
  - [expected output 1]
  - [expected output 2]
deadline: immediate | [timeframe]
notes: [optional context]
```

**Status Tracking:**
Files in `agent-runtime/state/`:
- `plan.md` — overall workflow structure
- `status.md` — current phase and blockers

## Project-Specific Rules

**For Agent Definitions (.claude/agents/):**
- Russian language for instruction files (primary audience)
- English for code comments and variable names
- Clear mission/obligation/output contract structure
- No nested role hierarchy — flat set of specialists

**For Runtime Artifacts:**
- Always include source URLs for claims
- Confidence levels: high/medium/low
- Approval workflow: approved/revise/rejected
- Chain of responsibility: researcher -> fact-checker -> script-architect

**For PDF Generation:**
- Metadata headers with author, date, status on cover
- Table of contents with clear numbering
- Color scheme: dark background (DARK #1a1a2e), accent colors (ACCENT #6c5ce7 or #e17055)
- Headers and footers on all pages except cover
- Alternating row backgrounds in tables for readability

---

*Conventions analysis: 2026-03-18*

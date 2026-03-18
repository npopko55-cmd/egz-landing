# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
Agent Teams/
├── .claude/                       # Claude Code project configuration and agent definitions
│   ├── agents/                    # Agent role definitions (primary architecture point)
│   ├── settings.json              # Project-wide settings (experimental agent teams flag)
│   ├── settings.local.json        # Local overrides (teammate mode)
│   └── skills/                    # Shared skills across agents (PDF handling)
│
├── agent-runtime/                 # Execution runtime for agent work and coordination
│   ├── shared/                    # Shared artifacts passed between agents
│   ├── messages/                  # Handoff and coordination messages
│   ├── state/                     # Execution plan and status tracking
│   ├── outputs/                   # Final deliverables
│   └── README.md                  # Runtime protocol documentation
│
├── thoughts/                      # Documentation and specifications
│   └── shared/
│       └── specs/                 # Architecture and workflow specifications
│
├── .planning/                     # GSD planning artifacts (generated)
│   └── codebase/                  # Codebase documentation (ARCHITECTURE.md, STRUCTURE.md)
│
├── .git/                          # Version control
├── .agents/                       # Agent team metadata (readonly)
├── CLAUDE.md                      # Master project instruction document
├── prompt.md                      # Initial task prompt
└── settings.json                  # Runtime settings
```

## Directory Purposes

**`.claude/agents/`:**
- Purpose: Store individual agent role definitions as markdown prompts
- Contains: Agent mission, obligations, interaction rules, output contracts
- Key files: `showrunner.md`, `web-researcher.md`, `fact-checker.md`, `script-architect.md`, `visual-director.md`, `pdf-producer.md`, `README.md`

**`.claude/settings.json`:**
- Purpose: Configure experimental agent teams and teammate mode
- Contains: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, `teammateMode=tmux`
- Critical: Must not be changed to `in-process` for this project

**`.claude/skills/pdf/`:**
- Purpose: Provide PDF manipulation capabilities for pdf-producer agent
- Contains: Python scripts for PDF conversion, form filling, validation
- Key scripts: `extract_form_structure.py`, `fill_fillable_fields.py`, `convert_pdf_to_images.py`

**`agent-runtime/shared/`:**
- Purpose: Central workspace for inter-agent artifacts and working documents
- Contains: Research outputs, verified claims, scripts, visual plans, briefs
- Key files: `brief.template.md`, `research-raw.md`, `research-summary.md`, `verified-claims.md`, `fact-check-notes.md`, `script-outline.md`, `visual-plan.md`
- Access pattern: All agents read and write here

**`agent-runtime/messages/`:**
- Purpose: Explicit handoff protocol between agents
- Contains: Assignment messages, handoff notifications, approval/rejection decisions, blocker reports
- Key files: `message-template.md` (defines structure)
- Format: Timestamped markdown with from/to/type/artifacts fields

**`agent-runtime/state/`:**
- Purpose: Track execution state and dependencies
- Contains: Execution plan, status updates, process metadata
- Key files: `plan.md` (dependency graph), `status.md` (current phase and blockers)

**`agent-runtime/outputs/`:**
- Purpose: Store final deliverables ready for export
- Contains: Video script, image prompts, final report, PDF files
- Key files: `video-script.md`, `final-report.md`, `final-report.pdf`, `image-prompts.md`, `final-approval.md`

**`thoughts/shared/specs/`:**
- Purpose: Document architecture decisions and workflow options
- Contains: Specification for YouTube demo workflow
- Key files: `2026-03-13-claude-agent-teams-youtube-workflow.md` (source of truth for design)

## Key File Locations

**Entry Points:**
- `CLAUDE.md`: Master project instruction document - read first, highest authority
- `prompt.md`: Initial task/brief template for operators
- `.claude/agents/README.md`: Overview of available agent roles

**Configuration:**
- `.claude/settings.json`: Experimental features flag
- `settings.json`: Project runtime settings
- `.claude/settings.local.json`: Local environment overrides

**Core Logic:**
- `.claude/agents/showrunner.md`: Orchestrator and coordinator
- `.claude/agents/web-researcher.md`: Information gathering
- `.claude/agents/fact-checker.md`: Verification layer
- `.claude/agents/script-architect.md`: Narrative construction
- `.claude/agents/visual-director.md`: Visual concept development
- `.claude/agents/pdf-producer.md`: Final assembly and export

**Testing / Execution:**
- `agent-runtime/shared/brief.template.md`: Task template
- `agent-runtime/state/plan.md`: Execution plan (created by showrunner)
- `agent-runtime/messages/message-template.md`: Handoff structure template

## Naming Conventions

**Files:**
- Agent role files: `{role-name}.md` in `.claude/agents/` (kebab-case)
- Artifact files: `{content-type}-{stage}.md` in `agent-runtime/shared/` or `agent-runtime/outputs/`
  - Examples: `research-raw.md`, `verified-claims.md`, `video-script.md`
- Message files: `message-{id}.md` in `agent-runtime/messages/` with id format `msg-{3-digit}`
- State files: `{state-type}.md` in `agent-runtime/state/`
  - Examples: `plan.md`, `status.md`

**Directories:**
- Role directories: lowercase with no spaces (e.g., `agent-runtime`, `.claude`)
- Subdirectories: lowercase, semantic names (`shared`, `messages`, `state`, `outputs`)
- Skill directories: lowercase category names (e.g., `pdf`)

## Where to Add New Code

**New Agent Role:**
- Primary location: Create `{role-name}.md` in `.claude/agents/`
- Template: Copy from existing agent file, modify Mission/Obligations/Output Contract sections
- Update: Add reference to `.claude/agents/README.md`

**New Shared Artifact Type:**
- Primary location: `agent-runtime/shared/{artifact-type}.md`
- Format: Use existing artifact structure with headers, source references, metadata
- Reference: Update agent instructions to read/write this artifact

**New Skill/Capability:**
- Primary location: Create directory in `.claude/skills/{capability}/`
- Structure: Store both documentation (SKILL.md, reference.md) and implementation scripts
- Example: `pdf/` skill contains SKILL.md, reference.md, scripts/, LICENSE

**New Message Type:**
- Primary location: Document in `agent-runtime/messages/message-template.md`
- Examples: `assignment`, `handoff`, `blocker`, `approval`, `revision-request`
- Pattern: All messages contain id, from, to, type, topic, artifacts, needs

**Specifications and Decisions:**
- Location: `thoughts/shared/specs/YYYY-MM-DD-{topic}.md`
- Pattern: Include problem statement, success criteria, implementation variants
- Reference: Linked from CLAUDE.md under "Sources of Truth"

## Special Directories

**`.agents/` (readonly):**
- Purpose: Agent team metadata managed by Claude Code framework
- Generated: Yes
- Committed: No
- User action: Do not modify manually

**`.git/`:**
- Purpose: Version control for project artifacts
- Generated: Yes
- Committed: Yes (includes codebase changes and artifact history)

**`.planning/codebase/`:**
- Purpose: GSD codebase documentation
- Generated: Yes (by mapping tool)
- Committed: Yes (documentation artifacts)
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, STACK.md, INTEGRATIONS.md

**`.claude/skills/pdf/scripts/`:**
- Purpose: Python utility scripts for PDF processing
- Generated: No (hand-written utilities)
- Committed: Yes
- Usage: Called by pdf-producer agent during final assembly

## Process Flow Mapped to Structure

```
Operator input
    ↓
prompt.md / brief.template.md
    ↓
agent-runtime/shared/brief.md (filled)
    ↓
showrunner reads brief → creates plan
    ↓
agent-runtime/state/plan.md
    ↓
showrunner creates assignments
    ↓
agent-runtime/messages/message-*.md (assignments)
    ↓
Parallel: web-researcher + visual-director
    ↓
agent-runtime/shared/{research,visual}-*.md
    ↓
Handoff to fact-checker + script-architect
    ↓
agent-runtime/shared/{verified,script}-*.md
    ↓
Handoff to pdf-producer
    ↓
agent-runtime/outputs/{final-report,video-script}.{md,pdf}
    ↓
showrunner approval
    ↓
agent-runtime/outputs/final-approval.md
```

## Decision Records

**Why file-first communication:**
- Files are visible for YouTube demonstration
- Allows handoff traceability
- Enables offline artifact inspection
- Supports concurrent reading by multiple agents

**Why tmux requirement:**
- Split-pane visibility for simultaneous agent sessions
- Matches Claude Code Agent Teams documentation
- Enables live demonstration of parallel execution
- Required by CLAUDE.md as non-negotiable

**Why `.claude/agents/` for role definitions:**
- Matches Claude Code project conventions
- Allows roles to be loaded by teammates automatically
- Keeps agent instructions separate from runtime data
- Supports multiple team configurations in same project

---

*Structure analysis: 2026-03-18*

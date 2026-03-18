# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**Web Search:**
- Google/Web Search API (via Claude's built-in `WebSearch` capability)
  - Purpose: `web-researcher` agent gathers current facts, statistics, and source-backed claims
  - Client: Built-in Claude capability, accessed through natural language instructions
  - Auth: Implicit through Claude Code environment

**Codebase Analysis:**
- GSD Map Codebase Skill
  - Purpose: Project documentation and architecture analysis
  - Permission: `Skill(gsd:map-codebase)` allowed in `.claude/settings.local.json`
  - Used by: Future automated documentation workflows

## Data Storage

**File Storage:**
- Local filesystem (agent-runtime directory structure)
  - `agent-runtime/shared/` - Intermediate artifacts shared between agents
  - `agent-runtime/messages/` - Handoff messages and inter-agent communication
  - `agent-runtime/state/` - Plan and status tracking
  - `agent-runtime/outputs/` - Final deliverables (scripts, reports, PDFs)
  - Connection: Direct file I/O via Claude Code file system access
  - No database backend

**Artifact Types:**
- Markdown documents - Research summaries, verified claims, scripts
- PDF files - Final reports and formatted outputs
- JSON/Text files - Structured data and configuration

## Caching

**None** - Stateless agent execution with file-based persistence

## Authentication & Identity

**Auth Provider:**
- Custom - Role-based access through `.claude/agents/` configuration files
  - `showrunner` - Team coordinator and approval authority
  - `web-researcher` - Research specialist with WebSearch access
  - `fact-checker` - Validation specialist
  - `script-architect` - Narrative builder
  - `visual-director` - Visual direction specialist
  - `pdf-producer` - Report packaging specialist
  - Implementation: Markdown instructions define role permissions and responsibilities

## Monitoring & Observability

**Error Tracking:**
- None detected - Manual monitoring through artifact inspection and handoff messages

**Logs:**
- File-based logging via artifact creation
  - `agent-runtime/state/status.md` - Current process status and blockers
  - `agent-runtime/messages/` - Message log of inter-agent communication
  - Approach: Implicit event logging through file artifacts and timestamps in messages

## CI/CD & Deployment

**Hosting:**
- Claude Code cloud environment (Anthropic)
- Local macOS development environment with tmux terminal multiplexer

**CI Pipeline:**
- None detected - Manual workflow orchestration through `showrunner` agent

## Environment Configuration

**Required env vars:**
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` - Enable Agent Teams feature
- No external service credentials required in `.env` files

**Secrets location:**
- Not applicable - Demo project with no external API keys
- Note: No `.env` file present or needed

## Webhooks & Callbacks

**Incoming:**
- None - Project is self-contained demonstration, not exposed as service

**Outgoing:**
- None - File-based output only, no external callbacks

## External Dependencies Summary

**Smithery.ai Skill Registry:**
- `pdf` skill - Well-known skill source
  - Provides: PDF reading, writing, merging, splitting, form filling, OCR
  - Used by: `pdf-producer` agent and Python scripts
  - Python libraries wrapped: pypdf, pdfplumber, reportlab, pdf2image, pytesseract

## Data Flow

```
User Brief
    ↓
showrunner (plan)
    ├── web-researcher (WebSearch → research-raw.md, research-summary.md)
    └── visual-director (visual-plan.md) [parallel]
        ↓
    fact-checker (verify sources → verified-claims.md)
        ↓
    script-architect (narrative construction → video-script.md)
        ↓
    pdf-producer (final-report.md + final-report.pdf)
        ↓
    showrunner (approval)
```

All communication flows through:
1. Artifact files in `agent-runtime/`
2. Handoff messages in `agent-runtime/messages/`
3. Direct agent-to-agent handoffs (no central coordinator between specialized agents)

---

*Integration audit: 2026-03-18*

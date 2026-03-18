# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Supervised multi-agent pipeline with explicit handoff communication and file-based artifact passing.

**Key Characteristics:**
- Lead-managed process orchestration through a `showrunner` supervisor
- Specialized agent roles defined in `CLAUDE.md` and `.claude/agents/`
- File-first communication: agents pass work through shared artifact files, not chat
- Visible runtime with explicit state tracking for YouTube demonstration purposes
- Support for parallel execution when task dependencies allow
- tmux-based split-pane execution for visible multi-session agents

## Layers

**Agent Instruction Layer:**
- Purpose: Define the contract and specialization for each agent role
- Location: `.claude/agents/`
- Contains: Individual prompt files (showrunner.md, web-researcher.md, fact-checker.md, script-architect.md, visual-director.md, pdf-producer.md)
- Depends on: Runtime artifact structure in `agent-runtime/`
- Used by: Claude Code Agent Teams execution engine

**Shared Runtime Layer:**
- Purpose: Provide filesystem-based infrastructure for inter-agent communication and artifact passing
- Location: `agent-runtime/`
- Contains: Structured directories for shared work files, messages, state tracking, and outputs
- Depends on: File I/O and clear naming conventions
- Used by: All agent roles simultaneously

**Coordination Layer:**
- Purpose: Manage dependencies, sequencing, and approvals
- Location: `showrunner.md` (primary orchestrator) coordinating with message-based handoffs
- Contains: Plan creation, status updates, assignment logic, approval decisions
- Depends on: Shared runtime state files
- Used by: All downstream agents for task assignment and dependency resolution

## Data Flow

**Intake to Planning:**

1. Operator/brief provider writes initial task to `agent-runtime/shared/brief.md` or `agent-runtime/shared/brief.template.md`
2. `showrunner` reads brief and creates execution plan
3. `showrunner` writes `agent-runtime/state/plan.md` with phases and dependencies
4. `showrunner` creates assignment messages in `agent-runtime/messages/`

**Parallel Research and Visual Discovery:**

1. `web-researcher` and `visual-director` read brief and plan
2. Both agents work in parallel on independent tasks
3. `web-researcher` writes raw findings to `agent-runtime/shared/research-raw.md`
4. `web-researcher` writes summary to `agent-runtime/shared/research-summary.md`
5. `visual-director` writes visual plan to `agent-runtime/shared/visual-plan.md`

**Verification Pipeline:**

1. `web-researcher` sends handoff message to `fact-checker`
2. `fact-checker` reads research artifacts
3. `fact-checker` writes verification results to `agent-runtime/shared/verified-claims.md`
4. `fact-checker` writes detailed notes to `agent-runtime/shared/fact-check-notes.md`
5. `fact-checker` sends approval/revision messages to both `web-researcher` and `script-architect`

**Script Assembly:**

1. `script-architect` reads verified claims and visual plan
2. `script-architect` reads brief for audience/tone context
3. `script-architect` writes narrative structure to `agent-runtime/shared/script-outline.md`
4. `script-architect` writes final video script to `agent-runtime/outputs/video-script.md`

**Final Assembly:**

1. `pdf-producer` reads all completed artifacts
2. `pdf-producer` assembles final report in `agent-runtime/outputs/final-report.md`
3. `pdf-producer` renders PDF version to `agent-runtime/outputs/final-report.pdf`
4. `showrunner` writes final approval note to `agent-runtime/outputs/final-approval.md`

**State Management:**

- Brief state: `agent-runtime/shared/brief.md` (single source of truth)
- Execution plan: `agent-runtime/state/plan.md` (created by showrunner)
- Process status: `agent-runtime/state/status.md` (updated after major phases)
- Handoff protocol: Files in `agent-runtime/messages/` with message template structure
- Artifact handoff: Each agent creates both artifact file and corresponding message

## Key Abstractions

**Agent Role:**
- Purpose: Represent a specialized function in the content creation pipeline
- Examples: `.claude/agents/showrunner.md`, `.claude/agents/web-researcher.md`, `.claude/agents/fact-checker.md`
- Pattern: Each role file contains mission, obligations, interaction rules, and output contracts

**Artifact:**
- Purpose: Store intermediate or final output that can be read by other agents
- Examples: `research-raw.md`, `verified-claims.md`, `video-script.md`
- Pattern: Markdown files with structured headers, source references, and versioning info

**Handoff Message:**
- Purpose: Explicitly signal work passing between agents
- Examples: Structured markdown files in `agent-runtime/messages/`
- Pattern: Contains id, from, to, type, topic, artifacts, needs, deadline, notes

**Brief:**
- Purpose: Initial task specification containing goal, audience, constraints
- Examples: `agent-runtime/shared/brief.template.md` (template), filled during intake
- Pattern: Top-level source of truth for what the team is building

## Entry Points

**Lead Session:**
- Location: Main Claude Code session running within tmux
- Triggers: User instruction to create Agent Team
- Responsibilities: Invoke showrunner, manage teammates lifecycle, run final cleanup

**Showrunner Agent:**
- Location: `.claude/agents/showrunner.md` spawned as first teammate
- Triggers: Lead creates team and assigns showrunner
- Responsibilities: Read brief, create plan, assign tasks, coordinate dependencies, approve final output

**Web Researcher Agent:**
- Location: `.claude/agents/web-researcher.md` spawned as teammate
- Triggers: Showrunner assignment message
- Responsibilities: Search web, extract claims, create research artifacts, pass to fact-checker

**Visual Director Agent:**
- Location: `.claude/agents/visual-director.md` spawned as teammate
- Triggers: Showrunner assignment message (parallel with web-researcher)
- Responsibilities: Develop visual concepts, create image prompts, pass plan to script-architect

**Fact Checker Agent:**
- Location: `.claude/agents/fact-checker.md` spawned as teammate
- Triggers: Web researcher handoff message
- Responsibilities: Verify claims, assess confidence levels, request revisions or approve

**Script Architect Agent:**
- Location: `.claude/agents/script-architect.md` spawned as teammate
- Triggers: Fact checker approval and visual director completion
- Responsibilities: Combine verified claims with visual direction into narrative structure

**PDF Producer Agent:**
- Location: `.claude/agents/pdf-producer.md` spawned as teammate
- Triggers: Script architect completion
- Responsibilities: Aggregate all artifacts into final report, render to PDF

## Error Handling

**Strategy:** Explicit revision loops with visibility, no silent failures

**Patterns:**
- `fact-checker` can request revisions from `web-researcher` if sources are weak or claims unsupported
- `script-architect` can request revisions to claims if narrative integration fails
- `showrunner` can reject output at any stage and request rework
- All revision requests create explicit message artifacts in `agent-runtime/messages/`
- Blocking issues prevent advancement to next stage (e.g., unverified claims cannot enter script)

## Cross-Cutting Concerns

**Logging:** File-first logging - all significant events recorded in artifact files with timestamps; message files serve as activity log

**Validation:** Fact-checker layer responsible for claim validation; no unverified assertions pass into final outputs

**Authentication:** Not applicable - internal agent team, no external identity required

**State Tracking:** `agent-runtime/state/status.md` maintains single view of current phase, blockers, and responsible agent

**Coordination:** Showrunner maintains dependency graph in plan; handoff messages enforce explicit sequential/parallel task boundaries

**Configuration:** Project-level settings in `CLAUDE.md` specify tmux requirement and experimental agent teams flag in `.claude/settings.json`

---

*Architecture analysis: 2026-03-18*

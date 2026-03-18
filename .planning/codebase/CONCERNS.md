# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**Experimental Features Dependency:**
- Issue: Project relies on `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, which is explicitly marked as experimental in official Claude Code documentation
- Files: `.claude/settings.json`, `CLAUDE.md` (line 20)
- Impact: API surface may change without notice, features may break between Claude Code releases, future maintenance burden if experimental API is deprecated
- Fix approach: Plan migration path if agent teams stabilizes to different API. Document breaking changes in release notes. Monitor Claude Code changelog for deprecation notices.

**Platform-Specific Runtime Coupling:**
- Issue: Project enforces `tmux`-only execution mode via `CLAUDE.md` mandatory requirements and `.claude/settings.json` `teammateMode: "tmux"`. Windows/Ghostty/VS Code terminal users cannot run the demo as designed
- Files: `CLAUDE.md` (lines 5-12), `.claude/settings.json` (line 5)
- Impact: Reduces accessibility for half of potential demo viewers. In-process fallback is explicitly forbidden in requirements (CLAUDE.md line 9). Blocks Windows developers from reproducing workflow
- Fix approach: Document clear Windows workflow or provide in-process variant for documentation/testing. Create platform matrix in README showing tested configurations. Consider conditional tmux detection with graceful degradation

**Hardcoded Font Dependencies:**
- Issue: PDF generation scripts use hardcoded font path `/Library/Fonts/Arial Unicode.ttf` which exists only on macOS
- Files: `agent-runtime/outputs/generate_pdf.py` (line 18)
- Impact: PDF generation fails on Linux/Windows without font installation. No fallback mechanism. Users cannot generate PDFs on non-macOS systems
- Fix approach: Use font parameter or environment variable. Implement font fallback chain. Detect missing font and provide clear error message with installation instructions

**Artifact Format Fragility:**
- Issue: Multiple agents depend on specific Markdown file structure without formal schema. fact-checker expects `verified-claims.md` to have exact format with `approved`/`revise`/`rejected` statuses. Script-architect expects specific sections in `script-outline.md`
- Files: `.claude/agents/fact-checker.md` (lines 26-27), `.claude/agents/script-architect.md` (lines 33-34)
- Impact: If one agent formats output differently, downstream agents silently consume malformed data. No validation. No version control for artifact schema
- Fix approach: Define formal schema (JSON Schema or YAML) for all shared artifacts. Add validation step before handoff. Include example outputs in agent instructions

## Known Bugs

**tmux Split Pane Reliability Issues:**
- Symptoms: According to fact-check notes (`agent-runtime/shared/fact-check-notes.md`, lines 28-32), multiple known issues exist:
  - Issue #24292: `tmux` mode may not trigger iTerm2 split panes
  - Issue #24301: iTerm2 fallback collapses to in-process mode unexpectedly
  - Issue #23615: Agents spawn in new tmux window instead of split pane
  - Issue #24771: Split panes open but teammates disconnect from messaging
  - Issue #24385: iTerm2 panes don't close properly on shutdown
- Files: `agent-runtime/shared/fact-check-notes.md` (lines 28-32)
- Trigger: Running demo on macOS with iTerm2, especially with multiple teammates starting simultaneously
- Workaround: Force in-process mode for local testing (violates CLAUDE.md but works). Use native tmux instead of iTerm2 integration. Restart teammates individually if messaging drops

**PDF Generation Script Unilateral Mutation:**
- Symptoms: Two Python scripts in `agent-runtime/outputs/` (`generate_pdf.py` and `generate_video_script_pdf.py`) are created by agents but never called from the workflow. They overwrite `final-report.pdf` without coordination
- Files: `agent-runtime/outputs/generate_pdf.py`, `agent-runtime/outputs/generate_video_script_pdf.py`, `agent-runtime/outputs/final-report.pdf`
- Trigger: Running multiple agents or re-running pdf-producer without cleanup between runs
- Workaround: Add .gitignore rule for Python scripts in outputs. Document that PDF generation is manual via render-plan, not automatic

**Message Template Placeholder Ambiguity:**
- Symptoms: Message template contains literal placeholder text `замени-на-тему` and `замени-на-ожидаемый-результат` that agents must recognize and replace
- Files: `agent-runtime/messages/message-template.md` (lines 5, 9)
- Trigger: Agent copies template without replacing placeholders
- Workaround: Use template in actual handoff or create placeholder guard in showrunner checklist

## Security Considerations

**WebSearch Permission Overly Broad:**
- Risk: Local settings (`/.claude/settings.local.json`) grant unrestricted `WebSearch` permission. No rate limiting or cost controls documented
- Files: `.claude/settings.local.json` (lines 4-5)
- Current mitigation: Implied audience (demo context) and manual supervision
- Recommendations: Document search limits. Add cost estimate to CLAUDE.md. Implement search result filtering if web-researcher queries become adversarial. Consider moving WebSearch to individual agent permissions rather than global

**PDF Skill External Dependency:**
- Risk: `skills-lock.json` references external PDF skill from smithery.ai. Supply chain risk if smithery.ai becomes unavailable or changes behavior
- Files: `skills-lock.json`
- Current mitigation: Fallback render plan documented in `final-report-render-plan.md`
- Recommendations: Pin skill version. Document fallback options prominently. Test fallback (pandoc/Obsidian) regularly. Consider self-hosting if PDF skill becomes critical

**No Audit Trail for Agent Edits:**
- Risk: Agents modify shared artifacts directly without version history. If agent makes mistake, no rollback mechanism
- Files: `agent-runtime/shared/*`, `agent-runtime/outputs/*`
- Current mitigation: Handoff messages document who edited what, but edits themselves are invisible
- Recommendations: Implement simple versioning (append-only log per file). Use git for artifact tracking. Add checksum validation to handoff messages

## Performance Bottlenecks

**Sequential Verification Loop:**
- Problem: fact-checker validates research sequentially. If web-researcher provides 20 claims, fact-checker checks each one independently
- Files: `.claude/agents/fact-checker.md` (line 11), `agent-runtime/shared/fact-check-notes.md` (lines 10-13)
- Cause: No batch validation mechanism. Verification must happen linearly due to dependency on research artifacts
- Improvement path: Pre-filter strong claims during research phase. Implement sampling strategy for fact-checking (high-confidence claims bypass full verification). Parallelize fact-checking across multiple agents

**PDF Generation Python Script Latency:**
- Problem: `generate_pdf.py` uses reportlab which requires font loading and PDF structure building in-process. Complex HTML/markdown conversion adds 5-10 seconds per generation
- Files: `agent-runtime/outputs/generate_pdf.py` (lines 1-16)
- Cause: Full document building on every run. No caching. Font registration happens at module load time
- Improvement path: Cache compiled PDF template. Pre-render static sections. Use external tool (headless browser) for complex layouts. Move to async generation if becomes blocking

**Handoff Message File I/O:**
- Problem: Each handoff creates a new message file. For 6-agent team with multiple revision loops, can generate 30+ message files. Runtime performance degrades with file listing
- Files: `agent-runtime/messages/`
- Cause: File-per-message design. No batching or archival
- Improvement path: Implement message log (append-only) instead of file-per-message. Archive old messages to separate directory. Add index file for quick lookup

## Fragile Areas

**Brief Template → Plan Translation:**
- Files: `agent-runtime/shared/brief.template.md`, `.claude/agents/showrunner.md` (lines 11-14)
- Why fragile: Brief is free-form text with optional placeholders. showrunner must parse human-written brief and extract plan. If brief is malformed or missing required sections, showrunner may misinterpret goals
- Safe modification: Add structured brief validation in showrunner. Require brief to be YAML front matter + markdown. Add example briefs. Document what makes a "valid" brief
- Test coverage: No automated brief validation. No example briefs in repo. No test cases for edge cases (empty sections, contradictory constraints)

**Agent Instruction Coupling:**
- Files: All `.claude/agents/*.md` files assume specific input file format from upstream agents
- Why fragile: e.g., fact-checker assumes `research-summary.md` has exactly one claim per section with URL. script-architect assumes `verified-claims.md` has `approved` status field. If web-researcher reformats output, downstream breaks silently
- Safe modification: Add input schema validation at start of each agent. Check for required fields before processing. Fail loudly if upstream artifact doesn't match expected schema
- Test coverage: No schema validation. No contract tests between agents

**Revision Loop Termination:**
- Files: `CLAUDE.md` (lines 68-69), `.claude/agents/showrunner.md` (lines 15, 42)
- Why fragile: showrunner can request revisions indefinitely. No maximum iteration count. If fact-checker keeps rejecting and web-researcher keeps rewriting, process may not terminate. No deadline enforcement
- Safe modification: Add explicit revision limit (e.g., max 3 rounds). Implement escalation path (if can't agree, move forward with medium-confidence claims). Add timeout per stage
- Test coverage: No test for runaway revision loops. No handling of resource exhaustion

**Visual Director → Script Architect Timing Dependency:**
- Files: `.claude/agents/visual-director.md` (line 32), `.claude/agents/script-architect.md`
- Why fragile: visual-director must transmit visual hooks before script-architect freezes script. But there's no explicit wait or dependency enforcement. If visual-director is slow, script-architect may start writing without visual constraints
- Safe modification: Add explicit "ready for handoff" marker in visual-plan.md. script-architect checks for this marker before starting. Add timeout with fallback (if no visual plan after N minutes, script-architect proceeds without visuals)
- Test coverage: No test for out-of-order handoffs

## Scaling Limits

**Document Size Constraints:**
- Current capacity: Individual markdown artifacts grow to ~30KB (research-raw.md, verified-claims.md, video-script.md)
- Limit: LLM context window limits research depth and script length. PDF generation scales linearly with content size
- Scaling path: Implement pagination for long research summaries. Split video-script into multiple episodes. Archive old fact-check results

**Team Size Constraints:**
- Current capacity: 6 agents as designed per CLAUDE.md (line 103). Communications grow quadratically
- Limit: Beyond 8-10 agents, handoff messages become unmanageable. No broadcast mechanism, only point-to-point
- Scaling path: Implement broadcast channel in messages/ (one-to-many handoffs). Create agent hierarchies (subteams). Implement task queue instead of direct assignments

**Concurrent File Edits:**
- Current capacity: Sequential workflow means only one agent writes at a time
- Limit: If two agents try to edit same file (e.g., script-outline.md gets both brief updates and visual updates), last write wins, data loss occurs
- Scaling path: Implement per-section ownership. Add merge conflict detection. Use operational transformation or CRDTs for shared editing

## Dependencies at Risk

**Claude Code Agent Teams API Stability:**
- Risk: Feature is experimental (CLAUDE.md line 20). Breaking changes possible between releases
- Impact: Entire workflow becomes invalid if API changes (e.g., teammate message format, split pane behavior)
- Migration plan: Monitor Claude Code releases for experimental API changes. Create compatibility layer in settings.json. Document migration steps. Plan pivot to multi-process if agent teams deprecated

**reportlab for PDF:**
- Risk: Python package maintenance unclear for Cyrillic fonts (used in agent names and output)
- Impact: PDF generation may fail with unsupported characters or font loading errors
- Migration plan: Test with diverse Unicode. Keep fallback pandoc method updated. Consider PDF.js or headless browser as alternative

**iTerm2 split pane Mode:**
- Risk: Feature relies on iTerm2 proprietary integration. macOS-only. Subject to iTerm2 versioning
- Impact: Demo fails on standard Terminal.app, VS Code, Windows Terminal, Linux
- Migration plan: Make tmux the primary target. Test iTerm2 regularly but don't block on it. Document platform-specific instructions

## Missing Critical Features

**No Workflow Resume:**
- Problem: If a teammate crashes, no way to resume from last checkpoint. Must restart entire team from brief
- Blocks: Long-running demos. Production-like reliability. Recovery from network failures

**No Fact Confidence Aggregation:**
- Problem: fact-checker marks individual claims as `high`/`medium`/`low` confidence but script-architect gets only `approved`/`revise`/`rejected` decision
- Blocks: Ability to write "probably true" vs "definitely true" prose. Nuanced framing of uncertain claims

**No Visual Asset Generation:**
- Problem: visual-director creates prompts for image generation but no actual image generation happens
- Blocks: Complete end-to-end demo. Claim of "full content production"

**No Cost Tracking:**
- Problem: No mechanism to track tokens/cost across agent team
- Blocks: Budget forecasting. Understanding economic viability of workflow. Cost optimization

## Test Coverage Gaps

**Untested Workflows:**

**Multi-round Fact-Check Revision:**
- What's not tested: web-researcher creates flawed research → fact-checker rejects → web-researcher revises → fact-checker approves flow
- Files: `.claude/agents/web-researcher.md`, `.claude/agents/fact-checker.md`, `CLAUDE.md` (lines 68-69)
- Risk: Revision loop may have timeout or communication issues that only appear under real pressure
- Priority: HIGH (critical demo path)

**Failure Recovery:**
- What's not tested: What happens if one agent times out or returns empty result
- Files: All agent definitions
- Risk: Demo falls apart silently. No error messages. No fallback
- Priority: HIGH (production readiness)

**Edge Cases in Handoff Messages:**
- What's not tested: Messages with special characters in YAML front matter, missing required fields, circular dependencies
- Files: `agent-runtime/messages/`, all `.claude/agents/*.md` files
- Risk: Agent parsing fails or creates corrupted state
- Priority: MEDIUM (robustness)

**Scale Testing:**
- What's not tested: Large briefs (>2000 words), large research corpus (>100 claims), long scripts (>5000 words)
- Files: All agents, PDF generation
- Risk: Performance degradation, timeouts, context window overflow
- Priority: MEDIUM (future proofing)

---

*Concerns audit: 2026-03-18*

# Testing Patterns

**Analysis Date:** 2026-03-18

## Test Framework

**Runner:**
- Not applicable — no automated test suite in this project
- Project is a demonstration with manual verification

**Assertion Library:**
- Not applicable

**Run Commands:**
- No test commands — project runs agents manually in tmux
- PDF generation: `python3 agent-runtime/outputs/generate_pdf.py`
- Video script PDF: `python3 agent-runtime/outputs/generate_video_script_pdf.py`

## Test File Organization

**Location:**
- No dedicated test directory
- Verification happens through artifact review and file existence checks
- Manual inspection of generated PDFs in `agent-runtime/outputs/`

**Naming:**
- Not applicable — no test files

**Structure:**
- Not applicable

## Test Structure

**Manual Verification Process:**
Instead of automated tests, this project uses **artifact-driven verification**:

1. **Input validation:** Brief loaded and verified by showrunner
2. **Checkpoint validation:** Each agent creates artifacts; subsequent agents verify inputs:
   - web-researcher creates `research-summary.md` → fact-checker reviews
   - fact-checker creates `verified-claims.md` → script-architect reviews
   - script-architect creates `script-outline.md` → visual-director reviews
   - pdf-producer reviews all artifacts before packaging

3. **Status tracking:** `agent-runtime/state/status.md` tracks phases and blockers

**Expected Pattern for New Agents:**
- Create work artifact with metadata (date, author, status)
- Send handoff message indicating completion
- Wait for downstream agent feedback
- Revise if needed, re-publish artifact

## Mocking

**Framework:** No mocking framework used.

**Approach:**
- Each agent operates on real artifacts (markdown files)
- No external API mocks — web-researcher makes real searches
- Fact-checker validates against real documentation URLs
- This is by design — the project demonstrates real agent coordination

**Data Isolation:**
- Artifacts separated by agent in `agent-runtime/shared/`
- Each run creates fresh artifacts
- No data pollution between test runs

## Fixtures and Factories

**Test Data:**
`.claude/agents/` directory contains agent role definitions (fixtures):
- `showrunner.md` — orchestration agent template
- `web-researcher.md` — research agent template
- `fact-checker.md` — verification agent template
- `script-architect.md` — writing agent template
- `visual-director.md` — visual planning agent template
- `pdf-producer.md` — packaging agent template

**Brief Template:**
`agent-runtime/shared/brief.template.md` provides input fixture:
```markdown
# Бриф проекта

## Тема
[О чем этот эпизод или демо]

## Цель
[Что команда должна произвести]

## Аудитория
[Кто будет это смотреть и что он должен почувствовать или понять]

## Обязательно включить
- [Ключевая мысль]
- [Ключевое доказательство]
- [Ключевой результат]

## Ограничения
- Агенты должны общаться между собой явно
- Процесс должен быть понятен на видео
- Финальный пакет должен включать артефакт, готовый к экспорту в PDF

## Желательно добавить
- [Опциональный визуальный бит]
- [Опциональное сравнение]
```

**Message Template:**
`agent-runtime/messages/message-template.md` provides handoff fixture:
```markdown
id: msg-001
from: showrunner
to: web-researcher
type: assignment
topic: замени-на-тему
artifacts:
  - agent-runtime/shared/brief.md
needs:
  - замени-на-ожидаемый-результат
deadline: immediate
notes: сохраняй источники явно, чтобы их было легко проверить
```

**Location:**
- Role definitions: `.claude/agents/`
- Input template: `agent-runtime/shared/brief.template.md`
- Message template: `agent-runtime/messages/message-template.md`

## Coverage

**Requirements:** No coverage target enforced.

**View Coverage:** Not applicable — no test suite.

**Quality Gates (Artifact-Level):**

Instead of code coverage, project tracks **claim coverage**:
- Research claims tracked in `research-summary.md` (15 claims across 12 sources)
- Fact-checked claims tracked in `verified-claims.md` (14/15 approved, 1 revise)
- Script claims tracked in `video-script.md` (only approved claims used)
- Approval percentage: 93% (14 of 15 claims approved as high confidence)

## Test Types

**Unit Tests:**
- Not applicable — agents are Claude instances, not code units

**Integration Tests:**
- **Agent communication test:** Handoff messages verified in `agent-runtime/messages/`
- **Artifact handoff test:** Each agent reads previous agent's output
  - fact-checker reads `research-summary.md` from web-researcher
  - script-architect reads `verified-claims.md` from fact-checker
  - pdf-producer reads all final artifacts
- **Dependency tracking test:** Tasks with dependencies complete in correct order
  - visual-director can start independently
  - fact-checker waits for research completion
  - script-architect waits for fact-check approval

**Approval Workflow (Quality Gate):**
```
research-summary.md → fact-check review → approved claims → script integration
```

**End-to-End Verification:**
- PDF generation runs without errors: `python3 generate_pdf.py`
- Final report created at `agent-runtime/outputs/final-report.pdf`
- Video script PDF created at `agent-runtime/outputs/video-script.pdf`
- All artifact files present in expected locations
- Metadata headers correct (date, author, status)

## Common Patterns

**Artifact Validation:**
Check in each downstream agent:
```markdown
**Входные требования:**
- Файл должен существовать: `agent-runtime/shared/[name].md`
- Должен содержать metadata header с датой и автором
- Все источники должны быть URL или явно помечены
- Статусы claims должны быть: approved, revise, или rejected
```

**Dependency Pattern:**
```
Agent A creates artifact X
↓
Agent B reads artifact X
↓
Agent B sends handoff message to Agent C
↓
Agent C reads artifact X (or Agent B's processed version)
```

**Approval Pattern (for claims):**
```python
# Pseudo-pattern in fact-checker
for claim in research_claims:
    if has_high_confidence_source(claim):
        status = "approved"
    elif has_conflicting_sources(claim):
        status = "revise"
    else:
        status = "rejected"
```

**Message Flow Pattern (for communication):**
```markdown
id: msg-NNN
from: [agent finishing work]
to: [agent needing output]
type: assignment  # or approval, blocker, revision
artifacts:
  - [what was just created]
needs:
  - [what you're asking the next agent to do]
deadline: immediate
```

## Known Test Gaps

**Areas Not Explicitly Tested:**
1. **Split pane synchronization** — tmux pane communication assumed to work
2. **File locking race conditions** — no stress test with rapid concurrent claims
3. **Context window overflow** — no test for handling very large artifacts
4. **Network failures in web-researcher** — no mock for search failure scenarios
5. **PDF rendering with non-ASCII** — assumes Arial Unicode font availability
6. **Circular dependencies** — task dependency graphs assumed to be acyclic

**Risk Level:** Medium
- Project purpose is demonstration, not production system
- Manual verification sufficient for demo quality
- Real deployment would require formal test suite

## Quality Assurance Strategy

**For Adding New Agents:**

1. **Define role:** Create `[role].md` in `.claude/agents/`
   - Mission section
   - Obligations section
   - Output contract (what files/messages to create)

2. **Create input template:** If new input needed
   - Add to `brief.template.md` or create `[role]-input.template.md`
   - Include metadata header example

3. **Define handoff:** Create entry in agent communication chain
   - Which artifact does this agent read?
   - What artifact does this agent create?
   - Who receives the handoff message?

4. **Verify artifact chain:**
   - Run workflow manually
   - Check that all expected files appear in `agent-runtime/shared/`
   - Verify handoff messages in `agent-runtime/messages/`
   - Confirm PDF generation succeeds

5. **Manual inspection:**
   - Metadata headers correct
   - Sources/claims tracked appropriately
   - No missing dependencies
   - Status.md updated

---

*Testing analysis: 2026-03-18*

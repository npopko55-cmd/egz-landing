---
phase: 1
slug: landing-page
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — visual/functional verification only (vanilla static page) |
| **Config file** | none |
| **Quick run command** | Open `index.html` in browser or `python3 -m http.server 8000` |
| **Full suite command** | Manual checklist against 5 success criteria from ROADMAP.md |
| **Estimated runtime** | ~60 seconds (manual) |

---

## Sampling Rate

- **After every task commit:** Open page in browser, verify the task's specific requirement
- **After every plan wave:** Full manual pass against all 5 success criteria from ROADMAP.md
- **Before `/gsd:verify-work`:** All 5 success criteria TRUE
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01 | 01 | 1 | LAND-14 | automated | `grep -c "react\|vue\|angular\|webpack\|vite" index.html` (expect 0) | ❌ W0 | ⬜ pending |
| 01-02 | 01 | 1 | LAND-15 | automated | `ls .nojekyll` | ❌ W0 | ⬜ pending |
| 01-03 | 01 | 1 | LAND-01 | manual-visual | Open in Telegram iOS/Android browser | ❌ manual | ⬜ pending |
| 01-04 | 01 | 1 | LAND-02 | manual-visual | Chrome DevTools 375px viewport | ❌ manual | ⬜ pending |
| 01-05 | 01 | 1 | LAND-03 | manual-visual | Visual inspection vs references | ❌ manual | ⬜ pending |
| 01-06 | 01 | 1 | LAND-04 | manual-functional | Scroll page, verify reveal animations | ❌ manual | ⬜ pending |
| 01-07 | 01 | 1 | LAND-06 | manual-functional | Load page, inspect hero DOM elements | ❌ manual | ⬜ pending |
| 01-08 | 01 | 1 | LAND-07 | manual-functional | Load page, count 5 program items | ❌ manual | ⬜ pending |
| 01-09 | 01 | 1 | LAND-08 | manual-functional | Compare pain-point text to CONTEXT.md | ❌ manual | ⬜ pending |
| 01-10 | 01 | 1 | LAND-09 | manual-functional | Verify countdown + 2 CTAs in final block | ❌ manual | ⬜ pending |
| 01-11 | 01 | 1 | LAND-10 | manual-functional | Scroll past hero, verify sticky appears | ❌ manual | ⬜ pending |
| 01-12 | 01 | 1 | LAND-11 | functional | `node -e "const d=new Date('2026-03-24T19:00:00+03:00'); console.log(d.toISOString())"` | ❌ W0 | ⬜ pending |
| 01-13 | 01 | 1 | LAND-12 | manual-functional | Click hero CTA, verify scroll to #final | ❌ manual | ⬜ pending |
| 01-14 | 01 | 1 | LAND-13 | manual-functional | Inspect href for deep link pattern | ❌ manual | ⬜ pending |
| 01-15 | 01 | 1 | LAND-16 | manual-functional | Verify placeholder images visible | ❌ manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework required — vanilla static site
- [ ] Verification checklist executed manually against ROADMAP.md success criteria
- [ ] Countdown timezone sanity check: `node -e "console.log(new Date('2026-03-24T19:00:00+03:00').getTime() - Date.now())"` — should return positive number

*Existing infrastructure covers automated needs (grep, ls, node one-liners).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark premium design | LAND-01 | Visual quality subjective | Open in mobile browser, compare to Vortek VR reference |
| Mobile-first layout | LAND-02 | Requires viewport resize | Chrome DevTools → 375px width, check layout |
| Futuristic glow effects | LAND-03 | CSS visual effects | Visual inspection for glow, gradients, blur |
| Scroll animations | LAND-04 | Requires scroll interaction | Scroll page, verify fade-in reveals |
| Sticky CTA visibility | LAND-10 | Requires scroll interaction | Scroll past hero, verify fixed CTA appears |
| CTA scroll-to-final | LAND-12 | Requires click interaction | Click hero CTA, verify smooth scroll to final block |
| Deep link format | LAND-13 | Pattern check in source | View source, find `t.me/<botname>?start=landing` |
| Placeholder images | LAND-16 | Visual check | Load page, verify placeholder boxes visible |

---

## Validation Sign-Off

- [ ] All tasks have manual verify or automated command
- [ ] Sampling continuity: manual check after each task commit
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

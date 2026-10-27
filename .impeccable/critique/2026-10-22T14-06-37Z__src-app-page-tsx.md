---
target: home page
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/home/nurbot/ws/ai-eng-news/src/app/page.tsx"
target_fingerprint: "sha256:fe4583048dbafcf5a73f0aafd9fdce03ae51fa66af4c221f6fa1b0bc2635b92d"
target_path: /home/nurbot/ws/ai-eng-news/src/app/page.tsx
timestamp: 2026-10-22T14-06-37Z
slug: src-app-page-tsx
---
# Critique: home + topic pages — 25/40 (Acceptable)
Method: dual-agent (A design review, B detector + browser)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | No :visited state; "Updated" changes scope on topic pages |
| 2 | Match system / real world | 3 | Unlabelled "posted here" date reads as publish date |
| 3 | User control and freedom | 3 | Nav only at top of long mobile feed |
| 4 | Consistency and standards | 3 | Hover inverts, focus only outlines; lead padding breaks row alignment |
| 5 | Error prevention | 3 | No cue that a click leaves the site |
| 6 | Recognition rather than recall | 3 | Topic pages have no topic heading |
| 7 | Flexibility and efficiency | 2 | No visited state, no shortcuts |
| 8 | Aesthetic and minimalist | 3 | 150-250px voids in lead/feature cells |
| 9 | Error recovery | 1 | Default unbranded Next 404, no way home |
| 10 | Help and documentation | 2 | Curation and date meaning unexplained |

Specificity: editorial system (prominence spans, fixed cell grammar, 1px grid) is product-specific; skeleton is a generic Swiss news grid; curation invisible.
Detector: src scan 0; URL scan 3 advisory `straggler` on brief summaries; overlay 2 stragglers per viewport on /; contrast all AA (min 4.68 muted on paper).

## Priority issues
- [P1] StoryCell aria-label overrides card text; summary hidden from screen readers (StoryCell.tsx:17). harden
- [P1] Line clamp leaks a 5th line inside stretched 1fr row; stragglers; lead/feature voids from align-self:end. polish/layout
- [P2] No branded not-found; unknown topic returns 200 on first uncached request. harden
- [P2] Topic pages lack identity; single-story topics leave empty grid; ambiguous "posted here" date. clarify/harden
- [P2] Lead title collapses to feature size (36px) at 820px. typeset/polish

## Persona red flags
Alex: read time least visible; no visited state. Sam: aria-label; h1 always wordmark; focus weaker than hover; no skip link. Casey: 37px tabs; 12px meta. AI engineer: curation invisible; date misleading.

## Minor
Masthead description floats; topic tag redundant on topic pages; footer repeats description.

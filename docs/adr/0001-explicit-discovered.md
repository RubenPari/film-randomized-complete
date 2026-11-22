# 0001 — Discovered is explicit; skipped titles are excluded per session only

**Status:** accepted

Previously every generated title was written to Discovered, so a title the user merely skipped could never come back.

**Decision:** Discovered is written only on *Seen* or *Not interested*. Titles shown in the current session are excluded in memory (not persisted).

**Consequences:** Skipped titles may reappear after a reload. Existing Discovered rows keep working. No API or schema change. Anonymous users (no token) get session exclusion only.

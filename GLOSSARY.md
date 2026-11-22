# Glossary

- **Discovered** — per-user list of titles the user is done with. A title enters only through an explicit action: *Seen* or *Not interested*. Generating a title never adds it.
- **Seen** — explicit "Mark as seen" action on a generated title. Records it in Discovered.
- **Not interested** — a dislike feedback. Records the title in Discovered immediately; the reason is optional and sent after.
- **Session exclusion** — titles already shown since page load are not shown again. In memory only; lost on reload (skipped titles may come back).

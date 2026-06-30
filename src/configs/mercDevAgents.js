// DEV-ONLY test agent roster for merc-alpha. Display data only — the shared password lives in
// .env.local (VITE_MERC_DEV_PASSWORD for the app; the seeder reads it from that file). This module is
// consumed only behind `import.meta.env.DEV` (the dev agent switcher) + by the seed script, so it
// never reaches a production bundle. Janet is first → she's the default dev auto-login agent.
export const MERC_DEV_AGENTS = [
  { email: 'janet@merc.test', displayName: 'Janet', phone: '555-0140' },
  { email: 'jenn@merc.test', displayName: 'Jenn', phone: '555-0141' },
  { email: 'eric@merc.test', displayName: 'Eric', phone: '555-0142' },
  { email: 'megan@merc.test', displayName: 'Megan', phone: '555-0143' }
]

// Deterministic headshot-style avatar per agent (pravatar, seeded on the email so it's stable).
export function devAgentPhotoURL(email) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`
}

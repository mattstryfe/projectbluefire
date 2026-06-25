// MOCK landing-page content + ticker behavior for Merc (MER-9). Decorative flare only — there
// is no backend behind any of this. Delete this whole file when real activity data lands.
// Places are real Loudoun County (NOVA) communities around ZIP 20158 (Hamilton, VA), matching
// Pearson Realty's market and the map center in mercDefaults.
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Headline stats shown as cards on the landing hero.
export const MERC_LANDING_STATS = [
  { label: 'Paid out · last 30d', value: '$487,230' },
  { label: 'Showings completed', value: '6,412' },
  { label: 'Avg payout', value: '$73' },
  { label: 'Avg time to claim', value: '4.2m' }
]

// Rotating "LIVE" ticker feed. Each item renders as:
//   "<agent> <action> $<amount> in <neighborhood>"  ·  "<minutesAgo>m ago"
export const MERC_LANDING_FEED = [
  { agent: 'Mara K.', action: 'claimed', amount: 60, neighborhood: 'Hamilton', minutesAgo: 2 },
  { agent: 'Avery N.', action: 'released', amount: 45, neighborhood: 'Purcellville', minutesAgo: 1 },
  { agent: 'Diego R.', action: 'posted', amount: 95, neighborhood: 'Round Hill', minutesAgo: 4 },
  { agent: 'Priya S.', action: 'claimed', amount: 120, neighborhood: 'Leesburg', minutesAgo: 6 },
  { agent: 'Cole T.', action: 'posted', amount: 50, neighborhood: 'Lovettsville', minutesAgo: 3 },
  { agent: 'Bianca M.', action: 'claimed', amount: 75, neighborhood: 'Waterford', minutesAgo: 8 },
  { agent: 'Sam W.', action: 'released', amount: 65, neighborhood: 'Lincoln', minutesAgo: 5 },
  { agent: 'Nadia F.', action: 'posted', amount: 140, neighborhood: 'Middleburg', minutesAgo: 11 },
  { agent: 'Owen B.', action: 'claimed', amount: 55, neighborhood: 'Hillsboro', minutesAgo: 9 },
  { agent: 'Lena V.', action: 'released', amount: 85, neighborhood: 'Bluemont', minutesAgo: 7 }
]

const TICKER_INTERVAL_MS = 3500

// Composable that owns the rotation. MercLiveTicker stays purely presentational and consumes
// `current` (the active item) + `index` (transition key).
export function useMockLandingTicker() {
  const index = ref(0)
  const current = ref(MERC_LANDING_FEED[0])
  let timer = null

  onMounted(() => {
    timer = setInterval(() => {
      index.value = (index.value + 1) % MERC_LANDING_FEED.length
      current.value = MERC_LANDING_FEED[index.value]
    }, TICKER_INTERVAL_MS)
  })

  onBeforeUnmount(() => clearInterval(timer))

  return { current, index }
}

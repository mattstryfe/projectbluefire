// Mock "my clients" list for the Post-a-showing "From my listings" tab (Phase 1 test data).
// There is no real client/listing source yet — that arrives with MER-12 (brokerage seed) and
// MER-13 (agent profile). Each entry pairs a client with the property to show them; selecting a
// row pre-fills the New-showing form (address + client contact). NOVA coords so the resulting
// showing lands at a real point on the map (MER-18) without a geocode round-trip. Intentionally
// long enough to overflow the sheet and exercise scrolling.
export const MERC_MOCK_CLIENTS = [
  {
    id: 'c1',
    address: '2200 Wilson Blvd, Arlington, VA 22201',
    coords: { lat: 38.8899, lng: -77.0908 },
    client: { name: 'Jordan Smith', email: 'jordan.smith@example.com', phone: '703-555-0142' }
  },
  {
    id: 'c2',
    address: '444 W Broad St, Falls Church, VA 22046',
    coords: { lat: 38.8845, lng: -77.1722 },
    client: { name: 'Maria Gonzalez', email: 'maria.gonzalez@example.com', phone: '703-555-0188' }
  },
  {
    id: 'c3',
    address: '128 Church St NW, Vienna, VA 22180',
    coords: { lat: 38.9012, lng: -77.2653 },
    client: { name: 'Derek Tran', email: 'derek.tran@example.com', phone: '571-555-0119' }
  },
  {
    id: 'c4',
    address: '6707 Old Dominion Dr, McLean, VA 22101',
    coords: { lat: 38.9343, lng: -77.1772 },
    client: { name: 'Aisha Bello', email: 'aisha.bello@example.com', phone: '571-555-0173' }
  },
  {
    id: 'c5',
    address: '1400 King St, Alexandria, VA 22314',
    coords: { lat: 38.8068, lng: -77.0561 },
    client: { name: 'Tom Whitfield', email: 'tom.whitfield@example.com', phone: '703-555-0205' }
  },
  {
    id: 'c6',
    address: '11900 Market St, Reston, VA 20190',
    coords: { lat: 38.9586, lng: -77.3570 },
    client: { name: 'Priya Patel', email: 'priya.patel@example.com', phone: '571-555-0231' }
  },
  {
    id: 'c7',
    address: '10455 Armstrong St, Fairfax, VA 22030',
    coords: { lat: 38.8462, lng: -77.3064 },
    client: { name: 'Marcus Lee', email: 'marcus.lee@example.com', phone: '703-555-0264' }
  },
  {
    id: 'c8',
    address: '1961 Chain Bridge Rd, Tysons, VA 22102',
    coords: { lat: 38.9176, lng: -77.2210 },
    client: { name: 'Sofia Russo', email: 'sofia.russo@example.com', phone: '571-555-0298' }
  },
  {
    id: 'c9',
    address: '777 Lynn St, Herndon, VA 20170',
    coords: { lat: 38.9696, lng: -77.3861 },
    client: { name: 'Hassan Ali', email: 'hassan.ali@example.com', phone: '703-555-0312' }
  },
  {
    id: 'c10',
    address: '7000 Columbia Pike, Annandale, VA 22003',
    coords: { lat: 38.8304, lng: -77.1964 },
    client: { name: 'Grace Kim', email: 'grace.kim@example.com', phone: '571-555-0347' }
  },
  {
    id: 'c11',
    address: '8400 Old Keene Mill Rd, Springfield, VA 22152',
    coords: { lat: 38.7790, lng: -77.2160 },
    client: { name: 'Olivia Brooks', email: 'olivia.brooks@example.com', phone: '703-555-0381' }
  },
  {
    id: 'c12',
    address: '2812 Old Lee Hwy, Fairfax, VA 22031',
    coords: { lat: 38.8623, lng: -77.2680 },
    client: { name: 'Nathan Cole', email: 'nathan.cole@example.com', phone: '571-555-0414' }
  },
  {
    id: 'c13',
    address: '1500 Cornerside Blvd, Tysons, VA 22182',
    coords: { lat: 38.9230, lng: -77.2360 },
    client: { name: 'Yuki Tanaka', email: 'yuki.tanaka@example.com', phone: '703-555-0447' }
  },
  {
    id: 'c14',
    address: '6845 Elm St, McLean, VA 22101',
    coords: { lat: 38.9270, lng: -77.1780 },
    client: { name: 'Omar Haddad', email: 'omar.haddad@example.com', phone: '571-555-0473' }
  },
  {
    id: 'c15',
    address: '205 Maple Ave E, Vienna, VA 22180',
    coords: { lat: 38.9010, lng: -77.2620 },
    client: { name: 'Bianca Ferraro', email: 'bianca.ferraro@example.com', phone: '703-555-0508' }
  }
]

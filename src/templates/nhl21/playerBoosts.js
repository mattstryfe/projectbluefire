export const playerBoosts = [
  {
    name: 'target slapper 1',
    type: 'offense',
    icon: 'fa-bullseye',
    adjustments: {
      sla: 4, slp: 2, pas: -4
    }
  },
  {
    name: 'target slapper 2',
    type: 'offense',
    icon: 'fa-bullseye',
    adjustments: {
      sla: 4, slp: 2, dfa: -4
    }
  },
  {
    name: 'dirty dangles 1',
    type: 'offense',
    icon: 'fa-poop',
    adjustments: {
      dek: 5, pcl: 2, wsp: -4, sch: -3
    }
  },

  {
    name: 'dirty dangles 2',
    type: 'offense',
    icon: 'fa-poop',
    adjustments: {
      dek: 5, pcl: 2, spd: -2, bal: -2
    }
  },

  {
    name: 'sharp shooter 1',
    type: 'offense',
    icon: 'fa-crosshairs',
    adjustments: {
      wsa: 4, wsp: 2, bal: -2, spd: -2
    }
  },

  {
    name: 'sharp shooter 2',
    type: 'offense',
    icon: 'fa-crosshairs',
    adjustments: {
      wsa: 4, wsp: 2, agi: -2, acc: -2
    }
  },

  {
    name: 'heavy wrister 1',
    type: 'offense',
    icon: 'fa-hand-rock',
    adjustments: {
      wsa: 2, wsp: 4, spd: -2, bal: -2
    }
  },

  {
    name: 'heavy wrister 2',
    type: 'offense',
    icon: 'fa-hand-rock',
    adjustments: {
      wsa: 2, wsp: 4, end: -4, acc: -2
    }
  },

  {
    name: 'heavy slapper 1',
    type: 'offense',
    icon: 'fa-bahai',
    adjustments: {
      sla: 2, slp: 4, pcl: -4
    }
  },

  {
    name: 'heavy slapper 2',
    type: 'offense',
    icon: 'fa-bahai',
    adjustments: {
      sla: 2, slp: 4, sch: -4
    }
  },

  {
    name: 'puck handler 1',
    type: 'offense',
    icon: 'fa-hands',
    adjustments: {
      bal: 2, pcl: 4, wsa: -4, sch: -4
    }
  },

  {
    name: 'puck handler 2',
    type: 'offense',
    icon: 'fa-hands',
    adjustments: {
      bal: 2, pcl: 4, end: -4, acc: -2
    }
  },

  {
    name: 'precise passing 1',
    type: 'offense',
    icon: 'fa-ring',
    adjustments: {
      pas: 5, ofa: 3, wsa: -5, dfa: -3
    }
  },

  {
    name: 'precise passing 2',
    type: 'offense',
    icon: 'fa-ring',
    adjustments: {
      pas: 5, ofa: 3, wsp: -5, bal: -2
    }
  },


// ------------------- //
  // DEFENSE
// ------------------- //
  {
    name: 'bouncer 1',
    type: 'defense',
    icon: 'fa-user-secret',
    adjustments: {
      fgt: 5, chk: 3, acc: 1, bal: -3, sch: -3
    }
  },

  {
    name: 'bouncer 2',
    type: 'defense',
    icon: 'fa-user-secret',
    adjustments: {
      fgt: 5, chk: 3, acc: 1, pcl: -3, agi: -3
    }
  },

  {
    name: 'defensive minded 1',
    type: 'defense',
    icon: 'fa-hard-hat',
    adjustments: {
      dfa: 3, sch: 2, dsc: 2, wsa: -4, ofa: -3
    }
  },

  {
    name: 'defensive minded 2',
    type: 'defense',
    icon: 'fa-hard-hat',
    adjustments: {
      dfa: 3, sch: 2, dsc: 2, pas: -4, ofa: -3
    }
  },

  {
    name: 'crusher 1',
    type: 'defense',
    icon: 'fa-gavel',
    adjustments: {
      chk: 4, bal: 3, wsa: -4, sla: -3
    }
  },

  {
    name: 'crusher 2',
    type: 'defense',
    icon: 'fa-gavel',
    adjustments: {
      chk: 4, bal: 3, pcl: -4, pas: -3
    }
  },

  {
    name: 'stick\'em up 1',
    type: 'defense',
    icon: 'fa-sign-language fa-rotate-90',
    adjustments: {
      sch: 4, dfa: 3, pas: -4, chk: -3
    }
  },

  {
    name: 'stick\'em up 2',
    type: 'defense',
    icon: 'fa-sign-language fa-rotate-90',
    adjustments: {
      sch: 4, dfa: 3, dek: -3, wsa: -2, sla: -2
    }
  },

  {
    name: 'interceptor 1',
    type: 'defense',
    icon: 'fa-hand-paper',
    adjustments: {
      dfa: 4, agi: 2, bal: -4, pcl: -2
    }
  },

  {
    name: 'interceptor 2',
    type: 'defense',
    icon: 'fa-hand-paper',
    adjustments: {
      dfa: 4, agi: 2, wsp: -4, pcl: -2
    }
  },

  {
    name: 'blockade 1',
    type: 'defense',
    icon: 'fa-shield-alt',
    adjustments: {
      sbk: 6, dur: 4, dfa: -3, str: -5
    }
  },

  {
    name: 'blockade 2',
    type: 'defense',
    icon: 'fa-shield-alt',
    adjustments: {
      sbk: 6, dur: 4, dfa: -3, bal: -5, ofa: 3
    }
  },

  {
    name: 'hockey sense 1',
    type: 'defense',
    icon: 'fa-brain',
    adjustments: {
      ofa: 4, dfa: 4, agi: -3
    }
  },

  {
    name: 'hockey sense 2',
    type: 'defense',
    icon: 'fa-brain',
    adjustments: {
      ofa: 4, dfa: 4, end: -2, str: -2
    }
  },

// ------------------- //
  // ATHLETICISM
// ------------------- //

  {
    name: 'core balance 1',
    type: 'athleticism',
    icon: 'fa-balance-scale-right',
    adjustments: {
      bal: 5, agi: -2, acc: -1
    }
  },

  {
    name: 'core balance 2',
    type: 'athleticism',
    icon: 'fa-balance-scale-right',
    adjustments: {
      bal: 5, dur: -4, chk: -3
    }
  },

  {
    name: 'cardio master 1',
    type: 'athleticism',
    icon: 'fa-heartbeat',
    adjustments: {
      end: 5, dur: 3, str: -4, pcl: -3
    }
  },

  {
    name: 'cardio master 2',
    type: 'athleticism',
    icon: 'fa-heartbeat',
    adjustments: {
      end: 5, dur: 3, dek: -4, bal: -3
    }
  },

  {
    name: 'strongman 1',
    type: 'athleticism',
    icon: 'fa-dumbbell',
    adjustments: {
      str: 4, dur: 4, dek: -4, dsc: -4
    }
  },

  {
    name: 'strongman 2',
    type: 'athleticism',
    icon: 'fa-dumbbell',
    adjustments: {
      str: 4, dsc: 4, hnd: -4, dfa: -4
    }
  },

  {
    name: 'quickstart 1',
    type: 'athleticism',
    icon: 'fa-running',
    adjustments: {
      acc: 3, agi: 2, spd: -3, end: -3
    }
  },

  {
    name: 'quickstart 2',
    type: 'athleticism',
    icon: 'fa-running',
    adjustments: {
      acc: 3, agi: 2, spd: -3, bal: -3
    }
  },

  {
    name: ' power turns 1',
    type: 'athleticism',
    icon: 'fa-directions',
    adjustments: {
      agi: 4, pcl: 3, bal: -4, spd: -2
    }
  },

  {
    name: ' power turns 2',
    type: 'athleticism',
    icon: 'fa-directions',
    adjustments: {
      agi: 4, pcl: 3, end: -5, spd: -2
    }
  },















]













































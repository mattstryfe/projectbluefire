// export const dangler = [
//   { title: 'dangler' },
//   { name: 'offense',     wsa: '45', wsp: '', sla: '', slp: '', hnd: '', pas: '', pcl: '', dek: '', ofa: ''},
//   { name: 'defense',     fac: '', bch: '', sch: '', sbk: '', dfa: '', dsc: ''},
//   { name: 'athleticism', spd: '', acc: '', agi: '', end: '', bal: '', str: '', dur: '', fgt: ''}
// ]
//
// export const sniper = [
//   { title: 'sniper' },
//   { name: 'offense',     wsa: '55', wsp: '', sla: '', slp: '', hnd: '', pas: '', pcl: '', dek: '', ofa: ''},
//   { name: 'defense',     fac: '', bch: '', sch: '', sbk: '', dfa: '', dsc: ''},
//   { name: 'athleticism', spd: '', acc: '', agi: '', end: '', bal: '', str: '', dur: '', fgt: ''}
// ]
export class Player {
  constructor(off, def) {
    this._offense = off
    this._deffense = def
  }

  buildStats(category) {
    category.forEach((stat, key) => {
      console.log('stat', stat, key)
    })
  }

  logAThing(off, def) {
    console.log('off', off, 'and def is... ', def)
  }
  applBoost(boostChoosen) {
    this._offense
  }
}

export const playerBoosts = [
  {
    name: 'target_slapper_1',
    type: 'offense',
    adjustments: {
      sla: 4, slp: 2, pas: -4
    }
  },
  {
    name: 'target_slapper_2',
    type: 'offense',
    adjustments: {
      sla: 4, slp: 2, dfa: -4
    }
  },
  {
    name: 'dirty_dangles_1',
    type: 'offense',
    adjustments: {
      dek: 5, pcl: 2, wsp: -4, sch: -3
    }
  },

  {
    name: 'the_bouncer_1',
    type: 'defense',
    adjustments: {
      fgt: 5, chk: 3, acc: 1, bal: -3, sch: -3
    }
  }

]

// JSON key
export const traitKey = {
  wsa: 'wrist shot accuracy',
  wsp: 'wrist shot power',
  sla: 'slap shot accuracy' ,
  slp: 'slap shot power',
  hnd: 'hand eye',
  pas: 'passing',
  pcl: 'puck control',
  dek: 'deking',
  ofa: 'offensive awareness',

  fac: 'faceoffs',
  bch: 'body checking',
  sch: 'stick checking',
  sbk: 'shot blocking',
  dfa: 'defensive awareness',
  dsc: 'discipline',

  spd: 'speed',
  acc: 'acceleration',
  agi: 'agility',
  end: 'endurance',
  bal: 'balance',
  str: 'strength',
  dur: 'durability',
  fgt: 'fighting skill'
}

// JSON template
export const playerTypes = {
  sniper: {
    offense: {
      wsa: '99',
      wsp: '85',
      sla: '82',
      slp: '78',
      hnd: '88',
      pas: '80',
      pcl: '80',
      dek: '75',
      ofa: '83'
    },
    defense: {
      fac: '90',
      bch: '75',
      sch: '85',
      sbk: '70',
      dfa: '82',
      dsc: '84'
    },
    athleticism: {
      spd: '85',
      acc: '85',
      agi: '86',
      end: '88',
      bal: '83',
      str: '74',
      dur: '69',
      fgt: '69'
    }
  },
  playmaker: {
    offense: {
      wsa: '80',
      wsp: '75',
      sla: '',
      slp: '',
      hnd: '',
      pas: '',
      pcl: '',
      dek: '',
      ofa: ''
    },
    defense: {
      fac: '',
      bch: '',
      sch: '',
      sbk: '',
      dfa: '',
      dsc: ''
    },
    athleticism: {
      spd: '',
      acc: '',
      agi: '',
      end: '',
      bal: '',
      str: '',
      dur: '',
      fgt: ''
    }
  }
};

// template
/*

{ cat: 'offense', wsa: '', wsp: '', sla: '', slp: '', hnd: '',  pas: '', pcl: '', dek: '', ofa: ''},
{ cat: 'defense', fac: '', bch: '', sch: '', sbk: '', dfa: '', dsc: ''},
{ cat: 'athleticism', spd: '', acc: '', agi: '',  end: '', bal: '', str: '', dur: '', fgt: ''}

 */

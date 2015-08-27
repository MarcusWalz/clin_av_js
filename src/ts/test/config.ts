require.config({
  paths: {
    mocha: '../../lib/mocha',
    chai: '../../lib/chai',
    angular:   '../../lib/angular',
    d3:        '../../lib/d3',
    papaparse: '../../lib/papaparse'
  },
  shim: {
    angular: { exports: 'angular' },
    mocha: { init: () => { 
      this.mocha.setup('bdd');
      return this.mocha; }
    }
  }
});

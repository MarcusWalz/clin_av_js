require.config({
  paths: {
    mocha: '/lib/mocha',
    chai: '/lib/chai'
  },
  shim: {
    mocha: { init: () => { 
      this.mocha.setup('bdd');
      return this.mocha; }
    }
  }
});

require.config({
  paths: {
    mocha: '/out/lib/mocha',
    chai: '/out/lib/chai'
  },
  shim: {
    mocha: { init: () => { 
      this.mocha.setup('bdd');
      return this.mocha; }
    }
  }
});

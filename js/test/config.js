var _this = this;
require.config({
    paths: {
        mocha: '/lib/mocha',
        chai: '/lib/chai'
    },
    shim: {
        mocha: { init: function () {
                _this.mocha.setup('bdd');
                return _this.mocha;
            }
        }
    }
});

//# sourceMappingURL=../test/config.js.map
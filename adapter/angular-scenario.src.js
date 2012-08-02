/**
 *
 * @param {Object} tc Testacular!!
 * @param {Function} scenarioSetupAndRun angular.scenario.setUpAndRun
 * @param {Object=} config Config with the following allowed properties
 *   - relativeUrlPrefix: prefix for all relative links when navigateTo()
 * @return {Function}
 */
var createNgScenarioStartFn = function(tc, scenarioSetupAndRun, config) {
  /**
   * HACK (angular.scenario.Application.navigateTo)
   *
   * We need to navigate to relative urls when running from browser (without Testacular),
   * because we want to allow running scenario tests without creating its own virtual host.
   * For example: http://angular.local/build/docs/docs-scenario.html
   *
   * On the other hand, when running with Testacular, we need to navigate to absolute urls,
   * because of Testacular proxy. (proxy, because of same domain policy)
   */
  var appProto = angular.scenario.Application.prototype,
      navigateTo = appProto.navigateTo,
      relativeUrlPrefix = config && config.relativeUrlPrefix || '';

  appProto.navigateTo = function(url, loadFn, errorFn) {
    if (url.charAt(0) != '/' && url.charAt(0) != '#' &&
        url != 'about:blank' && !url.match(/^https?/)) {
      url = relativeUrlPrefix + url;
    }
    return navigateTo.call(this, url, loadFn, errorFn);
  };

  /**
   * Generates Testacular Output
   */
  angular.scenario.output('testacular', function(context, runner, model) {
    registerResultListeners(model, tc);
  });

  return function(config) {
    scenarioSetupAndRun();
  };
};

var registerResultListeners = function(model, tc) {
  var totalTests = 0;
  model.on('SpecBegin', function(spec) {
    totalTests++;
    tc.info({total: totalTests});
  });

  model.on('SpecEnd', function(spec) {
    var result = {
      id: spec.id,
      description: spec.fullDefinitionName,
      suite: [],
      success: spec.status === 'success',
      skipped: false,
      time: spec.duration
    };
    if (spec.error) {
      var errorMsg = spec.line ? spec.line + ': ' + spec.error : spec.error;
      result.log = [errorMsg];
    }
    tc.result(result);
  });

  model.on('RunnerEnd', function() {
    tc.complete();
  });
};

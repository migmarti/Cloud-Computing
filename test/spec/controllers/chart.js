'use strict';

describe('Controller: ChartCtrl', function () {

  // load the controller's module
  beforeEach(module('migsApp'));

  var ChartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChartCtrl = $controller('ChartCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChartCtrl.awesomeThings.length).toBe(3);
  });
});

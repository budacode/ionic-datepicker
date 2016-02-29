(function() {

  'use strict';
  angular.module('ionic-datepicker', [ 'ionic', 'ionic-datepicker.templates' ]);
})();

(function() {

  'use strict';

  angular
  .module('ionic-datepicker')
  .controller('DatepickerCtrl', [ '$scope', 'DatepickerService', function ($scope, DatepickerService) {

    var type  = 'date'
      , today = new Date();

    // Delegates
    this.getDaysOfWeek = DatepickerService.getDaysOfWeek;
    this.getMonths = DatepickerService.getMonths;
    this.getYears = DatepickerService.getYears;

    this.initialize = function() {

      this.selectedDate = angular.copy($scope.date || new Date());
      this.tempDate = angular.copy(this.selectedDate);

      this.createDateList(this.selectedDate);
    };

    this.getDate = function(row, col) {
      return this.dateList[row * 7 + col];
    };

    this.isDefined = function(date) {
      return date !== undefined;
    };

    this.isDisabled = function(date) {
      if (!date) return true;
      if ($scope.min) {
        $scope.min.setHours(0, 0, 0, 0);
        if (date < $scope.min) return true;
      }
      if ($scope.max) {
        $scope.max.setHours(0, 0, 0, 0);
        if (date > $scope.max) return true;
      }
      return false;
    };

    this.isActualDate = function(date) {
      if (!date) return false;
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    };

    this.isActualMonth = function(month) {
      return month === today.getMonth();
    };

    this.isActualYear = function(year) {
      return year === today.getFullYear();
    };

    this.isSelectedDate = function(date) {
      if (!date) return false;
      return date.getDate() === this.selectedDate.getDate() &&
        date.getMonth() === this.selectedDate.getMonth() &&
        date.getFullYear() === this.selectedDate.getFullYear();
    };

    this.isSelectedMonth = function(month) {
      return month === this.tempDate.getMonth();
    };

    this.isSelectedYear = function(year) {
      return year === this.tempDate.getFullYear();
    };

    this.changeType = function(val) {
      type = val;
    };

    this.showType = function(val) {
      return type === val;
    };

    this.selectDate = function (date) {
      if (this.isDisabled(date)) return;
      this.selectedDate = date;
      this.selectedDate.setHours(0, 0, 0, 0);
      this.tempDate = angular.copy(this.selectedDate);
    };

    this.selectMonth = function(month) {
      this.tempDate = angular.copy(this.tempDate);
      this.tempDate.setMonth(month);
      if (this.tempDate.getMonth() !== month) {
        this.tempDate.setDate(0);
      }
      this._selectMonthOrYear();
    };

    this.selectYear = function(year) {
      this.tempDate = angular.copy(this.tempDate);
      this.tempDate.setFullYear(year);
      this._selectMonthOrYear();
    };

    this._selectMonthOrYear = function() {
      this.changeType('date');
      this.createDateList(this.tempDate);
      if (this.isDisabled(this.tempDate)) return;
      this.selectedDate = this.tempDate;
    };

    this.createDateList = function(selectedDate) {
      this.dateList = DatepickerService.createDateList(selectedDate);
      this.cols = new Array(7);
      this.rows = new Array(parseInt(this.dateList.length / this.cols.length) + 1);
    };

    this.onCancel = function(e) {
      this.selectedDate = angular.copy($scope.date || new Date());
      $scope.callback(undefined);
    };

    this.onDone = function(e) {
      $scope.date = angular.copy(this.selectedDate);
      $scope.callback($scope.date);
    };

  }]);
})();

(function() {

  'use strict';

  angular
  .module('ionic-datepicker')
  .directive('ionicDatepicker', [ '$ionicModal', function ($ionicModal) {

    return {
      restrict: 'E',
      replace: true,
      controller: 'DatepickerCtrl',
      controllerAs: 'datepickerCtrl',
      scope: {
        date: '=',
        min: '=',
        max: '=',
        callback: '='
      },
      link: function (scope, element, attrs, controller) {

        var scroll = function(el) {
          var $$container = $(el)
            , $$element   = $(el + ' .datepicker-selected')
            , offset      = $$element.offset().top + $$container.scrollTop() - $$container.offset().top - ($$container.height() / 2);
          if (offset === 0) return;
          $$container.animate({ scrollTop: offset });
        };

        scope.show = function(modal) {

          scope.modal = modal;
          controller.initialize();
          scope.modal.show();

          $('.datepicker-month-js').on('click', function() { scroll('.datepicker-month-content-js'); });
          $('.datepicker-year-js').on('click', function() { scroll('.datepicker-year-content-js'); });
          $('.datepicker-cancel-js').on('click', scope.onCancel);
          $('.datepicker-ok-js').on('click', scope.onDone);
        };

        scope.onCancel = function() {
          controller.onCancel();
          scope.modal.remove();
        };

        scope.onDone = function() {
          controller.onDone();
          scope.modal.remove();
        };

        scope.onDirectiveClick = function() {

          $ionicModal
          .fromTemplateUrl('template.html', { scope: scope, hideDelay: 1 })
          .then(scope.show);
        };

        element.on('click', scope.onDirectiveClick);
      }
    };
  }]);
})();

(function() {

  'use strict';

  angular.module('ionic-datepicker')
  .service('DatepickerService', function () {

    var locale = window.navigator.userLanguage || window.navigator.language;

    this.getDaysOfWeek = function() {
      var today     = new Date()
        , days      = []
        , firstDay  = today.getDate() - today.getDay()
        , lastDay   = firstDay + 6;
      for (var i = firstDay; i <= lastDay; i++) {
        today.setDate(i);
        days.push(today.toLocaleString(locale, { weekday: 'long' }));
      }
      return days;
    };

    this.getMonths = function() {
      var today   = new Date()
        , months  = [];
      for (var i = 0; i < 12; i++) {
        today.setDate(1);
        today.setMonth(i);
        months.push(today.toLocaleString(locale, { month: 'long' }));
      }
      return months;
    };

    this.getYears = function() {
      var years = [];
      for (var i = 1900; i < 2101; i++) years.push(i);
      return years;
    };

    this.createDateList = function(currentDate) {

      var firstDay  = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDate()
        , lastDay   = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        , dateList  = [];

      for (var i = firstDay; i <= lastDay; i++) {
        dateList.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
      }

      firstDay = dateList[0].getDay();
      for (var j = 0; j < firstDay; j++) {
        dateList.unshift(undefined);
      }
      return dateList;
    };
  });
})();

(function(module) {
try {
  module = angular.module('ionic-datepicker.templates');
} catch (e) {
  module = angular.module('ionic-datepicker.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template.html',
    '<div class=datepicker-modal-container><div class=datepicker-modal><div class="datepicker-modal-head datepicker-balanced white bold"><div class=datepicker-modal-title>{{datepickerCtrl.selectedDate | date: \'EEEE\'}}</div></div><div class="center datepicker-balanced-light"><div class=row><div class="col datepicker-month-js datepicker-month" ng-click="datepickerCtrl.changeType(\'month\')">{{datepickerCtrl.selectedDate | date: \'MMM\' | uppercase}}</div></div><div class=row><div class="col datepicker-day-of-month" ng-click="datepickerCtrl.changeType(\'date\')">{{datepickerCtrl.selectedDate | date: \'d\'}}</div></div><div class=row><div class="col datepicker-year-js datepicker-year" ng-click="datepickerCtrl.changeType(\'year\')">{{datepickerCtrl.selectedDate | date: \'yyyy\'}}</div></div></div><div class="datepicker-month-content-js datepicker-content" ng-show="datepickerCtrl.showType(\'month\')"><div class="row center" ng-repeat="month in datepickerCtrl.getMonths() track by $index"><div class=col ng-class="{ \'datepicker-selected\': datepickerCtrl.isSelectedMonth($index), \'datepicker-current\': datepickerCtrl.isActualMonth($index) }" ng-click=datepickerCtrl.selectMonth($index)>{{month | limitTo: 3}}</div></div></div><div class="datepicker-content visible-overflow" ng-show="datepickerCtrl.showType(\'date\')"><div class="row col center">{{datepickerCtrl.tempDate | date: \'MMMM yyyy\'}}</div><div class="row center"><div class="col bold" ng-repeat="dayOfWeek in datepickerCtrl.getDaysOfWeek() track by $index">{{dayOfWeek | limitTo: 1 | uppercase}}</div></div><div class="row center" ng-repeat="row in datepickerCtrl.rows track by $index"><div class="col no-padding" ng-repeat="col in datepickerCtrl.cols track by $index" ng-class="{ \'datepicker-date-col\': datepickerCtrl.isDefined(datepickerCtrl.getDate($parent.$index, $index)), \'datepicker-selected\': datepickerCtrl.isSelectedDate(datepickerCtrl.getDate($parent.$index, $index)), \'datepicker-current\' : datepickerCtrl.isActualDate(datepickerCtrl.getDate($parent.$index, $index)), \'datepicker-disabled\': datepickerCtrl.isDisabled(datepickerCtrl.getDate($parent.$index, $index)) }"><div class=datepicker-date-cell ng-click="datepickerCtrl.selectDate(datepickerCtrl.getDate($parent.$index, $index))">{{ datepickerCtrl.getDate($parent.$index, $index) | date: \'d\' }}</div></div></div></div><div class="datepicker-year-content-js datepicker-content" ng-show="datepickerCtrl.showType(\'year\')"><div class="row center" ng-repeat="year in datepickerCtrl.getYears() track by $index"><div class=col ng-class="{ \'datepicker-selected\': datepickerCtrl.isSelectedYear(year), \'datepicker-current\': datepickerCtrl.isActualYear(year) }" ng-click=datepickerCtrl.selectYear(year)>{{year}}</div></div></div><div class=datepicker-modal-buttons><button class="datepicker-cancel-js button button-clear button-small col-offset-33">CANCEL</button> <button class="datepicker-ok-js button button-clear button-small datepicker-color-balanced-light">OK</button></div></div></div>');
}]);
})();

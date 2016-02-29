(function() {

  'use strict';

  angular.module('ionic-datepicker')
  .service('DatepickerService', function () {

    var locale = window.navigator.userLanguage || window.navigator.language;
    locale = 'de';

    var self = this;

    this.toLocaleString = function (date, format) {
      return moment(date).format(format);
    };

    this.getDaysOfWeek = function() {
      var today     = new Date()
        , days      = []
        , firstDay  = today.getDate() - today.getDay()
        , lastDay   = firstDay + 6;
      for (var i = firstDay; i <= lastDay; i++) {
        today.setDate(i);
        days.push(self.toLocaleString(today, 'dd'));
        // days.push(today.toLocaleString(locale, { weekday: 'long' }));
      }
      return days;
    };

    this.getMonths = function() {
      var today   = new Date()
        , months  = [];
      for (var i = 0; i < 12; i++) {
        today.setDate(1);
        today.setMonth(i);
        months.push(self.toLocaleString(today, 'MMMM'));
        // months.push(today.toLocaleString(locale, { month: 'long' }));
      }
      return months;
    };

    this.getYears = function(min, max) {
      min = min ? min.getFullYear() : 1900;
      max = max ? max.getFullYear() : 2100;

      var years = [];
      for (var i = max; i >= min ; i--) {
        years.push(i);
      }
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

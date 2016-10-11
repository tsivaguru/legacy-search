'use strict';

// Register `init` component, along with its associated controller and template
angular.
  module('init').
  component('init', {
    templateUrl: 'init/init.template.html',
    controller: ['$http', '$interval', 'config', function InitController($http, $interval, config) {
      var self = this;
      self.persons = "";
      self.status = "active";
      self.progress = {
        took: 0,
        rate: 0,
        current: 0
      };
      self.remaining = 0;
      self.goal = 0;
      self.result = null;

      var stop;
      self.startWatch = function() {
        if ( angular.isDefined(stop) ) return;

        stop = $interval(function() {
          // Poll the status API
          $http({method: 'GET', url: config.backend + '/api/1/person/_init_status' })
              .success(function(data) {
                self.progress = data;
                // Remaining docs
                var remaining_docs = self.persons - data.current;
                self.remaining = Math.round(remaining_docs / data.rate);
              });
        }, 100);
      };

      self.stopWatch = function() {
        if (angular.isDefined(stop)) {
          $interval.cancel(stop);
          stop = undefined;
        }
      };

      self.init = function() {
        self.status = "active";
        self.result = null;
        self.progress = {
          took: 0,
          rate: 0,
          current: 0
        };
        self.remaining = 0;
        self.goal = self.persons;
        self.startWatch();
        $http({method: 'GET', url: config.backend + '/api/1/person/_init?size='+self.persons })
            .success(function(data) {
              self.progress = data;
              self.status = "progress-bar-success";
              self.stopWatch();
              self.result = data;
        });
      }
    }]
  });
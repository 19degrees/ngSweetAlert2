/**
@fileOverview

@toc

*/

'use strict';

angular.module('19degrees.ngSweetAlert2', [])
.factory('sweetAlert', [ '$timeout', '$window' ,'$q', function ( $timeout, $window, $q ) {

	var swal = $window.swal;

	var self = function ( arg1, arg2, arg3 ) {
		$timeout(function() {
			if( typeof(arg2) === 'function' ) {
				swal(arg1, function(isConfirm) {
					$timeout( function() {
						arg2(isConfirm);
					});
				}, arg3 );
			} else {
				swal( arg1, arg2, arg3 );
			}
		});
	};

	//public methods
	var props = {
		swal: swal,
		adv: function( object ) {
			$timeout(function() {
				swal( object );
			});
		},
		timed: function( title, message, type, time ) {
			$timeout(function() {
				swal( {
					title: title,
					text: message,
					type: type,
					timer: time
				} );
			});
		},
		success: function(title, message) {
			$timeout(function(){
				swal( title, message, 'success' );
			});
		},
		error: function(title, message) {
			$timeout(function(){
				swal( title, message, 'error' );
			});
		},
		warning: function(title, message) {
			$timeout(function(){
				swal( title, message, 'warning' );
			});
		},
		info: function(title, message) {
			$timeout(function(){
				swal( title, message, 'info' );
			});
		},
		/**
     * Display a SweetAlert with the ajax loader and wait until both "promise" and
     * timeout (with "time" to wait) are done before resolving/rejecting the promise even if
     * the promise fails.
		 * Like that you could display a waiting SweetAlert until your ajax is done and the alert
		 * will stay at least "time" ms opened even if the ajax already responded 
     *
     * @param title
     * @param message
     * @param promise
     * @param time
     * @returns promise
     */
		ajax: function (title, message, promise, time) {
      return $timeout(function () {
        swal({
          title: title,
          text: message,
          type: 'info'
        });
      }).then(function () {
        swal.disableButtons();

        var deferred = $q.defer();
        var callBackValue = null;

        var nbCallback = 0;
        var success = true;

        $timeout(function () {
          nbCallback++;
          if (nbCallback == 2) {
            if (success) {
              deferred.resolve(callBackValue);
            }
            else {
              deferred.reject(callBackValue);
            }
          }
        }, time ? time : 500);

        promise.then(function (response) {
          callBackValue = response;
          nbCallback++;
          if (nbCallback == 2) {
            deferred.resolve(callBackValue);
          }
        }, function (response) {
          success = false;
          callBackValue = response;
          nbCallback++;
          if (nbCallback == 2) {
            deferred.reject(callBackValue);
          }
        });

        return deferred.promise;
      });
    }
	};

	angular.extend(self, props);

	return self;
}]);

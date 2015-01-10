/**
 * Created by kojunghyun on 14. 12. 18..
 */
'use strict';

angular.module('seoulDustApp', ['ngRoute','ui.bootstrap','dashBoardMain','dustDataTable','dustChart','globalDataService'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/dustDataTable', {
                templateUrl: 'dustDataTable/dustDataTable.html',
                controller: 'dustDataTableCtrl'
            }).
            when('/dustChart', {
                templateUrl: 'dustChart/dustChart.html',
                controller: 'dustChartCtrl'
            }).
            otherwise({
                redirectTo: '/dustDataTable'
            });
    }]);

//-----------------------------------------------------------------------------
angular.module('dashBoardMain', [])

    .controller('dashBoardMainCtrl', ['$rootScope','$location','$scope','$http','$filter','globalData','serverDataService',
        function($rootScope,$location,$scope,$http,$filter,globalData,serverDataService) {

            var datefilter = $filter('date');

            /////////////////////////////////////////////
            // select area
            /////////////////////////////////////////////
            $scope.areaObjForMultiSelect = [ {area:'서울시평균', selected:false} , {area:'구로구', selected:false},
                {area:'금천구', selected:false}, {area:'종로구', selected:false}, {area:'중구', selected:false},
                {area:'용산구', selected:false}, {area:'성동구', selected:false}, {area:'광진구', selected:false},
                {area:'동대문구', selected:false}, {area:'중랑구', selected:false}, {area:'성북구', selected:false},
                {area:'강북구', selected:false}, {area:'도봉구', selected:false}, {area:'노원구', selected:false},
                {area:'은평구', selected:false}, {area:'서대문구', selected:false}, {area:'마포구', selected:false},
                {area:'양천구', selected:false}, {area:'강서구', selected:false}, {area:'영등포구', selected:false},
                {area:'동작구', selected:false}, {area:'관악구', selected:false}, {area:'서초구', selected:false},
                {area:'강남구', selected:false}, {area:'송파구', selected:false}, {area:'강동구', selected:false}
            ];

            $scope.areaObjForMultiSelect[0].selected = true;
            $scope.multiSelectedAreas = [];
            $scope.multiSelectedAreas.push($scope.areaObjForMultiSelect[0]); //default

            $scope.selected_area =$scope.areaObjForMultiSelect[0].area;
            $scope.minDate = null;
            $scope.openedTo = false;
            $scope.openedFrom = false;
            $scope.view_format='format_table';
            $location.path( '/dustDataTable' );

            $scope.totalDataCount = 0;

            //------------------------------------------
            $scope.checkBoxChanged = function (areaObj) {
                //console.log("areaObj.area-->"+ areaObj.area+" : "+ areaObj.selected); //debug

                if(areaObj.selected) {
                    if($scope.multiSelectedAreas.length ==globalData.maxAreaCnt){
                        //console.log("max area limit!!"); //debug
                        alert("최대 "+globalData.maxAreaCnt+"개 까지만 선택 가능");
                        areaObj.selected = false;
                        //no more!
                    }else{
                        $scope.multiSelectedAreas.push(areaObj);
                    }

                }else{
                    var index = $scope.multiSelectedAreas.indexOf(areaObj);
                    if (index > -1) {
                        $scope.multiSelectedAreas.splice(index, 1);
                    }
                }
            };

            //------------------------------------------
            $scope.selectArea = function(area) {
                $scope.selected_area = area; //화면 갱신 ,선택지역을 표시
                //console.log("area-->", area);
            };

            //------------------------------------------
            $scope.showData = function() {

                var formattedDateFrom = datefilter($scope.dtFrom, 'yyyyMMdd')+'00';
                var formattedDateTo = datefilter($scope.dtTo, 'yyyyMMdd')+'23';
                var queryInfoObj = { selectedAreas:$scope.multiSelectedAreas,
                    dateFrom:formattedDateFrom,
                    dateTo:  formattedDateTo
                };

                //get server data using service
                var promise = serverDataService.getDataFromServer(queryInfoObj);
                promise.then(
                    function(payload) {
                        angular.copy(payload.data, globalData.dustDataArry) ; //DEEP COPY !!!
                        $scope.totalDataCount = globalData.dustDataArry.length;
                        console.log('server get OK : length==>',globalData.dustDataArry.length); //debug

                        globalData.buildChartData(); //for chart data

                        //table view 컨트롤러에게 알려야한다. 페이지 컨트롤을 하면서 전체 데이터중 일부만을 화면에 바인딩 한 상태이므로..
                        $rootScope.$broadcast('new-data-arrived');
                    },
                    function(errorPayload) {
                        $log.error('failure loading data', errorPayload);
                    });
                };

            /////////////////////////////////////////////
            // calendar
            /////////////////////////////////////////////
            //------------------------------------------
            $scope.setToday = function() {
                var formattedDateFrom = datefilter(new Date(), 'yyyy-MM-dd');
                var formattedDateTo = datefilter(new Date(), 'yyyy-MM-dd');

                $scope.dtFrom = formattedDateFrom;
                $scope.dtTo = formattedDateTo;
            };


            //------------------------------------------
            $scope.openFrom = function($event) {
                //console.log("dashBoardMainCtrl -> openFrom()");
                $event.preventDefault();
                $event.stopPropagation();

                $scope.openedFrom = true;
            };

            //------------------------------------------
            $scope.openTo = function($event) {
                //console.log("dashBoardMainCtrl -> openTo()");
                $event.preventDefault();
                $event.stopPropagation();

                $scope.openedTo = true;
            };

            //------------------------------------------
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.keep_monitoring = false;
            var timerId = -1;
            var refreshPeriod = 1000*60*1; //1 min

            //------------------------------------------
            $scope.displayFormatChanged = function(value) {

                if(value === "format_chart") {

                    if($scope.keep_monitoring){
                        timerId = setInterval(function() {
                            //console.log("refresh!!");
                            $scope.showData();
                        }, refreshPeriod );
                    }
                    $location.path( '/dustChart' );

                } else if(value === "format_table") {
                    if(timerId>0){
                        clearInterval(timerId);
                        timerId = -1;
                        $scope.keep_monitoring = false;
                        //console.log("refresh timer cancelled !!");
                    }
                    $location.path( '/dustDataTable' );
                }
            };

            //------------------------------------------
            $scope.keepMonitoringCheckBoxChanged = function() {
                //console.log("keepMonitoringCheckBoxChanged ->",$scope.keep_monitoring);

                if( $scope.keep_monitoring){
                    timerId = setInterval(function() {
                        $scope.showData();
                    }, refreshPeriod );
                }else{
                    if(timerId>0){
                        clearInterval(timerId);
                        timerId = -1;
                        $scope.keep_monitoring = false;
                    }
                }
            };



            $scope.setToday();
            $scope.showData(); //!!!!!!!!

        }]);


/**
 * Created by kojunghyun on 14. 12. 18..
 */
angular.module('dustDataTable', [])
    //-----------------------------------------------------------------------------------
    .controller('dustDataTableCtrl', ['$scope','globalData',function($scope,globalData) {
        //console.log('------ dustDataTableCtrl init..');
        $scope.dustDatas =globalData.dustDataArry;

        ///////////////////////////////////////////////////////
        //using ui-bootstrap pagination
        $scope.filteredDustDatas= [];
        $scope.itemsPerPage = 15;
        $scope.currentPage = 1;

        //페이지 이동시
        $scope.figureOutToDisplay = function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            //console.log("begin="+begin+" / end="+end);
            $scope.filteredDustDatas = globalData.dustDataArry.slice(begin, end);
        };

        $scope.figureOutToDisplay();

        $scope.pageChanged = function() {
            $scope.figureOutToDisplay();
        };

        //사용자가 조회를 다시 한 경우, 바인딩된 $scope.filteredDustDatas 를 갱신시켜야함.
        //(자동으로 변경 판단 안됨)
        $scope.$on('new-data-arrived', function(event, args) {

            console.log("new-data-arrived !!!");
            $scope.currentPage = 1;
            $scope.figureOutToDisplay();
        });

        //$scope.$watch('globalData.dustDataArry', function(){ console.log("globalData.dustDataArry changes!!!!!!");} );
        ///////////////////////////////////////////////////////

    }]);

    /*
    //-----------------------------------------------------------------------------------
    //directive : for pagination TODO
    .directive('myPaginationDirective', function() {
        //모든 데이터는 이미 한번에 가져온 상태이다!!

        return {
            restrict: 'E',
            templateUrl: 'dustDataTable/pagination_template.html',

            scope: {
                maxVisiblePages: '@'//선택가능한 최대 페이지 표시수, 초과시에는 다음 이전을 통해 접근.
                //countAllApiUrl:'@',
                //pagedListApiUrlPrefix:'@'
            },

            controller: function($scope, globalData){

                $scope.listPerPage= 5; //한 페이지당 표시할 메시지 수
                $scope.totalPages= -1;
                $scope.totalMsgCnt= -1;
                //$scope.maxVisiblePages= 3;//선택가능한 최대 페이지 표시수, 초과시에는 다음 이전을 통해 접근.
                $scope.currentPage= 1;    //사용자가 선택한 페이지를 계속 저장
                $scope.totalPageSets=-1;
                $scope.currentPageSet= -1; // ex: 전체 100 페이지 존재하는데(totalPages), 표시 페이지 단위가 5이면(maxVisiblePages),

                console.log("myPaginationDirective controller maxVisiblePages="+parseInt($scope.maxVisiblePages) ); //debug

                //var ddd  = parseInt( $scope.maxVisiblePages);
                $scope.totalMsgCnt = globalData.dustDataArry.length;

                $scope.$watch('globalData.dustDataArry.length', ackDustDataChanged);
                function ackDustDataChanged() {
                    $scope.totalMsgCnt = globalData.dustDataArry.length;
                    console.log( "- myPaginationDirective totalCount changes!: " + $scope.totalMsgCnt );
                }

                console.log( "- myPaginationDirective totalCount: " + $scope.totalMsgCnt );
                //$scope.totalMsgCnt = data; //save to service
                //pageInfo.totalPages = Math.ceil(pageInfo.totalMsgCnt / pageInfo.listPerPage);
                $scope.totalPages = Math.ceil($scope.totalMsgCnt / $scope.listPerPage);
                console.log( "- myPaginationDirective $scope.totalPages: " + $scope.totalPages );

                $scope.totalPageSets = Math.ceil($scope.totalPages / $scope.maxVisiblePages);

                $scope.disabledNext = 0;
                $scope.disabledLast = 0;

                if($scope.currentPageSet == 1 ) {
                    $scope.disabledFirst = 1;
                    $scope.disabledPrevious = 1;
                }

                if($scope.currentPageSet > 1 ) {
                    $scope.disabledFirst = 0;
                    $scope.disabledPrevious = 0;
                }

                if($scope.currentPageSet == $scope.totalPageSets ) {
                    $scope.disabledNext = 1;
                    $scope.disabledLast = 1;
                }


                $scope.pageSetArray=[];
                $scope.activeIndexAry=[];

                for (var i = 0; i < $scope.maxVisiblePages; i++) {
                    var pageIndex = ($scope.maxVisiblePages*($scope.currentPageSet-1)) + (i + 1);

                    if(pageIndex <= $scope.totalPages ) {
                        $scope.pageSetArray.push(pageIndex);
                        if($scope.currentPage ==pageIndex){
                            $scope.activeIndexAry.push(1); //set active page
                        }else{
                            $scope.activeIndexAry.push(0);
                        }
                    }
                }

                //--------------------------------------------------------------
                $scope.showFirstPageSet = function(){
                    $scope.currentPageSet = 1;
                    //console.log( "showFirstPageSet!!");//debug
                    $scope.currentPage=1;
                    //$location.path( $scope.pagedListApiUrlPrefix +  //TODO
                };

                //--------------------------------------------------------------
                $scope.showPreviousPageSet = function(){

                    if($scope.currentPageSet == 1 ) {
                        //console.log( "showPreviousPageSet --> SKIP!!");//debug
                        return; //skip
                    }

                    $scope.currentPageSet -= 1;

                    var activatePageIndex = ($scope.maxVisiblePages*($scope.currentPageSet-1)) + $scope.maxVisiblePages;
                    //console.log( "showPreviousPageSet --> activatePageIndex:"+activatePageIndex+" pageInfo.maxVisiblePages:"+globalData.pageInfo.maxVisiblePages);//debug
                    $scope.currentPage=activatePageIndex;

                    //$location.path( $scope.pagedListApiUrlPrefix + $scope.currentPage); //TODO
                };

                //--------------------------------------------------------------
                $scope.showNextPageSet = function(){

                    if($scope.currentPageSet == $scope.totalPageSets ) {
                        //console.log( "showNextPageSet --> SKIP!!:"+globalData.pageInfo.currentPageSet);//debug
                        return; //skip
                    }

                    $scope.currentPageSet += 1;

                    //다음 페이지셋의 첫번쩨 페이지로 이동 (ex: 1,2,3,4 페이지셋 표시중 다음을 누른 경우 5번째 패이지 표시)
                    var nextFirstPageIndex=($scope.maxVisiblePages*($scope.currentPageSet-1)) + 1;
                    //console.log( "showNextPageSet --> move to page:"+nextFirstPageIndex);//debug
                    $scope.currentPage=nextFirstPageIndex;

                    //$location.path( $scope.pagedListApiUrlPrefix +globalData.pageInfo.currentPage ); //TODO
                };

                //--------------------------------------------------------------
                $scope.showLastPageSet = function(){
                    //console.log( "showLastPageSet!!");//debug
                    $scope.currentPageSet = $scope.totalPageSets;

                    $scope.currentPage=$scope.totalPages;

                    //$location.path( $scope.pagedListApiUrlPrefix +globalData.pageInfo.currentPage ); //TODO
                };

            } //controller
        };
    });
        */

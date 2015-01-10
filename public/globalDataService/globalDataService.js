/**
 * Created by kojunghyun on 14. 12. 19..
 */

'use strict';

var globalDataService = angular.module('globalDataService', []);

//-----------------------------------------------------------------------------
//global data
globalDataService.factory('globalData', function($http){

    var dustDataArry = [];
    //------------------------------------- area colors
    var maxAreaCnt = 5;
    var areaColorAry = [];

    //-------------------------------------
    function ColorObj (r, g, b) {
        var rgb = "rgba("+r+","+g+","+b;

        this.fillColor = rgb +",0.2)";
        this.strokeColor = rgb +",1)";
        this.pointColor = rgb +",1)";
        this.pointStrokeColor =  '#fff';
        this.pointHighlightFill =  '#fff';
        this.pointHighlightStroke =rgb +",1)";
    }

    /* random
    for(var i=0; i<maxAreaCnt;i++){
        var colorObj = new ColorObj( (Math.random()*256|0).toString(10),
            (Math.random()*256|0).toString(10),
            (Math.random()*256|0).toString(10) );

        areaColorAry.push(colorObj);
    }
    */

    areaColorAry.push(new ColorObj( '7','27','43') );
    areaColorAry.push(new ColorObj( '67','8','243') );
    areaColorAry.push(new ColorObj( '43','173','116') );
    areaColorAry.push(new ColorObj( '164','99','13') );
    areaColorAry.push(new ColorObj( '132','13','164') );


    //------------------------------------- chart data
    //서비스에 존재하는 이유: 테이블/chart view 전환 시 마다 계산하지 않기 위해서. 데이터를 받아서 한번만 chart 데이터를 구성한다.
    //chart contriller에 존재하면 매번 구성 됨.
    var dustChartData = {
        labels  : [],   //x axis label
        datasets: []    //각 지역별 정보 --> 1 지역이  chart 데이터 배열 1 개를 가진다.
                        //이 chart data 배열의 원소수가  이 labels 배열의 원소수와 일치해야 함.
    };

    function buildChartData() {
        console.log("buildChartData invoked! ");

        var nAreaIndex = 0;
        var areaMap = {};
        var areaNameAry = [];
        var labelAry = [];
        var i =0;

        for(i=0;i<dustDataArry.length;i++){

            var dustData = dustDataArry[i];
            var dateLabel = dustData.date.substr(4,6); //mmddhh24(122813)

            if(areaMap[dustData.area]){
                //수치 데이터 입력
                areaMap[dustData.area].data.push( parseInt(dustData.pm10) );
                //console.log("pm10 area:"+dustData.area+" pm10 push:"+dustData.pm10);

                if(labelAry.indexOf(dateLabel)==-1){
                    labelAry.push(dateLabel); //x axis label
                    //TODO :XXX 만약 2지역 비교시 해당 시간에 대해 한 지역만 측정 데이터가 존재하는 경우 Error..
                    //TODO  --> 없는 지역은 그 시점을 skip해야하지만 계속 이어져서 출력되어
                    //TODO  --> 결국 단추가 잘못끼워진 모습됨..
                    //
                    //console.log("x axis label area:"+dustData.area+dateLabel);
                }
            }else{
                //지역을 추가.
                areaNameAry.push(dustData.area);
                //console.log("area push:"+dustData.area+"  nAreaIndex="+nAreaIndex);

                areaMap[dustData.area]={
                    label: dustData.area, //강남, 강북..
                    fillColor:  areaColorAry[nAreaIndex].fillColor,
                    strokeColor: areaColorAry[nAreaIndex].strokeColor,
                    pointColor: areaColorAry[nAreaIndex].pointColor,
                    pointStrokeColor: areaColorAry[nAreaIndex].pointStrokeColor,
                    pointHighlightFill: areaColorAry[nAreaIndex].pointHighlightFill,
                    pointHighlightStroke: areaColorAry[nAreaIndex].pointHighlightStroke,
                    data: [] //chart data
                };

                areaMap[dustData.area].data.push( parseInt(dustData.pm10) );
                //console.log("pm10 area:"+dustData.area+" pm10 push:"+dustData.pm10);

                //labelAry.push(dateLabel); // TODO
                if(labelAry.indexOf(dateLabel)==-1){
                    labelAry.push(dateLabel); //x axis label
                    //console.log("x axis label area:"+dustData.area+dateLabel);
                }

                nAreaIndex++;
            }

        } //for

        //data 검증
        var totalExpectedDataCnt = labelAry.length * areaNameAry.length;
        if(dustDataArry.length != totalExpectedDataCnt){
            console.log("*** missing data exists : current/expexted =", dustDataArry.length+"/"+totalExpectedDataCnt);
            //console.log("totalExpectedDataCnt=", totalExpectedDataCnt);
        }


        var charDataAry =[];
        for(i=0; i<areaNameAry.length;i++){
            charDataAry.push(areaMap[ areaNameAry[i] ]);
        }

        angular.copy(charDataAry, dustChartData.datasets);
        angular.copy(labelAry, dustChartData.labels);
    } //build chart data


    ////////////////////////////////////////

    return  {
        dustDataArry: dustDataArry,
        areaColors :areaColorAry,
        buildChartData: buildChartData,
        dustChartData:dustChartData,
        maxAreaCnt:maxAreaCnt

    };
});

//-----------------------------------------------------------------------------
globalDataService.factory('serverDataService', function($http) {
    return  {
        getDataFromServer:function(queryInfoObj){
            return $http.post('/dust/getDustByMultiAreasTime',queryInfoObj);
        }
    };
});

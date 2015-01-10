'use strict';

///////////////////////////////////////////////////////////////////////////////
//http 요청을 처리 --> DB API
///////////////////////////////////////////////////////////////////////////////

var express = require('express');
var router = express.Router();

//-----------------------------------------
//var request = require('request');
//var Iconv  = require('iconv').Iconv;
//var cheerio = require('cheerio');
var dbManagerInstance = require('../dbManager');
//-----------------------------------------


//-----------------------------------------------------------------------------
router.post('/getDustByMultiAreasTime', function (req, res) {

    /*
    for(var i=0; i<req.body.selectedAreas.length;i++){
        console.log('******** getDustByMultiAreasTime :selectedAreas=', req.body.selectedAreas[i].area); //debug
    }
    console.log('******** getDustByMultiAreasTime :dateFrom=', req.body.dateFrom); //debug
    console.log('******** getDustByMultiAreasTime :dateTo=', req.body.dateTo); //debug
    */

    getDustDataByMultipleAreas(res, req.body.selectedAreas, req.body.dateFrom,req.body.dateTo);
});

//-----------------------------------------------------------------------------
var getDustDataByMultipleAreas = function  (res,dustAreaArray, dustDateFrom, dustDateTo ) {

    dbManagerInstance.selectDustDataByAreaArrayAndDateRange(dustAreaArray, dustDateFrom, dustDateTo,
        function (err) {
            res.send(err.code);
        },
        function (dustDataArry) {
            //console.log('server:', dustDataArry);
            res.send(dustDataArry);
        });
};


module.exports = router;

/*
 var currentDate;
 var currentPM10;
 var currentPM25;
 var currentStatus;
 var determinationMaterial;
 var determinationFactorVal;
 //var currentTemp;
 //var currentHumidity;
 //var windDirection;
 //var windVelocity;

 var funcDetailed = function getDetailedInfo ( ) {
 request({uri: 'http://cleanair.seoul.go.kr/air_city.htm?method=measure', encoding: 'binary'},
 function (err, response, body) {
 var strContents = new Buffer(body, 'binary');
 var iconv = new Iconv('EUC-KR', 'UTF-8'); //'euc-kr'-->'UTF8'
 strContents = iconv.convert(strContents).toString();
 //console.log("strContents:",strContents); //debug
 var $ = cheerio.load(strContents);

 currentDate = $('.ft_point1', '.graph_h4').text();
 console.log('currentDate:', currentDate);

 //debug--------------

 //                 console.log(".tbl2 ==> ", $('.tbl2 tbody tr td').eq(0).text()); //debug
 //                 $('.tbl2 tbody tr').each(function() {
 //                 console.log("==> ", $(this).find("td").eq(0).text().replace(/\s+/, "")); //debug
 //                 });

 //--------------------

 //$('tbody tr','.tbl2').each(function() {
 $('.tbl2 tbody tr').each(function () {
 //var strArea=$(this).find("td").eq(0).html().replace(/\s+/, "");
 var $oneRowData = $(this).find("td");
 var strArea = $oneRowData.eq(0).text().replace(/\s+/, "");

 strArea = strArea.replace(/(\r\n|\n|\r)/gm, "");
 strArea = strArea.replace(/\s+/, "");
 //strArea = padding_right(strArea, ' ', 5);

 //console.log("-----strArea:",strArea); //debug

 //if(strArea=="금천구"||strArea=="강북구"||strArea=="양천구") {
 if (dustArea === strArea) {
 currentPM10 = $oneRowData.eq(1).text().replace(/\s+/, "");
 currentPM10 = currentPM10.replace(/(\r\n|\n|\r)/gm, "");
 currentPM10 = currentPM10.replace(/\s+/, "");

 currentPM25 = $oneRowData.eq(2).text().replace(/\s+/, "");
 currentPM25 = currentPM25.replace(/(\r\n|\n|\r)/gm, "");
 currentPM25 = currentPM25.replace(/\s+/, "");

 //등급
 currentStatus = $oneRowData.eq(7).text().replace(/\s+/, "");
 currentStatus = currentStatus.replace(/(\r\n|\n|\r)/gm, "");
 currentStatus = currentStatus.replace(/\s+/, "");

 //지수
 determinationFactorVal = $oneRowData.eq(8).text().replace(/\s+/, "");
 determinationFactorVal = determinationFactorVal.replace(/(\r\n|\n|\r)/gm, "");
 determinationFactorVal = determinationFactorVal.replace(/\s+/, "");

 //결정물질
 determinationMaterial = $oneRowData.eq(9).text().replace(/\s+/, "");
 determinationMaterial = determinationMaterial.replace(/(\r\n|\n|\r)/gm, "");
 determinationMaterial = determinationMaterial.replace(/\s+/, "");
 determinationMaterial = determinationMaterial.replace("</sub>", "");
 determinationMaterial = determinationMaterial.replace("<sub>2", "²");

 console.log('-' + strArea + ': PM10=' +
 currentPM10 + ' / PM2.5=' + currentPM25 + ' / ' +
 currentStatus + ' / ' + '결정물질:' +
 determinationMaterial + ' [' + determinationFactorVal + ']');

 //TEST!!!
 res.json(
 {
 curDate: currentDate,
 area      : dustArea,
 date      : dustDate,
 pm10      : currentPM10,
 pm25      : currentPM25,
 status    : currentStatus,
 detMat    : determinationMaterial,
 detFactVal: determinationFactorVal
 //temp      : currentTemp,
 //humidity  : currentHumidity,
 //windDirect: windDirection,
 //windVel   : windVelocity
 }
 );
 }
 });

 //cb();
 });
 };
 */

/*
 //summary info
 var funcSummary = function getSummaryInfo () {
 request({uri: 'http://cleanair.seoul.go.kr/main.htm', encoding: 'binary'},
 function (err, response, body) {
 var strContents = new Buffer(body, 'binary');
 strContents = iconv.convert(strContents).toString();
 //console.log(strContents);
 var $ = cheerio.load(strContents);

 console.log('\n* 서울 미세먼지 평균 농도 : ' + $('.average ', '.w154').text());
 //XXX 풍속등이 없는 경우도 있음!!!
 $('.al_c').each(function () {
 var $oneRowData = $(this).find("td");
 currentTemp = $oneRowData.eq(0).text().replace(/\s+/, "");
 currentTemp = currentTemp.replace(/(\r\n|\n|\r)/gm, "");
 currentTemp = currentTemp.replace(/\s+/, "");
 currentTemp = currentTemp.replace("&deg;C", "℃");

 console.log('* temp : ' + currentTemp);

 currentHumidity = $oneRowData.eq(1).text().replace(/\s+/, "");
 currentHumidity = currentHumidity.replace(/(\r\n|\n|\r)/gm, "");
 currentHumidity = currentHumidity.replace(/\s+/, "");
 console.log('* 습도 : ' + currentHumidity);

 windDirection = $oneRowData.eq(2).text().replace(/\s+/, "");
 windDirection = windDirection.replace(/(\r\n|\n|\r)/gm, "");
 windDirection = windDirection.replace(/\s+/, "");
 console.log('* 풍향 : ' + windDirection);

 windVelocity = $oneRowData.eq(3).text().replace(/\s+/, "");
 windVelocity = windVelocity.replace(/(\r\n|\n|\r)/gm, "");
 windVelocity = windVelocity.replace(/\s+/, "");
 console.log('* 풍속 : ' + windVelocity);


 // <2014년 12월 15일 23시>
 //
 // -금천구: PM10=16 / PM2.5=점검중 / 보통 / 결정물질:NO2 [56]
 //
 // * 서울 미세먼지 평균 농도 : 34 ㎍/㎥
 // * 온도 : 0.5°C
 // * 습도 : 99.9%
 // * 풍향 : 동북동
 // * 풍속 : 1.8m/s

 res.json(
 {
 curDate: currentDate,
 area      : dustArea,
 date      : dustDate,
 pm10      : currentPM10,
 pm25      : currentPM25,
 status    : currentStatus,
 detMat    : determinationMaterial,
 detFactVal: determinationFactorVal,
 temp      : currentTemp,
 humidity  : currentHumidity,
 windDirect: windDirection,
 windVel   : windVelocity
 }
 );
 });
 });
 };
 */

//////////////////////////

/*
 request({uri: 'http://cleanair.seoul.go.kr/air_city.htm?method=measure', encoding: 'binary'},
 function(err, response, body) {
 var strContents = new Buffer(body, 'binary');

 var iconv = new Iconv1('euc-kr', 'UTF8');
 strContents = iconv.convert(strContents).toString();
 //console.log("strContents:",strContents); //debug

 var $ = cheerio.load(strContents);

 currentDate = $('.ft_point1', '.graph_h4').text();
 console.log( 'currentDate:',currentDate);


//--------------------

//$('tbody tr','.tbl2').each(function() {
$('.tbl2 tbody tr').each(function() {
    //var strArea=$(this).find("td").eq(0).html().replace(/\s+/, "");
    var $oneRowData = $(this).find("td");
    var strArea = $oneRowData.eq(0).text().replace(/\s+/, "");

    strArea = strArea.replace(/(\r\n|\n|\r)/gm,"");
    strArea = strArea.replace(/\s+/, "");
    //strArea = padding_right(strArea, ' ', 5);

    //console.log("-----strArea:",strArea); //debug

    //if(strArea=="금천구"||strArea=="강북구"||strArea=="양천구") {
    if(dustArea === strArea) {
        currentPM10 = $oneRowData.eq(1).text().replace(/\s+/, "");
        currentPM10 = currentPM10.replace(/(\r\n|\n|\r)/gm, "");
        currentPM10 = currentPM10.replace(/\s+/, "");

        currentPM25 = $oneRowData.eq(2).text().replace(/\s+/, "");
        currentPM25 = currentPM25.replace(/(\r\n|\n|\r)/gm, "");
        currentPM25 = currentPM25.replace(/\s+/, "");

        //등급
        currentStatus = $oneRowData.eq(7).text().replace(/\s+/, "");
        currentStatus = currentStatus.replace(/(\r\n|\n|\r)/gm, "");
        currentStatus = currentStatus.replace(/\s+/, "");

        //지수
        determinationFactorVal = $oneRowData.eq(8).text().replace(/\s+/, "");
        determinationFactorVal = determinationFactorVal.replace(/(\r\n|\n|\r)/gm, "");
        determinationFactorVal = determinationFactorVal.replace(/\s+/, "");

        //결정물질
        determinationMaterial = $oneRowData.eq(9).text().replace(/\s+/, "");
        determinationMaterial = determinationMaterial.replace(/(\r\n|\n|\r)/gm, "");
        determinationMaterial = determinationMaterial.replace(/\s+/, "");
        determinationMaterial = determinationMaterial.replace("</sub>", "");
        determinationMaterial = determinationMaterial.replace("<sub>2", "²");

        console.log('-' + strArea + ': PM10=' +
            currentPM10+ ' / PM2.5=' +currentPM25 + ' / ' +
            currentStatus+ ' / ' + '결정물질:'+
            determinationMaterial +' ['+determinationFactorVal +']');
    }
});


//summary info
request({uri: 'http://cleanair.seoul.go.kr/main.htm', encoding: 'binary'},
    function(err, response, body) {
        var strContents = new Buffer(body, 'binary');
        //var iconv = new Iconv1('euc-kr', 'UTF8');
        strContents = iconv.convert(strContents).toString();
        //console.log(strContents);
        var $ = cheerio.load(strContents);

        console.log( '\n* 서울 미세먼지 평균 농도 : '+$('.average ', '.w154').text() );
        $('.al_c').each(function() {
            var $oneRowData = $(this).find("td");
            currentTemp=$oneRowData.eq(0).text().replace(/\s+/, "");
            currentTemp = currentTemp.replace(/(\r\n|\n|\r)/gm,"");
            currentTemp = currentTemp.replace(/\s+/, "");
            currentTemp = currentTemp.replace("&deg;C", "℃");

            console.log('* 온도 : ' + currentTemp );

            currentHumidity=$oneRowData.eq(1).text().replace(/\s+/, "");
            currentHumidity = currentHumidity.replace(/(\r\n|\n|\r)/gm,"");
            currentHumidity = currentHumidity.replace(/\s+/, "");
            console.log('* 습도 : ' + currentHumidity );

            windDirection=$oneRowData.eq(2).text().replace(/\s+/, "");
            windDirection = windDirection.replace(/(\r\n|\n|\r)/gm,"");
            windDirection = windDirection.replace(/\s+/, "");
            console.log('* 풍향 : ' + windDirection );

            windVelocity=$oneRowData.eq(3).text().replace(/\s+/, "");
            windVelocity = windVelocity.replace(/(\r\n|\n|\r)/gm,"");
            windVelocity = windVelocity.replace(/\s+/, "");
            console.log('* 풍속 : ' + windVelocity );


            res.json(
                {   area  : dustArea,
                    date  : dustDate,
                    pm10  : currentPM10,
                    pm25  : currentPM25,
                    status : currentStatus,
                    detMat   : determinationMaterial,
                    detFactVal:determinationFactorVal,
                    temp: currentTemp,
                    humidity : currentHumidity,
                    windDirect: windDirection,
                    windVel:windVelocity
                }
            );
        });
    });
});
 */
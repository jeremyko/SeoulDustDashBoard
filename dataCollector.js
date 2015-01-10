/**
 * Created by kojunghyun on 14. 12. 16..
 */
'use strict';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var request = require('request');
var Iconv  = require('iconv').Iconv;
var cheerio = require('cheerio');
var dbManagerInstance = require('./dbManager');

var currentDate;
var currentPM10;
var currentPM25;
var currentStatus;
var determinationMaterial;
var determinationFactorVal;

//detailed info
var getDustData = function  () {

    console.log('**** funcDetailed invoked!! : ', new Date());

    request({uri: 'http://cleanair.seoul.go.kr/air_city.htm?method=measure', encoding: 'binary', timeout: 15000},
        function (err, response, body) {
            if (!err && response.statusCode == 200) {

            }else{
                console.log('ERROR:', err);
                return;
            }
            var strContents = new Buffer(body, 'binary');
            var iconv = new Iconv('EUC-KR', 'UTF-8'); //'euc-kr'-->'UTF8'
            strContents = iconv.convert(strContents).toString();
            var $ = cheerio.load(strContents);

            var strDate = $('.ft_point1', '.graph_h4').text(); //"2014년 12월 17일 23시"
            currentDate = strDate.substr(0,4) + strDate.substr(6,2)+strDate.substr(10,2)+strDate.substr(14,2);
            console.log('currentDate:', currentDate);

            try {
                $('.tbl2 tbody tr').each(function () {
                    var $oneRowData = $(this).find("td");
                    var strArea = $oneRowData.eq(0).text().replace(/\s+/, "");

                    strArea = strArea.replace(/(\r\n|\n|\r)/gm, "");
                    strArea = strArea.replace(/\s+/, "");

                    //console.log("-----strArea:",strArea); //debug

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

                    /*
                    console.log('-' + strArea + ': PM10=' +
                        currentPM10 + ' / PM2.5=' + currentPM25 + ' / ' +
                        currentStatus + ' / ' + '결정물질:' +
                        determinationMaterial + ' [' + determinationFactorVal + ']');
                    */

                    if(currentPM10!='점검중') {
                        //-----------------------------------------------------
                        //insert into DB
                        var dustData = {
                            date       : currentDate,
                            area       : strArea,
                            pm10       : currentPM10,
                            pm25       : currentPM25,
                            level      : currentStatus,
                            detMat     : determinationMaterial,
                            detMatIndex: determinationFactorVal
                        };

                        dbManagerInstance.insertDB(dustData);
                    }
                });
            }
            catch(e){
                $log("Some Error !! : ",e)
            }
            finally{
            }
        });
};

process.on('exit', function () {
    console.log('About to exit.');
    dbManagerInstance.disConnectDB();
});

process.on('SIGINT', function() {
    console.log('Got SIGINT.  ');
    dbManagerInstance.disConnectDB();
    process.exit(0);
});

/*
//summary info
var funcSummary = function  () {
    console.log('**** funcSummary invoked!!');

    request({uri: 'http://cleanair.seoul.go.kr/main.htm', encoding: 'binary'},
        function (err, response, body) {
            var strContents = new Buffer(body, 'binary');
            var iconv = new Iconv('euc-kr', 'UTF8');
            strContents = iconv.convert(strContents).toString();
            //console.log(strContents);
            var $ = cheerio.load(strContents);

            console.log('\n* 서울 미세먼지 평균 농도 : ' + $('.average ', '.w154').text());

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
            });
        });
};
*/

module.exports.getDustData = getDustData;

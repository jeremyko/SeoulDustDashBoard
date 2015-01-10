/**
 * Created by kojunghyun on 14. 12. 16..
 */
"use strict";


function dbManager() {
    //this is singleton
    //console.log("dbManager invoked!!"); //debug

    var mysql   = require('mysql');
    var instance;
    var connection ;

    dbManager = function dbManager() {
        //console.log("*** dbManager / singleton!!! "); //debug
        return instance;
    };

    //console.log("dbManager : dbManager.prototype = this; "); //debug

    dbManager.prototype = this;

    instance = new dbManager();

    instance.constructor = dbManager;

    instance.bDisconnected= false;
    //methods
    //-----------------------------------------------------
    instance.connectDB = function() {
        //console.log("1. dbManager / connectDB invoked!!"); //debug

        connection = mysql.createConnection({
            host     : 'localhost',
            database : 'seoul_dust',
            user     : 'test',
            password : '1234'
        });

        connection.connect();
    };

    //----------------------------------------------------- multiple area
    instance.selectDustDataByAreaArrayAndDateRange= function( dustAreaArray, dustDateFrom, dustDateTo, onError,onSuccess ) {
        //console.log("selectDustDataByAreaArrayAndDateRange invoked=",dustAreaArray.length);
        var areaCondition ='in (';
        for(var i = 0; i<dustAreaArray.length;i++){
            areaCondition += "'"+dustAreaArray[i].area+"'";
            if(i+1!=dustAreaArray.length){
                areaCondition +=','
            }
        }
        areaCondition +=')';

        var queryStr = "select date, area, pm10, pm25, level, detMat, detMatIndex from dust_data where date between '"
            + dustDateFrom + "' and '"
            + dustDateTo + "' and area "+areaCondition
            + " order by date";

        console.log("queryStr=",queryStr);

        connection.query(queryStr,  function (err, rows, fields) {
                if (err) {
                    console.log("selectDustDataByAreaAndDateRange Error:", err.code);
                    onError(err);
                    //throw err;
                }

                if (rows != undefined) {
                    //console.log('selectDustDataByAreaAndDateRange: rows->',rows);//debug
                    onSuccess(rows);
                }
            }
        );
    };

    //-----------------------------------------------------
    instance.insertDB = function( dustData ){

        connection.query("select 1 as count from dust_data where date='"
            +dustData.date+"' and area='"+ dustData.area+"' limit 1",
            function(err, rows, fields) {
                if (err) {
                    console.log(err.code); // 'ECONNREFUSED'
                    throw err;
                }

                if(rows[0] != undefined && rows[0].count == 1){
                    //console.log('already exists!');
                    return ;
                }

                //console.log("dbManager / insertDB !!"); //debug

                var queryStr = "INSERT INTO dust_data(date,area,pm10,pm25,level,detMat,detMatIndex) values('"+
                    dustData.date+"','" +
                    dustData.area+"','" +
                    dustData.pm10 +"','" +
                    dustData.pm25 +"','" +
                    dustData.level +"','" +
                    dustData.detMat +"','" +
                    dustData.detMatIndex +"')";

                //console.log("queryStr==>",queryStr);

                connection.query(queryStr,  function(err, rows, fields) {
                    if (err) {
                        console.log(err.code); // 'ECONNREFUSED'
                        throw err;
                    }
                    return true;
                });
            });
    };

    //-----------------------------------------------------
    instance.disConnectDB = function() {
        console.log("dbManager / disConnectDB  invoked!!"); //debug
        if(false==instance.bDisconnected){
            console.log("dbManager / connection.end()"); //debug
            connection.end();
            instance.bDisconnected= true;
        }else{
            console.log("dbManager / already disconnected!!"); //debug
        }
    };

    //-----------------------------------------------------
    //connect!
    instance.connectDB();
    return instance;
}

module.exports = new dbManager();



## Displaying current density of particulate matter(PM10) in seoul using AngularJS, Express.js

![image](https://github.com/jeremyko/SeoulDustDashBoard/blob/master/scrCap1.png)

![image](https://github.com/jeremyko/SeoulDustDashBoard/blob/master/scrCap2.png)

### HowTo
  
##### 1. Need to create below table on your MySql 
    CREATE TABLE dust_data
    (
      date          varchar(10),
      area            varchar(20),
      pm10            int(10),
      pm25            int(10),
      level           varchar(20),
      detMat        varchar(20),
      detMatIndex   int(10),
      PRIMARY KEY (date,area)
    ) DEFAULT CHARSET=utf8 ;

##### 2. Need to config your MySql connection in **dbManager.js**
current config 

    host     : 'localhost',
    database : 'seoul_dust',
    user     : 'test',
    password : '1234'
        
##### 3. npm install

##### 4. npm start

##### Done!


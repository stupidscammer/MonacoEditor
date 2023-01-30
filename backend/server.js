
// var express = require('express'),
// app = express(),
// port = process.env.PORT || 4000;
const express = require('express')
// const crypto = require('crypto')
const router = express.Router()
var isHeader = false;
router.use(express.urlencoded({extended:true}))
var fs = require('fs');
var { parse } = require('csv-parse');
const fastCsv = require("fast-csv");
// const cors = require('cors')
// app.use(cors());
const { convertArrayToCSV } = require("convert-array-to-csv");
const csv = require("fast-csv");
const { format } = require('@fast-csv/format');
const fileName = 'loghistory.csv';
const csvFile = fs.createWriteStream(fileName);
router.get('/read-csv', async(req, res) => { 
  const result= await importCSV(fileName);
  res.json(result);
});
const importCSV = (filePath) => {
  return new Promise((resolve) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(fastCsv.parse({ headers: true, delimiter: "," }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => data.push(row))
      .on("end", () => {
        resolve(data);
      });
  });
};
const header = [
  "date",
  "time",
  "startLine",
  "startColumn",
  "text",
  "event"
];
router.post('/write-csv', (req, res) => {
  // console.log(req.body.data);
  var val;
  if (!isHeader) {
    //print the prices with header to csv file
    val = convertArrayToCSV([req.body], {
      header,
      separator: ",",
    });
  } else {
    //print the prices to csv file
    val = convertArrayToCSV([req.body], {
      separator: ",",
    });
  }
  isHeader = true;

  //this part is for export data to csv file.
  fs.appendFile('loghistory.csv', val, (err) => {
    if (err) {
      res.send({ error: true });
    }
    else res.send({ success: true });
  });});


// const strToblb=require('stream-to-blob');

// import {streamToBlob} from 'stream-to-blob';
// const raw = await axois.get(url, {responseType: 'stream',});
// const blob= await strToblb(raw.data);
// formData.append('files.Images', blob, (title.split(' ').join('_')+'_'+index));


module.exports.router = router
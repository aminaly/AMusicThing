//asynchronous call to get python
function callAjax(url, callback) {
 var xmlhttp;
 // compatible with IE7+, Firefox, Chrome, Opera, Safari
 xmlhttp = new XMLHttpRequest();
 xmlhttp.onreadystatechange = function() {
   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
     callback(xmlhttp.responseText);
   }
 }
 xmlhttp.open("GET", url, true);
 xmlhttp.send();
}

// read in text file
function readTextFile() {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", "examplejson.txt", true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      var allText = rawFile.responseText;
      pyRequest(rawFile.responseText, myCallback)
    }
  }
  rawFile.send();
}

// Deals with the returned data from python
function myCallback(theStuff) {
    // process theStuff here. If it's JSON data, you can unpack it trivially in Javascript,
    // as I will describe later. For this example, it's just text. You're going to get
    // back "hello, Ben"
    console.log(theStuff);
}

function pyRequest(upd_data, upd_callback) {
 var cd_url;
 	cd_url = 'sortPlaylist.py?myData=' + encodeURIComponent(upd_data);
 	callAjax(cd_url,upd_callback);
 }

 // do the work
readTextFile()

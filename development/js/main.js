var date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var hour = date.getHours() + 14;
var minutes = date.getMinutes() + 24;
var seconds = date.getSeconds() + 49;

if (seconds >= 60) {
    seconds = seconds - 60;
    minutes++;
}

if (minutes >= 60) {
    minutes = minutes - 60;
    hour++;
}

if (hour >= 24) {
    hour = hour - 24;
    day++;
}

var dateString =
    year + "/" + month + "/" + day + " " + hour + ":" + minutes + ":" + seconds;

var currDateString = new Date().toString();
var currDateEl = currDateString.split(" ");
var currDate = currDateEl[1] + " " + currDateEl[2] + ", " + currDateEl[3];

var sectionDate = document.getElementsByClassName("text--date");
for (var i = 0; i < sectionDate.length; i++) {
    sectionDate[i].innerHTML = currDate;
}
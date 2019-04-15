const express = require('express');
const app = express();
const giant_json = require('./giant_json.js')

app.get('/', (req, res, next) => {
    console.log("req.params: " + JSON.stringify(req.params));
    res.status(200).json({
        message: "This API works"
    })
});

app.get('/rooms/:day/:building/:time/:duration', (req, res, next) => {
    console.log("req.params: " + JSON.stringify(req.params));
    res.status(200).json({
        day: req.params.day,
        building: req.params.building,
        time: req.params.time,
        duration: req.params.duration,
        results: getAvailableRooms(req.params.building, req.params.day, req.params.time, req.params.duration)
    })
});

// app.get('/rooms', getRoom)
// app.get('rooms/:day/:building/:time/:duration', getAvailableRooms)

module.exports = app;

function getRoom(req, res, next) {
    // day = req.params.day;
    // building = req.params.building;
    // time = req.params.time;
    // duration = req.params;

    const id = 0// req.params.id
    console.log("req.params: " + JSON.stringify(req.params))
    res.status(200).json({
        id: giant_json.data[id],
    });
}

function formatTime(timeString) {
    return parseInt(timeString.substring(0,2) + timeString.substring(3,5));
}

function addTime(time, minutes) {
    var hour1, min1;
    if ((time + minutes)%100 > 59) {
        hour1 = Math.floor(time/100);
        min1 = time%100;
        dh = Math.floor((min1+minutes)/60);
        hour1 += dh;
        min1 = (min1+minutes)-60*dh;
        var temp = (100*hour1+min1);
        if (temp > 2359) {
            temp = temp-2400;
        }
      return temp;
    }
    else {
      return time + minutes;
    }
}

  
function getAvailableRooms(building,day,time,duration) {
    console.log('entered the function: ' + building + ', ' + day + ', ' + time + ', ' + duration)
    available_rooms = [];
    for (room in giant_json.data) {
        schedule = giant_json.data[room][day];
        //console.log(giant_json.data[room]["room_name"] + ": " + giant_json.data[room]['room_name'].indexOf(building))
        if (giant_json.data[room]['room_name'].indexOf(building)>=0 && isFree(schedule, time, duration)) {
            available_rooms.push(giant_json.data[room]['room_name']);
            //console.log(giant_json.data[room]['room_name'])
        }
    }
    return available_rooms;
}

  function isFree(schedule, time, duration) {
    for(var i = 0; i<schedule.length; i++) {
      tpl = schedule[i];
      if (time > tpl[0] && time < tpl[1]) {
        //console.log('false at: ' + time + 'because it is between ' + tpl[0] + 'and ' + tpl[1]);
        return false;
      }
      var temp = time;
      for (var t = 1; t <= duration; t++) {
        temp = addTime(temp, 1);
        if (temp > tpl[0] && temp < tpl[1]) {
            //console.log('false at: ' + time + 'because it is between ' + tpl[0] + 'and ' + tpl[1]);
            return false;
        }
      }
    }
    return true;
}
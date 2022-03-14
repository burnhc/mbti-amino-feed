let chartReady = false;
let calendarReady = false;

function onChartReady() {
    chartReady = true;
}

function setReadyListener() {
    const readyListener = () => {
      if (chartReady && calendarReady) {
        $(".loader").delay(100).fadeOut("slow");
        $("#loading-overlay").delay(100).fadeOut("slow");
      }
      return setTimeout(readyListener, 250);
    };
    readyListener();
}

setReadyListener();

const today = new Date();
var dateTodayStartPre = new Date(
    today.getFullYear(), 
    today.getMonth(), 
    today.getDate()
    );
dateTodayStartPre.setHours(0,0,0,0);
const dateTodayStart = dateTodayStartPre.toISOString();

function printCalendar() {
    var calendarId = 'qg38jvjp72hjpbfbrhjf2c0afo@group.calendar.google.com';
    var apiKey = 'AIzaSyDn_bqbC3NViutpZJ5vaFVG-aRbm-oXFsY';
    var userTimeZone = "America/Los_Angeles";
    var dateFormat = "dddd, MMMM Do"
    gapi.client.init({
        'apiKey': apiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(() => {
        return gapi.client.calendar.events.list({
            'calendarId': calendarId,
            'timeZone': userTimeZone,
            'singleEvents': true,
            'timeMin': dateTodayStart,
            'maxResults': 2,
            'orderBy': 'startTime'
        });
    }).then((response) => {
        if (response.result.items) {
            var calendarRows = [];
            response.result.items.forEach((entry) => {
                var startsAt = moment(entry.start.date).format(dateFormat);
                calendarRows.push(
                    `<li class="list-group-item"><strong>${startsAt}:</strong><p>${entry.summary}</p><p class="description">${entry.description}</p></li>`
                );
            });
            $('#events-upcoming').html(calendarRows.join(""));
            calendarReady = true;
        }
    }, (e) => {
        console.log('Error: ' + e.result.error.message);
    });
};

gapi.load('client', printCalendar);

$(function() {
    $("#wrapper").each(function() {
        var $wrap = $(this);
        function iframeScaler(){
            var wrapWidth = $wrap.width();
            var wrapHeight = $wrap.height();
            var childWidth = $wrap.children("iframe").width();
            var childHeight = $wrap.children("iframe").height();
            var wScale = wrapWidth / childWidth;
            var hScale = wrapHeight / childHeight;
            var scale = Math.min(wScale,hScale);
            $wrap.children("iframe").css({"transform": "scale("+scale+")", "transform-origin": "left top" });  // set scale
        };
        $(window).on("resize", iframeScaler);
        $(document).ready( iframeScaler);
    });
});
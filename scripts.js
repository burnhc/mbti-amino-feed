const today = new Date();
var dateTodayStartPre = new Date(
    today.getFullYear(), 
    today.getMonth(), 
    today.getDay()
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
                    `<li class="list-group-item"><strong>${startsAt}: </strong>\n${entry.summary}\n${entry.description}</li>`
                );
            });
            $('#events-upcoming').html(calendarRows.join(""));
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
            var wrapWidth = $wrap.width(); // width of the wrapper
            var wrapHeight = $wrap.height();
            var childWidth = $wrap.children("iframe").width(); // width of child iframe
            var childHeight = $wrap.children("iframe").height(); // child height
            var wScale = wrapWidth / childWidth;
            var hScale = wrapHeight / childHeight;
            var scale = Math.min(wScale,hScale);  // get the lowest ratio
            $wrap.children("iframe").css({"transform": "scale("+scale+")", "transform-origin": "left top" });  // set scale
        };
        $(window).on("resize", iframeScaler);
        $(document).ready( iframeScaler);
    });
});
function printCalendar() {
    var calendarId = 'qg38jvjp72hjpbfbrhjf2c0afo@group.calendar.google.com';
    var apiKey = 'AIzaSyDn_bqbC3NViutpZJ5vaFVG-aRbm-oXFsY';
    var userTimeZone = "America/Los_Angeles";
    var dateFormat = "dddd, MMMM Do"
    gapi.client.init({
        'apiKey': apiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(function () {
        // Use Google's "apis-explorer" for research: https://developers.google.com/apis-explorer/#s/calendar/v3/
        // Events: list API docs: https://developers.google.com/calendar/v3/reference/events/list
        return gapi.client.calendar.events.list({
            'calendarId': calendarId,
            'timeZone': userTimeZone,
            'singleEvents': true,
            'timeMin': (new Date()).toISOString(),
            'maxResults': 4,
            'orderBy': 'startTime'
        });
    }).then(function (response) {
        if (response.result.items) {
            var calendarRows = ['<ul class="list-group list-group-flush" id="events-upcoming">'];
            response.result.items.forEach(function(entry) {
                var startsAt = moment(entry.start.date).format(dateFormat);
                calendarRows.push(
                    `<li class="list-group-item"><strong>${startsAt}</strong>${entry.summary}<p>${entry.description}</p></li>`
                );
            });
            calendarRows.push('</ul>');
            $('#events-upcoming').html(calendarRows.join(""));
        }
    }, function (reason) {
        console.log('Error: ' + reason.result.error.message);
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
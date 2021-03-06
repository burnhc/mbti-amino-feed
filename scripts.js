let chartReady = false;
let calendarReady = false;

function onChartReady() {
    chartReady = true;
}

function setReadyListener() {
    const readyListener = () => {
      if (chartReady && calendarReady) {
        $(".loader").delay(100).hide();
        $("#loading-overlay").delay(100).hide();
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
                var calendarRow = '';
                var summary = entry.summary;
                var description = entry.description;
                var startsAt = moment(entry.start.date).format(dateFormat);
                
                if (summary.indexOf("🎈") === 0) {
                    summary = summary.replace("🎈", `<i class="fas fa-cake-candles fa-fw"></i>`);
                    var profileLink = description.slice(9, description.indexOf(`">Go to `)).replace(/\//g, '\\');
                    description = description.slice(description.indexOf(`'s profile »</a>`) + 16);
                    console.log(profileLink, description)
                    calendarRow = 
                        `<a href="${profileLink}" class="list-group-item list-group-item-action">
                        <h6 class="mb-2">${startsAt}:</h6>
                        <p class="mb-1">${summary}<span class="small-go-to-button">Profile</span></p>
                        <p class="mb-1">${description}</p></a>`
                }

                calendarRows.push(calendarRow);
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
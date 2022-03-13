const dateNow = new Date();
var dateYest = new Date(
    dateNow.getFullYear(), 
    dateNow.getMonth(), 
    dateNow.getDay() - 1);
dateYest.setHours(0,0,0,0);
const dateYesterday = dateYest.toISOString();
const dateEndOfMonth = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth() + 1, 
    0).toISOString();

formatGoogleCalendar.init({
    calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/qg38jvjp72hjpbfbrhjf2c0afo%40group.calendar.google.com/events?key=AIzaSyDn_bqbC3NViutpZJ5vaFVG-aRbm-oXFsY',
    past: true,
    upcoming: true,
    upcomingTopN: 2,
    pastTopN: 2,
    itemsTagName: 'li class="list-group-item"',
    upcomingSelector: '#events-upcoming',
    pastSelector: "#events-past",
    format: ['<strong>', '*date*', '</strong>: ', '*summary*', ' &#10; ', '*description*', ' in ', '*location*'],
    timeMin: dateYesterday,
    timeMax: dateEndOfMonth,
});

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
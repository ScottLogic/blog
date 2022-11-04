var feed = document.getElementById("feed2");
if (feed) {
    var eventsUrl = "../events.xml";
    httpGetAsync(eventsUrl, displayFeedAsTalkList);
}

function displayFeedAsTalkList(xml) {
    var resultingHtml = "<h4>Talks</h4>\n<div>";
    var xmlDoc = jQuery.parseXML( xml );
    $xml = jQuery( xmlDoc );
    var talks = convertXmlFeedToTalkArray($xml);

    sortTalks(talks);

    talks.forEach( function (talk) {
        resultingHtml += talk.html;
    });

    // If there are no talks, don't show anything
    if (talks.length === 0) {
        feed.innerHTML = "";
    } else {
        resultingHtml += "</div>";
        feed.innerHTML = resultingHtml;
    }
}

function convertXmlFeedToTalkArray($xml) {
    var talks = [];
    $items = $xml.find( "item" );
    jQuery.each($items, function (index, value) {
        if (value.children[7]) {
            var speakerHtml = value.children[7].innerHTML;
            var blogAuthorName = document.getElementsByTagName("h2")[0].innerHTML;
            if (speakerHtml.includes(blogAuthorName)) {
                // Add a single talk's information to the 'talks' array
                talks.push(getTalk(value.children));
            }
        }
    });
    return talks;
}

function sortTalks(talks) {
    // Sort by date (most recent at top)
    talks.sort( function (a, b) {
        if (b.year - a.year !== 0) {
            return b.year - a.year;
        } else if (b.month - a.month !== 0) {
            return b.month - a.month;
        } else {
            return b.day - a.day;
        }
    });
}

function getTalk(htmlChildren) {
    var talk = {};
    talk.html = "<div class='talk'>\n";
    for (var i = 0; i < htmlChildren.length; i++) {
        var talkProperty = htmlChildren[i];

        if (talkProperty.nodeName === "title") {
            talk.html += "<div class='talk_title'>" + talkProperty.innerHTML + "</div>\n";    
        } else if (talkProperty.nodeName === "events_date") {
            var date = talkProperty.innerHTML;

            var year = date.substring(0, 4);
            var month = date.substring(4, 6);
            var day = date.substring(6);

            var formattedDate = getFormattedDate(day, month, year);
            talk.html += "<div class='talk_date'>" + formattedDate + "</div>\n";
            talk.day = parseInt(day);
            talk.month = parseInt(month);
            talk.year = parseInt(year);
        }

    }
    talk.html += "</div>\n";
    return talk;
}

function getFormattedDate(day, month, year) {
    // Day Formatting
    var formattedDate = day + " ";

    // Month Formatting
    switch (month) {
        case "01":
            formattedDate += "January ";
            break;
        case "02":
            formattedDate += "February ";
            break;
        case "03":
            formattedDate += "March ";
            break;
        case "04":
            formattedDate += "April ";
            break;
        case "05":
            formattedDate += "May ";
            break;
        case "06":
            formattedDate += "June ";
            break;
        case "07":
            formattedDate += "July ";
            break;
        case "08":
            formattedDate += "August ";
            break;
        case "09":
            formattedDate += "September ";
            break;
        case "10":
            formattedDate += "October ";
            break;
        case "11":
            formattedDate += "November ";
            break;
        case "12":
            formattedDate += "December ";
            break;
        default:
            console.error("Invalid date");
            break;
    }

    // Year Formatting
    formattedDate += year;
    return formattedDate;
}

// Function taken from https://stackoverflow.com/a/4033310
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

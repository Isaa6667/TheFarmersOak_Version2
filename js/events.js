/* Events list for The Farmers Oak: Google Calendar feed, styled like the announcements.
   Shows upcoming events soonest-first and re-checks every 5 minutes while the page is open. */
const CALENDAR_ID = "614fc96c85713b4855a725b9aebf58152407ac9ee06ecec59893019663c85080@group.calendar.google.com";
const API_KEY = "AIzaSyDe0mWnERL2TyCPAl7Xs2gbo-rezTsfRQg";
const REFRESH_MS = 5 * 60 * 1000;

const eventList = document.getElementById("event-list");
// Optional: data-limit="3" on #event-list shows only the next 3 events (used on the home page).
const EVENT_LIMIT = eventList ? parseInt(eventList.getAttribute("data-limit"), 10) || 0 : 0;

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit"
});

let lastSignature = null;
let hasLoaded = false;

function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

// Calendar descriptions can contain HTML; turn them into plain paragraphs safely.
function plainText(html) {
    const withBreaks = String(html || "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|li)>/gi, "\n\n");
    const doc = new DOMParser().parseFromString(withBreaks, "text/html");
    return (doc.body.textContent || "").trim();
}

function getDate(event) {
    return new Date(event.start.dateTime || event.start.date);
}

function formatDate(event) {
    const start = getDate(event);
    const end = new Date(event.end.dateTime || event.end.date);

    // All-day events end on the following day in Google Calendar.
    if (event.start.date) end.setDate(end.getDate() - 1);

    if (start.toDateString() === end.toDateString()) {
        return dateFormatter.format(start);
    }
    return dateFormatter.format(start) + " to " + dateFormatter.format(end);
}

function formatTime(event) {
    if (event.start.date) return "All day";
    return timeFormatter.format(new Date(event.start.dateTime)) + " – " +
        timeFormatter.format(new Date(event.end.dateTime));
}

function renderEvent(event) {
    const card = makeElement("article", "ann");

    card.appendChild(makeElement("h3", "", event.summary || "Upcoming event"));

    const meta = makeElement("p", "ann-meta");
    const time = document.createElement("time");
    time.dateTime = event.start.dateTime || event.start.date;
    time.textContent = formatDate(event);
    meta.appendChild(time);
    meta.appendChild(document.createTextNode(" · " + formatTime(event)));
    if (event.location) {
        meta.appendChild(document.createTextNode(" · " + event.location));
    }
    card.appendChild(meta);

    plainText(event.description).split(/\n{2,}/).forEach(function (para) {
        para = para.trim();
        if (para) card.appendChild(makeElement("p", "", para));
    });

    if (event.htmlLink) {
        const p = makeElement("p");
        const link = makeElement("a", "event-link", "Event Details");
        link.href = event.htmlLink;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        p.appendChild(link);
        card.appendChild(p);
    }

    return card;
}

async function loadEvents() {
    try {
        const url = new URL(
            "https://www.googleapis.com/calendar/v3/calendars/" +
            encodeURIComponent(CALENDAR_ID) + "/events"
        );

        url.searchParams.set("key", API_KEY);
        url.searchParams.set("singleEvents", "true");
        url.searchParams.set("orderBy", "startTime");
        url.searchParams.set("timeMin", new Date().toISOString());
        url.searchParams.set("maxResults", "20");

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Google Calendar returned " + response.status);
        }

        const data = await response.json();
        const events = (data.items || []).filter(function (e) {
            return e.status !== "cancelled";
        });

        hasLoaded = true;
        if (EVENT_LIMIT) events.splice(EVENT_LIMIT);

        // Skip redrawing if nothing has changed since the last check.
        const signature = JSON.stringify(events.map(function (e) {
            return [e.id, e.updated];
        }));
        if (signature === lastSignature) return;
        lastSignature = signature;

        eventList.replaceChildren();
        eventList.setAttribute("aria-busy", "false");

        if (events.length === 0) {
            eventList.appendChild(makeElement(
                "p", "ann-status",
                "There are no upcoming events scheduled at the moment. Please check back soon."
            ));
            return;
        }

        events.forEach(function (event) {
            eventList.appendChild(renderEvent(event));
        });

    } catch (error) {
        console.error("Unable to load Google Calendar events:", error);

        // Keep whatever is already on screen; only show an error if nothing has loaded.
        if (!hasLoaded) {
            eventList.setAttribute("aria-busy", "false");
            eventList.replaceChildren(makeElement(
                "p", "ann-status",
                "We couldn't load our events right now. Please try again later or email us to ask what's on."
            ));
        }
    }
}

if (eventList) {
    loadEvents();
    setInterval(function () { if (!document.hidden) loadEvents(); }, REFRESH_MS);
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) loadEvents();
    });
}

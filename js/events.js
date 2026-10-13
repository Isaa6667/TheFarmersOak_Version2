
const CALENDAR_ID = "614fc96c85713b4855a725b9aebf58152407ac9ee06ecec59893019663c85080@group.calendar.google.com";
const API_KEY = "AIzaSyDe0mWnERL2TyCPAl7Xs2gbo-rezTsfRQg";

const eventList = document.getElementById("event-list");

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit"
});

function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function getDate(event) {
    return new Date(event.start.dateTime || event.start.date);
}

function formatDate(event) {
    const start = getDate(event);
    const end = new Date(
        event.end.dateTime || event.end.date
    );

    if (event.start.date) {
        end.setDate(end.getDate() - 1);

        if (start.toDateString() === end.toDateString()) {
            return dateFormatter.format(start);
        }

        return dateFormatter.format(start) + " – " +
            dateFormatter.format(end);
    }

    if (start.toDateString() === end.toDateString()) {
        return dateFormatter.format(start);
    }

    return dateFormatter.format(start) + " – " +
        dateFormatter.format(end);
}

function formatTime(event) {
    if (event.start.date) {
        return "All day";
    }

    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);

    return timeFormatter.format(start) + " – " +
        timeFormatter.format(end);
}

function renderEvent(event) {
    const card = makeElement("article", "event-card", "");

    const top = makeElement("div", "event-card-top", "");
    top.appendChild(
        makeElement("p", "event-date", formatDate(event))
    );
    top.appendChild(
        makeElement("h3", "", event.summary || "Upcoming event")
    );

    const body = makeElement("div", "event-card-body", "");

    body.appendChild(
        makeElement("p", "event-time", formatTime(event))
    );

    if (event.location) {
        body.appendChild(
            makeElement("p", "event-description", event.location)
        );
    }

    if (event.description) {
        body.appendChild(
            makeElement("p", "event-description", event.description)
        );
    }

    if (event.htmlLink) {
        const link = makeElement(
            "a",
            "event-link",
            "Event Details"
        );

        link.href = event.htmlLink;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        body.appendChild(link);
    }

    card.appendChild(top);
    card.appendChild(body);

    return card;
}

async function loadEvents() {
    try {
        const now = new Date().toISOString();

        const url = new URL(
            "https://www.googleapis.com/calendar/v3/calendars/" +
            encodeURIComponent(CALENDAR_ID) + "/events"
        );

        url.searchParams.set("key", API_KEY);
        url.searchParams.set("singleEvents", "true");
        url.searchParams.set("orderBy", "startTime");
        url.searchParams.set("timeMin", now);
        url.searchParams.set("maxResults", "20");

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Google Calendar returned " + response.status);
        }

        const data = await response.json();

        eventList.replaceChildren();

        const events = (data.items || []).filter(event =>
            event.status !== "cancelled"
        );

        if (events.length === 0) {
            eventList.appendChild(
                makeElement(
                    "p",
                    "events-status",
                    "There are no upcoming events scheduled at the moment. Please check back soon."
                )
            );
            return;
        }

        events.forEach(event => {
            eventList.appendChild(renderEvent(event));
        });

    } catch (error) {
        console.error("Unable to load Google Calendar events:", error);

        eventList.replaceChildren(
            makeElement(
                "p",
                "events-status",
                "We couldn't load our events right now. Please try again later or check our calendar directly."
            )
        );
    }
}

if (eventList) {
    if (API_KEY === "YOUR_GOOGLE_CALENDAR_API_KEY") {
        eventList.replaceChildren(
            makeElement(
                "p",
                "events-status",
                "The events calendar needs configuring. Please add your Google Calendar API key."
            )
        );
    } else {
        loadEvents();
    }
}

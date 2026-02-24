let currentDate = new Date();
let selectedDate = null;

let events = JSON.parse(localStorage.getItem("events")) || {};

// Render calendar
function renderCalendar() {

    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    const monthYear = document.getElementById("monthYear");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.innerText =
        currentDate.toLocaleString("default", { month: "long" }) +
        " " + year;

    const firstDay = new Date(year, month, 1).getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty slots
    for(let i = 0; i < firstDay; i++) {
        calendar.innerHTML += "<div></div>";
    }

    // Dates
    for(let day = 1; day <= totalDays; day++) {

        const dateKey = `${year}-${month}-${day}`;

        const dateDiv = document.createElement("div");
        dateDiv.innerHTML = `<strong>${day}</strong>`;

        dateDiv.onclick = () => openModal(dateKey);

        if(events[dateKey]) {
            const eventDiv = document.createElement("div");
            eventDiv.className = "event";
            eventDiv.innerText = events[dateKey];
            dateDiv.appendChild(eventDiv);
        }

        calendar.appendChild(dateDiv);
    }
}

// Open modal
function openModal(dateKey) {

    selectedDate = dateKey;

    document.getElementById("eventModal").style.display = "block";
}

// Close modal
function closeModal() {

    document.getElementById("eventModal").style.display = "none";
}

// Save event
function saveEvent() {

    const text = document.getElementById("eventText").value;

    if(text) {

        events[selectedDate] = text;

        localStorage.setItem("events", JSON.stringify(events));

        closeModal();

        renderCalendar();
    }
}

// Month navigation
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Initial render
renderCalendar();
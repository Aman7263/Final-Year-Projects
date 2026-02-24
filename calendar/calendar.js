let currentDate = new Date();
let selectedDate = null;
let selectedViewDate = null;

let events = JSON.parse(localStorage.getItem("events")) || {};

function renderCalendar() {

    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById("monthYear").innerText =
        currentDate.toLocaleString("default", { month: "long" }) + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for(let i = 0; i < firstDay; i++) {
        calendar.innerHTML += "<div></div>";
    }

    for(let day = 1; day <= totalDays; day++) {

        const dateKey = `${year}-${month}-${day}`;
        const dateDiv = document.createElement("div");

        dateDiv.innerHTML = `<strong>${day}</strong>`;
        dateDiv.onclick = () => openModal(dateKey);

        if(events[dateKey]) {

            events[dateKey].forEach((event, index) => {

                const eventDiv = document.createElement("div");
                eventDiv.className = `event ${event.priority}`;
                eventDiv.innerText = event.title;

                eventDiv.onclick = (e) => {
                    e.stopPropagation();
                    openViewModal(dateKey, index);
                };

                dateDiv.appendChild(eventDiv);
            });
        }

        calendar.appendChild(dateDiv);
    }
}

function openModal(dateKey) {
    selectedDate = dateKey;
    document.getElementById("eventModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("eventModal").style.display = "none";
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventRemark").value = "";
}

function saveEvent() {

    const title = document.getElementById("eventTitle").value.trim();
    const remark = document.getElementById("eventRemark").value.trim();
    const priority = document.getElementById("priority").value;

    if(!title) return;

    if(!events[selectedDate]) {
        events[selectedDate] = [];
    }

    events[selectedDate].push({ title, remark, priority });

    localStorage.setItem("events", JSON.stringify(events));

    closeModal();
    renderCalendar();
}

function openViewModal(dateKey, index) {

    selectedViewDate = { dateKey, index };

    const event = events[dateKey][index];

    document.getElementById("viewContent").innerHTML = `
        <p><strong>Title:</strong> ${event.title}</p>
        <p><strong>Remark:</strong> ${event.remark}</p>
        <p><strong>Priority:</strong> ${event.priority}</p>
        <p><strong>Date:</strong> ${dateKey}</p>
    `;

    document.getElementById("viewModal").style.display = "flex";
}

function closeViewModal() {
    document.getElementById("viewModal").style.display = "none";
}

function deleteEvent() {

    const { dateKey, index } = selectedViewDate;

    events[dateKey].splice(index, 1);

    if(events[dateKey].length === 0) {
        delete events[dateKey];
    }

    localStorage.setItem("events", JSON.stringify(events));

    closeViewModal();
    renderCalendar();
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function prevYear() {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    renderCalendar();
}

function nextYear() {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    renderCalendar();
}

/* ===============================
   RESET CALENDAR
================================ */

function resetCalendar(){

    if(!confirm("⚠ Are you sure you want to delete all calendar events?")){
        return;
    }

    // 🔥 Clear Events Object
    events = {};

    // 🔥 Remove from localStorage
    localStorage.removeItem("events");

    // 🔥 Reset Dates
    currentDate = new Date();
    selectedDate = null;
    selectedViewDate = null;

    // 🔥 Close any open modals
    document.getElementById("eventModal").style.display = "none";
    document.getElementById("viewModal").style.display = "none";

    // 🔥 Re-render fresh calendar
    renderCalendar();

    alert("✅ All calendar events have been deleted!");
}

renderCalendar();
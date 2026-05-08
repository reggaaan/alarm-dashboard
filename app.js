let map;

// LOAD DATA (fake API simulation)
function loadStatus() {
    document.getElementById("flood").innerText =
        Math.random() > 0.7 ? "HIGH" : "SAFE";

    document.getElementById("fire").innerText =
        Math.random() > 0.8 ? "DANGER" : "NORMAL";

    document.getElementById("quake").innerText =
        Math.random() > 0.9 ? "ACTIVE" : "STABLE";
}

// MAP INIT
function initMap() {
    map = L.map('map').setView([14.58, 121.17], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    }).addTo(map);

    // sample marker
    L.marker([14.58, 121.17])
        .addTo(map)
        .bindPopup("Cainta Monitoring Center");
}

// CHART
function initChart() {
    const ctx = document.getElementById("chart");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            datasets: [{
                label: "Disaster Activity",
                data: [1, 3, 2, 5, 4]
            }]
        }
    });
}

// ALERT BUTTON
function triggerAlert() {
    alert("🚨 Emergency Alert Triggered!");
}

// RUN EVERYTHING
window.onload = function () {
    loadStatus();
    initMap();
    initChart();

    setInterval(loadStatus, 3000);
};

// initialize map
const map = L.map('map').setView([14.6, 121.0], 5); // Philippines view

// map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

// elements
const alertEl = document.getElementById("alertLevel");
const floodEl = document.getElementById("flood");
const fireEl = document.getElementById("fire");
const quakeEl = document.getElementById("quake");

// 🌊 FLOOD SIMULATION
function updateFlood() {
    const level = Math.random() * 10; // water level

    floodEl.innerText = `Water Level: ${level.toFixed(2)} m`;

    if (level > 7) {
        floodEl.className = "danger";
    } else if (level > 4) {
        floodEl.className = "warning";
    } else {
        floodEl.className = "safe";
    }
}

// 🔥 FIRE SIMULATION
function updateFire() {
    const temp = Math.random() * 100; // temperature

    fireEl.innerText = `Temp: ${temp.toFixed(1)} °C`;

    if (temp > 70) {
        fireEl.className = "danger";
    } else if (temp > 40) {
        fireEl.className = "warning";
    } else {
        fireEl.className = "safe";
    }
}

function updateGlobalAlert() {
    const floodText = floodEl.className;
    const fireText = fireEl.className;
    const quakeText = quakeEl.className;

    if (floodText === "danger" || fireText === "danger" || quakeText === "danger") {
        alertEl.innerText = "EMERGENCY";
        alertEl.className = "danger";
    }
    else if (floodText === "warning" || fireText === "warning" || quakeText === "warning") {
        alertEl.innerText = "WARNING";
        alertEl.className = "warning";
    }
    else {
        alertEl.innerText = "NORMAL";
        alertEl.className = "safe";
    }
}

// fetch earthquakes
async function getEarthquakes() {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

    const response = await fetch(url);
    const data = await response.json();

    const quakes = data.features;

    // clear old markers (simple reset)
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    if (quakes.length > 0) {
        const latest = quakes[0];
        const magnitude = latest.properties.mag;
        const place = latest.properties.place;

        quakeEl.innerText = `M ${magnitude} - ${place}`;

        if (magnitude >= 5.5) {
            quakeEl.className = "danger";
        } else if (magnitude >= 4.0) {
            quakeEl.className = "warning";
        } else {
            quakeEl.className = "safe";
        }
    }

    // add markers to map
    quakes.forEach(q => {
        const coords = q.geometry.coordinates;
        const lng = coords[0];
        const lat = coords[1];
        const mag = q.properties.mag;

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`Magnitude: ${mag}`);
    });
}

// run + auto refresh
getEarthquakes();
updateFlood();
updateFire();
updateGlobalAlert();
setInterval(() => {
    getEarthquakes();
    updateFlood();
    updateFire();
    updateGlobalAlert();
}, 10000);

// simulate alert function
function triggerAlert() {
    // Toggle statuses
    if (floodEl.innerText.startsWith('SAFE') || floodEl.innerText.startsWith('Water')) {
        floodEl.innerText = 'WARNING';
        floodEl.className = 'warning';
    } else {
        floodEl.innerText = 'SAFE';
        floodEl.className = 'safe';
    }

    if (fireEl.innerText.startsWith('SAFE') || fireEl.innerText.startsWith('Temp')) {
        fireEl.innerText = 'DANGER';
        fireEl.className = 'danger';
    } else {
        fireEl.innerText = 'SAFE';
        fireEl.className = 'safe';
    }

    // For quake, set to ALERT
    quakeEl.innerText = 'ALERT';
    quakeEl.className = 'danger';
}

if (alertEl.innerText === "EMERGENCY") {
    new Audio("https://www.soundjay.com/buttons/beep-01a.mp3").play();
}
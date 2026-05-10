
/* ================= STATE ================= */

let dataInterval = null;
let map = null;
let chart = null;

let alertCooldown = false;

let recipients = JSON.parse(localStorage.getItem("recipients")) || [];
let messages = JSON.parse(localStorage.getItem("messages")) || [];

/* ================= LOGIN ================= */

function login(){

    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();

    if(u === "admin" && p === "1234"){

        document.getElementById("loginPage").style.display = "none";
        document.getElementById("dashboardSection").style.display = "flex";

        initMap();
        initChart();

        renderRecipients();
        renderMessages();

        fetchSensorData();

        if(dataInterval) clearInterval(dataInterval);
        dataInterval = setInterval(fetchSensorData, 3000);

    } else {
        document.getElementById("loginError").innerText = "Wrong login";
    }
}

function logout(){
    location.reload();
}

/* ================= NAV ================= */

function showSection(id){

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none";
    });

    const target = document.getElementById(id);
    if(target) target.style.display = "block";
}

/* ================= SENSOR DATA ================= */

function fetchSensorData(){

    fetch("/data")
    .then(res => res.json())
    .then(data => {

        updateDashboard(data);
        handleAlerts(data);

    })
    .catch(err => console.log("Sensor error:", err));
}

/* ================= DASHBOARD UPDATE ================= */

function updateDashboard(data){

    setText("flood", data.flood);
    setText("fire", data.fire);
    setText("quake", data.quake);

    setText("floodStatus", data.flood);
    setText("fireStatus", data.fire);
    setText("quakeStatus", data.quake);

    setText("waterLevel", data.water || "--");
    setText("rainLevel", data.rain || "--");

    setText("smokeLevel", data.smoke || "--");
    setText("tempLevel", data.temp || "--");

    setText("magnitude", data.magnitude || "--");
    setText("vibration", data.vibration || "--");

    setText("floodRisk", getRisk(data.flood));
    setText("fireRisk", getRisk(data.fire));
    setText("quakeRisk", getRisk(data.quake));
}

/* ================= ALERT SYSTEM ================= */

function handleAlerts(data){

    if(alertCooldown) return;

    if(data.flood === "HIGH"){
        triggerAlert("🌊 FLOOD WARNING");
        addLog("FLOOD WARNING");
    }

    if(data.fire === "DANGER"){
        triggerAlert("🔥 FIRE ALERT");
        addLog("FIRE ALERT");
    }

    if(data.quake === "ACTIVE"){
        triggerAlert("🌍 EARTHQUAKE ALERT");
        addLog("EARTHQUAKE ALERT");
    }
}

function triggerAlert(msg){

    const box = document.getElementById("alertPopup");
    const text = document.getElementById("alertMessage");

    if(!box || !text) return;

    box.style.display = "block";
    text.innerText = msg;

    alertCooldown = true;

    setTimeout(() => {
        alertCooldown = false;
    }, 5000);
}

function closeAlert(){
    document.getElementById("alertPopup").style.display = "none";
}

/* ================= MAP ================= */

function initMap(){

    if(map) return;

    map = L.map("map").setView([14.5823, 121.1763], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Cainta Control"
    }).addTo(map);

    L.marker([14.5823, 121.1763])
    .addTo(map)
    .bindPopup("Cainta Command Center");
}

/* ================= CHART ================= */

function initChart(){

    if(chart) return;

    chart = new Chart(document.getElementById("chart"), {
        type: "line",
        data: {
            labels: ["Mon","Tue","Wed","Thu","Fri"],
            datasets: [{
                label: "Sensor Activity",
                data: [1,2,3,2,5]
            }]
        }
    });
}

/* ================= RECIPIENTS ================= */

function addRecipient(){

    const name = val("recipientName");
    const role = val("recipientRole");
    const contact = val("recipientContact");

    if(!name || !role || !contact){
        alert("Complete all fields");
        return;
    }

    recipients.push({name, role, contact});

    localStorage.setItem("recipients", JSON.stringify(recipients));

    renderRecipients();
}

function renderRecipients(){

    const box = document.getElementById("recipientList");
    if(!box) return;

    box.innerHTML = "";

    recipients.forEach((r, i) => {
        box.innerHTML += `
        <div class="card">
            <b>${r.name}</b><br>
            ${r.role}<br>
            ${r.contact}
        </div>`;
    });
}

/* ================= CHAT ================= */

function sendMessage(){

    const name = val("chatName");
    const text = val("chatInput");

    if(!name || !text){
        alert("Complete fields");
        return;
    }

    messages.push({name, text});

    localStorage.setItem("messages", JSON.stringify(messages));

    renderMessages();
}

function renderMessages(){

    const box = document.getElementById("chatMessages");
    if(!box) return;

    box.innerHTML = "";

    messages.forEach(m => {
        box.innerHTML += `
        <div class="card">
            <b>${m.name}</b>: ${m.text}
        </div>`;
    });

    box.scrollTop = box.scrollHeight;
}

/* ================= LOGS ================= */

function addLog(msg){

    const box = document.getElementById("logsContainer");
    if(!box) return;

    const time = new Date().toLocaleTimeString();

    box.innerHTML += `
        <div class="card">
            🚨 ${time} - ${msg}
        </div>
    `;
}

/* ================= HELPERS ================= */

function setText(id, value){
    const el = document.getElementById(id);
    if(el) el.innerText = value;
}

function val(id){
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

function getRisk(value){
    if(value === "HIGH" || value === "DANGER" || value === "ACTIVE") return "RED";
    if(value === "WARNING") return "YELLOW";
    return "GREEN";
}

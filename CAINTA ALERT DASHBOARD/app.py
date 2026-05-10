from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# fake sensor storage (we will replace later with Arduino)
sensor_data = {
    "flood": "SAFE",
    "fire": "NORMAL",
    "quake": "STABLE"
}

@app.route("/")
def home():
    return render_template("index.html")

# SEND SENSOR DATA FROM ARDUINO / PI HERE
@app.route("/update", methods=["POST"])
def update():
    global sensor_data
    sensor_data = request.json
    return jsonify({"status":"ok"})

# DASHBOARD FETCHES DATA HERE
@app.route("/data")
def data():
    return jsonify(sensor_data)

if __name__ == "__main__":
    app.run(debug=True)
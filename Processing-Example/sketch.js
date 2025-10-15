let h = 100; // Height
let s = 190; // Stretch
let r = 90; // Rotation
let interval = 10;
let speed = 10000; // mm per minute
let suctionOn = false;
let serialOptions = { baudRate: 115200 };
let serial;
var connect = false;
let isConnected = false;
let selector;
let msg = "";
// these are the maximum values allowed with the robot 
const Constrains = {
    minHeight: -50,
    maxHeight: 150,
    minStretch: 125,
    maxStretch: 330,
    maxAngle: 180
};

function setup() {
    createCanvas(800, 800);
    // Setup Web Serial using serial.js
    serial = new Serial();
    serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
    serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
    serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
    serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);
    selector = new PolarPositionSelector();
}

function draw() {
    background(255);
    noStroke();
    selector.update();
    fill(0)
    text("drag and drop the circle to position the UARM. Scroll up or down to change height", 20, 20);
    text("Press enter to connect over serial", 20, 40);
    text("Press space to use suction gripper", 20, 60);
    fill(255,0,0);
    text(msg, 20, 80);
}

function keyPressed() {
    if (key === ' ') {
        setSuction(true);
    }
    if (keyCode === ENTER || keyCode === RETURN) {
        connectPort()
    }

}


function keyReleased() {
    if (key === ' ') {
        setSuction(false);
    }
}

function setPolarPosition(st = s, ro = r, he = h, spd = speed) {
    console.log(`G2201 S${st} R${ro} H${he} F${spd}`);
    serial.writeLine(`G2201 S${st} R${ro} H${he} F${spd}`);
    return false;
}

function setSuction(on) {
    let command = `M2231 V${Number(on)}`;
    if (suctionOn !== on) {
        serial.writeLine(command);
        suctionOn = on;
    }
}


////////////////
// Serial
////////////////




function checkConnection() {
    // Check if connect button is pressed and the connection is not established
    if (connect && !isConnected) {
        serial.connectAndOpen(null, serialOptions).then(() => {
            console.log("Connected");
            isConnected = true;
          }).catch(error => {
            console.log(error);
          });

    } else if (!connect && isConnected) {
        closePort();
        isConnected = false;
    }
}

async function connectPort() {
    if (!serial.isOpen()) {
        await serial.connectAndOpen(null, serialOptions);
    } else {
        serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);
    }



}

async function closePort() {
    if (serial.isOpen()) {
        await serial.close();
    }
}

function onSerialErrorOccurred(eventSender, error) {
    console.log("onSerialErrorOccurred", error);
    msg = error;
}

function onSerialConnectionOpened(eventSender) {
    console.log("onSerialConnectionOpened");
   msg = "Serial connection opened successfully";
}


function onSerialConnectionClosed(eventSender) {
    console.log("onSerialConnectionClosed");
     msg = "onSerialConnectionClosed" ;
}


function onSerialDataReceived(eventSender, newData) {
    console.log("onSerialDataReceived", newData);
    msg =  "onSerialDataReceived: " + newData;
}


//////////////
// Robot GUI
///////////////


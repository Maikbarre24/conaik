const qrSection = document.getElementById("qr-section");
const bluetoothSection = document.getElementById("bluetooth-section");
const manualSection = document.getElementById("manual-section");
const menuSection = document.getElementById("menu-section");

let connectedDevice = null; // Bluetooth device
let commandCharacteristic = null; // Bluetooth characteristic for sending commands

// Mostra la sezione corretta
function showSection(section) {
  document.querySelectorAll(".container > div").forEach((div) => {
    div.classList.add("hidden");
  });
  section && section.classList.remove("hidden");
}

// QR Code
const qrReader = new Html5Qrcode("qr-reader");
function startQrScanning() {
  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      document.getElementById("qr-output").textContent = decodedText;
      console.log("QR Code Scansionato:", decodedText);
      qrReader.stop();
      showSection(menuSection);
    },
    (error) => {
      console.error("Errore nella scansione QR:", error);
    }
  );
}

// Connessione Bluetooth
async function connectBluetooth() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ["00001800-0000-1000-8000-00805f9b34fb"], // Modifica con il servizio Bluetooth del tuo dispositivo
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("00001800-0000-1000-8000-00805f9b34fb"); // Modifica con il tuo servizio
    commandCharacteristic = await service.getCharacteristic("00002a00-0000-1000-8000-00805f9b34fb"); // Modifica con la caratteristica per inviare comandi

    connectedDevice = device;
    document.getElementById("bluetooth-status").textContent = `Stato: Connesso a ${device.name}`;
    console.log("Dispositivo connesso:", device.name);

    showSection(menuSection);
  } catch (error) {
    console.error("Errore Bluetooth:", error);
    alert("Connessione Bluetooth fallita!");
  }
}

// Connessione manuale
document.getElementById("manual-connect").addEventListener("click", () => {
  const machineNumber = document.getElementById("machine-number").value;
  if (machineNumber === "12345") {
    console.log("Connessione manuale avvenuta");
    showSection(menuSection);
  } else {
    alert("Numero macchina non valido!");
  }
});

// Invia comando
async function sendCommand(command) {
  if (!commandCharacteristic) {
    alert("Non sei connesso a un dispositivo!");
    return;
  }
  const encoder = new TextEncoder();
  const commandBuffer = encoder.encode(command);
  try {
    await commandCharacteristic.writeValue(commandBuffer);
    console.log(`Comando "${command}" inviato`);
    document.getElementById("menu-status").textContent = `Hai selezionato: ${command}`;
  } catch (error) {
    console.error("Errore nell'invio del comando:", error);
  }
}

// Eventi
document.getElementById("qr-method").addEventListener("click", () => {
  showSection(qrSection);
  startQrScanning();
});

document.getElementById("bluetooth-method").addEventListener("click", () => {
  showSection(bluetoothSection);
  connectBluetooth();
});

document.getElementById("manual-method").addEventListener("click", () => {
  showSection(manualSection);
});

document.querySelectorAll(".product-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const product = e.target.getAttribute("data-product");
    sendCommand(product);
  });
});

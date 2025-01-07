let qrReader;
let connectedDevice = null;
let gattServer = null;
let commandCharacteristic = null;

// Mostra una sezione e nasconde le altre
function showSection(section) {
  document.querySelectorAll(".container > div").forEach((div) => {
    div.classList.add("hidden");
  });
  section.classList.remove("hidden");
}

// Scansione QR Code
function startQrScanning() {
  console.log("Inizio scansione QR...");
  qrReader = new Html5Qrcode("qr-reader");
  qrReader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      console.log(`QR Code scansionato: ${decodedText}`);
      document.getElementById("qr-output").textContent = decodedText;
      qrReader.stop();
      connectToDistributor(decodedText);
    },
    (error) => {
      console.warn("Errore durante la scansione QR:", error);
    }
  );
}

// Interrompi la scansione QR
document.getElementById("stop-qr").addEventListener("click", () => {
  if (qrReader) {
    qrReader.stop().catch((err) => console.error("Errore durante l'interruzione:", err));
    showSection(document.getElementById("connection-section"));
  }
});

// Connessione tramite QR Code
function connectToDistributor(distributorId) {
  console.log(`Connesso al distributore con ID: ${distributorId}`);
  document.getElementById("action-status").textContent = `Connesso al distributore ${distributorId}`;
  showSection(document.getElementById("distributor-section"));
}

// Connessione Bluetooth
async function startBluetoothConnection() {
  try {
    console.log("Tentativo di connessione Bluetooth...");
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true, // Connessione generica
      optionalServices: [], // Opzionale: inserire UUID del servizio se necessario
    });

    gattServer = await device.gatt.connect();
    connectedDevice = device;

    document.getElementById("bluetooth-status").textContent = `Stato: Connesso a ${device.name}`;
    console.log(`Dispositivo connesso: ${device.name}`);
    showSection(document.getElementById("distributor-section"));
  } catch (error) {
    console.error("Errore nella connessione Bluetooth:", error);
    alert("Connessione Bluetooth fallita!");
  }
}

// Invio comando
async function sendCommand(command) {
  if (!connectedDevice) {
    alert("Devi connetterti prima!");
    return;
  }

  console.log(`Comando "${command}" inviato.`);
  document.getElementById("action-status").textContent = `Comando "${command}" inviato con successo!`;
}

// Eventi
document.getElementById("start-qr").addEventListener("click", () => {
  showSection(document.getElementById("qr-section"));
  startQrScanning();
});

document.getElementById("start-bluetooth").addEventListener("click", () => {
  showSection(document.getElementById("bluetooth-section"));
});

document.getElementById("bluetooth-connect").addEventListener("click", startBluetoothConnection);

document.querySelectorAll(".action-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    sendCommand(action);
  });
});

// Avvio iniziale
showSection(document.getElementById("connection-section"));

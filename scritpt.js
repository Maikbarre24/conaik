// Elementi HTML
const qrSection = document.getElementById('qr-section');
const bluetoothSection = document.getElementById('bluetooth-section');
const manualSection = document.getElementById('manual-section');
const menuSection = document.getElementById('menu-section');
const machineCode = document.getElementById('machine-code').textContent;

// QR Code
function generateQRCode() {
  const qrData = `machine_id=${machineCode}`;
  QRCode.toCanvas(document.getElementById('qrcode'), qrData, (error) => {
    if (error) console.error(error);
    console.log('QR Code generato:', qrData);
  });
}

// Mostra sezione basata sulla scelta
document.getElementById('qr-method').addEventListener('click', () => {
  qrSection.style.display = 'block';
  bluetoothSection.style.display = 'none';
  manualSection.style.display = 'none';
});

document.getElementById('bluetooth-method').addEventListener('click', () => {
  qrSection.style.display = 'none';
  bluetoothSection.style.display = 'block';
  manualSection.style.display = 'none';
});

document.getElementById('manual-method').addEventListener('click', () => {
  qrSection.style.display = 'none';
  bluetoothSection.style.display = 'none';
  manualSection.style.display = 'block';
});

// Bluetooth Connessione
async function connectBluetooth() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['machine_service']
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('machine_service');
    const characteristic = await service.getCharacteristic('command_characteristic');

    console.log('Bluetooth connesso:', device.name);
    bluetoothSection.style.display = 'none';
    menuSection.style.display = 'block';
  } catch (error) {
    console.error('Errore Bluetooth:', error);
  }
}

document.getElementById('connect-bluetooth').addEventListener('click', connectBluetooth);

// Connessione Manuale
document.getElementById('connect-manual').addEventListener('click', () => {
  const inputNumber = document.getElementById('machine-number').value;
  if (inputNumber === machineCode) {
    console.log('Connessione manuale avvenuta con successo');
    manualSection.style.display = 'none';
    menuSection.style.display = 'block';
  } else {
    alert('Numero macchina non valido');
  }
});

// Invio comandi
document.querySelectorAll('.product-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const command = e.target.getAttribute('data-command');
    console.log('Comando inviato:', command);
  });
});

// Genera QR Code
generateQRCode();

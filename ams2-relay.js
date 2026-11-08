const dgram = require('dgram');
const http = require('http');
const fs = require('fs');
const path = require('path');

process.on('uncaughtException', (e) => {
  console.error('FATAL:', e.message);
  console.error('The relay crashed. Close this window and restart.');
});

let HTML;
try {
  HTML = fs.readFileSync(path.join(__dirname, 'brake-throttle-trace.html'));
} catch (e) {
  console.error('Cannot read brake-throttle-trace.html:', e.message);
  process.exit(1);
}

const clients = [];
let sock;
let packetCount = 0;

function processPacket(buf) {
  packetCount++;
  if (packetCount <= 3) {
    console.log('Packet #' + packetCount + ': len=' + buf.length + ' type=' + (buf.length > 10 ? buf[10] : '?'));
    if (packetCount === 1) {
      // Dump bytes 10-30 to find throttle/brake offsets
      const slice = buf.slice(10, 35);
      console.log('Bytes[10..34]: ' + Array.from(slice).map(b => b.toString(16).padStart(2,'0')).join(' '));
      console.log('Floats@12: ' + buf.readFloatLE(12).toFixed(2) + ' ' + buf.readFloatLE(16).toFixed(2) + ' ' + buf.readFloatLE(20).toFixed(2));
    }
  }
  if (buf.length < 46) return;
  const ptype = buf[10];
  if (ptype !== 0 && ptype !== 255) return;
  const throttle = buf[13] / 255 * 100;
  const brake = buf[14] / 255 * 100;
  const rpm = buf.readUInt16LE(40);
  const speed = buf.readFloatLE(36);
  const gear = buf[45] & 0x1F;
  clients.forEach((c) => {
    try {
      c.write('data: ' + JSON.stringify({
        t: Math.round(throttle * 10) / 10,
        b: Math.round(brake * 10) / 10,
        rpm: rpm,
        spd: Math.round(speed * 3.6 * 10) / 10,
        gear: gear,
      }) + '\n\n');
    } catch(e) {}
  });
}

sock = dgram.createSocket('udp4');
sock.on('error', (err) => console.error('UDP ERROR:', err.message));
sock.on('message', processPacket);
sock.bind(5606, '0.0.0.0', () => console.log('UDP listening on :5606'));

// --- HTTP + SSE server ---
const PORT = 15608;
const srv = http.createServer((req, res) => {
  if (req.url === '/pedals') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    clients.push(res);
    res.on('close', () => {
      const i = clients.indexOf(res);
      if (i >= 0) clients.splice(i, 1);
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML);
  }
});
srv.listen(PORT, () => console.log('HTTP serving on :' + PORT));

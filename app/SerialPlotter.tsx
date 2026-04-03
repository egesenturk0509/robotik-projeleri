import React, { useState, useEffect, useRef } from 'react';

interface SerialPlotterProps {
  onBack: () => void;
}

export default function SerialPlotter({ onBack }: SerialPlotterProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [baudRate, setBaudRate] = useState(9600);
  const [command, setCommand] = useState("");
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataPoints = useRef<number[]>([]);

  const handleConnect = async () => {
    try {
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate });
      portRef.current = port;
      setIsConnected(true);
      readData();
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        alert("Bağlantı hatası!");
      }
    }
  };

  const readData = async () => {
    const decoder = new TextDecoder();
    let buffer = "";
    while (portRef.current && portRef.current.readable) {
      const reader = portRef.current.readable.getReader();
    readerRef.current = reader;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value);
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          
        for (const line of lines) {
          const num = parseFloat(line.trim());
          if (!isNaN(num)) {
            dataPoints.current.push(num);
            if (dataPoints.current.length > 100) dataPoints.current.shift();
            drawPlot();
          }
        }
      }
      } catch (err) {
        console.error(err);
      } finally {
        reader.releaseLock();
      }
    }
  };

  const drawPlot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    
    // Izgara çizimi
    ctx.strokeStyle = "#eee";
    ctx.beginPath();
    for(let i=0; i<width; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i,height); }
    for(let i=0; i<height; i+=50) { ctx.moveTo(0,i); ctx.lineTo(width,i); }
    ctx.stroke();

    // Veri çizimi
    if (dataPoints.current.length < 2) return;
    ctx.strokeStyle = "#0078d7";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const max = Math.max(...dataPoints.current, 100);
    const min = Math.min(...dataPoints.current, 0);
    const range = max - min || 1;

    dataPoints.current.forEach((val, i) => {
      const x = (i / (dataPoints.current.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  const handleDisconnect = async () => {
    if (readerRef.current) await readerRef.current.cancel();
    if (portRef.current) await portRef.current.close();
    portRef.current = null;
    setIsConnected(false);
  };

  return (
    <div className="serial-monitor">
      <div className="serial-header">
        <div className="serial-header-left">
          <h2>📈 Seri Çizici</h2>
          {!isConnected ? (
            <button className="btn-connect" onClick={handleConnect}>Bağlan</button>
          ) : (
            <button className="btn-disconnect" onClick={handleDisconnect}>Bağlantıyı Kes</button>
          )}
        </div>
        <button className="btn-back btn-back-static" onClick={onBack}>⬅ Geri</button>
      </div>

      <div style={{ background: 'white', padding: '15px', display: 'flex', justifyContent: 'center', flex: 1, minHeight: '400px' }}>
        <canvas ref={canvasRef} width={800} height={500} style={{ border: '1px solid #ddd', borderRadius: '8px', width: '100%', height: 'auto', maxHeight: '100%' }} />
      </div>

      <div className="serial-footer">
        <div className="serial-footer-controls">
          <label htmlFor="baudSelectPlotter" className="baud-label">Baud Rate:</label>
          <select 
            id="baudSelectPlotter"
            className="baud-select" 
            value={baudRate}
            aria-label="Baud hızı"
            onChange={(e) => setBaudRate(Number(e.target.value))}
            disabled={isConnected}
          >
            <option value="1200">1200</option>
            <option value="2400">2400</option>
            <option value="4800">4800</option>
            <option value="9600">9600</option>
            <option value="19200">19200</option>
            <option value="38400">38400</option>
            <option value="57600">57600</option>
            <option value="115200">115200</option>
          </select>
        </div>
        <input 
          type="text" 
          className="command-input" 
          placeholder="Komut gönder..." 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <button className="btn-send" onClick={() => setCommand("")} disabled={!isConnected}>Gönder</button>
        <button className="btn-clear btn-download" onClick={() => dataPoints.current = []}>Temizle</button>
      </div>
    </div>
  );
}
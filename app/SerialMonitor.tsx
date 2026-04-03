import React, { useState, useEffect, useRef } from 'react';

interface SerialMonitorProps {
  onBack: () => void;
}

export default function SerialMonitor({ onBack }: SerialMonitorProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [baudRate, setBaudRate] = useState(9600);
  const [logs, setLogs] = useState("");
  const [command, setCommand] = useState("");
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Otomatik aşağı kaydır
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [logs]);

  const handleConnect = async () => {
    try {
      // @ts-ignore - Web Serial API
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate });
      portRef.current = port;
      setIsConnected(true);
      setLogs(prev => prev + "\n[SİSTEM] USB Bağlantısı Kuruldu.\n");
      readData();
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        // Kullanıcı seçim yapmadan pencereyi kapattıysa hata verme
        return;
      }
      console.error(err);
      alert("Bağlantı hatası! Tarayıcınızın Web Serial API desteklediğinden ve izin verdiğinizden emin olun.");
    }
  };

  const readData = async () => {
    const decoder = new TextDecoder();
    while (portRef.current && portRef.current.readable) {
      const reader = portRef.current.readable.getReader();
      readerRef.current = reader;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          setLogs(prev => prev + decoder.decode(value));
        }
      } catch (error) {
        console.error(error);
      } finally {
        reader.releaseLock();
      }
    }
  };

  const handleDisconnect = async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
    }
    if (portRef.current) {
      await portRef.current.close();
    }
    portRef.current = null;
    setIsConnected(false);
    setLogs(prev => prev + "\n[SİSTEM] Bağlantı Kesildi.\n");
  };

  const downloadAs = (format: string) => {
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seri_log.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendCommand = async () => {
    if (!portRef.current || !command) return;
    try {
      const encoder = new TextEncoder();
      const writer = portRef.current.writable.getWriter();
      await writer.write(encoder.encode(command + "\n"));
      writer.releaseLock();
      setLogs(prev => prev + `\n> ${command}\n`);
      setCommand("");
    } catch (err) {
      console.error("Komut gönderme hatası:", err);
    }
  };

  return (
    <div className="serial-monitor">
      <div className="serial-header">
        <div className="serial-header-left">
          <h2>📟 USB Seri Monitör</h2>
          {!isConnected ? (
            <button className="btn-connect" onClick={handleConnect}>Bağlan</button>
          ) : (
            <button className="btn-disconnect" onClick={handleDisconnect}>Bağlantıyı Kes</button>
          )}
        </div>
        <button className="btn-back btn-back-static" onClick={onBack}>⬅ Geri</button>
      </div>

      <div className="command-area">
        <input 
          type="text" 
          className="command-input" 
          placeholder="Cihaza gönderilecek komutu yazın..." 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
        />
        <button className="btn-send" onClick={handleSendCommand} disabled={!isConnected}>Gönder</button>
      </div>

      <textarea 
        ref={outputRef}
        className="serial-output" 
        readOnly 
        value={logs}
        placeholder="Veri bekleniyor..."
      />

      <div className="format-bar">
        <span>Çıktıyı İndir:</span>
        <button onClick={() => downloadAs('png')} className="btn-fmt">PNG</button>
        <button onClick={() => downloadAs('jpg')} className="btn-fmt">JPG</button>
        <button onClick={() => downloadAs('pdf')} className="btn-fmt">PDF</button>
        <button onClick={() => downloadAs('rtf')} className="btn-fmt">RTF</button>
        <button onClick={() => downloadAs('docx')} className="btn-fmt">DOCX</button>
      </div>

      <div className="serial-footer">
        <div className="serial-footer-controls">
          <label htmlFor="baudSelect" className="baud-label">Baud Rate:</label>
          <select 
            id="baudSelect"
            className="baud-select" 
            value={baudRate}
            aria-label="Baud hızı seçimi"
            onChange={(e) => setBaudRate(Number(e.target.value))}
            disabled={isConnected}
          >
            <option value="9600">9600</option>
            <option value="19200">19200</option>
            <option value="38400">38400</option>
            <option value="57600">57600</option>
            <option value="115200">115200</option>
          </select>
        </div>
        <button className="btn-clear btn-download" onClick={() => setLogs("")}>Temizle</button>
      </div>
    </div>
  );
}
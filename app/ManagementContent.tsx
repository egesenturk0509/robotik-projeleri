import React, { useState } from 'react';
import { PROJECTS } from '../projects'; 
import { Project } from '../project';   
import Header from './Header';
import ProjectGrid from './ProjectGrid';
import ProjectDetail from './ProjectDetail';
import AccountSettings from './AccountSettings';
import SerialMonitor from './SerialMonitor';
import SerialPlotter from './SerialPlotter';

interface ManagementContentProps {
  onLogout: () => void;
}

export default function ManagementContent({ onLogout }: ManagementContentProps) {
  const [view, setView] = useState<'grid' | 'detail' | 'account' | 'serial' | 'plotter'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailForm, setShowEmailInput] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState({
    username: 'ege.senturk',
    displayName: 'Ege Şentürk'
  });

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setView('detail');
  };

  const handleBack = () => {
    setView('grid');
    setSelectedProject(null);
  };

  const handleOpenAccount = () => {
    setView('account');
  };

  const handleOpenSerial = () => {
    setView('serial');
  };

  const handleOpenPlotter = () => {
    setView('plotter');
  };

  const handleSaveAccount = (newData: { username: string; password?: string; displayName: string }) => {
    setUserData({ username: newData.username, displayName: newData.displayName });
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // --- E-POSTA GÖNDERME FONKSİYONU ---
  const handleConfirmSendEmail = async () => {
    if (!emailInput || !selectedProject) return;

    setIsSending(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, projectName: selectedProject.title }),
      });

      if (res.ok) {
        alert("Proje detayları başarıyla uçuruldu! 🕊️");
        setShowEmailInput(false);
        setEmailInput('');
      } else {
        alert("Bir hata oluştu. API Key'i Vercel'e eklediğinden emin misin? 🦜");
      }
    } catch (error) {
      alert("Bağlantı hatası oluştu!");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <Header 
        displayName={userData.displayName} 
        onOpenAccount={handleOpenAccount} 
      />
      
      <div className="container">
        {view === 'grid' && (
          <div className="serial-trigger-container" style={{ gap: '15px' }}>
            <button className="btn-serial-trigger" onClick={handleOpenSerial}>
              <div className="icon">🖥️</div>
              <span>Seri Monitör</span>
            </button>
            <button className="btn-serial-trigger" style={{ borderColor: '#0078d7' }} onClick={handleOpenPlotter}>
              <div className="icon">📈</div>
              <span>Seri Çizici</span>
            </button>
          </div>
        )}

        {view === 'grid' && (
          <ProjectGrid 
            projects={PROJECTS} 
            onSelect={handleProjectSelect} 
            onOpenSerial={handleOpenSerial}
          />
        )}

        {view === 'detail' && selectedProject && (
          <div className="detail-view-wrapper">
            <div style={{ marginBottom: '15px', textAlign: 'right' }}>
              <button className="btn-mail" onClick={() => setShowEmailInput(true)}>
                📧 E-Posta (Mail) Gönder
              </button>
            </div>

            {showEmailForm && (
              <div className="email-overlay">
                <div className="email-modal-box">
                  <h2>E-posta adresinizi yazınız</h2>
                  <input 
                    type="email"
                    className="email-modal-input"
                    placeholder="örnek@mail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <div className="email-modal-buttons">
                    <button className="btn-modal-send" onClick={handleConfirmSendEmail} disabled={isSending}>
                      {isSending ? "Gönderiliyor..." : "E-Posta (Mail) Gönder"}
                    </button>
                    <button className="btn-modal-cancel" onClick={() => setShowEmailInput(false)}>İptal</button>
                  </div>
                </div>
              </div>
            )}
            
            <ProjectDetail 
              project={selectedProject} 
              onBack={handleBack} 
              onDownload={downloadFile}
            />
          </div>
        )}

        {view === 'account' && (
          <AccountSettings 
            userData={userData} 
            onBack={handleBack} 
            onLogout={onLogout} 
            onSave={handleSaveAccount}
          />
        )}

        {view === 'serial' && (
          <SerialMonitor 
            onBack={handleBack}
          />
        )}

        {view === 'plotter' && (
          <SerialPlotter onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
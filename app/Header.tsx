import React from 'react';

interface HeaderProps {
  displayName: string;
  onOpenAccount: () => void;
}

export default function Header({ displayName, onOpenAccount }: HeaderProps) {
  return (
    <header className="header" style={{ textAlign: 'center', position: 'relative' }}>
      <h1 className="header-name">Robotik Mühendisliği Projeleri</h1>
      <div className="header-sub">{displayName}</div>
      <div className="header-content">
        <div className="user-info" style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button className="btn-account" onClick={onOpenAccount}>Hesabım</button>
        </div>
      </div>
    </header>
  );
}
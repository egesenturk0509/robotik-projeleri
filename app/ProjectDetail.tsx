import React from 'react';
import { Project } from '../project';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onDownload: (filename: string, content: string) => void;
}

export default function ProjectDetail({ project, onBack, onDownload }: ProjectDetailProps) {
  return (
    <div className="detail-view">
      <button className="btn-back" onClick={onBack}>⬅ Geri</button>
      <h1>{project.icon} {project.title}</h1>
      <p>{project.description}</p>
      <h3 className="mt-30">📦 Gerekli Malzemeler</h3>
      <ul>{project.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
      <h3 className="mt-30">🔌 Bağlantı Şeması</h3>
      <div className="code-area code-area-light">{project.connections}</div>
      <h3 className="mt-30">💻 Arduino Kodu <button className="btn-download" onClick={() => onDownload(`${project.id}_kod.ino`, project.code)}>İndir</button></h3>
      <div className="code-area">{project.code}</div>
    </div>
  );
}
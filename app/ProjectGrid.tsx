import React from 'react';
import { Project } from '../project';

interface ProjectGridProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onOpenSerial: () => void;
}

export default function ProjectGrid({ projects, onSelect, onOpenSerial }: ProjectGridProps) {
  return (
    <div className="grid">
      {projects.map((proj) => (
        <div key={proj.id} className="card" onClick={() => onSelect(proj)}>
          <div className="icon-box">{proj.icon}</div>
          <h3>{proj.title}</h3>
        </div>
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { PROJECTS } from './projects';
import { Project } from './project';
import Header from './app/Header';
import ProjectGrid from './app/ProjectGrid';
import ProjectDetail from './app/ProjectDetail';

interface ManagementContentProps {
  onLogout: () => void;
}

export default function ManagementContent({ onLogout }: ManagementContentProps) {
  const [view, setView] = useState<'grid' | 'detail'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setView('detail');
  };

  const handleBack = () => {
    setView('grid');
    setSelectedProject(null);
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

  return (
    <div>
      <Header onLogout={onLogout} />
      <div className="container">
        {view === 'grid' ? (
          <ProjectGrid 
            projects={PROJECTS} 
            onSelect={handleProjectSelect} 
          />
        ) : (
          selectedProject && (
            <ProjectDetail 
              project={selectedProject} 
              onBack={handleBack} 
              onDownload={downloadFile}
            />
          )
        )}
      </div>
    </div>
  );
}
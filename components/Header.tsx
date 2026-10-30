import React from 'react';

export const Header: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <header
    className="bg-brand-primary shadow-md"
    style={{ paddingTop: 'env(safe-area-inset-top)' }}
  >
    <div className={compact ? 'px-4 py-3' : 'container mx-auto px-6 py-5 lg:px-8'}>
      <h1 className={`font-bold text-white tracking-tight ${compact ? 'text-lg' : 'text-2xl lg:text-3xl'}`}>
        {compact ? 'FotoProf · Retratos IA' : 'Generador de Retratos Profesionales IA'}
      </h1>
      {!compact && <p className="text-brand-light mt-1">Crea tu foto de perfil corporativa perfecta</p>}
    </div>
  </header>
);

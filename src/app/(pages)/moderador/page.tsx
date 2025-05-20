'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from './componenetes/Sidebar';
import ModeradorTodas from './componenetes/ModeradorTodas';
import ModeradorAprovadas from './componenetes/ModeradorAprovadas';
import ModeradorRejeitadas from './componenetes/ModeradorRejeitadas';

export default function ModeradorPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'pendentes' | 'aprovadas' | 'rejeitadas'>('pendentes');

  useEffect(() => {
    if (tabParam === 'aprovadas') {
      setActiveTab('aprovadas');
    } else if (tabParam === 'rejeitadas') {
      setActiveTab('rejeitadas');
    } else {
      setActiveTab('pendentes');
    }
  }, [tabParam]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar activeTab={activeTab} />

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'pendentes' && <ModeradorTodas />}
          {activeTab === 'aprovadas' && <ModeradorAprovadas />}
          {activeTab === 'rejeitadas' && <ModeradorRejeitadas />}
        </div>
      </div>
    </div>
  );
}

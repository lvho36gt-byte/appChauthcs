/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeModal } from './components/WelcomeModal';
import { LabModule } from './components/LabModule';
import { SimulationsModule } from './components/SimulationsModule';
import { PhysiAssistantModule } from './components/PhysiAssistantModule';
import { GamesModule } from './components/GamesModule';
import { StemModule } from './components/StemModule';
import { ImpactAssessmentModule } from './components/ImpactAssessmentModule';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentJourneyModule } from './components/StudentJourneyModule';
import { DossierModule } from './components/DossierModule';
import { User, UserRole } from './types/physics';
import { Bot, Sparkles, School } from 'lucide-react';

const DEFAULT_TEACHER: User = {
  id: 'user-teacher-01',
  name: 'Cô Đỗ Thị Giáng Châu',
  email: 'giangchau.thcschuvanan@edu.vn',
  role: 'teacher',
  school: 'THCS Chu Văn An - Đồng Nai',
  badges: ['Giáo viên sáng tạo', 'Chuyên gia Vật lí AI', 'Nhà nghiên cứu thực nghiệm'],
  createdAt: new Date().toISOString()
};

const DEFAULT_STUDENT: User = {
  id: 'user-student-01',
  name: 'Nguyễn Văn An',
  email: 'an.nv@chuvanan.edu.vn',
  studentCode: 'HS-7A1-01',
  role: 'student',
  school: 'THCS Chu Văn An',
  classId: 'class-7a1',
  className: '7A1',
  badges: ['Nhà khám phá', 'Nhà thực nghiệm'],
  createdAt: new Date().toISOString()
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('physi_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_TEACHER;
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    return !localStorage.getItem('physi_user');
  });

  const [activeNav, setActiveNav] = useState<string>('lab');
  const [physiInitialTopic, setPhysiInitialTopic] = useState<string>('');
  const [textZoom, setTextZoom] = useState<number>(1.0);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('physi_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const handleSelectRole = async (
    role: UserRole | 'trial',
    name?: string,
    studentCode?: string,
    classCode?: string
  ) => {
    if (role === 'teacher') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'teacher' })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(DEFAULT_TEACHER);
        }
      } catch (err) {
        setCurrentUser(DEFAULT_TEACHER);
      }
      setActiveNav('lab');
    } else if (role === 'student') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'student',
            name: name || 'Nguyễn Văn An',
            studentCode: studentCode || 'HS-7A1-01',
            classCode: classCode || 'KHTN7A1'
          })
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser({
            ...DEFAULT_STUDENT,
            name: name || DEFAULT_STUDENT.name,
            studentCode: studentCode || DEFAULT_STUDENT.studentCode
          });
        }
      } catch (err) {
        setCurrentUser({
          ...DEFAULT_STUDENT,
          name: name || DEFAULT_STUDENT.name,
          studentCode: studentCode || DEFAULT_STUDENT.studentCode
        });
      }
      setActiveNav('lab');
    } else {
      // Trial Mode
      setCurrentUser({
        id: `user-trial-${Date.now()}`,
        name: 'Khách dùng thử',
        email: 'trial@chuvanan.edu.vn',
        role: 'student',
        school: 'THCS Chu Văn An - Đồng Nai',
        className: '7A1 (Trải nghiệm)',
        badges: ['Nhà khám phá'],
        createdAt: new Date().toISOString()
      });
      setActiveNav('lab');
    }

    setShowWelcomeModal(false);
  };

  const handleUpdateUser = async (updated: Partial<User>) => {
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    try {
      await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const openPhysiWithTopic = (topic: string) => {
    setPhysiInitialTopic(topic);
    setActiveNav('physi');
  };

  return (
    <div
      style={{ fontSize: `${textZoom * 100}%` }}
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        highContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Header */}
      <Header
        currentUser={currentUser}
        activeNav={activeNav}
        onNavigate={nav => setActiveNav(nav)}
        onOpenRoleModal={() => setShowWelcomeModal(true)}
        onUpdateUser={handleUpdateUser}
        textZoom={textZoom}
        setTextZoom={setTextZoom}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeNav === 'lab' && (
          <LabModule
            currentUser={currentUser}
            onOpenPhysiChat={openPhysiWithTopic}
          />
        )}

        {activeNav === 'simulations' && <SimulationsModule />}

        {activeNav === 'physi' && (
          <PhysiAssistantModule
            currentUser={currentUser}
            initialTopic={physiInitialTopic}
          />
        )}

        {activeNav === 'games' && <GamesModule currentUser={currentUser} />}

        {activeNav === 'stem' && <StemModule currentUser={currentUser} />}

        {activeNav === 'impact' && (
          <ImpactAssessmentModule currentUser={currentUser} />
        )}

        {activeNav === 'dossier' && <DossierModule />}

        {activeNav === 'teacher' && (
          <TeacherDashboard currentUser={currentUser} />
        )}

        {activeNav === 'journey' && (
          <StudentJourneyModule
            currentUser={currentUser}
            onNavigateToLab={() => setActiveNav('lab')}
            onNavigateToGames={() => setActiveNav('games')}
          />
        )}
      </main>

      {/* Floating Quick Button to Talk to Physi AI */}
      {activeNav !== 'physi' && (
        <button
          onClick={() => setActiveNav('physi')}
          className="fixed bottom-6 right-6 z-30 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-xl shadow-cyan-600/30 flex items-center gap-2.5 transition-all hover:scale-105 no-print"
        >
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="text-xs font-bold hidden sm:inline">Hỏi Thầy PHYSI AI</span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="font-bold text-slate-800">
              VẬT LÍ THỰC CHỨNG AI – PHYSICS EVIDENCE LAB AI 2026
            </div>
            <div>
              Cô Đỗ Thị Giáng Châu • Trường THCS Chu Văn An • Đồng Nai
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Ứng dụng Giáo dục Khoa học Tự nhiên THCS • Chuẩn hóa theo chương trình GDPT 2018
          </div>
        </div>
      </footer>

      {/* Welcome Screen Modal */}
      {showWelcomeModal && (
        <WelcomeModal onSelectRole={handleSelectRole} />
      )}
    </div>
  );
}

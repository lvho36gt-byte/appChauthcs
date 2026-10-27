import React, { useState } from 'react';
import {
  Atom, BookOpen, Layers, Bot, Trophy, Hammer, BarChart2,
  Award, User as UserIcon, Settings, Sun, Moon, Type, ChevronDown,
  LogOut, Upload
} from 'lucide-react';
import { User, UserRole } from '../types/physics';

interface HeaderProps {
  currentUser: User;
  activeNav: string;
  onNavigate: (nav: string) => void;
  onOpenRoleModal: () => void;
  onUpdateUser: (updated: Partial<User>) => void;
  textZoom: number;
  setTextZoom: (updater: (prev: number) => number) => void;
  highContrast: boolean;
  setHighContrast: (updater: (prev: boolean) => boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeNav,
  onNavigate,
  onOpenRoleModal,
  onUpdateUser,
  textZoom,
  setTextZoom,
  highContrast,
  setHighContrast
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [teacherNameInput, setTeacherNameInput] = useState<string>(currentUser.name);
  const [avatarPreview, setAvatarPreview] = useState<string>(currentUser.avatar || '');

  const navItems = [
    { id: 'lab', label: 'Phòng Thí Nghiệm AI', icon: BookOpen },
    { id: 'simulations', label: 'Mô Phỏng 2D', icon: Layers },
    { id: 'physi', label: 'Trợ Lý PHYSI', icon: Bot },
    { id: 'games', label: 'Đấu Trường Trò Chơi', icon: Trophy },
    { id: 'stem', label: 'Xưởng STEM', icon: Hammer },
    { id: 'impact', label: 'Đánh Giá Tác Động', icon: BarChart2 },
    { id: 'dossier', label: 'Hồ Sơ Dự Thi', icon: Award },
    ...(currentUser.role === 'teacher'
      ? [{ id: 'teacher', label: 'Quản Lý Giáo Viên', icon: UserIcon }]
      : [{ id: 'journey', label: 'Tiến Bộ Của Em', icon: UserIcon }]
    )
  ];

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateUser({ name: teacherNameInput, avatar: avatarPreview });
    setShowSettingsModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      {/* Top Branding Banner */}
      <div className="bg-[#123A73] text-white px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#12B9E8] animate-ping"></span>
            <span className="font-bold text-[#12B9E8]">VẬT LÍ THỰC CHỨNG AI</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-amber-300 font-semibold italic">
              &quot;Thí nghiệm thật – Dữ liệu thật – Khám phá cùng AI&quot;
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-200 hidden md:inline">
              Cô Đỗ Thị Giáng Châu • THCS Chu Văn An, Đồng Nai
            </span>

            {/* Accessibility: Zoom Text Scale */}
            <div className="flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-lg border border-slate-700/50">
              <button
                onClick={() => setTextZoom(z => Math.max(0.9, Number((z - 0.05).toFixed(2))))}
                title="Giảm cỡ chữ"
                className="px-1.5 py-0.5 hover:text-[#12B9E8] font-bold text-[11px]"
              >
                A-
              </button>
              <span className="text-[10px] text-slate-400 font-mono">{Math.round(textZoom * 100)}%</span>
              <button
                onClick={() => setTextZoom(z => Math.min(1.25, Number((z + 0.05).toFixed(2))))}
                title="Tăng cỡ chữ"
                className="px-1.5 py-0.5 hover:text-[#12B9E8] font-bold text-[11px]"
              >
                A+
              </button>
            </div>

            {/* Accessibility: High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(c => !c)}
              title={highContrast ? 'Chế độ tương phản thường' : 'Chế độ tương phản cao'}
              className={`p-1 rounded-md text-xs font-semibold ${highContrast ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
            >
              {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => onNavigate('lab')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#123A73] to-[#12B9E8] flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base leading-tight tracking-tight flex items-center gap-1.5">
                <span>VẬT LÍ THỰC CHỨNG AI</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-cyan-100 text-cyan-800 rounded font-bold">2026</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Physics Evidence Lab THCS Chu Văn An
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Cài đặt tài khoản & Ảnh đại diện"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenRoleModal}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-all shadow-2xs"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover border border-slate-300"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <div className="font-bold text-slate-900 leading-none truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-700 font-medium leading-tight capitalize">
                  {currentUser.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Teacher Profile / Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Cài Đặt Hồ Sơ Giáo Viên / Học Sinh</h3>
            <p className="text-xs text-slate-500">
              Giáo viên có thể tải ảnh đại diện của mình từ thiết bị máy tính cá nhân.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên hiển thị:</label>
                <input
                  type="text"
                  value={teacherNameInput}
                  onChange={e => setTeacherNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tải ảnh đại diện cá nhân:</label>
                <div className="flex items-center gap-3">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <UserIcon className="w-6 h-6" />
                    </div>
                  )}

                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-2 border border-slate-300">
                    <Upload className="w-4 h-4" />
                    <span>Chọn tệp ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

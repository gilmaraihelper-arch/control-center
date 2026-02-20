"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Palette, 
  Bell, 
  Database, 
  Link2,
  Save,
  CheckCircle2,
  Clock,
  Moon,
  Sun,
  Monitor
} from "lucide-react";

interface ConfigData {
  profile: {
    name: string;
    email: string;
  };
  appearance: {
    theme: "dark" | "light" | "auto";
    primaryColor: string;
  };
  pomodoro: {
    workTime: number;
    breakTime: number;
  };
  notifications: {
    enabled: boolean;
    serviceAlerts: boolean;
    taskReminders: boolean;
  };
  integrations: {
    chefExperienceUrl: string;
    openClawUrl: string;
  };
}

const DEFAULT_CONFIG: ConfigData = {
  profile: {
    name: "Gilmar",
    email: "gilmar@example.com",
  },
  appearance: {
    theme: "dark",
    primaryColor: "violet",
  },
  pomodoro: {
    workTime: 25,
    breakTime: 5,
  },
  notifications: {
    enabled: true,
    serviceAlerts: true,
    taskReminders: true,
  },
  integrations: {
    chefExperienceUrl: "http://localhost:3000",
    openClawUrl: "http://localhost:18789",
  },
};

const COLORS = [
  { value: "violet", label: "Violeta", class: "bg-violet-500" },
  { value: "cyan", label: "Ciano", class: "bg-cyan-500" },
  { value: "emerald", label: "Esmeralda", class: "bg-emerald-500" },
  { value: "amber", label: "Âmbar", class: "bg-amber-500" },
  { value: "rose", label: "Rosa", class: "bg-rose-500" },
];

export default function SettingsPage() {
  const [config, setConfig] = useState<ConfigData>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "pomodoro" | "notifications" | "integrations">("profile");

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("cc-settings");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {
        setConfig(DEFAULT_CONFIG);
      }
    }
    setLoading(false);
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    localStorage.setItem("cc-settings", JSON.stringify(config));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateConfig = (section: keyof ConfigData, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Carregando configurações...</div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "pomodoro", label: "Pomodoro", icon: Clock },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "integrations", label: "Integrações", icon: Link2 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500/20 to-gray-500/20 border border-slate-500/30 flex items-center justify-center">
            <Settings className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">Configurações</h1>
            <p className="text-sm text-slate-500">Personalize seu Control Center</p>
          </div>
        </div>

        <button
          onClick={saveConfig}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            saved
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar"}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-500/10 text-violet-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-6">
            {/* Profile */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-400" />
                  Perfil
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Nome</label>
                    <input
                      type="text"
                      value={config.profile.name}
                      onChange={(e) => updateConfig("profile", "name", e.target.value)}
                      className="w-full bg-slate-800 border border-white/[0.06] rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={config.profile.email}
                      onChange={(e) => updateConfig("profile", "email", e.target.value)}
                      className="w-full bg-slate-800 border border-white/[0.06] rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {config.profile.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{config.profile.name}</p>
                    <p className="text-sm text-slate-500">{config.profile.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-violet-400" />
                  Aparência
                </h2>

                <div>
                  <label className="block text-sm text-slate-400 mb-3">Tema</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "dark", label: "Escuro", icon: Moon },
                      { value: "light", label: "Claro", icon: Sun },
                      { value: "auto", label: "Automático", icon: Monitor },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => updateConfig("appearance", "theme", theme.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                          config.appearance.theme === theme.value
                            ? "border-violet-500/50 bg-violet-500/10"
                            : "border-white/[0.06] hover:border-white/[0.1]"
                        }`}
                      >
                        <theme.icon className={`w-5 h-5 ${
                          config.appearance.theme === theme.value ? "text-violet-400" : "text-slate-400"
                        }`} />
                        <span className={`text-sm ${
                          config.appearance.theme === theme.value ? "text-violet-400" : "text-slate-400"
                        }`}>{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-3">Cor Primária</label>
                  <div className="flex gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateConfig("appearance", "primaryColor", color.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          config.appearance.primaryColor === color.value
                            ? "border-white/[0.2] bg-white/[0.06]"
                            : "border-white/[0.06] hover:border-white/[0.1]"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full ${color.class}`} />
                        <span className="text-sm text-slate-300">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pomodoro */}
            {activeTab === "pomodoro" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-400" />
                  Pomodoro
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Tempo de Foco (minutos)</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={config.pomodoro.workTime}
                      onChange={(e) => updateConfig("pomodoro", "workTime", parseInt(e.target.value) || 25)}
                      className="w-full bg-slate-800 border border-white/[0.06] rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Tempo de Pausa (minutos)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={config.pomodoro.breakTime}
                      onChange={(e) => updateConfig("pomodoro", "breakTime", parseInt(e.target.value) || 5)}
                      className="w-full bg-slate-800 border border-white/[0.06] rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400">
                    Ciclo: <span className="text-slate-200">{config.pomodoro.workTime} min</span> de foco + <span className="text-slate-200">{config.pomodoro.breakTime} min</span> de pausa
                  </p>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-violet-400" />
                  Notificações
                </h2>

                {[
                  { key: "enabled", label: "Notificações Ativadas", desc: "Receber notificações do sistema" },
                  { key: "serviceAlerts", label: "Alertas de Serviços", desc: "Notificar quando serviços ficam offline" },
                  { key: "taskReminders", label: "Lembretes de Tarefas", desc: "Lembrar de tarefas pendentes" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-200">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => updateConfig("notifications", item.key, !config.notifications[item.key as keyof typeof config.notifications])}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        config.notifications[item.key as keyof typeof config.notifications]
                          ? "bg-violet-500"
                          : "bg-slate-700"
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                        config.notifications[item.key as keyof typeof config.notifications]
                          ? "left-7"
                          : "left-1"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Integrations */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-violet-400" />
                  Integrações
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🍳</span>
                      <div>
                        <p className="font-medium text-slate-200">ChefExperience</p>
                        <p className="text-sm text-slate-500">Marketplace de gastronomia</p>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={config.integrations.chefExperienceUrl}
                      onChange={(e) => updateConfig("integrations", "chefExperienceUrl", e.target.value)}
                      placeholder="http://localhost:3000"
                      className="w-full bg-slate-900 border border-white/[0.06] rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-lg border border-violet-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <p className="font-medium text-slate-200">OpenClaw</p>
                        <p className="text-sm text-slate-500">Plataforma de agentes de IA</p>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={config.integrations.openClawUrl}
                      onChange={(e) => updateConfig("integrations", "openClawUrl", e.target.value)}
                      placeholder="http://localhost:18789"
                      className="w-full bg-slate-900 border border-white/[0.06] rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

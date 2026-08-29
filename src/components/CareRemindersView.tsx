import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Trash2, Clock, Droplets, Scissors, Stethoscope, Sparkles } from 'lucide-react';
import { CareReminder, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface CareRemindersViewProps {
  reminders: CareReminder[];
  onAddReminder: (reminder: Omit<CareReminder, 'id' | 'createdAt'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  language: LanguageCode;
  onNavigateHome: () => void;
}

export const CareRemindersView: React.FC<CareRemindersViewProps> = ({
  reminders,
  onAddReminder,
  onToggleComplete,
  onDeleteReminder,
  language,
}) => {
  const t = translations[language];
  const [showAddForm, setShowAddForm] = useState(false);

  const [organismName, setOrganismName] = useState('');
  const [organismType, setOrganismType] = useState<'plant' | 'animal'>('plant');
  const [actionType, setActionType] = useState<'watering' | 'fertilizing' | 'medication' | 'vet_checkup' | 'grooming' | 'repotting' | 'custom'>('watering');
  const [intervalDays, setIntervalDays] = useState(7);
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organismName.trim()) return;

    const nextDue = Date.now() + intervalDays * 24 * 60 * 60 * 1000;

    onAddReminder({
      organismName: organismName.trim(),
      organismType,
      actionType,
      frequencyDays: intervalDays,
      nextDue,
      isCompleted: false,
      notes: notes.trim() || undefined,
    });

    setOrganismName('');
    setNotes('');
    setShowAddForm(false);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'watering':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'fertilizing':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'grooming':
        return <Scissors className="w-4 h-4 text-pink-600" />;
      case 'vet_checkup':
      case 'medication':
        return <Stethoscope className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    if (language === 'ar') {
      switch (action) {
        case 'watering': return 'سقاية وترطيب';
        case 'fertilizing': return 'تسميد وتغذية';
        case 'medication': return 'دواء وفيتامينات';
        case 'vet_checkup': return 'فحص بيطري / استشارة';
        case 'grooming': return 'تمشيط وعناية';
        case 'repotting': return 'تغيير الأصيص والتربة';
        default: return 'تذكير مخصص';
      }
    }
    return action.replace('_', ' ');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{t.careReminders}</h2>
              <p className="text-xs text-slate-500 font-normal">
                {language === 'ar' ? 'جدولة آلية للسقاية والتسميد والرعاية البيطرية' : 'Automated scheduling for watering, feeding & care'}
              </p>
            </div>
          </div>
        </div>

        <button
          id="reminder-add-new-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? t.cancel : t.addNewReminder}</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t.scheduleCareTask}
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.specimenPetName}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'ar' ? 'مثال: نبتة المونستيرا، قط شيرازي' : 'e.g. Monstera Deliciosa, Persian Cat'}
                value={organismName}
                onChange={(e) => setOrganismName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.organismCategory}
              </label>
              <select
                value={organismType}
                onChange={(e) => setOrganismType(e.target.value as 'plant' | 'animal')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
              >
                <option value="plant">{t.plantSpecimen}</option>
                <option value="animal">{t.animalPet}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.careActivity}
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
              >
                <option value="watering">💧 {t.wateringRoutine}</option>
                <option value="fertilizing">🌱 {t.foliageFertilizing}</option>
                <option value="medication">💊 {t.medicationSupplements}</option>
                <option value="vet_checkup">🩺 {t.vetCheckup}</option>
                <option value="grooming">✂️ {t.groomingBrushing}</option>
                <option value="repotting">🪴 {t.soilRepotting}</option>
                <option value="custom">🔔 {t.customReminder}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.repeatInterval} ({t.days})
              </label>
              <input
                type="number"
                min={1}
                max={365}
                value={intervalDays}
                onChange={(e) => setIntervalDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.customNotesOptional}
            </label>
            <input
              type="text"
              placeholder={language === 'ar' ? 'مثال: فحص رطوبة التربة أولاً، استخدام ماء مفلتر' : 'e.g. Check soil moisture first, use filtered water'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white shadow-2xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {t.saveReminder}
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">{t.noActiveReminders}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 font-normal">
              {t.noRemindersDesc}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              {t.createFirstReminder}
            </button>
          </div>
        ) : (
          reminders.map((rem) => {
            const isDue = rem.nextDue <= Date.now();
            const dueDate = new Date(rem.nextDue);

            return (
              <div
                key={rem.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  rem.isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isDue
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    id={`toggle-complete-${rem.id}`}
                    onClick={() => onToggleComplete(rem.id)}
                    className={`mt-0.5 p-1 rounded-full border transition-colors ${
                      rem.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 text-transparent hover:border-emerald-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rem.organismName}</span>
                      <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        {getActionIcon(rem.actionType)}
                        <span className="capitalize">{getActionLabel(rem.actionType)}</span>
                      </span>
                      {isDue && !rem.isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase border border-amber-300 animate-pulse">
                          {t.dueNow}
                        </span>
                      )}
                    </div>

                    {rem.notes && (
                      <p className="text-xs text-slate-600 mt-1 font-normal">{rem.notes}</p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {language === 'ar'
                          ? `الموعد القادم: ${dueDate.toLocaleDateString('ar-EG')} (كل ${rem.frequencyDays} أيام)`
                          : `Next: ${dueDate.toLocaleDateString()} (${rem.frequencyDays}d cycle)`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    id={`delete-reminder-${rem.id}`}
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

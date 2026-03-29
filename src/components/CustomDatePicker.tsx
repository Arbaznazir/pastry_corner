import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
}

export default function CustomDatePicker({ value, onChange, minDate, placeholder = 'Select Date' }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Set initial month to value, minDate, or today
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) return new Date(value + 'T12:00:00Z');
    if (minDate) return new Date(minDate + 'T12:00:00Z');
    return new Date();
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDateClick = (day: number) => {
    const currentDateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (minDate && currentDateStr < minDate) return;
    
    onChange(currentDateStr);
    setIsOpen(false);
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const displayDate = value ? new Date(value + 'T12:00:00Z').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full bg-zinc-900/50 border ${isOpen ? 'border-gold-500 shadow-[0_0_15px_rgba(197,160,89,0.15)]' : 'border-white/10'} rounded-xl px-5 py-4 cursor-pointer transition-all duration-300 group`}
      >
        <span className={`text-sm font-light ${value ? 'text-white' : 'text-zinc-500'}`}>
          {displayDate || placeholder}
        </span>
        <CalendarDaysIcon className={`w-5 h-5 ${isOpen ? 'text-gold-500' : 'text-zinc-500 group-hover:text-gold-600'} transition-colors`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-3 p-6 bg-zinc-950/95 border border-gold-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-2xl w-full sm:w-[320px] backdrop-blur-xl transform-gpu will-change-transform origin-top animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <button onClick={(e) => {e.preventDefault(); prevMonth();}} className="p-2 text-zinc-400 hover:text-gold-500 transition-colors rounded-full hover:bg-zinc-900">
              <ChevronLeftIcon className="w-4 h-4 stroke-[2]" />
            </button>
            <span className="font-serif text-white tracking-widest uppercase text-sm">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={(e) => {e.preventDefault(); nextMonth();}} className="p-2 text-zinc-400 hover:text-gold-500 transition-colors rounded-full hover:bg-zinc-900">
              <ChevronRightIcon className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-3 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <span key={day} className="text-[9px] font-sans tracking-widest text-gold-600/70 uppercase">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 gap-x-1">
            {blanks.map(b => <div key={`blank-${b}`} className="h-9 w-9" />)}
            {days.map(day => {
              const currentDateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isDisabled = minDate ? currentDateStr < minDate : false;
              const isSelected = value === currentDateStr;

              return (
                <div key={day} className="flex justify-center items-center">
                  <button
                    onClick={(e) => { e.preventDefault(); !isDisabled && handleDateClick(day); }}
                    disabled={isDisabled}
                    className={`
                      h-8 w-8 rounded-full text-xs font-light flex items-center justify-center transition-all duration-300
                      ${isDisabled ? 'text-zinc-800 cursor-not-allowed' : 'hover:bg-zinc-800 text-zinc-300 cursor-pointer'}
                      ${isSelected ? '!bg-gold-600 !text-black font-medium shadow-[0_0_15px_rgba(197,160,89,0.5)] scale-110' : ''}
                    `}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
          
          {value && (
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
              <button 
                onClick={(e) => { e.preventDefault(); onChange(''); setIsOpen(false); }}
                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                Clear Date
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PeriodFilterProps {
  onPeriodChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

interface PredefinedPeriod {
  label: string;
  value: string;
  getRange: () => { start: Date; end: Date };
}

const predefinedPeriods: PredefinedPeriod[] = [
  {
    label: 'Últimos 7 dias',
    value: '7days',
    getRange: () => ({ start: subDays(new Date(), 7), end: new Date() })
  },
  {
    label: 'Últimos 30 dias',
    value: '30days',
    getRange: () => ({ start: subDays(new Date(), 30), end: new Date() })
  },
  {
    label: 'Últimos 90 dias',
    value: '90days',
    getRange: () => ({ start: subDays(new Date(), 90), end: new Date() })
  },
  {
    label: 'Este mês',
    value: 'thisMonth',
    getRange: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) })
  },
  {
    label: 'Mês passado',
    value: 'lastMonth',
    getRange: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    }
  },
  {
    label: 'Este ano',
    value: 'thisYear',
    getRange: () => ({ start: startOfYear(new Date()), end: endOfYear(new Date()) })
  }
];

const PeriodFilter: React.FC<PeriodFilterProps> = ({ onPeriodChange, className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [showDropdown, setShowDropdown] = useState(false);
  const [customRange, setCustomRange] = useState({
    start: '',
    end: ''
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setShowDropdown(false);
    setShowCustomRange(false);

    if (period === 'custom') {
      setShowCustomRange(true);
      return;
    }

    const selectedPeriodData = predefinedPeriods.find(p => p.value === period);
    if (selectedPeriodData) {
      const { start, end } = selectedPeriodData.getRange();
      onPeriodChange(start, end);
    }
  };

  const handleCustomRangeApply = () => {
    if (customRange.start && customRange.end) {
      const startDate = new Date(customRange.start);
      const endDate = new Date(customRange.end);
      
      if (startDate <= endDate) {
        onPeriodChange(startDate, endDate);
        setShowDropdown(false);
      }
    }
  };

  const getCurrentPeriodLabel = () => {
    if (selectedPeriod === 'custom' && customRange.start && customRange.end) {
      return `${format(new Date(customRange.start), 'dd/MM/yyyy')} - ${format(new Date(customRange.end), 'dd/MM/yyyy')}`;
    }
    
    const period = predefinedPeriods.find(p => p.value === selectedPeriod);
    return period?.label || 'Selecione um período';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getCurrentPeriodLabel()}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {predefinedPeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodSelect(period.value)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-terracota/10 text-terracota dark:bg-terracota/20'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {period.label}
              </button>
            ))}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            <button
              onClick={() => handlePeriodSelect('custom')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedPeriod === 'custom'
                  ? 'bg-terracota/10 text-terracota dark:bg-terracota/20'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Período personalizado
            </button>

            {showCustomRange && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Data inicial
                    </label>
                    <input
                      type="date"
                      value={customRange.start}
                      onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-terracota focus:border-terracota"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Data final
                    </label>
                    <input
                      type="date"
                      value={customRange.end}
                      onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-terracota focus:border-terracota"
                    />
                  </div>
                  <button
                    onClick={handleCustomRangeApply}
                    disabled={!customRange.start || !customRange.end}
                    className="w-full px-3 py-2 text-sm bg-terracota text-white rounded-lg hover:bg-terracota/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;
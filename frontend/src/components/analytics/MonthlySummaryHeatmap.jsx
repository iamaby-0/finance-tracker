import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Baseline normalized sample/default intensity matrices
const DEFAULT_HEATMAP = {
  expenses: [
    { month: 'Jan', amount: 14000, level: 1 },
    { month: 'Feb', amount: 16000, level: 2 },
    { month: 'Mar', amount: 18000, level: 2 },
    { month: 'Apr', amount: 20000, level: 3 },
    { month: 'May', amount: 19000, level: 2 },
    { month: 'Jun', amount: 22000, level: 3 },
    { month: 'Jul', amount: 21000, level: 3 },
    { month: 'Aug', amount: 24000, level: 4 },
    { month: 'Sep', amount: 23000, level: 3 },
    { month: 'Oct', amount: 22000, level: 3 },
    { month: 'Nov', amount: 21000, level: 3 },
    { month: 'Dec', amount: 20000, level: 2 }
  ],
  income: [
    { month: 'Jan', amount: 24000, level: 1 },
    { month: 'Feb', amount: 30000, level: 2 },
    { month: 'Mar', amount: 27000, level: 2 },
    { month: 'Apr', amount: 32000, level: 3 },
    { month: 'May', amount: 34000, level: 3 },
    { month: 'Jun', amount: 38000, level: 3 },
    { month: 'Jul', amount: 36000, level: 3 },
    { month: 'Aug', amount: 45000, level: 4 },
    { month: 'Sep', amount: 39000, level: 3 },
    { month: 'Oct', amount: 44000, level: 4 },
    { month: 'Nov', amount: 38000, level: 3 },
    { month: 'Dec', amount: 32000, level: 2 }
  ],
  savings: [
    { month: 'Jan', amount: 10000, level: 1 },
    { month: 'Feb', amount: 14000, level: 2 },
    { month: 'Mar', amount: 9000, level: 1 },
    { month: 'Apr', amount: 12000, level: 2 },
    { month: 'May', amount: 15000, level: 3 },
    { month: 'Jun', amount: 16000, level: 3 },
    { month: 'Jul', amount: 15000, level: 3 },
    { month: 'Aug', amount: 21000, level: 4 },
    { month: 'Sep', amount: 16000, level: 3 },
    { month: 'Oct', amount: 22000, level: 4 },
    { month: 'Nov', amount: 17000, level: 3 },
    { month: 'Dec', amount: 12000, level: 2 }
  ]
};

export default function MonthlySummaryHeatmap({
  data = null,
  selectedPeriod = 'This Year',
  onPeriodChange
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const heatmapData = data || DEFAULT_HEATMAP;

  // Background intensity mapping
  const getCellColor = (metric, level) => {
    if (metric === 'Expenses') {
      switch (level) {
        case 4:
          return 'bg-[#FF667A] border-[#FF667A]/50';
        case 3:
          return 'bg-[#CC4456] border-[#FF667A]/30';
        case 2:
          return 'bg-[#7A2B35] border-[#FF667A]/20';
        default:
          return 'bg-[#3A181D] border-[#FF667A]/15';
      }
    }
    if (metric === 'Income') {
      switch (level) {
        case 4:
          return 'bg-[#35E9A0] border-[#35E9A0]/50';
        case 3:
          return 'bg-[#20A771] border-[#35E9A0]/30';
        case 2:
          return 'bg-[#146043] border-[#35E9A0]/20';
        default:
          return 'bg-[#0E3526] border-[#35E9A0]/15';
      }
    }
    // Savings (Teal / Emerald)
    switch (level) {
      case 4:
        return 'bg-[#20D6C7] border-[#20D6C7]/50';
      case 3:
        return 'bg-[#15968B] border-[#20D6C7]/30';
      case 2:
        return 'bg-[#105650] border-[#20D6C7]/20';
      default:
        return 'bg-[#0B332F] border-[#20D6C7]/15';
    }
  };

  const rows = [
    { id: 'Expenses', label: 'Expenses', cells: heatmapData.expenses },
    { id: 'Income', label: 'Income', cells: heatmapData.income },
    { id: 'Savings', label: 'Savings', cells: heatmapData.savings }
  ];

  return (
    <div className="rounded-2xl bg-[#121E22] border border-[#24363B] p-5 flex flex-col justify-between h-full shadow-sm relative">
      {/* Header Row: Title & Period Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-[#F1F5F4] tracking-tight">
          Monthly Summary
        </h3>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18272C] border border-[#24363B] text-xs font-medium text-[#F1F5F4] hover:border-[#35E9A0]/50 transition cursor-pointer"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#71848A] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#35E9A0]' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in duration-100">
              {['This Year', '2026', '2025'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    if (onPeriodChange) onPeriodChange(p);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                    selectedPeriod === p
                      ? 'text-[#35E9A0] bg-[#15372F] font-semibold'
                      : 'text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Grid Table */}
      <div className="overflow-x-auto scrollbar-thin pb-2">
        <div className="min-w-[460px]">
          {/* 3 Metric Rows */}
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center gap-2">
                {/* Metric Label */}
                <span className="w-16 text-xs font-medium text-[#A5B4B8] flex-shrink-0">
                  {row.label}
                </span>

                {/* 12 Month Rectangles */}
                <div className="grid grid-cols-12 gap-1.5 flex-1">
                  {row.cells.map((cell, idx) => {
                    const colorClass = getCellColor(row.id, cell.level);
                    const isHovered =
                      hoveredCell?.metric === row.id && hoveredCell?.month === cell.month;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() =>
                          setHoveredCell({
                            metric: row.id,
                            month: cell.month,
                            amount: cell.amount
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-7 rounded-sm border cursor-pointer transition-all duration-150 transform hover:scale-105 hover:z-10 ${colorClass} ${
                          isHovered ? 'ring-2 ring-white/50' : ''
                        }`}
                        title={`${cell.month} 2026 ${row.label}: ${formatCurrency(cell.amount)}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Month Labels along bottom */}
          <div className="flex items-center gap-2 mt-2 pt-1 border-t border-[#24363B]/40">
            <span className="w-16 flex-shrink-0" />
            <div className="grid grid-cols-12 gap-1.5 flex-1 text-center">
              {MONTHS.map((m) => (
                <span key={m} className="text-[10px] text-[#71848A] font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Higher / Lower Legend and Hover Tooltip */}
      <div className="flex items-center justify-between mt-3 pt-2 text-xs text-[#71848A]">
        {/* Floating Tooltip Indicator */}
        <div className="min-h-5">
          {hoveredCell ? (
            <span className="text-[#F1F5F4] font-medium">
              <span className="text-[#35E9A0] font-bold">{hoveredCell.month}:</span>{' '}
              {hoveredCell.metric} = {formatCurrency(hoveredCell.amount)}
            </span>
          ) : (
            <span className="text-[11px] text-[#71848A]">
              Hover over a square for details
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px]">
          <span>Higher</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#35E9A0]" />
            <span className="w-3 h-3 rounded-xs bg-[#20A771]" />
            <span className="w-3 h-3 rounded-xs bg-[#146043]" />
          </div>
          <span>Lower</span>
        </div>
      </div>
    </div>
  );
}

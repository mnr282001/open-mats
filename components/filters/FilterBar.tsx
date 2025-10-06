import { DAYS_OF_WEEK, NEIGHBORHOODS } from '@/types';
import FilterDropdown from './FilterDropdown';
import React from 'react';

interface FilterBarProps {
  selectedDay: string;
  selectedGiNogi: string;
  selectedArea: string;
  onDayChange: (day: string) => void;
  onGiNogiChange: (value: string) => void;
  onAreaChange: (area: string) => void;
}

export default function FilterBar({
  selectedDay,
  selectedGiNogi,
  selectedArea,
  onDayChange,
  onGiNogiChange,
  onAreaChange
}: FilterBarProps) {
  const [showDayDropdown, setShowDayDropdown] = React.useState(false);
  const [showGiDropdown, setShowGiDropdown] = React.useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = React.useState(false);

  const closeAllDropdowns = () => {
    setShowDayDropdown(false);
    setShowGiDropdown(false);
    setShowAreaDropdown(false);
  };

  const giNogiOptions = ['Gi Only', 'NoGi Only', 'Both'];
  const giNogiValues = ['gi', 'nogi', 'both'];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 items-center">
          <p className="text-sm font-medium text-gray-500 mr-2">
            Filter by:
          </p>

          <FilterDropdown
            isOpen={showDayDropdown}
            label="Day"
            options={DAYS_OF_WEEK}
            selectedValue={selectedDay === 'all' ? 'all' : DAYS_OF_WEEK[parseInt(selectedDay)]}
            onSelect={(value) => {
              if (value === 'all') {
                onDayChange('all');
              } else {
                const index = DAYS_OF_WEEK.indexOf(value as any);
                onDayChange(String(index));
              }
            }}
            onToggle={() => {
              closeAllDropdowns();
              setShowDayDropdown(!showDayDropdown);
            }}
            allLabel="All Days"
          />

          <FilterDropdown
            isOpen={showGiDropdown}
            label="Gi/NoGi"
            options={giNogiOptions}
            selectedValue={
              selectedGiNogi === 'all' 
                ? 'all' 
                : giNogiOptions[giNogiValues.indexOf(selectedGiNogi)]
            }
            onSelect={(value) => {
              if (value === 'all') {
                onGiNogiChange('all');
              } else {
                const index = giNogiOptions.indexOf(value);
                onGiNogiChange(giNogiValues[index]);
              }
            }}
            onToggle={() => {
              closeAllDropdowns();
              setShowGiDropdown(!showGiDropdown);
            }}
            allLabel="All"
          />

          <FilterDropdown
            isOpen={showAreaDropdown}
            label="Area"
            options={NEIGHBORHOODS}
            selectedValue={selectedArea}
            onSelect={onAreaChange}
            onToggle={() => {
              closeAllDropdowns();
              setShowAreaDropdown(!showAreaDropdown);
            }}
            allLabel="All Areas"
          />
        </div>
      </div>
    </div>
  );
}
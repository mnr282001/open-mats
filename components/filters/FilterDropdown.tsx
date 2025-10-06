interface FilterDropdownProps {
    isOpen: boolean;
    label: string;
    options: readonly string[] | string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    onToggle: () => void;
    allLabel?: string;
  }
  
  export default function FilterDropdown({
    isOpen,
    label,
    options,
    selectedValue,
    onSelect,
    onToggle,
    allLabel = 'All'
  }: FilterDropdownProps) {
    const getDisplayLabel = () => {
      if (selectedValue === 'all') return label;
      return selectedValue;
    };
  
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex h-8 items-center gap-x-2 rounded-lg bg-[#f0eff1] pl-4 pr-2 text-gray-900 hover:bg-gray-200"
        >
          <p className="text-sm font-medium">{getDisplayLabel()}</p>
          <span className="text-sm">▼</span>
        </button>
        {isOpen && (
          <div className="absolute top-10 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[150px] z-10">
            <button
              onClick={() => {
                onSelect('all');
                onToggle();
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              {allLabel}
            </button>
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelect(typeof option === 'string' ? option : String(idx));
                  onToggle();
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
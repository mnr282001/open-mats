export default function GiBadgeRenderer(props: any) {
    const value = props.value;
    const label = value === 'gi' ? 'Gi' : value === 'nogi' ? 'No-Gi' : 'Both';
    
    const getColorClass = (giNogi: string): string => {
      switch(giNogi) {
        case 'gi': return 'bg-[#8b7db8]/20 text-[#47159d]';
        case 'nogi': return 'bg-[#f0a6c8]/20 text-[#E54B86]';
        case 'both': return 'bg-purple-600/20 text-purple-600';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass(value)}`}>
        {label}
      </span>
    );
  }
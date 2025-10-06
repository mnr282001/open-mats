export const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

export const getGiBadgeColor = (giNogi: string): string => {
    switch (giNogi) {
        case 'gi': return 'bg-[#47159d]/20 text-[#47159d] dark:bg-[#47159d]/30 dark:text-white';
        case 'nogi': return 'bg-[#E54B86]/20 text-[#E54B86] dark:bg-[#E54B86]/30 dark:text-white';
        case 'both': return 'bg-purple-600/20 text-purple-600 dark:bg-purple-600/30 dark:text-white';
        default: return 'bg-gray-100 text-gray-800';
    }
};
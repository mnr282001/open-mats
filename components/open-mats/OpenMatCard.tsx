import { OpenMatWithGym, DAYS_OF_WEEK, Gym } from '@/types';
import { formatTime, getGiBadgeColor } from '@/lib/utils';
import GiBadgeRenderer from './GiBadgeRenderer';

interface OpenMatCardProps {
  openMat: OpenMatWithGym;
  onViewDetails: (gym: Gym | null) => void;
}

export default function OpenMatCard({ openMat, onViewDetails }: OpenMatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div>
        <p className="text-lg font-bold text-gray-900">
          {openMat.gym?.name || 'Unknown Gym'}
        </p>
        <p className="text-sm text-gray-500">
          {DAYS_OF_WEEK[openMat.day_of_week]}, {formatTime(openMat.start_time)} - {formatTime(openMat.end_time)}
        </p>
      </div>
      <div className="flex items-center justify-between text-sm">
        <GiBadgeRenderer value={openMat.gi_nogi} />
        <p className="text-gray-500">
          {openMat.gym?.drop_in_price || 'Contact for price'}
        </p>
      </div>
      <p className="text-sm text-gray-500">
        {openMat.gym?.neighborhood || 'Austin'}
      </p>
      <button
        onClick={() => onViewDetails(openMat.gym || null)}
        className="mt-2 text-sm font-semibold text-[#E54B86] hover:text-[#E54B86]/80"
      >
        View Details
      </button>
    </div>
  );
}
import { OpenMatWithGym, Gym } from '@/types';
import OpenMatCard from './OpenMatCard';

interface ThisWeekSectionProps {
  openMats: OpenMatWithGym[];
  loading: boolean;
  onViewGymDetails: (gym: Gym | null) => void;
}

export default function ThisWeekSection({ 
  openMats, 
  loading, 
  onViewGymDetails 
}: ThisWeekSectionProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        This Week
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : openMats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {openMats.map((om) => (
            <OpenMatCard key={om.id} openMat={om} onViewDetails={onViewGymDetails} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          No open mats found for this week. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}
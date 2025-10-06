import { Gym } from '@/types';

interface GymDetailModalProps {
  gym: Gym | null;
  onClose: () => void;
}

export default function GymDetailModal({ gym, onClose }: GymDetailModalProps) {
  if (!gym) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {gym.name}
            </h3>
            {gym.affiliation && (
              <p className="text-sm text-gray-500">
                {gym.affiliation}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {gym.address && (
            <div>
              <p className="text-sm font-medium text-gray-700">
                Address
              </p>
              <p className="text-sm text-gray-600">
                {gym.address}
              </p>
              {gym.google_maps_url && (
                <a 
                  href={gym.google_maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-[#E54B86] hover:text-[#E54B86]/80"
                >
                  Get Directions →
                </a>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {gym.drop_in_price && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Drop-in Price
                </p>
                <p className="text-sm text-gray-600">
                  {gym.drop_in_price}
                </p>
              </div>
            )}
            {gym.membership_price && (
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Membership
                </p>
                <p className="text-sm text-gray-600">
                  {gym.membership_price}
                </p>
              </div>
            )}
          </div>

          {gym.description && (
            <div>
              <p className="text-sm font-medium text-gray-700">
                About
              </p>
              <p className="text-sm text-gray-600">
                {gym.description}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {gym.website && (
              <a 
                href={gym.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-[#E54B86] hover:text-[#E54B86]/80"
              >
                Visit Website →
              </a>
            )}
            {gym.instagram && (
              <a 
                href={`https://instagram.com/${gym.instagram.replace('@', '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-[#E54B86] hover:text-[#E54B86]/80"
              >
                Instagram →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
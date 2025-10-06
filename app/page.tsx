"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';

type OpenMat = Database['public']['Tables']['open_mats']['Row'];
type Gym = Database['public']['Tables']['gyms']['Row'];

type OpenMatWithGym = OpenMat & {
  gym?: Gym;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);



const OpenMatsApp = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [openMats, setOpenMats] = useState<OpenMatWithGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedGiNogi, setSelectedGiNogi] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showGiDropdown, setShowGiDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const neighborhoods = ['North Austin', 'South Austin', 'Central Austin', 'East Austin', 'West Austin'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch gyms
      const { data: gymsData, error: gymsError } = await supabase
        .from('gyms')
        .select('*')
        .order('name');
  
      if (gymsError) throw gymsError;
  
      // Fetch open mats
      const { data: openMatsData, error: openMatsError } = await supabase
        .from('open_mats')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week')
        .order('start_time');
  
      if (openMatsError) throw openMatsError;
  
      // Manually join gym data with open mats
      const openMatsWithGyms = (openMatsData || []).map(om => {
        const gym = gymsData?.find(g => g.id === om.gym_id);
        return { ...om, gym };
      });
  
      setGyms(gymsData || []);
      setOpenMats(openMatsWithGyms);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getGiBadgeColor = (giNogi: string) => {
    switch(giNogi) {
      case 'gi': return 'bg-purple-900/20 text-purple-900 dark:bg-purple-900/30 dark:text-white';
      case 'nogi': return 'bg-pink-500/20 text-pink-600 dark:bg-pink-500/30 dark:text-white';
      case 'both': return 'bg-purple-600/20 text-purple-600 dark:bg-purple-600/30 dark:text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOpenMats = openMats.filter(om => {
    const dayMatch = selectedDay === 'all' || om.day_of_week === parseInt(selectedDay);
    const giMatch = selectedGiNogi === 'all' || om.gi_nogi === selectedGiNogi;
    const areaMatch = selectedArea === 'all' || om.gym?.neighborhood === selectedArea;
    return dayMatch && giMatch && areaMatch;
  });

  // Get this week's open mats
  const today = new Date().getDay();
  const thisWeekOpenMats = filteredOpenMats.filter(om => {
    return om.day_of_week >= today;
  }).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <a href="#" className="text-2xl font-bold text-purple-900 dark:text-white">
                Open Mats
              </a>
            </div>
            <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
              Austin's BJJ Open Mat Hub
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative text-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Find Your Next Roll
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          All Austin BJJ open mats in one place. Updated weekly.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Filter by:</p>
            
            {/* Day Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDayDropdown(!showDayDropdown);
                  setShowGiDropdown(false);
                  setShowAreaDropdown(false);
                }}
                className="flex h-8 items-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 pl-4 pr-2 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <p className="text-sm font-medium">
                  {selectedDay === 'all' ? 'Day' : daysOfWeek[parseInt(selectedDay)]}
                </p>
                <span className="text-sm">▼</span>
              </button>
              {showDayDropdown && (
                <div className="absolute top-10 left-0 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 min-w-[150px] z-10">
                  <button
                    onClick={() => { setSelectedDay('all'); setShowDayDropdown(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    All Days
                  </button>
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedDay(idx.toString()); setShowDayDropdown(false); }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gi/NoGi Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowGiDropdown(!showGiDropdown);
                  setShowDayDropdown(false);
                  setShowAreaDropdown(false);
                }}
                className="flex h-8 items-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 pl-4 pr-2 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <p className="text-sm font-medium">
                  {selectedGiNogi === 'all' ? 'Gi/NoGi' : selectedGiNogi === 'gi' ? 'Gi' : selectedGiNogi === 'nogi' ? 'NoGi' : 'Both'}
                </p>
                <span className="text-sm">▼</span>
              </button>
              {showGiDropdown && (
                <div className="absolute top-10 left-0 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 min-w-[120px] z-10">
                  <button
                    onClick={() => { setSelectedGiNogi('all'); setShowGiDropdown(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    All
                  </button>
                  <button
                    onClick={() => { setSelectedGiNogi('gi'); setShowGiDropdown(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Gi Only
                  </button>
                  <button
                    onClick={() => { setSelectedGiNogi('nogi'); setShowGiDropdown(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    NoGi Only
                  </button>
                  <button
                    onClick={() => { setSelectedGiNogi('both'); setShowGiDropdown(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Both
                  </button>
                </div>
              )}
            </div>

            {/* Area Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAreaDropdown(!showAreaDropdown);
                  setShowDayDropdown(false);
                  setShowGiDropdown(false);
                }}
                className="flex h-8 items-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 pl-4 pr-2 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <p className="text-sm font-medium">
                  {selectedArea === 'all' ? 'Area' : selectedArea}
                </p>
                <span className="text-sm">▼</span>
              </button>
              {showAreaDropdown && (
                <div className="absolute top-10 left-0 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 min-w-[150px] z-10">
                  <button
                    onClick={() => { setSelectedArea('all'); setShowAreaDropdown(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    All Areas
                  </button>
                  {neighborhoods.map((area, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedArea(area); setShowAreaDropdown(false); }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* This Week Section */}
          <div className="px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              This Week
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : thisWeekOpenMats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {thisWeekOpenMats.map((om) => (
                  <div
                    key={om.id}
                    className="flex flex-col gap-3 rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {om.gym?.name || 'Unknown Gym'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {daysOfWeek[om.day_of_week]}, {formatTime(om.start_time)} - {formatTime(om.end_time)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGiBadgeColor(om.gi_nogi)}`}>
                        {om.gi_nogi === 'gi' ? 'Gi' : om.gi_nogi === 'nogi' ? 'No-Gi' : 'Both'}
                      </span>
                      <p className="text-gray-500 dark:text-gray-400">
                        {om.gym?.drop_in_price || 'Contact for price'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {om.gym?.neighborhood || 'Austin'}
                    </p>
                    <button
                      onClick={() => setSelectedGym(om.gym || null)}
                      className="mt-2 text-sm font-semibold text-pink-600 hover:text-pink-500"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No open mats found for this week. Try adjusting your filters.</p>
            )}
          </div>

          {/* All Open Mats Table */}
          <div className="px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              All Open Mats
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Gym Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Gi/NoGi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOpenMats.map((om) => (
                    <tr
                      key={om.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                      onClick={() => setSelectedGym(om.gym || null)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {daysOfWeek[om.day_of_week]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(om.start_time)} - {formatTime(om.end_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {om.gym?.name || 'Unknown Gym'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGiBadgeColor(om.gi_nogi)}`}>
                          {om.gi_nogi === 'gi' ? 'Gi' : om.gi_nogi === 'nogi' ? 'No-Gi' : 'Both'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {om.gym?.neighborhood || 'Austin'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {om.gym?.drop_in_price || 'Contact for price'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Gym Detail Modal */}
      {selectedGym && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedGym(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGym.name}</h3>
                {selectedGym.affiliation && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedGym.affiliation}</p>
                )}
              </div>
              <button onClick={() => setSelectedGym(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedGym.address && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGym.address}</p>
                  {selectedGym.google_maps_url && (
                    <a href={selectedGym.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:text-pink-500">
                      Get Directions →
                    </a>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {selectedGym.drop_in_price && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop-in Price</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGym.drop_in_price}</p>
                  </div>
                )}
                {selectedGym.membership_price && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Membership</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGym.membership_price}</p>
                  </div>
                )}
              </div>

              {selectedGym.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">About</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGym.description}</p>
                </div>
              )}

              <div className="flex gap-4">
                {selectedGym.website && (
                  <a href={selectedGym.website} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:text-pink-500">
                    Visit Website →
                  </a>
                )}
                {selectedGym.instagram && (
                  <a href={`https://instagram.com/${selectedGym.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600 hover:text-pink-500">
                    Instagram →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <a href="mailto:contact@openmats.studio" className="mt-2 inline-block text-purple-900 dark:text-pink-600 hover:underline">
            Submit Correction
          </a>
          <p className="mt-4">© 2025 Open Mats • openmats.studio</p>
        </div>
      </footer>
    </div>
  );
};

export default OpenMatsApp;
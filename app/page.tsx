"use client"
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { OpenMatWithGym, Gym } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FilterBar from '@/components/filters/FilterBar';
import ThisWeekSection from '@/components/open-mats/ThisWeekSection';
import OpenMatTable from '@/components/open-mats/OpenMatTable';
import GymDetailModal from '@/components/modals/GymDetailModal';

export default function OpenMatsApp() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [openMats, setOpenMats] = useState<OpenMatWithGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedGiNogi, setSelectedGiNogi] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: gymsData, error: gymsError } = await supabase
        .from('gyms')
        .select('*')
        .order('name');

      if (gymsError) throw gymsError;

      const { data: openMatsData, error: openMatsError } = await supabase
        .from('open_mats')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week')
        .order('start_time');

      if (openMatsError) throw openMatsError;

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

  const filteredOpenMats = openMats.filter(om => {
    const dayMatch = selectedDay === 'all' || om.day_of_week === parseInt(selectedDay);
    const giMatch = selectedGiNogi === 'all' || om.gi_nogi === selectedGiNogi;
    const areaMatch = selectedArea === 'all' || om.gym?.neighborhood === selectedArea;
    return dayMatch && giMatch && areaMatch;
  });

  const today = new Date().getDay();
  const thisWeekOpenMats = filteredOpenMats
    .filter(om => om.day_of_week >= today)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121]">
      <Header />

      <div className="relative text-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f7f6f8] to-white dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Find Your Next Roll
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          All Austin BJJ open mats in one place. Updated weekly.
        </p>
      </div>

      <FilterBar
        selectedDay={selectedDay}
        selectedGiNogi={selectedGiNogi}
        selectedArea={selectedArea}
        onDayChange={setSelectedDay}
        onGiNogiChange={setSelectedGiNogi}
        onAreaChange={setSelectedArea}
      />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto">
          <ThisWeekSection
            openMats={thisWeekOpenMats}
            loading={loading}
            onViewGymDetails={setSelectedGym}
          />
          <OpenMatTable
            openMats={filteredOpenMats}
            onViewGymDetails={setSelectedGym}
          />
        </div>
      </main>

      <GymDetailModal gym={selectedGym} onClose={() => setSelectedGym(null)} />

      <Footer />
    </div>
  );
}
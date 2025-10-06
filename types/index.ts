import { Database } from '@/types/database';

export type OpenMat = Database['public']['Tables']['open_mats']['Row'];
export type Gym = Database['public']['Tables']['gyms']['Row'];

export type OpenMatWithGym = OpenMat & {
    gym?: Gym;
};

export const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
] as const;

export const NEIGHBORHOODS = [
    'North Austin',
    'South Austin',
    'Central Austin',
    'East Austin',
    'West Austin'
] as const;
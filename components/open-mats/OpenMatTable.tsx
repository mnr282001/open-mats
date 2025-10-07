"use client"
import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import { OpenMatWithGym, DAYS_OF_WEEK, Gym } from '@/types';
import { formatTime, getGiBadgeColor } from '@/lib/utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface OpenMatTableProps {
  openMats: OpenMatWithGym[];
  onViewGymDetails: (gym: Gym | null) => void;
}

export default function OpenMatTable({ openMats, onViewGymDetails }: OpenMatTableProps) {
  const columnDefs: ColDef[] = useMemo(() => [
    {
      field: 'day_of_week',
      headerName: 'Day',
      valueFormatter: (params) => DAYS_OF_WEEK[params.value],
      width: 130,
      cellClass: 'font-semibold',
    },
    {
      field: 'time',
      headerName: 'Time',
      valueGetter: (params) => `${formatTime(params.data.start_time)} - ${formatTime(params.data.end_time)}`,
      width: 200,
    },
    {
      field: 'gym.name',
      headerName: 'Gym Name',
      valueGetter: (params) => params.data.gym?.name || 'Unknown Gym',
      flex: 1,
      minWidth: 200,
      cellClass: 'font-semibold',
    },
    {
      field: 'gi_nogi',
      headerName: 'Gi/NoGi',
      cellRenderer: (params: any) => {
        const value = params.value;
        const label = value === 'gi' ? 'Gi' : value === 'nogi' ? 'No-Gi' : 'Both';
        const colorClass = getGiBadgeColor(value);
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${label}</span>`;
      },
      width: 120,
    },
    {
      field: 'gym.neighborhood',
      headerName: 'Area',
      valueGetter: (params) => params.data.gym?.neighborhood || 'Austin',
      width: 150,
    },
    {
      field: 'gym.drop_in_price',
      headerName: 'Price',
      valueGetter: (params) => params.data.gym?.drop_in_price || 'Contact for price',
      width: 150,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        All Open Mats
      </h2>
      <div 
        className="ag-theme-quartz rounded-xl overflow-hidden shadow-md border border-gray-200" 
        style={{ height: 600, width: '100%' }}
      >
        <AgGridReact
          rowData={openMats}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={56}
          headerHeight={48}
          animateRows={true}
          rowSelection="single"
          onRowClicked={(event) => onViewGymDetails(event.data.gym || null)}
          pagination={true}
          paginationPageSize={15}
          paginationPageSizeSelector={[10, 15, 20, 50]}
        />
      </div>
    </div>
  );
}
// import { useState } from 'react';
// import useSWR from 'swr';
// import { subDays, format } from 'date-fns';

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export const useRelatorioAgendamentos = () => {
//   const [filters, setFilters] = useState({
//     startDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
//     endDate: format(new Date(), 'yyyy-MM-dd'),
//     profissionalId: '',
//   });

//   const buildQueryString = () => {
//     const params = new URLSearchParams();
//     params.append('startDate', filters.startDate);
//     params.append('endDate', filters.endDate);
//     if (filters.profissionalId) {
//       params.append('profissionalId', filters.profissionalId);
//     }
//     return params.toString();
//   };

//   const queryString = buildQueryString();
//   const { data, error, isLoading } = useSWR(`/api/relatorios/agendamentos?${queryString}`, fetcher);

//   return {
//     data: data?.data,
//     isLoading,
//     error,
//     filters,
//     setFilters,
//   };
// };


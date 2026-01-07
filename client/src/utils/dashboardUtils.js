export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayString = () => formatDate(new Date());

export const isUpcomingOrOngoing = (trip) => {
  const today = new Date();
  const endDate = new Date(trip.endDate);
  return endDate >= today;
};

export const normalizeApiResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (response?.payload && Array.isArray(response.payload)) return response.payload;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
};

export const calculateTripDistance = (itineraryDates, today) => {
  if (itineraryDates.length === 0) return Infinity;

  const dates = itineraryDates.map(d => new Date(d));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  if (today < minDate) return Math.abs(minDate - today);
  if (today > maxDate) return Math.abs(today - maxDate);
  return 0;
};
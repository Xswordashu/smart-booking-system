import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Slot = {
  _id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export type Appointment = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    register: build.mutation<AuthResponse, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: '/api/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getSlots: build.query<{ data: Slot[] }, string>({
      query: (date) => `/api/slots?date=${encodeURIComponent(date)}`,
    }),
    getMyAppointments: build.query<{ data: Appointment[] }, void>({
      query: () => '/api/slots/appointments/my',
    }),
    bookAppointment: build.mutation<{ success: boolean; data: Appointment }, { slotId: string }>({
      query: (body) => ({
        url: '/api/slots/appointments/book',
        method: 'POST',
        body,
      }),
    }),
    cancelAppointment: build.mutation<{ success: boolean; data: Appointment }, { appointmentId: string }>({
      query: (body) => ({
        url: `/api/slots/appointments/${body.appointmentId}/cancel`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetSlotsQuery, useGetMyAppointmentsQuery, useBookAppointmentMutation, useCancelAppointmentMutation } = api;

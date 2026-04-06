import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/ConfirmModal'
import { useBookAppointmentMutation, useGetMyAppointmentsQuery, useGetSlotsQuery } from '@/services/api'
import type { Slot } from '@/services/api'

const TODAY = new Date().toISOString().slice(0, 10)

export default function DashboardPage() {
  const [date, setDate] = useState(TODAY)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const token = localStorage.getItem('token')

  const {
    data: slots,
    error: slotsError,
    isLoading: slotsLoading,
    refetch: refetchSlots,
  } = useGetSlotsQuery(date, {
    skip: !token,
  })

  const {
    data: appointments,
    error: appointmentsError,
    isLoading: appointmentsLoading,
    refetch: refetchAppointments,
  } = useGetMyAppointmentsQuery(undefined, {
    skip: !token,
  })

  const [bookAppointment, { isLoading: bookingLoading }] = useBookAppointmentMutation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.replace('/login')
  }

  const handleSlotClick = (slot: Slot) => {
    if (slot.isBooked) return
    setSelectedSlot(slot)
    setIsModalOpen(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return

    try {
      await bookAppointment({ slotId: selectedSlot._id }).unwrap()
      setIsModalOpen(false)
      setSelectedSlot(null)
      refetchSlots()
      refetchAppointments()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-slate-600">View slots and your appointments.</p>
          </div>
          <Button onClick={handleLogout}>Log out</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold">Available slots</h2>
                <p className="text-sm text-slate-500">Select a date to view available times.</p>
              </div>

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-500"
              />
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="max-h-[420px] overflow-y-auto px-4 py-4 sm:px-5">
                {slotsLoading && <p className="text-slate-600">Loading slots…</p>}
                {slotsError && <p className="text-red-600">Could not load slots.</p>}

                {slots?.data?.length ? (
                  <ul className="space-y-3">
                    {slots.data.map((slot) => (
                      <li
                        key={slot._id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="font-medium text-slate-900">{slot.startTime} – {slot.endTime}</div>
                            <div className="text-sm text-slate-500">{slot.isBooked ? 'Booked' : 'Available'}</div>
                          </div>
                          {!slot.isBooked ? (
                            <Button variant="secondary" size="sm" onClick={() => handleSlotClick(slot)} type="button">
                              Book
                            </Button>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Booked</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !slotsLoading && <p className="text-slate-500">No slots available.</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div>
              <h2 className="text-xl font-semibold">My appointments</h2>
              <p className="text-sm text-slate-500">Your confirmed bookings appear here.</p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="max-h-[420px] overflow-y-auto px-4 py-4 sm:px-5">
                {appointmentsLoading && <p className="text-slate-600">Loading appointments…</p>}
                {appointmentsError && <p className="text-red-600">Could not load appointments.</p>}

                {appointments?.data?.length ? (
                  <ul className="space-y-3">
                    {appointments.data.map((appointment) => (
                      <li key={appointment._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <div className="font-medium text-slate-900">{new Date(appointment.date).toLocaleDateString()}</div>
                        <div className="text-sm text-slate-500">{appointment.startTime} – {appointment.endTime}</div>
                        <div className="text-sm text-slate-500">Status: {appointment.status}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !appointmentsLoading && <p className="text-slate-500">No appointments yet.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmModal
        open={isModalOpen}
        title="Confirm appointment"
        description={
          selectedSlot
            ? `Do you want to book the ${selectedSlot.startTime} – ${selectedSlot.endTime} slot on ${date}?`
            : 'Select a slot to book.'
        }
        confirmText="Book appointment"
        isLoading={bookingLoading}
        onConfirm={handleConfirmBooking}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  )
}

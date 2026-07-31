import React, { useState, useEffect } from "react";
import { useApi } from "../../lib/api";
import { BookingsList, type Booking } from "./components/BookingsList";

export default function BookingsPage() {
  const api = useApi();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypes, setEventTypes] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsManualRefreshing(true);
      }
      setErrorMsg("");

      const [bookingsRes, eventsRes] = await Promise.all([
        api.get("/bookings"),
        api.get("/events"),
      ]);

      setBookings(bookingsRes.data.bookings || []);
      setEventTypes(eventsRes.data.events || []);
    } catch (err: any) {
      console.error("Error fetching bookings & events:", err);
      setErrorMsg("Failed to load your scheduled bookings list.");
    } finally {
      setIsLoading(false);
      setIsManualRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingsList
      bookings={bookings}
      isLoading={isLoading}
      isManualRefreshing={isManualRefreshing}
      onRefresh={() => fetchBookings(true)}
      errorMsg={errorMsg}
      eventTypes={eventTypes}
    />
  );
}

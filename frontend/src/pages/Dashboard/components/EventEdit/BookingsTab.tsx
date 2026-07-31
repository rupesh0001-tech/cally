import React, { useState, useEffect } from "react";
import { useApi } from "../../../../lib/api";
import { BookingsList, type Booking } from "../BookingsList";

interface BookingsTabProps {
  eventTypeId: string;
}

export function BookingsTab({ eventTypeId }: BookingsTabProps) {
  const api = useApi();
  const [bookings, setBookings] = useState<Booking[]>([]);
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

      const res = await api.get("/bookings");
      const allBookings: Booking[] = res.data.bookings || [];
      // Filter to only this event type's bookings
      const eventBookings = allBookings.filter(
        (b) => b.eventType && b.eventType.id === eventTypeId
      );
      setBookings(eventBookings);
    } catch (err: any) {
      console.error("Error fetching event bookings:", err);
      setErrorMsg("Failed to load bookings for this event.");
    } finally {
      setIsLoading(false);
      setIsManualRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings(false);
  }, [eventTypeId]);

  return (
    <BookingsList
      bookings={bookings}
      isLoading={isLoading}
      isManualRefreshing={isManualRefreshing}
      onRefresh={() => fetchBookings(true)}
      errorMsg={errorMsg}
      showHeader
      headerTitle="Event Bookings"
      headerDescription="View bookings scheduled under this specific event type link."
    />
  );
}

import UpdateReservation from "@/app/_components/UpdateReservation";

import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
   const booking = await getBooking(params.id);
   const cabin = await getCabin(booking?.cabinId);

   const reservationId = booking.id;

   return (
      <div>
         <h2 className="mb-7 text-2xl font-semibold text-accent-400">
            Edit Reservation #{reservationId}
         </h2>

         <UpdateReservation
            bookingId={params.id}
            booking={booking}
            cabin={cabin}
         />
      </div>
   );
}

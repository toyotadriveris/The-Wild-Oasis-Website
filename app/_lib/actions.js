"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
// import { supabase } from "./supabase";

import { supabase } from "@/app/_lib/supabase";
import { getBooking, getBookings, getCabin } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
   const session = await auth();
   if (!session) throw new Error("You must be logged in");

   const nationalID = formData.get("nationalID");
   const [nationality, countryFlag] = formData.get("nationality").split("%");

   if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
      throw new Error("Please provide a valid national-ID");

   const updatedData = { nationality, countryFlag, nationalID };

   const { data, error } = await supabase
      .from("guests")
      .update(updatedData)
      .eq("id", session?.user?.guestId);

   if (error) {
      console.error(error);
      throw new Error("Guest could not be updated");
   }
   revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
   const session = await auth();
   if (!session) throw new Error("You must be logged in");

   const guestBookings = await getBookings(session?.user?.guestId);
   const guestBookingsIDS = guestBookings?.map((booking) => booking.id);

   if (!guestBookingsIDS?.includes(bookingId)) throw new Error("NOT ALLOWED");

   const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

   if (error) {
      throw new Error("Booking could not be deleted");
   }

   revalidatePath("/account/reservations");
}

export async function editBooking(formData) {
   const session = await auth();
   if (!session) throw new Error("You must be logged in");
   const numGuests = formData.get("numGuests");
   const observations = formData.get("observations");
   const maxCapacity = formData.get("maxCapacity");
   const id = formData.get("id");

   const guestBookings = await getBookings(session?.user?.guestId);
   const guestBookingsIDS = guestBookings?.map((booking) => booking.id);

   if (!guestBookingsIDS?.includes(Number(id))) throw new Error("NOT ALLOWED");

   const bookingInDataBase = guestBookings.find(
      (booking) => booking.id === Number(id),
   );

   if (Number(numGuests) > Number(maxCapacity))
      throw new Error(`CANNOT ENTER MORE THAN OF ${maxCapacity} GUESTS`);

   const updatedData = {
      numGuests: Number(numGuests),
      observations: observations.slice(0, 1000),
   };

   const { error } = await supabase
      .from("bookings")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();

   if (error) {
      console.error(error);
      throw new Error("Booking could not be updated");
   }

   revalidatePath(`/account/reservations/${id}`);
   revalidatePath("/account/reservations");
   redirect("/account/reservations");
}

export async function signInAction() {
   await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
   await signOut({ redirectTo: "/" });
}

import { auth } from "../_lib/auth";

export const metadata = {
   title: "User",
};

export default async function Page() {
   const session = await auth();
   const firstName = session.user.name.split(" ").at(0);

   return (
      <h2 className="mb-7 text-2xl font-semibold text-accent-400">
         Welcome, {firstName}
      </h2>
   );
}

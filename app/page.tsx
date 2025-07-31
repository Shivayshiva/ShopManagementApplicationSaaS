
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { publicRoutes } from "@/constants/route.constants.ts/routes.public";
import { roleBasedRoutes } from "@/lib/roleRoutes";

export default async function HomePage({ loading }: { loading: boolean }) {
  const session = await getServerSession(authOptions);

  console.log(" ", session);

  const role = session?.user?.role;
  const Roleroutes = roleBasedRoutes?.[role];

  if (session === null) {
    redirect(publicRoutes.AUTH_LOGIN);
  }
  if (Roleroutes && Roleroutes.length > 0) {
    redirect(Roleroutes[0]);
  }

  return <div>Unauthorized or no default route found</div>;
}


import { deleteSessionCookie } from "@/session";
import { redirect } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <form action={logoutAction}>
        <button>Logout</button>
      </form>
      {children}
    </>
  );
}

async function logoutAction() {
  "use server";
  deleteSessionCookie();
  redirect("/login");
}

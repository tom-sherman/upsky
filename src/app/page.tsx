import { getSession } from "@/db/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getAgent } from "@/agent";

export default async function Home() {
  const session = await getSession();

  if (!session?.data) {
    redirect("/login");
  }

  const profile = await (
    await getAgent()
  ).getProfile({
    actor: "@tom-sherman.com",
  });

  return <pre>{JSON.stringify(profile.data)}</pre>;
}

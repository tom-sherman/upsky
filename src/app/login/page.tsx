import { z } from "zod";
import { getAgent } from "../agent";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/session";

export default function LoginPage() {
  return (
    <>
      <h1>Login</h1>
      <Form />
      <p>
        It&apos;s strongly recommended that you use an app password and not your
        general BlueSky password.
      </p>
      <p>
        <a
          href="https://bsky.app/settings/app-passwords"
          target="_blank"
          rel="nofollow noreferrer"
        >
          Click here
        </a>{" "}
        to create one.
      </p>
    </>
  );
}

interface FormProps {
  error?: string;
}

function Form({ error }: FormProps) {
  return (
    <>
      {error && <p>{error}</p>}
      <form action={loginAction}>
        <label>
          Service:
          <input
            name="service"
            type="text"
            key="service"
            defaultValue="https://bsky.social"
          />
        </label>
        <label>
          Username:
          <input name="identifier" type="text" />
        </label>
        <label>
          Password:
          <input name="password" type="password" />
        </label>
        <button>Submit</button>
      </form>
    </>
  );
}

const loginFormSchema = z.object({
  service: z.string().min(3),
  identifier: z.string().min(3),
  password: z.string().min(8),
});

async function loginAction(formData: FormData) {
  "use server";
  const form = loginFormSchema.parse(Object.fromEntries(formData.entries()));
  const agent = await getAgent();
  agent.service = new URL(form.service);
  const result = await agent.login(form);

  if (!result.success) {
    throw new Error("Invalid login");
  }

  setSessionCookie({
    atp: result.data,
    service: form.service,
  });
  redirect("/home");
}

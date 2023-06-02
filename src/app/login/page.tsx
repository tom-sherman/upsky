import { z } from "zod";
import { getAgent } from "../agent";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/session";
import { ErrorBoundary } from "react-error-boundary";

export default function LoginPage() {
  return (
    <>
      <h1>Login</h1>
      <ErrorBoundary fallback={<Form error="Invalid" />}>
        <Form />
      </ErrorBoundary>
    </>
  );
}

interface FormProps {
  error?: string;
}

function Form({ error }: FormProps) {
  return (
    <form action={loginAction}>
      {error && <p>{error}</p>}
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

  console.log(result);
  if (!result.success) {
    throw new Error("Invalid login");
  }

  setSessionCookie({
    atp: result.data,
    service: form.service,
  });
  redirect("/app");
}

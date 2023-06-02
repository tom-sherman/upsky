export default function LoginPage() {
  return (
    <>
      <h1>Login</h1>
      <form action={loginAction}>
        <label>
          Username:
          <input type="text" />
        </label>
        <label>
          Password:
          <input type="password" />
        </label>
      </form>
    </>
  );
}

async function loginAction(formData: FormData) {
  "use server";
}

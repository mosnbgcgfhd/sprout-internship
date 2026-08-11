import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <div className="card-pin p-6">
        <h1 className="font-display text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-ink/60">
          We&rsquo;ll email you a magic link — no password to remember.
        </p>
        <div className="mt-5">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}

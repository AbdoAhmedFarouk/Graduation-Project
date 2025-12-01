import AnchorLinkBtn from "../_components/AnchorLinkBtn";
import LoginForm from "./LoginForm";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center bg-surface h-dvh text-secondary px-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gold mb-2 tracking-tight">
          Welcome back.
        </h1>
      </div>

      <LoginForm />

      <p className="text-center text-secondary/60 mt-8">
        Don&apos;t have an account?{" "}
        <AnchorLinkBtn
          href="/signup"
          styles="text-gold font-medium hover:underline hover:text-hover transition-all"
        >
          Sign up
        </AnchorLinkBtn>
      </p>
    </div>
  );
}

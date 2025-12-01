import AnchorLinkBtn from "../_components/AnchorLinkBtn";
import SignupForm from "./SignupForm";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center bg-surface h-dvh text-secondary px-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gold mb-2 tracking-tight">
          Welcome.
        </h1>
        <p className="text-base text-secondary/80">Create your account below</p>
      </div>

      <SignupForm />

      <p className="text-center text-secondary/60 mt-8">
        Already have an account?{" "}
        <AnchorLinkBtn
          href="/login"
          styles="text-gold font-medium hover:underline hover:text-hover transition-all"
        >
          Login
        </AnchorLinkBtn>
      </p>
    </div>
  );
}

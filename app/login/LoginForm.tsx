import FormRow from "../_components/FormRow";
import ShowPasswordInp from "../_components/ShowPasswordInp";
import SubmitBtn from "../_components/SubmitBtn";

export default function LoginForm() {
  return (
    <form
      // action={login}
      className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-4 border border-borders p-8 rounded-2xl shadow-[0_0_10px]
        shadow-secondary/10"
    >
      <FormRow
        type="email"
        id="email"
        name="email"
        placeholder="example@gmail.com"
        required
        labelTxt="Email"
        htmlFor="email"
      />

      <FormRow labelTxt="Password" htmlFor="password">
        <div className="relative">
          <ShowPasswordInp />
        </div>
      </FormRow>

      <SubmitBtn text="Login" loadingText="Logging in" />
    </form>
  );
}

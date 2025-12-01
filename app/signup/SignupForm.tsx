"use client";

import { useActionState } from "react";

import ShowPasswordInp from "../_components/ShowPasswordInp";
import SubmitBtn from "../_components/SubmitBtn";

import FormRow from "../_components/FormRow";
import { signup } from "../_lib/actions";

const initialState = {
  success: false,
  message: "",
};

export default function SignupForm() {
  const [formState, formAction] = useActionState(signup, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-4 border border-borders p-8 rounded-2xl shadow-[0_0_10px]
      shadow-secondary/10"
    >
      <FormRow
        htmlFor="first-name"
        labelTxt="First Name"
        type="text"
        id="first-name"
        name="first-name"
        placeholder="John"
        required
      />

      <FormRow
        htmlFor="last-name"
        labelTxt="Last Name"
        type="text"
        id="last-name"
        name="last-name"
        placeholder="Doe"
        required
      />

      <FormRow
        htmlFor="email"
        labelTxt="Email"
        type="email"
        id="email"
        name="email"
        placeholder="example@gmail.com"
        required
      />

      <FormRow htmlFor="password" labelTxt="Password">
        <div className="relative">
          <ShowPasswordInp />
        </div>
      </FormRow>

      {formState.message && (
        <p className="text-red-600 mb-5">{formState.message}</p>
      )}

      <SubmitBtn text="Sign up" loadingText="Signing up..." />
    </form>
  );
}

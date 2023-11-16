"use client";
import { create } from "@/actions/create-board";
import { useFormState } from "react-dom";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";
export const Form = () => {
  const initiaState = { message: null, errors: {} };
  const [state, dispatch] = useFormState<Promise<any>>(create as any, initiaState);
  return (
    <form action={dispatch}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={state?.errors} />
      </div>
     <FormButton/>
    </form>
  );
};

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { ValidationError, type FieldErrors } from "@/shared/error";
import { authModule } from "../../di";
import type { SignUpUseCase } from "../../domain/usecases/SignUpUseCase";
import { sessionStarted } from "../state/sessionSlice";

type Field = "name" | "email" | "password" | "confirmPassword";

export function useSignUpViewModel(signUp: Pick<SignUpUseCase, "execute"> = authModule.signUp) {
  const dispatch = useDispatch();
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = useCallback((field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setFieldErrors(({ [field]: _removed, ...rest }) => rest);
    setFormError(null);
  }, []);

  const submit = useCallback(async (): Promise<boolean> => {
    if (isSubmitting) return false;
    setIsSubmitting(true);
    setFormError(null);
    const result = await signUp.execute(values);
    setIsSubmitting(false);

    if (result.ok) {
      dispatch(sessionStarted(result.value));
      return true;
    }
    if (result.error instanceof ValidationError) {
      const { fields } = result.error;
      setFieldErrors(fields);
      if (Object.keys(fields).length === 0) setFormError(result.error.message);
    } else {
      setFormError(result.error.message);
    }
    return false;
  }, [dispatch, isSubmitting, signUp, values]);

  return { values, fieldErrors, formError, isSubmitting, setField, submit };
}

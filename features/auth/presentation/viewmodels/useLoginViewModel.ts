import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { ValidationError, type FieldErrors } from "@/shared/error";
import { authModule } from "../../di";
import type { LoginUseCase } from "../../domain/usecases/LoginUseCase";
import { sessionStarted } from "../state/sessionSlice";

type Field = "email" | "password";

/**
 * ViewModel for the login screen. Holds form state and talks to the use case.
 * The View only renders what this returns; it contains no business logic.
 */
export function useLoginViewModel(login: Pick<LoginUseCase, "execute"> = authModule.login) {
  const dispatch = useDispatch();
  const [values, setValues] = useState<Record<Field, string>>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = useCallback((field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setFieldErrors(({ [field]: _removed, ...rest }) => rest);
    setFormError(null);
  }, []);

  /** Resolves to true when the user is logged in. */
  const submit = useCallback(async (): Promise<boolean> => {
    if (isSubmitting) return false;
    setIsSubmitting(true);
    setFormError(null);
    const result = await login.execute(values);
    setIsSubmitting(false);

    if (result.ok) {
      dispatch(sessionStarted(result.value));
      return true;
    }
    if (result.error instanceof ValidationError) {
      setFieldErrors(result.error.fields);
    } else {
      setFormError(result.error.message);
    }
    return false;
  }, [dispatch, isSubmitting, login, values]);

  return { values, fieldErrors, formError, isSubmitting, setField, submit };
}

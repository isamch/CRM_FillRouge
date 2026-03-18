"use client";

import { useState, useCallback } from "react";
import { validateSchema, getApiErrors } from "./rules";

export function useForm(initialValues, schema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Re-validate only if field was already touched
    setErrors((prev) => {
      if (!touched[field]) return prev;
      const { [field]: _, ...rest } = prev;
      const fieldErrors = validateSchema({ ...values, [field]: value }, { [field]: schema[field] || [] });
      return fieldErrors[field] ? { ...rest, [field]: fieldErrors[field] } : rest;
    });
  }, [values, touched, schema]);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateSchema(values, { [field]: schema[field] || [] });
    setErrors((prev) => fieldErrors[field]
      ? { ...prev, [field]: fieldErrors[field] }
      : { ...prev, [field]: "" }
    );
  }, [values, schema]);

  const validate = useCallback(() => {
    const allErrors = validateSchema(values, schema);
    // Mark all fields as touched
    const allTouched = Object.keys(schema).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [values, schema]);

  const setApiErrors = useCallback((err) => {
    const apiErrors = getApiErrors(err);
    if (Object.keys(apiErrors).length) {
      setErrors((prev) => ({ ...prev, ...apiErrors }));
      setTouched((prev) => ({ ...prev, ...Object.keys(apiErrors).reduce((a, k) => ({ ...a, [k]: true }), {}) }));
    }
    return apiErrors;
  }, []);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Helper for input props
  const field = useCallback((name) => ({
    value: values[name] ?? "",
    onChange: (e) => handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    style: {
      border: `1px solid ${errors[name] && touched[name] ? "#ef4444" : "#e5e7eb"}`,
    },
  }), [values, errors, touched, handleChange, handleBlur]);

  return { values, errors, touched, handleChange, handleBlur, validate, setApiErrors, reset, field };
}

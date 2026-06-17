import { useState, useCallback } from 'react';

/**
 * Shared hook that encapsulates the form-state pattern duplicated across
 * LoginPage, SignupPage, ContactForm, WriteForUsPage, and SubscribePage.
 *
 * Usage:
 *   const { formData, errors, isSubmitting, handleChange, handleSubmit, setFieldError } =
 *     useForm({ initialValues, validate, onSubmit });
 */
export const useForm = ({ initialValues, validate, onSubmit }) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    let nextValue;
    if (type === 'file') {
      nextValue = files[0];
    } else if (type === 'checkbox') {
      nextValue = checked;
    } else {
      nextValue = value;
    }

    setFormData((prev) => {
      // Support dot-notation field names (e.g. "socialMedia.twitter")
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return { ...prev, [parent]: { ...prev[parent], [child]: nextValue } };
      }
      return { ...prev, [name]: nextValue };
    });

    // Clear field-level error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    const validationErrors = validate ? validate(formData) : {};
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Something went wrong. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, onSubmit]);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const setFieldValue = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldError,
    setFieldValue,
  };
};

export default useForm;

import React from 'react';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import Button from '../../components/forms/Button';
import FormError from '../../components/forms/FormError';
import { useForm } from '../../hooks/useForm';
import { VALIDATION } from '../../utils/constants';

const validate = (values) => {
  const newErrors = {};

  if (!values.name.trim()) newErrors.name = 'Name is required';

  if (!values.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!VALIDATION.EMAIL_REGEX.test(values.email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!values.subject.trim()) newErrors.subject = 'Subject is required';

  if (!values.message.trim()) {
    newErrors.message = 'Message is required';
  } else if (values.message.trim().length < 10) {
    newErrors.message = 'Message must be at least 10 characters long';
  }

  return newErrors;
};

const ContactForm = ({ onSubmit }) => {
  const { formData, errors, isSubmitting, handleChange, handleSubmit, resetForm } = useForm({
    initialValues: { name: '', email: '', subject: '', message: '' },
    validate,
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(data);
      resetForm();
    },
  });

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <Input
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          error={errors.name}
        />
        
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          error={errors.email}
        />
      </div>

      <Input
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="How can we help you?"
        required
        error={errors.subject}
      />

      <Textarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell us more about your inquiry..."
        required
        rows={6}
        error={errors.message}
      />

      <FormError error={errors.submit || errors.general} />

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;

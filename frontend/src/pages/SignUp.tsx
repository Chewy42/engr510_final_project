import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { email: '', password: '', confirmPassword: '' };

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password); // Replace with actual signup
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/auth/signin"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            error={(formErrors.email || error) || undefined}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            helperText="Must be at least 8 characters"
          />

          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={loading}
        >
          Create account
        </Button>

        <p className="text-center text-xs text-gray-600">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>
        </p>
      </form>
    </>
  );
}

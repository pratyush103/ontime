import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../../context/UserContext';
import styles from './login.module.css';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userContext = useContext(UserContext);
  const login = userContext?.login;
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (login) {
        await login(formData.username, formData.password);
        toast({
          title: "Success",
          description: "Login successful",
          variant: "default",
        });
        router.push('/');
      } else {
        throw new Error('Login function is not defined');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row min-vh-100">
        <div className="col-md-6 d-none d-md-flex bg-primary align-items-center justify-content-center">
          <div className="text-center text-white p-5">
            <h1 className="display-4 fw-bold mb-4">Welcome Back</h1>
            <p className="lead">Login to manage your academic schedules with OnTime</p>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center py-5">
          <div className="card border-0 shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-body">
              <div className="text-center mb-4">
                <h2 className="h3 mb-3 fw-bold text-primary">Login to OnTime</h2>
                <p className="text-muted small">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <label htmlFor="username">Username</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <label htmlFor="password">Password</label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="text-center">
                    <p className="text-muted mb-0">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-primary text-decoration-none">
                      Register here
                    </Link>
                    </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

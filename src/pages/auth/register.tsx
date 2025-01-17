import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../../context/UserContext';
import styles from './login.module.css';

export default function Register() {
  const [divisions, setDivisions] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    department: '',
    isHOD: false,
    divisionIds: [] as number[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserContext must be used within a UserProvider');
  }
  const { login } = userContext;

  useEffect(() => {
    async function fetchDivisions() {
      const response = await axios.get('/api/divisions');
      setDivisions(response.data.divisions);
    }
    fetchDivisions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'divisionIds') {
      setFormData((prev) => ({
        ...prev,
        divisionIds: checked
          ? [...prev.divisionIds, Number(value)]
          : prev.divisionIds.filter((id) => id !== Number(value)),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post('/api/auth/register', formData);
      await login(formData.username, formData.password);
      router.push('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row min-vh-100">
        <div className="col-md-6 d-none d-md-flex bg-primary align-items-center justify-content-center">
          <div className="text-center text-white p-5">
            <h1 className="display-4 fw-bold mb-4">Join OnTime</h1>
            <p className="lead">Create your account to start managing academic schedules</p>
          </div>
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center py-5">
          <div className="card border-0 shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="card-body">
              <div className="text-center mb-4">
                <h2 className="h3 mb-3 fw-bold text-primary">Create Account</h2>
                <p className="text-muted small">Enter your details to register</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 fade show" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
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
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-floating">
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
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <label htmlFor="name">Full Name</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <label htmlFor="department">Department</label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                  type="checkbox"
                  className="form-check-input"
                  id="isHOD"
                  name="isHOD"
                  checked={formData.isHOD}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isHOD: e.target.checked }))}
                  disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="isHOD">Head of Department</label>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">Select Divisions</label>
                  <div className="row g-2">
                    {divisions.map((division) => (
                      <div key={division.id} className="col-md-6">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`division-${division.id}`}
                            name="divisionIds"
                            value={division.id}
                            checked={formData.divisionIds.includes(division.id)}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                          <label className="form-check-label" htmlFor={`division-${division.id}`}>
                            {division.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../../context/UserContext';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();
  const userContext = useContext(UserContext);
    const user = userContext?.user;
    const login = userContext?.login;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (login) {
        await login(formData.username, formData.password);
      } else {
        console.error('Login function is not defined');
      }
      router.push('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

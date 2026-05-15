import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterRoute = location.pathname === '/register';
  const [rightPanelActive, setRightPanelActive] = useState(isRegisterRoute);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'customer',
    image: null,
  });

  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    setRightPanelActive(isRegisterRoute);
  }, [isRegisterRoute]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const data = await login(loginForm.email, loginForm.password);
      const next =
        location.state?.from ||
        (data.user?.role === 'customer' ? '/' : '/dashboard');

      navigate(next, { replace: true });
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');

    try {
      const fd = new FormData();

      Object.entries(registerForm).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          fd.append(key, value);
        }
      });

      const data = await register(fd);
      const next =
        location.state?.from ||
        (data.user?.role === 'customer' ? '/' : '/dashboard');

      navigate(next, { replace: true });
    } catch (err) {
      setRegisterError(err.message || 'Register failed');
    } finally {
      setRegisterLoading(false);
    }
  };

  const goToSignUp = () => {
    setRightPanelActive(true);
    navigate('/register');
  };

  const goToSignIn = () => {
    setRightPanelActive(false);
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div
        className={`auth-container ${
          rightPanelActive ? 'right-panel-active' : ''
        }`}
      >
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Create Account</h1>
            <span>Use your email to create a new account</span>

            {registerError ? (
              <div className="auth-error">{registerError}</div>
            ) : null}

            <input
              type="text"
              placeholder="Name"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={registerForm.password_confirmation}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  password_confirmation: e.target.value,
                })
              }
              required
            />

            <select
              value={registerForm.role}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, role: e.target.value })
              }
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>

            <div className="file-field-wrap">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    image: e.target.files?.[0] || null,
                  })
                }
              />
              <small className="optional-note">Profile image (optional)</small>
            </div>

            <button type="submit" disabled={registerLoading}>
              {registerLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <span>Use your account to continue</span>

            {loginError ? <div className="auth-error">{loginError}</div> : null}

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              autoComplete="username"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              required
            />

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" type="button" onClick={goToSignIn}>
                Sign In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" type="button" onClick={goToSignUp}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
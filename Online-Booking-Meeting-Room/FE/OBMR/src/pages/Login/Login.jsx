import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import RightSide from "../../components/Login/rightside"
import axios from 'axios';
import '../../styles/style.css'


function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({ email: '', password: '' });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateFormData = () => {
    const { email, password } = formData;
    const errors = [];

    if (email.includes(' ')) errors.push('Username must not contain spaces');
    if (password.includes(' ')) errors.push('Password must not contain spaces');
    if (password.length < 8) errors.push('Password must be at least 8 characters long');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least 1 lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least 1 uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least 1 number');
    if (!/[!/#/@]/.test(password)) errors.push('Password must contain at least 1 special character (!/#/@)');

    return errors;
  };

  const handleSubmit = async (e) => {
    console.log("h")
    e.preventDefault();
    const errors = validateFormData();

    if (errors.length > 0) {
      setError(errors.join(', '));

      return;
    }

    // Kiểm tra độ dài mật khẩu
    // if (password.length < 8) {
    //   setError('Password must be at least 8 characters long');
    //   return;
    // }

    setError('');

    try {
      // Gửi request đăng nhập đến API với phương thức POST
      const response = await axios.post('http://localhost:8080/api/authenticate', {
        username: username,
        password: password,
      },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

      // Lưu token vào localStorage
      localStorage.setItem('id_token', response.data.id_token);
      sessionStorage.setItem('successMessage', 'LOGIN SUCCESS!');

        navigate('/home');

    } catch (error) {
      console.error('Login failed:', error);

      // Xử lý lỗi khi đăng nhập
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }

    console.log('Username:', username, 'Password:', password);
  };




  return (
    <div className="d-flex custom-vh bg-light">
      {/* Left Side - Login Form */}
      <div className="d-flex flex-column justify-content-center custom-w bg-white px-5 ">
        {/* Nội dung form đăng nhập */}
        <h2 className="text-center mb-4 custom-h2">Login</h2>
        <form className="custom-p" onSubmit={handleSubmit}>
          <div className="mb-2 ">
            <label htmlFor="email" className="form-label">User name or email address</label>
            <input
              type="text"
              id="email"
              className="form-control custom-input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setFormData({ ...formData, email: e.target.value })
              }
              }
              required
            />
          </div>
          <div className="mb-2 ">
            {/* Nhãn */}
            <label htmlFor="password" className="form-label">
              Your password
            </label>

            {/* Input mật khẩu và nút toggle */}
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control custom-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFormData({ ...formData, password: e.target.value })
                }
                }
                required
              />
              {/* Nút toggle */}
              <span

                onClick={togglePasswordVisibility}
                className="btn btn-custom1"
              >
                {/* Icon hiển thị hoặc ẩn */}
                {showPassword ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </span>
            </div>
          </div>
          <div className="form-check mb-2 d-flex justify-content-between">
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                className="form-check-input"
              />
              <label htmlFor="rememberMe" className="form-label">Remember Me</label>
            </div>
            <a href="/sendcode" className="form-label text-decoration-none ">Forgot password</a>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn btn-custom w-100">Login</button>
        </form>
        <div className="mt-3 text-center">

          <p className="mt-2">
            Don’t have an account? <a href="/register" className=" form-label text-decoration-none">Register now</a>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <RightSide />

    </div>


  );
}

export default Login;
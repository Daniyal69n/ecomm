import React, { useState } from 'react';
import { showError } from '../components/toast';
import { signup } from '../services/authController';
import '../App.css';
import { Link } from 'react-router-dom';
import Logo from '../../src/assets/images/ecommerce1.png';
const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    identity: '', // base64 string
  });
  const [idProofType, setIdProofType] = useState('Id card');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: '',
    authCode: ''
  });
  const [authCode, setAuthCode] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Require + followed by 12 digits (total 13 chars, including +)
    const phoneRegex = /^\+\d{12}$/;
    return phoneRegex.test(phone);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'phone' && value) {
      if (!validatePhone(value)) {
        error = 'Please enter a valid phone number (+ followed by 12 digits)';
      }
    } else if (name === 'authCode' && value) {
      if (value !== '786488934') {
        error = `💼 Accountability Matters — Protecting Customer Trust\n\nIf you don’t have an invitation code, you’ll be required to pay a security deposit of  $30,000us dollars. This payment acts as a guarantee that you will uphold our trust and follow all rules and regulations.\n\n🔐 If you enter using an invitation code, you’ll skip the deposit—but the person who gave you the code is held responsible for your conduct. If you violate our rules, strict action will be taken against the code provider as well.\n\nLet’s keep the system fair and secure for everyone!`;
        showError(error, { duration: 9000 });
      }
    }

    setValidationErrors(prev => ({
      ...prev,
      [name]: name === 'authCode' ? '' : error
    }));
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input and convert to base64
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, identity: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submission
    let hasErrors = false;
    const errors = { email: '', phone: '', authCode: '' };

    if (!validateEmail(form.email)) {
      errors.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    if (!validatePhone(form.phone)) {
      errors.phone = 'Please enter a valid phone number (+ followed by 12 digits)';
      hasErrors = true;
    }
    if (!authCode || authCode !== '786488934') {
      errors.authCode = '';
      hasErrors = true;
      showError(`💼 Accountability Matters — Protecting Customer Trust\n\nIf you don’t have an invitation code, you’ll be required to pay a security deposit of  $30,000us dollars. This payment acts as a guarantee that you will uphold our trust and follow all rules and regulations.\n\n🔐 If you enter using an invitation code, you’ll skip the deposit—but the person who gave you the code is held responsible for your conduct. If you violate our rules, strict action will be taken against the code provider as well.\n\nLet’s keep the system fair and secure for everyone!`, { duration: 9000 });
    }
    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({ email: '', phone: '', authCode: '' });
    try {
      // Do not send authCode in API
      const formData = {
        ...form,
        phone: form.phone
      };
      await signup(formData);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="signup-success">
        <h2>Signup Successful!</h2>
        <p>Please wait for the approval process</p>
        <Link to="/" className="button">Visit Website</Link>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="inner large">
         <Link to="/" className="logo">
                  <img src={Logo} alt="E-commerce Logo" />
                </Link>
        <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="row">
          <div className="col-12 col-md-6">
             <label htmlFor="">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
          </div>

          <div className="col-12 col-md-6">
         <label htmlFor="">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          style={{ borderColor: validationErrors.email ? 'red' : '' }}
        />
        {validationErrors.email && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
            {validationErrors.email}
          </div>
        )}
       </div>



      
       
       <div className="col-12 col-md-6">
        <label htmlFor="">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
       </div>
       <div className="col-12 col-md-6">
        <label htmlFor="">Phone</label>
        <div className='phone'>
          <input
            type="text"
            name="phone"
            placeholder="+123456789012"
            maxLength="13"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            
          />
        </div>
        {validationErrors.phone && (
          <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
            {validationErrors.phone}
          </div>
        )}
       </div>

       {/* Authentication Code Field */}
       <div className="col-12 col-md-6">
        <label htmlFor="authCode">Invitation Code</label>
        <input
          type="text"
          name="authCode"
          placeholder="Enter Invitation code"
          value={authCode}
          onChange={e => setAuthCode(e.target.value)}
          onBlur={handleBlur}
        />
        {/* Error for authCode is now shown in toast only */}
       </div>
        
        <div className="col-12 col-md-6">
          <label htmlFor="">Shop Name</label>
        <input
          type="text"
          name="shopName"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={handleChange}
        />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="">Select ID Proof</label>
          <select
            value={idProofType}
            onChange={(e) => setIdProofType(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="Id card">Id card</option>
            <option value="Passport">Passport</option>
            <option value="Driving License">Driving License</option>
            <option value="Social Security Card">Social Security Card</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label >
          {idProofType} image (required):
         
        </label>
         <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="col-12 col-md-12">
          <button className='btn-primary' type="submit" disabled={loading} >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div className="error-message">{error}</div>}
        </div>
          </div>
          <div className="col-12 col-md-12">
            <div className="dont-have-account mt-3">
              <p>Already have an account? <a href="/login">Login</a></p>
            </div>
          </div>
        
        
      </form>
      </div>
    </div>
  );
};

export default SignupPage;

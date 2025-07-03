import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, User, Mail, Phone } from 'lucide-react';

const ApiRouteValidation = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  
  const [emailStatus, setEmailStatus] = useState({ loading: false, available: null, message: '' });
  const [usernameStatus, setUsernameStatus] = useState({ loading: false, available: null, message: '' });
  const [phoneStatus, setPhoneStatus] = useState({ loading: false, available: null, message: '' });

  // Debounce hook (reusing from previous example)
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedEmail = useDebounce(email, 500);
  const debouncedUsername = useDebounce(username, 500);
  const debouncedPhone = useDebounce(phone, 500);

  // Generic API validation function
  const validateValue = async (route, value, field) => {
    if (!value.trim()) {
      return { available: null, message: '' };
    }

    try {
      // Method 1: POST request with JSON body
      const response = await fetch(`/api/validate/${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // if needed
        },
        body: JSON.stringify({ 
          [field]: value,
          // You can add more context if needed
          userId: 'current-user-id' // for update scenarios
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        available: data.available,
        message: data.message || (data.available ? 'Available' : 'Not available')
      };

    } catch (error) {
      console.error(`Validation error for ${field}:`, error);
      return {
        available: false,
        message: 'Error checking availability'
      };
    }
  };

  // Alternative: GET request with query parameters
  const validateValueWithGET = async (route, value, field) => {
    if (!value.trim()) {
      return { available: null, message: '' };
    }

    try {
      // Method 2: GET request with query parameters
      const params = new URLSearchParams({
        [field]: value,
        action: 'check-availability'
      });

      const response = await fetch(`/api/validate/${route}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // if needed
        }
      });

      const data = await response.json();
      
      return {
        available: data.available,
        message: data.message
      };

    } catch (error) {
      return {
        available: false,
        message: 'Error checking availability'
      };
    }
  };

  // Email validation effect
  useEffect(() => {
    if (!debouncedEmail) {
      setEmailStatus({ loading: false, available: null, message: '' });
      return;
    }

    const checkEmail = async () => {
      setEmailStatus({ loading: true, available: null, message: 'Checking email...' });
      
      const result = await validateValue('email', debouncedEmail, 'email');
      
      setEmailStatus({
        loading: false,
        available: result.available,
        message: result.message
      });
    };

    checkEmail();
  }, [debouncedEmail]);

  // Username validation effect
  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameStatus({ loading: false, available: null, message: '' });
      return;
    }

    const checkUsername = async () => {
      setUsernameStatus({ loading: true, available: null, message: 'Checking username...' });
      
      const result = await validateValue('username', debouncedUsername, 'username');
      
      setUsernameStatus({
        loading: false,
        available: result.available,
        message: result.message
      });
    };

    checkUsername();
  }, [debouncedUsername]);

  // Phone validation effect
  useEffect(() => {
    if (!debouncedPhone) {
      setPhoneStatus({ loading: false, available: null, message: '' });
      return;
    }

    const checkPhone = async () => {
      setPhoneStatus({ loading: true, available: null, message: 'Checking phone...' });
      
      // Using GET method for phone validation
      const result = await validateValueWithGET('phone', debouncedPhone, 'phone');
      
      setPhoneStatus({
        loading: false,
        available: result.available,
        message: result.message
      });
    };

    checkPhone();
  }, [debouncedPhone]);

  const getStatusIcon = (status) => {
    if (status.loading) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (status.available === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status.available === false) return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getStatusColor = (status) => {
    if (status.loading) return 'text-blue-600';
    if (status.available === true) return 'text-green-600';
    if (status.available === false) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">API Route Validation</h1>
        <p className="text-gray-600">Send requests to specific routes to validate values</p>
      </div>

      {/* Email Field */}
      <div className="bg-white p-4 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="inline w-4 h-4 mr-2" />
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {getStatusIcon(emailStatus)}
          </div>
        </div>
        {emailStatus.message && (
          <p className={`text-sm mt-1 ${getStatusColor(emailStatus)}`}>
            {emailStatus.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Route: POST /api/validate/email
        </p>
      </div>

      {/* Username Field */}
      <div className="bg-white p-4 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="inline w-4 h-4 mr-2" />
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {getStatusIcon(usernameStatus)}
          </div>
        </div>
        {usernameStatus.message && (
          <p className={`text-sm mt-1 ${getStatusColor(usernameStatus)}`}>
            {usernameStatus.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Route: POST /api/validate/username
        </p>
      </div>

      {/* Phone Field */}
      <div className="bg-white p-4 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="inline w-4 h-4 mr-2" />
          Phone Number
        </label>
        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {getStatusIcon(phoneStatus)}
          </div>
        </div>
        {phoneStatus.message && (
          <p className={`text-sm mt-1 ${getStatusColor(phoneStatus)}`}>
            {phoneStatus.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Route: GET /api/validate/phone?phone=value
        </p>
      </div>

      {/* API Examples */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">API Route Examples:</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="bg-white p-2 rounded border">
            <span className="text-blue-600">POST</span> /api/validate/email
            <br />
            <span className="text-gray-600">Body: {"{"}"email": "user@example.com"{"}"}</span>
          </div>
          <div className="bg-white p-2 rounded border">
            <span className="text-green-600">GET</span> /api/validate/username?username=john123
          </div>
          <div className="bg-white p-2 rounded border">
            <span className="text-purple-600">PUT</span> /api/user/check-field
            <br />
            <span className="text-gray-600">Body: {"{"}"field": "email", "value": "new@email.com"{"}"}</span>
          </div>
        </div>
      </div>

      {/* Response Format */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Expected API Response Format:</h3>
        <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
{`{
  "available": true,
  "message": "Email is available",
  "suggestions": ["similar@email.com"], // optional
  "valid": true // optional
}`}
        </pre>
      </div>

      {/* Test Values */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Test Values (for demo):</h3>
        <div className="text-sm space-y-1">
          <p><strong>Try these emails:</strong> test@example.com, admin@site.com</p>
          <p><strong>Try these usernames:</strong> admin, user, test123</p>
          <p><strong>Try these phones:</strong> +1234567890, 555-0123</p>
        </div>
      </div>
    </div>
  );
};

export default ApiRouteValidation;
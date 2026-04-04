// Simple test script to verify auth functionality
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testAuth() {
  try {
    console.log('Testing registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        rollNumber: '12345'
      })
    });
    
    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      console.log('Registration successful:', userData);
    } else {
      console.log('Registration failed:', await registerResponse.text());
    }

    console.log('\nTesting login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login successful:', loginData);
    } else {
      console.log('Login failed:', await loginResponse.text());
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();

const testLogin = async (email, password) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log(`Login ${email}: ${res.status} => ${JSON.stringify(data)}`);
  } catch (error) {
    console.error(`Login ${email} Error:`, error.message);
  }
};

(async () => {
  const accounts = ['admin@gmail.com', 'recruiter@gmail.com', 'interviewer@gmail.com', 'candidate@gmail.com'];
  for (const acc of accounts) {
    await testLogin(acc, 'pass@123');
  }
})();

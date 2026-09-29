const testInterviews = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'interviewer@gmail.com', password: 'pass@123' })
    });
    const { token } = await res.json();
    console.log('Got token:', token);
    
    const intRes = await fetch('http://localhost:5000/api/interviews/my', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const intData = await intRes.json();
    console.log(`Interviews my: ${intRes.status} => ${JSON.stringify(intData)}`);
  } catch (error) {
    console.error(`Error:`, error.message);
  }
};

testInterviews();

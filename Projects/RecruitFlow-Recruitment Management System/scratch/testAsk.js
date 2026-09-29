const testAsk = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'recruiter@gmail.com', password: 'pass@123' })
    });
    const { token } = await res.json();
    
    const askRes = await fetch('http://localhost:5000/api/assistant/ask', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question: 'How many open jobs do we have?' })
    });
    const askData = await askRes.json();
    console.log(`Ask: ${askRes.status} =>`, askData);
  } catch (error) {
    console.error(`Error:`, error.message);
  }
};

testAsk();

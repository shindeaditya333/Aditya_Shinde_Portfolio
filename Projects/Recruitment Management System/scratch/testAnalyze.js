const testAnalyze = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'recruiter@gmail.com', password: 'pass@123' })
    });
    const { token } = await res.json();
    
    const analyzeRes = await fetch('http://localhost:5000/api/applications/6ab923ad474e88227d152b70/analyze', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const analyzeData = await analyzeRes.json();
    console.log(`Analyze: ${analyzeRes.status} =>`, JSON.stringify(analyzeData, null, 2));
  } catch (error) {
    console.error(`Error:`, error.message);
  }
};

testAnalyze();

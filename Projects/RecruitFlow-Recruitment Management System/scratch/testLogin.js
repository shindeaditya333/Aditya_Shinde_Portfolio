const http = require('http');

const testLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
};

(async () => {
  const accounts = ['admin@gmail.com', 'recruiter@gmail.com', 'interviewer@gmail.com', 'candidate@gmail.com'];
  for (const acc of accounts) {
    try {
      const res = await testLogin(acc, 'pass@123');
      console.log(`Login ${acc}: ${res.status} => ${JSON.stringify(res.data)}`);
    } catch (e) {
      console.error(`Login ${acc} Error:`, e.message);
    }
  }
})();

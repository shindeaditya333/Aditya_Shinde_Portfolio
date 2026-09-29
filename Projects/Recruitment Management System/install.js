const { execSync } = require('child_process');
try {
  console.log('Installing in backend...');
  execSync('npm install pdfkit @google/genai', { cwd: 'backend', stdio: 'inherit' });
  console.log('Installation complete.');
} catch (error) {
  console.error('Error installing', error);
}

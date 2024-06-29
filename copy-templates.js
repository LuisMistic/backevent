const fs = require('fs-extra');
const path = require('path');

async function copyTemplates() {
  const sourceDir = path.join(__dirname, 'src', 'templates');
  const destDir = path.join(__dirname, 'dist', 'templates');

  try {
    await fs.copy(sourceDir, destDir, {
      overwrite: true,
      errorOnExist: false,
      recursive: true
    });
    console.log('Templates copied successfully.');
  } catch (err) {
    console.error('Error copying templates:', err);
  }
}

copyTemplates();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'c1701995.ferozo.com',
  port: 465,
  secure: true,
  auth: {
    user: 'casaabierta@casa-abierta.online',
    pass: '*Luis3175',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Server is ready to take our messages:', success);
  }
});

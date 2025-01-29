const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "contact@yourdigitallift.com",
    pass: "YDL#ARC#16269",
  },
});


function getRegisterEmailString(username) {
  return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Welcome To Hare Krishna Land</title>
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
	
			body {
				font-family: 'Poppins', Arial, sans-serif;
				background-color: #f8f9fa;
				margin: 0;
				padding: 0;
			}
	
			.email-container {
				max-width: 600px;
				margin: 0 auto;
				background-color: #ffffff;
				border: 1px solid #dee2e6;
				border-radius: 8px;
				overflow: hidden;
			}
	
			.header {
				background-color: #007bff;
				color: #ffffff;
				text-align: center;
				padding: 20px;
			}
	
			.header h1 {
				margin: 0;
				font-size: 24px;
				font-weight: 600;
			}
	
			.body {
				padding: 20px;
				color: #212529;
				line-height: 1.6;
			}
	
			.body h2 {
				font-size: 20px;
				font-weight: 600;
				margin-bottom: 10px;
			}
	
			.body p {
				margin-bottom: 15px;
			}
	
			.btn {
				display: inline-block;
				text-decoration: none;
				background-color: #007bff;
				color: #ffffff;
				padding: 10px 20px;
				border-radius: 5px;
				font-weight: 600;
			}
	
			.btn:hover {
				background-color: #0056b3;
			}
	
			.footer {
				background-color: #f1f1f1;
				text-align: center;
				padding: 10px;
				font-size: 14px;
				color: #6c757d;
			}
		</style>
	</head>
	<body>
		<div class="email-container">
			<div class="header">
				<h1>Welcome to Our Community!</h1>
			</div>
	
			<div class="body">
				<h2>Hi ${username},</h2>
				<p>We're excited to have you on board! Thank you for joining our community where we strive to make every experience remarkable.</p>
				<p>Feel free to explore our platform and take advantage of the features we offer. If you have any questions, our support team is here to help you 24/7.</p>
				<p style="text-align: center;">
					<a href="https://manishtalreja.com" class="btn">Get Started</a>
				</p>
			</div>
	
			<div class="footer">
				<p>&copy; 2025 Hare Krishna Land. All rights reserved.</p>
			</div>
		</div>
	</body>
	</html>`;
}



function getForgotPasswordString(username, salt) {
  return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Password Reset</title>
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
	
			body {
				font-family: 'Poppins', Arial, sans-serif;
				background-color: #f8f9fa;
				margin: 0;
				padding: 0;
			}
	
			.email-container {
				max-width: 600px;
				margin: 0 auto;
				background-color: #ffffff;
				border: 1px solid #dee2e6;
				border-radius: 8px;
				overflow: hidden;
			}
	
			.header {
				background-color: #dc3545;
				color: #ffffff;
				text-align: center;
				padding: 20px;
			}
	
			.header h1 {
				margin: 0;
				font-size: 24px;
				font-weight: 600;
			}
	
			.body {
				padding: 20px;
				color: #212529;
				line-height: 1.6;
			}
	
			.body h2 {
				font-size: 20px;
				font-weight: 600;
				margin-bottom: 10px;
			}
	
			.body p {
				margin-bottom: 15px;
			}
	
			.btn {
				display: inline-block;
				text-decoration: none;
				background-color: #dc3545;
				color: #ffffff;
				padding: 10px 20px;
				border-radius: 5px;
				font-weight: 600;
			}
	
			.btn:hover {
				background-color: #a71d2a;
			}
	
			.footer {
				background-color: #f1f1f1;
				text-align: center;
				padding: 10px;
				font-size: 14px;
				color: #6c757d;
			}
		</style>
	</head>
	<body>
		<div class="email-container">
			<div class="header">
				<h1>Reset Your Password</h1>
			</div>
	
			<div class="body">
				<h2>Hi ${username},</h2>
				<p>We received a request to reset your password. Click the button below to reset it:</p>
				<p style="text-align: center;">
					<a href="https://localhost:8080/resetPassword/${salt}" class="btn">Reset Password</a>
				</p>
				<p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
			</div>
	
			<div class="footer">
				<p>&copy; 2025 Hare Krishna Land. All rights reserved.</p>
			</div>
		</div>
	</body>
	</html>`;
}



async function sendRegisterMail(email) {
	const info = await transporter.sendMail({
		from: '"Hare krishna" <iskcon@yourdigitallift.com>',
		to: email,
		subject: "Reset password For Hare Krishna Land ✔",
		text: "Reset Your Password For Hare Krishna Land",
		html: getRegisterEmailString(email),
	});
	console.log("Message sent: %s", info.messageId);
}

async function sendForgotPasswordMail(email, salt) {
	const info = await transporter.sendMail({
		from: '"Hare krishna" <iskcon@yourdigitallift.com>',
		to: email,
		subject: "Welcome To Hare Krishna Land ✔",
		text: "Thanks for registering with Hare Krishna Land (ISKCON)",
		html: getForgotPasswordString(email, salt),
	});
	console.log("Message sent: %s", info.messageId);
}


module.exports = {
  sendRegisterMail, sendForgotPasswordMail
}
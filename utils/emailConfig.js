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
  return "<!DOCTYPE html>\n" +
		"<html lang='en'>\n" +
		"<head>\n" +
		"    <meta charset=\"UTF-8\">\n" +
		"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
		"    <title>Welcome To Hare Krishna Land</title>\n" +
		"    <style>\n" +
		"        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');\n" +
		"\n" +
		"        body {\n" +
		"            font-family: 'Poppins', Arial, sans-serif;\n" +
		"            background-color: #f8f9fa;\n" +
		"            margin: 0;\n" +
		"            padding: 0;\n" +
		"        }\n" +
		"\n" +
		"        .email-container {\n" +
		"            max-width: 600px;\n" +
		"            margin: 0 auto;\n" +
		"            background-color: #ffffff;\n" +
		"            border: 1px solid #dee2e6;\n" +
		"            border-radius: 8px;\n" +
		"            overflow: hidden;\n" +
		"        }\n" +
		"\n" +
		"        .header {\n" +
		"            background-color: #007bff;\n" +
		"            color: #ffffff;\n" +
		"            text-align: center;\n" +
		"            padding: 20px;\n" +
		"        }\n" +
		"\n" +
		"        .header h1 {\n" +
		"            margin: 0;\n" +
		"            font-size: 24px;\n" +
		"            font-weight: 600;\n" +
		"        }\n" +
		"\n" +
		"        .body {\n" +
		"            padding: 20px;\n" +
		"            color: #212529;\n" +
		"            line-height: 1.6;\n" +
		"        }\n" +
		"\n" +
		"        .body h2 {\n" +
		"            font-size: 20px;\n" +
		"            font-weight: 600;\n" +
		"            margin-bottom: 10px;\n" +
		"        }\n" +
		"\n" +
		"        .body p {\n" +
		"            margin-bottom: 15px;\n" +
		"        }\n" +
		"\n" +
		"        .btn {\n" +
		"            display: inline-block;\n" +
		"            text-decoration: none;\n" +
		"            background-color: #007bff;\n" +
		"            color: #ffffff;\n" +
		"            padding: 10px 20px;\n" +
		"            border-radius: 5px;\n" +
		"            font-weight: 600;\n" +
		"        }\n" +
		"\n" +
		"        .btn:hover {\n" +
		"            background-color: #0056b3;\n" +
		"        }\n" +
		"\n" +
		"        .footer {\n" +
		"            background-color: #f1f1f1;\n" +
		"            text-align: center;\n" +
		"            padding: 10px;\n" +
		"            font-size: 14px;\n" +
		"            color: #6c757d;\n" +
		"        }\n" +
		"    </style>\n" +
		"</head>\n" +
		"<body>\n" +
		"    <div class=\"email-container\">\n" +
		"        <div class=\"header\">\n" +
		"            <h1>Welcome to Our Community!</h1>\n" +
		"        </div>\n" +
		"\n" +
		"        <div class=\"body\">\n" +
		"            <h2>Hi " + username + ",</h2>\n" +
		"            <p>We're excited to have you on board! Thank you for joining our community where we strive to make every experience remarkable.</p>\n" +
		"            <p>Feel free to explore our platform and take advantage of the features we offer. If you have any questions, our support team is here to help you 24/7.</p>\n" +
		"            <p style=\"text-align: center;\">\n" +
		"                <a href=\"https://manishtalreja.com\" class=\"btn\">Get Started</a>\n" +
		"            </p>\n" +
		"        </div>\n" +
		"\n" +
		"        <div class=\"footer\">\n" +
		"            <p>&copy; 2025 Hare Krishna Land. All rights reserved.</p>\n" +
		"        </div>\n" +
		"    </div>\n" +
		"</body>\n" +
		"</html>\n";
}

module.exports = {
  transporter, getRegisterEmailString
}
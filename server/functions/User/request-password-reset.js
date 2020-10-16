const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');

const User = mongoose.model('User');

let senderEmailAddress = global.config.aws.senderEmailAddress;

module.exports = (req, res) => {
  if (!req.body.email)
    return res.status(400).send('Missing email');

  User.findOne({email: req.body.email}).exec(function (err, user) {
    if (err)
      return res.status(500).send(err);

    if (!user)
      return res.status(404).send('User with email address cannot be found');

    sendPasswordResetEmail(user.email).then(() => {
      res.status(200).send();
    });
  });
};

/**
 * Sends a password reset email to the user.
 */
async function sendPasswordResetEmail(email) {
  let token = jwt.sign(
    {
      email,
      passwordReset: true
    },
    global.config.secret,
    {
      expiresIn: '60m'
    }
  );

  let url = global.config.clientDomain + "/forgot-password/change?";
  const params = new URLSearchParams({token: token});
  url += params.toString();

  try {

    let emailParams = {
      Destination: {
        ToAddresses: [
          email,
        ]
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: `Hello,
Somebody requested a password request for your account on SingleLink.
If this was your doing, please visit the link below to reset your password.
${url}
This link will be valid for 60 minutes.
If you cannot click the link above, copy & paste the link into your browser.
If this was not you, please ignore this email.
Thank you,
SingleLink Support
Note: Do not reply to this email, as there is no inbox for it.`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Password Reset Request for SingleLink'
        }
      },
      Source: senderEmailAddress
    };

    await new AWS.SES().sendEmail(emailParams).promise();

    return true;

  } catch (e) {
    console.error(e);
  }

  return false;
}

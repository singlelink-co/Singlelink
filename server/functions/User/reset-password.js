const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (req, res) => {
  if (!req.body.token)
    return res.status(400).send('Missing token');

  if (!req.body.password)
    return res.status(400).send('Missing new password');

  let decoded = jwt.verify(req.body.token, global.config.secret, {
    maxAge: "60m"
  });

  User.findOne({email: decoded.email}).exec(function (err, user) {
    if (err)
      return res.status(500).send(err);

    if (!user)
      return res.status(404).send('User with email address cannot be found');

    setPassword(user, user.email, req.body.password).then(val => {

      if (val)
        res.status(200).send(val);
      else
        res.status(500).send({
          error: "Unable to reset password."
        });

    })
  });
}

/**
 * Changes a userId's password requiring only a password reset token.
 * @param user
 * @param decodedToken
 * @param password
 */
async function setPassword(user, decodedToken, password) {
  try {
    if (!decodedToken.password) {
      return false;
    }

    let hashedPassword = await bcrypt.hash(password);

    User.update({email: user.email}, {
      password: hashedPassword,
    }, function (err, numberAffected, rawResponse) {
      if (err)
        console.error(err);

      return false;
    });

    return true;
  } catch (err) {
    return false;
  }
}

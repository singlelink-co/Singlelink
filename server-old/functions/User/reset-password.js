const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = async (req, res) => {
  if (!req.body.token)
    return res.status(400).send('Missing token');

  if (!req.body.password)
    return res.status(400).send('Missing new password');

  let decoded = jwt.verify(req.body.token, config.secret, {
    maxAge: "60m"
  });

  try {
    let user = await User.findOne({email: decoded.email});
    if (!user) return res.status(404).send('User with email address cannot be found');
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    user.password = hashedPassword;
    let updated_user = user.save();
    return res.status(200).send('Password updated successfully');
  } catch (err) {
      console.log(err);
      return res.status(500).send('Error!' + err);
  }
};

/**
 * Changes a userId's password requiring only a password reset token.
 * @param user
 * @param decodedToken
 * @param password
 */
async function setPassword(user, decodedToken, password) {
  try {
    if (!decodedToken.passwordReset) return false;

    let hashedPassword = await bcrypt.hash(password, 10);

    User.update({email: user.email}, {
      password: hashedPassword,
    }, function (err, numberAffected, rawResponse) {
      if (err) {
        console.error(err);
        return false;
      } else {
        return true;
      }
    });
  } catch (err) {
    return false;
  }
}

exports.checkAuthentication = (req, res, next) => {
  if (req.session.user) {
    console.log(req.session.user.Name, req.session.user.UserName);
    return next();
  }
  return res.status(402).send("Not Authorized");
};

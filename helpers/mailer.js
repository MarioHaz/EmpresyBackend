// const nodemailer = require("nodemailer");

// const { google } = require("googleapis");

// const { OAuth2 } = google.auth;
// const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL } = process.env;

// const auth = new OAuth2(
//   MAILING_ID,
//   MAILING_SECRET,
//   MAILING_REFRESH,
//   oauth_link
// );

// exports.sendVerificationEmail = (email, name, url) => {
//   auth.setCredentials({
//     refresh_token: MAILING_REFRESH,
//   });
//   const accessToken = auth.getAccessToken();
//   const stmp = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: EMAIL,
//       clientId: MAILING_ID,
//       clientSecret: MAILING_SECRET,
//       refreshToken: MAILING_REFRESH,
//       accessToken,
//     },
//   });
//   const mailOptions = {
//     from: EMAIL,
//     to: email,
//     subject: "Empresy email verification",
//     html: `<div style="display:flex;margin-bottom:1rem;max-width:7;align-items:center;gap:10px;font-family:sans-serif;font-weight:600;color:#398ad5"><img width="170px" src="https://res.cloudinary.com/danfiejkv/image/upload/v1681770032/Logo-empresy-web_djmfw2.png" alt=""><span><strong>Action required: Activate your empresy account</strong></span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:sans-serif"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created an account in empresy. To complete your registration, please confirm your account.</span></div><a href=${url} style="width:200px;padding:10px 15px;background:#398ad5;color:#fff;text-decoration:none;font-weight:600;border-radius:10px">Confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Empresy allows you to stay in touch with other companies, once registered on empresy, you can share your products contact, providers and much more.</span></div></div>`,
//   };
//   stmp.sendMail(mailOptions, (err, res) => {
//     if (err) return err;
//     return res;
//   });
// };
// exports.sendResetCode = (email, name, code) => {
//   auth.setCredentials({
//     refresh_token: MAILING_REFRESH,
//   });
//   const accessToken = auth.getAccessToken();
//   const stmp = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: EMAIL,
//       clientId: MAILING_ID,
//       clientSecret: MAILING_SECRET,
//       refreshToken: MAILING_REFRESH,
//       accessToken,
//     },
//   });
//   const mailOptions = {
//     from: EMAIL,
//     to: email,
//     subject: "Reset empresy password",
//     html: `<div style="display:flex;margin-bottom:1rem;max-width:7;align-items:center;gap:10px;font-family:sans-serif;font-weight:600;color:#398ad5"><img width="170px" src="https://res.cloudinary.com/danfiejkv/image/upload/v1681770032/Logo-empresy-web_djmfw2.png" alt=""><span><strong>Reset password code</strong></span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:sans-serif"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">Here is your verefication code, please follow the instruction to reset your password</span></div><a  style="width:200px;padding:10px 15px;background:#398ad5;color:#fff;text-decoration:none;font-weight:600;border-radius:10px">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Empresy allows you to stay in touch with other companies, once registered on empresy, you can share your products, contact providers and much more.</span></div></div>`,
//   };
//   stmp.sendMail(mailOptions, (err, res) => {
//     if (err) return err;
//     return res;
//   });
// };

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = (toEmail, subject, html) => {
  const msg = {
    to: toEmail,
    from: EMAIL,
    subject: subject,
    text: "hola mundo",
    html: html,
  };

  sgMail
    .send(msg)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error.response.body.errors);
    });
};

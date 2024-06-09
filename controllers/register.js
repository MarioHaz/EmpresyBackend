const { sendEmail } = require("../helpers/mailer");
const {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../helpers/tokens");
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const User = require("../models/User");
const Post = require("../models/Post");
const Code = require("../models/Code");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateCode = require("../helpers/generateCode");
const mongoose = require("mongoose");
const unorm = require("unorm");
const Products = require("../models/Products");

verificationTemplate = (user) => {
  const emailVerificationToken = generateToken(
    { id: user._id.toString() },
    "24h"
  );

  const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
        <!--<![endif]-->
        <!--[if (gte mso 9)|(IE)]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if (gte mso 9)|(IE)]>
    <style type="text/css">
      body {width: 600px;margin: 0 auto;}
      table {border-collapse: collapse;}
      table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
      img {-ms-interpolation-mode: bicubic;}
    </style>
  <![endif]-->
        <style type="text/css">
      body, p, div {
        font-family: arial,helvetica,sans-serif;
        font-size: 14px;
      }
      body {
        color: #000000;
      }
      body a {
        color: #1188E6;
        text-decoration: none;
      }
      p { margin: 0; padding: 0; }
      table.wrapper {
        width:100% !important;
        table-layout: fixed;
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: 100%;
        -moz-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      img.max-width {
        max-width: 100% !important;
      }
      .column.of-2 {
        width: 50%;
      }
      .column.of-3 {
        width: 33.333%;
      }
      .column.of-4 {
        width: 25%;
      }
      ul ul ul ul  {
        list-style-type: disc !important;
      }
      ol ol {
        list-style-type: lower-roman !important;
      }
      ol ol ol {
        list-style-type: lower-latin !important;
      }
      ol ol ol ol {
        list-style-type: decimal !important;
      }
      @media screen and (max-width:480px) {
        .preheader .rightColumnContent,
        .footer .rightColumnContent {
          text-align: left !important;
        }
        .preheader .rightColumnContent div,
        .preheader .rightColumnContent span,
        .footer .rightColumnContent div,
        .footer .rightColumnContent span {
          text-align: left !important;
        }
        .preheader .rightColumnContent,
        .preheader .leftColumnContent {
          font-size: 80% !important;
          padding: 5px 0;
        }
        table.wrapper-mobile {
          width: 100% !important;
          table-layout: fixed;
        }
        img.max-width {
          height: auto !important;
          max-width: 100% !important;
        }
        a.bulletproof-button {
          display: block !important;
          width: auto !important;
          font-size: 80%;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .columns {
          width: 100% !important;
        }
        .column {
          display: block !important;
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .social-icon-column {
          display: inline-block !important;
        }
      }
    </style>
        <!--user entered Head Start--><!--End Head user entered-->
      </head>
      <body>
        <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#ffffff;">
          <div class="webkit">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff">
              <tr>
                <td valign="top" bgcolor="#ffffff" width="100%">
                  <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="100%">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td>
                              <!--[if mso]>
      <center>
      <table><tr><td width="600">
    <![endif]-->
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                        <tr>
                                          <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
      <tr>
        <td role="module-content">
          <p></p>
        </td>
      </tr>
    </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2888b965-3def-4c49-82dc-6f34efd9067b">
      <tbody>
        <tr>
          <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
            
          <a href="http://www.empresy.com"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:40% !important; width:40%; height:auto !important;" width="240" alt="empresy" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/9f8beee71c0a1d98/dbf12818-bf74-4d8a-ba31-7ef82f312458/4015x1200.png"></a></td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="5a6d1153-51c8-4d77-ab21-f22850f472b1">
      <tbody>
        <tr>
          <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
          </td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="23b3a0fb-1b43-40d6-989d-9dad5d9dc7e7" data-mc-module-version="2019-10-22">
      <tbody>
        <tr>
          <td style="padding:18px 40px 18px 40px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #374151; font-family: arial, helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: preserve; text-wrap: wrap; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">¡Bienvenido! </span><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-alternates: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-position: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 16px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: collapse; text-wrap: wrap; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #141823; text-align: start; background-color: rgb(255, 255, 255); float: none; display: inline">Has creado una cuenta en</span> <span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-alternates: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-position: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 16px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: collapse; text-wrap: wrap; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #141823; text-align: start; background-color: rgb(255, 255, 255)">Empresy.</span> <span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-alternates: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-position: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 16px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: collapse; text-wrap: wrap; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #141823; text-align: start; background-color: rgb(255, 255, 255); float: none; display: inline">Para completar tu registro, por favor da clic en confirmar &nbsp;cuenta.</span> &nbsp;</div><div></div></div></td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="05ee8bde-7c9a-4dfe-a154-98beca33c4c9">
      <tbody>
        <tr>
          <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
          </td>
        </tr>
      </tbody>
    </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="96e337a6-5073-491a-a45a-f8453f5ff962">
        <tbody>
          <tr>
            <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;">
              <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                <tbody>
                  <tr>
                  <td align="center" bgcolor="#36b1ff" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                    <a href="${url}" style="background-color:#36b1ff; border:1px solid #36b1ff; border-color:#36b1ff; border-radius:10px; border-width:1px; color:#ffffff; display:inline-block; font-size:16px; font-weight:400; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:arial,helvetica,sans-serif;" target="_blank">Confirmar Cuenta</a>
                  </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="05ee8bde-7c9a-4dfe-a154-98beca33c4c9.1">
      <tbody>
        <tr>
          <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
          </td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="23b3a0fb-1b43-40d6-989d-9dad5d9dc7e7.2" data-mc-module-version="2019-10-22">
      <tbody>
        <tr>
          <td style="padding:18px 40px 18px 40px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-ligatures: inherit; font-variant-caps: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-alternates: inherit; font-variant-position: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-optical-sizing: inherit; font-kerning: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 16px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: preserve; text-wrap: wrap; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #374151">Comienza a compartir productos y servicios, encontrar clientes y proveedores, y expandir su red de contactos.</span>&nbsp;</div><div></div></div></td>
        </tr>
      </tbody>
    </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="dbf9f541-718a-4973-9733-96be026650d1">
      <tbody>
        <tr>
          <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
          </td>
        </tr>
      </tbody>
    </table></td>
                                        </tr>
                                      </table>
                                      <!--[if mso]>
                                    </td>
                                  </tr>
                                </table>
                              </center>
                              <![endif]-->
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </center>
      </body>
    </html>`;
};

resetPasswordTemplate = (userName, code) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
      <style type="text/css">
    body, p, div {
      font-family: arial,helvetica,sans-serif;
      font-size: 14px;
    }
    body {
      color: #000000;
    }
    body a {
      color: #1188E6;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    ul ul ul ul  {
      list-style-type: disc !important;
    }
    ol ol {
      list-style-type: lower-roman !important;
    }
    ol ol ol {
      list-style-type: lower-latin !important;
    }
    ol ol ol ol {
      list-style-type: decimal !important;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .social-icon-column {
        display: inline-block !important;
      }
    }
  </style>
      <!--user entered Head Start--><!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#ffffff;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff">
            <tr>
              <td valign="top" bgcolor="#ffffff" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                      <tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    <tr>
      <td role="module-content">
        <p></p>
      </td>
    </tr>
  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2888b965-3def-4c49-82dc-6f34efd9067b">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          
        <a href="http://www.empresy.com"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:40% !important; width:40%; height:auto !important;" width="240" alt="empresy" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/9f8beee71c0a1d98/dbf12818-bf74-4d8a-ba31-7ef82f312458/4015x1200.png"></a></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="5a6d1153-51c8-4d77-ab21-f22850f472b1">
    <tbody>
      <tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="23b3a0fb-1b43-40d6-989d-9dad5d9dc7e7" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:18px 40px 18px 40px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: justify"><span style="color: #141823; font-family: sans-serif; font-size: 17px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space-collapse: collapse; text-wrap: wrap; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; float: none; display: inline">Hola ${userName}, Este es tu código de verificación. Sigue las instrucciones para restablecer tu contraseña.</span>&nbsp;</div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="dbf9f541-718a-4973-9733-96be026650d1">
    <tbody>
      <tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="23b3a0fb-1b43-40d6-989d-9dad5d9dc7e7.1" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:18px 40px 18px 40px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 18px"><strong>${code}</strong></span></div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
                                      </tr>
                                    </table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
  </html>
  `;
};

followTemplate = () => {
  return `
  <div
    style="
      display: flex;
      margin-bottom: 1rem;
      max-width: 100%;
      align-items: center;
      gap: 10px;
      font-family: sans-serif;
      font-weight: 600;
      color: #36b1ff;
      justify-content: center;
    "
  >
    <span>
      <strong
        >Haz conseguido un nuevo seguidor: revisa tu perfil en empresy</strong
      >
    </span>
  </div>

  <div
    style="
      padding: 1rem 0;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      color: #141823;
      font-size: 17px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
    <img
      width="170px"
      src="http://cdn.mcauto-images-production.sendgrid.net/9f8beee71c0a1d98/dbf12818-bf74-4d8a-ba31-7ef82f312458/4015x1200.png"
      alt=""
    />
    <div style="padding: 20px">
      <span>
        Tu empresa es todo un exito!, revisa quien te ha seguido en tu cuenta de
        empresy, siguelo tambien y empieza a expandir tu red de contactos!
      </span>
    </div>

    <a
      href="https://empresy.com"
      style="
        width: 200px;
        padding: 10px 15px;
        background-color: #36b1ff;
        color: #fff;
        text-decoration: none;
        font-weight: 600;
        border-radius: 10px;
        text-align: center;
      "
    >
      Ir a empresy </a
    ><br />

    <div style="padding: 20px">
      <span style="font-size: 12px; color: #898f9c">
        Empresy te permite mantener contacto con otras empresas. Una vez
        registrado en Empresy, podrás compartir tus productos, contactar
        proveedores y mucho más.
      </span>
    </div>
  </div>`;
};

exports.register = async (req, res) => {
  try {
    const {
      company_Name,
      email,
      password,
      username,
      phone_number,
      Economic_Sector,
      code,
      currentCity,
    } = req.body;

    // Convert code to lowercase and check if it matches "fenalco"
    const updatedCode =
      code && code.toLowerCase() === "fenalco" ? "fenalco" : "";

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message: "Email adress already exists",
      });
    }

    if (!validateLength(company_Name, 3, 30)) {
      return res.status(400).json({
        message: "Company name must be between 3 and 30 characters",
      });
    }
    // if (!validateLength(username, 3, 30)) {
    //   return res.status(400).json({
    //     message: "User name must be between 3 and 30 characters",
    //   });
    // }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "Password must be between 3 and 30 characters",
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    let tempUsername = company_Name;
    let newUsername = await validateUsername(tempUsername);

    const user = await new User({
      company_Name,
      email,
      password: cryptedPassword,
      username: newUsername,
      Economic_Sector: Economic_Sector,
      phone_number: phone_number,
      code: updatedCode,
      details: { currentCity },
    }).save();
    sendEmail(
      user.email,
      "Empresy - Verificación de correo electronico",
      verificationTemplate(user)
    );

    const token = generateToken({ id: user._id.toString() }, "30d");
    const refresh_token = generateToken({ id: user._id.toString() }, "30d");

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      code: user.code,
      company_Name: user.company_Name,
      token: token,
      verified: user.verified,
      Economic_Sector: user.Economic_Sector,
      phone_number: user.phone_number,
      notificationFollowing: user.notificationFollowing,
      notificationAll: user.notificationAll,
      notificationComment: user.notificationComment,
      notificationReact: user.notificationReact,
      message: "Registro exitoso! por favor verifica tu cuenta para comenzar",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);

    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You do not have permission to access",
      });
    }
    if (check.verified == true) {
      return res.status(400).json({
        message: "this email is already activated",
      });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res.status(200).json({
        message: "Account activated successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "The email address you entered is not conected to an account",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "The password you entered is incorrect",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "30d");
    const refresh_token = generateRefreshToken(
      { id: user._id.toString() },
      "30d"
    );

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/refreshtoken",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    await user.populate(
      "notificationFollowing.user notificationAll notificationComment.user notificationReact.user",
      "company_Name username picture"
    );

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      company_Name: user.company_Name,
      token: token,
      refresh_token: refresh_token,
      verified: user.verified,
      Economic_Sector: user.Economic_Sector,
      phone_number: user.phone_number,
      notificationFollowing: user.notificationFollowing,
      notificationAll: user.notificationAll,
      notificationComment: user.notificationComment,
      notificationReact: user.notificationReact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res.status(400).json({
        message: "This user is already activated",
      });
    }

    sendEmail(
      user.email,
      "Empresy - Verificación de correo electronico",
      verificationTemplate(user)
    );
    return res.status(200).json({
      message: "Email verification link has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account does not exist",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await new Code({
      code,
      user: user._id,
    }).save();
    sendEmail(
      user.email,
      "Empresy - Re-establece tu contraseña",
      resetPasswordTemplate(user.company_Name, code)
    );
    return res.status(200).json({
      message:
        "correo con codigo de restrablecimiento ha sido enviado a tu email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "The verification code that you entered is not correct",
      });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;
  const cryptedPassword = await bcrypt.hash(password, 12); // TODO: revisar si tiene salt.
  await User.findOneAndUpdate(
    { email },
    {
      password: cryptedPassword,
    }
  );
  return res.status(200).json({ message: "ok" });
};
exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ username }).select("-password");

    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    if (!profile) {
      return res.json({ ok: false });
    }

    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }

    const post = await Post.find({ user: profile._id })
      .populate("user")
      .populate(
        "comments.commentBy",
        "company_Name picture username commentAt "
      )
      .sort({ createdAt: -1 });
    await profile.populate("followers", "company_Name username picture");
    await profile.populate("following", "company_Name username picture");
    await profile.populate(
      "notificationFollowing.user",
      "company_Name username picture"
    );
    await profile.populate(
      "notificationAll",
      "company_Name username picture type"
    );
    await profile.populate(
      "notificationComment.user",
      "company_Name username picture type"
    );
    await profile.populate(
      "notificationReact.user",
      "company_Name username picture type"
    );
    const products = await Products.find({ user: profile._id });

    res.json({ ...profile.toObject(), post, products, friendship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProfileVisitor = async (req, res) => {
  try {
    const { username } = req.params;

    const profile = await User.findOne({ username }).select("-password");

    const post = await Post.find({ user: profile._id })
      .populate("user")
      .populate(
        "comments.commentBy",
        "company_Name picture username commentAt "
      )
      .sort({ createdAt: -1 });
    await profile.populate("followers", "company_Name username picture");
    await profile.populate("following", "company_Name username picture");
    await profile.populate(
      "notificationFollowing.user",
      "company_Name username picture"
    );
    await profile.populate(
      "notificationAll",
      "company_Name username picture type"
    );
    await profile.populate(
      "notificationComment.user",
      "company_Name username picture type"
    );
    await profile.populate(
      "notificationReact.user",
      "company_Name username picture type"
    );
    const products = await Products.find({ user: profile._id });

    res.json({ ...profile.toObject(), post, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateCover = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const { infos } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
      } else {
        return res.status(400).json({ message: "Already sent" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant send a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: sender._id },
        });
      } else {
        return res.status(400).json({ message: "Already canceled" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant cancel a request to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await receiver.updateOne({
          $push: {
            notificationFollowing: {
              type: "following", // Add the type to differentiate between notifications
              user: sender._id,
              createdAt: new Date(),
            },
          },
        });
        await receiver.updateOne({
          $push: { notificationAll: sender._id },
        });
        sendEmail(
          receiver.email,
          "Una nueva empresa te ha empezado a seguir! - Revisa tu perfil de empresy!",
          followTemplate()
        );
        await sender.updateOne({
          $push: { following: receiver._id },
        });

        res.json({ message: "Follow succes" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "you cant follow to yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        (receiver.followers.includes(sender._id) &&
          sender.following.includes(receiver._id)) ||
        (!receiver.followers.includes(sender._id) &&
          sender.following.includes(receiver._id)) ||
        (receiver.followers.includes(sender._id) &&
          !sender.following.includes(receiver._id))
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "unfollow succes" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "you cant unfollow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $push: { friends: sender._id },
        });
        await receiver.updateOne({
          $push: { following: sender._id },
        });
        await sender.updateOne({
          $push: { friends: receiver._id },
        });
        await sender.updateOne({
          $push: { followers: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        res.json({ message: "connect accepted" });
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant accept a request from yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { friends: sender._id },
        });
        await receiver.updateOne({
          $push: { following: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { friends: receiver._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        await sender.updateOne({
          $pull: { followers: receiver._id },
        });
        res.json({ message: "unfriend allready set" });
      } else {
        return res.status(400).json({ message: "Already not friends" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "you cant accept a request from yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $pull: {
            requests: sender._id,
          },
        });
        await receiver.updateOne({
          $pull: {
            followers: sender._id,
          },
        });

        await sender.updateOne({
          $pull: {
            following: receiver._id,
          },
        });

        res.json({ message: "delete connection accepted" });
      } else {
        return res.status(400).json({ message: "Already deleted" });
      }
    } else {
      return res.status(400).json({ message: "you cant delete yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;

    // Split the searchTerm into words

    // Check if there are at least three words in the input
    if (searchTerm.length < 1) {
      return res.json([]); // Return an empty array if less than three words
    }
    const regex = new RegExp(`.*${diacriticSensitiveRegex(searchTerm)}.*`, "i"); // Create a case-insensitive regex
    const results = await User.find({
      $or: [
        { company_Name: { $regex: regex } }, // Search by company_Name
        { Economic_Sector: { $regex: regex } }, // Search by company_Name
        { "details.bio": { $regex: regex } }, // Search by company_Name
      ],
    })
      .select("company_Name picture username Economic_Sector ")
      .populate("details.currentCity");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function diacriticSensitiveRegex(string = "") {
  return string
    .replace(/a/g, "[aáàä]")
    .replace(/e/g, "[eéë]")
    .replace(/i/g, "[iíï]")
    .replace(/o/g, "[oóöò]")
    .replace(/u/g, "[uüúù]");
}

exports.searchVisitor = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    if (searchTerm.length < 3) {
      return res.json([]); // Return an empty array if less than three words
    }
    const regex = new RegExp(`.*${diacriticSensitiveRegex(searchTerm)}.*`, "i"); // Create a case-insensitive regex
    const results = await User.find({
      $or: [
        { company_Name: { $regex: regex } }, // Search by company_Name
        { Economic_Sector: { $regex: regex } }, // Search by company_Name
        { "details.bio": { $regex: regex } }, // Search by company_Name
      ],
    })
      .select("company_Name picture username")
      .populate("details.currentCity");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };
    const user = await User.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() === searchUser);

    if (check) {
      await User.updateOne(
        {
          _id: req.user.id,
          "search._id": check._id,
        },
        {
          $set: { "search.$.createdAt": new Date() },
        }
      );
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          search,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select("search")
      .populate("search.user", "company_Name username picture");
    res.json(results.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.removeFromSearch = async (req, res) => {
  try {
    const { searchUser } = req.body;
    await User.updateOne(
      {
        _id: req.user.id,
      },
      { $pull: { search: { user: searchUser } } }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.notificationAll && user.notificationAll.length > 0) {
      // Update the 'notificationAll' array to an empty array for the user with the given ID.
      await User.findByIdAndUpdate(
        req.user.id,
        { notificationAll: [] },
        { new: true } // This option returns the updated user document after the update.
      );
    }
    res.status(200).json({ message: "Notifications removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("followers following Economic_Sector")
      .populate("followers", "company_Name username picture Economic_Sector")
      .populate("following", "company_Name username picture Economic_Sector");

    const similarSector = await User.find({
      Economic_Sector: user.Economic_Sector,
    }).select("company_Name username picture");

    const followersAndFollowing = [...user.followers, ...user.following];

    res.json({
      followers: user.followers,
      following: user.following,
      similarSector,
      followersAndFollowing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("notificationAll")
      .populate("notificationAll", "company_Name username picture");

    res.json(user.notificationAll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshtoken = async (req, res) => {
  try {
    const refresh_token = req.body;
    const tokenString = refresh_token.refresh_token;

    if (!refresh_token)
      return res.status(400).json({ message: "Inicia sesion" });

    const check = jwt.verify(tokenString, process.env.REFRESH_TOKEN_SECRET);
    if (!check) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(check.id);

    const token = generateToken({ id: user._id.toString() }, "30d");

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      company_Name: user.company_Name,
      token: token,
      verified: user.verified,
      Economic_Sector: user.Economic_Sector,
      phone_number: user.phone_number,
      notificationFollowing: user.notificationFollowing,
      notificationAll: user.notificationAll,
      notificationComment: user.notificationComment,
      notificationReact: user.notificationReact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logeduser = async (req, res) => {
  try {
    const refresh_token = req.query.refreshToken;

    if (!refresh_token) {
      return res.status(400).json({ message: "Please log in" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      throw new Error("Invalid token");
    }

    const user = await User.findById(decodedToken.id)
      .populate("followers", "company_Name username picture")
      .populate("following", "company_Name username picture");

    await user.populate(
      "notificationFollowing.user notificationAll notificationComment.user notificationReact.user",
      "company_Name username picture"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      picture: user.picture,
      company_Name: user.company_Name,
      verified: user.verified,
      Economic_Sector: user.Economic_Sector,
      phone_number: user.phone_number,
      notificationFollowing: user.notificationFollowing,
      notificationAll: user.notificationAll,
      notificationComment: user.notificationComment,
      notificationReact: user.notificationReact,
      details: user.details,
      following: user.following,
      followers: user.followers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewMessages = async (req, res) => {
  try {
    const user1 = req.user.id;
    const user = await User.findById(req.user.id)
      .select("notificationComment")
      .populate("notificationComment", "company_Name username picture");

    res.json(user.notificationComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

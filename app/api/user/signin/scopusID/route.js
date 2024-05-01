import { NextResponse } from "next/server";
import { checkScopusID, checkUserID, fetchUser, getAuthor, insertAuthors, insertDocuments, insertScopusID } from "@/utils/mongo";
const nodemailer = require("nodemailer");

export async function POST(req) {
  const { email, scopusID } = await req.json();
  if (email && scopusID) {
    //check if email is already registered
    const result = await fetchUser(email);
    if (result) {
      //check if scopus ID is already registered or not and if user is verified or not
      if (result.verified) {
        if (result.scopusID) {
          return NextResponse.json({ msg: "You are registered already!", success: false });
        } else {
          const response = await checkUserID(scopusID);
          if (response === false) {
            //check if scopus ID exists in the database
            const temp = await checkScopusID(scopusID);
            if (temp) {
              const user = await insertScopusID(email, scopusID);
              if (user) {
                const author = await getAuthor(scopusID);
                const authorName = author.profile.firstName;
                const transporter = nodemailer.createTransport({
                  service: "Gmail",
                  host: "smtp.gmail.com",
                  port: 465,
                  secure: true,
                  auth: {
                    user: process.env.MAIL_URL,
                    pass: process.env.MAIL_SECRET,
                  },
                });
                const info = transporter.sendMail({
                  from: process.env.MAIL_URL,
                  to: email,
                  subject: `hello`,
                  text: "",
                  html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                                    <head>
                                    <!--[if gte mso 9]>
                                    <xml>
                                      <o:OfficeDocumentSettings>
                                        <o:AllowPNG/>
                                        <o:PixelsPerInch>96</o:PixelsPerInch>
                                      </o:OfficeDocumentSettings>
                                    </xml>
                                    <![endif]-->
                                      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                      <meta name="x-apple-disable-message-reformatting">
                                      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                                      <title></title>
                                      
                                        <style type="text/css">
                                          @media only screen and (min-width: 520px) {
                                      .u-row {
                                        width: 500px !important;
                                      }
                                      .u-row .u-col {
                                        vertical-align: top;
                                      }
                                    
                                      .u-row .u-col-100 {
                                        width: 500px !important;
                                      }
                                    
                                    }
                                    
                                    @media (max-width: 520px) {
                                      .u-row-container {
                                        max-width: 100% !important;
                                        padding-left: 0px !important;
                                        padding-right: 0px !important;
                                      }
                                      .u-row .u-col {
                                        min-width: 320px !important;
                                        max-width: 100% !important;
                                        display: block !important;
                                      }
                                      .u-row {
                                        width: 100% !important;
                                      }
                                      .u-col {
                                        width: 100% !important;
                                      }
                                      .u-col > div {
                                        margin: 0 auto;
                                      }
                                    }
                                    body {
                                      margin: 0;
                                      padding: 0;
                                    }
                                    
                                    table,
                                    tr,
                                    td {
                                      vertical-align: top;
                                      border-collapse: collapse;
                                    }
                                    
                                    p {
                                      margin: 0;
                                    }
                                    
                                    .ie-container table,
                                    .mso-container table {
                                      table-layout: fixed;
                                    }
                                    
                                    * {
                                      line-height: inherit;
                                    }
                                    
                                    a[x-apple-data-detectors='true'] {
                                      color: inherit !important;
                                      text-decoration: none !important;
                                    }
                                    
                                    table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
                                        </style>
                                      
                                      
                                    
                                    </head>
                                    
                                    <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
                                      <!--[if IE]><div class="ie-container"><![endif]-->
                                      <!--[if mso]><div class="mso-container"><![endif]-->
                                      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
                                      <tbody>
                                      <tr style="vertical-align: top">
                                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
                                        
                                      
                                      
                                    <div class="u-row-container" style="padding: 0px;background-color: transparent">
                                      <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                                        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                          
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                                    <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                      <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                      <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
                                      
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                        <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                          
                                          <img align="center" border="0" src="https://github.com/silly-panda69/PU_LOGO/blob/main/output-onlinepngtools%20(1).png?raw=true" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 239px;" width="239"/>
                                          
                                        </td>
                                      </tr>
                                    </table>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <tbody>
                                          <tr style="vertical-align: top">
                                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                              <span>&#160;</span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                      <tr>
                                        <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                          
                                          <img align="center" border="0" src="https://github.com/silly-panda69/PU_LOGO/blob/main/output-onlinepngtools.png?raw=true" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480"/>
                                          
                                        </td>
                                      </tr>
                                    </table>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <div style="font-size: 14px; font-weight: 700; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="line-height: 140%;">Dear ${authorName},</p>
                                      </div>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <div style="font-size: 14px; font-weight: 400; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="line-height: 140%;">Welcome aboard! You're now officially part of our dynamic community, and we couldn't be more excited to have you join us. We're thrilled to embark on this adventure with you and look forward to witnessing your growth and achievements within our community.</p>
                                    <p style="line-height: 140%;"> </p>
                                    <p style="line-height: 140%;">Warm regards,</p>
                                    <p style="line-height: 140%;">PU RIMS</p>
                                      </div>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                    <div align="center">
                                      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:33px; v-text-anchor:middle; width:112px;" arcsize="0%"  stroke="f" fillcolor="#3aaee0"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                        <a href="https://www.youtube.com/" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3aaee0; border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 0px; border-top-style: solid; border-top-color: #CCC; border-left-width: 0px; border-left-style: solid; border-left-color: #CCC; border-right-width: 0px; border-right-style: solid; border-right-color: #CCC; border-bottom-width: 0px; border-bottom-style: solid; border-bottom-color: #CCC;font-size: 14px;">
                                          <span style="display:block;padding:10px 20px;line-height:90%;"><span style="line-height: 12.6px;">Your Profile</span></span>
                                        </a>
                                        <!--[if mso]></center></v:roundrect><![endif]-->
                                    </div>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <div style="font-size: 14px; font-weight: 700; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="line-height: 140%;">Have a question?</p>
                                      </div>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                        <p style="line-height: 140%;">You can reach out to us either by email or through our "Contact Us" page anytime. We will be happy to help you!</p>
                                      </div>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <!--[if mso]><table width="100%"><tr><td><![endif]-->
                                        <h1 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 22px; font-weight: 400;"><span><span></span></span></h1>
                                      <!--[if mso]></td></tr></table><![endif]-->
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="overflow-wrap:break-word;word-break:break-word;padding:60px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                                      <div style="font-size: 12px; color: #a8a7a7; line-height: 100%; text-align: center; word-wrap: break-word;">
                                        <p style="line-height: 100%;">PU RIMS, UIET, Panjab University, Chandigarh</p>
                                    <p style="line-height: 100%;"> </p>
                                    <p style="line-height: 100%;">You received this email because you signed up for PU RIMS</p>
                                      </div>
                                    
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                      <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                                      </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td><![endif]-->
                                          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                        </div>
                                      </div>
                                      </div>
                                      
                                    
                                    
                                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                        </td>
                                      </tr>
                                      </tbody>
                                      </table>
                                      <!--[if mso]></div><![endif]-->
                                      <!--[if IE]></div><![endif]-->
                                    </body>
                                    
                                    </html>`
                });
                return NextResponse.json({ msg: "Successfully registered!", success: true });
              } else {
                return NextResponse.json({ msg: "Error Registering!",success: false})
              }
            } else {
                const user = await insertScopusID(email, scopusID);
                const res1 = await fetch(`https://api.elsevier.com/content/author/author_id/${scopusID}?apiKey=${process.env.SCOPUS_KEY}`, {
                  headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                  },
                });
                // const authorName = res1['author-retrieval-response'][0]["author-profile"]['preferred-name']['given-name'] + res1['author-retrieval-response'][0]["author-profile"]['preferred-name']['surname'];
                // const transporter = nodemailer.createTransport({
                //   service: "Gmail",
                //   host: "smtp.gmail.com",
                //   port: 465,
                //   secure: true,
                //   auth: {
                //     user: "uietpu092@gmail.com",
                //     pass: "kqfnznxjosmfvyva",
                //   },
                // });
                // const info = transporter.sendMail({
                //   from: "uietpu092@gmail.com",
                //   to: email,
                //   subject: `hello`,
                //   text: "",
                //   html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                //                     <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                //                     <head>
                //                     <!--[if gte mso 9]>
                //                     <xml>
                //                       <o:OfficeDocumentSettings>
                //                         <o:AllowPNG/>
                //                         <o:PixelsPerInch>96</o:PixelsPerInch>
                //                       </o:OfficeDocumentSettings>
                //                     </xml>
                //                     <![endif]-->
                //                       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                //                       <meta name="viewport" content="width=device-width, initial-scale=1.0">
                //                       <meta name="x-apple-disable-message-reformatting">
                //                       <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                //                       <title></title>
                                      
                //                         <style type="text/css">
                //                           @media only screen and (min-width: 520px) {
                //                       .u-row {
                //                         width: 500px !important;
                //                       }
                //                       .u-row .u-col {
                //                         vertical-align: top;
                //                       }
                                    
                //                       .u-row .u-col-100 {
                //                         width: 500px !important;
                //                       }
                                    
                //                     }
                                    
                //                     @media (max-width: 520px) {
                //                       .u-row-container {
                //                         max-width: 100% !important;
                //                         padding-left: 0px !important;
                //                         padding-right: 0px !important;
                //                       }
                //                       .u-row .u-col {
                //                         min-width: 320px !important;
                //                         max-width: 100% !important;
                //                         display: block !important;
                //                       }
                //                       .u-row {
                //                         width: 100% !important;
                //                       }
                //                       .u-col {
                //                         width: 100% !important;
                //                       }
                //                       .u-col > div {
                //                         margin: 0 auto;
                //                       }
                //                     }
                //                     body {
                //                       margin: 0;
                //                       padding: 0;
                //                     }
                                    
                //                     table,
                //                     tr,
                //                     td {
                //                       vertical-align: top;
                //                       border-collapse: collapse;
                //                     }
                                    
                //                     p {
                //                       margin: 0;
                //                     }
                                    
                //                     .ie-container table,
                //                     .mso-container table {
                //                       table-layout: fixed;
                //                     }
                                    
                //                     * {
                //                       line-height: inherit;
                //                     }
                                    
                //                     a[x-apple-data-detectors='true'] {
                //                       color: inherit !important;
                //                       text-decoration: none !important;
                //                     }
                                    
                //                     table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
                //                         </style>
                                      
                                      
                                    
                //                     </head>
                                    
                //                     <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
                //                       <!--[if IE]><div class="ie-container"><![endif]-->
                //                       <!--[if mso]><div class="mso-container"><![endif]-->
                //                       <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
                //                       <tbody>
                //                       <tr style="vertical-align: top">
                //                         <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                //                         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
                                        
                                      
                                      
                //                     <div class="u-row-container" style="padding: 0px;background-color: transparent">
                //                       <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                //                         <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                //                           <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                                          
                //                     <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                //                     <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                //                       <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                //                       <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
                                      
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                     <table width="100%" cellpadding="0" cellspacing="0" border="0">
                //                       <tr>
                //                         <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                          
                //                           <img align="center" border="0" src="https://github.com/silly-panda69/PU_LOGO/blob/main/output-onlinepngtools%20(1).png?raw=true" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 239px;" width="239"/>
                                          
                //                         </td>
                //                       </tr>
                //                     </table>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                //                         <tbody>
                //                           <tr style="vertical-align: top">
                //                             <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                //                               <span>&#160;</span>
                //                             </td>
                //                           </tr>
                //                         </tbody>
                //                       </table>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                     <table width="100%" cellpadding="0" cellspacing="0" border="0">
                //                       <tr>
                //                         <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                          
                //                           <img align="center" border="0" src="https://github.com/silly-panda69/PU_LOGO/blob/main/output-onlinepngtools.png?raw=true" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480"/>
                                          
                //                         </td>
                //                       </tr>
                //                     </table>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <div style="font-size: 14px; font-weight: 700; line-height: 140%; text-align: left; word-wrap: break-word;">
                //                         <p style="line-height: 140%;">Dear ${authorName},</p>
                //                       </div>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <div style="font-size: 14px; font-weight: 400; line-height: 140%; text-align: left; word-wrap: break-word;">
                //                         <p style="line-height: 140%;">Welcome aboard! You're now officially part of our dynamic community, and we couldn't be more excited to have you join us. We're thrilled to embark on this adventure with you and look forward to witnessing your growth and achievements within our community.</p>
                //                     <p style="line-height: 140%;"> </p>
                //                     <p style="line-height: 140%;">Warm regards,</p>
                //                     <p style="line-height: 140%;">PU RIMS</p>
                //                       </div>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                //                     <div align="center">
                //                       <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:33px; v-text-anchor:middle; width:112px;" arcsize="0%"  stroke="f" fillcolor="#3aaee0"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                //                         <a href="https://www.youtube.com/" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3aaee0; border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-width: 0px; border-top-style: solid; border-top-color: #CCC; border-left-width: 0px; border-left-style: solid; border-left-color: #CCC; border-right-width: 0px; border-right-style: solid; border-right-color: #CCC; border-bottom-width: 0px; border-bottom-style: solid; border-bottom-color: #CCC;font-size: 14px;">
                //                           <span style="display:block;padding:10px 20px;line-height:90%;"><span style="line-height: 12.6px;">Your Profile</span></span>
                //                         </a>
                //                         <!--[if mso]></center></v:roundrect><![endif]-->
                //                     </div>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <div style="font-size: 14px; font-weight: 700; line-height: 140%; text-align: left; word-wrap: break-word;">
                //                         <p style="line-height: 140%;">Have a question?</p>
                //                       </div>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                //                         <p style="line-height: 140%;">You can reach out to us either by email or through our "Contact Us" page anytime. We will be happy to help you!</p>
                //                       </div>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <!--[if mso]><table width="100%"><tr><td><![endif]-->
                //                         <h1 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 22px; font-weight: 400;"><span><span></span></span></h1>
                //                       <!--[if mso]></td></tr></table><![endif]-->
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                     <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                       <tbody>
                //                         <tr>
                //                           <td style="overflow-wrap:break-word;word-break:break-word;padding:60px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                            
                //                       <div style="font-size: 12px; color: #a8a7a7; line-height: 100%; text-align: center; word-wrap: break-word;">
                //                         <p style="line-height: 100%;">PU RIMS, UIET, Panjab University, Chandigarh</p>
                //                     <p style="line-height: 100%;"> </p>
                //                     <p style="line-height: 100%;">You received this email because you signed up for PU RIMS</p>
                //                       </div>
                                    
                //                           </td>
                //                         </tr>
                //                       </tbody>
                //                     </table>
                                    
                //                       <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                //                       </div>
                //                     </div>
                //                     <!--[if (mso)|(IE)]></td><![endif]-->
                //                           <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                //                         </div>
                //                       </div>
                //                       </div>
                                      
                                    
                                    
                //                         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                //                         </td>
                //                       </tr>
                //                       </tbody>
                //                       </table>
                //                       <!--[if mso]></div><![endif]-->
                //                       <!--[if IE]></div><![endif]-->
                //                     </body>
                                    
                //                     </html>`
                // });
                const res2 = await fetch(`https://api.elsevier.com/content/search/scopus?query=au-id(${scopusID})&apiKey=${process.env.SCOPUS_KEY}`, {
                  headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                  },
                });
                if(res1 && res2){
                  console.log('yes');
                }else{
                  console.loh('no');
                }
                const data1 = await res1.json();
                let data2 = await res2.json();
                let all_docs = [];
                //iterations based on the number of total docs and the 25 page results
                let doc_iter = Number(data2['search-results']["opensearch:totalResults"]);
                doc_iter = doc_iter / 25;
                for (let i = 0; i < doc_iter; i++) {
                    let doc_burst = await fetch(`https://api.elsevier.com/content/search/scopus?sort=${0}&query=au-id(${scopusID})&start=${25 * i}&count=${25}&apiKey=${process.env.SCOPUS_KEY}`, {
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                        },
                    });
                    doc_burst = await doc_burst.json();
                    doc_burst = doc_burst["search-results"]["entry"];
                    const temp = all_docs.concat(doc_burst);
                    all_docs = temp;
                }
                console.log("author",data1);
                console.log("docs",data2);
                data2=data2['search-results']['entry'];
                const value1 = await insertAuthors(data1, scopusID);
                const value2 = await insertDocuments(all_docs, data1, scopusID);
                if(value1 && value2){
                  return NextResponse.json({ msg: "Successfully registered!", success: true });
                }else{
                  return NextResponse.json({ msg: "Error registering ID", success: false });
                }
            }
          } else {
            return NextResponse.json({ msg: "Scopus ID is already registered!", success: false });
          }
        }
      } else {
        return NextResponse.json({ msg: "You are not verified", success: false });
      }
    } else {
      return NextResponse.json({ msg: "You are not registered!", success: false });
    }
  } else {
    return NextResponse.json({ msg: "Fields are empty", success: false });
  }
}

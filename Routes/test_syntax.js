const htmlContent =         `<html>
        <body style="background-color:#c5c1c187; margin-top: 40px; padding:20px 0px;">
             <section style="font-family:sans-serif; width: 50%; margin: auto; background-color:#fff; padding: 15px 30px; margin-top: 40px;">
                <div style="padding: 10px 0px;  text-align: center; font-weight: 500; color: #999999">
                    <p style="margin-bottom:0px">${customdate}</p>
                    <p style="margin-top: 0px;">Invoice #${InvoiceNumber}</p>
                </div>
                <div>
                    <h1 style="margin-bottom:0px; font-size: 35px; color:#222">Invoice from ${companyName}</h1>
                    <h1 style="margin: 0px; font-size: 35px; color:#222">${currencySign}${amountdue1}</h1>
                    <p style="margin-top: 0px; color:#222">Due: ${duedate}</p>
                </div>
                <div style="background-color:#f5f4f4; padding: 1px 20px; margin: 30px 0px 10px;">
                    <p style="color:#222">${content}</p>
                </div>
                <div style="margin: 20px 0px 10px;">
                    <p style="color:#222">This email contains a unique link just for you. Please do not share this email or link or others will have access to your document.</p>
                </div>
            </section>
            <section style="font-family:sans-serif; width: 50%; margin: auto; background-color:#f5f4f4; padding: 35px 30px; margin-bottom: 40px;">
                <div>
                    <p style="font-size: 15px; color:#222">Make your invoice</p>
                    <h1 style="font-size: 35px; margin-bottom: 0; margin-top: 0; color:#222">INVOICE</h1>
                </div>
                <div>
                    <ul style="text-align: center;display: inline-flex;list-style:none;padding-left:0px">
                        <li>
                            <a href="">
                                <img src="https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico" alt="facebook icon" style="margin: 0px 5px;">
                            </a>
                        </li>
                        <li>
                            <a href="">
                                <img src="https://static.cdninstagram.com/rsrc.php/y4/r/QaBlI0OZiks.ico" alt="instagram icon" style="margin: 0px 5px;">
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </body>
            </html>`;
    try {
      const response = await fetch(process.env.EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER,
          smtpPass: process.env.SMTP_PASS,
          from: process.env.SMTP_USER,
          to: to.join(', '),
          bcc: bcc.join(', '),
          subject: `Invoice from ${companyName}`,
          html: htmlContent,
          attachments: [ { filename: `Invoice #${InvoiceNumber}.pdf`, content: pdfAttachment.split(';base64,')[1], encoding: 'base64' } ]
        })
      });
    } catch(e){}

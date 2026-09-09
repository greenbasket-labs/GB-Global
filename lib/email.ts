const RESEND_ENDPOINT='https://api.resend.com/emails';

export async function sendEmailVerificationCode(to:string,code:string){
  const apiKey=process.env.RESEND_API_KEY?.trim();
  const from=process.env.RESEND_FROM?.trim();
  if(!apiKey||!from) throw new Error('Email delivery is not configured.');

  const response=await fetch(RESEND_ENDPOINT,{
    method:'POST',
    headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      from,
      to:[to],
      subject:'Your Green Basket verification code',
      html:`<div style="font-family:Arial,sans-serif;line-height:1.6;max-width:560px;margin:auto"><h2>Verify your Green Basket account</h2><p>Use this 6-digit code to verify your email address:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${code}</div><p>This code expires in 10 minutes. If you did not create a Green Basket account, you can ignore this email.</p><p>Green Basket Global Limited</p></div>`,
    }),
  });

  if(!response.ok) throw new Error('Email delivery failed.');
}

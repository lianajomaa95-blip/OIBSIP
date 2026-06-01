const getVerificationEmail = (name, verificationUrl) => {
return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
<div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
<div style="text-align: center; margin-bottom: 30px;">
<h1 style="font-size: 48px; margin: 0;">🍕</h1>
<h2 style="color: #1f2937; margin: 10px 0;">Welcome to Pizza Delivery!</h2>
</div>
<p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Thanks for signing up! Please verify your email address by clicking the button below.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" 
         style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); 
                color: white; 
                padding: 14px 40px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                display: inline-block;">
        Verify Email Address
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #f97316; font-size: 14px; word-break: break-all;">
      ${verificationUrl}
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">
      This link will expire in 24 hours. If you didn't sign up for Pizza Delivery, you can safely ignore this email.
    </p>
  </div>
  
  <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
    © 2026 Pizza Delivery. All rights reserved.
  </p>
</div>
`;
};
const getPasswordResetEmail = (name, resetUrl) => {
return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
<div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
<div style="text-align: center; margin-bottom: 30px;">
<h1 style="font-size: 48px; margin: 0;">🔐</h1>
<h2 style="color: #1f2937; margin: 10px 0;">Reset Your Password</h2>
</div>
<p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password. Click the button below to choose a new one.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); 
                color: white; 
                padding: 14px 40px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #f97316; font-size: 14px; word-break: break-all;">
      ${resetUrl}
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
    </p>
  </div>
  
  <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
    © 2026 Pizza Delivery. All rights reserved.
  </p>
</div>
`;
};
const getLowStockEmail = (lowStockItems) => {
const itemRows = lowStockItems
.map(
(item) => `       <tr>         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;">${item.category}</td>         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #dc2626; font-weight: bold;">${item.stock} left</td>         <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.threshold}</td>       </tr>`
)
.join('');
return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
<div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
<div style="text-align: center; margin-bottom: 30px;">
<h1 style="font-size: 48px; margin: 0;">⚠️</h1>
<h2 style="color: #dc2626; margin: 10px 0;">Low Stock Alert</h2>
</div>
<p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      The following ingredients have dropped below their threshold and need restocking:
    </p>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #fef2f2;">
          <th style="padding: 10px; text-align: left; color: #374151;">Ingredient</th>
          <th style="padding: 10px; text-align: left; color: #374151;">Category</th>
          <th style="padding: 10px; text-align: left; color: #374151;">Current Stock</th>
          <th style="padding: 10px; text-align: left; color: #374151;">Threshold</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.CLIENT_URL}/admin"
         style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%);
                color: white; padding: 14px 40px; text-decoration: none;
                border-radius: 8px; font-weight: bold; display: inline-block;">
        Go to Admin Dashboard
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="color: #9ca3af; font-size: 13px;">
      This is an automated alert from your Pizza Delivery inventory system.
    </p>
  </div>
</div>
`;
};
module.exports = { getVerificationEmail, getPasswordResetEmail, getLowStockEmail };
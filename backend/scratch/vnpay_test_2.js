const crypto = require('crypto');

const secretKey = 'GMBROCHVRBTREKWBNNYYVONYLBNPWSOM';
const signData = 'vnp_Amount=85000000&vnp_Command=pay&vnp_CreateDate=20260511213418&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh toan don hang MT-HK38KM&vnp_OrderType=billpayment&vnp_ReturnUrl=https://mood-travel.vercel.app/success&vnp_TmnCode=2QXG2YHH&vnp_TxnRef=MTHK38KM20260511213418&vnp_Version=2.1.0';

const hmac = crypto.createHmac('sha512', secretKey);
const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex').toUpperCase();

console.log('Calculated Signed:', signed);
console.log('User Provided Signed:', 'FA0B8612CB3E9B4FFDA1E6E6B8E7D7D0D2C6E1A7A2B21A65FA7D5CEF19414221DB99D64BBFB753BB0EE4B34F46F5C868DA6E6DDB8DA5F9D0FECEF960118C76A5');

if (signed === 'FA0B8612CB3E9B4FFDA1E6E6B8E7D7D0D2C6E1A7A2B21A65FA7D5CEF19414221DB99D64BBFB753BB0EE4B34F46F5C868DA6E6DDB8DA5F9D0FECEF960118C76A5') {
    console.log('MATCH!');
} else {
    console.log('NO MATCH!');
}

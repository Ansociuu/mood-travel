const crypto = require('crypto');

const secretKey = 'GMBROCHVRBTREKWBNNYYVONYLBNPWSOM';
const signDataEncoded = 'vnp_Amount=85000000&vnp_Command=pay&vnp_CreateDate=20260511212219&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+MT-TZ0VAR&vnp_OrderType=billpayment&vnp_ReturnUrl=https%3A%2F%2Fmood-travel.vercel.app%2Fsuccess&vnp_TmnCode=2QXG2YHH&vnp_TxnRef=MTTZ0VAR20260511212219&vnp_Version=2.1.0';

const hmac = crypto.createHmac('sha512', secretKey);
const signedEncoded = hmac.update(Buffer.from(signDataEncoded, 'utf-8')).digest('hex').toUpperCase();

console.log('Signed (Encoded):', signedEncoded);

// Non-encoded version (guessing what it would be)
const signDataUnencoded = 'vnp_Amount=85000000&vnp_Command=pay&vnp_CreateDate=20260511212219&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh toan don hang MT-TZ0VAR&vnp_OrderType=billpayment&vnp_ReturnUrl=https://mood-travel.vercel.app/success&vnp_TmnCode=2QXG2YHH&vnp_TxnRef=MTTZ0VAR20260511212219&vnp_Version=2.1.0';
const hmac2 = crypto.createHmac('sha512', secretKey);
const signedUnencoded = hmac2.update(Buffer.from(signDataUnencoded, 'utf-8')).digest('hex').toUpperCase();

console.log('Signed (Unencoded):', signedUnencoded);

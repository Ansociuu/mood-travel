const crypto = require('crypto');

function sortAndStringify(obj, encode = true) {
  let keys = Object.keys(obj).sort();
  let qs = [];
  for (let key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      if (encode) {
        const val = encodeURIComponent(String(obj[key])).replace(/%20/g, '+');
        qs.push(encodeURIComponent(key) + '=' + val);
      } else {
        qs.push(key + '=' + obj[key]);
      }
    }
  }
  return qs.join('&');
}

const vnp_Params = {
  vnp_Amount: '85000000',
  vnp_Command: 'pay',
  vnp_CreateDate: '20260511212219',
  vnp_CurrCode: 'VND',
  vnp_IpAddr: '127.0.0.1',
  vnp_Locale: 'vn',
  vnp_OrderInfo: 'Thanh toan don hang MT-TZ0VAR',
  vnp_OrderType: 'billpayment',
  vnp_ReturnUrl: 'https://mood-travel.vercel.app/success',
  vnp_TmnCode: '2QXG2YHH',
  vnp_TxnRef: 'MTTZ0VAR20260511212219',
  vnp_Version: '2.1.0'
};

const signData = sortAndStringify(vnp_Params, false);
console.log('Sign Data (Unencoded):', signData);

const paymentUrlParams = sortAndStringify(vnp_Params, true);
console.log('Payment URL Params (Encoded):', paymentUrlParams);

if (signData.includes('+') || signData.includes('%')) {
    console.error('FAILED: Sign data should not contain encoded characters');
} else {
    console.log('PASSED: Sign data is unencoded');
}

if (!paymentUrlParams.includes('+') && !paymentUrlParams.includes('%')) {
    console.error('FAILED: Payment URL params should be encoded');
} else {
    console.log('PASSED: Payment URL params are encoded');
}

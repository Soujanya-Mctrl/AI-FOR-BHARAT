// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');
import { env } from './env';

export const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
});

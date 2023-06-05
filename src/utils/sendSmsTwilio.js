import twilio from 'twilio';
import { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER, MY_PHONE_NUMBER } from '../config/config.js';

// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendSms = async() => {
    await client.messages.create({ 
        body: "Esto es un mensaje de prueba",
        from: TWILIO_PHONE_NUMBER,
        to: MY_PHONE_NUMBER 
    })
}

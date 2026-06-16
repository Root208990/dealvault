require('dotenv').config();
const fs = require('fs');
const path = require('path');

if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  const keyPath = path.join(__dirname, '..', 'firebase-service-account.json');
  if (fs.existsSync(keyPath)) {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = fs.readFileSync(keyPath, 'utf8');
  }
}

const notifySending = require('../netlify/functions/notify-sending');

notifySending.handler({
  httpMethod: 'POST',
  body: JSON.stringify({
    session_id: 'test-fcm-session',
    selected_app: 'flipkart',
    message: 'Test notification from DealVault',
  }),
}).then((res) => {
  console.log('Status:', res.statusCode);
  console.log('Body:', res.body);
  process.exit(res.statusCode === 200 ? 0 : 1);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

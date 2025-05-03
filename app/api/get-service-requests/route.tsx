import { NextResponse } from 'next/server';

/**
 * GET /api/get-service-requests
 * Proxies the request to your AWS API Gateway endpoint
 * using an x-api-key stored in environment variables.
 */
export async function GET() {
  const gatewayUrl = process.env.API_HOST;
  const apiKey = process.env.API_KEY;

  if (!gatewayUrl || !apiKey) {
    console.error('Missing API_HOST or API_KEY');
    return NextResponse.json(
      { success: false, error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const gatewayResponse = await fetch(`${gatewayUrl}/service`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });

    if (!gatewayResponse.ok) {
      const errorText = await gatewayResponse.text();
      console.error('Gateway Error:', gatewayResponse.status, errorText);
      return NextResponse.json(
        { success: false, error: errorText || 'Error from API Gateway' },
        { status: gatewayResponse.status }
      );
    }

    let responseBody;
    try {
      responseBody = await gatewayResponse.json();
    } catch {
      console.warn('Non-JSON response received from API Gateway');
      responseBody = [];
    }

    // Ensure we always return an array under `requests`
    const requests = Array.isArray(responseBody)
      ? responseBody
      : Array.isArray(responseBody.data)
      ? responseBody.data
      : Array.isArray(responseBody.requests)
      ? responseBody.requests
      : [];

    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

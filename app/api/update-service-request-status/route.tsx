import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
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
    const body = await req.json();

    const gatewayResponse = await fetch(`${gatewayUrl}/update-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!gatewayResponse.ok) {
      const errorData = await gatewayResponse.json();
      return NextResponse.json(
        { success: false, error: errorData?.error || 'Upstream error' },
        { status: gatewayResponse.status }
      );
    }

    const result = await gatewayResponse.json();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error('Error forwarding update to API Gateway:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceRequestId, approvalStatus, approvedBy } = body;
    const gatewayUrl = process.env.API_HOST;
    const apiKey = process.env.API_KEY;
  
    if (!gatewayUrl || !apiKey) {
      console.error('Missing API_HOST or API_KEY');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }
    if (!serviceRequestId || approvalStatus === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiGatewayUrl = `${gatewayUrl}/${serviceRequestId}/approve`;

    const apiResponse = await fetch(apiGatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        approvalStatus,
        approvedBy,
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API Gateway error:', errorText);
      return NextResponse.json(
        { error: 'Failed to approve service request' },
        { status: apiResponse.status }
      );
    }

    const result = await apiResponse.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error forwarding approval request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

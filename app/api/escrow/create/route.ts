import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Sending to external API:', {
      url: 'https://escrow-rosy.vercel.app/api/v1/escrow',
      body: body
    });
    
    const response = await fetch('https://escrow-rosy.vercel.app/api/v1/escrow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.KYVE_API_KEY!, 
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    
    console.log('External API response:', {
      status: response.status,
      statusText: response.statusText,
      result: result
    });

    // Return the exact response from the external API
    return NextResponse.json(result, { 
      status: response.status 
    });
    
  } catch (error) {
    console.error('Escrow creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 500,
          message: 'Failed to create escrow',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

const backendBaseUrl =
  process.env.API_URL ||
  process.env.BACKEND_URL ||
  process.env.SERVER_URL ||
  'http://localhost:8000';

const resolveBackendBaseUrl = (requestOrigin) => {
  // Guard against accidental self-reference (e.g., API_URL=http://localhost:3001).
  try {
    const configured = new URL(backendBaseUrl);
    const current = new URL(requestOrigin);

    const sameHost = configured.hostname === current.hostname;
    const samePort = (configured.port || (configured.protocol === 'https:' ? '443' : '80')) ===
      (current.port || (current.protocol === 'https:' ? '443' : '80'));

    if (sameHost && samePort) {
      return 'http://localhost:8000';
    }
  } catch {
    return 'http://localhost:8000';
  }

  return backendBaseUrl;
};

const parseBackendResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();

  if (!raw) {
    return { parsed: null, isJson: false };
  }

  if (contentType.includes('application/json')) {
    try {
      return { parsed: JSON.parse(raw), isJson: true };
    } catch {
      return { parsed: null, isJson: false };
    }
  }

  try {
    return { parsed: JSON.parse(raw), isJson: true };
  } catch {
    return { parsed: raw, isJson: false };
  }
};

export async function GET(req) {
  try {
    const resolvedBackendUrl = resolveBackendBaseUrl(req.nextUrl.origin);
    const response = await fetch(`${resolvedBackendUrl}/api/products`, {
      method: 'GET',
      cache: 'no-store',
    });

    const { parsed, isJson } = await parseBackendResponse(response);

    if (!isJson) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: 'Backend returned non-JSON response for products GET',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const payload = await req.json();
    const resolvedBackendUrl = resolveBackendBaseUrl(req.nextUrl.origin);

    const response = await fetch(`${resolvedBackendUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const { parsed, isJson } = await parseBackendResponse(response);

    if (!isJson) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: 'Backend returned non-JSON response for products POST',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: error.message || 'Failed to create product',
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

const backendBaseUrl =
  process.env.API_URL ||
  process.env.BACKEND_URL ||
  process.env.SERVER_URL ||
  'http://localhost:8000';

const resolveBackendBaseUrl = (requestOrigin) => {
  try {
    const configured = new URL(backendBaseUrl);
    const current = new URL(requestOrigin);

    const configuredPort = configured.port || (configured.protocol === 'https:' ? '443' : '80');
    const currentPort = current.port || (current.protocol === 'https:' ? '443' : '80');

    if (configured.hostname === current.hostname && configuredPort === currentPort) {
      return 'http://localhost:8000';
    }
  } catch {
    return 'http://localhost:8000';
  }

  return backendBaseUrl;
};

const parseBackendResponse = async (response) => {
  const raw = await response.text();

  if (!raw) {
    return { parsed: null, isJson: false };
  }

  try {
    return { parsed: JSON.parse(raw), isJson: true };
  } catch {
    return { parsed: raw, isJson: false };
  }
};

export async function DELETE(req, { params }) {
  try {
    const resolvedBackendUrl = resolveBackendBaseUrl(req.nextUrl.origin);
    const response = await fetch(`${resolvedBackendUrl}/api/products/${params.id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    const { parsed, isJson } = await parseBackendResponse(response);

    if (!isJson) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: 'Backend returned non-JSON response for products DELETE',
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
        message: error.message || 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}

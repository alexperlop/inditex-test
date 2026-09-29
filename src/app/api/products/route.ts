import { NextResponse, type NextRequest } from 'next/server';
import { getApiErrorStatus, getServerApiClient } from '@/services/http/axiosClient';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams);

  try {
    const { data } = await getServerApiClient().get('/products', { params });
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: getApiErrorStatus(error) },
    );
  }
}

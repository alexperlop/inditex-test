import { NextResponse, type NextRequest } from 'next/server';
import { API } from '@/constants';
import { getApiErrorStatus, getServerApiClient } from '@/services/http/axiosClient';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams);

  try {
    const { data } = await getServerApiClient().get(API.ENDPOINTS.PRODUCTS, { params });
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': API.CACHE_CONTROL,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: API.ERRORS.FETCH_LIST },
      { status: getApiErrorStatus(error) },
    );
  }
}

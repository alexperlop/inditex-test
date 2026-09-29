import { NextResponse, type NextRequest } from 'next/server';
import { API } from '@/constants';
import { getApiErrorStatus, getServerApiClient } from '@/services/http/axiosClient';

export const revalidate = 60;

export async function GET(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const { data } = await getServerApiClient().get(API.ENDPOINTS.productById(id));
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': API.CACHE_CONTROL,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: API.ERRORS.FETCH_DETAIL },
      { status: getApiErrorStatus(error) },
    );
  }
}

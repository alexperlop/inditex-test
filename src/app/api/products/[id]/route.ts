import { NextResponse, type NextRequest } from 'next/server';
import { getApiErrorStatus, getServerApiClient } from '@/services/http/axiosClient';

export const revalidate = 60;

export async function GET(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const { data } = await getServerApiClient().get(`/products/${encodeURIComponent(id)}`);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: getApiErrorStatus(error) },
    );
  }
}

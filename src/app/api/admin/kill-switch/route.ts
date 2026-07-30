import { NextRequest, NextResponse } from 'next/server';

let isKillSwitchActive = false;

export async function GET() {
  return NextResponse.json({
    success: true,
    killSwitch: isKillSwitchActive,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.killSwitch === 'boolean') {
      isKillSwitchActive = body.killSwitch;
    }

    return NextResponse.json({
      success: true,
      message: `Kill switch updated to ${isKillSwitchActive}`,
      killSwitch: isKillSwitchActive,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Kill switch error' },
      { status: 500 }
    );
  }
}

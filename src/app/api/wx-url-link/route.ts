import { NextResponse } from "next/server";

const WX_URL_LINK_API = "https://test.doors.orangemust.com/common/wx/public/url";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(WX_URL_LINK_API, {
      body: JSON.stringify({
        env_version: "release",
        expire_interval: 30,
        expire_type: 1,
        path: "/pages/index/index",
      }),
      cache: "no-store",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as {
      data?: { url_link?: string };
      success?: boolean;
    };

    return NextResponse.json({
      success: Boolean(payload.success && payload.data?.url_link),
      urlLink: payload.data?.url_link ?? null,
    });
  } catch {
    return NextResponse.json(
      { success: false, urlLink: null },
      { status: 500 },
    );
  }
}

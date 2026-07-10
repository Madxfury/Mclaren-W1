import { NextResponse } from "next/server";

export async function GET() {
    const key = process.env.GEMINI_API_KEY;
    return NextResponse.json({
        geminiKeyExists: !!key,
        geminiKeyLength: key ? key.length : 0,
        geminiKeyPrefix: key ? key.substring(0, 5) + "..." : "none",
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL
    });
}

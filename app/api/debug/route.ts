import { NextResponse } from "next/server";

export async function GET() {
    const key = process.env.GEMINI_API_KEY;
    
    let testResult = null;
    if (key) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "say hello" }] }]
                })
            });
            const status = res.status;
            const ok = res.ok;
            const text = await res.text();
            testResult = { ok, status, text };
        } catch (err: any) {
            testResult = { error: err.message };
        }
    }

    return NextResponse.json({
        geminiKeyExists: !!key,
        geminiKeyLength: key ? key.length : 0,
        geminiKeyPrefix: key ? key.substring(0, 5) + "..." : "none",
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        apiTestCall: testResult
    });
}

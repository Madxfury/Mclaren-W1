import { NextResponse } from "next/server";

export async function GET() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    
    let geminiTestResult = null;
    if (geminiKey) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`;
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
            geminiTestResult = { ok, status, text };
        } catch (err: any) {
            geminiTestResult = { error: err.message };
        }
    }

    let groqTestResult = null;
    if (groqKey) {
        try {
            const url = "https://api.groq.com/openai/v1/chat/completions";
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${groqKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: "say hello" }],
                    max_tokens: 10
                })
            });
            const status = res.status;
            const ok = res.ok;
            const text = await res.text();
            groqTestResult = { ok, status, text };
        } catch (err: any) {
            groqTestResult = { error: err.message };
        }
    }

    return NextResponse.json({
        geminiKeyExists: !!geminiKey,
        geminiKeyLength: geminiKey ? geminiKey.length : 0,
        geminiKeyPrefix: geminiKey ? geminiKey.substring(0, 5) + "..." : "none",
        groqKeyExists: !!groqKey,
        groqKeyLength: groqKey ? groqKey.length : 0,
        groqKeyPrefix: groqKey ? groqKey.substring(0, 5) + "..." : "none",
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        geminiApiTest: geminiTestResult,
        groqApiTest: groqTestResult
    });
}

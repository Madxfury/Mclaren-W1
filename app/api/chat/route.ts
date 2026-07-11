import { NextResponse } from "next/server";
import { marvinKnowledgeBase } from "@/data/marvinKnowledgeBase";

// Simple TF-IDF / Keyword matcher for local RAG retrieval
function retrieveContext(query: string) {
    const cleanQuery = query.toLowerCase();
    let bestScore = -1;
    let bestChunk = marvinKnowledgeBase[0]; // fallback to first chunk if nothing matches

    for (const chunk of marvinKnowledgeBase) {
        let score = 0;
        for (const kw of chunk.keywords) {
            if (cleanQuery.includes(kw)) {
                score += 2;
            }
        }
        // Additional score for exact title matches
        if (cleanQuery.includes(chunk.title.toLowerCase())) {
            score += 5;
        }
        if (score > bestScore) {
            bestScore = score;
            bestChunk = chunk;
        }
    }

    return {
        contextText: bestChunk.content,
        matchedCategory: bestChunk.category,
        matchedChunkTitle: bestChunk.title,
        score: bestScore
    };
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const userMessage = messages[messages.length - 1]?.content || "";
        
        // Execute RAG Retrieval
        const { contextText, matchedCategory, matchedChunkTitle, score } = retrieveContext(userMessage);

        const groqKey = process.env.GROQ_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        const systemPrompt = `You are MARVIN (McLaren Adaptive Racing Virtual Intelligence Network), a highly advanced Formula 1 Race Engineer AI built by McLaren's Hypercar Division.
Your goal is to assist the driver (the user) in customizing, configuring, and optimizing the setup of their McLaren W1 using exclusively the provided RAG Context.

Respond in a professional, technical, and high-performance racing tone. Use telemetry terminology (downforce, drag, slipstream, torque fill, active long tail, etc.).

Analyze the user's input. Decide the best setup mode for their request:
- "AERO": For road driving, aerodynamic discussions, aesthetic questions, styling, or general inquires.
- "TRACK": For track day performance, high-downforce setups, cornering agility, tire grip, and chassis adjustments.
- "RACE": For drag runs, top speed tests, max power output, engine specifications, or hybrid module deployment.

Also determine:
1. aeroAngle (an integer from 0 to 15 representing rear wing degree of deployment).
2. telemetryState (a short text code up to 15 chars, like "SYS_NOMINAL", "MAX_SPEED_ARM", "Silverstone_WET", "HOT_LAP").

You MUST return a JSON object with the following schema:
{
  "reply": string,
  "mode": "AERO" | "TRACK" | "RACE",
  "aeroAngle": number,
  "telemetryState": string
}

RETRIEVED DATA CONTEXT (RAG):
Document Title: ${matchedChunkTitle}
${contextText}`;

        if (groqKey) {
            try {
                // Call Groq OpenAI-compatible chat completion endpoint
                const url = "https://api.groq.com/openai/v1/chat/completions";
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${groqKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userMessage }
                        ],
                        response_format: { type: "json_object" }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const textResponse = data.choices?.[0]?.message?.content;
                    if (textResponse) {
                        try {
                            const jsonResponse = JSON.parse(textResponse);
                            return NextResponse.json(jsonResponse);
                        } catch (parseError) {
                            console.error("Failed to parse Groq structured JSON:", parseError, textResponse);
                        }
                    }
                } else {
                    console.error("Groq API error:", await response.text());
                }
            } catch (err) {
                console.error("Groq call failed:", err);
            }
        }

        if (geminiKey) {
            try {
                // Live Gemini API call with retrieved RAG context injected
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    { text: `System Instruction: ${systemPrompt}` },
                                    { text: `User request: ${userMessage}` }
                                ]
                            }
                        ],
                        generationConfig: {
                            responseMimeType: "application/json"
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (textResponse) {
                        try {
                            const jsonResponse = JSON.parse(textResponse);
                            return NextResponse.json(jsonResponse);
                        } catch (parseError) {
                            console.error("Failed to parse Gemini structured JSON:", parseError, textResponse);
                        }
                    }
                } else {
                    console.error("Gemini API error:", await response.text());
                }
            } catch (err) {
                console.error("Gemini call failed:", err);
            }
        }

        // Fallback RAG Response Generator (when API key is absent)
        let reply = "";
        const mode = matchedCategory;
        let aeroAngle = 4;
        let telemetryState = "RAG_RETRIEVED";

        if (mode === "TRACK") {
            aeroAngle = 12;
            telemetryState = "TRACK_SYS_CAL";
        } else if (mode === "RACE") {
            aeroAngle = 15;
            telemetryState = "RACE_BOOST_ARM";
        } else {
            aeroAngle = 4;
            telemetryState = "AERO_SYS_NOM";
        }

        if (score > 0) {
            reply = `MARVIN: RAG Knowledge Base search successful.\nDatabase Document: [${matchedChunkTitle}]\n\n${contextText}\n\n[Active Calibration: Setup adapted to ${mode} mode (wing angle: ${aeroAngle}°)]`;
        } else {
            // General greeting or fallback if no keyword matches
            reply = `MARVIN: Connection online. I received: "${userMessage}". No specific document match found. Defaulting system logs:\n\n- Model Base Price: €2.2 Million\n- Engine: 1275 HP Twin-Turbo V8 Hybrid\n- Chassis: Carbon Aerocell Monocoque\n- Performance: 0-100 km/h: 2.7s | Top Speed: 350 km/h\n\nTry asking: 'Tell me about the Active Long Tail' or 'How much does it cost?'.`;
        }

        return NextResponse.json({
            reply,
            mode,
            aeroAngle,
            telemetryState
        });

    } catch (error) {
        console.error("API route error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

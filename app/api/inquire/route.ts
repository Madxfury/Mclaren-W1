import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const isVercel = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const dbPath = isVercel
    ? path.join("/tmp", "inquiries.json")
    : path.join(process.cwd(), "data", "inquiries.json");

// Helper to read database
function readDB() {
    try {
        if (!fs.existsSync(dbPath)) {
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(dbPath, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(data || "[]");
    } catch (e) {
        console.error("Database read error:", e);
        return [];
    }
}

// Helper to write database
function writeDB(data: any) {
    try {
        const dir = path.dirname(dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Database write error:", e);
    }
}

export async function GET() {
    const inquiries = readDB();
    return NextResponse.json({ success: true, inquiries });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phoneCode, phoneNumber, country, retailer, message, marketingPreferences } = body;

        if (!firstName || !lastName || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const inquiries = readDB();
        const newInquiry = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            firstName,
            lastName,
            email,
            phone: `${phoneCode || ""} ${phoneNumber || ""}`.trim(),
            country,
            retailer,
            message,
            marketingPreferences,
            createdAt: new Date().toISOString()
        };

        inquiries.unshift(newInquiry); // Insert at the beginning of the list
        writeDB(inquiries);

        return NextResponse.json({ success: true, message: "Inquiry successfully saved to the database." });
    } catch (err) {
        console.error("API POST error:", err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Inquiry ID is required" }, { status: 400 });
        }

        let inquiries = readDB();
        inquiries = inquiries.filter((inq: any) => inq.id !== id);
        writeDB(inquiries);

        return NextResponse.json({ success: true, message: "Inquiry successfully removed." });
    } catch (err) {
        console.error("API DELETE error:", err);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Helper function: Google Drive API requires a Node.js Readable stream, not a Web Buffer
function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const message = formData.get('message') as string;
    const signature = formData.get('signature') as string;
    const pin = formData.get('pin') as string;

    // 1. The Firewall
    if (pin !== '1209') return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    if (!file) return NextResponse.json({ error: "No file detected" }, { status: 400 });

    console.log("=== SERVER INTERCEPT: INITIATING GOOGLE HANDSHAKE ===");
    console.log(`Processing: ${file.name} | Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Message payload: ${message || 'No message'} | Signature: ${signature || 'Anonymous'}`);

    // 2. Authenticate using OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 3. Buffer Conversion
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const media = {
      mimeType: file.type,
      body: bufferToStream(buffer),
    };

    // 4. Blast into Google Drive
    console.log("Transmitting payload to 5TB Drive...");
    
    const driveRes = await drive.files.create({
      requestBody: {
        name: `${Date.now()}_${file.name}`,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: media,
      fields: 'id, webViewLink',
    });

    console.log(`SUCCESS! File locked in Drive. ID: ${driveRes.data.id}`);
    
    // --- PHASE 2: THE LEDGER ---
    console.log("=== INITIATING LEDGER APPEND ===");

    // 1. Forge the direct image URL
    const fileId = driveRes.data.id;
    const directImageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    // 2. Lock the timezone to EEST (Romania)
    const now = new Date();
    const timeString = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Bucharest',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);
    const timestamp = `@ ${timeString}`;

    // 3. Blast the 5-column row into Google Sheets
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A:E', // Expanded to 5 columns
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        // Data matrix updated to catch the signature
        values: [[fileId, directImageUrl, message || "", timestamp, signature || ""]],
      },
    });

    console.log("SUCCESS! Row secured in Wedding_Ledger.");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CRITICAL UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Server crashed during Google transmission" }, { status: 500 });
  }
}
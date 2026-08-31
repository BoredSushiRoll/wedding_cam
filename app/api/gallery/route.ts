import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// CRITICAL: Kills the Next.js cache so the gallery always shows live data
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    console.log("=== SERVER INTERCEPT: FETCHING GALLERY LEDGER ===");

    // Authenticate with the exact same VIP Token matrix
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    
    // Pull the entire sheet matrix (Expanded to Column E for the Signature)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A:E', 
    });

    const rows = response.data.values;
    
    // Failsafe for an empty database
    if (!rows || rows.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Map Google's raw 2D array into a sanitized JSON object
    const galleryData = rows.map((row) => ({
      id: row[0],
      imageUrl: row[1],
      message: row[2] || "",
      timestamp: row[3] || "",
      signature: row[4] || "", // Capturing the 5th column
    })).reverse(); // The reverse() function flips the array so the newest row (bottom of sheet) is index 0

    console.log(`SUCCESS! Extracted ${galleryData.length} records.`);
    return NextResponse.json({ items: galleryData });

  } catch (error) {
    console.error("CRITICAL FETCH ERROR:", error);
    return NextResponse.json({ error: "Failed to retrieve gallery" }, { status: 500 });
  }
}
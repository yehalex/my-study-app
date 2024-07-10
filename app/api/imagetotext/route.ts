import { NextRequest, NextResponse } from "next/server";
import { imageToText, TextElement } from "@/app/_lib/imageToText";
import { parseQuestionFromOCR } from "@/app/_lib/parseQuestionFromOCR";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Use this using edge runtime

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.API_NINJAS_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const ocrResult: TextElement[] = await imageToText(image, apiKey);
    const parsedQuestion = parseQuestionFromOCR(ocrResult);

    return NextResponse.json({ ocrResult, parsedQuestion });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

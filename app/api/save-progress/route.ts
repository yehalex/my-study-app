import { NextRequest } from "next/server";
import { updateProgressBatch } from "@/app/_lib/actions";

export async function POST(req: NextRequest) {
  const { userId, subjectId, answers } = await req.json();

  try {
    const result = await updateProgressBatch(userId, subjectId, answers);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

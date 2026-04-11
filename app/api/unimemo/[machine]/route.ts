import { NextResponse } from "next/server";
import { analyzeUnimemoImage, UnimemoImageError } from "../../../../lib/unimemo/gemini";
import { getUnimemoMachineConfig } from "../../../../lib/unimemo/machines";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ machine: string }> }
) {
  const { machine } = await context.params;
  const config = getUnimemoMachineConfig(machine);

  if (!config) {
    return NextResponse.json({ error: "対応していない機種です。" }, { status: 404 });
  }

  try {
    return NextResponse.json(await analyzeUnimemoImage(request, config));
  } catch (error) {
    if (error instanceof UnimemoImageError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "画像から入力できませんでした。" }, { status: 500 });
  }
}

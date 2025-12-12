import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/mongodb";
import Class from "@/models/Class";

export async function GET() {
  await dbConnect();
  const classes = await Class.find({}).lean();
  return NextResponse.json(classes);  // return array directly
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      code,
      location,
      allowedRadius,
      schedule,
      createdBy
    } = body;

    if (
      !name ||
      !code ||
      !location?.latitude ||
      !location?.longitude ||
      !schedule?.dayOfWeek ||
      !schedule?.startTime ||
      !schedule?.endTime ||
      !schedule?.room ||
      !createdBy
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newClass = await Class.create({
      name,
      code,
      location,
      allowedRadius,
      schedule,
      createdBy
    });

    return NextResponse.json({ success: true, data: newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

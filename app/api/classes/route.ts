import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/mongodb";
import Class from "@/models/Class";

export async function GET() {
  try {
    await dbConnect();
    const classes = await Class.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: classes });
  } catch (error: any) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
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
      schedule
    } = body;

    if (
      !name ||
      !code ||
      !location?.latitude ||
      !location?.longitude ||
      !schedule?.dayOfWeek ||
      !schedule?.startTime ||
      !schedule?.endTime ||
      !schedule?.room
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
    });

    return NextResponse.json({ success: true, data: newClass });
  } catch (error: any) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

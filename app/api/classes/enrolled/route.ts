import { NextResponse } from "next/server";
import dbConnect from "@/libs/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const user = await User.findById(userId).populate("enrolledClasses");

  console.log("Enrolled classes for user:", user?.enrolledClasses);

  return NextResponse.json({
    success: true,
    data: user?.enrolledClasses || []
  });
}

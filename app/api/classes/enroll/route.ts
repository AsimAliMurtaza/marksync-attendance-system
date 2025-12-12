import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/libs/mongodb";
import Class from "@/models/Class";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { classId } = await req.json();

  const selectedClass = await Class.findById(classId);
  if (!selectedClass) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  // Prevent double enrollment
  if (selectedClass.enrolledStudents.includes(session.user.id)) {
    return NextResponse.json({ message: "Already enrolled" });
  }

  selectedClass.enrolledStudents.push(session.user.id);
  await selectedClass.save();
  const user = await User.findById(session.user.id);
  user.enrolledClasses.push(selectedClass._id);
  await user.save();

  return NextResponse.json({ message: "Enrolled successfully" });
}

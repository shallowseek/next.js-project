import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model"

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect()// we have to do for evry request we made to databse because we don't know whther connection is active//
  const id = params.id;
  console.log("this proves that use effet of u/id/runs")

  try {
    const user = await UserModel.findById(id); // cleaner if you're using _id

    if (user) {
        console.log("user that we are returning", user)
      return Response.json(
        { user: user },
        { status: 200 }
      );
    }

    return Response.json(
      { message: "User not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

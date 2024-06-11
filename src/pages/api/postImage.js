import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import SinglePost from "@/models/SinglePost";
import Database from "@/lib/Database";

export default async function handler(req, res) {
  const db = new Database();
  try {
    // get user id
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res
        .status(200)
        .json({ ok: false, message: "log in for posting image ..." });
    }
    const body = req.body;
    const singlePost = new SinglePost({
      postName: body.postname,
      base64: body.base64,
      userId: session.user.id,
      showComments: body.showComments,
    });
    await db.open();
    const { ok } = await db.insert(SinglePost, singlePost);
    if (!ok) throw new Error();
    return res
      .status(200)
      .json({ ok: true, message: "upload successfull ..." });
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ ok: false, message: "internal server error" });
  } finally {
    await db.close();
  }
}

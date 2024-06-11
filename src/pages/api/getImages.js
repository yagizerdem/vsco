import Database from "@/lib/Database";
import SinglePost from "@/models/SinglePost";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import ApiFeatures from "@/lib/ApiFeatures";

export default async function getImages(req, res) {
  const db = new Database();
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res
        .status(200)
        .json({ ok: false, message: "log in for posting image ..." });
    }
    await db.open();
    const { skip, limit, userid } = req.query;

    var query = SinglePost.find({
      userId: userid,
    });

    var query = new ApiFeatures({ query }).skip(skip).limit(limit).getQuery();
    const data = await query;

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ ok: false, data: [] });
  } finally {
    await db.close();
  }
}

import Database from "@/lib/Database";
import User from "@/models/User";

export default async function handler(req, res) {
  const db = new Database();
  try {
    const body = req.body;

    await db.open();

    // find user if exist
    const userFromDb = await db.findOne(User, { email: req?.body?.email });
    if (userFromDb) {
      return res
        .status(200)
        .json({ ok: false, message: "this email already registered ..." });
    }

    const { ok } = await db.insertUser(body);
    if (!ok) throw new Error();

    return res.status(200).json({ ok: true, message: "sign up successfull " });
  } catch (err) {
    console.log(err);
    return res
      .status(200)
      .json({ ok: false, message: "internal server error ..." });
  } finally {
    await db.close(); // clean up
  }
}

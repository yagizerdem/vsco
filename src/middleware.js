import { NextResponse } from "next/server";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "./lib/Validator";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/api/signUp")) {
    if (request.method != "POST") {
      return NextResponse.json({ ok: false, message: "invalid request type" });
    }
    // validate user inputs
    const body = await request.json();
    let validate = () =>
      nameValidator(body.firstname) &&
      nameValidator(body.lastname) &&
      passwordValidator(body.password) &&
      emailValidator(body.email);

    if (!validate()) {
      return NextResponse.json({
        ok: false,
        message: "invalid credentials , check your credentials",
      });
    }
    return NextResponse.next();
  } else if (request.nextUrl.pathname.startsWith("/api/postImage")) {
    if (request.method != "POST") {
      return NextResponse.json({ ok: false, message: "invalid request type" });
    }
    const body = await request.json();
    if (body.postname.length < 2 || body.postname.length > 40) {
      return NextResponse.json({
        ok: false,
        message:
          "postname should be  more than 2 characte and less less than 40 characters",
      });
    }
  }

  return NextResponse.next();
}

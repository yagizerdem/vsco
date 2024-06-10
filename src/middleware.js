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
  }

  return NextResponse.next();
}

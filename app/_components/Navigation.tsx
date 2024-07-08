import Link from "next/link";
import { auth } from "../_lib/auth";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";

export default async function Navigation() {
  const session = await auth();
  // console.log(session);

  return (
    <nav className="z-10">
      <ul className="flex gap-16 items-center">
        {/* <li>
          <Link
            href="/flashcards"
            className="hover:text-gray-400 transition-colors"
          >
            Study
          </Link>
        </li> */}
        <li>
          <Link
            href="/problems"
            className="hover:text-gray-400 transition-colors"
          >
            Problems
          </Link>
        </li>
        {session?.user?.image ? <SignOutButton /> : <SignInButton />}
      </ul>
    </nav>
  );
}

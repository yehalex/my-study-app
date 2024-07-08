import Image from "next/image";
import Link from "next/link";
import study_logo from "@/public/study_logo.png";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={study_logo}
        width={60}
        height={60}
        alt="Book Image"
        className="rounded-full aspect-square object-cover"
      />
    </Link>
  );
}

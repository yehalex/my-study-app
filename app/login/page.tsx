import { signInAction } from "../_lib/actions";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">Sign in</h2>
      <form action={signInAction}>
        <button className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2">
          <span>Sign in with Google</span>
        </button>
      </form>
    </div>
  );
}

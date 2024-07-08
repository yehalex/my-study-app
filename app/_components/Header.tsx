import Logo from "./Logo";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="text-4xl border-b border-gray-600 px-8 py-5">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}

import ProblemNav from "./ProblemNav";

export default function ProblemsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-700 antialiased text-primary-100 min-h-screen flex flex-col relative justify-center">
      <ProblemNav />
      <div className="flex-1 px-8 py-12 grid">
        <div className="max-w-7xl mx-auto w-full ">{children}</div>
      </div>
    </div>
  );
}

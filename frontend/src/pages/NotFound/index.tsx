import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="font-cal-sans text-6xl font-bold text-ink mb-4">404</h1>
      <h2 className="font-cal-sans text-2xl font-semibold text-ink mb-6">Page Not Found</h2>
      <p className="text-muted max-w-md mb-8">
        The scheduling link or page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-primary text-white font-semibold text-sm px-6 py-3 rounded-md hover:bg-primary-active transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
}

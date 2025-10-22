





export default function HomePage() {
  // NOTE: Route protection / server session checks were removed temporarily.
  // Re-add auth / redirects later as needed.
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <p className="mt-2 text-sm text-gray-600">Public landing page (auth removed)</p>
    </div>
  );
}
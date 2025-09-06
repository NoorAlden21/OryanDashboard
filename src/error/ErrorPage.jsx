import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex justify-center items-center h-screen w-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-lg mb-2 font-medium">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="italic">{error.statusText || error.message}</p>
      </div>
    </div>
  );
}

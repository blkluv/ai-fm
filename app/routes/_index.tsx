import type {MetaFunction, LoaderFunctionArgs} from "@remix-run/node";
import {redirect} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {title: "AI FM"},
    {name: "description", content: "AI-generated radio with real songs and AI moderator voiceovers"},
  ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function loader({request}: LoaderFunctionArgs) {
  return redirect("/dashboard");
}

export default function Index() {
  // This component won't render because the loader will redirect
  // But we keep it as a fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}

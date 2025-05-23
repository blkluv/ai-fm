import {json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import type {LinksFunction} from "@remix-run/node";

import "./tailwind.css";
import {HeroUIProvider} from "@heroui/react";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "~/providers/query-client";
import {Toaster} from "sonner";
import React from "react";

export const links: LinksFunction = () => [
  {rel: "preconnect", href: "https://fonts.googleapis.com"},
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function loader() {
  return json({
    ENV: {
      API_URL: process.env.API_URL!,
      WS_API_URL: process.env.WS_API_URL!,
    }
  });
}

export function Layout({children}: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <Meta/>
      <Links/>
    </head>
    <body>
    <script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
      }}
    />
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster/>
        <div className="text-foreground bg-background">
          {children}
        </div>
        <ScrollRestoration/>
        <Scripts/>
      </QueryClientProvider>
    </HeroUIProvider>
    </body>
    </html>
  );
}

export default function App() {
  return <Outlet/>;
}

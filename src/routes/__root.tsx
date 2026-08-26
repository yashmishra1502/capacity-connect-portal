import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const themeInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function GlobalBackground() {
  return (
    <>
      <style>{`
        @keyframes cc-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes cc-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 60px) scale(1.1); }
        }
        @keyframes cc-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -50px) scale(1.2); }
        }
        @keyframes cc-pulse-glow {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        @keyframes cc-caret-blink {
          0%, 45% { opacity: 1; }
          50%, 95% { opacity: 0; }
          100% { opacity: 1; }
        }
        .cc-caret {
          height: 0.85em;
          animation: cc-caret-blink 1s steps(1) infinite;
        }
      `}</style>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute -left-40 -top-40 size-[700px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 85%, transparent), transparent 70%)",
            animation: "cc-drift-1 18s ease-in-out infinite, cc-pulse-glow 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-32 top-1/4 size-[600px] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.8), transparent 70%)",
            animation: "cc-drift-2 22s ease-in-out infinite, cc-pulse-glow 11s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-1/3 top-2/3 size-[650px] rounded-full blur-[130px]"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.65), transparent 70%)",
            animation: "cc-drift-3 25s ease-in-out infinite, cc-pulse-glow 13s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-20 bottom-0 size-[550px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 70%, transparent), transparent 70%)",
            animation: "cc-drift-2 20s ease-in-out infinite reverse, cc-pulse-glow 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--foreground) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 45%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-background text-foreground">
        <GlobalBackground />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  );
}

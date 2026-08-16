import { QueryClient } from "@tanstack/react-query";

// Shared singleton so it can be cleared from outside the component tree
// (see sessionStore.clearSession) whenever the authenticated business
// changes, instead of only when App.tsx happens to remount.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

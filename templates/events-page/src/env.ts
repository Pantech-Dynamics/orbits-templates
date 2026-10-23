import { defineEnvVars } from "@sveltejs/kit/env";

// Read when the app starts. Import them from $app/env/private (server code only).
export const variables = defineEnvVars({
  RSVP_WEBHOOK_URL: {
    description: "Optional. Each RSVP is POSTed here as JSON: a Slack incoming webhook, Zapier, your own API.",
    schema: (value) => {
      if (!value) return undefined;
      if (!URL.canParse(value)) throw new Error("RSVP_WEBHOOK_URL must be a full URL, starting with https://");
      return value;
    },
  },
});

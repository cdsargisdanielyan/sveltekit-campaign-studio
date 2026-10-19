import type { HandleClientError } from '@sveltejs/kit/hooks';
import { report } from '#lib/telemetry.ts';

export const handleError: HandleClientError = ({ error }) => {
  report({
    kind: 'error',
    name: 'client-navigation',
    message: error instanceof Error ? error.message : 'Navigation failed',
  });
  return { message: 'The page could not be loaded. Please try again.' };
};

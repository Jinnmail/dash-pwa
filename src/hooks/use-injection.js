import {container} from 'tsyringe';

export function useInjection(token) {
  try {
    return container.resolve(token);
  } catch(e) {
    throw new Error(`Failed to resolve ${String(token)}`);
  }
}
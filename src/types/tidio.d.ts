interface TidioChatApi {
  on(event: string, callback: () => void): void;
}

declare global {
  interface Window {
    tidioChatApi?: TidioChatApi;
  }
}

export {};
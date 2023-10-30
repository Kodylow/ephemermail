import NDK from "@nostr-dev-kit/ndk";
import { createContext } from "react";

export interface AppState {
    npub?: string | null;
}

export const NostrNdkContext = createContext<NDK | null>(null);
export const AppStateContext = createContext<{
    set: (state: AppState) => void;
    state: AppState;
} | null>(null);

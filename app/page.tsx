"use client";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import FormCard from "@/components/FormCard";
import Notice from "@/components/Notice";
import { Skeleton } from "@/components/ui/skeleton";
import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { AppState } from "@/app/state";

const RELAYS = ["wss://relay.snort.social", "wss://nos.lol"];

export default function Home() {
    const { toast } = useToast();

    const [windowWeblnEnabled, setWindowWeblnEnabled] = useState<"loading" | boolean>(
        "loading",
    );
    const [windowNostrEnabled, setWindowNostrEnabled] = useState<
        boolean | "pending"
    >("pending");

    const [ndk, setNdk] = useState<NDK | null>(null);
    const [state, set] = useState<AppState>({
        npub: null,
    });


    const { theme } = useTheme();

    useEffect(() => {
        async function connectNostr() {
            try {
                const signer = new NDKNip07Signer();
                const _ndk = new NDK({
                    explicitRelayUrls: RELAYS,
                    signer,
                });

                _ndk.pool.on("relay:connect", async (r: any) => {
                    console.log(`Connected to a relay ${r.url}`);
                });

                _ndk.connect(2500);

                const user = await signer.user();

                if (user.npub) {
                    const profile = await user.fetchProfile();
                    set({ npub: user.npub })
                    setWindowNostrEnabled(true);
                }

                setNdk(_ndk);
            } catch (err) {
                setWindowNostrEnabled(false);
            }
        }
        async function enableWebln() {
            if (typeof window.webln !== "undefined") {
                await window.webln.enable();
                setWindowWeblnEnabled(true);
            } else {
                setWindowWeblnEnabled(false);
            }
        }

        connectNostr();
        enableWebln();
    }, []);


    return (
        <main className="flex min-h-screen flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-2xl font-semibold">EphemerMail</span>
                <span>{state.npub ? state.npub : ""}</span>
                <ModeToggle />
            </div>
            {typeof windowWeblnEnabled === "string" ? (
                <div className="flex items-center justify-center p-4 grow w-full">
                    <div className="flex flex-col gap-4">
                        <Skeleton className="w-[280px] h-[24px]"></Skeleton>
                        <Skeleton className="w-[280px] h-[24px]"></Skeleton>
                        <Skeleton className="w-[280px] h-[24px]"></Skeleton>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-4 grow w-full overflow-x-hidden min-w-0 gap-4">
                    {windowWeblnEnabled ? <FormCard /> : <Notice />}
                </div>
            )}
        </main>
    );
}

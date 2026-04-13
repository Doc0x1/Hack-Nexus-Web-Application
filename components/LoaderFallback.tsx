export default function LoaderFallback() {
    return (
        <div className="fixed inset-0 z-30 flex select-none flex-col items-center justify-center bg-black">
            <div className="animate-pulse font-mono text-5xl text-green-400">Loading Hack Nexus...</div>
        </div>
    );
}

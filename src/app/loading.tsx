import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center mt-64 flex-grow text-muted-foreground  min-h-[200px]">
            <Loader2 className="h-20 w-20 animate-spin text-primary mb-6" />
            <p className="text-2xl">Loading...</p>
        </div>
    );
}

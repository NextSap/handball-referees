import { NextRequest } from "next/server";
import {shl} from "@/config/ky.config";
import {getToken} from "@/services/shl.service";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const bucket = searchParams.get("bucket");
    const hash = searchParams.get("hash");
    if (!bucket || !hash) {
        return new Response("Missing bucket or hash", { status: 400 });
    }

    const url = (bucket: string, hash: string) => `https://binaries.sportlink.com/${bucket}/${hash}`;
    const token = await getToken();

    const res = await shl(token.access_token).get(url(bucket, hash)).then();

    if (!res.ok) {
        return new Response("Impossible de récupérer l'image", { status: res.status });
    }

    const blob = await res.blob();
    return new Response(blob, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600", // optionnel, cache client
        },
    });
}

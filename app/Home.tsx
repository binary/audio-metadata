"use client";

import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import FileUpload from "./components/file_upload";
import FileMetadata from "./components/file_metadata";
import { ffprobe_data_props } from "@/types/file";

export default function Home() {
    const [ffprobe_data, set_ffprobe_data] =
        useState<ffprobe_data_props | null>(null);
    const [loaded, set_loaded] = useState(false);

    const ffmpeg_ref = useRef(new FFmpeg());

    const load_ffmpeg = async () => {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
        const ffmpeg = ffmpeg_ref.current;

        await ffmpeg.load({
            coreURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.js`,
                "text/javascript"
            ),
            wasmURL: await toBlobURL(
                `${baseURL}/ffmpeg-core.wasm`,
                "application/wasm"
            ),
        });

        set_loaded(true);
    };

    const handle_file_upload = async (
        file_list: FileList
    ) => {
        const file = file_list?.[0];
        if (file) {
            if (!loaded) await load_ffmpeg();

            const ffmpeg = ffmpeg_ref.current;

            await ffmpeg.writeFile(
                file.name,
                await fetchFile(URL.createObjectURL(file))
            );

            const ffprobe_args = [
                "-v",
                "quiet",
                "-print_format",
                "json",
                "-show_format",
                "-show_streams",
                file.name,
                "-o",
                "output.json",
            ];

            await ffmpeg.ffprobe(ffprobe_args);

            const response = await ffmpeg
                .readFile("output.json")
                .then((data) => {
                    const text_decoder = new TextDecoder("utf-8");
                    return text_decoder.decode(
                        new Uint8Array(data as Uint8Array)
                    );
                });

            const { format, streams } = JSON.parse(response);

            set_ffprobe_data({ format, streams });
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0a0a0a]">
                <div className="absolute top-[20%] left-[15%] w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[20%] right-[15%] w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4 mt-4">
                            audio metadata
                        </h1>
                        <p className="text-gray-400">
                            drop here or click to browse
                        </p>
                    </div>

                    <FileUpload on_file_select={handle_file_upload} />

                    {ffprobe_data && (
                        <FileMetadata ffprobe_data={ffprobe_data} />
                    )}
                </div>
            </div>
        </main>
    );
}

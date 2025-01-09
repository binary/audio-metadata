"use client";

import { ffprobe_data_props } from "@/types/file";
import { motion } from "framer-motion";
import { FileIcon } from "lucide-react";

const render_json = (
    obj: any,
    top_level: boolean = false,
    level: number = 0
): React.ReactNode => {
    return (
        <dl>
            {Object.entries(obj).map(([key, value]) => {
                const indent = " ".repeat(level * 2);

                const key_style = top_level
                    ? "text-sm text-purple-400 mb-2 mt-2"
                    : "text-xs text-gray-500";

                const indentation = { whiteSpace: "pre", display: "inline" };

                if (typeof value === "object" && value !== null) {
                    return (
                        <div key={key}>
                            <dt className={`${key_style}`}>
                                <span style={indentation}>
                                    {indent}
                                    {key}
                                </span>
                            </dt>
                            <dd className="text-sm text-gray-300">
                                {render_json(value, false, level + 1)}
                            </dd>
                        </div>
                    );
                }

                return (
                    <div key={key}>
                        <dt className={`${key_style}`}>
                            <span style={indentation}>
                                {indent}
                                {key}
                            </span>
                        </dt>
                        <dd className="text-sm text-gray-300">
                            <span style={indentation}>
                                {indent}
                                {value as string}
                            </span>
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
};

export default function FileMetadata({
    ffprobe_data,
}: {
    ffprobe_data: ffprobe_data_props;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className="mt-6 mb-4"
        >
            <div className="bg-black/40 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <FileIcon className="w-5 h-5 text-blue-400" />
                        <h3 className="text-sm font-medium text-gray-200">
                            ffprobe
                        </h3>
                    </div>
                    <dl>
                        {render_json(ffprobe_data, true)}
                    </dl>
                </div>
            </div>
        </motion.div>
    );
}

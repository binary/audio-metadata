"use client";

import { Upload } from "lucide-react";
import { file_upload_props } from "@/types/file";
import { useState } from "react";

export default function FileUpload({ on_file_select }: file_upload_props) {
    const [dragging, set_dragging] = useState(false);

    const drag_over = (drag_event: React.DragEvent) => {
        drag_event.preventDefault();
        set_dragging(true);
    };

    const drag_leave = () => {
        set_dragging(false);
    };

    const drag_drop = (drag_event: React.DragEvent) => {
        drag_event.preventDefault();
        set_dragging(false);

        const file_list = drag_event.dataTransfer.files

        if (file_list) {
            on_file_select(file_list);
        }
    };

    return (
        <label
            className={`group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed ${
                dragging ? "border-white-500" : "border-gray-600"
            } rounded-xl hover:border-gray-400 transition-colors cursor-pointer bg-black/20 backdrop-blur-sm`}
            onDragOver={drag_over}
            onDragLeave={drag_leave}
            onDrop={drag_drop}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-white transition-colors" />
            </div>

            <input
                type="file"
                className="hidden"
                onChange={(e) => {
                    const file_list = e.target.files;

                    if (file_list) {
                        on_file_select(file_list);
                    }
                }}
                accept="*/*"
            />
        </label>
    );
}

export interface file_upload_props {
    on_file_select: (file_list: FileList) => void;
}

export type ffprobe_data_props = {
    streams: {}[];
    format: {};
};

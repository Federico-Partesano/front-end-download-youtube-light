
    export interface Id {
        videoId: string;
    }

    export interface Default {
        url: string;
        width: number;
        height: number;
    }

    export interface High {
        url: string;
        width: number;
        height: number;
    }

    export interface Thumbnails {
        id: string;
        url: string;
        default: Default;
        high: High;
        height: number;
        width: number;
    }

    export interface Snippet {
        url: string;
        duration: string;
        publishedAt: string;
        thumbnails: Thumbnails;
        title: string;
        views: string;
    }

    export interface RespVideoSearch {
        id: Id;
        url: string;
        title: string;
        description: string;
        duration_raw: string;
        snippet: Snippet;
        views: string;
    }



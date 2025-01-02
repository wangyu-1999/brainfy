export interface NewsContent {
    title_cn: string;
    title_en: string;
    subject: string;
    location: string | null;
    chinese_summary: string;
    english_summary: string;
    source_name: string;
    date: string;
}

export interface Article {
    url: string;
    similarity?: number;
}

export interface NewsCluster {
    articles: Article[];
    size?: number;
}

export interface ClusterEntity {
    partitionKey: string;
    rowKey: string;
    clusters: string;
    [key: string]: any;
} 
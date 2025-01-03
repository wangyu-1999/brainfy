export interface NewsContent {
    title_cn: string;
    source_name: string;
    date: string;
    title_en: string;
    subject: string;
    location: string;
    chinese_summary: string;
    english_summary: string;
}

export interface Article {
    url: string;
    similarity: number;
    content: NewsContent;
}

export interface NewsCluster {
    size: number;
    articles: Article[];
}

export interface ClusterEntity {
    timestamp: string;
    clusters: string;
    partitionKey: string;
    rowKey: string;
}
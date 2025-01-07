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


export interface ClusterEntity {
  clusters: {
    size: number;
    articles: {
      url: string;
      content: NewsContent;
    }[];
  }[];
  timestamp: string;
  partitionKey: string;
  rowKey: string;
}

export interface Article {
    url: string;
    content: NewsContent;
}
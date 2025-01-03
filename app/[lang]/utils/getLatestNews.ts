import { queryTable, getNewsContent } from '@/lib/tableService'
import { NewsCluster } from '@/types/news'

export async function getLatestNews() {
    try {
        const clusters = await queryTable();
        const lastCluster = clusters.at(-1);

        if (!lastCluster?.clusters) {
            console.error('无效的聚类数据');
            return [];
        }

        const parsedClusters: NewsCluster[] = JSON.parse(lastCluster.clusters.toString());
        const sortedClusters = parsedClusters.sort((a, b) => (b.size || 0) - (a.size || 0));

        return Promise.all(sortedClusters.map(async (cluster) => ({
            ...cluster,
            articles: await Promise.all(
                cluster.articles
                    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
                    .map(async (article) => ({
                        ...article,
                        content: await getNewsContent(article.url)
                    }))
            )
        })));
    } catch (error) {
        console.error('获取新闻数据失败:', error);
        return [];
    }
} 
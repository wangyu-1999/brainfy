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
        return processNewsData(parsedClusters);
    } catch (error) {
        console.error('获取新闻数据失败:', error);
        return [];
    }
}

export async function getAllNews() {
    try {
        const clusters = await queryTable();
        // 首先对 clusters 按时间戳进行排序
        const sortedClusters = clusters.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return Promise.all(sortedClusters.map(async (clusterData) => ({
            date: clusterData.timestamp,
            clusters: await processNewsData(JSON.parse(clusterData.clusters.toString()))
        })));
    } catch (error) {
        console.error('获取历史新闻数据失败:', error);
        return [];
    }
}

// 抽取共用的处理逻辑
async function processNewsData(clusters: NewsCluster[]) {
    const sortedClusters = clusters.sort((a, b) => (b.size || 0) - (a.size || 0));
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
} 
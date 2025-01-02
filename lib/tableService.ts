import { TableClient, TableServiceClient } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";

// 创建 TableServiceClient 实例
const tableServiceClient = TableServiceClient.fromConnectionString(connectionString);

// 创建两个 TableClient 实例分别用于访问不同的表
const clustersTableClient = TableClient.fromConnectionString(connectionString, "clusters");
const newsContentTableClient = TableClient.fromConnectionString(connectionString, "newsContent");

// 编码和解码 URL 的辅助函数
function encodeKey(key: string): string {
    return Buffer.from(key).toString('base64');
}

function decodeKey(encodedKey: string): string {
    return Buffer.from(encodedKey, 'base64').toString();
}

// 查询聚类数据
async function queryTable() {
    let entities = [];
    const iterator = clustersTableClient.listEntities();
    for await (const entity of iterator) {
        entities.push(entity);
    }
    return entities;
}

// 查询新闻内容
async function getNewsContent(url: string) {
    try {
        const domain = new URL(url).hostname;
        const partitionKey = encodeKey(domain);
        const rowKey = encodeKey(url);

        const entity = await newsContentTableClient.getEntity(partitionKey, rowKey);
        return {
            title_cn: entity.title_cn,
            title_en: entity.title_en,
            subject: entity.subject,
            location: entity.location,
            chinese_summary: entity.chinese_summary,
            english_summary: entity.english_summary,
            source_name: entity.source_name,
            date: entity.date
        };
    } catch (error) {
        console.error('获取新闻内容失败:', error);
        return null;
    }
}

export { tableServiceClient, queryTable, getNewsContent }; 
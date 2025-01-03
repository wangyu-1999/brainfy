import { NewsContent, ClusterEntity } from '../types/news'
import { TableClient } from "@azure/data-tables"

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || ""
const newsContentTable = TableClient.fromConnectionString(connectionString, "newsContent")
const clustersTable = TableClient.fromConnectionString(connectionString, "clusters")

function encodeKey(key: string): string {
    return Buffer.from(key).toString('base64')
}

export async function queryTable(): Promise<ClusterEntity[]> {
    try {
        const entities: ClusterEntity[] = []
        const iterator = clustersTable.listEntities<ClusterEntity>()
        for await (const entity of iterator) {
            entities.push(entity)
        }
        return entities
    } catch (error) {
        console.error('获取聚类数据失败:', error)
        return []
    }
}

export async function getNewsContent(url: string): Promise<NewsContent | null> {
    try {
        const domain = url.split("/")[2]  // 获取域名部分
        const entity = await newsContentTable.getEntity(
            encodeKey(domain),
            encodeKey(url)
        )

        return {
            title_cn: entity.title_cn as string,
            title_en: entity.title_en as string,
            subject: entity.subject as string,
            location: entity.location as string,
            chinese_summary: entity.chinese_summary as string,
            english_summary: entity.english_summary as string,
            source_name: entity.source_name as string,
            date: entity.date as string,
        }
    } catch (error) {
        console.error('获取新闻内容失败:', error)
        return null
    }
} 
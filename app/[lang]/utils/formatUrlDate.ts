/**
 * 将日期字符串格式化为URL友好的格式
 * 输入: "2025-01-03 14:00:36 UTC" 或其他日期格式
 * 输出: "2025-01-03-14-00-36"
 */
export function formatUrlDate(dateStr: string) {
    // 如果日期字符串包含UTC，先移除它
    dateStr = dateStr.replace(' UTC', '')

    // 尝试创建日期对象
    const date = new Date(dateStr)

    // 格式化为所需格式
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}`
} 
export function slugify(text: string): string {
    return text
        // 转换为小写
        .toLowerCase()
        // 替换空格为连字符
        .replace(/\s+/g, '-')
        // 移除所有非单词字符（保留字母、数字、连字符）
        .replace(/[^\w\-]+/g, '')
        // 移除连续的连字符
        .replace(/\-{2,}/g, '-')
        // 移除开头和结尾的连字符
        .replace(/^\-+|\-+$/g, '')
        // 将限制提高到 200 个字符
        .slice(0, 200);
} 
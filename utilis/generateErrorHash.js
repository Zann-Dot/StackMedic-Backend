import crypto from "crypto"
export function generateErrorHash(rawStackTrace) {
    const normalizedTrace = rawStackTrace
        .replace(/(\d+):(\d+)/g, '')
        .replace(/\b[0-9a-fA-F]{24}\b/g, '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z/g, '');

    return crypto.createHash("sha256").update(normalizedTrace).digest("hex")
}
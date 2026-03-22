/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

import * as db from "./database"
import { db_cache } from "./cache"

const is_production = process.env.NODE_ENV === "production"

const collection_key_index: Map<string, Set<string>> = new Map()

/**
 * - 生成数据库查询缓存键 - \\
 * - generate cache key for database queries - \\
 * @param {string} collection - collection name
 * @param {object} filter - query filter
 * @returns {string} cache key
 */
function generate_cache_key(collection: string, filter: object): string {
    const filter_str = JSON.stringify(filter, Object.keys(filter).sort())
    return `${collection}:${filter_str}`
}

/**
 * - 为集合注册缓存键 - \\
 * - register cache key for collection - \\
 * @param {string} collection - collection name
 * @param {string} cache_key - cache key to register
 * @returns {void}
 */
function register_collection_key(collection: string, cache_key: string): void {
    const existing_keys = collection_key_index.get(collection)
    if (existing_keys) {
        existing_keys.add(cache_key)
        return
    }

    collection_key_index.set(collection, new Set([cache_key]))
}

/**
 * - 使集合缓存失效 - \\
 * - invalidate cache for collection - \\
 * @param {string} collection - collection name
 * @returns {void}
 */
export function invalidate_collection_cache(collection: string): void {
    const indexed_keys = collection_key_index.get(collection)
    if (indexed_keys && indexed_keys.size > 0) {
        for (const key of indexed_keys) {
            db_cache.delete(key)
        }
        indexed_keys.clear()
        return
    }

    const keys = db_cache.keys()
    for (const key of keys) {
        if (key.startsWith(`${collection}:`)) {
            db_cache.delete(key)
        }
    }
}

/**
 * - 带读穿模式的缓存单条查询 - \\
 * - cached find one with read-through pattern - \\
 * @param {string} collection - collection name
 * @param {object} filter - query filter
 * @param {number} ttl_ms - optional TTL override
 * @returns {Promise<T | null>} query result
 */
export async function cached_find_one<T extends object>(
    collection: string,
    filter: object,
    ttl_ms?: number
): Promise<T | null> {
    const cache_key = generate_cache_key(collection, filter)
    const result = await db_cache.get_or_set_async(
        cache_key,
        async () => {
            return await db.find_one<T>(collection, filter)
        },
        ttl_ms
    )

    register_collection_key(collection, cache_key)

    return result
}

/**
 * - 带读穿模式的缓存多条查询 - \\
 * - cached find many with read-through pattern - \\
 * @param {string} collection - collection name
 * @param {object} filter - query filter
 * @param {number} ttl_ms - optional TTL override
 * @returns {Promise<T[]>} query results
 */
export async function cached_find_many<T extends object>(
    collection: string,
    filter: object = {},
    ttl_ms?: number
): Promise<T[]> {
    const cache_key = generate_cache_key(collection, filter)
    const result = await db_cache.get_or_set_async(
        cache_key,
        async () => {
            return await db.find_many<T>(collection, filter)
        },
        ttl_ms
    )

    register_collection_key(collection, cache_key)

    return result
}

/**
 * - 带缓存失效的更新单条 - \\
 * - update one with cache invalidation - \\
 * @param {string} collection - collection name
 * @param {object} filter - query filter
 * @param {Partial<T>} update - update data
 * @param {boolean} upsert - upsert flag
 * @returns {Promise<boolean>} success status
 */
export async function cached_update_one<T extends object>(
    collection: string,
    filter: object,
    update: Partial<T>,
    upsert: boolean = false
): Promise<boolean> {
    const result = await db.update_one<T>(collection, filter, update, upsert)

    if (result) {
        invalidate_collection_cache(collection)
    }

    return result
}

/**
 * - 带缓存失效的插入单条 - \\
 * - insert one with cache invalidation - \\
 * @param {string} collection - collection name
 * @param {T} doc - document to insert
 * @returns {Promise<string>} inserted ID
 */
export async function cached_insert_one<T extends object>(
    collection: string,
    doc: T
): Promise<string> {
    const result = await db.insert_one<T>(collection, doc)

    invalidate_collection_cache(collection)

    return result
}

/**
 * - 带缓存失效的删除单条 - \\
 * - delete one with cache invalidation - \\
 * @param {string} collection - collection name
 * @param {object} filter - query filter
 * @returns {Promise<boolean>} success status
 */
export async function cached_delete_one(
    collection: string,
    filter: object
): Promise<boolean> {
    const result = await db.delete_one(collection, filter)

    if (result) {
        invalidate_collection_cache(collection)
    }

    return result
}

/**
 * - 带缓存失效的批量删除 - \\
 * - delete many with cache invalidation - \\
 * @param {string} collection - collection name
 * @param {object} filter - query filter
 * @returns {Promise<number>} number deleted
 */
export async function cached_delete_many(
    collection: string,
    filter: object
): Promise<number> {
    const result = await db.delete_many(collection, filter)

    if (result > 0) {
        invalidate_collection_cache(collection)
    }

    return result
}

/**
 * - 带缓存失效的字段递增 - \\
 * - increment with cache invalidation - \\
 * @param {string} collection - collection name
 * @param {object} filter - query filter
 * @param {string} field - field to increment
 * @param {number} amount - amount to increment
 * @returns {Promise<void>}
 */
export async function cached_increment(
    collection: string,
    filter: object,
    field: string,
    amount: number = 1
): Promise<void> {
    await db.increment(collection, filter, field, amount)

    invalidate_collection_cache(collection)
}

/**
 * - 预取相关数据 - \\
 * - prefetch related data - \\
 * @param {string} collection - collection name
 * @param {object[]} filters - array of filters to prefetch
 * @param {number} ttl_ms - optional TTL override
 * @returns {Promise<void>}
 */
export async function prefetch_data<T extends object>(
    collection: string,
    filters: object[],
    ttl_ms?: number
): Promise<void> {
    const promises = filters.map(filter => cached_find_one<T>(collection, filter, ttl_ms))
    await Promise.all(promises)
}

/**
 * - 预热集合缓存 - \\
 * - warm cache for collection - \\
 * @param {string} collection - collection name
 * @param {number} ttl_ms - optional TTL override
 * @returns {Promise<void>}
 */
export async function warm_collection_cache<T extends object>(
    collection: string,
    ttl_ms?: number
): Promise<void> {
    const data = await db.find_many<T>(collection, {})

    for (const item of data) {
        const cache_key = generate_cache_key(collection, item)
        db_cache.set(cache_key, item, ttl_ms)
        register_collection_key(collection, cache_key)
    }

    if (!is_production) {
        console.log(`[ - DB CACHE - ] Warmed cache for ${collection}: ${data.length} items`)
    }
}

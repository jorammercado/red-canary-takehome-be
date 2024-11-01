const db = require("../db/dbConfig.js")

const addBlockedIp = async (ip_address, block_expiration, user_id) => {
    try {
        await db.none(
            `INSERT INTO blocked_ips (ip_address, block_expiration, user_id)
             VALUES ($1, $2, $3)`,
            [ip_address, block_expiration, user_id]
        )
        return { success: true }
    } catch (err) {
        return { err: `${err}, SQL query error - add blocked IP` }
    }
}

const updateBlockedIpExpiration = async (ip_address, new_block_expiration) => {
    try {
        await db.none(
            `UPDATE blocked_ips 
             SET block_expiration = $1 
             WHERE ip_address = $2`,
            [new_block_expiration, ip_address]
        )
        return { success: true }
    } catch (err) {
        return { err: `${err}, SQL query error - update blocked IP expiration` }
    }
}

const getBlockedIp = async (ip_address) => {
    try {
        const blockedIp = await db.oneOrNone(
            `SELECT * FROM blocked_ips WHERE ip_address=$1`,
            [ip_address]
        )
        return blockedIp
    } catch (err) {
        return { err: `${err}, SQL query error - get blocked IP` }
    }
}

const isIpBlocked = async (ip_address) => {
    try {
        const result = await db.oneOrNone(
            `SELECT * FROM blocked_ips WHERE ip_address=$1 AND block_expiration > CURRENT_TIMESTAMP`,
            [ip_address]
        )
        return result
    } catch (err) {
        return { err: `${err}, sql query error - check if IP is blocked` }
    }
}

const getLastSevenAttemptsForIp = async (ip_address) => {
    try {
        const result = await db.any(
            `SELECT * FROM login_attempts WHERE ip_address=$1 ORDER BY attempt_time DESC LIMIT 7`,
            [ip_address]
        )
        return result
    } catch (err) {
        return { err: `${err}, sql query error - get last ten attempts for IP` }
    }
}

module.exports = {
    updateBlockedIpExpiration,
    isIpBlocked,
    getLastSevenAttemptsForIp,
    addBlockedIp,
    getBlockedIp
}
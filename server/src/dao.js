import pg from 'pg'

const { VLK_PG_HOST, VLK_PG_PORT, VLK_PG_USERNAME, VLK_PG_PASSWORD, VLK_PG_DATABASE } = process.env

const pool = new pg.Pool({
    host: VLK_PG_HOST,
    port: VLK_PG_PORT,
    user: VLK_PG_USERNAME,
    password: VLK_PG_PASSWORD,
    database: VLK_PG_DATABASE,
    ssl: false
})

const execute = async (query, params) => {
    const connection = await pool.connect()
    try {
        const result = await connection.query(query, params)
        return result
    } catch (error) {
        throw error
    } finally {
        connection.release()
    }
}

export const getSongs = async () => {
    const result = await execute('SELECT * FROM songs ORDER BY number')
    return result.rows
}

export const addSong = async (title, lyrics, number) => {
    await execute('UPDATE songs SET number = number + 1 WHERE number>=$1', [number])
    const query = 'INSERT INTO songs (title, lyrics, number) VALUES ($1,$2, $3) RETURNING id'
    const result = await pool.query(query, [title, lyrics, number])
    return { id: result.rows[0].id, title, lyrics, number }
}

export const setSong = async (id, title, lyrics, number) => {
    console.log('setSong', id, title, lyrics, number)
    const result1 = await execute('SELECT number FROM songs WHERE id=$1', [id])
    const oldNumber = result1.rows[0].number ?? 0

    if (oldNumber > number) {
        // moving up
        const query1 = 'UPDATE songs SET number = number + 1 WHERE number >= $1 AND number < $2'
        await execute(query1, [number, oldNumber])
    }

    if (oldNumber < number) {
        // moving down
        const query1 = 'UPDATE songs SET number = number - 1 WHERE number > $1 AND number <= $2'
        await execute(query1, [oldNumber, number])
    }

    const query = 'UPDATE songs SET title=$2, lyrics=$3, number=$4 WHERE id=$1'
    const result = await execute(query, [id, title, lyrics, number])
    return result.rowCount === 1
}

export const delSong = async (id) => {
    await execute('UPDATE songs SET number = number - 1 WHERE number > (SELECT number FROM songs WHERE id=$1)', [id])
    const result = await execute('DELETE FROM songs WHERE id=$1', [id])
    return result.rowCount === 1
}

export const getFeedback = async () => {
    const query = 'SELECT id, message, sender, relates_to FROM feedbacks'
    const result = await execute(query)
    return result.rows
}

export const addFeedback = async (message, sender, relatesTo) => {
    const query = 'INSERT INTO feedbacks (message, sender, relates_to) values ($1, $2, $3)'
    const result = await execute(query, [message, sender, relatesTo])
    return result.rowCount === 1
}

export const delFeedback = async (id) => {
    const query = 'DELETE FROM feedbacks WHERE id=$1'
    const result = await execute(query, [id])
    return result.rowCount === 1
}

export const getAdminUser = async (username) => {
    const query = 'SELECT hash FROM admins WHERE username=$1'
    const result = await execute(query, [username])
    return result.rows[0]
}
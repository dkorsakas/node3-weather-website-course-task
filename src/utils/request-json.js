const https = require('https')

// Fetch JSON without the unmaintained request dependency or cross-host redirects.
module.exports = ({ url }, callback) => {
    let completed = false
    const finish = (error, result) => {
        if (completed) return
        completed = true
        callback(error, result)
    }
    const request = https.get(url, response => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
            response.resume()
            return finish(new Error('Upstream service returned an error'))
        }
        let body = ''
        response.setEncoding('utf8')
        response.on('data', chunk => {
            body += chunk
            if (body.length > 1024 * 1024) {
                finish(new Error('Upstream response is too large'))
                response.destroy()
            }
        })
        response.on('error', finish)
        response.on('end', () => {
            let parsed
            try { parsed = JSON.parse(body) } catch (error) { return finish(error) }
            finish(undefined, { body: parsed })
        })
    })
    request.setTimeout(10000, () => request.destroy(new Error('Upstream request timed out')))
    request.on('error', finish)
}

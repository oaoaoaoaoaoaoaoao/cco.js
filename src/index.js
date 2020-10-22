
const fetch = require('node-fetch');
const md5 = require('md5');
const fastify = require('fastify')();
const { APIError } = require('./utils/errors');

class CCO {
    baseURL = 'https://simulator.apiuser.ru/';
    onPaymentCallback

    constructor(token) {
        if (!token) {
            throw new ReferenceError(
                'Параметр "token" обязателен.'
            );
        }
        this.token = token;
    };
    async call(method, params = {}) {
        if (!method) {
            throw new ReferenceError(
                'Вы не указали параметр "method"'
            )
        }
        const json = await fetch(this.baseURL + method, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.token,
                ...params
            }),
            method: 'POST'
        })

        const response = await json.json()
        if (response.status == 'error') {
            throw new APIError({
                code: response.error_code,
                msg: response.error_msg
            })
        };
        return response
    }
    sendPayment(peer_id, count) {
        return this.call('transfers.create', { peer_id, count })
    }
    getHistory(type = "in", limit = 10) {
        return this.call('transfers.getHistory', { type, limit })
    }
    getLink(user_id) {
        return 'https://vk.com/app7602416#to=' + user_id
    }
    async startPolling(path, port = 8080) {
        if (!path) throw new ReferenceError('Параметр "path" обязателен.')
        if (!path.startsWith('http')) throw new ReferenceError('Параметр "path" должен начинаться с http(s):// .')
        this.call('webhooks.create', {
            url: path + ':' + port + '/webhook'
        })
        return new Promise((resolve) => {
            fastify.post('/webhook', (req, res) => {
                res.send('ok')
                if (req.body.type === 'transfer_new') {
                    const { count, owner_id, secret } = req.body.object
                    if (secret === md5(`${owner_id}:${count}:${this.token}`)) {
                        this.onPaymentCallback({ count, owner_id })
                    }
                }
            })
            fastify.listen(port, '::', () => {
                resolve()
            })
        })
    }
    onPayment(context) {
        this.onPaymentCallback = context
    }
}

module.exports = { Domosed }
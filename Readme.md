# Установка

**yarn**
 `yarn add cco.js`
 
**npm**
 `npm i cco.js`

## Подключение

``` js
const {
    CCO
} = require('cco.js')

const api = new CCO(your_token)
```

## Методы API

***sendPayment*** - Совершить перевод монет указанному пользователю

``` js
    const payment = await api.sendPayment(ид пользователя, сумма);
    console.log(payment);
```

##
***getHistory*** - Получить историю последних платежей

``` js
    const payments = await api.getHistoryPayments('all', 50);
    console.log(payments);
```

##
***getLink*** - Получить ссылку на перевод монет проекту
``` js
    const link = await api.getPaymentLink();
    console.log(link);
```

##
***Прослушивание входящих переводов:***
``` js
    api.startPolling('ваш домен (или ip)', порт);

    api.onPayment(info => {
        const {
            count,
            owner_id
        } = info;
        console.log(info);
    });
```

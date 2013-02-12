Yarinage.js
================

[![Build Status](https://travis-ci.org/glassesfactory/yarinage.js.png)](https://travis-ci.org/glassesfactory/yarinage.js)

Yarinage.js は msgpack を Ajax でやり取りすることをサポートします。
msgpack.js に依存しています。

> [msgpack.js](https://github.com/uupaa/msgpack.js)


使い方
---------

Yarinage を適時必要なオプションを渡しつつ、
`upload/load` を実行して下さい。

```coffee
#data upload
arr = $('#なんかふぉーむ').serializeArray()
      
yari = new Yarinage({
  success:(data)->
    console.log data
  error:(error)->
    console.log error
})
yari.upload('/api/url' , arr)
 
#data download
yari = new Yarinage({
  success:(data)->
    console.log data
  error:(error)->
    console.log error
})
yari.load('/api/url')
```

* 内部的に msgpack を ArrayBuffer に変換しているので pack とか unpack しなくても送受信できます。
* `upload/load` 時にオプションとして通信時のメソッドなどを渡せます。

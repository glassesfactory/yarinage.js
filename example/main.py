#!/usr/bin/env python
# -*- coding: utf-8 -*-

from functools import wraps
from flask import Flask, request, Response, render_template
import msgpack

app = Flask(__name__, static_folder='assets')


def header_check(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not 'application/x-msgpack' in request.headers['Content-Type']:
            return Response(u'( ﾟдﾟ)帰れ', status=400)
        return f(*args, **kwargs)
    return decorated


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api', methods=['GET'])
# @header_check
def api_index():
    packed = msgpack.packb(u":( ﾞﾟ'ωﾟ'）:ウウウオオオアアアーーー！！！")
    return Response(packed, content_type="application/x-msgpack", status=200)


@app.route('/api', methods=['POST'])
@header_check
def api_create():
    data = request.data
    print msgpack.unpackb(data)
    return Response('yes', status=200)

if __name__ == '__main__':
    app.run(debug=True)

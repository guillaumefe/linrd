#!/Users/guillaumefe/.pyenv/shims/python
"""
Usage:
touch my_todo.yml
./pipelinr
"""
from flask import Flask, redirect, url_for, render_template
from flask import request
import json

from pipelinr.lib import pipelinr

TARGET_FOLDER = '.'

cache = {
    'history' : [],
    'cursor' : 0
}

def serve(pipeline):

    app = Flask(__name__, static_url_path='');

    @app.route('/api')
    def api():
        if pipeline.tasks not in cache['history']:
            cache['history'].append(pipeline.tasks)
        return repr(pipeline.tasks)

    @app.route('/next')
    def nxt():

        def process(_done):
            done = {}
            try:
                done = json.loads(_done)
            except TypeError as r:
                # return cache['history'][-1]
                return
            del _done
            for t in pipeline.tasks:
                if t.recipe in done and done[t.recipe]:
                    t.done()
                    next(pipeline)

        cache['cursor'] = cache['cursor'] + 1
        if cache['cursor'] < len(cache['history']) - 2:
            x = repr(cache['history'][cache['cursor']])
            return x
        else:
            done = request.args.get('done')
            process(done)
            cache['history'].append(pipeline.tasks)
            return repr(pipeline.tasks)

    @app.route('/prev')
    def prev():
        if cache['cursor'] > 0:
            cache['cursor'] = cache['cursor'] - 1
            x = repr(cache['history'][cache['cursor']])
        else:
            x = repr(cache['history'][0])
        return x

    @app.route('/simulate')
    def sim():
        return repr(pipeline)

    @app.route('/', methods=['GET'])
    def index():
        return redirect(url_for('static', filename='index.html'))

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404

    app.run(host='0.0.0.0')


def run():
    pipeline = pipelinr.Pipeline({
        'sort_order' : ['step'],
        'sort_reverse' : False
    })
    pipeline.load(TARGET_FOLDER)
    serve(pipeline)

if __name__ == '__main__':
    run() 



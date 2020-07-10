import json
import glob
import re
from functools import reduce
from pathlib import Path
import os
import time
from functools import wraps
from itertools import product
from json import JSONEncoder

import pkg_resources
pkg_resources.require("PyYAML==5.3.1")
import yaml

def fn_timer(function):
    @wraps(function)
    def function_timer(*args, **kwargs):
        t0 = time.time()
        result = function(*args, **kwargs)
        t1 = time.time()
        print ("Total time running %s: %s seconds" %
               (function.__name__, str(t1-t0)))
        return result
    return function_timer

class Pipeline:

    class Folder:
        def __init__(self, name, path):
            self.name = str(name)
            self.uri = str(path)
            self.update()

        def update(self):
            self.recipes = []
            files1 = glob.glob(self.uri+'/*.yml', recursive=False)
            for filename in [] + files1: # TODO options config
                with open(filename) as file:
                    recipe_name = os.path.basename(os.path.splitext(filename)[0])
                    recipe = self.Recipe(file, recipe_name)
                    self.recipes.append(recipe)

        def __iter__(self):
            self.n = 0
            return self

        def __next__(self):
            if self.n < len(self.recipes):
                result = self.recipes[self.n]
                self.n += 1
                return result
            else:
                raise StopIteration

        class Recipe:
    
            def __init__(self, yml_recipe, name=''):
                self.update(yml_recipe)
                self.name = name

            def gen(self):
                #ICI
                #MAMA
                recipe = self.make_recipe(self.__recipe, self.name)
                return recipe

            def update(self, yml_recipe):
                self.__recipe = yaml.load(yml_recipe, Loader=yaml.BaseLoader)
                # print(self.__recipe)

            class Task():

                # def __init__(self, string, position=0, total=0, ancestors=[], recipe=None, isleaf=None):
                def __init__(self, string, position=0, total=0, ancestors=[], recipe=None):
                    self.ancestors = ancestors
                    self.position = position
                    self.total = total
                    #self.recipe = 'hello world'

                    @fn_timer
                    def tokenize(n):
                        a = re.findall('^\s+|^|\(.*?\)|\w+', n)
                        bag = filter(lambda a : not a[0]=='(', a[1:])
                        attrs = {}

                        try:
                            attrs1 = filter(lambda a : a[0]=='(', a[1:])
                            attrs2 = map(lambda e : e[1:-1].split('='), attrs1)
                            def set(e):
                                if len(e) != 2: return {}
                                return {
                                    e[0]: e[1]
                                }
                            attrs3 = map(lambda e : set(e), attrs2)
                            def red(e, k):
                                for ii in e:
                                    if ii in k:
                                        try:
                                            k[ii] = int(k[ii]) + int(e[ii])
                                        except:
                                            k[ii] = [k[ii]] + [e[ii]]
                                    else:
                                        k[ii] = e[ii]

                                    #print(k)

                                #return {**e, **k}
                                return k

                            attrs = reduce(lambda e, k: red(e, k), attrs3, {})
                            #for ii in attrs:
                            #    print(attrs[ii])
                            del attrs3
                            del attrs1
                            del attrs2
                        except:
                            pass
                        del a
                        #print(str(list(bag)))
                        #return ' '.join(bag), dict(attrs)
                        #return n, dict(attrs), isleaf
                        #ICII
                        return n, dict(attrs), len(list(bag))
                        #TODO : remove bag (causes whitespace loss)

                    token = tokenize(string)
                    self.text = token[0]
                    self.attr = token[1]
                    self.__len = token[2]
                    #self.isleaf = token[2]
                    self.recipe = recipe
                    del token
                    
                    if string[-2:] == '--':
                        self.__done = True
                    else:
                        self.__done = False

                def __str__(self):
                    return self.text

                def __len__(self):
                    return self.__len

                @property
                def encode(self):
                    return {
                        'text': str(self.text),
                        'recipe' : str(self.recipe),
                        'position' : str(self.position),
                        'total' : str(self.total),
                        'ancestors' : self.ancestors,
                        'attr' : self.attr,
                        'done': self.__done,
                        'len': self.__len
                        #'isleaf': self.isleaf
                    }

                def __repr__(self):
                    return json.dumps(self.encode, indent=4)

                def __int__(self):
                    return self.attr.duration or 1

                def done(self):
                    self.__done = True

                def undone(self):
                    self.__done = False

                @property
                def is_done(self):
                    return self.__done

            def make_recipe(self, recipe, recipe_name):
                #MAKE
                o = recipe
                env = {
                }

                @fn_timer
                def parse(o, position=0, count=0, previous=[], recipe=None):
                    if isinstance(o, str):

                        def search(phrase):
                            out = []
                            x = re.split(' ', phrase)
                            for i in x:
                                y = re.findall("\[(.*?)\]", i)
                                if y:
                                    out.append(''.join(y).split(','))
                                else:
                                    out.append([i])
                            return out

                        def build(*lists):
                            #print('L',*lists)
                            x = list(product(*lists))
                            #print(x)
                            y = [' '.join(n) for n in x]
                            return y

                        lists = search(str(o))
                        #print(lists)
                        built = build(*lists)
                        #print(len(built))

                        #print(position)
                        #print(recipe)
                        #print(o)
                        #a = self.make_recipe(built)
                        #import sys
                        #sys.exit()

                        for i in range(len(built)):
                            # yield self.Task(o, position=position, total=count, ancestors=previous, recipe=recipe, isleaf=True)
                            #yield self.Task(o, position=position, total=count, ancestors=previous, recipe=recipe)
                            x = self.Task(o, position=position, total=count, ancestors=previous, recipe=recipe)
                            #if (o.strip()):
                            if len(x) > 0:
                                yield x

                    else:
                        if isinstance(o, list):
                            for i,e in enumerate(o):
                                yield from parse(e, i+1, len(o), previous, recipe=recipe)
                        else:

                            try:
                                for i,e in enumerate(o):

                                    if type(o[e]) is dict:

                                        if len(o[e]) == 0:
                                            o[e] = e

                                        # LA and len(o[e])
                                        #print('YAY', e, len(o[e]))
                                        #if e in env:
                                        #    o[e] = env[e]
                                        #else:
                                        if type(o[e]) != str and not next(iter(o[e].values())) == '':
                                            #print(o[e], len(o[e]), 'ICI')
                                            env[e] = o[e]
                                        #yield from parse(o[e], position, count, previous + [e])
                                        #yield self.Task(e, position=position, total=count, ancestors=previous)
                                            return

                                    if not len(o[e]):
                                        try:
                                            dep = e.split('->')
                                            output = json.loads(json.dumps(env))
                                            #print(env)
                                            #output = env
                                            for part in dep:
                                                output = output[part] 
                                            o[e] = output
                                        except KeyError:
                                            o[e] = e
                                        """
                                        try:
                                            dep = e.split('->')
                                            if len(dep)> 1:
                                                output = json.loads(json.dumps(env))
                                                #output = env
                                                for part in dep:
                                                    output = output[part] 
                                                o[e] = output
                                            else:
                                                o[e] = e
                                        except KeyError:
                                            o[e] = e
                                        """

                                    yield from parse(o[e], position, count, previous + [e], recipe=recipe)
                                    #yield self.Task(e, position=position, total=count, ancestors=previous, recipe=recipe)
                                    x = self.Task(e, position=position, total=count, ancestors=previous, recipe=recipe)
                                    if len(x) > 0:
                                        yield x
                                    #yield self.Task(e, position=position, total=count, ancestors=previous, recipe=recipe, isleaf=False)

                            except TypeError:
                                pass
                executor = parse(o, recipe=recipe_name)
                #TODO infinite generators
                #def gen(a_=executor):
                #    while True:
                #        yield next(a_)
                return executor

    def __init__(self, config):
        self.__config = config or {}
        self.recipes = []
        self.folders = []
        #self.pipelines = []
        self.tasks = []

    @property
    def encode(self):
        output = []
        for recipe in self.recipes:
            r = recipe['blueprint']
            for t in r():
                output.append(t.encode)
        return output

    def __repr__(self):
        self.sort()
        return json.dumps(self.encode, indent=4)
    
    @fn_timer
    def load(self, *args):
        for path in args:
            relative = Path(path)
            absolute = relative.absolute()
            if absolute not in self.folders:
                self.folders.append(absolute)
                pipeline = self.Folder(relative, absolute)
                #self.pipelines.append(pipeline)
                for recipe in pipeline.recipes:
                    self.recipes.append({
                        'name': recipe.name,
                        'gen': recipe.gen(),
                        'blueprint': recipe.gen
                    })
        # populate tasks
        self.__tasks = {}
        #self.next()
        for recipe in self.recipes:
            try:
                t = next(recipe['gen'])
                self.__tasks[recipe['name']] = t
            except StopIteration:
                pass
        self.tasks = [self.__tasks[task] for task in self.__tasks]
        self.sort()

    @fn_timer
    def next(self, recipe_name=None):
        #if recipe_name == None:
        #    print('ERRORRRORR:wq1')
            #for task in self.__tasks:
                #ICI
                #print(task, repr(self.__tasks[task]), "OCOCOCOCOCO1")
                #self.__tasks[task].done()
        self.rotate()
        #elif recipe_name in self.__tasks:
        #    print('ERRORRRORR:wq2')
        #    print(task, repr(self.__tasks[task]), "OCOCOCOCOCO2")
        #    self.__tasks[recipe_name].done()
        #    self.rotate()
        #else:
        #    print('ERRORRRORR:wq3')
        self.sort()
        return self.__tasks

    def __next__(self):
        return repr(self.next())

    @fn_timer
    def sort(self, *args):
        def algo(e):
            if 'sort_order' in self.config:
                for key in self.config['sort_order']:
                    if key in [e for e in e.attr]:
                        return int(e.attr[key])
            return 0

        reverse = False
        if 'sort_reverse' in self.config:
            reverse = self.config['sort_reverse']
        self.tasks.sort(reverse=reverse, key=algo)

    @fn_timer
    #ICI IMPORTANT
    def rotate(self):
        for recipe in self.recipes:
            try:
                t = self.__tasks[recipe['name']]
                if t.is_done:
                    self.__tasks[recipe['name']] = next(recipe['gen'])
            except StopIteration:
                del self.__tasks[recipe['name']]
                pass
            except KeyError:
                pass

        self.tasks = [self.__tasks[task] for task in self.__tasks]

    #def __iter__(self):
    #    self.n = 0
    #    return self

    #def __next__(self):
    #    if self.n < len(self.tasks):
    #        result = self.tasks[self.n]
    #        self.n += 1
    #        return result
    #    else:
    #        raise StopIteration

    #def __str__(self):
    #    output = f'{self.tasks[0]}'
    #    return output

    #def __repr__(self):
    #    output = ""
    #    for task in self.tasks:
    #        output += f'{task.text}'
    #    return output

    @property
    def config(self):
        return self.__config

    @config.setter
    def config(self, options):
        self.__config = options

if __name__ == '__main__':
    from flask import Flask, redirect, url_for, render_template

    TARGET_FOLDER = '.'

    def serve(pipeline):
        flask = Flask(__name__, static_url_path='');

        @flask.route('/api')
        def api():
            return repr(pipeline.tasks)

        @app.route('/next')
        def nxt():
            return next(pipeline)

        @flask.route('/simulate')
        def sim():
            return repr(pipeline)

        @flask.route('/', methods=['GET'])
        def index():
            return redirect(url_for('static', filename='index.html'))

        @flask.errorhandler(404)
        def page_not_found(e):
            return render_template('404.html'), 404
    
        flask.run()

    pipeline = Pipeline({
        'sort_order' : ['duration'],
        #'sort_reverse' : True
    })

    pipeline.load(TARGET_FOLDER)
    serve(pipeline)




"""

Objectif
- un cube imprimé en 3D
- des leds qui indiquent le "retard"/l'urgence d'agir
- un écran qui affiche la prochaine tâche à faire (pour faire revenir la lumière au vert)
- un bouton next, pour passer à la tâche suivante
- un bouton prev, pour passer à la tâche suivante
- un bouton done, pour déclarer une tâche réalisée
- (optional) un bouton cancel, pour annuler une tâche précédente (va de pair avec un timeout avant deletion)
- (optional) un mode "secouer" pour obtenir une tâche random (mais calculée quand même)

Objectif : 
    la machine récupère recette--
      Listing des tâches--
       utiliser yaml --
    la machine compile la recette et lui donne les prochaines meilleures tâches à faire --
    la machine est un microservice flask --

    version online:
     - gérer ses recettes
     - (optional) visualiser ses performances
     - visualiser ganttchart et pert
      - Créer ganttchart
      1ère étape : Le listing des tâches
      2ème étape : L'attribution des ressources et la gestion des charges
      3ème étape : La planification du champ d'action
      4ème étape : La création de connexions entre les tâches
      5ème étape : Insérer des jalons
      - Créer pert
      Préparer les tâches
      Dessiner le réseau
      Calculer les dates au plus tôt
      Calculer les dates au plus tard
      Calculer la marge de liberté d'une tâche
      Identifier le chemin critique
"""

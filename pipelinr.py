import yaml
import json
from yaml import Loader
import glob
import re
from functools import reduce
from flask import Flask
from json import JSONEncoder

class Pipelinr:
    class Task:
        def __init__(self, string, position=0, total=0, ancestors=[]):
            self.ancestors = ancestors
            self.position = position
            self.total = total
            def tokenize(n):
                a = re.findall('^\s+|^|\(.*?\)|\w+', n)
                bag = filter(lambda a : not a[0]=='(', a[1:])
                attrs1 = filter(lambda a : a[0]=='(', a[1:])
                attrs2 = map(lambda e : e[1:-1].split('='), attrs1)
                attrs3 = map(lambda e : {e[0]:e[1]}, attrs2)
                attrs = reduce(lambda e, k: {**e, **k}, attrs3, {})
                del a
                del attrs1
                del attrs2
                del attrs3
                return ' '.join(bag), dict(attrs)
            token = tokenize(string)
            self.text = token[0]
            self.attr = token[1]
            del token

        def __repr__(self):
            return str({
                'text': self.text,
                'attr': self.attr
            })

        def __str__(self):
            return self.text
    
        def __int__(self):
            return self.attr.duration or 1

    class Recipe:

        def __init__(self, yml_recipe):
            self.update(yml_recipe)

        @property
        def recipe(self):
            recipe = self.make_recipe(self.__recipe)
            return recipe

        def update(self, yml_recipe):
            self.__recipe = yaml.load(yml_recipe, Loader=Loader)

        def make_recipe(self, recipe):
            o = recipe
            def parse(o, position=0, count=0, previous=None):
                if previous is None:
                    previous = []
                if isinstance(o, str):
                    yield Pipelinr.Task(o, position=position, total=count, ancestors=previous)
                else:
                    if isinstance(o, list):
                        for i,e in enumerate(o):
                            yield from parse(e, i+1, len(o), previous)
                    else:
                        for e in o:
                            previous.append(e)
                            yield from parse(o[e], position, count, previous)
                            yield Pipelinr.Task(e, position=position, total=count, ancestors=previous)
            executor = parse(o)
            #TODO infinite generators
            #def gen(a_=executor):
            #    while True:
            #        yield next(a_)
            return executor

    class Pipeline:
        def __init__(self, *args):
            self.recipes = []
            for recipe in args:
                self.recipes.append(recipe)

    # Pipelinr
    class Serve:
        class Folder:
            def __init__(self, folder):
                self.recipes = []
                self.uri = folder
                for filename in glob.glob(folder+'/*.yml'):
                    with open(filename) as recipe:
                        recipe = Pipelinr.Recipe(recipe)
                        self + recipe

            def __add__(self, other):
                self.recipes.append(other.recipe)

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

        class Encoder(JSONEncoder):
            def default(self, o):
                return repr(o)

        def __init__(self, path):
            folder = self.Folder(path)
            self.__runtime = Flask(__name__)
            @self.__runtime.route('/')
            def route():
                todo = []
                for recipe in folder:
                    try:
                        u = next(recipe)
                        todo.append(u)
                    except StopIteration:
                        pass
                output = todo
                output = self.Encoder().encode(output)
                return output

        def start(self):
            self.__runtime.run()

    def __init__(self):
        self.recipes = []
        self.folders = []
        self.tasks = []

    def load(self, folder):
        folder = self.Serve.Folder(folder)
        from pathlib import Path
        relative = Path(folder.uri)
        absolute = relative.absolute()
        if absolute not in self.folders:
            self.folders.append(absolute)
            self.recipes = self.recipes + folder.recipes
        self.tasks = [next(task) for task in self.recipes]
        self.sort('duration')

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

    def sort(self, *args):
        def algo(e):
            for key in args:
                if key in e.attr:
                    return int(e.attr[key])
                return 1
        self.tasks.sort(reverse=False, key=algo)

    def __str__(self):
        output = f'{self.tasks[0]}'
        return output

    def __repr__(self):
        output = ""
        for task in self.tasks:
            output += f'{task.text}'
        return output

    @classmethod
    def serve(cls, folder):
        server = cls.Serve(folder)
        server.start()

ppl = Pipelinr()
ppl.load('.')
print(repr(ppl))
print(ppl)

#for pipeline in ppl:
#    print(next(pipeline))

Pipelinr.serve('.')

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
    la machine est un microservice flask

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

#!/usr/bin/python3

#v0.0.1

import functools
import re
import fileinput
import sys
from glob import glob
import os


# Configuration
reset = '\u001b[0m'
black = '\u001b[30m'
red = '\u001b[31m'
green = '\u001b[32m'
yellow = '\u001b[33m'
blue = '\u001b[34m'
magenta = '\u001b[35m'
cyan = '\u001b[36m'
white = '\u001b[37m'
bright_black = '\u001b[30;1m'
bright_red = '\u001b[31;1m'
bright_green = '\u001b[32;1m'
bright_yellow = '\u001b[33;1m'
bright_blue = '\u001b[34;1m'
bright_magenta = '\u001b[35;1m'
bright_cyan = '\u001b[36;1m'
bright_white = '\u001b[37;1m'
background_black = '\u001b[40m'
background_red = '\u001b[41m'
background_green = '\u001b[42m'
background_yellow = '\u001b[43m'
background_blue = '\u001b[44m'
background_magenta = '\u001b[45m'
background_cyan = '\u001b[46m'
background_white = '\u001b[47m'
background_bright_black = '\u001b[40;1m'
background_bright_red = '\u001b[41;1m'
background_bright_green = '\u001b[42;1m'
background_bright_yellow = '\u001b[43;1m'
background_bright_blue = '\u001b[44;1m'
background_bright_magenta = '\u001b[45;1m'
background_bright_cyan = '\u001b[46;1m'
background_bright_white = '\u001b[47;1m'
reset = '\u001b[0m'

COLOR_TAGS = bright_green
MAXTAGPERLINE = 5


class Task:

    def __init__(self, line):
        # I am a value related to one action to do IRL
        self.value = line
        self.recipe = None

        # dateTimeObj = datetime.now()
        # self.uuid = dateTimeObj

        # Taskwarrior compliant
        # def now():
        #     return datetime.now().strftime("%Y%m%dT%H%M%SZ") # Performance Killer, should be in Pipeline
        # self.status = 'pending'
        # self.urgency = 0
        # self.entry = now()
        # self.modified = now()
        # self.viewed = now()

        """
        # level
        self.level = len(self.value) - len(self.value.lstrip())

        # position
        positional = re.search('[0-9]+', self.value) # Performance Killer +300%
        try:
            self.position = int(positional.group())
        except AttributeError:
            self.position = 0
        """

    @property
    def description(self):
        # I record my name
        clean = self.value.strip()
        clean = clean.lstrip(str(self.position))
        clean = clean.strip(' ./')
        clean = clean.strip('- ')
        clean = clean[:1].upper() + clean[1:]
        return clean

    @property
    def position(self):
        # I try to find a leading number, w indicates a positionable task
        # positional = re.search('[0-9]+', self.value.strip()) # Performance Killer
        # pattern = '[0-9]+'
        pattern = '^\d+'
        positional = re.search(pattern, self.value.strip()) # Performance Killer
        try:
            return int(positional.group())
        except AttributeError:
            return 0

    @property
    def level(self):
        # how many leading spaces do I have?
        return len(self.value) - len(self.value.lstrip())

    def __repr__(self):
        # Taskwarrior compliant
        # {"id":1,"description":"Buy milk","entry":"20141018T050231Z","modified":"20141018T050231Z","status":"pending","uuid":"a360fc44-315c-4366-b70c-ea7e7520b749","urgency":"2"}
        return self.value

    def __str__(self):
        # I show what I got
        return self.description

class Recipe():

    def __init__(self, lines):

        def reducer(a, b):

            # b_value = b.strip()
            
            if not b.strip():
                return a
            
            if len(b.strip()) > 1 and b.strip()[-1] == '-' and b.strip()[-2] == '-':
                return a

            recipes = a[4]
            me = a[0]
            actionables = a[1]
            level = a[2]
            lock = a[3]
            next_one = Task(b)

            if b.strip()[0] == '#':
                recipe = b.strip(' #\n')
                recipe = '#' + recipe[:1].upper() + recipe[1:].lower()
                recipe = '[' + recipe + ']'
                recipes.append(recipe)
                return a

            if me is not None:

                # import pdb
                # pdb.set_trace()

                # Keep track of current level
                lock = int(me.level)

                if me.level not in level:  # The magic is here
                    level[me.level] = me.position  # and here

                if next_one.level <= lock:  # Performance Killer

                    position = int(me.position)

                    # Position measurement
                    if lock not in level:
                        level[lock] = position 

                    if level[lock] == 0:
                        level[lock] = position

                    if position <= level[lock]:
                        actionables.append(me)

                    if next_one.level < lock:
                        del level[lock]

                else:
                    
                    if lock in level and me.position > level[lock]:
                        return a

            return next_one, actionables, level, lock, recipes

        actionables = []
        level = {}
        next_one = None
        lock = False
        recipes = []
        _, actionables, _, _, recipes = functools.reduce(reducer, lines, (next_one, actionables, level, lock, recipes))
        self.actionables = actionables  # DO NOT pass the object directly
        self.recipes = recipes


    def __iter__(self):
        # I list what I got
        for i in self.actionables:
            yield i 

    def __len__(self):
        # how many tasks are actionables?
        return len(self.actionables)
            
    def __str__(self):
        # I show what I got
        output = ''
        if len(self.recipes) : 

            cpt = 0
            max = MAXTAGPERLINE
            output += COLOR_TAGS +''
            for i in self.recipes:
                output += str(i) + ' '
                if cpt > max:
                    output += '\n'
                    cpt = 0
                else:
                    cpt += 1

            output += '\033[0m\n'
        for k, i in enumerate(self):
            output += '[{}] '.format(k+1) + str(i) + '\n'
        return output

class Pipeline():
    
    # I operate a bunch of recipes
    
    def __init__(self, *args, **kwargs):
        # I build a matrix and add recipes to it
        self.matrix = { i:Recipe(r) for i, r in enumerate(args) }

        counter = len(self.matrix)

        for i, r in enumerate(kwargs.items()):
            rec = Recipe([Task(str(i2)).value for i2 in r[1]])
            self.matrix[counter] = {r[0] : rec}
            counter = counter + 1

    def __iter__(self):
        # I list
        for i in self.matrix:
            yield i 

    def done_current_task(self, index):
        for i in self:
            print(self[i])

    def __getitem__(self, id):
         # I get
        return self.matrix[id]

    def __str__(self):
        # I show
        output = ''
        for i in self:
            if isinstance(self[i], dict):
                a = self[i].items()
                a = iter(a)
                t = next(a)
                output += str(t[0]) + '\n'
                output += str(t[1])
            else:
                output += str(self[i])
        return output

def main():
    import sys
    import argparse

    def red(text):
        # print('\033[31m', text, '\033[0m', sep='')
        print('\033[31m', text, '\033[0m')
    
    def excepthook(type, value, traceback):
        import traceback
        import sys

        red('ERROR {}: {}'.format(type, value))
        tb = value.__traceback__
        traceback.print_tb(tb)

    sys.excepthook = excepthook

    

    def info():

        logo = """


        ██████╗ ██╗██████╗ ███████╗██╗     ██╗███╗   ██╗██████╗ 
        ██╔══██╗██║██╔══██╗██╔════╝██║     ██║████╗  ██║██╔══██╗
        ██████╔╝██║██████╔╝█████╗  ██║     ██║██╔██╗ ██║██████╔╝
        ██╔═══╝ ██║██╔═══╝ ██╔══╝  ██║     ██║██║╚██╗██║██╔══██╗
        ██║     ██║██║     ███████╗███████╗██║██║ ╚████║██║  ██║
        ╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
        An effective task engine.\n
        """

        licence = """
        GNU GENERAL PUBLIC LICENSE
        Version 3, 29 June 2007
        """

        faq = """
        What is Pipelinr?

        A todo engine. I's goal is to read as fast as possible a classical 
        todolist writed down on a file and to deliver the last tasks actionables.

        - How do I use it?

        You have to write a file more or less like this:

            # project
            1. c
              - do this first
            2. b
              - c
              - d
                1. do this second
                 1. do this before previous
                 2. do that after 1.
                 - do x when you want
                 - do y same time
                  - this has to be done prior to y
                 etc.

        Save your file as 'todo' or other custom name. If you saved your file 
        as 'todo', mv in the file folder in command line and then execute pipelinr 
        without argument:

            cd mydir
            touch todo
            vim todo
            pipelinr

        You can also open a specific file:

            pipelinr -f my_specific_file

        """

        return logo + licence + faq

    try:

        parser = argparse.ArgumentParser(description='Pipelinr displays first possible actions from large todolists', formatter_class=argparse.RawTextHelpFormatter)
        group = parser.add_mutually_exclusive_group()
        group.add_argument('-f', metavar='file', nargs='+', help='Displays a specific todolist')
        group.add_argument('-r', action='store_true', help='Search recursively across folders')
        group.add_argument('-i', action='store_true', help='About this software')
        group.add_argument('-d', metavar=('id', 'file'), nargs='+', help='Mark a task as done')
        # group.add_argument('-w', metavar=('message', 'file'), nargs=2, help='Pin a message')
        # group.add_argument('-uw', metavar=('message', 'file'), nargs=2, help='Unpin a message')
        args = parser.parse_args()

        from os import walk
        import os

        if args.d:

            #SO
            print()

            _file = 'todo'

            if len(args.d) is 2:
                _file = str(args.d[1])


            with open(_file, 'r') as f:
                p = Pipeline(f)
                value = ''
                lines = []
                cpt = 0

                try:
                    for i in p:
                        for task in p[i]:
                            value = repr(task)
                            lines.append(value)

                    to_delete = lines[int(args.d[0]) - 1]
                    # to_delete = lines[int(_file) - 1]
        
                    with open(_file, "r") as f:
                        lines = f.readlines()

                    input("you want to delete " + to_delete[:1].upper()+to_delete[1:].strip() + ' ')
                

                    def detect_dup(_file):
                        impacted_index = []
                        FLAG = False
                        with open(_file) as f:
                            seen = set()
                            for index, line in enumerate(f):
                                line_lower = line.lower().strip()
                                if line_lower and line_lower.strip() in seen:
                                    impacted_index.append(index)
                                    FLAG = True
                                else:
                                    seen.add(line_lower)
                        return FLAG, impacted_index
                    has_problem, impacted_index = detect_dup(_file)

                    if not has_problem:
                        with open(_file, "w") as f:
                            for line in lines:
                                if not line.strip() == to_delete.strip():
                                    f.write(line)
                    else:

                        with open(_file, "w") as f:
                            for index, line in enumerate(lines):
                                if index in impacted_index:
                                    f.write(line.strip() + ' - ' + str(index) + '\n')
                                else:
                                    f.write(line.strip() + '\n')

                        print('Conflict : L\'opération a rencontré un problème que nous avons résolu')
                        red('L\'opération a été annulée par précaution et demande un redemarrage utilisateur')
                        red('Veuillez réessayer de supprimer l\entité voulue')
                        red('Certains noms de tâches ont pû être légèrement modifiés')

                except Exception as e : red('Error: ' + str(e) + '. The file might be empty. Please complain or report a bug to guillaume.ferron@gmail.com.')
                        
            
        elif args.f:

            if type(args.f) is list:
                for r in args.f:
                    with open(r, 'r') as recipe:
                        print(Pipeline(recipe), end='')
            else:
                print(Pipeline(args.f), end='')

        elif args.r:
            for r in glob('**', recursive=True):
                if os.path.basename(r) == 'todo':
                    with open(r, 'r') as recipe:
                        print('\u001b[32;1m', '\r'+str(r).upper(), '\u001b[0m')
                        print(Pipeline(recipe), end='')

        elif args.i:
            print(info())

        else:
            for recipe in os.listdir('.'):
                if recipe == 'todo':
                    with open('todo', 'r') as recipe:
                        print(Pipeline(recipe), end='')
                        break

    except Exception as e:
        raise e
        pass


if __name__ == '__main__':
    main()



# TODO
# add positionables tasks

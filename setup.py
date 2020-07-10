from setuptools import setup, find_packages

from setuptools import setup

setup(
    name='pipelinr',
    version='1.0.1',
    packages=['pipelinr'],
    include_package_data=True,
    zip_safe=False,
    install_requires=['Flask'],
    entry_points={
        'console_scripts': [
            'pipelinr=pipelinr.pipelinr:run'
            ],
        },
)


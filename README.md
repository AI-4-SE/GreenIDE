# GreenIDE  

## What is GreenIDE?
GreenIDE is extension for Visual Studio Code that helps software developers in understanding and debugging energy consumption source code. GreenIDE supporte developers in visualizes the influence of configuration options on energy consumption at the function-level.

## Requirements 
* Python 3
* VSCode
* Energy/Performance-Influence Models (method-specificenergy & runtime data for selected projects)


## Functions
- Setting a configuration shows the energy consumption and performance of functions in the source code (on hover)
- Comparing two configurations (e.g. the default and the buggy configuration) shows the improvement and deterioration of the energy consumption of all functions
- You can display a number of hotspots and greenspots and lead them to the respective Java class
- The background colors of the functionnames visulaize if a function has a high energy consumption, compared to other functions in the project


## Installation

### Backend

To run the django server you have to ececute the following command in a terminal:
* `$ cd djangobackend/`
* `$ python -m venv venv`
* `$ . venv/bin/activate`
* `$ pip install -r requirements.txt`
* `$ python manage.py runserver`


### VSCode Extension
Run `$ code --install-extension frontend/greenide/greenide.vsix` to install the GreenIDE extension in Visual Studio Code.

Alternatively you can use the *install extension from VSIX* within VSCode for installation.



## How to use the extension
0. (Install the VSCode extension)
1. Start the Backend
2. Start VSCode
3. Open a software system on VSCode (we provided models for Kanzi and Density-Converter)
4. After some soconds (~5 seconds) the configuration dialog opens
5. Start debugging


## Developers
* Groug 05 of the Software-Technik Praktikum of the Leipzig University 2021
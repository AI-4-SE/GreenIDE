# GreenIDE  

## What is GreenIDE?
GreenIDE is extension for Visual Studio Code that helps software developers in understanding and debugging energy consumption source code. GreenIDE supports developers in visualizes the influence of configuration options on energy consumption at the function-level.

## Requirements
* Python 3.10
* VSCode
* Energy/Performance-Influence Models (method-specific energy & runtime data for selected projects)


## Functions
- Setting a configuration shows the energy consumption and performance of functions in the source code (on hover)
- Comparing two configurations (e.g. the default and the buggy configuration) shows the improvement and deterioration of the energy consumption of all functions
- Displaying a number of hotspots and greenspots and tracing them leads to the respective Java class
- The background colors of the function names visualize if a function has a high energy consumption, compared to other functions in the project


## Installation

### Backend

To run the django server, you have to execute the following commands in a terminal:
* `$ cd djangobackend/`
* `$ python -m venv venv`
* `$ . venv/bin/activate`
* `$ pip install -r requirements.txt`
* `$ python manage.py runserver`


### VSCode Extension
Run `$ code --install-extension frontend/greenide/greenide.vsix` to install the GreenIDE extension in Visual Studio Code.

Alternatively, you can use the *install extension from VSIX* within VSCode for installation.



## How to use the extension
0. (Install the VSCode extension)
1. Start the Backend
2. Start VSCode
3. Open a software system on VSCode (we provided models for Kanzi and Density-Converter)
4. After some seconds (~5 seconds) the configuration dialog opens
5. Start debugging


## Developers
* Group 05 of the Softwaretechnik-Praktikum of the Leipzig University 2021

import csv
from functools import reduce
import operator
import string
from types import MethodDescriptorType
from rest_framework.response import Response
from rest_framework import status


def responseLogicOne(config, fileType):
    methodName = config.get('method-name')

    if (methodName is None):
            return Response(data={'details': 'Missing parameters or method-name.'}, status=status.HTTP_400_BAD_REQUEST)

    if (',' in methodName):
        return Response(data={'details': 'Comma in method-name. Please use /configs route.'}, status=status.HTTP_400_BAD_REQUEST)

    data = getPerformance(methodName, config, fileType)
    
    if (not data):
        return Response(data={'details': 'missing parameters or method-name.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(data=data, status=status.HTTP_200_OK)


def responseLogicMany(config, fileType):
    if (config.get('method-name') is None):
        return Response(data={'details': 'missing parameters or method-name.'}, status=status.HTTP_400_BAD_REQUEST)

    methodsList = config.get('method-name').split(',')
    data = {}

    for method in methodsList:
        info = getPerformance(method, config, fileType)

        if (not info):
            data.update({method: {'details': 'missing parameters or method-name.'}})
        else:
            data.update({method: info})

    return Response(data=data, status=status.HTTP_200_OK)



def responseLogicAll(config, fileType):
    # A method that returns energy and runtime for all method names except main

    methodsResults = getPerformance({}, config, fileType) #Returns a dict of dicts, goes through all methods if given {} as param
    
    return Response(data=methodsResults, status=status.HTTP_200_OK)


def createDict(params, fileType):
    if fileType == 'kanzi':
        keys = ["method-name","root","BLOCKSIZE","JOBS","LEVEL","CHECKSUM","SKIP","NoTransform","Huffman","ANS0","ANS1","Range","FPAQ","TPAQ","CM","NoEntropy","BWTS","ROLZ","RLT","ZRLT","MTFT","RANK","TEXT","X86"]
    else:
        keys = ["method-name","root","AllPlatforms","Android","Windows","Web","IOS","IncludeLdpiTvdpi","MipmapInODrawable","AntiAliasing","CreateImagesetFolders","Keep","PNG","BMP","GIF","JPG","round","ceil","floor","skipExisting","QualityComp","Scale","Threads","run-time","energy"]

    targetDict = {}
    for key in keys:
        value = params.get(key)
        if value is None:
            continue
        else:
            targetDict.update({key: value})
    return targetDict


def getPerformance(methodsList, config, fileType):
    #Returns a dict with the performance of the specified method(s) as a dict of dicts: {'method-name': {'energy': x, 'run-time': y}}

    if fileType == 'kanzi':
        csvfile = open('configs/static/model_kanzi_method_level.csv', newline='')
    else:
        csvfile = open('configs/static/model_Density-Converter_Method_Level.csv', newline='')

    csvReader = csv.DictReader(csvfile)
    methodsPerformance = {} 

    #Case 1: methodsList is string, in other words a single method.

    if (type(methodsList) is str):
        currentMethod = methodsList  #It's a single method
        
        for line in csvReader:

            adjustedLine = adjustLine(line)
            lineRelevant = True

            if (line.get('method-name') != currentMethod):
                continue

            for (key, value) in adjustedLine.items():
                if (
                    float(value) 
                    and (not(key in config.keys()) or not(float(config.get(key))))
                    ):
                    lineRelevant = False
                    break

            if (lineRelevant):

                if (not methodsPerformance.get(currentMethod)):
                    methodsPerformance.update({currentMethod: {'run-time': 0, 'energy': 0}})

                parameterProduct = reduce(operator.mul, [float(i) for i in adjustedLine.values() if float(i)], 1)
                runTime = methodsPerformance.get(currentMethod).get('run-time') + parameterProduct * float(line.get('run-time'))
                energy = methodsPerformance.get(currentMethod).get('energy') + parameterProduct * float(line.get('energy'))
                methodsPerformance.update({currentMethod: {'run-time': runTime, 'energy': energy}})
        
        return methodsPerformance.get(currentMethod)

    #Case 2: methodsList isn't string, go through all methods, adding the ones with the same name together:

    for line in csvReader: #All methods
        currentMethod = line.get('method-name')
        if currentMethod.endswith('main'): continue

        lineRelevant = True
        adjustedLine = adjustLine(line) #Remove method-name, energy and runtime for comparison purposes
            
        for (key, value) in adjustedLine.items():
            if (
                float(value) 
                and (not(key in config.keys()) or not(float(config.get(key))))
                ):
                lineRelevant = False
                break

        if (lineRelevant): #If it is included in the current config  

            if (not methodsPerformance.get(currentMethod)): #First time hitting this method
                methodsPerformance.update({currentMethod: {'run-time': 0, 'energy': 0}})

            parameterProduct = reduce(operator.mul, [float(i) for i in adjustedLine.values() if float(i)], 1)
            runTime = methodsPerformance.get(currentMethod).get('run-time') + parameterProduct * float(line.get('run-time'))
            energy = methodsPerformance.get(currentMethod).get('energy') + parameterProduct * float(line.get('energy'))
            methodsPerformance.update({currentMethod: {'run-time': runTime, 'energy': energy}})
        
    return methodsPerformance


def adjustLine(line):
    adjustedLine = line.copy()
    del adjustedLine['method-name']
    del adjustedLine['run-time']
    del adjustedLine['energy']
    return adjustedLine
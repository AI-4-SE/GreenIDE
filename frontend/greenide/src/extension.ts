import * as vscode from 'vscode';
const axios = require('axios').default;

import { Project, projects } from './projects';
import { methodDecorationType, hotspotDecorationType, MethodInformation } from './methods';

let activeProject: Project = {
	name: '',
	packagePrefix: '',
	requestPath: '',
	config: [],
	mainMethod: '',
	html: () => {}
};

let token = '';
let panel: any = null;
let methods:MethodInformation[] = [];

let timeout: NodeJS.Timer | undefined = undefined;

let rootPath: string | undefined = '';

export async function activate(context: vscode.ExtensionContext) {

	await axios.post('https://swt-projekt.herokuapp.com/login/', {
		username: 'admin',
		password: 'root'
	})
	.then(function (response:any) {
		token = response.data.token;
	})
	.catch(function (error:any) {
		console.log(error);
	});

	let activeEditor = vscode.window.activeTextEditor;

	async function updateWebview() {

		methods = await getMethods();

		if (!panel) {
			panel = vscode.window.createWebviewPanel(
				'greenide',
				'Greenide Config and Performance',
				vscode.ViewColumn.Two,
				{
					enableScripts: true
				}
			);
			panel.onDidDispose(() => {
				panel = null;
				triggerUpdate();
			});
			panel.webview.onDidReceiveMessage(
				message => {
				  switch (message.command) {
					case 'revealMethod':
						if (activeProject.name === 'kanzi') {
							rootPath = activeEditor?.document.uri.path.split("/kanzi/")[0];
						} else if (activeProject.name === 'densityConverter') {
							rootPath = activeEditor?.document.uri.path.split("/at/")[0];
						}

						let pathElements = message.method.split('.');
						let pathEnd = '';

						for (let i = 0; i < pathElements.length; i++) {

							// Dateinamen beginnen mit Großbuchstaben
							if (/^\p{Lu}/u.test(pathElements[i])) {
								if (pathElements[i].includes("$")) {
									pathEnd += '/' + pathElements[i].split('$')[0] + '.java';
								} else {
									pathEnd += '/' + pathElements[i] + '.java';
								}
								break;
							} else {
								pathEnd += '/' + pathElements[i];
							}

						}

						let uri = vscode.Uri.file(rootPath + pathEnd);
						vscode.workspace.openTextDocument(uri)
						.then((doc) => {
							vscode.window.showTextDocument(doc, 1, false)
							.then(() => {

								let range = activeEditor?.document.lineAt(0).range;
								//@ts-ignore
								activeEditor.selection =  new vscode.Selection(range.start, range.end);
								//@ts-ignore
								activeEditor.revealRange(range);

								// Methoden aus neu geöffneter Datei auslesen
								getMethods()
								.then((methodsInNewFile) => {

									// Methodenamen in der Liste suchen
									for (let elem of methodsInNewFile) {
										
										if (elem.methodString === message.method) {

											let selectionRange = elem.context.selectionRange;
											//@ts-ignore
											activeEditor.selection =  new vscode.Selection(selectionRange.start, selectionRange.end);
											//@ts-ignore
											activeEditor.revealRange(selectionRange);

										}

									}

								});
							});
						});



						break;
					case 'submitconfig':
						let config = message.config;
						updateData(config);
						break;
					case 'submitconfigcompare':
						let config1 = message.config1;
						let config2 = message.config2;
						updateData(config1, config2);
						
						let performanceData1 = {};
						let performanceData2 = {};

						axios.get('https://swt-projekt.herokuapp.com/config/'+ activeProject.requestPath +'/all', {
							params: config1,
							headers: {Authorization: 'Token ' + token}
						}).then((response) => {

							performanceData1 = response.data;

							return axios.get('https://swt-projekt.herokuapp.com/config/' + activeProject.requestPath + '/all', {
								params: config2,
								headers: {Authorization: 'Token ' + token}
							});

						}).then((response) => {

							performanceData2 = response.data;

							panel.webview.postMessage({
								command: 'fillMethodTable',
								performanceData1: performanceData1,
								performanceData2: performanceData2
							});


						})
						.catch((error) => {
							console.log(error);
						});

					break;
				  }
				},
				undefined,
				context.subscriptions
			);

			panel.webview.html = activeProject.html();

		}

	}

	// Vergleich zwischen zwei Konfigs wenn zwei Parameter angegeben werden
	async function updateData(config1: any, config2?: any) {

		getMethodPerformances(methods, config1, config2);

		getOverallPerformance(config1, config2);
	}

	function getMethodPerformances(methods:MethodInformation[], config1: Object, config2?: Object) {

		// mit map() wird ein Array mit allen Methodennamen erstellt
		// mit join() wird aus diesem Array ein String gemacht, der die Elemente per Komma trennt
		let methodParameterString = methods.map(a => a.methodString).join();

		axios.get('https://swt-projekt.herokuapp.com/config/'+ activeProject.requestPath +'/many', {
			// mit {obj1, ...obj2} können zwei Objekte vereinigt werden 
			params: {'method-name': methodParameterString, ...config1},
			headers: {Authorization: 'Token ' + token}
		}).then((response) => {
			let data = response.data;

			// zu jedem Methodenobjekt wir das Performance-Attribut hinzugefügt
			// wenn die Methode vom Backend verarbeitet werden konnte, dann gibt es die Attribute run-time und energy, hier wird nur auf run-time geprüft
			// wenn die Methode nicht verarbeitet werden konnte, dann werden einfach 0 Werte gesetzt
			for (let method of methods) {

				if (data.hasOwnProperty(method.methodString)) {
					if (data[method.methodString].hasOwnProperty('run-time')) {
						method.performance = {config1:{energyUsage: response.data[method.methodString]['energy'], runtime: response.data[method.methodString]['run-time']}};
					} else {
						method.performance = {config1:{energyUsage: 0, runtime: 0}};
					}	
				}

			}

			if (config2) {

				axios.get('https://swt-projekt.herokuapp.com/config/'+ activeProject.requestPath +'/many', {
					// mit {obj1, ...obj2} können zwei Objekte vereinigt werden 
					params: {'method-name': methodParameterString, ...config2},
					headers: {Authorization: 'Token ' + token}
				}).then((response) => {

					let data = response.data;

					for (let method of methods) {

						if (data.hasOwnProperty(method.methodString)) {
							if (data[method.methodString].hasOwnProperty('run-time')) {
								// @ts-ignore
								method.performance.config2 = {energyUsage: response.data[method.methodString]['energy'], runtime: response.data[method.methodString]['run-time']};
							} else {
								// @ts-ignore
								method.performance.config2 = {energyUsage: 0, runtime: 0};
							}	
						}

					}

					setDecorations();

				});

			} else {
				setDecorations();
			}
				
		});

	}

	function setDecorations(): void {
		
		let methodDecorationOptionsHotspots: vscode.DecorationOptions[] = [];
		let methodDecorationOptions: vscode.DecorationOptions[] = [];

		// @ts-ignore
		// Test ob zwei Configs
		if (methods[0].performance.config2) {

			for (let method of methods) {

				const decoration = {
					range: method.context.selectionRange, 
					hoverMessage: new vscode.MarkdownString(
						'<h3>Config 1<h3>'
						+ '<h4>Runtime: ' 
						+ method.performance?.config1.runtime 
						+ '</h4><h4>Energy Usage: ' 
						+ method.performance?.config1.energyUsage 
						+ '</h4>'
						+ '<h3>Config 2<h3>'
						+ '<h4>Runtime: '
						//@ts-ignore
						+ method.performance?.config2.runtime 
						+ '</h4><h4>Energy Usage: ' 
						//@ts-ignore
						+ method.performance?.config2.energyUsage 
						+ '</h4>'
						)
				};
				decoration.hoverMessage.supportHtml = true;

				//Methoden deren runtime oder energyUsage größer als 1000 ist werden als Hotspots markiert.
				if(
					typeof method.performance?.config1.runtime === 'number' 
					&& (method.performance?.config1.runtime > 1000.0 || method.performance?.config1.energyUsage > 1000.0
						// @ts-ignore
						|| method.performance?.config2.runtime > 1000.0 || method.performance?.config2.energyUsage > 1000.0)
					) {
					
					methodDecorationOptionsHotspots.push(decoration);
				} else {
					methodDecorationOptions.push(decoration);
				}

			}

		} else {

			for (let method of methods) {

				//Methoden deren runtime oder energyUsage größer als 1000 ist werden als Hotspots markiert.
				if(typeof method.performance?.config1.runtime === 'number' && (method.performance?.config1.runtime > 1000.0 || method.performance?.config1.energyUsage > 1000.0)) {
					const decoration = {
						range: method.context.selectionRange, 
						hoverMessage: new vscode.MarkdownString('<h4>Runtime: ' + method.performance?.config1.runtime + '</h4><h4>Energy Usage: ' + method.performance?.config1.energyUsage + '</h4>')
					};
					decoration.hoverMessage.supportHtml = true;
					methodDecorationOptionsHotspots.push(decoration);
				} else {
					const decoration = {
						range: method.context.selectionRange, 
						hoverMessage: new vscode.MarkdownString('<h4>Runtime: ' + method.performance?.config1.runtime + '</h4><h4>Energy Usage: ' + method.performance?.config1.energyUsage + '</h4>')
					};
					decoration.hoverMessage.supportHtml = true;
					methodDecorationOptions.push(decoration);
				}
	
			}
		}

		activeEditor?.setDecorations(hotspotDecorationType, methodDecorationOptionsHotspots);
		activeEditor?.setDecorations(methodDecorationType, methodDecorationOptions);

	}

	function getOverallPerformance(config1: Object, config2?: Object) {

		axios.get('https://swt-projekt.herokuapp.com/config/' + activeProject.requestPath + '/one', {
			params: {'method-name': activeProject.mainMethod, ...config1},
			headers: {Authorization: 'Token ' + token}
		}).then((response:any) => {

			let config1Data = response.data;

			if (config2) {

				axios.get('https://swt-projekt.herokuapp.com/config/' + activeProject.requestPath + '/one', {
					params: {'method-name': activeProject.mainMethod, ...config2},
					headers: {Authorization: 'Token ' + token}
				}).then((response) => {

					let config2Data = response.data;

					panel.webview.postMessage({
						command: 'overallPerformanceMultiple',
						config1: {time: config1Data["run-time"], energy: config1Data["energy"]},
						config2: {time: config2Data["run-time"], energy: config2Data["energy"]}
					});

				});

			} else {
				panel.webview.postMessage({command: 'overallPerformanceSingle',time: config1Data["run-time"], energy: config1Data["energy"]});
			}

		}).catch((error:any) => {
			console.log(error);
		});

	}

	async function getMethods():Promise<MethodInformation[]> {

		let data = await vscode.commands.executeCommand<vscode.SymbolInformation[]>('vscode.executeDocumentSymbolProvider', activeEditor?.document.uri);
	
		let methods: MethodInformation[] = [];
		//@ts-ignore
		if (data) {
			let packageName = '';
			for (let elem of data) {
				if (elem.kind === vscode.SymbolKind.Package) {
					packageName = elem.name;
					setActiveProject(packageName);
				} else {
					packageName += "." + elem.name;
					//@ts-ignore
					methods = filterMethods(elem, packageName, false);
				}
			}		
		}
		return(methods);
	}

	function setActiveProject(packageName: string) {
		for (let project of projects) {
			if (packageName.startsWith(project.packagePrefix)) {
				activeProject = project;
			}
		}
	}

	function filterMethods(data: vscode.DocumentSymbol, packageName: string, isSubclass: boolean): MethodInformation[] {
		//@ts-ignore
		let methods: MethodInformation[] = [];
		for (let elem of data.children) {
			switch(elem.kind){
				case 5: { //methods
					//@ts-ignore
					let name = elem.name.split("(");
					let string = packageName;
					if (isSubclass) {
						string += "$" + data.name;
					}
					string += "." + elem.name.split("(")[0];
					for (let elem2 of data.children) {
						if (elem2.name.split("(")[0] === name[0] && elem !== elem2) {
							if (name[1].replaceAll(")","").length > 1) {
								string += "(" + name[1];
							}
						}
					}
					methods.push({methodString: string, context: elem});
					break;
				}
				case 8: { //constructors
					//@ts-ignore
					let name = elem.name.split("(");
					let string = packageName;
					if (isSubclass) {
						string += "$" + data.name;
					}
					string += ".<init>";
					for (let elem2 of data.children) {
						if (elem2.name.split("(")[0] === name[0] && elem !== elem2) {
							if (name[1].replaceAll(")","").length > 1) {
								string += "(" + name[1];
								break;
							}
						}
					}
					
					methods.push({methodString: string, context: elem});
					break;
				}
				case 4: { //classes
					//@ts-ignore
					methods = methods.concat(filterMethods(elem, packageName, true));
				}
			}
		}
		return methods;
	}

	function triggerUpdate(throttle: boolean = false) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateWebview, 500);
		} else {
			updateWebview();
		}
	}

	if (activeEditor) {
		triggerUpdate();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor && editor.document.languageId === 'java') {
			activeEditor = editor;
			triggerUpdate();
		}
	}, null, context.subscriptions);

}

// this method is called when your extension is deactivated
export function deactivate() {}

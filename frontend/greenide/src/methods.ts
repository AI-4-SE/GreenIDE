import * as vscode from 'vscode';

export type MethodInformation = {
	methodString: string,
	context: vscode.DocumentSymbol,
	performance?: {
		config1: {
			runtime: number,
			energyUsage: number
		},
		config2?: {
			runtime: number,
			energyUsage: number
		}
	}
};

export const methodDecorationType = vscode.window.createTextEditorDecorationType({
	borderWidth: '0px 0px 2px 0px',
	borderStyle: 'solid',
	borderColor: 'green'
});

export const hotspotDecorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'red',
});
export function getHtml() {
    return `<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>GreenIDE Settings & Hotspots</title>
	
		<style>
			.div {
				display: grid;
				grid-template-columns: repeat(2, 50% [col-start]);
				grid-template-rows: auto;
				row-gap: 15px;
			}
	
			.optional {
				display: none;
			}
	
			.selector {
				grid-row: 1;
			}
	
			.option1 {
				grid-row: 2;
				grid-column: 2;
			}
	
			.option2 {
				grid-row: 2;
				grid-column: 1;
			}
	
			.config1 {
				grid-row: 3;
			}
	
			#config2 {
				grid-row: 3;
				grid-column: 2;
			}
	
			.submit {
				grid-row: 4;
			}
	
			.overallPerformanceContainer {
				grid-row: 5;
				margin-bottom: 50px;
				margin-top: 30px
			}
	
			.overallPerformance {
				display: grid;
				grid-template-rows: 30px 30px 30px;
				grid-template-columns: 200px 200px 200px;
				grid-template-areas:
					". config1Label config2Label"
					"overallEnergyLabel overallEnergyDisplayConfig1 overallEnergyDisplayConfig2"
					"overallTimeLabel overallTimeDisplayConfig1 overallTimeDisplayConfig2";
				margin-top: 20px;
			}
	
			#config1Label {
				grid-area: config1Label;
			}
	
			#config2Label {
				grid-area: config2Label;
			}
	
			#overallTimeLabel {
				grid-area: overallTimeLabel;
			}
	
			#overallEnergyLabel {
				grid-area: overallEnergyLabel;
			}
	
			#overallTimeDisplayConfig1 {
				grid-area: overallTimeDisplayConfig1;
			}
	
			#overallTimeDisplayConfig2 {
				grid-area: overallTimeDisplayConfig2;
			}
	
			#overallEnergyDisplayConfig1 {
				grid-area: overallEnergyDisplayConfig1;
			}
	
			#overallEnergyDisplayConfig2 {
				grid-area: overallEnergyDisplayConfig2;
			}
	
			#differencesContainerHeading {
				grid-area: differencesContainerHeading;
			}
	
			.differencesContainer {
				grid-row: 6;
				width: 80vw;
				margin-bottom: 50px;
			}
	
			.differences {
				display: grid;
				grid-template-columns: 2fr 1fr 1fr 1fr;
				grid-template-rows: 50px 50px 30px auto;
				grid-template-areas:
					"differencesContainerHeading differencesContainerHeading differencesContainerHeading differencesContainerHeading"
					"metricSelection metricSelection listLengthSelection listLengthSelection"
					"methodHeading config1Heading config2Heading differenceHeading"
					"methodList config1List config2List differenceList";
			}
	
			.metricSelection {
				grid-area: metricSelection;
			}
	
			.listLengthSelection {
				grid-area: listLengthSelection;
				display: grid;
				grid-template-rows: 1fr 1fr;
				grid-template-columns: 4fr 1fr;
				grid-template-areas:
					"listLengthLabel listLengthLabel"
					"listLengthInput listLengthButton";
				padding-bottom: 10px;
			}
	
			#listLengthLabel {
				grid-area: listLengthLabel;
			}
	
			#listLengthInput {
				grid-area: listLengthInput;
				width: 90%;
			}
	
			#listLengthButton {
				grid-area: listLengthButton;
			}
	
			.methodHeading {
				grid-area: methodHeading;
			}
	
			.methodList {
				grid-area: methodList;
			}
	
			.config1Heading {
				grid-area: config1Heading;
				text-align: center;
			}
	
			.config1List {
				grid-area: config1List;
				text-align: center;
			}
	
			.config2Heading {
				grid-area: config2Heading;
				text-align: center;
			}
	
			.config2List {
				grid-area: config2List;
				text-align: center;
			}
	
			.differenceHeading {
				grid-area: differenceHeading;
				text-align: center;
			}
	
			.differenceList {
				grid-area: differenceList;
				text-align: center;
			}
	
			.tableCell {
				border: 1px solid white;
				padding: 5px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		</style>
		<script>
	
			const vscode = acquireVsCodeApi();
			let metric = 'time';
			let listLength = 0;
	
			let data = [];
	
			function checkbox() {
				cb = document.getElementsByName("option");
				radio = document.getElementById("default");
	
				if (radio.checked === false) {
					for (i = 0; i < cb.length; i++) {
						cb[i].disabled = false;
						cb[i].checked = false;
					}
					cb[0].checked = true;
				} else {
					for (i = 0; i < cb.length; i++) {
						cb[i].disabled = true;
						cb[i].checked = false;
					}
					cb[0].checked = true;
				}
			}
			function showOptional() {
				let cbdiv = document.getElementById("config2");
				let toggle = document.getElementById("vergleich");
	
				let optionals = document.getElementsByClassName("optional");
	
				if (toggle.checked === true) {
					// cbdiv.style.display = "inline"
					for (let elem of optionals) {
						elem.style.display = "inline"
					}
				} else {
					// cbdiv.style.display = "none"
					for (let elem of optionals) {
						elem.style.display = "none"
					}
				}
				cb = document.getElementsByName("option2");
				for (i = 0; i < cb.length; i++) {
					cb[i].checked = false;
				}
				cb[0].checked = true;
			}
	
			function submitConfig() {
	
				resetTable();
	
				document.getElementById("time").disabled = true;
				document.getElementById("energy").disabled = true;
				document.getElementById("listLengthInput").disabled = true;
				document.getElementById("listLengthButton").disabled = true;
	
				compareCheckbox = document.getElementById("vergleich");
	
				if (compareCheckbox.checked) {
	
					var config1 = {};
					var config2 = {};
	
					cb1 = document.getElementsByName("option");
					cb2 = document.getElementsByName("option2");
	
					// linke Spalte
					for (let elem of cb1) {
						config1[elem.id] = +elem.checked;
					}
	
					// rechte Spalte
					for (let elem of cb2) {
						config2[elem.id] = +elem.checked;
					}
	
					vscode.postMessage({
						command: 'submitconfigcompare',
						config1: config1,
						config2: config2
					})
	
				} else {
	
					var config = {};
					var checkboxes = document.getElementsByName("option");
	
					for (let elem of checkboxes) {
						config[elem.id] = +elem.checked;
					}
	
					vscode.postMessage({
						command: 'submitconfig',
						config: config
					})
				}
	
	
			}
	
			function metricChangeHandler() {
	
				metric = document.querySelector('input[name="metric"]:checked').value;
				updateTable();
	
			}
	
			function listLengthSubmit() {
	
				listLength = document.getElementById("listLengthInput").value;
				updateTable();
	
			}
	
			window.addEventListener('message', event => {
				const message = event.data;
	
				switch (message.command) {
					case 'overallPerformanceSingle':
						document.getElementById("overallTimeDisplayConfig1").innerHTML = '';
						document.getElementById("overallEnergyDisplayConfig1").innerHTML = '';
						document.getElementById("overallTimeDisplayConfig2").innerHTML = '';
						document.getElementById("overallEnergyDisplayConfig2").innerHTML = '';
	
						document.getElementById("config2Label").innerHTML = '';
						document.getElementById("overallTimeDisplayConfig1").innerHTML = message.time.toFixed(2);
						document.getElementById("overallEnergyDisplayConfig1").innerHTML = message.energy.toFixed(2);
						break;
					case 'overallPerformanceMultiple':
	
						document.getElementById("overallTimeDisplayConfig1").innerHTML = '';
						document.getElementById("overallEnergyDisplayConfig1").innerHTML = '';
						document.getElementById("overallTimeDisplayConfig2").innerHTML = '';
						document.getElementById("overallEnergyDisplayConfig2").innerHTML = '';
	
						document.getElementById("config2Label").innerHTML = 'Config 2';
						document.getElementById("overallTimeDisplayConfig1").innerHTML = message.config1.time.toFixed(2);
						document.getElementById("overallEnergyDisplayConfig1").innerHTML = message.config1.energy.toFixed(2);
						document.getElementById("overallTimeDisplayConfig2").innerHTML = message.config2.time.toFixed(2);
						document.getElementById("overallEnergyDisplayConfig2").innerHTML = message.config2.energy.toFixed(2);
					break;
					case 'fillMethodTable':
	
						for (let method of Object.keys(message.performanceData1)) {
	
							let energy1 = Number(message.performanceData1[method]["energy"].toFixed(2));
							let time1 = Number(message.performanceData1[method]["run-time"].toFixed(2));
	
							let energy2 = Number(message.performanceData2[method]["energy"].toFixed(2));
							let time2 = Number(message.performanceData2[method]["run-time"].toFixed(2));
	
							let differenceEnergy = Number(Math.abs(energy1 - energy2).toFixed(2));
							let differenceTime = Number(Math.abs(time1 - time2).toFixed(2));
	
							data.push({ method: method, config1: { energy: energy1, time: time1 }, config2: { energy: energy2, time: time2 }, difference: { energy: differenceEnergy, time: differenceTime } });
	
						}
	
						document.getElementById("time").disabled = false;
						document.getElementById("energy").disabled = false;
						document.getElementById("listLengthInput").disabled = false;
						document.getElementById("listLengthButton").disabled = false;
	
						updateTable()
	
						break;
				}
	
	
			});
	
			function updateTable() {
	
				resetTable();
	
				data.sort(compareLines);
	
				let methodList = document.getElementById("methodList");
				let config1List = document.getElementById("config1List");
				let config2List = document.getElementById("config2List");
				let differenceList = document.getElementById("differenceList");
	
	
				let loopLimit = 0;
				if (listLength > 0) {
					loopLimit = listLength;
				} else {
					loopLimit = data.length;
				}
	
				for (let i = 0; i < loopLimit; i++) {
	
					methodList.innerHTML += '<a href="javascript:void(0);" onclick="revealMethod(' + "'" + data[i].method + "'" + ')";>' + data[i].method.replace("<", "&lt;").replace(">", "&gt;") + '</a><br>';
					config1List.innerHTML += data[i].config1[metric] + '<br>';
					config2List.innerHTML += data[i].config2[metric] + '<br>';
					differenceList.innerHTML += data[i].difference[metric] + '<br>';
	
				}
	
			}
	
			function resetTable() {
	
				document.getElementById("methodList").innerHTML = '';
				document.getElementById("config1List").innerHTML = '';
				document.getElementById("config2List").innerHTML = '';
				document.getElementById("differenceList").innerHTML = '';
	
			}
	
			function compareLines(a, b) {
	
				if (a.difference[metric] < b.difference[metric]) {
					return 1;
				}
				if (a.difference[metric] > b.difference[metric]) {
					return -1;
				}
				return 0;
	
			}
	
			function revealMethod(method) {
	
				vscode.postMessage({
					command: 'revealMethod',
					method: method
				})
	
			}
	
		</script>
	</head>
	
	<body>
	
		<h1 style="display: inline; border-bottom: 3px solid green">GreenIDE</h1>
	
		<div class="div" style="margin-top: 30px;">
			<div class="selector">
				<label for="vergleich">
					<input type="checkbox" id="vergleich" name="vergleich" value="vergleich" onchange="showOptional()">
					Vergleich zwischen 2 Configs</label>
			</div>
	
			<div class="option1">
				<label for="default">
					<input type="radio" id="default" name="Config" value="default" onchange="checkbox()">
					Default Config</label>
			</div>
			<div class="option2">
				<label for="custom">
					<input type="radio" id="custom" name="Config" value="custom" checked onchange="checkbox()">
					Custom Config</label>
			</div>
			<div class="config1">
	
				<label for="root">
					<input type="checkbox" id="root" name="option" value="root" checked> Root
				</label><br>
	
				<label for="AllPlatforms">
					<input type="checkbox" id="AllPlatforms" name="option" value="AllPlatforms">
					AllPlatforms</label><br>
	
				<label for="Android">
					<input type="checkbox" id="Android" name="option" value="Android">
					Android</label><br>
	
				<label for="Windows">
					<input type="checkbox" id="Windows" name="option" value="Windows">
					Windows</label><br>
	
				<label for="Web">
					<input type="checkbox" id="Web" name="option" value="Web">
					Web</label><br>
	
				<label for="IOS">
					<input type="checkbox" id="IOS" name="option" value="IOS">
					IOS</label><br>
	
				<label for="IncludeLdpiTvdpi">
					<input type="checkbox" id="IncludeLdpiTvdpi" name="option" value="IncludeLdpiTvdpi">
					IncludeLdpiTvdpi</label><br>
	
				<label for="MipmapInODrawable">
					<input type="checkbox" id="MipmapInODrawable" name="option" value="MipmapInODrawable">
					MipmapInODrawable</label><br>
	
				<label for="AntiAliasing">
					<input type="checkbox" id="AntiAliasing" name="option" value="AntiAliasing">
					AntiAliasing</label><br>
	
				<label for="CreateImagesetFolders">
					<input type="checkbox" id="CreateImagesetFolders" name="option" value="CreateImagesetFolders">
					CreateImagesetFolders</label><br>
	
				<label for="Keep">
					<input type="checkbox" id="Keep" name="option" value="Keep">
					Keep</label><br>
	
				<label for="PNG">
					<input type="checkbox" id="PNG" name="option" value="PNG">
					PNG</label><br>
	
				<label for="BMP">
					<input type="checkbox" id="BMP" name="option" value="BMP">
					BMP</label><br>
	
				<label for="GIF">
					<input type="checkbox" id="GIF" name="option" value="GIF">
					GIF</label><br>
	
				<label for="JPG">
					<input type="checkbox" id="JPG" name="option" value="JPG">
					JPG</label><br>
	
				<label for="round">
					<input type="checkbox" id="round" name="option" value="round">
					round</label><br>
	
				<label for="ceil">
					<input type="checkbox" id="ceil" name="option" value="ceil">
					ceil</label><br>
	
				<label for="floor">
					<input type="checkbox" id="floor" name="option" value="floor">
					floor</label><br>
	
				<label for="skipExisting">
					<input type="checkbox" id="skipExisting" name="option" value="skipExisting">
					skipExisting</label><br>
	
				<label for="QualityComp">
					<input type="checkbox" id="QualityComp" name="option" value="QualityComp">
					QualityComp</label><br>
	
				<label for="Scale">
					<input type="checkbox" id="Scale" name="option" value="Scale">
					Scale</label><br>
	
				<label for="Threads">
					<input type="checkbox" id="Threads" name="option" value="Threads">
					Threads</label><br>
	
			</div>
	
			<div class="optional" id="config2">
	
				<label for="root">
					<input type="checkbox" id="root" name="option2" value="root" checked> Root
				</label><br>
	
				<label for="AllPlatforms">
					<input type="checkbox" id="AllPlatforms" name="option2" value="AllPlatforms">
					AllPlatforms</label><br>
	
				<label for="Android">
					<input type="checkbox" id="Android" name="option2" value="Android">
					Android</label><br>
	
				<label for="Windows">
					<input type="checkbox" id="Windows" name="option2" value="Windows">
					Windows</label><br>
	
				<label for="Web">
					<input type="checkbox" id="Web" name="option2" value="Web">
					Web</label><br>
	
				<label for="IOS">
					<input type="checkbox" id="IOS" name="option2" value="IOS">
					IOS</label><br>
	
				<label for="IncludeLdpiTvdpi">
					<input type="checkbox" id="IncludeLdpiTvdpi" name="option2" value="IncludeLdpiTvdpi">
					IncludeLdpiTvdpi</label><br>
	
				<label for="MipmapInODrawable">
					<input type="checkbox" id="MipmapInODrawable" name="option2" value="MipmapInODrawable">
					MipmapInODrawable</label><br>
	
				<label for="AntiAliasing">
					<input type="checkbox" id="AntiAliasing" name="option2" value="AntiAliasing">
					AntiAliasing</label><br>
	
				<label for="CreateImagesetFolders">
					<input type="checkbox" id="CreateImagesetFolders" name="option2" value="CreateImagesetFolders">
					CreateImagesetFolders</label><br>
	
				<label for="Keep">
					<input type="checkbox" id="Keep" name="option2" value="Keep">
					Keep</label><br>
	
				<label for="PNG">
					<input type="checkbox" id="PNG" name="option2" value="PNG">
					PNG</label><br>
	
				<label for="BMP">
					<input type="checkbox" id="BMP" name="option2" value="BMP">
					BMP</label><br>
	
				<label for="GIF">
					<input type="checkbox" id="GIF" name="option2" value="GIF">
					GIF</label><br>
	
				<label for="JPG">
					<input type="checkbox" id="JPG" name="option2" value="JPG">
					JPG</label><br>
	
				<label for="round">
					<input type="checkbox" id="round" name="option2" value="round">
					round</label><br>
	
				<label for="ceil">
					<input type="checkbox" id="ceil" name="option2" value="ceil">
					ceil</label><br>
	
				<label for="floor">
					<input type="checkbox" id="floor" name="option2" value="floor">
					floor</label><br>
	
				<label for="skipExisting">
					<input type="checkbox" id="skipExisting" name="option2" value="skipExisting">
					skipExisting</label><br>
	
				<label for="QualityComp">
					<input type="checkbox" id="QualityComp" name="option2" value="QualityComp">
					QualityComp</label><br>
	
				<label for="Scale">
					<input type="checkbox" id="Scale" name="option2" value="Scale">
					Scale</label><br>
	
				<label for="Threads">
					<input type="checkbox" id="Threads" name="option2" value="Threads">
					Threads</label><br>
	
			</div>
	
			<div class="submit">
				<button onclick="submitConfig()">Eingaben absenden</button>
			</div>
	
			<div class="overallPerformanceContainer">
				<h3 style="display: inline; border-bottom: 3px solid green">Gesamtperformance</h3>
	
				<div class="overallPerformance">
					<div id="config1Label">Config 1</div>
					<div id="config2Label"></div>
					<div id="overallTimeLabel">Laufzeit:</div>
					<div id="overallTimeDisplayConfig1"></div>
					<div id="overallTimeDisplayConfig2"></div>
					<div id="overallEnergyLabel">Energieverbrauch:</div>
					<div id="overallEnergyDisplayConfig1"></div>
					<div id="overallEnergyDisplayConfig2"></div>
				</div>
	
			</div>
	
			<div class="differencesContainer optional">
				<div class="differences">
	
					<div id="differencesContainerHeading">
						<h3 style="display: inline; border-bottom: 3px solid green;">Config-Vergleich</h3>
					</div>
	
					<div class="metricSelection">
	
						<input checked disabled type="radio" name="metric" id="time" value="time"
							onChange="metricChangeHandler()">
						<label for="time">Laufzeit</label><br>
	
						<input disabled type="radio" name="metric" id="energy" value="energy"
							onChange="metricChangeHandler()">
						<label for="energy">Energieverbrauch</label><br>
	
					</div>
	
					<div class="listLengthSelection">
	
						<label id="listLengthLabel" for="listLengthInput">Listenlänge:</label>
						<input disabled id="listLengthInput" type="number" min="0">
						<button disabled id="listLengthButton" onclick="listLengthSubmit()">OK</button>
	
					</div>
	
					<div class="methodHeading tableCell">Methoden</div>
					<div id="methodList" class="methodList tableCell">
					</div>
	
					<div class="config1Heading tableCell"> Config 1</div>
					<div id="config1List" class="config1List tableCell">
					</div>
	
					<div class="config2Heading tableCell"> Config 2</div>
					<div id="config2List" class="config2List tableCell">
					</div>
	
					<div class="differenceHeading tableCell"> Differenz</div>
					<div id="differenceList" class="differenceList tableCell">
					</div>
	
				</div>
			</div>
	
		</div>
	</body>`;
}
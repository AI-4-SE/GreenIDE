import * as kanzi from './kanzi';
import * as density from './density';

export type Project = {
	name: string,
	packagePrefix: string,
	requestPath: string,
	config: Array<string>,
	mainMethod: string,
	html: Function
};

export const projects: Array<Project> = [
	{
		name: 'kanzi',
		packagePrefix: 'kanzi',
		requestPath: 'kanzi',
		config: ["root","BLOCKSIZE","JOBS","LEVEL","CHECKSUM","SKIP","NoTransform","Huffman","ANS0","ANS1","Range","FPAQ","TPAQ","CM","NoEntropy","BWTS","ROLZ","RLT","ZRLT","MTFT","RANK","TEXT","X86"],
		mainMethod: 'kanzi.app.Kanzi.main',
		html: kanzi.getHtml
	},
	{
		name: 'densityConverter',
		packagePrefix: 'at.favre.tools.dconvert',
		requestPath: 'density',
		config: ["root","AllPlatforms","Android","Windows","Web","IOS","IncludeLdpiTvdpi","MipmapInODrawable","AntiAliasing","CreateImagesetFolders","Keep","PNG","BMP","GIF","JPG","round","ceil","floor","skipExisting","QualityComp","Scale","Threads"],
		mainMethod: 'at.favre.tools.dconvert.Main.main',
		html: density.getHtml
	}
];
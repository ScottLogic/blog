///////////////////////////////
// SilverlightVersion.js
// Created by Gergely Orosz
// http://www.gregdoesit.com
///////////////////////////////
function GetSilverlightVersion(){
	var parts = Array("ver-major", "ver-minor", "ver-build", "ver-revision");
	
	var nav = navigator.plugins["Silverlight Plug-In"];
	var versionStr = "";
	// Non IE-browsers
	if (nav) {
		versionStr = nav.description;
	} 
	// IE-browsers
	else {
		if(SilverlightIsInstalledOnIE)
			versionStr = GetSilverlightVersionOnIE();
		else 
			versionStr = -1;
	}
	return versionStr;
}

function SilverlightIsInstalledOnIE(version)
{
	if(version == null)
		version = "1.0";
	var AgControl = new ActiveXObject("AgControl.AgControl");    
	if(AgControl == null)
		return false;
	else
		return AgControl.isVersionSupported(version);
}

function GetSilverlightVersionOnIE()
{
	var currVersion = Array(1,0,0,0);
	for(var i=0;i<currVersion.length;i++){
		currVersion[i] = FindSupportedMaxVersionOnIE(currVersion, i,0,10000000);
	}
	return GetVersionString(currVersion);
}

function GetVersionString(versionArr,currVersion,index)
{
	if(index == null)
		index = -1;
	var versionStr = "";
	for(var i=0;i<versionArr.length;i++){
		if(i>0)
			versionStr += ".";
		if(i==index)
			versionStr +=currVersion;
		else
			versionStr += versionArr[i];
	}
	return versionStr;
}

function FindSupportedMaxVersionOnIE(versionArr, index,bottom,top)
{
	if(bottom >= top){
		return bottom;
	}
	var currVersion = bottom;
	var prevVersion = currVersion;
	var step = 1;
	while(currVersion<top)	{
		if(SilverlightIsInstalledOnIE(GetVersionString(versionArr,currVersion,index)))	{
			prevVersion = currVersion;
			currVersion += step;
			step *= 2;
		}
		else	
			return FindSupportedMaxVersionOnIE(versionArr, index,prevVersion,currVersion-1)
	}
	if(SilverlightIsInstalledOnIE(GetVersionString(versionArr,top,index)))
		return top;
	else
		return FindSupportedMaxVersionOnIE(versionArr, index,prevVersion,top-1)
}
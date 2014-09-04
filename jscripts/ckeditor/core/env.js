
if(!CKEDITOR.env){CKEDITOR.env=(function(){var agent=navigator.userAgent.toLowerCase();var opera=window.opera;var env={ie:(agent.indexOf('trident/')>-1),opera:(!!opera&&opera.version),webkit:(agent.indexOf(' applewebkit/')>-1),air:(agent.indexOf(' adobeair/')>-1),mac:(agent.indexOf('macintosh')>-1),quirks:(document.compatMode=='BackCompat'&&(!document.documentMode||document.documentMode<10)),mobile:(agent.indexOf('mobile')>-1),iOS:/(ipad|iphone|ipod)/.test(agent),isCustomDomain:function(){if(!this.ie)
return false;var domain=document.domain,hostname=window.location.hostname;return domain!=hostname&&domain!=('['+hostname+']');},secure:location.protocol=='https:'};env.gecko=(navigator.product=='Gecko'&&!env.webkit&&!env.opera&&!env.ie);if(env.webkit){if(agent.indexOf('chrome')>-1)
env.chrome=true;else
env.safari=true;}
var version=0;if(env.ie){if(env.quirks||!document.documentMode)
version=parseFloat(agent.match(/msie (\d+)/)[1]);else
version=document.documentMode;env.ie9Compat=version==9;env.ie8Compat=version==8;env.ie7Compat=version==7;env.ie6Compat=version<7||env.quirks;}
if(env.gecko){var geckoRelease=agent.match(/rv:([\d\.]+)/);if(geckoRelease){geckoRelease=geckoRelease[1].split('.');version=geckoRelease[0]*10000+(geckoRelease[1]||0)*100+(geckoRelease[2]||0)*1;}}
if(env.opera)
version=parseFloat(opera.version());if(env.air)
version=parseFloat(agent.match(/ adobeair\/(\d+)/)[1]);if(env.webkit)
version=parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);env.version=version;env.isCompatible=env.iOS&&version>=534||!env.mobile&&((env.ie&&version>6)||(env.gecko&&version>=10801)||(env.opera&&version>=9.5)||(env.air&&version>=1)||(env.webkit&&version>=522)||false);env.hidpi=window.devicePixelRatio>=2;env.needsBrFiller=env.gecko||env.webkit||(env.ie&&version>10);env.needsNbspFiller=env.ie&&version<11;env.cssClass='cke_browser_'+(env.ie?'ie':env.gecko?'gecko':env.opera?'opera':env.webkit?'webkit':'unknown');if(env.quirks)
env.cssClass+=' cke_browser_quirks';if(env.ie){env.cssClass+=' cke_browser_ie'+(env.quirks||env.version<7?'6':env.version);if(env.quirks)
env.cssClass+=' cke_browser_iequirks';}
if(env.gecko){if(version<10900)
env.cssClass+=' cke_browser_gecko18';else if(version<=11000)
env.cssClass+=' cke_browser_gecko19';}
if(env.air)
env.cssClass+=' cke_browser_air';if(env.iOS)
env.cssClass+=' cke_browser_ios';if(env.hidpi)
env.cssClass+=' cke_hidpi';return env;})();}
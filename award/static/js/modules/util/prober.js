define(function(D,z){var v,q,w,E,F,x,r,y,s;v={};q=navigator.userAgent||"";w=window.external;E=/\b(?:msie|ie) ([0-9.]+)/;F=Object.prototype.toString;function t(c,d,a){var b,e;for(b=0,e=c.length;b<e;b++){if(d.call(c,c[b],b)===false){break}}}x=[["nokia",function(a){if(a.indexOf("nokia ")!==-1){return/\bnokia ([0-9]+)?/}else{if(/\bnokia[\d]/.test(a)){return/\bnokia(\d+)/}else{return"nokia"}}}],["wp",function(a){return a.indexOf("windows phone ")!==-1||a.indexOf("xblwp")!==-1||a.indexOf("zunewp")!==-1||a.indexOf("windows ce")!==-1}],["mi",function(a){if(a.indexOf("mi-one plus")!==-1){return{version:"1s"}}else{return/\bmi ([0-9.as]+)/}}],["playstation",function(a){return(a.indexOf("playstation")!==-1||a.indexOf("wii")!==-1)&&a.indexOf("windows")==-1}],["blackberry",function(a){return(a.indexOf("blackberry")!==-1||a.indexOf("playbook ")!==-1||a.indexOf("rim")!==-1||a.indexOf("tablet")!==-1||a.indexOf("bb10")!==-1)&&a.indexOf("windows")==-1}],["pc","windows"],["ipad","ipad"],["ipod","ipod"],["iphone","iphone"],["mac","macintosh"],["aliyun","aliyunos"],["meizu",/\bm([0-9]+)\b/],["nexus",/\bnexus ([0-9.]+)/],["android","android"]];r=[["wp",function(a){if(a.indexOf("windows phone ")!==-1){return/\bwindows phone (?:os )?([0-9.]+)/}else{if(a.indexOf("xblwp")!==-1){return/\bxblwp([0-9.]+)/}else{if(a.indexOf("zunewp")!==-1){return/\bzunewp([0-9.]+)/}}}return"windows phone"}],["windows",/\bwindows nt ([0-9.]+)/],["macosx",/\bmac os x ([0-9._]+)/],["ios",/\bcpu(?: iphone)? os ([0-9._]+)/],["yunos",/\baliyunos ([0-9.]+)/],["android",/\bandroid[ -]([0-9.]+)/],["chromeos",/\bcros i686 ([0-9.]+)/],["linux","linux"],["windowsce",/\bwindows ce(?: ([0-9.]+))?/],["symbian",/\bsymbianos\/([0-9.]+)/],["blackberry","blackberry"]];y=[["trident",E],["webkit",/\bapplewebkit\/([0-9.+]+)/],["gecko",/\bgecko\/(\d+)/],["presto",/\bpresto\/([0-9.]+)/]];s=[["sg",/ se ([0-9.x]+)/],["mx",function(b){try{if(w&&(w.mxVersion||w.max_version)){return{version:w.mxVersion||w.max_version}}}catch(a){}return/\bmaxthon(?:[ \/]([0-9.]+))?/}],["qq",/\bqqbrowser\/([0-9.]+)/],["green","greenbrowser"],["tt",/\btencenttraveler ([0-9.]+)/],["lb",function(b){if(b.indexOf("lbbrowser")===-1){return false}var c="-1";try{if(w&&w.LiebaoGetVersion){c=w.LiebaoGetVersion()}}catch(a){}return{version:c}}],["tao",/\btaobrowser\/([0-9.]+)/],["fs",/\bcoolnovo\/([0-9.]+)/],["sy","saayaa"],["baidu",/\bbidubrowser[ \/]([0-9.x]+)/],["ie",E],["mi",/\bmiuibrowser\/([0-9.]+)/],["opera",function(c){var b=/\bopera.+version\/([0-9.ab]+)/;var a=/\bopr\/([0-9.]+)/;return b.test(c)?b:a}],["chrome",/ (?:chrome|crios|crmo)\/([0-9.]+)/],["android",function(a){if(a.indexOf("android")===-1){return}return/\bversion\/([0-9.]+(?: beta)?)/}],["safari",/\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],["firefox",/\bfirefox\/([0-9.ab]+)/],["uc",function(a){return a.indexOf("ucbrowser")!==-1?/\bucbrowser\/([0-9.]+)/:/\bucweb([0-9.]+)/}]];function C(b){var i,h,d,a,c,e,f,g;if(!E.test(b)){return null}e=false;if(b.indexOf("trident/")!==-1){i=/\btrident\/([0-9.]+)/.exec(b);if(i&&i.length>=2){d=i[1];g=i[1].split(".");g[0]=parseInt(g[0],10)+4;c=g.join(".")}}i=E.exec(b);a=i[1];f=i[1].split(".");if("undefined"===typeof c){c=a}f[0]=parseInt(f[0],10)-4;h=f.join(".");if("undefined"===typeof d){d=h}return{browserVersion:c,browserMode:a,engineVersion:d,engineMode:h,compatible:d!==h}}function A(f,a,d){var b,c,e,g;if(typeof d==="undefined"){d=q}b=F.call(a)==="[object Function]"?a.call(null,d):a;if(!b){return null}c={name:f,version:"-1",codename:""};e=F.call(b);if(b===true){return c}else{if(e==="[object String]"){if(d.indexOf(b)!==-1){return c}}else{if(F.call(b)==="[object Object]"){if(b.hasOwnProperty("version")){c.version=b.version}return c}else{if(b.exec){g=b.exec(d);if(g){if(g.length>=2&&g[1]){c.version=g[1].replace(/_/g,".")}else{c.version="-1"}return c}}}}}}function u(c,b,d){var a;a={name:"na",version:"-1"};t(b,function(e){var f;f=A(e[0],e[1],c);if(f){a=f;return false}});d(a.name,a.version)}function B(c){var a,b;a={};c=(c||"").toLowerCase();u(c,x,function(d,f){var e;e=parseFloat(f);a.device={name:d,version:e,fullVersion:f};a.device[d]=e});u(c,r,function(d,f){var e;e=parseFloat(f);a.os={name:d,version:e,fullVersion:f};a.os[d]=e});b=C(c);u(c,y,function(e,g){var d,f;d=g;if(b){g=b.engineVersion||b.engineMode;d=b.engineMode}f=parseFloat(g);a.engine={name:e,version:f,fullVersion:g,mode:parseFloat(d),fullMode:d,compatible:b?b.compatible:false};a.engine[e]=f});u(c,s,function(e,g){var d,f;d=g;if(b){if(e==="ie"){g=b.browserVersion}d=b.browserMode}f=parseFloat(g);a.browser={name:e,version:f,fullVersion:g,mode:parseFloat(d),fullMode:d,compatible:b?b.compatible:false};a.browser[e]=f});return a}v=B(navigator.userAgent);v.parse=B;return v});
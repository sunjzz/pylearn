(function(e,v){function r(j){var k;while(k=j.shift()){k()}}function l(){u.loading=1;var j,k="";try{j=e.navigator.plugins["Shockwave Flash"]||e.ActiveXObject,k=j.description||(new j("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")}catch(q){}k=(k.match(/\d+/g)||[0])[0];if(k<10){u._available=0,r(t);return}u._available=1,e[i]=function(){var z=arguments;setTimeout(function(){a.apply(e,z)},0)};var x=setInterval(function(){v.body&&(clearInterval(x),f(),setTimeout(function(){u.inited||(u._available=0,p.length=0,r(t))},10000))},50)}function a(j,k){switch(j){case"onecall":if(!e[k]){return}e[k].apply(e,[].slice.call(arguments,2)),e[k]=null;break;case"error":u._available=u.inited=0,r(t);break;case"load":u._available=u.inited=1,t.length=0,r(p)}}function f(){var j=v.createElement("div");j.setAttribute("style","display:block;position:absolute;right:0;bottom:0;border:none;"),v.body.firstChild?v.body.insertBefore(j,v.body.firstChild):v.body.appendChild(j),j.innerHTML='<object id="'+m()+'" data="'+u.SWF_URL+'" type="application/x-shockwave-flash" width="10" height="10" style="position:absolute;right:0;bottom:0;"><param name="movie" value="'+u.SWF_URL+'" /><param name="wmode" value="transparent" /><param name="version" value="10" /><param name="allowScriptAccess" value="always" /><param name="flashvars" value="jsproxyfunction='+i+'" /></object>',u.swf=j.firstChild}function m(){return"_"+(Math.random()*1000000000000000000).toString(36).slice(0,5).toUpperCase()}function c(){}function h(x){var k=[],q,j;for(q in x){j=x[q],j&&k.push(q+"="+j)}return k.join("&")}function s(j,q){var x=m(),k;e[x]=function(){try{q.apply(e,arguments),k.parentNode.removeChild(k)}catch(z){}e[x]=null},j+="&jsonp="+x,k=d(j)}function d(j){var q=v.createElement("script"),k=v.getElementsByTagName("head")[0];return q.type="text/javascript",q.src=j,k.firstChild?k.insertBefore(q,k.firstChild):k.appendChild(q),q}function b(z,k,x){var A={_iwt_id:x,_iwt_cid:g,_iwt_UA:z.UA},q,B;if(z.WITH_REF){try{q=e.top.document.referrer}catch(j){try{q=e.parent.document.referrer}catch(j){q=document.referrer}}A.ref=q}A=h(A);if(k&&(B=k.length)){while(B--){k[B]=encodeURIComponent(k[B])}A+="&p="+k}s(E.API_URL+A,function(C){u.set("_iwt_id",C),w()})}function w(){e.IWT_ID_READY_REQUEST_ONCE&&(d(e.IWT_ID_READY_REQUEST_ONCE),w=c)}var p=[],t=[],i=m(),u={SWF_URL:"http://irs01.net/MTFlashStore.swf#",_available:1,_jpf:i,get:function(j,k){return u._sendFlashMsg(k,"jGetItem",j)},set:function(j,k,q){return u._sendFlashMsg(q,"jSetItem",j,k)},_sendFlashMsg:function(z,k,x,A){z=z||c;var q=m(),B=arguments.length,j=u.swf;e[q]=z,B==2?j[k](q):B==3?j[k](x,q):j[k](x,A,q)},initSWF:function(j,k){if(!u._available){return k&&k()}if(u.inited){return j&&setTimeout(j,0)}j&&p.push(j),k&&t.push(k),u.loading||l()}},o="_iwt_cid=",n=location.search.indexOf(o),g=n>-1?location.search.slice(n+o.length).split("&",1)[0]:"",E={FC:u,API_URL:"http://yyt.irs01.com/irt?",track:function(j,k){j.NO_FLS?b(j,k):u.initSWF(function(){u.get("_iwt_id",function(q){b(j,k,q)})},function(){b(j,k)})}};e._iwt=E;if(e._iwtTQ){var y=e._iwtTQ,S;while(S=y.shift()){E.track(S[0],S[1])}}})(this,document);
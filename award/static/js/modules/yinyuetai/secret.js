define(function(D,v,O){var L,I,F;L=8;F=D("cookie");v.des=function(d){var b,c,e,a;b=""+(new Date()).getTime();c=J(b);if(d&&d.length!=0){e=M(d,b);a=E(d,c)}else{e=M(b,c);a=E(c,b)}F.set("p2",a,{domain:"yinyuetai.com",path:"/"});return{_t:b,_p1:e,_p2:a}};function G(a){return B(K(A(a),a.length*8))}function w(a){var b=G(a);b=b.substring(8,24);return J(b)}function K(i,d){i[d>>5]|=128<<((d)%32);i[(((d+64)>>>9)<<4)+14]=d;var h=1732584193;var g=-271733879;var f=-1732584194;var e=271733878;for(var a=0;a<i.length;a+=16){var c=h;var b=g;var k=f;var j=e;h=N(h,g,f,e,i[a+0],7,-680876936);e=N(e,h,g,f,i[a+1],12,-389564586);f=N(f,e,h,g,i[a+2],17,606105819);g=N(g,f,e,h,i[a+3],22,-1044525330);h=N(h,g,f,e,i[a+4],7,-176418897);e=N(e,h,g,f,i[a+5],12,1200080426);f=N(f,e,h,g,i[a+6],17,-1473231341);g=N(g,f,e,h,i[a+7],22,-45705983);h=N(h,g,f,e,i[a+8],7,1770035416);e=N(e,h,g,f,i[a+9],12,-1958414417);f=N(f,e,h,g,i[a+10],17,-42063);g=N(g,f,e,h,i[a+11],22,-1990404162);h=N(h,g,f,e,i[a+12],7,1804603682);e=N(e,h,g,f,i[a+13],12,-40341101);f=N(f,e,h,g,i[a+14],17,-1502002290);g=N(g,f,e,h,i[a+15],22,1236535329);h=C(h,g,f,e,i[a+1],5,-165796510);e=C(e,h,g,f,i[a+6],9,-1069501632);f=C(f,e,h,g,i[a+11],14,643717713);g=C(g,f,e,h,i[a+0],20,-373897302);h=C(h,g,f,e,i[a+5],5,-701558691);e=C(e,h,g,f,i[a+10],9,38016083);f=C(f,e,h,g,i[a+15],14,-660478335);g=C(g,f,e,h,i[a+4],20,-405537848);h=C(h,g,f,e,i[a+9],5,568446438);e=C(e,h,g,f,i[a+14],9,-1019803690);f=C(f,e,h,g,i[a+3],14,-187363961);g=C(g,f,e,h,i[a+8],20,1163531501);h=C(h,g,f,e,i[a+13],5,-1444681467);e=C(e,h,g,f,i[a+2],9,-51403784);f=C(f,e,h,g,i[a+7],14,1735328473);g=C(g,f,e,h,i[a+12],20,-1926607734);h=y(h,g,f,e,i[a+5],4,-378558);e=y(e,h,g,f,i[a+8],11,-2022574463);f=y(f,e,h,g,i[a+11],16,1839030562);g=y(g,f,e,h,i[a+14],23,-35309556);h=y(h,g,f,e,i[a+1],4,-1530992060);e=y(e,h,g,f,i[a+4],11,1272893353);f=y(f,e,h,g,i[a+7],16,-155497632);g=y(g,f,e,h,i[a+10],23,-1094730640);h=y(h,g,f,e,i[a+13],4,681279174);e=y(e,h,g,f,i[a+0],11,-358537222);f=y(f,e,h,g,i[a+3],16,-722521979);g=y(g,f,e,h,i[a+6],23,76029189);h=y(h,g,f,e,i[a+9],4,-640364487);e=y(e,h,g,f,i[a+12],11,-421815835);f=y(f,e,h,g,i[a+15],16,530742520);g=y(g,f,e,h,i[a+2],23,-995338651);h=P(h,g,f,e,i[a+0],6,-198630844);e=P(e,h,g,f,i[a+7],10,1126891415);f=P(f,e,h,g,i[a+14],15,-1416354905);g=P(g,f,e,h,i[a+5],21,-57434055);h=P(h,g,f,e,i[a+12],6,1700485571);e=P(e,h,g,f,i[a+3],10,-1894986606);f=P(f,e,h,g,i[a+10],15,-1051523);g=P(g,f,e,h,i[a+1],21,-2054922799);h=P(h,g,f,e,i[a+8],6,1873313359);e=P(e,h,g,f,i[a+15],10,-30611744);f=P(f,e,h,g,i[a+6],15,-1560198380);g=P(g,f,e,h,i[a+13],21,1309151649);h=P(h,g,f,e,i[a+4],6,-145523070);e=P(e,h,g,f,i[a+11],10,-1120210379);f=P(f,e,h,g,i[a+2],15,718787259);g=P(g,f,e,h,i[a+9],21,-343485551);h=z(h,c);g=z(g,b);f=z(f,k);e=z(e,j)}return Array(h,g,f,e)}function H(d,f,e,b,c,a){return z(x(z(z(f,d),z(b,a)),c),e)}function N(e,b,d,c,g,a,f){return H((b&d)|((~b)&c),e,b,g,a,f)}function C(e,b,d,c,g,a,f){return H((b&c)|(d&(~c)),e,b,g,a,f)}function y(e,b,d,c,g,a,f){return H(b^d^c,e,b,g,a,f)}function P(e,b,d,c,g,a,f){return H(d^(b|(~c)),e,b,g,a,f)}function z(c,b){var a=(c&65535)+(b&65535);var d=(c>>16)+(b>>16)+(a>>16);return(d<<16)|(a&65535)}function x(b,a){return(b<<a)|(b>>>(32-a))}function A(b){var a=Array();var c=(1<<L)-1;for(var d=0;d<b.length*L;d+=L){a[d>>5]|=(b.charCodeAt(d/L)&c)<<(d%32)}return a}function B(a){var d="0123456789abcdef";var b="";for(var c=0;c<a.length*4;c++){b+=d.charAt((a[c>>2]>>((c%4)*8+4))&15)+d.charAt((a[c>>2]>>((c%4)*8))&15)}return b}function J(b){var c="";for(var a=b.length-1;a>=0;a--){c+=b.charAt(a)}return c}function M(a,b){if(b.length!=13){alert("timesign error !!!");return""}return G(G(a)+b.substring(5,11))}function E(a,b){if(b.length!=13){alert("timesign error !!!");return""}return G(w(a)+b.substring(5,11))}});
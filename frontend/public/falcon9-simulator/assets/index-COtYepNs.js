(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const da="165",Mi={ROTATE:0,DOLLY:1,PAN:2},Si={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Cc=0,La=1,Pc=2,pl=1,ml=2,Tn=3,Wn=0,Ot=1,wn=2,Gn=0,Vi=1,Da=2,Ia=3,Ua=4,Lc=5,oi=100,Dc=101,Ic=102,Uc=103,Nc=104,Oc=200,Fc=201,zc=202,Bc=203,Zs=204,Js=205,Hc=206,kc=207,Gc=208,Vc=209,Wc=210,Xc=211,qc=212,Yc=213,Kc=214,jc=0,$c=1,Zc=2,Qr=3,Jc=4,Qc=5,eh=6,th=7,gl=0,nh=1,ih=2,Vn=0,rh=1,sh=2,ah=3,_l=4,oh=5,lh=6,ch=7,vl=300,Yi=301,Ki=302,Qs=303,ea=304,as=306,ji=1e3,ci=1001,ta=1002,Zt=1003,hh=1004,br=1005,on=1006,gs=1007,hi=1008,Xn=1009,dh=1010,uh=1011,es=1012,xl=1013,$i=1014,Hn=1015,os=1016,Ml=1017,Sl=1018,Zi=1020,fh=35902,ph=1021,mh=1022,fn=1023,gh=1024,_h=1025,Wi=1026,Ji=1027,vh=1028,yl=1029,xh=1030,El=1031,Tl=1033,_s=33776,vs=33777,xs=33778,Ms=33779,Na=35840,Oa=35841,Fa=35842,za=35843,Ba=36196,Ha=37492,ka=37496,Ga=37808,Va=37809,Wa=37810,Xa=37811,qa=37812,Ya=37813,Ka=37814,ja=37815,$a=37816,Za=37817,Ja=37818,Qa=37819,eo=37820,to=37821,Ss=36492,no=36494,io=36495,Mh=36283,ro=36284,so=36285,ao=36286,Sh=3200,yh=3201,bl=0,Eh=1,Bn="",hn="srgb",Kn="srgb-linear",ua="display-p3",ls="display-p3-linear",ts="linear",ct="srgb",ns="rec709",is="p3",yi=7680,oo=519,Th=512,bh=513,Ah=514,Al=515,wh=516,Rh=517,Ch=518,Ph=519,lo=35044,co="300 es",Rn=2e3,rs=2001;class vi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ho=1234567;const pr=Math.PI/180,vr=180/Math.PI;function tr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(bt[n&255]+bt[n>>8&255]+bt[n>>16&255]+bt[n>>24&255]+"-"+bt[e&255]+bt[e>>8&255]+"-"+bt[e>>16&15|64]+bt[e>>24&255]+"-"+bt[t&63|128]+bt[t>>8&255]+"-"+bt[t>>16&255]+bt[t>>24&255]+bt[i&255]+bt[i>>8&255]+bt[i>>16&255]+bt[i>>24&255]).toLowerCase()}function Ct(n,e,t){return Math.max(e,Math.min(t,n))}function fa(n,e){return(n%e+e)%e}function Lh(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Dh(n,e,t){return n!==e?(t-n)/(e-n):0}function mr(n,e,t){return(1-t)*n+t*e}function Ih(n,e,t,i){return mr(n,e,1-Math.exp(-t*i))}function Uh(n,e=1){return e-Math.abs(fa(n,e*2)-e)}function Nh(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Oh(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Fh(n,e){return n+Math.floor(Math.random()*(e-n+1))}function zh(n,e){return n+Math.random()*(e-n)}function Bh(n){return n*(.5-Math.random())}function Hh(n){n!==void 0&&(ho=n);let e=ho+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kh(n){return n*pr}function Gh(n){return n*vr}function Vh(n){return(n&n-1)===0&&n!==0}function Wh(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Xh(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function qh(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),h=o((e+i)/2),u=s((e-i)/2),f=o((e-i)/2),m=s((i-e)/2),_=o((i-e)/2);switch(r){case"XYX":n.set(a*h,l*u,l*f,a*c);break;case"YZY":n.set(l*f,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*f,a*h,a*c);break;case"XZX":n.set(a*h,l*_,l*m,a*c);break;case"YXY":n.set(l*m,a*h,l*_,a*c);break;case"ZYZ":n.set(l*_,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Hi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Dt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const na={DEG2RAD:pr,RAD2DEG:vr,generateUUID:tr,clamp:Ct,euclideanModulo:fa,mapLinear:Lh,inverseLerp:Dh,lerp:mr,damp:Ih,pingpong:Uh,smoothstep:Nh,smootherstep:Oh,randInt:Fh,randFloat:zh,randFloatSpread:Bh,seededRandom:Hh,degToRad:kh,radToDeg:Gh,isPowerOfTwo:Vh,ceilPowerOfTwo:Wh,floorPowerOfTwo:Xh,setQuaternionFromProperEuler:qh,normalize:Dt,denormalize:Hi};class We{constructor(e=0,t=0){We.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ct(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ke{constructor(e,t,i,r,s,o,a,l,c){Ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],m=i[5],_=i[8],x=r[0],p=r[3],d=r[6],A=r[1],E=r[4],T=r[7],L=r[2],w=r[5],R=r[8];return s[0]=o*x+a*A+l*L,s[3]=o*p+a*E+l*w,s[6]=o*d+a*T+l*R,s[1]=c*x+h*A+u*L,s[4]=c*p+h*E+u*w,s[7]=c*d+h*T+u*R,s[2]=f*x+m*A+_*L,s[5]=f*p+m*E+_*w,s[8]=f*d+m*T+_*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-i*s*h+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*s,m=c*s-o*l,_=t*u+i*f+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return e[0]=u*x,e[1]=(r*c-h*i)*x,e[2]=(a*i-r*o)*x,e[3]=f*x,e[4]=(h*t-r*l)*x,e[5]=(r*s-a*t)*x,e[6]=m*x,e[7]=(i*l-c*t)*x,e[8]=(o*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ys.makeScale(e,t)),this}rotate(e){return this.premultiply(ys.makeRotation(-e)),this}translate(e,t){return this.premultiply(ys.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ys=new Ke;function wl(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function xr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Yh(){const n=xr("canvas");return n.style.display="block",n}const uo={};function Rl(n){n in uo||(uo[n]=!0,console.warn(n))}function Kh(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const fo=new Ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),po=new Ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ar={[Kn]:{transfer:ts,primaries:ns,toReference:n=>n,fromReference:n=>n},[hn]:{transfer:ct,primaries:ns,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[ls]:{transfer:ts,primaries:is,toReference:n=>n.applyMatrix3(po),fromReference:n=>n.applyMatrix3(fo)},[ua]:{transfer:ct,primaries:is,toReference:n=>n.convertSRGBToLinear().applyMatrix3(po),fromReference:n=>n.applyMatrix3(fo).convertLinearToSRGB()}},jh=new Set([Kn,ls]),st={enabled:!0,_workingColorSpace:Kn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!jh.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=Ar[e].toReference,r=Ar[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return Ar[n].primaries},getTransfer:function(n){return n===Bn?ts:Ar[n].transfer}};function Xi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Es(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ei;class $h{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ei===void 0&&(Ei=xr("canvas")),Ei.width=e.width,Ei.height=e.height;const i=Ei.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ei}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=xr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Xi(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Xi(t[i]/255)*255):t[i]=Xi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zh=0;class Cl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zh++}),this.uuid=tr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Ts(r[o].image)):s.push(Ts(r[o]))}else s=Ts(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Ts(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?$h.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Jh=0;class Pt extends vi{constructor(e=Pt.DEFAULT_IMAGE,t=Pt.DEFAULT_MAPPING,i=ci,r=ci,s=on,o=hi,a=fn,l=Xn,c=Pt.DEFAULT_ANISOTROPY,h=Bn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jh++}),this.uuid=tr(),this.name="",this.source=new Cl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ji:e.x=e.x-Math.floor(e.x);break;case ci:e.x=e.x<0?0:1;break;case ta:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ji:e.y=e.y-Math.floor(e.y);break;case ci:e.y=e.y<0?0:1;break;case ta:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=vl;Pt.DEFAULT_ANISOTROPY=1;class dt{constructor(e=0,t=0,i=0,r=1){dt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],m=l[5],_=l[9],x=l[2],p=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,T=(m+1)/2,L=(d+1)/2,w=(h+f)/4,R=(u+x)/4,D=(_+p)/4;return E>T&&E>L?E<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(E),r=w/i,s=R/i):T>L?T<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(T),i=w/r,s=D/r):L<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(L),i=R/s,r=D/s),this.set(i,r,s,t),this}let A=Math.sqrt((p-_)*(p-_)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(A)<.001&&(A=1),this.x=(p-_)/A,this.y=(u-x)/A,this.z=(f-h)/A,this.w=Math.acos((c+m+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qh extends vi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Pt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Cl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pi extends Qh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Pl extends Pt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ed extends Pt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mi{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],h=i[r+2],u=i[r+3];const f=s[o+0],m=s[o+1],_=s[o+2],x=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=m,e[t+2]=_,e[t+3]=x;return}if(u!==x||l!==f||c!==m||h!==_){let p=1-a;const d=l*f+c*m+h*_+u*x,A=d>=0?1:-1,E=1-d*d;if(E>Number.EPSILON){const L=Math.sqrt(E),w=Math.atan2(L,d*A);p=Math.sin(p*w)/L,a=Math.sin(a*w)/L}const T=a*A;if(l=l*p+f*T,c=c*p+m*T,h=h*p+_*T,u=u*p+x*T,p===1-a){const L=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=L,c*=L,h*=L,u*=L}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],h=i[r+3],u=s[o],f=s[o+1],m=s[o+2],_=s[o+3];return e[t]=a*_+h*u+l*m-c*f,e[t+1]=l*_+h*f+c*u-a*m,e[t+2]=c*_+h*m+a*f-l*u,e[t+3]=h*_-a*u-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(r/2),u=a(s/2),f=l(i/2),m=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=f*h*u+c*m*_,this._y=c*m*u-f*h*_,this._z=c*h*_+f*m*u,this._w=c*h*u-f*m*_;break;case"YXZ":this._x=f*h*u+c*m*_,this._y=c*m*u-f*h*_,this._z=c*h*_-f*m*u,this._w=c*h*u+f*m*_;break;case"ZXY":this._x=f*h*u-c*m*_,this._y=c*m*u+f*h*_,this._z=c*h*_+f*m*u,this._w=c*h*u-f*m*_;break;case"ZYX":this._x=f*h*u-c*m*_,this._y=c*m*u+f*h*_,this._z=c*h*_-f*m*u,this._w=c*h*u+f*m*_;break;case"YZX":this._x=f*h*u+c*m*_,this._y=c*m*u+f*h*_,this._z=c*h*_-f*m*u,this._w=c*h*u-f*m*_;break;case"XZY":this._x=f*h*u-c*m*_,this._y=c*m*u-f*h*_,this._z=c*h*_+f*m*u,this._w=c*h*u+f*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=i+a+u;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(s-c)*m,this._z=(o-r)*m}else if(i>a&&i>u){const m=2*Math.sqrt(1+i-a-u);this._w=(h-l)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+c)/m}else if(a>u){const m=2*Math.sqrt(1+a-i-u);this._w=(s-c)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+u-i-a);this._w=(o-r)/m,this._x=(s+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-i*c,this._z=s*h+o*c+i*l-r*a,this._w=o*h-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*i+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=i*u+this._x*f,this._y=r*u+this._y*f,this._z=s*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,i=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(mo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(mo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),h=2*(a*t-s*r),u=2*(s*i-o*t);return this.x=t+l*c+o*u-a*h,this.y=i+l*h+a*c-s*u,this.z=r+l*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return bs.copy(this).projectOnVector(e),this.sub(bs)}reflect(e){return this.sub(bs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ct(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const bs=new I,mo=new mi;class gi{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,rn):rn.fromBufferAttribute(s,o),rn.applyMatrix4(e.matrixWorld),this.expandByPoint(rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wr.copy(i.boundingBox)),wr.applyMatrix4(e.matrixWorld),this.union(wr)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,rn),rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(sr),Rr.subVectors(this.max,sr),Ti.subVectors(e.a,sr),bi.subVectors(e.b,sr),Ai.subVectors(e.c,sr),In.subVectors(bi,Ti),Un.subVectors(Ai,bi),Zn.subVectors(Ti,Ai);let t=[0,-In.z,In.y,0,-Un.z,Un.y,0,-Zn.z,Zn.y,In.z,0,-In.x,Un.z,0,-Un.x,Zn.z,0,-Zn.x,-In.y,In.x,0,-Un.y,Un.x,0,-Zn.y,Zn.x,0];return!As(t,Ti,bi,Ai,Rr)||(t=[1,0,0,0,1,0,0,0,1],!As(t,Ti,bi,Ai,Rr))?!1:(Cr.crossVectors(In,Un),t=[Cr.x,Cr.y,Cr.z],As(t,Ti,bi,Ai,Rr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(rn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(xn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const xn=[new I,new I,new I,new I,new I,new I,new I,new I],rn=new I,wr=new gi,Ti=new I,bi=new I,Ai=new I,In=new I,Un=new I,Zn=new I,sr=new I,Rr=new I,Cr=new I,Jn=new I;function As(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Jn.fromArray(n,s);const a=r.x*Math.abs(Jn.x)+r.y*Math.abs(Jn.y)+r.z*Math.abs(Jn.z),l=e.dot(Jn),c=t.dot(Jn),h=i.dot(Jn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const td=new gi,ar=new I,ws=new I;class cs{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):td.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ar.subVectors(e,this.center);const t=ar.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ar,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ws.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ar.copy(e.center).add(ws)),this.expandByPoint(ar.copy(e.center).sub(ws))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Mn=new I,Rs=new I,Pr=new I,Nn=new I,Cs=new I,Lr=new I,Ps=new I;class hs{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Mn.copy(this.origin).addScaledVector(this.direction,t),Mn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Rs.copy(e).add(t).multiplyScalar(.5),Pr.copy(t).sub(e).normalize(),Nn.copy(this.origin).sub(Rs);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Pr),a=Nn.dot(this.direction),l=-Nn.dot(Pr),c=Nn.lengthSq(),h=Math.abs(1-o*o);let u,f,m,_;if(h>0)if(u=o*l-a,f=o*a-l,_=s*h,u>=0)if(f>=-_)if(f<=_){const x=1/h;u*=x,f*=x,m=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=s,u=Math.max(0,-(o*f+a)),m=-u*u+f*(f+2*l)+c;else f=-s,u=Math.max(0,-(o*f+a)),m=-u*u+f*(f+2*l)+c;else f<=-_?(u=Math.max(0,-(-o*s+a)),f=u>0?-s:Math.min(Math.max(-s,-l),s),m=-u*u+f*(f+2*l)+c):f<=_?(u=0,f=Math.min(Math.max(-s,-l),s),m=f*(f+2*l)+c):(u=Math.max(0,-(o*s+a)),f=u>0?s:Math.min(Math.max(-s,-l),s),m=-u*u+f*(f+2*l)+c);else f=o>0?-s:s,u=Math.max(0,-(o*f+a)),m=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Rs).addScaledVector(Pr,f),m}intersectSphere(e,t){Mn.subVectors(e.center,this.origin);const i=Mn.dot(this.direction),r=Mn.dot(Mn)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),h>=0?(s=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Mn)!==null}intersectTriangle(e,t,i,r,s){Cs.subVectors(t,e),Lr.subVectors(i,e),Ps.crossVectors(Cs,Lr);let o=this.direction.dot(Ps),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Nn.subVectors(this.origin,e);const l=a*this.direction.dot(Lr.crossVectors(Nn,Lr));if(l<0)return null;const c=a*this.direction.dot(Cs.cross(Nn));if(c<0||l+c>o)return null;const h=-a*Nn.dot(Ps);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ft{constructor(e,t,i,r,s,o,a,l,c,h,u,f,m,_,x,p){ft.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,h,u,f,m,_,x,p)}set(e,t,i,r,s,o,a,l,c,h,u,f,m,_,x,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=m,d[7]=_,d[11]=x,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ft().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/wi.setFromMatrixColumn(e,0).length(),s=1/wi.setFromMatrixColumn(e,1).length(),o=1/wi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const f=o*h,m=o*u,_=a*h,x=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+_*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=_+m*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*h,m=l*u,_=c*h,x=c*u;t[0]=f+x*a,t[4]=_*a-m,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=m*a-_,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*h,m=l*u,_=c*h,x=c*u;t[0]=f-x*a,t[4]=-o*u,t[8]=_+m*a,t[1]=m+_*a,t[5]=o*h,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*h,m=o*u,_=a*h,x=a*u;t[0]=l*h,t[4]=_*c-m,t[8]=f*c+x,t[1]=l*u,t[5]=x*c+f,t[9]=m*c-_,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,m=o*c,_=a*l,x=a*c;t[0]=l*h,t[4]=x-f*u,t[8]=_*u+m,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=m*u+_,t[10]=f-x*u}else if(e.order==="XZY"){const f=o*l,m=o*c,_=a*l,x=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+x,t[5]=o*h,t[9]=m*u-_,t[2]=_*u-m,t[6]=a*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nd,e,id)}lookAt(e,t,i){const r=this.elements;return Gt.subVectors(e,t),Gt.lengthSq()===0&&(Gt.z=1),Gt.normalize(),On.crossVectors(i,Gt),On.lengthSq()===0&&(Math.abs(i.z)===1?Gt.x+=1e-4:Gt.z+=1e-4,Gt.normalize(),On.crossVectors(i,Gt)),On.normalize(),Dr.crossVectors(Gt,On),r[0]=On.x,r[4]=Dr.x,r[8]=Gt.x,r[1]=On.y,r[5]=Dr.y,r[9]=Gt.y,r[2]=On.z,r[6]=Dr.z,r[10]=Gt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],m=i[13],_=i[2],x=i[6],p=i[10],d=i[14],A=i[3],E=i[7],T=i[11],L=i[15],w=r[0],R=r[4],D=r[8],y=r[12],M=r[1],C=r[5],O=r[9],z=r[13],Y=r[2],j=r[6],H=r[10],J=r[14],W=r[3],oe=r[7],ue=r[11],ce=r[15];return s[0]=o*w+a*M+l*Y+c*W,s[4]=o*R+a*C+l*j+c*oe,s[8]=o*D+a*O+l*H+c*ue,s[12]=o*y+a*z+l*J+c*ce,s[1]=h*w+u*M+f*Y+m*W,s[5]=h*R+u*C+f*j+m*oe,s[9]=h*D+u*O+f*H+m*ue,s[13]=h*y+u*z+f*J+m*ce,s[2]=_*w+x*M+p*Y+d*W,s[6]=_*R+x*C+p*j+d*oe,s[10]=_*D+x*O+p*H+d*ue,s[14]=_*y+x*z+p*J+d*ce,s[3]=A*w+E*M+T*Y+L*W,s[7]=A*R+E*C+T*j+L*oe,s[11]=A*D+E*O+T*H+L*ue,s[15]=A*y+E*z+T*J+L*ce,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],m=e[14],_=e[3],x=e[7],p=e[11],d=e[15];return _*(+s*l*u-r*c*u-s*a*f+i*c*f+r*a*m-i*l*m)+x*(+t*l*m-t*c*f+s*o*f-r*o*m+r*c*h-s*l*h)+p*(+t*c*u-t*a*m-s*o*u+i*o*m+s*a*h-i*c*h)+d*(-r*a*h-t*l*u+t*a*f+r*o*u-i*o*f+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],m=e[11],_=e[12],x=e[13],p=e[14],d=e[15],A=u*p*c-x*f*c+x*l*m-a*p*m-u*l*d+a*f*d,E=_*f*c-h*p*c-_*l*m+o*p*m+h*l*d-o*f*d,T=h*x*c-_*u*c+_*a*m-o*x*m-h*a*d+o*u*d,L=_*u*l-h*x*l-_*a*f+o*x*f+h*a*p-o*u*p,w=t*A+i*E+r*T+s*L;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return e[0]=A*R,e[1]=(x*f*s-u*p*s-x*r*m+i*p*m+u*r*d-i*f*d)*R,e[2]=(a*p*s-x*l*s+x*r*c-i*p*c-a*r*d+i*l*d)*R,e[3]=(u*l*s-a*f*s-u*r*c+i*f*c+a*r*m-i*l*m)*R,e[4]=E*R,e[5]=(h*p*s-_*f*s+_*r*m-t*p*m-h*r*d+t*f*d)*R,e[6]=(_*l*s-o*p*s-_*r*c+t*p*c+o*r*d-t*l*d)*R,e[7]=(o*f*s-h*l*s+h*r*c-t*f*c-o*r*m+t*l*m)*R,e[8]=T*R,e[9]=(_*u*s-h*x*s-_*i*m+t*x*m+h*i*d-t*u*d)*R,e[10]=(o*x*s-_*a*s+_*i*c-t*x*c-o*i*d+t*a*d)*R,e[11]=(h*a*s-o*u*s-h*i*c+t*u*c+o*i*m-t*a*m)*R,e[12]=L*R,e[13]=(h*x*r-_*u*r+_*i*f-t*x*f-h*i*p+t*u*p)*R,e[14]=(_*a*r-o*x*r-_*i*l+t*x*l+o*i*p-t*a*p)*R,e[15]=(o*u*r-h*a*r+h*i*l-t*u*l-o*i*f+t*a*f)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+i,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,h=o+o,u=a+a,f=s*c,m=s*h,_=s*u,x=o*h,p=o*u,d=a*u,A=l*c,E=l*h,T=l*u,L=i.x,w=i.y,R=i.z;return r[0]=(1-(x+d))*L,r[1]=(m+T)*L,r[2]=(_-E)*L,r[3]=0,r[4]=(m-T)*w,r[5]=(1-(f+d))*w,r[6]=(p+A)*w,r[7]=0,r[8]=(_+E)*R,r[9]=(p-A)*R,r[10]=(1-(f+x))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=wi.set(r[0],r[1],r[2]).length();const o=wi.set(r[4],r[5],r[6]).length(),a=wi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],sn.copy(this);const c=1/s,h=1/o,u=1/a;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=h,sn.elements[5]*=h,sn.elements[6]*=h,sn.elements[8]*=u,sn.elements[9]*=u,sn.elements[10]*=u,t.setFromRotationMatrix(sn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=Rn){const l=this.elements,c=2*s/(t-e),h=2*s/(i-r),u=(t+e)/(t-e),f=(i+r)/(i-r);let m,_;if(a===Rn)m=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===rs)m=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=Rn){const l=this.elements,c=1/(t-e),h=1/(i-r),u=1/(o-s),f=(t+e)*c,m=(i+r)*h;let _,x;if(a===Rn)_=(o+s)*u,x=-2*u;else if(a===rs)_=s*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=x,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const wi=new I,sn=new ft,nd=new I(0,0,0),id=new I(1,1,1),On=new I,Dr=new I,Gt=new I,go=new ft,_o=new mi;class pn{constructor(e=0,t=0,i=0,r=pn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],u=r[2],f=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(Ct(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ct(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Ct(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return go.makeRotationFromQuaternion(e),this.setFromRotationMatrix(go,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return _o.setFromEuler(this),this.setFromQuaternion(_o,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pn.DEFAULT_ORDER="XYZ";class pa{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let rd=0;const vo=new I,Ri=new mi,Sn=new ft,Ir=new I,or=new I,sd=new I,ad=new mi,xo=new I(1,0,0),Mo=new I(0,1,0),So=new I(0,0,1),yo={type:"added"},od={type:"removed"},Ci={type:"childadded",child:null},Ls={type:"childremoved",child:null};class Et extends vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=tr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new I,t=new pn,i=new mi,r=new I(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ft},normalMatrix:{value:new Ke}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ri.setFromAxisAngle(e,t),this.quaternion.multiply(Ri),this}rotateOnWorldAxis(e,t){return Ri.setFromAxisAngle(e,t),this.quaternion.premultiply(Ri),this}rotateX(e){return this.rotateOnAxis(xo,e)}rotateY(e){return this.rotateOnAxis(Mo,e)}rotateZ(e){return this.rotateOnAxis(So,e)}translateOnAxis(e,t){return vo.copy(e).applyQuaternion(this.quaternion),this.position.add(vo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xo,e)}translateY(e){return this.translateOnAxis(Mo,e)}translateZ(e){return this.translateOnAxis(So,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ir.copy(e):Ir.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(or,Ir,this.up):Sn.lookAt(Ir,or,this.up),this.quaternion.setFromRotationMatrix(Sn),r&&(Sn.extractRotation(r.matrixWorld),Ri.setFromRotationMatrix(Sn),this.quaternion.premultiply(Ri.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yo),Ci.child=e,this.dispatchEvent(Ci),Ci.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(od),Ls.child=e,this.dispatchEvent(Ls),Ls.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Sn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Sn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yo),Ci.child=e,this.dispatchEvent(Ci),Ci.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,e,sd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(or,ad,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++){const s=t[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),m=o(e.animations),_=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Et.DEFAULT_UP=new I(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const an=new I,yn=new I,Ds=new I,En=new I,Pi=new I,Li=new I,Eo=new I,Is=new I,Us=new I,Ns=new I;class un{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),an.subVectors(e,t),r.cross(an);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){an.subVectors(r,t),yn.subVectors(i,t),Ds.subVectors(e,t);const o=an.dot(an),a=an.dot(yn),l=an.dot(Ds),c=yn.dot(yn),h=yn.dot(Ds),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;const f=1/u,m=(c*l-a*h)*f,_=(o*h-a*l)*f;return s.set(1-m-_,_,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,En.x),l.addScaledVector(o,En.y),l.addScaledVector(a,En.z),l)}static isFrontFacing(e,t,i,r){return an.subVectors(i,t),yn.subVectors(e,t),an.cross(yn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return an.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),an.cross(yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return un.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return un.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Pi.subVectors(r,i),Li.subVectors(s,i),Is.subVectors(e,i);const l=Pi.dot(Is),c=Li.dot(Is);if(l<=0&&c<=0)return t.copy(i);Us.subVectors(e,r);const h=Pi.dot(Us),u=Li.dot(Us);if(h>=0&&u<=h)return t.copy(r);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(i).addScaledVector(Pi,o);Ns.subVectors(e,s);const m=Pi.dot(Ns),_=Li.dot(Ns);if(_>=0&&m<=_)return t.copy(s);const x=m*c-l*_;if(x<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(i).addScaledVector(Li,a);const p=h*_-m*u;if(p<=0&&u-h>=0&&m-_>=0)return Eo.subVectors(s,r),a=(u-h)/(u-h+(m-_)),t.copy(r).addScaledVector(Eo,a);const d=1/(p+x+f);return o=x*d,a=f*d,t.copy(i).addScaledVector(Pi,o).addScaledVector(Li,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ll={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},Ur={h:0,s:0,l:0};function Os(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class tt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=hn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=st.workingColorSpace){return this.r=e,this.g=t,this.b=i,st.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=st.workingColorSpace){if(e=fa(e,1),t=Ct(t,0,1),i=Ct(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Os(o,s,e+1/3),this.g=Os(o,s,e),this.b=Os(o,s,e-1/3)}return st.toWorkingColorSpace(this,r),this}setStyle(e,t=hn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=hn){const i=Ll[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}copyLinearToSRGB(e){return this.r=Es(e.r),this.g=Es(e.g),this.b=Es(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=hn){return st.fromWorkingColorSpace(At.copy(this),e),Math.round(Ct(At.r*255,0,255))*65536+Math.round(Ct(At.g*255,0,255))*256+Math.round(Ct(At.b*255,0,255))}getHexString(e=hn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.fromWorkingColorSpace(At.copy(this),t);const i=At.r,r=At.g,s=At.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-i)/u+2;break;case s:l=(i-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=st.workingColorSpace){return st.fromWorkingColorSpace(At.copy(this),t),e.r=At.r,e.g=At.g,e.b=At.b,e}getStyle(e=hn){st.fromWorkingColorSpace(At.copy(this),e);const t=At.r,i=At.g,r=At.b;return e!==hn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Fn),this.setHSL(Fn.h+e,Fn.s+t,Fn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Fn),e.getHSL(Ur);const i=mr(Fn.h,Ur.h,t),r=mr(Fn.s,Ur.s,t),s=mr(Fn.l,Ur.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const At=new tt;tt.NAMES=Ll;let ld=0;class nr extends vi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=tr(),this.name="",this.type="Material",this.blending=Vi,this.side=Wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Zs,this.blendDst=Js,this.blendEquation=oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=Qr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=yi,this.stencilZFail=yi,this.stencilZPass=yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Vi&&(i.blending=this.blending),this.side!==Wn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Zs&&(i.blendSrc=this.blendSrc),this.blendDst!==Js&&(i.blendDst=this.blendDst),this.blendEquation!==oi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Qr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==oo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==yi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==yi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==yi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Er extends nr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.combine=gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const gt=new I,Nr=new We;class Kt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=lo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Rl("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Nr.fromBufferAttribute(this,t),Nr.applyMatrix3(e),this.setXY(t,Nr.x,Nr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Hi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Dt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Hi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Hi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Hi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Hi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),i=Dt(i,this.array),r=Dt(r,this.array),s=Dt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lo&&(e.usage=this.usage),e}}class Dl extends Kt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Il extends Kt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Lt extends Kt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let cd=0;const $t=new ft,Fs=new Et,Di=new I,Vt=new gi,lr=new gi,St=new I;class jt extends vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=tr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wl(e)?Il:Dl)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,i){return $t.makeTranslation(e,t,i),this.applyMatrix4($t),this}scale(e,t,i){return $t.makeScale(e,t,i),this.applyMatrix4($t),this}lookAt(e){return Fs.lookAt(e),Fs.updateMatrix(),this.applyMatrix4(Fs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Di).negate(),this.translate(Di.x,Di.y,Di.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Lt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Vt.setFromBufferAttribute(s),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,Vt.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,Vt.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(Vt.min),this.boundingBox.expandByPoint(Vt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const i=this.boundingSphere.center;if(Vt.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];lr.setFromBufferAttribute(a),this.morphTargetsRelative?(St.addVectors(Vt.min,lr.min),Vt.expandByPoint(St),St.addVectors(Vt.max,lr.max),Vt.expandByPoint(St)):(Vt.expandByPoint(lr.min),Vt.expandByPoint(lr.max))}Vt.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)St.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(St));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)St.fromBufferAttribute(a,c),l&&(Di.fromBufferAttribute(e,c),St.add(Di)),r=Math.max(r,i.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Kt(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let D=0;D<i.count;D++)a[D]=new I,l[D]=new I;const c=new I,h=new I,u=new I,f=new We,m=new We,_=new We,x=new I,p=new I;function d(D,y,M){c.fromBufferAttribute(i,D),h.fromBufferAttribute(i,y),u.fromBufferAttribute(i,M),f.fromBufferAttribute(s,D),m.fromBufferAttribute(s,y),_.fromBufferAttribute(s,M),h.sub(c),u.sub(c),m.sub(f),_.sub(f);const C=1/(m.x*_.y-_.x*m.y);isFinite(C)&&(x.copy(h).multiplyScalar(_.y).addScaledVector(u,-m.y).multiplyScalar(C),p.copy(u).multiplyScalar(m.x).addScaledVector(h,-_.x).multiplyScalar(C),a[D].add(x),a[y].add(x),a[M].add(x),l[D].add(p),l[y].add(p),l[M].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let D=0,y=A.length;D<y;++D){const M=A[D],C=M.start,O=M.count;for(let z=C,Y=C+O;z<Y;z+=3)d(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const E=new I,T=new I,L=new I,w=new I;function R(D){L.fromBufferAttribute(r,D),w.copy(L);const y=a[D];E.copy(y),E.sub(L.multiplyScalar(L.dot(y))).normalize(),T.crossVectors(w,y);const C=T.dot(l[D])<0?-1:1;o.setXYZW(D,E.x,E.y,E.z,C)}for(let D=0,y=A.length;D<y;++D){const M=A[D],C=M.start,O=M.count;for(let z=C,Y=C+O;z<Y;z+=3)R(e.getX(z+0)),R(e.getX(z+1)),R(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Kt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const r=new I,s=new I,o=new I,a=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),x=e.getX(f+1),p=e.getX(f+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,p),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),a.add(h),l.add(h),c.add(h),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h);let m=0,_=0;for(let x=0,p=l.length;x<p;x++){a.isInterleavedBufferAttribute?m=l[x]*a.data.stride+a.offset:m=l[x]*h;for(let d=0;d<h;d++)f[_++]=c[m++]}return new Kt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new jt,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){const f=c[h],m=e(f,i);l.push(m)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let f=0,m=u.length;f<m;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const To=new ft,Qn=new hs,Or=new cs,bo=new I,Ii=new I,Ui=new I,Ni=new I,zs=new I,Fr=new I,zr=new We,Br=new We,Hr=new We,Ao=new I,wo=new I,Ro=new I,kr=new I,Gr=new I;class Xe extends Et{constructor(e=new jt,t=new Er){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Fr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],u=s[l];h!==0&&(zs.fromBufferAttribute(u,e),o?Fr.addScaledVector(zs,h):Fr.addScaledVector(zs.sub(t),h))}t.add(Fr)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Or.copy(i.boundingSphere),Or.applyMatrix4(s),Qn.copy(e.ray).recast(e.near),!(Or.containsPoint(Qn.origin)===!1&&(Qn.intersectSphere(Or,bo)===null||Qn.origin.distanceToSquared(bo)>(e.far-e.near)**2))&&(To.copy(s).invert(),Qn.copy(e.ray).applyMatrix4(To),!(i.boundingBox!==null&&Qn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Qn)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,m=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){const p=f[_],d=o[p.materialIndex],A=Math.max(p.start,m.start),E=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let T=A,L=E;T<L;T+=3){const w=a.getX(T),R=a.getX(T+1),D=a.getX(T+2);r=Vr(this,d,e,i,c,h,u,w,R,D),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),x=Math.min(a.count,m.start+m.count);for(let p=_,d=x;p<d;p+=3){const A=a.getX(p),E=a.getX(p+1),T=a.getX(p+2);r=Vr(this,o,e,i,c,h,u,A,E,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,x=f.length;_<x;_++){const p=f[_],d=o[p.materialIndex],A=Math.max(p.start,m.start),E=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let T=A,L=E;T<L;T+=3){const w=T,R=T+1,D=T+2;r=Vr(this,d,e,i,c,h,u,w,R,D),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const _=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let p=_,d=x;p<d;p+=3){const A=p,E=p+1,T=p+2;r=Vr(this,o,e,i,c,h,u,A,E,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function hd(n,e,t,i,r,s,o,a){let l;if(e.side===Ot?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Wn,a),l===null)return null;Gr.copy(a),Gr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Gr);return c<t.near||c>t.far?null:{distance:c,point:Gr.clone(),object:n}}function Vr(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Ii),n.getVertexPosition(l,Ui),n.getVertexPosition(c,Ni);const h=hd(n,e,t,i,Ii,Ui,Ni,kr);if(h){r&&(zr.fromBufferAttribute(r,a),Br.fromBufferAttribute(r,l),Hr.fromBufferAttribute(r,c),h.uv=un.getInterpolation(kr,Ii,Ui,Ni,zr,Br,Hr,new We)),s&&(zr.fromBufferAttribute(s,a),Br.fromBufferAttribute(s,l),Hr.fromBufferAttribute(s,c),h.uv1=un.getInterpolation(kr,Ii,Ui,Ni,zr,Br,Hr,new We)),o&&(Ao.fromBufferAttribute(o,a),wo.fromBufferAttribute(o,l),Ro.fromBufferAttribute(o,c),h.normal=un.getInterpolation(kr,Ii,Ui,Ni,Ao,wo,Ro,new I),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new I,materialIndex:0};un.getNormal(Ii,Ui,Ni,u.normal),h.face=u}return h}class ln extends jt{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let f=0,m=0;_("z","y","x",-1,-1,i,t,e,o,s,0),_("z","y","x",1,-1,i,t,-e,o,s,1),_("x","z","y",1,1,e,i,t,r,o,2),_("x","z","y",1,-1,e,i,-t,r,o,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Lt(c,3)),this.setAttribute("normal",new Lt(h,3)),this.setAttribute("uv",new Lt(u,2));function _(x,p,d,A,E,T,L,w,R,D,y){const M=T/R,C=L/D,O=T/2,z=L/2,Y=w/2,j=R+1,H=D+1;let J=0,W=0;const oe=new I;for(let ue=0;ue<H;ue++){const ce=ue*C-z;for(let ge=0;ge<j;ge++){const ke=ge*M-O;oe[x]=ke*A,oe[p]=ce*E,oe[d]=Y,c.push(oe.x,oe.y,oe.z),oe[x]=0,oe[p]=0,oe[d]=w>0?1:-1,h.push(oe.x,oe.y,oe.z),u.push(ge/R),u.push(1-ue/D),J+=1}}for(let ue=0;ue<D;ue++)for(let ce=0;ce<R;ce++){const ge=f+ce+j*ue,ke=f+ce+j*(ue+1),K=f+(ce+1)+j*(ue+1),q=f+(ce+1)+j*ue;l.push(ge,ke,q),l.push(ke,K,q),W+=6}a.addGroup(m,W,y),m+=W,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ln(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Qi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function It(n){const e={};for(let t=0;t<n.length;t++){const i=Qi(n[t]);for(const r in i)e[r]=i[r]}return e}function dd(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Ul(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}const ud={clone:Qi,merge:It};var fd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qn extends nr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fd,this.fragmentShader=pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=dd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Nl extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=Rn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zn=new I,Co=new We,Po=new We;class Xt extends Nl{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=vr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(pr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return vr*2*Math.atan(Math.tan(pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zn.x,zn.y).multiplyScalar(-e/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(zn.x,zn.y).multiplyScalar(-e/zn.z)}getViewSize(e,t){return this.getViewBounds(e,Co,Po),t.subVectors(Po,Co)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(pr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Oi=-90,Fi=1;class md extends Et{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Xt(Oi,Fi,e,t);r.layers=this.layers,this.add(r);const s=new Xt(Oi,Fi,e,t);s.layers=this.layers,this.add(s);const o=new Xt(Oi,Fi,e,t);o.layers=this.layers,this.add(o);const a=new Xt(Oi,Fi,e,t);a.layers=this.layers,this.add(a);const l=new Xt(Oi,Fi,e,t);l.layers=this.layers,this.add(l);const c=new Xt(Oi,Fi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===Rn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===rs)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,h),e.setRenderTarget(u,f,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Ol extends Pt{constructor(e,t,i,r,s,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Yi,super(e,t,i,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gd extends pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Ol(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:on}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ln(5,5,5),s=new qn({name:"CubemapFromEquirect",uniforms:Qi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ot,blending:Gn});s.uniforms.tEquirect.value=t;const o=new Xe(r,s),a=t.minFilter;return t.minFilter===hi&&(t.minFilter=on),new md(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const Bs=new I,_d=new I,vd=new Ke;class An{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Bs.subVectors(i,t).cross(_d.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Bs),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||vd.getNormalMatrix(e),r=this.coplanarPoint(Bs).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ei=new cs,Wr=new I;class ma{constructor(e=new An,t=new An,i=new An,r=new An,s=new An,o=new An){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Rn){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],h=r[5],u=r[6],f=r[7],m=r[8],_=r[9],x=r[10],p=r[11],d=r[12],A=r[13],E=r[14],T=r[15];if(i[0].setComponents(l-s,f-c,p-m,T-d).normalize(),i[1].setComponents(l+s,f+c,p+m,T+d).normalize(),i[2].setComponents(l+o,f+h,p+_,T+A).normalize(),i[3].setComponents(l-o,f-h,p-_,T-A).normalize(),i[4].setComponents(l-a,f-u,p-x,T-E).normalize(),t===Rn)i[5].setComponents(l+a,f+u,p+x,T+E).normalize();else if(t===rs)i[5].setComponents(a,u,x,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ei.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ei.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ei)}intersectsSprite(e){return ei.center.set(0,0,0),ei.radius=.7071067811865476,ei.applyMatrix4(e.matrixWorld),this.intersectsSphere(ei)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Wr.x=r.normal.x>0?e.max.x:e.min.x,Wr.y=r.normal.y>0?e.max.y:e.min.y,Wr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Fl(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function xd(n){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),a.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){const h=l.array,u=l._updateRange,f=l.updateRanges;if(n.bindBuffer(c,a),u.count===-1&&f.length===0&&n.bufferSubData(c,0,h),f.length!==0){for(let m=0,_=f.length;m<_;m++){const x=f[m];n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}u.count!==-1&&(n.bufferSubData(c,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count),u.count=-1),l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class ds extends jt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,h=l+1,u=e/a,f=t/l,m=[],_=[],x=[],p=[];for(let d=0;d<h;d++){const A=d*f-o;for(let E=0;E<c;E++){const T=E*u-s;_.push(T,-A,0),x.push(0,0,1),p.push(E/a),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let A=0;A<a;A++){const E=A+c*d,T=A+c*(d+1),L=A+1+c*(d+1),w=A+1+c*d;m.push(E,T,w),m.push(T,L,w)}this.setIndex(m),this.setAttribute("position",new Lt(_,3)),this.setAttribute("normal",new Lt(x,3)),this.setAttribute("uv",new Lt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ds(e.width,e.height,e.widthSegments,e.heightSegments)}}var Md=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,yd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ed=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Td=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ad=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,wd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rd=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Cd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Pd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ld=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Id=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ud=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Od=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Bd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,kd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,Vd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,qd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Kd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$d="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zd=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Jd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Qd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,eu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,tu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,iu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ru=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,su=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,au=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ou=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,du=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,uu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,fu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_u=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,vu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,xu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Mu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Su=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Eu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tu=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Au=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ru=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Cu=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Du=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Iu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Uu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nu=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ou=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,zu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Bu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ku=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gu=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Yu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ku=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ju=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$u=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ju=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ef=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,nf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,af=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,of=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,lf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,hf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,df=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,uf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ff=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,pf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,mf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,gf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_f=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Mf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Sf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ef=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Af=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,wf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Rf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Cf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Pf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Df=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,If=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Uf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Nf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Of=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ff=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Bf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,kf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Gf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Xf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,jf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$f=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Jf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Qf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:Md,alphahash_pars_fragment:Sd,alphamap_fragment:yd,alphamap_pars_fragment:Ed,alphatest_fragment:Td,alphatest_pars_fragment:bd,aomap_fragment:Ad,aomap_pars_fragment:wd,batching_pars_vertex:Rd,batching_vertex:Cd,begin_vertex:Pd,beginnormal_vertex:Ld,bsdfs:Dd,iridescence_fragment:Id,bumpmap_pars_fragment:Ud,clipping_planes_fragment:Nd,clipping_planes_pars_fragment:Od,clipping_planes_pars_vertex:Fd,clipping_planes_vertex:zd,color_fragment:Bd,color_pars_fragment:Hd,color_pars_vertex:kd,color_vertex:Gd,common:Vd,cube_uv_reflection_fragment:Wd,defaultnormal_vertex:Xd,displacementmap_pars_vertex:qd,displacementmap_vertex:Yd,emissivemap_fragment:Kd,emissivemap_pars_fragment:jd,colorspace_fragment:$d,colorspace_pars_fragment:Zd,envmap_fragment:Jd,envmap_common_pars_fragment:Qd,envmap_pars_fragment:eu,envmap_pars_vertex:tu,envmap_physical_pars_fragment:uu,envmap_vertex:nu,fog_vertex:iu,fog_pars_vertex:ru,fog_fragment:su,fog_pars_fragment:au,gradientmap_pars_fragment:ou,lightmap_pars_fragment:lu,lights_lambert_fragment:cu,lights_lambert_pars_fragment:hu,lights_pars_begin:du,lights_toon_fragment:fu,lights_toon_pars_fragment:pu,lights_phong_fragment:mu,lights_phong_pars_fragment:gu,lights_physical_fragment:_u,lights_physical_pars_fragment:vu,lights_fragment_begin:xu,lights_fragment_maps:Mu,lights_fragment_end:Su,logdepthbuf_fragment:yu,logdepthbuf_pars_fragment:Eu,logdepthbuf_pars_vertex:Tu,logdepthbuf_vertex:bu,map_fragment:Au,map_pars_fragment:wu,map_particle_fragment:Ru,map_particle_pars_fragment:Cu,metalnessmap_fragment:Pu,metalnessmap_pars_fragment:Lu,morphinstance_vertex:Du,morphcolor_vertex:Iu,morphnormal_vertex:Uu,morphtarget_pars_vertex:Nu,morphtarget_vertex:Ou,normal_fragment_begin:Fu,normal_fragment_maps:zu,normal_pars_fragment:Bu,normal_pars_vertex:Hu,normal_vertex:ku,normalmap_pars_fragment:Gu,clearcoat_normal_fragment_begin:Vu,clearcoat_normal_fragment_maps:Wu,clearcoat_pars_fragment:Xu,iridescence_pars_fragment:qu,opaque_fragment:Yu,packing:Ku,premultiplied_alpha_fragment:ju,project_vertex:$u,dithering_fragment:Zu,dithering_pars_fragment:Ju,roughnessmap_fragment:Qu,roughnessmap_pars_fragment:ef,shadowmap_pars_fragment:tf,shadowmap_pars_vertex:nf,shadowmap_vertex:rf,shadowmask_pars_fragment:sf,skinbase_vertex:af,skinning_pars_vertex:of,skinning_vertex:lf,skinnormal_vertex:cf,specularmap_fragment:hf,specularmap_pars_fragment:df,tonemapping_fragment:uf,tonemapping_pars_fragment:ff,transmission_fragment:pf,transmission_pars_fragment:mf,uv_pars_fragment:gf,uv_pars_vertex:_f,uv_vertex:vf,worldpos_vertex:xf,background_vert:Mf,background_frag:Sf,backgroundCube_vert:yf,backgroundCube_frag:Ef,cube_vert:Tf,cube_frag:bf,depth_vert:Af,depth_frag:wf,distanceRGBA_vert:Rf,distanceRGBA_frag:Cf,equirect_vert:Pf,equirect_frag:Lf,linedashed_vert:Df,linedashed_frag:If,meshbasic_vert:Uf,meshbasic_frag:Nf,meshlambert_vert:Of,meshlambert_frag:Ff,meshmatcap_vert:zf,meshmatcap_frag:Bf,meshnormal_vert:Hf,meshnormal_frag:kf,meshphong_vert:Gf,meshphong_frag:Vf,meshphysical_vert:Wf,meshphysical_frag:Xf,meshtoon_vert:qf,meshtoon_frag:Yf,points_vert:Kf,points_frag:jf,shadow_vert:$f,shadow_frag:Zf,sprite_vert:Jf,sprite_frag:Qf},Me={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},dn={basic:{uniforms:It([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:It([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new tt(0)}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:It([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:It([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:It([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new tt(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:It([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:It([Me.points,Me.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:It([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:It([Me.common,Me.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:It([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:It([Me.sprite,Me.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distanceRGBA:{uniforms:It([Me.common,Me.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distanceRGBA_vert,fragmentShader:Ye.distanceRGBA_frag},shadow:{uniforms:It([Me.lights,Me.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};dn.physical={uniforms:It([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const Xr={r:0,b:0,g:0},ti=new pn,ep=new ft;function tp(n,e,t,i,r,s,o){const a=new tt(0);let l=s===!0?0:1,c,h,u=null,f=0,m=null;function _(A){let E=A.isScene===!0?A.background:null;return E&&E.isTexture&&(E=(A.backgroundBlurriness>0?t:e).get(E)),E}function x(A){let E=!1;const T=_(A);T===null?d(a,l):T&&T.isColor&&(d(T,1),E=!0);const L=n.xr.getEnvironmentBlendMode();L==="additive"?i.buffers.color.setClear(0,0,0,1,o):L==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||E)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(A,E){const T=_(E);T&&(T.isCubeTexture||T.mapping===as)?(h===void 0&&(h=new Xe(new ln(1,1,1),new qn({name:"BackgroundCubeMaterial",uniforms:Qi(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Ot,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(L,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),ti.copy(E.backgroundRotation),ti.x*=-1,ti.y*=-1,ti.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ti.y*=-1,ti.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(ep.makeRotationFromEuler(ti)),h.material.toneMapped=st.getTransfer(T.colorSpace)!==ct,(u!==T||f!==T.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,u=T,f=T.version,m=n.toneMapping),h.layers.enableAll(),A.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new Xe(new ds(2,2),new qn({name:"BackgroundMaterial",uniforms:Qi(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=st.getTransfer(T.colorSpace)!==ct,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||f!==T.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,u=T,f=T.version,m=n.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function d(A,E){A.getRGB(Xr,Ul(n)),i.buffers.color.setClear(Xr.r,Xr.g,Xr.b,E,o)}return{getClearColor:function(){return a},setClearColor:function(A,E=1){a.set(A),l=E,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(A){l=A,d(a,l)},render:x,addToRenderList:p}}function np(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(M,C,O,z,Y){let j=!1;const H=u(z,O,C);s!==H&&(s=H,c(s.object)),j=m(M,z,O,Y),j&&_(M,z,O,Y),Y!==null&&e.update(Y,n.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,T(M,C,O,z),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function h(M){return n.deleteVertexArray(M)}function u(M,C,O){const z=O.wireframe===!0;let Y=i[M.id];Y===void 0&&(Y={},i[M.id]=Y);let j=Y[C.id];j===void 0&&(j={},Y[C.id]=j);let H=j[z];return H===void 0&&(H=f(l()),j[z]=H),H}function f(M){const C=[],O=[],z=[];for(let Y=0;Y<t;Y++)C[Y]=0,O[Y]=0,z[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:O,attributeDivisors:z,object:M,attributes:{},index:null}}function m(M,C,O,z){const Y=s.attributes,j=C.attributes;let H=0;const J=O.getAttributes();for(const W in J)if(J[W].location>=0){const ue=Y[W];let ce=j[W];if(ce===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(ce=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(ce=M.instanceColor)),ue===void 0||ue.attribute!==ce||ce&&ue.data!==ce.data)return!0;H++}return s.attributesNum!==H||s.index!==z}function _(M,C,O,z){const Y={},j=C.attributes;let H=0;const J=O.getAttributes();for(const W in J)if(J[W].location>=0){let ue=j[W];ue===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(ue=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(ue=M.instanceColor));const ce={};ce.attribute=ue,ue&&ue.data&&(ce.data=ue.data),Y[W]=ce,H++}s.attributes=Y,s.attributesNum=H,s.index=z}function x(){const M=s.newAttributes;for(let C=0,O=M.length;C<O;C++)M[C]=0}function p(M){d(M,0)}function d(M,C){const O=s.newAttributes,z=s.enabledAttributes,Y=s.attributeDivisors;O[M]=1,z[M]===0&&(n.enableVertexAttribArray(M),z[M]=1),Y[M]!==C&&(n.vertexAttribDivisor(M,C),Y[M]=C)}function A(){const M=s.newAttributes,C=s.enabledAttributes;for(let O=0,z=C.length;O<z;O++)C[O]!==M[O]&&(n.disableVertexAttribArray(O),C[O]=0)}function E(M,C,O,z,Y,j,H){H===!0?n.vertexAttribIPointer(M,C,O,Y,j):n.vertexAttribPointer(M,C,O,z,Y,j)}function T(M,C,O,z){x();const Y=z.attributes,j=O.getAttributes(),H=C.defaultAttributeValues;for(const J in j){const W=j[J];if(W.location>=0){let oe=Y[J];if(oe===void 0&&(J==="instanceMatrix"&&M.instanceMatrix&&(oe=M.instanceMatrix),J==="instanceColor"&&M.instanceColor&&(oe=M.instanceColor)),oe!==void 0){const ue=oe.normalized,ce=oe.itemSize,ge=e.get(oe);if(ge===void 0)continue;const ke=ge.buffer,K=ge.type,q=ge.bytesPerElement,ee=K===n.INT||K===n.UNSIGNED_INT||oe.gpuType===xl;if(oe.isInterleavedBufferAttribute){const re=oe.data,Se=re.stride,Te=oe.offset;if(re.isInstancedInterleavedBuffer){for(let Ae=0;Ae<W.locationSize;Ae++)d(W.location+Ae,re.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Ae=0;Ae<W.locationSize;Ae++)p(W.location+Ae);n.bindBuffer(n.ARRAY_BUFFER,ke);for(let Ae=0;Ae<W.locationSize;Ae++)E(W.location+Ae,ce/W.locationSize,K,ue,Se*q,(Te+ce/W.locationSize*Ae)*q,ee)}else{if(oe.isInstancedBufferAttribute){for(let re=0;re<W.locationSize;re++)d(W.location+re,oe.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let re=0;re<W.locationSize;re++)p(W.location+re);n.bindBuffer(n.ARRAY_BUFFER,ke);for(let re=0;re<W.locationSize;re++)E(W.location+re,ce/W.locationSize,K,ue,ce*q,ce/W.locationSize*re*q,ee)}}else if(H!==void 0){const ue=H[J];if(ue!==void 0)switch(ue.length){case 2:n.vertexAttrib2fv(W.location,ue);break;case 3:n.vertexAttrib3fv(W.location,ue);break;case 4:n.vertexAttrib4fv(W.location,ue);break;default:n.vertexAttrib1fv(W.location,ue)}}}}A()}function L(){D();for(const M in i){const C=i[M];for(const O in C){const z=C[O];for(const Y in z)h(z[Y].object),delete z[Y];delete C[O]}delete i[M]}}function w(M){if(i[M.id]===void 0)return;const C=i[M.id];for(const O in C){const z=C[O];for(const Y in z)h(z[Y].object),delete z[Y];delete C[O]}delete i[M.id]}function R(M){for(const C in i){const O=i[C];if(O[M.id]===void 0)continue;const z=O[M.id];for(const Y in z)h(z[Y].object),delete z[Y];delete O[M.id]}}function D(){y(),o=!0,s!==r&&(s=r,c(s.object))}function y(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:D,resetDefaultState:y,dispose:L,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:p,disableUnusedAttributes:A}}function ip(n,e,t){let i;function r(c){i=c}function s(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function a(c,h,u){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<u;m++)this.render(c[m],h[m]);else{f.multiDrawArraysWEBGL(i,c,0,h,0,u);let m=0;for(let _=0;_<u;_++)m+=h[_];t.update(m,i,1)}}function l(c,h,u,f){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)o(c[_],h[_],f[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let _=0;for(let x=0;x<u;x++)_+=h[x];for(let x=0;x<f.length;x++)t.update(_,i,f[x])}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function rp(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(w){return!(w!==fn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const R=w===os&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==Xn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==Hn&&!R)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),x=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),d=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),A=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=m>0,L=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:x,maxAttributes:p,maxVertexUniforms:d,maxVaryings:A,maxFragmentUniforms:E,vertexTextures:T,maxSamples:L}}function sp(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new An,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const m=u.length!==0||f||i!==0||r;return r=f,i=u.length,m},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,m){const _=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,d=n.get(u);if(!r||_===null||_.length===0||s&&!p)s?h(null):c();else{const A=s?0:i,E=A*4;let T=d.clippingState||null;l.value=T,T=h(_,f,E,m);for(let L=0;L!==E;++L)T[L]=t[L];d.clippingState=T,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,f,m,_){const x=u!==null?u.length:0;let p=null;if(x!==0){if(p=l.value,_!==!0||p===null){const d=m+x*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(p===null||p.length<d)&&(p=new Float32Array(d));for(let E=0,T=m;E!==x;++E,T+=4)o.copy(u[E]).applyMatrix4(A,a),o.normal.toArray(p,T),p[T+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}function ap(n){let e=new WeakMap;function t(o,a){return a===Qs?o.mapping=Yi:a===ea&&(o.mapping=Ki),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Qs||a===ea)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new gd(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class zl extends Nl{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ki=4,Lo=[.125,.215,.35,.446,.526,.582],li=20,Hs=new zl,Do=new tt;let ks=null,Gs=0,Vs=0,Ws=!1;const si=(1+Math.sqrt(5))/2,zi=1/si,Io=[new I(-si,zi,0),new I(si,zi,0),new I(-zi,0,si),new I(zi,0,si),new I(0,si,-zi),new I(0,si,zi),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class ia{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){ks=this._renderer.getRenderTarget(),Gs=this._renderer.getActiveCubeFace(),Vs=this._renderer.getActiveMipmapLevel(),Ws=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=No(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ks,Gs,Vs),this._renderer.xr.enabled=Ws,e.scissorTest=!1,qr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yi||e.mapping===Ki?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ks=this._renderer.getRenderTarget(),Gs=this._renderer.getActiveCubeFace(),Vs=this._renderer.getActiveMipmapLevel(),Ws=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:on,minFilter:on,generateMipmaps:!1,type:os,format:fn,colorSpace:Kn,depthBuffer:!1},r=Uo(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Uo(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=op(s)),this._blurMaterial=lp(s,e,t)}return r}_compileMaterial(e){const t=new Xe(this._lodPlanes[0],e);this._renderer.compile(t,Hs)}_sceneToCubeUV(e,t,i,r){const a=new Xt(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Do),h.toneMapping=Vn,h.autoClear=!1;const m=new Er({name:"PMREM.Background",side:Ot,depthWrite:!1,depthTest:!1}),_=new Xe(new ln,m);let x=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,x=!0):(m.color.copy(Do),x=!0);for(let d=0;d<6;d++){const A=d%3;A===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):A===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const E=this._cubeSize;qr(r,A*E,d>2?E:0,E,E),h.setRenderTarget(r),x&&h.render(_,a),h.render(e,a)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Yi||e.mapping===Ki;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=No());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Xe(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;qr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Hs)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Io[(r-s-1)%Io.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Xe(this._lodPlanes[r],c),f=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*li-1),x=s/_,p=isFinite(s)?1+Math.floor(h*x):li;p>li&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${li}`);const d=[];let A=0;for(let R=0;R<li;++R){const D=R/x,y=Math.exp(-D*D/2);d.push(y),R===0?A+=y:R<p&&(A+=2*y)}for(let R=0;R<d.length;R++)d[R]=d[R]/A;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:E}=this;f.dTheta.value=_,f.mipInt.value=E-i;const T=this._sizeLods[r],L=3*T*(r>E-ki?r-E+ki:0),w=4*(this._cubeSize-T);qr(t,L,w,3*T,2*T),l.setRenderTarget(t),l.render(u,Hs)}}function op(n){const e=[],t=[],i=[];let r=n;const s=n-ki+1+Lo.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-ki?l=Lo[o-n+ki-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,_=6,x=3,p=2,d=1,A=new Float32Array(x*_*m),E=new Float32Array(p*_*m),T=new Float32Array(d*_*m);for(let w=0;w<m;w++){const R=w%3*2/3-1,D=w>2?0:-1,y=[R,D,0,R+2/3,D,0,R+2/3,D+1,0,R,D,0,R+2/3,D+1,0,R,D+1,0];A.set(y,x*_*w),E.set(f,p*_*w);const M=[w,w,w,w,w,w];T.set(M,d*_*w)}const L=new jt;L.setAttribute("position",new Kt(A,x)),L.setAttribute("uv",new Kt(E,p)),L.setAttribute("faceIndex",new Kt(T,d)),e.push(L),r>ki&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Uo(n,e,t){const i=new pi(n,e,t);return i.texture.mapping=as,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function qr(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function lp(n,e,t){const i=new Float32Array(li),r=new I(0,1,0);return new qn({name:"SphericalGaussianBlur",defines:{n:li,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function No(){return new qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Oo(){return new qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function ga(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function cp(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Qs||l===ea,h=l===Yi||l===Ki;if(c||h){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new ia(n)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const m=a.image;return c&&m&&m.height>0||h&&m&&r(m)?(t===null&&(t=new ia(n)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function r(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function hp(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Rl("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function dp(n,e,t,i){const r={},s=new WeakMap;function o(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);for(const _ in f.morphAttributes){const x=f.morphAttributes[_];for(let p=0,d=x.length;p<d;p++)e.remove(x[p])}f.removeEventListener("dispose",o),delete r[f.id];const m=s.get(f);m&&(e.remove(m),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const _ in f)e.update(f[_],n.ARRAY_BUFFER);const m=u.morphAttributes;for(const _ in m){const x=m[_];for(let p=0,d=x.length;p<d;p++)e.update(x[p],n.ARRAY_BUFFER)}}function c(u){const f=[],m=u.index,_=u.attributes.position;let x=0;if(m!==null){const A=m.array;x=m.version;for(let E=0,T=A.length;E<T;E+=3){const L=A[E+0],w=A[E+1],R=A[E+2];f.push(L,w,w,R,R,L)}}else if(_!==void 0){const A=_.array;x=_.version;for(let E=0,T=A.length/3-1;E<T;E+=3){const L=E+0,w=E+1,R=E+2;f.push(L,w,w,R,R,L)}}else return;const p=new(wl(f)?Il:Dl)(f,1);p.version=x;const d=s.get(u);d&&e.remove(d),s.set(u,p)}function h(u){const f=s.get(u);if(f){const m=u.index;m!==null&&f.version<m.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function up(n,e,t){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,m){n.drawElements(i,m,s,f*o),t.update(m,i,1)}function c(f,m,_){_!==0&&(n.drawElementsInstanced(i,m,s,f*o,_),t.update(m,i,_))}function h(f,m,_){if(_===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let p=0;p<_;p++)this.render(f[p]/o,m[p]);else{x.multiDrawElementsWEBGL(i,m,0,s,f,0,_);let p=0;for(let d=0;d<_;d++)p+=m[d];t.update(p,i,1)}}function u(f,m,_,x){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/o,m[d],x[d]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,s,f,0,x,0,_);let d=0;for(let A=0;A<_;A++)d+=m[A];for(let A=0;A<x.length;A++)t.update(d,i,x[A])}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function fp(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function pp(n,e,t){const i=new WeakMap,r=new dt;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(a);if(f===void 0||f.count!==u){let M=function(){D.dispose(),i.delete(a),a.removeEventListener("dispose",M)};var m=M;f!==void 0&&f.texture.dispose();const _=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],E=a.morphAttributes.color||[];let T=0;_===!0&&(T=1),x===!0&&(T=2),p===!0&&(T=3);let L=a.attributes.position.count*T,w=1;L>e.maxTextureSize&&(w=Math.ceil(L/e.maxTextureSize),L=e.maxTextureSize);const R=new Float32Array(L*w*4*u),D=new Pl(R,L,w,u);D.type=Hn,D.needsUpdate=!0;const y=T*4;for(let C=0;C<u;C++){const O=d[C],z=A[C],Y=E[C],j=L*w*4*C;for(let H=0;H<O.count;H++){const J=H*y;_===!0&&(r.fromBufferAttribute(O,H),R[j+J+0]=r.x,R[j+J+1]=r.y,R[j+J+2]=r.z,R[j+J+3]=0),x===!0&&(r.fromBufferAttribute(z,H),R[j+J+4]=r.x,R[j+J+5]=r.y,R[j+J+6]=r.z,R[j+J+7]=0),p===!0&&(r.fromBufferAttribute(Y,H),R[j+J+8]=r.x,R[j+J+9]=r.y,R[j+J+10]=r.z,R[j+J+11]=Y.itemSize===4?r.w:1)}}f={count:u,texture:D,size:new We(L,w)},i.set(a,f),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let _=0;for(let p=0;p<c.length;p++)_+=c[p];const x=a.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function mp(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,u=e.get(l,h);if(r.get(u)!==c&&(e.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return u}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class Bl extends Pt{constructor(e,t,i,r,s,o,a,l,c,h=Wi){if(h!==Wi&&h!==Ji)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Wi&&(i=$i),i===void 0&&h===Ji&&(i=Zi),super(null,r,s,o,a,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Zt,this.minFilter=l!==void 0?l:Zt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Hl=new Pt,kl=new Bl(1,1);kl.compareFunction=Al;const Gl=new Pl,Vl=new ed,Wl=new Ol,Fo=[],zo=[],Bo=new Float32Array(16),Ho=new Float32Array(9),ko=new Float32Array(4);function ir(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Fo[r];if(s===void 0&&(s=new Float32Array(r),Fo[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function vt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function xt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function us(n,e){let t=zo[e];t===void 0&&(t=new Int32Array(e),zo[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function gp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function _p(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2fv(this.addr,e),xt(t,e)}}function vp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vt(t,e))return;n.uniform3fv(this.addr,e),xt(t,e)}}function xp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4fv(this.addr,e),xt(t,e)}}function Mp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,i))return;ko.set(i),n.uniformMatrix2fv(this.addr,!1,ko),xt(t,i)}}function Sp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,i))return;Ho.set(i),n.uniformMatrix3fv(this.addr,!1,Ho),xt(t,i)}}function yp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(vt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,i))return;Bo.set(i),n.uniformMatrix4fv(this.addr,!1,Bo),xt(t,i)}}function Ep(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Tp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2iv(this.addr,e),xt(t,e)}}function bp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3iv(this.addr,e),xt(t,e)}}function Ap(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4iv(this.addr,e),xt(t,e)}}function wp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Rp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;n.uniform2uiv(this.addr,e),xt(t,e)}}function Cp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;n.uniform3uiv(this.addr,e),xt(t,e)}}function Pp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;n.uniform4uiv(this.addr,e),xt(t,e)}}function Lp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);const s=this.type===n.SAMPLER_2D_SHADOW?kl:Hl;t.setTexture2D(e||s,r)}function Dp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Vl,r)}function Ip(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Wl,r)}function Up(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Gl,r)}function Np(n){switch(n){case 5126:return gp;case 35664:return _p;case 35665:return vp;case 35666:return xp;case 35674:return Mp;case 35675:return Sp;case 35676:return yp;case 5124:case 35670:return Ep;case 35667:case 35671:return Tp;case 35668:case 35672:return bp;case 35669:case 35673:return Ap;case 5125:return wp;case 36294:return Rp;case 36295:return Cp;case 36296:return Pp;case 35678:case 36198:case 36298:case 36306:case 35682:return Lp;case 35679:case 36299:case 36307:return Dp;case 35680:case 36300:case 36308:case 36293:return Ip;case 36289:case 36303:case 36311:case 36292:return Up}}function Op(n,e){n.uniform1fv(this.addr,e)}function Fp(n,e){const t=ir(e,this.size,2);n.uniform2fv(this.addr,t)}function zp(n,e){const t=ir(e,this.size,3);n.uniform3fv(this.addr,t)}function Bp(n,e){const t=ir(e,this.size,4);n.uniform4fv(this.addr,t)}function Hp(n,e){const t=ir(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function kp(n,e){const t=ir(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Gp(n,e){const t=ir(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Vp(n,e){n.uniform1iv(this.addr,e)}function Wp(n,e){n.uniform2iv(this.addr,e)}function Xp(n,e){n.uniform3iv(this.addr,e)}function qp(n,e){n.uniform4iv(this.addr,e)}function Yp(n,e){n.uniform1uiv(this.addr,e)}function Kp(n,e){n.uniform2uiv(this.addr,e)}function jp(n,e){n.uniform3uiv(this.addr,e)}function $p(n,e){n.uniform4uiv(this.addr,e)}function Zp(n,e,t){const i=this.cache,r=e.length,s=us(t,r);vt(i,s)||(n.uniform1iv(this.addr,s),xt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Hl,s[o])}function Jp(n,e,t){const i=this.cache,r=e.length,s=us(t,r);vt(i,s)||(n.uniform1iv(this.addr,s),xt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Vl,s[o])}function Qp(n,e,t){const i=this.cache,r=e.length,s=us(t,r);vt(i,s)||(n.uniform1iv(this.addr,s),xt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Wl,s[o])}function em(n,e,t){const i=this.cache,r=e.length,s=us(t,r);vt(i,s)||(n.uniform1iv(this.addr,s),xt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Gl,s[o])}function tm(n){switch(n){case 5126:return Op;case 35664:return Fp;case 35665:return zp;case 35666:return Bp;case 35674:return Hp;case 35675:return kp;case 35676:return Gp;case 5124:case 35670:return Vp;case 35667:case 35671:return Wp;case 35668:case 35672:return Xp;case 35669:case 35673:return qp;case 5125:return Yp;case 36294:return Kp;case 36295:return jp;case 36296:return $p;case 35678:case 36198:case 36298:case 36306:case 35682:return Zp;case 35679:case 36299:case 36307:return Jp;case 35680:case 36300:case 36308:case 36293:return Qp;case 36289:case 36303:case 36311:case 36292:return em}}class nm{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Np(t.type)}}class im{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=tm(t.type)}}class rm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Xs=/(\w+)(\])?(\[|\.)?/g;function Go(n,e){n.seq.push(e),n.map[e.id]=e}function sm(n,e,t){const i=n.name,r=i.length;for(Xs.lastIndex=0;;){const s=Xs.exec(i),o=Xs.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Go(t,c===void 0?new nm(a,n,e):new im(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new rm(a),Go(t,u)),t=u}}}class Zr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);sm(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function Vo(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const am=37297;let om=0;function lm(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}function cm(n){const e=st.getPrimaries(st.workingColorSpace),t=st.getPrimaries(n);let i;switch(e===t?i="":e===is&&t===ns?i="LinearDisplayP3ToLinearSRGB":e===ns&&t===is&&(i="LinearSRGBToLinearDisplayP3"),n){case Kn:case ls:return[i,"LinearTransferOETF"];case hn:case ua:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Wo(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+lm(n.getShaderSource(e),o)}else return r}function hm(n,e){const t=cm(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function dm(n,e){let t;switch(e){case rh:t="Linear";break;case sh:t="Reinhard";break;case ah:t="OptimizedCineon";break;case _l:t="ACESFilmic";break;case lh:t="AgX";break;case ch:t="Neutral";break;case oh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function um(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hr).join(`
`)}function fm(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function pm(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function hr(n){return n!==""}function Xo(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function qo(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const mm=/^[ \t]*#include +<([\w\d./]+)>/gm;function ra(n){return n.replace(mm,_m)}const gm=new Map;function _m(n,e){let t=Ye[e];if(t===void 0){const i=gm.get(e);if(i!==void 0)t=Ye[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ra(t)}const vm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yo(n){return n.replace(vm,xm)}function xm(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Ko(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Mm(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===pl?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===ml?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Tn&&(e="SHADOWMAP_TYPE_VSM"),e}function Sm(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Yi:case Ki:e="ENVMAP_TYPE_CUBE";break;case as:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ym(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ki:e="ENVMAP_MODE_REFRACTION";break}return e}function Em(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case gl:e="ENVMAP_BLENDING_MULTIPLY";break;case nh:e="ENVMAP_BLENDING_MIX";break;case ih:e="ENVMAP_BLENDING_ADD";break}return e}function Tm(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function bm(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Mm(t),c=Sm(t),h=ym(t),u=Em(t),f=Tm(t),m=um(t),_=fm(s),x=r.createProgram();let p,d,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(hr).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(hr).join(`
`),d.length>0&&(d+=`
`)):(p=[Ko(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hr).join(`
`),d=[Ko(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?Ye.tonemapping_pars_fragment:"",t.toneMapping!==Vn?dm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,hm("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hr).join(`
`)),o=ra(o),o=Xo(o,t),o=qo(o,t),a=ra(a),a=Xo(a,t),a=qo(a,t),o=Yo(o),a=Yo(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",t.glslVersion===co?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===co?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const E=A+p+o,T=A+d+a,L=Vo(r,r.VERTEX_SHADER,E),w=Vo(r,r.FRAGMENT_SHADER,T);r.attachShader(x,L),r.attachShader(x,w),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function R(C){if(n.debug.checkShaderErrors){const O=r.getProgramInfoLog(x).trim(),z=r.getShaderInfoLog(L).trim(),Y=r.getShaderInfoLog(w).trim();let j=!0,H=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(j=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,L,w);else{const J=Wo(r,L,"vertex"),W=Wo(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+O+`
`+J+`
`+W)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(z===""||Y==="")&&(H=!1);H&&(C.diagnostics={runnable:j,programLog:O,vertexShader:{log:z,prefix:p},fragmentShader:{log:Y,prefix:d}})}r.deleteShader(L),r.deleteShader(w),D=new Zr(r,x),y=pm(r,x)}let D;this.getUniforms=function(){return D===void 0&&R(this),D};let y;this.getAttributes=function(){return y===void 0&&R(this),y};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(x,am)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=om++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=L,this.fragmentShader=w,this}let Am=0;class wm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Rm(e),t.set(e,i)),i}}class Rm{constructor(e){this.id=Am++,this.code=e,this.usedTimes=0}}function Cm(n,e,t,i,r,s,o){const a=new pa,l=new wm,c=new Set,h=[],u=r.logarithmicDepthBuffer,f=r.vertexTextures;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return c.add(y),y===0?"uv":`uv${y}`}function p(y,M,C,O,z){const Y=O.fog,j=z.geometry,H=y.isMeshStandardMaterial?O.environment:null,J=(y.isMeshStandardMaterial?t:e).get(y.envMap||H),W=J&&J.mapping===as?J.image.height:null,oe=_[y.type];y.precision!==null&&(m=r.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const ue=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ce=ue!==void 0?ue.length:0;let ge=0;j.morphAttributes.position!==void 0&&(ge=1),j.morphAttributes.normal!==void 0&&(ge=2),j.morphAttributes.color!==void 0&&(ge=3);let ke,K,q,ee;if(oe){const Ve=dn[oe];ke=Ve.vertexShader,K=Ve.fragmentShader}else ke=y.vertexShader,K=y.fragmentShader,l.update(y),q=l.getVertexShaderID(y),ee=l.getFragmentShaderID(y);const re=n.getRenderTarget(),Se=z.isInstancedMesh===!0,Te=z.isBatchedMesh===!0,Ae=!!y.map,P=!!y.matcap,Le=!!J,Ue=!!y.aoMap,Re=!!y.lightMap,fe=!!y.bumpMap,De=!!y.normalMap,_e=!!y.displacementMap,pe=!!y.emissiveMap,Be=!!y.metalnessMap,b=!!y.roughnessMap,v=y.anisotropy>0,B=y.clearcoat>0,Z=y.dispersion>0,$=y.iridescence>0,Q=y.sheen>0,ve=y.transmission>0,se=v&&!!y.anisotropyMap,le=B&&!!y.clearcoatMap,Ce=B&&!!y.clearcoatNormalMap,ie=B&&!!y.clearcoatRoughnessMap,xe=$&&!!y.iridescenceMap,Ie=$&&!!y.iridescenceThicknessMap,ye=Q&&!!y.sheenColorMap,he=Q&&!!y.sheenRoughnessMap,Fe=!!y.specularMap,Ee=!!y.specularColorMap,qe=!!y.specularIntensityMap,g=ve&&!!y.transmissionMap,V=ve&&!!y.thicknessMap,F=!!y.gradientMap,X=!!y.alphaMap,te=y.alphaTest>0,we=!!y.alphaHash,Ne=!!y.extensions;let Je=Vn;y.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(Je=n.toneMapping);const Qe={shaderID:oe,shaderType:y.type,shaderName:y.name,vertexShader:ke,fragmentShader:K,defines:y.defines,customVertexShaderID:q,customFragmentShaderID:ee,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:Te,batchingColor:Te&&z._colorsTexture!==null,instancing:Se,instancingColor:Se&&z.instanceColor!==null,instancingMorph:Se&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:re===null?n.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Kn,alphaToCoverage:!!y.alphaToCoverage,map:Ae,matcap:P,envMap:Le,envMapMode:Le&&J.mapping,envMapCubeUVHeight:W,aoMap:Ue,lightMap:Re,bumpMap:fe,normalMap:De,displacementMap:f&&_e,emissiveMap:pe,normalMapObjectSpace:De&&y.normalMapType===Eh,normalMapTangentSpace:De&&y.normalMapType===bl,metalnessMap:Be,roughnessMap:b,anisotropy:v,anisotropyMap:se,clearcoat:B,clearcoatMap:le,clearcoatNormalMap:Ce,clearcoatRoughnessMap:ie,dispersion:Z,iridescence:$,iridescenceMap:xe,iridescenceThicknessMap:Ie,sheen:Q,sheenColorMap:ye,sheenRoughnessMap:he,specularMap:Fe,specularColorMap:Ee,specularIntensityMap:qe,transmission:ve,transmissionMap:g,thicknessMap:V,gradientMap:F,opaque:y.transparent===!1&&y.blending===Vi&&y.alphaToCoverage===!1,alphaMap:X,alphaTest:te,alphaHash:we,combine:y.combine,mapUv:Ae&&x(y.map.channel),aoMapUv:Ue&&x(y.aoMap.channel),lightMapUv:Re&&x(y.lightMap.channel),bumpMapUv:fe&&x(y.bumpMap.channel),normalMapUv:De&&x(y.normalMap.channel),displacementMapUv:_e&&x(y.displacementMap.channel),emissiveMapUv:pe&&x(y.emissiveMap.channel),metalnessMapUv:Be&&x(y.metalnessMap.channel),roughnessMapUv:b&&x(y.roughnessMap.channel),anisotropyMapUv:se&&x(y.anisotropyMap.channel),clearcoatMapUv:le&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:Ce&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:he&&x(y.sheenRoughnessMap.channel),specularMapUv:Fe&&x(y.specularMap.channel),specularColorMapUv:Ee&&x(y.specularColorMap.channel),specularIntensityMapUv:qe&&x(y.specularIntensityMap.channel),transmissionMapUv:g&&x(y.transmissionMap.channel),thicknessMapUv:V&&x(y.thicknessMap.channel),alphaMapUv:X&&x(y.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(De||v),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!j.attributes.uv&&(Ae||X),fog:!!Y,useFog:y.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:z.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:ge,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Je,decodeVideoTexture:Ae&&y.map.isVideoTexture===!0&&st.getTransfer(y.map.colorSpace)===ct,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===wn,flipSided:y.side===Ot,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ne&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Ne&&y.extensions.multiDraw===!0&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Qe.vertexUv1s=c.has(1),Qe.vertexUv2s=c.has(2),Qe.vertexUv3s=c.has(3),c.clear(),Qe}function d(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const C in y.defines)M.push(C),M.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(A(M,y),E(M,y),M.push(n.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function A(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function E(y,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.skinning&&a.enable(4),M.morphTargets&&a.enable(5),M.morphNormals&&a.enable(6),M.morphColors&&a.enable(7),M.premultipliedAlpha&&a.enable(8),M.shadowMapEnabled&&a.enable(9),M.doubleSided&&a.enable(10),M.flipSided&&a.enable(11),M.useDepthPacking&&a.enable(12),M.dithering&&a.enable(13),M.transmission&&a.enable(14),M.sheen&&a.enable(15),M.opaque&&a.enable(16),M.pointsUvs&&a.enable(17),M.decodeVideoTexture&&a.enable(18),M.alphaToCoverage&&a.enable(19),y.push(a.mask)}function T(y){const M=_[y.type];let C;if(M){const O=dn[M];C=ud.clone(O.uniforms)}else C=y.uniforms;return C}function L(y,M){let C;for(let O=0,z=h.length;O<z;O++){const Y=h[O];if(Y.cacheKey===M){C=Y,++C.usedTimes;break}}return C===void 0&&(C=new bm(n,M,y,s),h.push(C)),C}function w(y){if(--y.usedTimes===0){const M=h.indexOf(y);h[M]=h[h.length-1],h.pop(),y.destroy()}}function R(y){l.remove(y)}function D(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:T,acquireProgram:L,releaseProgram:w,releaseShaderCache:R,programs:h,dispose:D}}function Pm(){let n=new WeakMap;function e(s){let o=n.get(s);return o===void 0&&(o={},n.set(s,o)),o}function t(s){n.delete(s)}function i(s,o,a){n.get(s)[o]=a}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function Lm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function jo(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function $o(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(u,f,m,_,x,p){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:m,groupOrder:_,renderOrder:u.renderOrder,z:x,group:p},n[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=m,d.groupOrder=_,d.renderOrder=u.renderOrder,d.z=x,d.group=p),e++,d}function a(u,f,m,_,x,p){const d=o(u,f,m,_,x,p);m.transmission>0?i.push(d):m.transparent===!0?r.push(d):t.push(d)}function l(u,f,m,_,x,p){const d=o(u,f,m,_,x,p);m.transmission>0?i.unshift(d):m.transparent===!0?r.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||Lm),i.length>1&&i.sort(f||jo),r.length>1&&r.sort(f||jo)}function h(){for(let u=e,f=n.length;u<f;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:h,sort:c}}function Dm(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new $o,n.set(i,[o])):r>=s.length?(o=new $o,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Im(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new tt};break;case"SpotLight":t={position:new I,direction:new I,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function Um(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Nm=0;function Om(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Fm(n){const e=new Im,t=Um(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new I);const r=new I,s=new ft,o=new ft;function a(c){let h=0,u=0,f=0;for(let y=0;y<9;y++)i.probe[y].set(0,0,0);let m=0,_=0,x=0,p=0,d=0,A=0,E=0,T=0,L=0,w=0,R=0;c.sort(Om);for(let y=0,M=c.length;y<M;y++){const C=c[y],O=C.color,z=C.intensity,Y=C.distance,j=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=O.r*z,u+=O.g*z,f+=O.b*z;else if(C.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(C.sh.coefficients[H],z);R++}else if(C.isDirectionalLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const J=C.shadow,W=t.get(C);W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,i.directionalShadow[m]=W,i.directionalShadowMap[m]=j,i.directionalShadowMatrix[m]=C.shadow.matrix,A++}i.directional[m]=H,m++}else if(C.isSpotLight){const H=e.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(O).multiplyScalar(z),H.distance=Y,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,i.spot[x]=H;const J=C.shadow;if(C.map&&(i.spotLightMap[L]=C.map,L++,J.updateMatrices(C),C.castShadow&&w++),i.spotLightMatrix[x]=J.matrix,C.castShadow){const W=t.get(C);W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,i.spotShadow[x]=W,i.spotShadowMap[x]=j,T++}x++}else if(C.isRectAreaLight){const H=e.get(C);H.color.copy(O).multiplyScalar(z),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),i.rectArea[p]=H,p++}else if(C.isPointLight){const H=e.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const J=C.shadow,W=t.get(C);W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,W.shadowCameraNear=J.camera.near,W.shadowCameraFar=J.camera.far,i.pointShadow[_]=W,i.pointShadowMap[_]=j,i.pointShadowMatrix[_]=C.shadow.matrix,E++}i.point[_]=H,_++}else if(C.isHemisphereLight){const H=e.get(C);H.skyColor.copy(C.color).multiplyScalar(z),H.groundColor.copy(C.groundColor).multiplyScalar(z),i.hemi[d]=H,d++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Me.LTC_FLOAT_1,i.rectAreaLTC2=Me.LTC_FLOAT_2):(i.rectAreaLTC1=Me.LTC_HALF_1,i.rectAreaLTC2=Me.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const D=i.hash;(D.directionalLength!==m||D.pointLength!==_||D.spotLength!==x||D.rectAreaLength!==p||D.hemiLength!==d||D.numDirectionalShadows!==A||D.numPointShadows!==E||D.numSpotShadows!==T||D.numSpotMaps!==L||D.numLightProbes!==R)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=p,i.point.length=_,i.hemi.length=d,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=T+L-w,i.spotLightMap.length=L,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=R,D.directionalLength=m,D.pointLength=_,D.spotLength=x,D.rectAreaLength=p,D.hemiLength=d,D.numDirectionalShadows=A,D.numPointShadows=E,D.numSpotShadows=T,D.numSpotMaps=L,D.numLightProbes=R,i.version=Nm++)}function l(c,h){let u=0,f=0,m=0,_=0,x=0;const p=h.matrixWorldInverse;for(let d=0,A=c.length;d<A;d++){const E=c[d];if(E.isDirectionalLight){const T=i.directional[u];T.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),u++}else if(E.isSpotLight){const T=i.spot[m];T.position.setFromMatrixPosition(E.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),m++}else if(E.isRectAreaLight){const T=i.rectArea[_];T.position.setFromMatrixPosition(E.matrixWorld),T.position.applyMatrix4(p),o.identity(),s.copy(E.matrixWorld),s.premultiply(p),o.extractRotation(s),T.halfWidth.set(E.width*.5,0,0),T.halfHeight.set(0,E.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),_++}else if(E.isPointLight){const T=i.point[f];T.position.setFromMatrixPosition(E.matrixWorld),T.position.applyMatrix4(p),f++}else if(E.isHemisphereLight){const T=i.hemi[x];T.direction.setFromMatrixPosition(E.matrixWorld),T.direction.transformDirection(p),x++}}}return{setup:a,setupView:l,state:i}}function Zo(n){const e=new Fm(n),t=[],i=[];function r(h){c.camera=h,t.length=0,i.length=0}function s(h){t.push(h)}function o(h){i.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function zm(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Zo(n),e.set(r,[a])):s>=o.length?(a=new Zo(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}class Bm extends nr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Hm extends nr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const km=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Vm(n,e,t){let i=new ma;const r=new We,s=new We,o=new dt,a=new Bm({depthPacking:yh}),l=new Hm,c={},h=t.maxTextureSize,u={[Wn]:Ot,[Ot]:Wn,[wn]:wn},f=new qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:km,fragmentShader:Gm}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new jt;_.setAttribute("position",new Kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Xe(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pl;let d=this.type;this.render=function(w,R,D){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const y=n.getRenderTarget(),M=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),O=n.state;O.setBlending(Gn),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const z=d!==Tn&&this.type===Tn,Y=d===Tn&&this.type!==Tn;for(let j=0,H=w.length;j<H;j++){const J=w[j],W=J.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const oe=W.getFrameExtents();if(r.multiply(oe),s.copy(W.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/oe.x),r.x=s.x*oe.x,W.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/oe.y),r.y=s.y*oe.y,W.mapSize.y=s.y)),W.map===null||z===!0||Y===!0){const ce=this.type!==Tn?{minFilter:Zt,magFilter:Zt}:{};W.map!==null&&W.map.dispose(),W.map=new pi(r.x,r.y,ce),W.map.texture.name=J.name+".shadowMap",W.camera.updateProjectionMatrix()}n.setRenderTarget(W.map),n.clear();const ue=W.getViewportCount();for(let ce=0;ce<ue;ce++){const ge=W.getViewport(ce);o.set(s.x*ge.x,s.y*ge.y,s.x*ge.z,s.y*ge.w),O.viewport(o),W.updateMatrices(J,ce),i=W.getFrustum(),T(R,D,W.camera,J,this.type)}W.isPointLightShadow!==!0&&this.type===Tn&&A(W,D),W.needsUpdate=!1}d=this.type,p.needsUpdate=!1,n.setRenderTarget(y,M,C)};function A(w,R){const D=e.update(x);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new pi(r.x,r.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(R,null,D,f,x,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(R,null,D,m,x,null)}function E(w,R,D,y){let M=null;const C=D.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)M=C;else if(M=D.isPointLight===!0?l:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const O=M.uuid,z=R.uuid;let Y=c[O];Y===void 0&&(Y={},c[O]=Y);let j=Y[z];j===void 0&&(j=M.clone(),Y[z]=j,R.addEventListener("dispose",L)),M=j}if(M.visible=R.visible,M.wireframe=R.wireframe,y===Tn?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:u[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,D.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const O=n.properties.get(M);O.light=D}return M}function T(w,R,D,y,M){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Tn)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,w.matrixWorld);const z=e.update(w),Y=w.material;if(Array.isArray(Y)){const j=z.groups;for(let H=0,J=j.length;H<J;H++){const W=j[H],oe=Y[W.materialIndex];if(oe&&oe.visible){const ue=E(w,oe,y,M);w.onBeforeShadow(n,w,R,D,z,ue,W),n.renderBufferDirect(D,null,z,ue,w,W),w.onAfterShadow(n,w,R,D,z,ue,W)}}}else if(Y.visible){const j=E(w,Y,y,M);w.onBeforeShadow(n,w,R,D,z,j,null),n.renderBufferDirect(D,null,z,j,w,null),w.onAfterShadow(n,w,R,D,z,j,null)}}const O=w.children;for(let z=0,Y=O.length;z<Y;z++)T(O[z],R,D,y,M)}function L(w){w.target.removeEventListener("dispose",L);for(const D in c){const y=c[D],M=w.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}function Wm(n){function e(){let g=!1;const V=new dt;let F=null;const X=new dt(0,0,0,0);return{setMask:function(te){F!==te&&!g&&(n.colorMask(te,te,te,te),F=te)},setLocked:function(te){g=te},setClear:function(te,we,Ne,Je,Qe){Qe===!0&&(te*=Je,we*=Je,Ne*=Je),V.set(te,we,Ne,Je),X.equals(V)===!1&&(n.clearColor(te,we,Ne,Je),X.copy(V))},reset:function(){g=!1,F=null,X.set(-1,0,0,0)}}}function t(){let g=!1,V=null,F=null,X=null;return{setTest:function(te){te?ee(n.DEPTH_TEST):re(n.DEPTH_TEST)},setMask:function(te){V!==te&&!g&&(n.depthMask(te),V=te)},setFunc:function(te){if(F!==te){switch(te){case jc:n.depthFunc(n.NEVER);break;case $c:n.depthFunc(n.ALWAYS);break;case Zc:n.depthFunc(n.LESS);break;case Qr:n.depthFunc(n.LEQUAL);break;case Jc:n.depthFunc(n.EQUAL);break;case Qc:n.depthFunc(n.GEQUAL);break;case eh:n.depthFunc(n.GREATER);break;case th:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}F=te}},setLocked:function(te){g=te},setClear:function(te){X!==te&&(n.clearDepth(te),X=te)},reset:function(){g=!1,V=null,F=null,X=null}}}function i(){let g=!1,V=null,F=null,X=null,te=null,we=null,Ne=null,Je=null,Qe=null;return{setTest:function(Ve){g||(Ve?ee(n.STENCIL_TEST):re(n.STENCIL_TEST))},setMask:function(Ve){V!==Ve&&!g&&(n.stencilMask(Ve),V=Ve)},setFunc:function(Ve,et,rt){(F!==Ve||X!==et||te!==rt)&&(n.stencilFunc(Ve,et,rt),F=Ve,X=et,te=rt)},setOp:function(Ve,et,rt){(we!==Ve||Ne!==et||Je!==rt)&&(n.stencilOp(Ve,et,rt),we=Ve,Ne=et,Je=rt)},setLocked:function(Ve){g=Ve},setClear:function(Ve){Qe!==Ve&&(n.clearStencil(Ve),Qe=Ve)},reset:function(){g=!1,V=null,F=null,X=null,te=null,we=null,Ne=null,Je=null,Qe=null}}}const r=new e,s=new t,o=new i,a=new WeakMap,l=new WeakMap;let c={},h={},u=new WeakMap,f=[],m=null,_=!1,x=null,p=null,d=null,A=null,E=null,T=null,L=null,w=new tt(0,0,0),R=0,D=!1,y=null,M=null,C=null,O=null,z=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,H=0;const J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(J)[1]),j=H>=1):J.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),j=H>=2);let W=null,oe={};const ue=n.getParameter(n.SCISSOR_BOX),ce=n.getParameter(n.VIEWPORT),ge=new dt().fromArray(ue),ke=new dt().fromArray(ce);function K(g,V,F,X){const te=new Uint8Array(4),we=n.createTexture();n.bindTexture(g,we),n.texParameteri(g,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(g,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ne=0;Ne<F;Ne++)g===n.TEXTURE_3D||g===n.TEXTURE_2D_ARRAY?n.texImage3D(V,0,n.RGBA,1,1,X,0,n.RGBA,n.UNSIGNED_BYTE,te):n.texImage2D(V+Ne,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,te);return we}const q={};q[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),q[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),q[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),ee(n.DEPTH_TEST),s.setFunc(Qr),fe(!1),De(La),ee(n.CULL_FACE),Ue(Gn);function ee(g){c[g]!==!0&&(n.enable(g),c[g]=!0)}function re(g){c[g]!==!1&&(n.disable(g),c[g]=!1)}function Se(g,V){return h[g]!==V?(n.bindFramebuffer(g,V),h[g]=V,g===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=V),g===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=V),!0):!1}function Te(g,V){let F=f,X=!1;if(g){F=u.get(V),F===void 0&&(F=[],u.set(V,F));const te=g.textures;if(F.length!==te.length||F[0]!==n.COLOR_ATTACHMENT0){for(let we=0,Ne=te.length;we<Ne;we++)F[we]=n.COLOR_ATTACHMENT0+we;F.length=te.length,X=!0}}else F[0]!==n.BACK&&(F[0]=n.BACK,X=!0);X&&n.drawBuffers(F)}function Ae(g){return m!==g?(n.useProgram(g),m=g,!0):!1}const P={[oi]:n.FUNC_ADD,[Dc]:n.FUNC_SUBTRACT,[Ic]:n.FUNC_REVERSE_SUBTRACT};P[Uc]=n.MIN,P[Nc]=n.MAX;const Le={[Oc]:n.ZERO,[Fc]:n.ONE,[zc]:n.SRC_COLOR,[Zs]:n.SRC_ALPHA,[Wc]:n.SRC_ALPHA_SATURATE,[Gc]:n.DST_COLOR,[Hc]:n.DST_ALPHA,[Bc]:n.ONE_MINUS_SRC_COLOR,[Js]:n.ONE_MINUS_SRC_ALPHA,[Vc]:n.ONE_MINUS_DST_COLOR,[kc]:n.ONE_MINUS_DST_ALPHA,[Xc]:n.CONSTANT_COLOR,[qc]:n.ONE_MINUS_CONSTANT_COLOR,[Yc]:n.CONSTANT_ALPHA,[Kc]:n.ONE_MINUS_CONSTANT_ALPHA};function Ue(g,V,F,X,te,we,Ne,Je,Qe,Ve){if(g===Gn){_===!0&&(re(n.BLEND),_=!1);return}if(_===!1&&(ee(n.BLEND),_=!0),g!==Lc){if(g!==x||Ve!==D){if((p!==oi||E!==oi)&&(n.blendEquation(n.FUNC_ADD),p=oi,E=oi),Ve)switch(g){case Vi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Da:n.blendFunc(n.ONE,n.ONE);break;case Ia:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ua:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",g);break}else switch(g){case Vi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Da:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Ia:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ua:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",g);break}d=null,A=null,T=null,L=null,w.set(0,0,0),R=0,x=g,D=Ve}return}te=te||V,we=we||F,Ne=Ne||X,(V!==p||te!==E)&&(n.blendEquationSeparate(P[V],P[te]),p=V,E=te),(F!==d||X!==A||we!==T||Ne!==L)&&(n.blendFuncSeparate(Le[F],Le[X],Le[we],Le[Ne]),d=F,A=X,T=we,L=Ne),(Je.equals(w)===!1||Qe!==R)&&(n.blendColor(Je.r,Je.g,Je.b,Qe),w.copy(Je),R=Qe),x=g,D=!1}function Re(g,V){g.side===wn?re(n.CULL_FACE):ee(n.CULL_FACE);let F=g.side===Ot;V&&(F=!F),fe(F),g.blending===Vi&&g.transparent===!1?Ue(Gn):Ue(g.blending,g.blendEquation,g.blendSrc,g.blendDst,g.blendEquationAlpha,g.blendSrcAlpha,g.blendDstAlpha,g.blendColor,g.blendAlpha,g.premultipliedAlpha),s.setFunc(g.depthFunc),s.setTest(g.depthTest),s.setMask(g.depthWrite),r.setMask(g.colorWrite);const X=g.stencilWrite;o.setTest(X),X&&(o.setMask(g.stencilWriteMask),o.setFunc(g.stencilFunc,g.stencilRef,g.stencilFuncMask),o.setOp(g.stencilFail,g.stencilZFail,g.stencilZPass)),pe(g.polygonOffset,g.polygonOffsetFactor,g.polygonOffsetUnits),g.alphaToCoverage===!0?ee(n.SAMPLE_ALPHA_TO_COVERAGE):re(n.SAMPLE_ALPHA_TO_COVERAGE)}function fe(g){y!==g&&(g?n.frontFace(n.CW):n.frontFace(n.CCW),y=g)}function De(g){g!==Cc?(ee(n.CULL_FACE),g!==M&&(g===La?n.cullFace(n.BACK):g===Pc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):re(n.CULL_FACE),M=g}function _e(g){g!==C&&(j&&n.lineWidth(g),C=g)}function pe(g,V,F){g?(ee(n.POLYGON_OFFSET_FILL),(O!==V||z!==F)&&(n.polygonOffset(V,F),O=V,z=F)):re(n.POLYGON_OFFSET_FILL)}function Be(g){g?ee(n.SCISSOR_TEST):re(n.SCISSOR_TEST)}function b(g){g===void 0&&(g=n.TEXTURE0+Y-1),W!==g&&(n.activeTexture(g),W=g)}function v(g,V,F){F===void 0&&(W===null?F=n.TEXTURE0+Y-1:F=W);let X=oe[F];X===void 0&&(X={type:void 0,texture:void 0},oe[F]=X),(X.type!==g||X.texture!==V)&&(W!==F&&(n.activeTexture(F),W=F),n.bindTexture(g,V||q[g]),X.type=g,X.texture=V)}function B(){const g=oe[W];g!==void 0&&g.type!==void 0&&(n.bindTexture(g.type,null),g.type=void 0,g.texture=void 0)}function Z(){try{n.compressedTexImage2D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function $(){try{n.compressedTexImage3D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function Q(){try{n.texSubImage2D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function ve(){try{n.texSubImage3D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function se(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function le(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function Ce(){try{n.texStorage2D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function ie(){try{n.texStorage3D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function xe(){try{n.texImage2D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function Ie(){try{n.texImage3D.apply(n,arguments)}catch(g){console.error("THREE.WebGLState:",g)}}function ye(g){ge.equals(g)===!1&&(n.scissor(g.x,g.y,g.z,g.w),ge.copy(g))}function he(g){ke.equals(g)===!1&&(n.viewport(g.x,g.y,g.z,g.w),ke.copy(g))}function Fe(g,V){let F=l.get(V);F===void 0&&(F=new WeakMap,l.set(V,F));let X=F.get(g);X===void 0&&(X=n.getUniformBlockIndex(V,g.name),F.set(g,X))}function Ee(g,V){const X=l.get(V).get(g);a.get(V)!==X&&(n.uniformBlockBinding(V,X,g.__bindingPointIndex),a.set(V,X))}function qe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},W=null,oe={},h={},u=new WeakMap,f=[],m=null,_=!1,x=null,p=null,d=null,A=null,E=null,T=null,L=null,w=new tt(0,0,0),R=0,D=!1,y=null,M=null,C=null,O=null,z=null,ge.set(0,0,n.canvas.width,n.canvas.height),ke.set(0,0,n.canvas.width,n.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:ee,disable:re,bindFramebuffer:Se,drawBuffers:Te,useProgram:Ae,setBlending:Ue,setMaterial:Re,setFlipSided:fe,setCullFace:De,setLineWidth:_e,setPolygonOffset:pe,setScissorTest:Be,activeTexture:b,bindTexture:v,unbindTexture:B,compressedTexImage2D:Z,compressedTexImage3D:$,texImage2D:xe,texImage3D:Ie,updateUBOMapping:Fe,uniformBlockBinding:Ee,texStorage2D:Ce,texStorage3D:ie,texSubImage2D:Q,texSubImage3D:ve,compressedTexSubImage2D:se,compressedTexSubImage3D:le,scissor:ye,viewport:he,reset:qe}}function Xm(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new We,h=new WeakMap;let u;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(b,v){return m?new OffscreenCanvas(b,v):xr("canvas")}function x(b,v,B){let Z=1;const $=Be(b);if(($.width>B||$.height>B)&&(Z=B/Math.max($.width,$.height)),Z<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const Q=Math.floor(Z*$.width),ve=Math.floor(Z*$.height);u===void 0&&(u=_(Q,ve));const se=v?_(Q,ve):u;return se.width=Q,se.height=ve,se.getContext("2d").drawImage(b,0,0,Q,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+Q+"x"+ve+")."),se}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),b;return b}function p(b){return b.generateMipmaps&&b.minFilter!==Zt&&b.minFilter!==on}function d(b){n.generateMipmap(b)}function A(b,v,B,Z,$=!1){if(b!==null){if(n[b]!==void 0)return n[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let Q=v;if(v===n.RED&&(B===n.FLOAT&&(Q=n.R32F),B===n.HALF_FLOAT&&(Q=n.R16F),B===n.UNSIGNED_BYTE&&(Q=n.R8)),v===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.R8UI),B===n.UNSIGNED_SHORT&&(Q=n.R16UI),B===n.UNSIGNED_INT&&(Q=n.R32UI),B===n.BYTE&&(Q=n.R8I),B===n.SHORT&&(Q=n.R16I),B===n.INT&&(Q=n.R32I)),v===n.RG&&(B===n.FLOAT&&(Q=n.RG32F),B===n.HALF_FLOAT&&(Q=n.RG16F),B===n.UNSIGNED_BYTE&&(Q=n.RG8)),v===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(Q=n.RG8UI),B===n.UNSIGNED_SHORT&&(Q=n.RG16UI),B===n.UNSIGNED_INT&&(Q=n.RG32UI),B===n.BYTE&&(Q=n.RG8I),B===n.SHORT&&(Q=n.RG16I),B===n.INT&&(Q=n.RG32I)),v===n.RGB&&B===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),v===n.RGBA){const ve=$?ts:st.getTransfer(Z);B===n.FLOAT&&(Q=n.RGBA32F),B===n.HALF_FLOAT&&(Q=n.RGBA16F),B===n.UNSIGNED_BYTE&&(Q=ve===ct?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function E(b,v){let B;return b?v===null||v===$i||v===Zi?B=n.DEPTH24_STENCIL8:v===Hn?B=n.DEPTH32F_STENCIL8:v===es&&(B=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===$i||v===Zi?B=n.DEPTH_COMPONENT24:v===Hn?B=n.DEPTH_COMPONENT32F:v===es&&(B=n.DEPTH_COMPONENT16),B}function T(b,v){return p(b)===!0||b.isFramebufferTexture&&b.minFilter!==Zt&&b.minFilter!==on?Math.log2(Math.max(v.width,v.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?v.mipmaps.length:1}function L(b){const v=b.target;v.removeEventListener("dispose",L),R(v),v.isVideoTexture&&h.delete(v)}function w(b){const v=b.target;v.removeEventListener("dispose",w),y(v)}function R(b){const v=i.get(b);if(v.__webglInit===void 0)return;const B=b.source,Z=f.get(B);if(Z){const $=Z[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&D(b),Object.keys(Z).length===0&&f.delete(B)}i.remove(b)}function D(b){const v=i.get(b);n.deleteTexture(v.__webglTexture);const B=b.source,Z=f.get(B);delete Z[v.__cacheKey],o.memory.textures--}function y(b){const v=i.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(v.__webglFramebuffer[Z]))for(let $=0;$<v.__webglFramebuffer[Z].length;$++)n.deleteFramebuffer(v.__webglFramebuffer[Z][$]);else n.deleteFramebuffer(v.__webglFramebuffer[Z]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[Z])}else{if(Array.isArray(v.__webglFramebuffer))for(let Z=0;Z<v.__webglFramebuffer.length;Z++)n.deleteFramebuffer(v.__webglFramebuffer[Z]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Z=0;Z<v.__webglColorRenderbuffer.length;Z++)v.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[Z]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const B=b.textures;for(let Z=0,$=B.length;Z<$;Z++){const Q=i.get(B[Z]);Q.__webglTexture&&(n.deleteTexture(Q.__webglTexture),o.memory.textures--),i.remove(B[Z])}i.remove(b)}let M=0;function C(){M=0}function O(){const b=M;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),M+=1,b}function z(b){const v=[];return v.push(b.wrapS),v.push(b.wrapT),v.push(b.wrapR||0),v.push(b.magFilter),v.push(b.minFilter),v.push(b.anisotropy),v.push(b.internalFormat),v.push(b.format),v.push(b.type),v.push(b.generateMipmaps),v.push(b.premultiplyAlpha),v.push(b.flipY),v.push(b.unpackAlignment),v.push(b.colorSpace),v.join()}function Y(b,v){const B=i.get(b);if(b.isVideoTexture&&_e(b),b.isRenderTargetTexture===!1&&b.version>0&&B.__version!==b.version){const Z=b.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ke(B,b,v);return}}t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+v)}function j(b,v){const B=i.get(b);if(b.version>0&&B.__version!==b.version){ke(B,b,v);return}t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+v)}function H(b,v){const B=i.get(b);if(b.version>0&&B.__version!==b.version){ke(B,b,v);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+v)}function J(b,v){const B=i.get(b);if(b.version>0&&B.__version!==b.version){K(B,b,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+v)}const W={[ji]:n.REPEAT,[ci]:n.CLAMP_TO_EDGE,[ta]:n.MIRRORED_REPEAT},oe={[Zt]:n.NEAREST,[hh]:n.NEAREST_MIPMAP_NEAREST,[br]:n.NEAREST_MIPMAP_LINEAR,[on]:n.LINEAR,[gs]:n.LINEAR_MIPMAP_NEAREST,[hi]:n.LINEAR_MIPMAP_LINEAR},ue={[Th]:n.NEVER,[Ph]:n.ALWAYS,[bh]:n.LESS,[Al]:n.LEQUAL,[Ah]:n.EQUAL,[Ch]:n.GEQUAL,[wh]:n.GREATER,[Rh]:n.NOTEQUAL};function ce(b,v){if(v.type===Hn&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===on||v.magFilter===gs||v.magFilter===br||v.magFilter===hi||v.minFilter===on||v.minFilter===gs||v.minFilter===br||v.minFilter===hi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(b,n.TEXTURE_WRAP_S,W[v.wrapS]),n.texParameteri(b,n.TEXTURE_WRAP_T,W[v.wrapT]),(b===n.TEXTURE_3D||b===n.TEXTURE_2D_ARRAY)&&n.texParameteri(b,n.TEXTURE_WRAP_R,W[v.wrapR]),n.texParameteri(b,n.TEXTURE_MAG_FILTER,oe[v.magFilter]),n.texParameteri(b,n.TEXTURE_MIN_FILTER,oe[v.minFilter]),v.compareFunction&&(n.texParameteri(b,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(b,n.TEXTURE_COMPARE_FUNC,ue[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Zt||v.minFilter!==br&&v.minFilter!==hi||v.type===Hn&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(b,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function ge(b,v){let B=!1;b.__webglInit===void 0&&(b.__webglInit=!0,v.addEventListener("dispose",L));const Z=v.source;let $=f.get(Z);$===void 0&&($={},f.set(Z,$));const Q=z(v);if(Q!==b.__cacheKey){$[Q]===void 0&&($[Q]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,B=!0),$[Q].usedTimes++;const ve=$[b.__cacheKey];ve!==void 0&&($[b.__cacheKey].usedTimes--,ve.usedTimes===0&&D(v)),b.__cacheKey=Q,b.__webglTexture=$[Q].texture}return B}function ke(b,v,B){let Z=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Z=n.TEXTURE_3D);const $=ge(b,v),Q=v.source;t.bindTexture(Z,b.__webglTexture,n.TEXTURE0+B);const ve=i.get(Q);if(Q.version!==ve.__version||$===!0){t.activeTexture(n.TEXTURE0+B);const se=st.getPrimaries(st.workingColorSpace),le=v.colorSpace===Bn?null:st.getPrimaries(v.colorSpace),Ce=v.colorSpace===Bn||se===le?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let ie=x(v.image,!1,r.maxTextureSize);ie=pe(v,ie);const xe=s.convert(v.format,v.colorSpace),Ie=s.convert(v.type);let ye=A(v.internalFormat,xe,Ie,v.colorSpace,v.isVideoTexture);ce(Z,v);let he;const Fe=v.mipmaps,Ee=v.isVideoTexture!==!0,qe=ve.__version===void 0||$===!0,g=Q.dataReady,V=T(v,ie);if(v.isDepthTexture)ye=E(v.format===Ji,v.type),qe&&(Ee?t.texStorage2D(n.TEXTURE_2D,1,ye,ie.width,ie.height):t.texImage2D(n.TEXTURE_2D,0,ye,ie.width,ie.height,0,xe,Ie,null));else if(v.isDataTexture)if(Fe.length>0){Ee&&qe&&t.texStorage2D(n.TEXTURE_2D,V,ye,Fe[0].width,Fe[0].height);for(let F=0,X=Fe.length;F<X;F++)he=Fe[F],Ee?g&&t.texSubImage2D(n.TEXTURE_2D,F,0,0,he.width,he.height,xe,Ie,he.data):t.texImage2D(n.TEXTURE_2D,F,ye,he.width,he.height,0,xe,Ie,he.data);v.generateMipmaps=!1}else Ee?(qe&&t.texStorage2D(n.TEXTURE_2D,V,ye,ie.width,ie.height),g&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ie.width,ie.height,xe,Ie,ie.data)):t.texImage2D(n.TEXTURE_2D,0,ye,ie.width,ie.height,0,xe,Ie,ie.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ee&&qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,V,ye,Fe[0].width,Fe[0].height,ie.depth);for(let F=0,X=Fe.length;F<X;F++)if(he=Fe[F],v.format!==fn)if(xe!==null)if(Ee){if(g)if(v.layerUpdates.size>0){for(const te of v.layerUpdates){const we=he.width*he.height;t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,F,0,0,te,he.width,he.height,1,xe,he.data.slice(we*te,we*(te+1)),0,0)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,F,0,0,0,he.width,he.height,ie.depth,xe,he.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,F,ye,he.width,he.height,ie.depth,0,he.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ee?g&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,F,0,0,0,he.width,he.height,ie.depth,xe,Ie,he.data):t.texImage3D(n.TEXTURE_2D_ARRAY,F,ye,he.width,he.height,ie.depth,0,xe,Ie,he.data)}else{Ee&&qe&&t.texStorage2D(n.TEXTURE_2D,V,ye,Fe[0].width,Fe[0].height);for(let F=0,X=Fe.length;F<X;F++)he=Fe[F],v.format!==fn?xe!==null?Ee?g&&t.compressedTexSubImage2D(n.TEXTURE_2D,F,0,0,he.width,he.height,xe,he.data):t.compressedTexImage2D(n.TEXTURE_2D,F,ye,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ee?g&&t.texSubImage2D(n.TEXTURE_2D,F,0,0,he.width,he.height,xe,Ie,he.data):t.texImage2D(n.TEXTURE_2D,F,ye,he.width,he.height,0,xe,Ie,he.data)}else if(v.isDataArrayTexture)if(Ee){if(qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,V,ye,ie.width,ie.height,ie.depth),g)if(v.layerUpdates.size>0){let F;switch(Ie){case n.UNSIGNED_BYTE:switch(xe){case n.ALPHA:F=1;break;case n.LUMINANCE:F=1;break;case n.LUMINANCE_ALPHA:F=2;break;case n.RGB:F=3;break;case n.RGBA:F=4;break;default:throw new Error(`Unknown texel size for format ${xe}.`)}break;case n.UNSIGNED_SHORT_4_4_4_4:case n.UNSIGNED_SHORT_5_5_5_1:case n.UNSIGNED_SHORT_5_6_5:F=1;break;default:throw new Error(`Unknown texel size for type ${Ie}.`)}const X=ie.width*ie.height*F;for(const te of v.layerUpdates)t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,te,ie.width,ie.height,1,xe,Ie,ie.data.slice(X*te,X*(te+1)));v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,xe,Ie,ie.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ye,ie.width,ie.height,ie.depth,0,xe,Ie,ie.data);else if(v.isData3DTexture)Ee?(qe&&t.texStorage3D(n.TEXTURE_3D,V,ye,ie.width,ie.height,ie.depth),g&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,xe,Ie,ie.data)):t.texImage3D(n.TEXTURE_3D,0,ye,ie.width,ie.height,ie.depth,0,xe,Ie,ie.data);else if(v.isFramebufferTexture){if(qe)if(Ee)t.texStorage2D(n.TEXTURE_2D,V,ye,ie.width,ie.height);else{let F=ie.width,X=ie.height;for(let te=0;te<V;te++)t.texImage2D(n.TEXTURE_2D,te,ye,F,X,0,xe,Ie,null),F>>=1,X>>=1}}else if(Fe.length>0){if(Ee&&qe){const F=Be(Fe[0]);t.texStorage2D(n.TEXTURE_2D,V,ye,F.width,F.height)}for(let F=0,X=Fe.length;F<X;F++)he=Fe[F],Ee?g&&t.texSubImage2D(n.TEXTURE_2D,F,0,0,xe,Ie,he):t.texImage2D(n.TEXTURE_2D,F,ye,xe,Ie,he);v.generateMipmaps=!1}else if(Ee){if(qe){const F=Be(ie);t.texStorage2D(n.TEXTURE_2D,V,ye,F.width,F.height)}g&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,xe,Ie,ie)}else t.texImage2D(n.TEXTURE_2D,0,ye,xe,Ie,ie);p(v)&&d(Z),ve.__version=Q.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function K(b,v,B){if(v.image.length!==6)return;const Z=ge(b,v),$=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,b.__webglTexture,n.TEXTURE0+B);const Q=i.get($);if($.version!==Q.__version||Z===!0){t.activeTexture(n.TEXTURE0+B);const ve=st.getPrimaries(st.workingColorSpace),se=v.colorSpace===Bn?null:st.getPrimaries(v.colorSpace),le=v.colorSpace===Bn||ve===se?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);const Ce=v.isCompressedTexture||v.image[0].isCompressedTexture,ie=v.image[0]&&v.image[0].isDataTexture,xe=[];for(let X=0;X<6;X++)!Ce&&!ie?xe[X]=x(v.image[X],!0,r.maxCubemapSize):xe[X]=ie?v.image[X].image:v.image[X],xe[X]=pe(v,xe[X]);const Ie=xe[0],ye=s.convert(v.format,v.colorSpace),he=s.convert(v.type),Fe=A(v.internalFormat,ye,he,v.colorSpace),Ee=v.isVideoTexture!==!0,qe=Q.__version===void 0||Z===!0,g=$.dataReady;let V=T(v,Ie);ce(n.TEXTURE_CUBE_MAP,v);let F;if(Ce){Ee&&qe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,V,Fe,Ie.width,Ie.height);for(let X=0;X<6;X++){F=xe[X].mipmaps;for(let te=0;te<F.length;te++){const we=F[te];v.format!==fn?ye!==null?Ee?g&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,0,0,we.width,we.height,ye,we.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,Fe,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ee?g&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,0,0,we.width,we.height,ye,he,we.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te,Fe,we.width,we.height,0,ye,he,we.data)}}}else{if(F=v.mipmaps,Ee&&qe){F.length>0&&V++;const X=Be(xe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,V,Fe,X.width,X.height)}for(let X=0;X<6;X++)if(ie){Ee?g&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,xe[X].width,xe[X].height,ye,he,xe[X].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,Fe,xe[X].width,xe[X].height,0,ye,he,xe[X].data);for(let te=0;te<F.length;te++){const Ne=F[te].image[X].image;Ee?g&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,0,0,Ne.width,Ne.height,ye,he,Ne.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,Fe,Ne.width,Ne.height,0,ye,he,Ne.data)}}else{Ee?g&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,ye,he,xe[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,Fe,ye,he,xe[X]);for(let te=0;te<F.length;te++){const we=F[te];Ee?g&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,0,0,ye,he,we.image[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,te+1,Fe,ye,he,we.image[X])}}}p(v)&&d(n.TEXTURE_CUBE_MAP),Q.__version=$.version,v.onUpdate&&v.onUpdate(v)}b.__version=v.version}function q(b,v,B,Z,$,Q){const ve=s.convert(B.format,B.colorSpace),se=s.convert(B.type),le=A(B.internalFormat,ve,se,B.colorSpace);if(!i.get(v).__hasExternalTextures){const ie=Math.max(1,v.width>>Q),xe=Math.max(1,v.height>>Q);$===n.TEXTURE_3D||$===n.TEXTURE_2D_ARRAY?t.texImage3D($,Q,le,ie,xe,v.depth,0,ve,se,null):t.texImage2D($,Q,le,ie,xe,0,ve,se,null)}t.bindFramebuffer(n.FRAMEBUFFER,b),De(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,$,i.get(B).__webglTexture,0,fe(v)):($===n.TEXTURE_2D||$>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,$,i.get(B).__webglTexture,Q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ee(b,v,B){if(n.bindRenderbuffer(n.RENDERBUFFER,b),v.depthBuffer){const Z=v.depthTexture,$=Z&&Z.isDepthTexture?Z.type:null,Q=E(v.stencilBuffer,$),ve=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,se=fe(v);De(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,se,Q,v.width,v.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,se,Q,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,Q,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ve,n.RENDERBUFFER,b)}else{const Z=v.textures;for(let $=0;$<Z.length;$++){const Q=Z[$],ve=s.convert(Q.format,Q.colorSpace),se=s.convert(Q.type),le=A(Q.internalFormat,ve,se,Q.colorSpace),Ce=fe(v);B&&De(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,le,v.width,v.height):De(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ce,le,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,le,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function re(b,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,b),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(v.depthTexture).__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),Y(v.depthTexture,0);const Z=i.get(v.depthTexture).__webglTexture,$=fe(v);if(v.depthTexture.format===Wi)De(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Z,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Z,0);else if(v.depthTexture.format===Ji)De(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Z,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Se(b){const v=i.get(b),B=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!v.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");re(v.__webglFramebuffer,b)}else if(B){v.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[Z]),v.__webglDepthbuffer[Z]=n.createRenderbuffer(),ee(v.__webglDepthbuffer[Z],b,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer=n.createRenderbuffer(),ee(v.__webglDepthbuffer,b,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Te(b,v,B){const Z=i.get(b);v!==void 0&&q(Z.__webglFramebuffer,b,b.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&Se(b)}function Ae(b){const v=b.texture,B=i.get(b),Z=i.get(v);b.addEventListener("dispose",w);const $=b.textures,Q=b.isWebGLCubeRenderTarget===!0,ve=$.length>1;if(ve||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=v.version,o.memory.textures++),Q){B.__webglFramebuffer=[];for(let se=0;se<6;se++)if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer[se]=[];for(let le=0;le<v.mipmaps.length;le++)B.__webglFramebuffer[se][le]=n.createFramebuffer()}else B.__webglFramebuffer[se]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){B.__webglFramebuffer=[];for(let se=0;se<v.mipmaps.length;se++)B.__webglFramebuffer[se]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(ve)for(let se=0,le=$.length;se<le;se++){const Ce=i.get($[se]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),o.memory.textures++)}if(b.samples>0&&De(b)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let se=0;se<$.length;se++){const le=$[se];B.__webglColorRenderbuffer[se]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[se]);const Ce=s.convert(le.format,le.colorSpace),ie=s.convert(le.type),xe=A(le.internalFormat,Ce,ie,le.colorSpace,b.isXRRenderTarget===!0),Ie=fe(b);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ie,xe,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+se,n.RENDERBUFFER,B.__webglColorRenderbuffer[se])}n.bindRenderbuffer(n.RENDERBUFFER,null),b.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),ee(B.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Q){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),ce(n.TEXTURE_CUBE_MAP,v);for(let se=0;se<6;se++)if(v.mipmaps&&v.mipmaps.length>0)for(let le=0;le<v.mipmaps.length;le++)q(B.__webglFramebuffer[se][le],b,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+se,le);else q(B.__webglFramebuffer[se],b,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+se,0);p(v)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let se=0,le=$.length;se<le;se++){const Ce=$[se],ie=i.get(Ce);t.bindTexture(n.TEXTURE_2D,ie.__webglTexture),ce(n.TEXTURE_2D,Ce),q(B.__webglFramebuffer,b,Ce,n.COLOR_ATTACHMENT0+se,n.TEXTURE_2D,0),p(Ce)&&d(n.TEXTURE_2D)}t.unbindTexture()}else{let se=n.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(se=b.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(se,Z.__webglTexture),ce(se,v),v.mipmaps&&v.mipmaps.length>0)for(let le=0;le<v.mipmaps.length;le++)q(B.__webglFramebuffer[le],b,v,n.COLOR_ATTACHMENT0,se,le);else q(B.__webglFramebuffer,b,v,n.COLOR_ATTACHMENT0,se,0);p(v)&&d(se),t.unbindTexture()}b.depthBuffer&&Se(b)}function P(b){const v=b.textures;for(let B=0,Z=v.length;B<Z;B++){const $=v[B];if(p($)){const Q=b.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,ve=i.get($).__webglTexture;t.bindTexture(Q,ve),d(Q),t.unbindTexture()}}}const Le=[],Ue=[];function Re(b){if(b.samples>0){if(De(b)===!1){const v=b.textures,B=b.width,Z=b.height;let $=n.COLOR_BUFFER_BIT;const Q=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ve=i.get(b),se=v.length>1;if(se)for(let le=0;le<v.length;le++)t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let le=0;le<v.length;le++){if(b.resolveDepthBuffer&&(b.depthBuffer&&($|=n.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&($|=n.STENCIL_BUFFER_BIT)),se){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ve.__webglColorRenderbuffer[le]);const Ce=i.get(v[le]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ce,0)}n.blitFramebuffer(0,0,B,Z,0,0,B,Z,$,n.NEAREST),l===!0&&(Le.length=0,Ue.length=0,Le.push(n.COLOR_ATTACHMENT0+le),b.depthBuffer&&b.resolveDepthBuffer===!1&&(Le.push(Q),Ue.push(Q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ue)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Le))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),se)for(let le=0;le<v.length;le++){t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.RENDERBUFFER,ve.__webglColorRenderbuffer[le]);const Ce=i.get(v[le]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.TEXTURE_2D,Ce,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const v=b.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function fe(b){return Math.min(r.maxSamples,b.samples)}function De(b){const v=i.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function _e(b){const v=o.render.frame;h.get(b)!==v&&(h.set(b,v),b.update())}function pe(b,v){const B=b.colorSpace,Z=b.format,$=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||B!==Kn&&B!==Bn&&(st.getTransfer(B)===ct?(Z!==fn||$!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),v}function Be(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=C,this.setTexture2D=Y,this.setTexture2DArray=j,this.setTexture3D=H,this.setTextureCube=J,this.rebindTextures=Te,this.setupRenderTarget=Ae,this.updateRenderTargetMipmap=P,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=q,this.useMultisampledRTT=De}function qm(n,e){function t(i,r=Bn){let s;const o=st.getTransfer(r);if(i===Xn)return n.UNSIGNED_BYTE;if(i===Ml)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Sl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===fh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===dh)return n.BYTE;if(i===uh)return n.SHORT;if(i===es)return n.UNSIGNED_SHORT;if(i===xl)return n.INT;if(i===$i)return n.UNSIGNED_INT;if(i===Hn)return n.FLOAT;if(i===os)return n.HALF_FLOAT;if(i===ph)return n.ALPHA;if(i===mh)return n.RGB;if(i===fn)return n.RGBA;if(i===gh)return n.LUMINANCE;if(i===_h)return n.LUMINANCE_ALPHA;if(i===Wi)return n.DEPTH_COMPONENT;if(i===Ji)return n.DEPTH_STENCIL;if(i===vh)return n.RED;if(i===yl)return n.RED_INTEGER;if(i===xh)return n.RG;if(i===El)return n.RG_INTEGER;if(i===Tl)return n.RGBA_INTEGER;if(i===_s||i===vs||i===xs||i===Ms)if(o===ct)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===_s)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===vs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===xs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ms)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===_s)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===vs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===xs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ms)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Na||i===Oa||i===Fa||i===za)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Na)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Oa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Fa)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===za)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ba||i===Ha||i===ka)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ba||i===Ha)return o===ct?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===ka)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ga||i===Va||i===Wa||i===Xa||i===qa||i===Ya||i===Ka||i===ja||i===$a||i===Za||i===Ja||i===Qa||i===eo||i===to)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ga)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Va)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Wa)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Xa)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===qa)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ya)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ka)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ja)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===$a)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Za)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ja)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Qa)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===eo)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===to)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ss||i===no||i===io)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Ss)return o===ct?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===no)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===io)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Mh||i===ro||i===so||i===ao)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ss)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ro)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===so)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ao)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Zi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class Ym extends Xt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class dr extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Km={type:"move"};class qs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new dr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new dr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new dr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,i),d=this._getHandJoint(c,x);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),m=.02,_=.005;c.inputState.pinching&&f>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Km)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new dr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const jm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,$m=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Zm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new Pt,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new qn({vertexShader:jm,fragmentShader:$m,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Xe(new ds(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class Jm extends vi{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,m=null,_=null;const x=new Zm,p=t.getContextAttributes();let d=null,A=null;const E=[],T=[],L=new We;let w=null;const R=new Xt;R.layers.enable(1),R.viewport=new dt;const D=new Xt;D.layers.enable(2),D.viewport=new dt;const y=[R,D],M=new Ym;M.layers.enable(1),M.layers.enable(2);let C=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let q=E[K];return q===void 0&&(q=new qs,E[K]=q),q.getTargetRaySpace()},this.getControllerGrip=function(K){let q=E[K];return q===void 0&&(q=new qs,E[K]=q),q.getGripSpace()},this.getHand=function(K){let q=E[K];return q===void 0&&(q=new qs,E[K]=q),q.getHandSpace()};function z(K){const q=T.indexOf(K.inputSource);if(q===-1)return;const ee=E[q];ee!==void 0&&(ee.update(K.inputSource,K.frame,c||o),ee.dispatchEvent({type:K.type,data:K.inputSource}))}function Y(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",Y),r.removeEventListener("inputsourceschange",j);for(let K=0;K<E.length;K++){const q=T[K];q!==null&&(T[K]=null,E[K].disconnect(q))}C=null,O=null,x.reset(),e.setRenderTarget(d),m=null,f=null,u=null,r=null,A=null,ke.stop(),i.isPresenting=!1,e.setPixelRatio(w),e.setSize(L.width,L.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",Y),r.addEventListener("inputsourceschange",j),p.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(L),r.renderState.layers===void 0){const q={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,q),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),A=new pi(m.framebufferWidth,m.framebufferHeight,{format:fn,type:Xn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let q=null,ee=null,re=null;p.depth&&(re=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,q=p.stencil?Ji:Wi,ee=p.stencil?Zi:$i);const Se={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:s};u=new XRWebGLBinding(r,t),f=u.createProjectionLayer(Se),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),A=new pi(f.textureWidth,f.textureHeight,{format:fn,type:Xn,depthTexture:new Bl(f.textureWidth,f.textureHeight,ee,void 0,void 0,void 0,void 0,void 0,void 0,q),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),ke.setContext(r),ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function j(K){for(let q=0;q<K.removed.length;q++){const ee=K.removed[q],re=T.indexOf(ee);re>=0&&(T[re]=null,E[re].disconnect(ee))}for(let q=0;q<K.added.length;q++){const ee=K.added[q];let re=T.indexOf(ee);if(re===-1){for(let Te=0;Te<E.length;Te++)if(Te>=T.length){T.push(ee),re=Te;break}else if(T[Te]===null){T[Te]=ee,re=Te;break}if(re===-1)break}const Se=E[re];Se&&Se.connect(ee)}}const H=new I,J=new I;function W(K,q,ee){H.setFromMatrixPosition(q.matrixWorld),J.setFromMatrixPosition(ee.matrixWorld);const re=H.distanceTo(J),Se=q.projectionMatrix.elements,Te=ee.projectionMatrix.elements,Ae=Se[14]/(Se[10]-1),P=Se[14]/(Se[10]+1),Le=(Se[9]+1)/Se[5],Ue=(Se[9]-1)/Se[5],Re=(Se[8]-1)/Se[0],fe=(Te[8]+1)/Te[0],De=Ae*Re,_e=Ae*fe,pe=re/(-Re+fe),Be=pe*-Re;q.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Be),K.translateZ(pe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert();const b=Ae+pe,v=P+pe,B=De-Be,Z=_e+(re-Be),$=Le*P/v*b,Q=Ue*P/v*b;K.projectionMatrix.makePerspective(B,Z,$,Q,b,v),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}function oe(K,q){q===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(q.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;x.texture!==null&&(K.near=x.depthNear,K.far=x.depthFar),M.near=D.near=R.near=K.near,M.far=D.far=R.far=K.far,(C!==M.near||O!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,O=M.far,R.near=C,R.far=O,D.near=C,D.far=O,R.updateProjectionMatrix(),D.updateProjectionMatrix(),K.updateProjectionMatrix());const q=K.parent,ee=M.cameras;oe(M,q);for(let re=0;re<ee.length;re++)oe(ee[re],q);ee.length===2?W(M,R,D):M.projectionMatrix.copy(R.projectionMatrix),ue(K,M,q)};function ue(K,q,ee){ee===null?K.matrix.copy(q.matrixWorld):(K.matrix.copy(ee.matrixWorld),K.matrix.invert(),K.matrix.multiply(q.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(q.projectionMatrix),K.projectionMatrixInverse.copy(q.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=vr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(K){l=K,f!==null&&(f.fixedFoveation=K),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=K)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(M)};let ce=null;function ge(K,q){if(h=q.getViewerPose(c||o),_=q,h!==null){const ee=h.views;m!==null&&(e.setRenderTargetFramebuffer(A,m.framebuffer),e.setRenderTarget(A));let re=!1;ee.length!==M.cameras.length&&(M.cameras.length=0,re=!0);for(let Te=0;Te<ee.length;Te++){const Ae=ee[Te];let P=null;if(m!==null)P=m.getViewport(Ae);else{const Ue=u.getViewSubImage(f,Ae);P=Ue.viewport,Te===0&&(e.setRenderTargetTextures(A,Ue.colorTexture,f.ignoreDepthValues?void 0:Ue.depthStencilTexture),e.setRenderTarget(A))}let Le=y[Te];Le===void 0&&(Le=new Xt,Le.layers.enable(Te),Le.viewport=new dt,y[Te]=Le),Le.matrix.fromArray(Ae.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(Ae.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(P.x,P.y,P.width,P.height),Te===0&&(M.matrix.copy(Le.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),re===!0&&M.cameras.push(Le)}const Se=r.enabledFeatures;if(Se&&Se.includes("depth-sensing")){const Te=u.getDepthInformation(ee[0]);Te&&Te.isValid&&Te.texture&&x.init(e,Te,r.renderState)}}for(let ee=0;ee<E.length;ee++){const re=T[ee],Se=E[ee];re!==null&&Se!==void 0&&Se.update(re,q,c||o)}ce&&ce(K,q),q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:q}),_=null}const ke=new Fl;ke.setAnimationLoop(ge),this.setAnimationLoop=function(K){ce=K},this.dispose=function(){}}}const ni=new pn,Qm=new ft;function eg(n,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,Ul(n)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function r(p,d,A,E,T){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(p,d):d.isMeshToonMaterial?(s(p,d),u(p,d)):d.isMeshPhongMaterial?(s(p,d),h(p,d)):d.isMeshStandardMaterial?(s(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,T)):d.isMeshMatcapMaterial?(s(p,d),_(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),x(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(o(p,d),d.isLineDashedMaterial&&a(p,d)):d.isPointsMaterial?l(p,d,A,E):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Ot&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Ot&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const A=e.get(d),E=A.envMap,T=A.envMapRotation;E&&(p.envMap.value=E,ni.copy(T),ni.x*=-1,ni.y*=-1,ni.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ni.y*=-1,ni.z*=-1),p.envMapRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(ni)),p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function o(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,A,E){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*A,p.scale.value=E*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function u(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,A){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ot&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,d){d.matcap&&(p.matcap.value=d.matcap)}function x(p,d){const A=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function tg(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,E){const T=E.program;i.uniformBlockBinding(A,T)}function c(A,E){let T=r[A.id];T===void 0&&(_(A),T=h(A),r[A.id]=T,A.addEventListener("dispose",p));const L=E.program;i.updateUBOMapping(A,L);const w=e.render.frame;s[A.id]!==w&&(f(A),s[A.id]=w)}function h(A){const E=u();A.__bindingPointIndex=E;const T=n.createBuffer(),L=A.__size,w=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,L,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,E,T),T}function u(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const E=r[A.id],T=A.uniforms,L=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,E);for(let w=0,R=T.length;w<R;w++){const D=Array.isArray(T[w])?T[w]:[T[w]];for(let y=0,M=D.length;y<M;y++){const C=D[y];if(m(C,w,y,L)===!0){const O=C.__offset,z=Array.isArray(C.value)?C.value:[C.value];let Y=0;for(let j=0;j<z.length;j++){const H=z[j],J=x(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,n.bufferSubData(n.UNIFORM_BUFFER,O+Y,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,Y),Y+=J.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(A,E,T,L){const w=A.value,R=E+"_"+T;if(L[R]===void 0)return typeof w=="number"||typeof w=="boolean"?L[R]=w:L[R]=w.clone(),!0;{const D=L[R];if(typeof w=="number"||typeof w=="boolean"){if(D!==w)return L[R]=w,!0}else if(D.equals(w)===!1)return D.copy(w),!0}return!1}function _(A){const E=A.uniforms;let T=0;const L=16;for(let R=0,D=E.length;R<D;R++){const y=Array.isArray(E[R])?E[R]:[E[R]];for(let M=0,C=y.length;M<C;M++){const O=y[M],z=Array.isArray(O.value)?O.value:[O.value];for(let Y=0,j=z.length;Y<j;Y++){const H=z[Y],J=x(H),W=T%L;W!==0&&L-W<J.boundary&&(T+=L-W),O.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=T,T+=J.storage}}}const w=T%L;return w>0&&(T+=L-w),A.__size=T,A.__cache={},this}function x(A){const E={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(E.boundary=4,E.storage=4):A.isVector2?(E.boundary=8,E.storage=8):A.isVector3||A.isColor?(E.boundary=16,E.storage=12):A.isVector4?(E.boundary=16,E.storage=16):A.isMatrix3?(E.boundary=48,E.storage=48):A.isMatrix4?(E.boundary=64,E.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),E}function p(A){const E=A.target;E.removeEventListener("dispose",p);const T=o.indexOf(E.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(r[E.id]),delete r[E.id],delete s[E.id]}function d(){for(const A in r)n.deleteBuffer(r[A]);o=[],r={},s={}}return{bind:l,update:c,dispose:d}}class ng{constructor(e={}){const{canvas:t=Yh(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const m=new Uint32Array(4),_=new Int32Array(4);let x=null,p=null;const d=[],A=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=hn,this.toneMapping=Vn,this.toneMappingExposure=1;const E=this;let T=!1,L=0,w=0,R=null,D=-1,y=null;const M=new dt,C=new dt;let O=null;const z=new tt(0);let Y=0,j=t.width,H=t.height,J=1,W=null,oe=null;const ue=new dt(0,0,j,H),ce=new dt(0,0,j,H);let ge=!1;const ke=new ma;let K=!1,q=!1;const ee=new ft,re=new I,Se={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Te=!1;function Ae(){return R===null?J:1}let P=i;function Le(S,U){return t.getContext(S,U)}try{const S={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${da}`),t.addEventListener("webglcontextlost",V,!1),t.addEventListener("webglcontextrestored",F,!1),t.addEventListener("webglcontextcreationerror",X,!1),P===null){const U="webgl2";if(P=Le(U,S),P===null)throw Le(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Ue,Re,fe,De,_e,pe,Be,b,v,B,Z,$,Q,ve,se,le,Ce,ie,xe,Ie,ye,he,Fe,Ee;function qe(){Ue=new hp(P),Ue.init(),he=new qm(P,Ue),Re=new rp(P,Ue,e,he),fe=new Wm(P),De=new fp(P),_e=new Pm,pe=new Xm(P,Ue,fe,_e,Re,he,De),Be=new ap(E),b=new cp(E),v=new xd(P),Fe=new np(P,v),B=new dp(P,v,De,Fe),Z=new mp(P,B,v,De),xe=new pp(P,Re,pe),le=new sp(_e),$=new Cm(E,Be,b,Ue,Re,Fe,le),Q=new eg(E,_e),ve=new Dm,se=new zm(Ue),ie=new tp(E,Be,b,fe,Z,f,l),Ce=new Vm(E,Z,Re),Ee=new tg(P,De,Re,fe),Ie=new ip(P,Ue,De),ye=new up(P,Ue,De),De.programs=$.programs,E.capabilities=Re,E.extensions=Ue,E.properties=_e,E.renderLists=ve,E.shadowMap=Ce,E.state=fe,E.info=De}qe();const g=new Jm(E,P);this.xr=g,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const S=Ue.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Ue.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(S){S!==void 0&&(J=S,this.setSize(j,H,!1))},this.getSize=function(S){return S.set(j,H)},this.setSize=function(S,U,G=!0){if(g.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=S,H=U,t.width=Math.floor(S*J),t.height=Math.floor(U*J),G===!0&&(t.style.width=S+"px",t.style.height=U+"px"),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(j*J,H*J).floor()},this.setDrawingBufferSize=function(S,U,G){j=S,H=U,J=G,t.width=Math.floor(S*G),t.height=Math.floor(U*G),this.setViewport(0,0,S,U)},this.getCurrentViewport=function(S){return S.copy(M)},this.getViewport=function(S){return S.copy(ue)},this.setViewport=function(S,U,G,k){S.isVector4?ue.set(S.x,S.y,S.z,S.w):ue.set(S,U,G,k),fe.viewport(M.copy(ue).multiplyScalar(J).round())},this.getScissor=function(S){return S.copy(ce)},this.setScissor=function(S,U,G,k){S.isVector4?ce.set(S.x,S.y,S.z,S.w):ce.set(S,U,G,k),fe.scissor(C.copy(ce).multiplyScalar(J).round())},this.getScissorTest=function(){return ge},this.setScissorTest=function(S){fe.setScissorTest(ge=S)},this.setOpaqueSort=function(S){W=S},this.setTransparentSort=function(S){oe=S},this.getClearColor=function(S){return S.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor.apply(ie,arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha.apply(ie,arguments)},this.clear=function(S=!0,U=!0,G=!0){let k=0;if(S){let N=!1;if(R!==null){const ne=R.texture.format;N=ne===Tl||ne===El||ne===yl}if(N){const ne=R.texture.type,me=ne===Xn||ne===$i||ne===es||ne===Zi||ne===Ml||ne===Sl,be=ie.getClearColor(),Pe=ie.getClearAlpha(),He=be.r,Ge=be.g,ze=be.b;me?(m[0]=He,m[1]=Ge,m[2]=ze,m[3]=Pe,P.clearBufferuiv(P.COLOR,0,m)):(_[0]=He,_[1]=Ge,_[2]=ze,_[3]=Pe,P.clearBufferiv(P.COLOR,0,_))}else k|=P.COLOR_BUFFER_BIT}U&&(k|=P.DEPTH_BUFFER_BIT),G&&(k|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",V,!1),t.removeEventListener("webglcontextrestored",F,!1),t.removeEventListener("webglcontextcreationerror",X,!1),ve.dispose(),se.dispose(),_e.dispose(),Be.dispose(),b.dispose(),Z.dispose(),Fe.dispose(),Ee.dispose(),$.dispose(),g.dispose(),g.removeEventListener("sessionstart",et),g.removeEventListener("sessionend",rt),de.stop()};function V(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const S=De.autoReset,U=Ce.enabled,G=Ce.autoUpdate,k=Ce.needsUpdate,N=Ce.type;qe(),De.autoReset=S,Ce.enabled=U,Ce.autoUpdate=G,Ce.needsUpdate=k,Ce.type=N}function X(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function te(S){const U=S.target;U.removeEventListener("dispose",te),we(U)}function we(S){Ne(S),_e.remove(S)}function Ne(S){const U=_e.get(S).programs;U!==void 0&&(U.forEach(function(G){$.releaseProgram(G)}),S.isShaderMaterial&&$.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,G,k,N,ne){U===null&&(U=Se);const me=N.isMesh&&N.matrixWorld.determinant()<0,be=en(S,U,G,k,N);fe.setMaterial(k,me);let Pe=G.index,He=1;if(k.wireframe===!0){if(Pe=B.getWireframeAttribute(G),Pe===void 0)return;He=2}const Ge=G.drawRange,ze=G.attributes.position;let Ze=Ge.start*He,at=(Ge.start+Ge.count)*He;ne!==null&&(Ze=Math.max(Ze,ne.start*He),at=Math.min(at,(ne.start+ne.count)*He)),Pe!==null?(Ze=Math.max(Ze,0),at=Math.min(at,Pe.count)):ze!=null&&(Ze=Math.max(Ze,0),at=Math.min(at,ze.count));const ot=at-Ze;if(ot<0||ot===1/0)return;Fe.setup(N,k,be,G,Pe);let mt,$e=Ie;if(Pe!==null&&(mt=v.get(Pe),$e=ye,$e.setIndex(mt)),N.isMesh)k.wireframe===!0?(fe.setLineWidth(k.wireframeLinewidth*Ae()),$e.setMode(P.LINES)):$e.setMode(P.TRIANGLES);else if(N.isLine){let Oe=k.linewidth;Oe===void 0&&(Oe=1),fe.setLineWidth(Oe*Ae()),N.isLineSegments?$e.setMode(P.LINES):N.isLineLoop?$e.setMode(P.LINE_LOOP):$e.setMode(P.LINE_STRIP)}else N.isPoints?$e.setMode(P.POINTS):N.isSprite&&$e.setMode(P.TRIANGLES);if(N.isBatchedMesh)N._multiDrawInstances!==null?$e.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances):$e.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else if(N.isInstancedMesh)$e.renderInstances(Ze,ot,N.count);else if(G.isInstancedBufferGeometry){const Oe=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,_t=Math.min(G.instanceCount,Oe);$e.renderInstances(Ze,ot,_t)}else $e.render(Ze,ot)};function Je(S,U,G){S.transparent===!0&&S.side===wn&&S.forceSinglePass===!1?(S.side=Ot,S.needsUpdate=!0,Qt(S,U,G),S.side=Wn,S.needsUpdate=!0,Qt(S,U,G),S.side=wn):Qt(S,U,G)}this.compile=function(S,U,G=null){G===null&&(G=S),p=se.get(G),p.init(U),A.push(p),G.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),S!==G&&S.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const k=new Set;return S.traverse(function(N){const ne=N.material;if(ne)if(Array.isArray(ne))for(let me=0;me<ne.length;me++){const be=ne[me];Je(be,G,N),k.add(be)}else Je(ne,G,N),k.add(ne)}),A.pop(),p=null,k},this.compileAsync=function(S,U,G=null){const k=this.compile(S,U,G);return new Promise(N=>{function ne(){if(k.forEach(function(me){_e.get(me).currentProgram.isReady()&&k.delete(me)}),k.size===0){N(S);return}setTimeout(ne,10)}Ue.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let Qe=null;function Ve(S){Qe&&Qe(S)}function et(){de.stop()}function rt(){de.start()}const de=new Fl;de.setAnimationLoop(Ve),typeof self<"u"&&de.setContext(self),this.setAnimationLoop=function(S){Qe=S,g.setAnimationLoop(S),S===null?de.stop():de.start()},g.addEventListener("sessionstart",et),g.addEventListener("sessionend",rt),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),g.enabled===!0&&g.isPresenting===!0&&(g.cameraAutoUpdate===!0&&g.updateCamera(U),U=g.getCamera()),S.isScene===!0&&S.onBeforeRender(E,S,U,R),p=se.get(S,A.length),p.init(U),A.push(p),ee.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ke.setFromProjectionMatrix(ee),q=this.localClippingEnabled,K=le.init(this.clippingPlanes,q),x=ve.get(S,d.length),x.init(),d.push(x),g.enabled===!0&&g.isPresenting===!0){const ne=E.xr.getDepthSensingMesh();ne!==null&&nt(ne,U,-1/0,E.sortObjects)}nt(S,U,0,E.sortObjects),x.finish(),E.sortObjects===!0&&x.sort(W,oe),Te=g.enabled===!1||g.isPresenting===!1||g.hasDepthSensing()===!1,Te&&ie.addToRenderList(x,S),this.info.render.frame++,K===!0&&le.beginShadows();const G=p.state.shadowsArray;Ce.render(G,S,U),K===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=x.opaque,N=x.transmissive;if(p.setupLights(),U.isArrayCamera){const ne=U.cameras;if(N.length>0)for(let me=0,be=ne.length;me<be;me++){const Pe=ne[me];yt(k,N,S,Pe)}Te&&ie.render(S);for(let me=0,be=ne.length;me<be;me++){const Pe=ne[me];lt(x,S,Pe,Pe.viewport)}}else N.length>0&&yt(k,N,S,U),Te&&ie.render(S),lt(x,S,U);R!==null&&(pe.updateMultisampleRenderTarget(R),pe.updateRenderTargetMipmap(R)),S.isScene===!0&&S.onAfterRender(E,S,U),Fe.resetDefaultState(),D=-1,y=null,A.pop(),A.length>0?(p=A[A.length-1],K===!0&&le.setGlobalState(E.clippingPlanes,p.state.camera)):p=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function nt(S,U,G,k){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ke.intersectsSprite(S)){k&&re.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ee);const me=Z.update(S),be=S.material;be.visible&&x.push(S,me,be,G,re.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ke.intersectsObject(S))){const me=Z.update(S),be=S.material;if(k&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),re.copy(S.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),re.copy(me.boundingSphere.center)),re.applyMatrix4(S.matrixWorld).applyMatrix4(ee)),Array.isArray(be)){const Pe=me.groups;for(let He=0,Ge=Pe.length;He<Ge;He++){const ze=Pe[He],Ze=be[ze.materialIndex];Ze&&Ze.visible&&x.push(S,me,Ze,G,re.z,ze)}}else be.visible&&x.push(S,me,be,G,re.z,null)}}const ne=S.children;for(let me=0,be=ne.length;me<be;me++)nt(ne[me],U,G,k)}function lt(S,U,G,k){const N=S.opaque,ne=S.transmissive,me=S.transparent;p.setupLightsView(G),K===!0&&le.setGlobalState(E.clippingPlanes,G),k&&fe.viewport(M.copy(k)),N.length>0&&je(N,U,G),ne.length>0&&je(ne,U,G),me.length>0&&je(me,U,G),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function yt(S,U,G,k){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[k.id]===void 0&&(p.state.transmissionRenderTarget[k.id]=new pi(1,1,{generateMipmaps:!0,type:Ue.has("EXT_color_buffer_half_float")||Ue.has("EXT_color_buffer_float")?os:Xn,minFilter:hi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:st.workingColorSpace}));const ne=p.state.transmissionRenderTarget[k.id],me=k.viewport||M;ne.setSize(me.z,me.w);const be=E.getRenderTarget();E.setRenderTarget(ne),E.getClearColor(z),Y=E.getClearAlpha(),Y<1&&E.setClearColor(16777215,.5),Te?ie.render(G):E.clear();const Pe=E.toneMapping;E.toneMapping=Vn;const He=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),p.setupLightsView(k),K===!0&&le.setGlobalState(E.clippingPlanes,k),je(S,G,k),pe.updateMultisampleRenderTarget(ne),pe.updateRenderTargetMipmap(ne),Ue.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let ze=0,Ze=U.length;ze<Ze;ze++){const at=U[ze],ot=at.object,mt=at.geometry,$e=at.material,Oe=at.group;if($e.side===wn&&ot.layers.test(k.layers)){const _t=$e.side;$e.side=Ot,$e.needsUpdate=!0,Pn(ot,G,k,mt,$e,Oe),$e.side=_t,$e.needsUpdate=!0,Ge=!0}}Ge===!0&&(pe.updateMultisampleRenderTarget(ne),pe.updateRenderTargetMipmap(ne))}E.setRenderTarget(be),E.setClearColor(z,Y),He!==void 0&&(k.viewport=He),E.toneMapping=Pe}function je(S,U,G){const k=U.isScene===!0?U.overrideMaterial:null;for(let N=0,ne=S.length;N<ne;N++){const me=S[N],be=me.object,Pe=me.geometry,He=k===null?me.material:k,Ge=me.group;be.layers.test(G.layers)&&Pn(be,U,G,Pe,He,Ge)}}function Pn(S,U,G,k,N,ne){S.onBeforeRender(E,U,G,k,N,ne),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),N.onBeforeRender(E,U,G,k,S,ne),N.transparent===!0&&N.side===wn&&N.forceSinglePass===!1?(N.side=Ot,N.needsUpdate=!0,E.renderBufferDirect(G,U,k,N,S,ne),N.side=Wn,N.needsUpdate=!0,E.renderBufferDirect(G,U,k,N,S,ne),N.side=wn):E.renderBufferDirect(G,U,k,N,S,ne),S.onAfterRender(E,U,G,k,N,ne)}function Qt(S,U,G){U.isScene!==!0&&(U=Se);const k=_e.get(S),N=p.state.lights,ne=p.state.shadowsArray,me=N.state.version,be=$.getParameters(S,N.state,ne,U,G),Pe=$.getProgramCacheKey(be);let He=k.programs;k.environment=S.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(S.isMeshStandardMaterial?b:Be).get(S.envMap||k.environment),k.envMapRotation=k.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,He===void 0&&(S.addEventListener("dispose",te),He=new Map,k.programs=He);let Ge=He.get(Pe);if(Ge!==void 0){if(k.currentProgram===Ge&&k.lightsStateVersion===me)return Dn(S,be),Ge}else be.uniforms=$.getUniforms(S),S.onBuild(G,be,E),S.onBeforeCompile(be,E),Ge=$.acquireProgram(be,Pe),He.set(Pe,Ge),k.uniforms=be.uniforms;const ze=k.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(ze.clippingPlanes=le.uniform),Dn(S,be),k.needsLights=pt(S),k.lightsStateVersion=me,k.needsLights&&(ze.ambientLightColor.value=N.state.ambient,ze.lightProbe.value=N.state.probe,ze.directionalLights.value=N.state.directional,ze.directionalLightShadows.value=N.state.directionalShadow,ze.spotLights.value=N.state.spot,ze.spotLightShadows.value=N.state.spotShadow,ze.rectAreaLights.value=N.state.rectArea,ze.ltc_1.value=N.state.rectAreaLTC1,ze.ltc_2.value=N.state.rectAreaLTC2,ze.pointLights.value=N.state.point,ze.pointLightShadows.value=N.state.pointShadow,ze.hemisphereLights.value=N.state.hemi,ze.directionalShadowMap.value=N.state.directionalShadowMap,ze.directionalShadowMatrix.value=N.state.directionalShadowMatrix,ze.spotShadowMap.value=N.state.spotShadowMap,ze.spotLightMatrix.value=N.state.spotLightMatrix,ze.spotLightMap.value=N.state.spotLightMap,ze.pointShadowMap.value=N.state.pointShadowMap,ze.pointShadowMatrix.value=N.state.pointShadowMatrix),k.currentProgram=Ge,k.uniformsList=null,Ge}function Ln(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=Zr.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function Dn(S,U){const G=_e.get(S);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function en(S,U,G,k,N){U.isScene!==!0&&(U=Se),pe.resetTextureUnits();const ne=U.fog,me=k.isMeshStandardMaterial?U.environment:null,be=R===null?E.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Kn,Pe=(k.isMeshStandardMaterial?b:Be).get(k.envMap||me),He=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ge=!!G.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),ze=!!G.morphAttributes.position,Ze=!!G.morphAttributes.normal,at=!!G.morphAttributes.color;let ot=Vn;k.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(ot=E.toneMapping);const mt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,$e=mt!==void 0?mt.length:0,Oe=_e.get(k),_t=p.state.lights;if(K===!0&&(q===!0||S!==y)){const Tt=S===y&&k.id===D;le.setState(k,S,Tt)}let it=!1;k.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==_t.state.version||Oe.outputColorSpace!==be||N.isBatchedMesh&&Oe.batching===!1||!N.isBatchedMesh&&Oe.batching===!0||N.isBatchedMesh&&Oe.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Oe.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Oe.instancing===!1||!N.isInstancedMesh&&Oe.instancing===!0||N.isSkinnedMesh&&Oe.skinning===!1||!N.isSkinnedMesh&&Oe.skinning===!0||N.isInstancedMesh&&Oe.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Oe.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Oe.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Oe.instancingMorph===!1&&N.morphTexture!==null||Oe.envMap!==Pe||k.fog===!0&&Oe.fog!==ne||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==le.numPlanes||Oe.numIntersection!==le.numIntersection)||Oe.vertexAlphas!==He||Oe.vertexTangents!==Ge||Oe.morphTargets!==ze||Oe.morphNormals!==Ze||Oe.morphColors!==at||Oe.toneMapping!==ot||Oe.morphTargetsCount!==$e)&&(it=!0):(it=!0,Oe.__version=k.version);let Ht=Oe.currentProgram;it===!0&&(Ht=Qt(k,U,N));let tn=!1,nn=!1,jn=!1;const ht=Ht.getUniforms(),kt=Oe.uniforms;if(fe.useProgram(Ht.program)&&(tn=!0,nn=!0,jn=!0),k.id!==D&&(D=k.id,nn=!0),tn||y!==S){ht.setValue(P,"projectionMatrix",S.projectionMatrix),ht.setValue(P,"viewMatrix",S.matrixWorldInverse);const Tt=ht.map.cameraPosition;Tt!==void 0&&Tt.setValue(P,re.setFromMatrixPosition(S.matrixWorld)),Re.logarithmicDepthBuffer&&ht.setValue(P,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ht.setValue(P,"isOrthographic",S.isOrthographicCamera===!0),y!==S&&(y=S,nn=!0,jn=!0)}if(N.isSkinnedMesh){ht.setOptional(P,N,"bindMatrix"),ht.setOptional(P,N,"bindMatrixInverse");const Tt=N.skeleton;Tt&&(Tt.boneTexture===null&&Tt.computeBoneTexture(),ht.setValue(P,"boneTexture",Tt.boneTexture,pe))}N.isBatchedMesh&&(ht.setOptional(P,N,"batchingTexture"),ht.setValue(P,"batchingTexture",N._matricesTexture,pe),ht.setOptional(P,N,"batchingColorTexture"),N._colorsTexture!==null&&ht.setValue(P,"batchingColorTexture",N._colorsTexture,pe));const vn=G.morphAttributes;if((vn.position!==void 0||vn.normal!==void 0||vn.color!==void 0)&&xe.update(N,G,Ht),(nn||Oe.receiveShadow!==N.receiveShadow)&&(Oe.receiveShadow=N.receiveShadow,ht.setValue(P,"receiveShadow",N.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(kt.envMap.value=Pe,kt.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(kt.envMapIntensity.value=U.environmentIntensity),nn&&(ht.setValue(P,"toneMappingExposure",E.toneMappingExposure),Oe.needsLights&&Bt(kt,jn),ne&&k.fog===!0&&Q.refreshFogUniforms(kt,ne),Q.refreshMaterialUniforms(kt,k,J,H,p.state.transmissionRenderTarget[S.id]),Zr.upload(P,Ln(Oe),kt,pe)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Zr.upload(P,Ln(Oe),kt,pe),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ht.setValue(P,"center",N.center),ht.setValue(P,"modelViewMatrix",N.modelViewMatrix),ht.setValue(P,"normalMatrix",N.normalMatrix),ht.setValue(P,"modelMatrix",N.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Tt=k.uniformsGroups;for(let $n=0,ms=Tt.length;$n<ms;$n++){const Tr=Tt[$n];Ee.update(Tr,Ht),Ee.bind(Tr,Ht)}}return Ht}function Bt(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function pt(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(S,U,G){_e.get(S.texture).__webglTexture=U,_e.get(S.depthTexture).__webglTexture=G;const k=_e.get(S);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=G===void 0,k.__autoAllocateDepthBuffer||Ue.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,U){const G=_e.get(S);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,G=0){R=S,L=U,w=G;let k=!0,N=null,ne=!1,me=!1;if(S){const Pe=_e.get(S);Pe.__useDefaultFramebuffer!==void 0?(fe.bindFramebuffer(P.FRAMEBUFFER,null),k=!1):Pe.__webglFramebuffer===void 0?pe.setupRenderTarget(S):Pe.__hasExternalTextures&&pe.rebindTextures(S,_e.get(S.texture).__webglTexture,_e.get(S.depthTexture).__webglTexture);const He=S.texture;(He.isData3DTexture||He.isDataArrayTexture||He.isCompressedArrayTexture)&&(me=!0);const Ge=_e.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ge[U])?N=Ge[U][G]:N=Ge[U],ne=!0):S.samples>0&&pe.useMultisampledRTT(S)===!1?N=_e.get(S).__webglMultisampledFramebuffer:Array.isArray(Ge)?N=Ge[G]:N=Ge,M.copy(S.viewport),C.copy(S.scissor),O=S.scissorTest}else M.copy(ue).multiplyScalar(J).floor(),C.copy(ce).multiplyScalar(J).floor(),O=ge;if(fe.bindFramebuffer(P.FRAMEBUFFER,N)&&k&&fe.drawBuffers(S,N),fe.viewport(M),fe.scissor(C),fe.setScissorTest(O),ne){const Pe=_e.get(S.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,Pe.__webglTexture,G)}else if(me){const Pe=_e.get(S.texture),He=U||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,Pe.__webglTexture,G||0,He)}D=-1},this.readRenderTargetPixels=function(S,U,G,k,N,ne,me){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=_e.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&me!==void 0&&(be=be[me]),be){fe.bindFramebuffer(P.FRAMEBUFFER,be);try{const Pe=S.texture,He=Pe.format,Ge=Pe.type;if(!Re.textureFormatReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-k&&G>=0&&G<=S.height-N&&P.readPixels(U,G,k,N,he.convert(He),he.convert(Ge),ne)}finally{const Pe=R!==null?_e.get(R).__webglFramebuffer:null;fe.bindFramebuffer(P.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(S,U,G,k,N,ne,me){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=_e.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&me!==void 0&&(be=be[me]),be){fe.bindFramebuffer(P.FRAMEBUFFER,be);try{const Pe=S.texture,He=Pe.format,Ge=Pe.type;if(!Re.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=S.width-k&&G>=0&&G<=S.height-N){const ze=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,ze),P.bufferData(P.PIXEL_PACK_BUFFER,ne.byteLength,P.STREAM_READ),P.readPixels(U,G,k,N,he.convert(He),he.convert(Ge),0),P.flush();const Ze=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);await Kh(P,Ze,4);try{P.bindBuffer(P.PIXEL_PACK_BUFFER,ze),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ne)}finally{P.deleteBuffer(ze),P.deleteSync(Ze)}return ne}}finally{const Pe=R!==null?_e.get(R).__webglFramebuffer:null;fe.bindFramebuffer(P.FRAMEBUFFER,Pe)}}},this.copyFramebufferToTexture=function(S,U=null,G=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,S=arguments[1]);const k=Math.pow(2,-G),N=Math.floor(S.image.width*k),ne=Math.floor(S.image.height*k),me=U!==null?U.x:0,be=U!==null?U.y:0;pe.setTexture2D(S,0),P.copyTexSubImage2D(P.TEXTURE_2D,G,0,0,me,be,N,ne),fe.unbindTexture()},this.copyTextureToTexture=function(S,U,G=null,k=null,N=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,S=arguments[1],U=arguments[2],N=arguments[3]||0,G=null);let ne,me,be,Pe,He,Ge;G!==null?(ne=G.max.x-G.min.x,me=G.max.y-G.min.y,be=G.min.x,Pe=G.min.y):(ne=S.image.width,me=S.image.height,be=0,Pe=0),k!==null?(He=k.x,Ge=k.y):(He=0,Ge=0);const ze=he.convert(U.format),Ze=he.convert(U.type);pe.setTexture2D(U,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const at=P.getParameter(P.UNPACK_ROW_LENGTH),ot=P.getParameter(P.UNPACK_IMAGE_HEIGHT),mt=P.getParameter(P.UNPACK_SKIP_PIXELS),$e=P.getParameter(P.UNPACK_SKIP_ROWS),Oe=P.getParameter(P.UNPACK_SKIP_IMAGES),_t=S.isCompressedTexture?S.mipmaps[N]:S.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,_t.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,_t.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,be),P.pixelStorei(P.UNPACK_SKIP_ROWS,Pe),S.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,N,He,Ge,ne,me,ze,Ze,_t.data):S.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,N,He,Ge,_t.width,_t.height,ze,_t.data):P.texSubImage2D(P.TEXTURE_2D,N,He,Ge,ze,Ze,_t),P.pixelStorei(P.UNPACK_ROW_LENGTH,at),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ot),P.pixelStorei(P.UNPACK_SKIP_PIXELS,mt),P.pixelStorei(P.UNPACK_SKIP_ROWS,$e),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Oe),N===0&&U.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(S,U,G=null,k=null,N=0){S.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,k=arguments[1]||null,S=arguments[2],U=arguments[3],N=arguments[4]||0);let ne,me,be,Pe,He,Ge,ze,Ze,at;const ot=S.isCompressedTexture?S.mipmaps[N]:S.image;G!==null?(ne=G.max.x-G.min.x,me=G.max.y-G.min.y,be=G.max.z-G.min.z,Pe=G.min.x,He=G.min.y,Ge=G.min.z):(ne=ot.width,me=ot.height,be=ot.depth,Pe=0,He=0,Ge=0),k!==null?(ze=k.x,Ze=k.y,at=k.z):(ze=0,Ze=0,at=0);const mt=he.convert(U.format),$e=he.convert(U.type);let Oe;if(U.isData3DTexture)pe.setTexture3D(U,0),Oe=P.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)pe.setTexture2DArray(U,0),Oe=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const _t=P.getParameter(P.UNPACK_ROW_LENGTH),it=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Ht=P.getParameter(P.UNPACK_SKIP_PIXELS),tn=P.getParameter(P.UNPACK_SKIP_ROWS),nn=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,ot.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ot.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Pe),P.pixelStorei(P.UNPACK_SKIP_ROWS,He),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Ge),S.isDataTexture||S.isData3DTexture?P.texSubImage3D(Oe,N,ze,Ze,at,ne,me,be,mt,$e,ot.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(Oe,N,ze,Ze,at,ne,me,be,mt,ot.data):P.texSubImage3D(Oe,N,ze,Ze,at,ne,me,be,mt,$e,ot),P.pixelStorei(P.UNPACK_ROW_LENGTH,_t),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,it),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ht),P.pixelStorei(P.UNPACK_SKIP_ROWS,tn),P.pixelStorei(P.UNPACK_SKIP_IMAGES,nn),N===0&&U.generateMipmaps&&P.generateMipmap(Oe),fe.unbindTexture()},this.initRenderTarget=function(S){_e.get(S).__webglFramebuffer===void 0&&pe.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?pe.setTextureCube(S,0):S.isData3DTexture?pe.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?pe.setTexture2DArray(S,0):pe.setTexture2D(S,0),fe.unbindTexture()},this.resetState=function(){L=0,w=0,R=null,fe.reset(),Fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===ua?"display-p3":"srgb",t.unpackColorSpace=st.workingColorSpace===ls?"display-p3":"srgb"}}class _a{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new tt(e),this.density=t}clone(){return new _a(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Xl extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pn,this.environmentIntensity=1,this.environmentRotation=new pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class va extends nr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Jo=new ft,sa=new hs,Yr=new cs,Kr=new I;class ql extends Et{constructor(e=new jt,t=new va){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Yr.copy(i.boundingSphere),Yr.applyMatrix4(r),Yr.radius+=s,e.ray.intersectsSphere(Yr)===!1)return;Jo.copy(r).invert(),sa.copy(e.ray).applyMatrix4(Jo);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,u=i.attributes.position;if(c!==null){const f=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let _=f,x=m;_<x;_++){const p=c.getX(_);Kr.fromBufferAttribute(u,p),Qo(Kr,p,l,r,e,t,this)}}else{const f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let _=f,x=m;_<x;_++)Kr.fromBufferAttribute(u,_),Qo(Kr,_,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Qo(n,e,t,i,r,s,o){const a=sa.distanceSqToPoint(n);if(a<t){const l=new I;sa.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,object:o})}}class ig extends Pt{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ft extends jt{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],f=[],m=[];let _=0;const x=[],p=i/2;let d=0;A(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new Lt(u,3)),this.setAttribute("normal",new Lt(f,3)),this.setAttribute("uv",new Lt(m,2));function A(){const T=new I,L=new I;let w=0;const R=(t-e)/i;for(let D=0;D<=s;D++){const y=[],M=D/s,C=M*(t-e)+e;for(let O=0;O<=r;O++){const z=O/r,Y=z*l+a,j=Math.sin(Y),H=Math.cos(Y);L.x=C*j,L.y=-M*i+p,L.z=C*H,u.push(L.x,L.y,L.z),T.set(j,R,H).normalize(),f.push(T.x,T.y,T.z),m.push(z,1-M),y.push(_++)}x.push(y)}for(let D=0;D<r;D++)for(let y=0;y<s;y++){const M=x[y][D],C=x[y+1][D],O=x[y+1][D+1],z=x[y][D+1];h.push(M,C,z),h.push(C,O,z),w+=6}c.addGroup(d,w,0),d+=w}function E(T){const L=_,w=new We,R=new I;let D=0;const y=T===!0?e:t,M=T===!0?1:-1;for(let O=1;O<=r;O++)u.push(0,p*M,0),f.push(0,M,0),m.push(.5,.5),_++;const C=_;for(let O=0;O<=r;O++){const Y=O/r*l+a,j=Math.cos(Y),H=Math.sin(Y);R.x=y*H,R.y=p*M,R.z=y*j,u.push(R.x,R.y,R.z),f.push(0,M,0),w.x=j*.5+.5,w.y=H*.5*M+.5,m.push(w.x,w.y),_++}for(let O=0;O<r;O++){const z=L+O,Y=C+O;T===!0?h.push(Y,Y+1,z):h.push(Y+1,Y,z),D+=3}c.addGroup(d,D,T===!0?1:2),d+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ft(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class xa extends Ft{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new xa(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class fs extends jt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new I,f=new I,m=[],_=[],x=[],p=[];for(let d=0;d<=i;d++){const A=[],E=d/i;let T=0;d===0&&o===0?T=.5/t:d===i&&l===Math.PI&&(T=-.5/t);for(let L=0;L<=t;L++){const w=L/t;u.x=-e*Math.cos(r+w*s)*Math.sin(o+E*a),u.y=e*Math.cos(o+E*a),u.z=e*Math.sin(r+w*s)*Math.sin(o+E*a),_.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),p.push(w+T,1-E),A.push(c++)}h.push(A)}for(let d=0;d<i;d++)for(let A=0;A<t;A++){const E=h[d][A+1],T=h[d][A],L=h[d+1][A],w=h[d+1][A+1];(d!==0||o>0)&&m.push(E,T,w),(d!==i-1||l<Math.PI)&&m.push(T,L,w)}this.setIndex(m),this.setAttribute("position",new Lt(_,3)),this.setAttribute("normal",new Lt(x,3)),this.setAttribute("uv",new Lt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ma extends jt{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],l=[],c=[],h=new I,u=new I,f=new I;for(let m=0;m<=i;m++)for(let _=0;_<=r;_++){const x=_/r*s,p=m/i*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(x),u.y=(e+t*Math.cos(p))*Math.sin(x),u.z=t*Math.sin(p),a.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(_/r),c.push(m/i)}for(let m=1;m<=i;m++)for(let _=1;_<=r;_++){const x=(r+1)*m+_-1,p=(r+1)*(m-1)+_-1,d=(r+1)*(m-1)+_,A=(r+1)*m+_;o.push(x,p,A),o.push(p,d,A)}this.setIndex(o),this.setAttribute("position",new Lt(a,3)),this.setAttribute("normal",new Lt(l,3)),this.setAttribute("uv",new Lt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ma(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class _i extends nr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bl,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const el={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class rg{constructor(e,t,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){const m=c[u],_=c[u+1];if(m.global&&(m.lastIndex=0),m.test(h))return _}return null}}}const sg=new rg;class Sa{constructor(e){this.manager=e!==void 0?e:sg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Sa.DEFAULT_MATERIAL_NAME="__DEFAULT";class ag extends Sa{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=el.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;const a=xr("img");function l(){h(),el.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(u){h(),r&&r(u),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class og extends Sa{constructor(e){super(e)}load(e,t,i,r){const s=new Pt,o=new ag(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},i,r),s}}class ya extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Ys=new ft,tl=new I,nl=new I;class Yl{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ma,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;tl.setFromMatrixPosition(e.matrixWorld),t.position.copy(tl),nl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(nl),t.updateMatrixWorld(),Ys.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ys),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ys)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const il=new ft,cr=new I,Ks=new I;class lg extends Yl{constructor(){super(new Xt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new We(4,2),this._viewportCount=6,this._viewports=[new dt(2,1,1,1),new dt(0,1,1,1),new dt(3,1,1,1),new dt(1,1,1,1),new dt(3,0,1,1),new dt(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),cr.setFromMatrixPosition(e.matrixWorld),i.position.copy(cr),Ks.copy(i.position),Ks.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ks),i.updateMatrixWorld(),r.makeTranslation(-cr.x,-cr.y,-cr.z),il.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(il)}}class Kl extends ya{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new lg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class cg extends Yl{constructor(){super(new zl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class jl extends ya{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new cg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class hg extends ya{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const rl=new ft;class dg{constructor(e,t,i=0,r=1/0){this.ray=new hs(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new pa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return rl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rl),this}intersectObject(e,t=!0,i=[]){return aa(e,this,i,t),i.sort(sl),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)aa(e[r],this,i,t);return i.sort(sl),i}}function sl(n,e){return n.distance-e.distance}function aa(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)aa(s[o],e,t,!0)}}class al{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ct(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:da}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=da);const ol={type:"change"},js={type:"start"},ll={type:"end"},jr=new hs,cl=new An,ug=Math.cos(70*na.DEG2RAD);class fg extends vi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Mi.ROTATE,MIDDLE:Mi.DOLLY,RIGHT:Mi.PAN},this.touches={ONE:Si.ROTATE,TWO:Si.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(g){g.addEventListener("keydown",le),this._domElementKeyEvents=g},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",le),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(ol),i.update(),s=r.NONE},this.update=function(){const g=new I,V=new mi().setFromUnitVectors(e.up,new I(0,1,0)),F=V.clone().invert(),X=new I,te=new mi,we=new I,Ne=2*Math.PI;return function(Qe=null){const Ve=i.object.position;g.copy(Ve).sub(i.target),g.applyQuaternion(V),a.setFromVector3(g),i.autoRotate&&s===r.NONE&&O(M(Qe)),i.enableDamping?(a.theta+=l.theta*i.dampingFactor,a.phi+=l.phi*i.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let et=i.minAzimuthAngle,rt=i.maxAzimuthAngle;isFinite(et)&&isFinite(rt)&&(et<-Math.PI?et+=Ne:et>Math.PI&&(et-=Ne),rt<-Math.PI?rt+=Ne:rt>Math.PI&&(rt-=Ne),et<=rt?a.theta=Math.max(et,Math.min(rt,a.theta)):a.theta=a.theta>(et+rt)/2?Math.max(et,a.theta):Math.min(rt,a.theta)),a.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,a.phi)),a.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor);let de=!1;if(i.zoomToCursor&&w||i.object.isOrthographicCamera)a.radius=ue(a.radius);else{const nt=a.radius;a.radius=ue(a.radius*c),de=nt!=a.radius}if(g.setFromSpherical(a),g.applyQuaternion(F),Ve.copy(i.target).add(g),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),h.set(0,0,0)),i.zoomToCursor&&w){let nt=null;if(i.object.isPerspectiveCamera){const lt=g.length();nt=ue(lt*c);const yt=lt-nt;i.object.position.addScaledVector(T,yt),i.object.updateMatrixWorld(),de=!!yt}else if(i.object.isOrthographicCamera){const lt=new I(L.x,L.y,0);lt.unproject(i.object);const yt=i.object.zoom;i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),de=yt!==i.object.zoom;const je=new I(L.x,L.y,0);je.unproject(i.object),i.object.position.sub(je).add(lt),i.object.updateMatrixWorld(),nt=g.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;nt!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(nt).add(i.object.position):(jr.origin.copy(i.object.position),jr.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(jr.direction))<ug?e.lookAt(i.target):(cl.setFromNormalAndCoplanarPoint(i.object.up,i.target),jr.intersectPlane(cl,i.target))))}else if(i.object.isOrthographicCamera){const nt=i.object.zoom;i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),nt!==i.object.zoom&&(i.object.updateProjectionMatrix(),de=!0)}return c=1,w=!1,de||X.distanceToSquared(i.object.position)>o||8*(1-te.dot(i.object.quaternion))>o||we.distanceToSquared(i.target)>o?(i.dispatchEvent(ol),X.copy(i.object.position),te.copy(i.object.quaternion),we.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",xe),i.domElement.removeEventListener("pointerdown",Be),i.domElement.removeEventListener("pointercancel",v),i.domElement.removeEventListener("wheel",$),i.domElement.removeEventListener("pointermove",b),i.domElement.removeEventListener("pointerup",v),i.domElement.getRootNode().removeEventListener("keydown",ve,{capture:!0}),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",le),i._domElementKeyEvents=null)};const i=this,r={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let s=r.NONE;const o=1e-6,a=new al,l=new al;let c=1;const h=new I,u=new We,f=new We,m=new We,_=new We,x=new We,p=new We,d=new We,A=new We,E=new We,T=new I,L=new We;let w=!1;const R=[],D={};let y=!1;function M(g){return g!==null?2*Math.PI/60*i.autoRotateSpeed*g:2*Math.PI/60/60*i.autoRotateSpeed}function C(g){const V=Math.abs(g*.01);return Math.pow(.95,i.zoomSpeed*V)}function O(g){l.theta-=g}function z(g){l.phi-=g}const Y=function(){const g=new I;return function(F,X){g.setFromMatrixColumn(X,0),g.multiplyScalar(-F),h.add(g)}}(),j=function(){const g=new I;return function(F,X){i.screenSpacePanning===!0?g.setFromMatrixColumn(X,1):(g.setFromMatrixColumn(X,0),g.crossVectors(i.object.up,g)),g.multiplyScalar(F),h.add(g)}}(),H=function(){const g=new I;return function(F,X){const te=i.domElement;if(i.object.isPerspectiveCamera){const we=i.object.position;g.copy(we).sub(i.target);let Ne=g.length();Ne*=Math.tan(i.object.fov/2*Math.PI/180),Y(2*F*Ne/te.clientHeight,i.object.matrix),j(2*X*Ne/te.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(Y(F*(i.object.right-i.object.left)/i.object.zoom/te.clientWidth,i.object.matrix),j(X*(i.object.top-i.object.bottom)/i.object.zoom/te.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function J(g){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c/=g:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function W(g){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c*=g:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function oe(g,V){if(!i.zoomToCursor)return;w=!0;const F=i.domElement.getBoundingClientRect(),X=g-F.left,te=V-F.top,we=F.width,Ne=F.height;L.x=X/we*2-1,L.y=-(te/Ne)*2+1,T.set(L.x,L.y,1).unproject(i.object).sub(i.object.position).normalize()}function ue(g){return Math.max(i.minDistance,Math.min(i.maxDistance,g))}function ce(g){u.set(g.clientX,g.clientY)}function ge(g){oe(g.clientX,g.clientX),d.set(g.clientX,g.clientY)}function ke(g){_.set(g.clientX,g.clientY)}function K(g){f.set(g.clientX,g.clientY),m.subVectors(f,u).multiplyScalar(i.rotateSpeed);const V=i.domElement;O(2*Math.PI*m.x/V.clientHeight),z(2*Math.PI*m.y/V.clientHeight),u.copy(f),i.update()}function q(g){A.set(g.clientX,g.clientY),E.subVectors(A,d),E.y>0?J(C(E.y)):E.y<0&&W(C(E.y)),d.copy(A),i.update()}function ee(g){x.set(g.clientX,g.clientY),p.subVectors(x,_).multiplyScalar(i.panSpeed),H(p.x,p.y),_.copy(x),i.update()}function re(g){oe(g.clientX,g.clientY),g.deltaY<0?W(C(g.deltaY)):g.deltaY>0&&J(C(g.deltaY)),i.update()}function Se(g){let V=!1;switch(g.code){case i.keys.UP:g.ctrlKey||g.metaKey||g.shiftKey?z(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(0,i.keyPanSpeed),V=!0;break;case i.keys.BOTTOM:g.ctrlKey||g.metaKey||g.shiftKey?z(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(0,-i.keyPanSpeed),V=!0;break;case i.keys.LEFT:g.ctrlKey||g.metaKey||g.shiftKey?O(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(i.keyPanSpeed,0),V=!0;break;case i.keys.RIGHT:g.ctrlKey||g.metaKey||g.shiftKey?O(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):H(-i.keyPanSpeed,0),V=!0;break}V&&(g.preventDefault(),i.update())}function Te(g){if(R.length===1)u.set(g.pageX,g.pageY);else{const V=Ee(g),F=.5*(g.pageX+V.x),X=.5*(g.pageY+V.y);u.set(F,X)}}function Ae(g){if(R.length===1)_.set(g.pageX,g.pageY);else{const V=Ee(g),F=.5*(g.pageX+V.x),X=.5*(g.pageY+V.y);_.set(F,X)}}function P(g){const V=Ee(g),F=g.pageX-V.x,X=g.pageY-V.y,te=Math.sqrt(F*F+X*X);d.set(0,te)}function Le(g){i.enableZoom&&P(g),i.enablePan&&Ae(g)}function Ue(g){i.enableZoom&&P(g),i.enableRotate&&Te(g)}function Re(g){if(R.length==1)f.set(g.pageX,g.pageY);else{const F=Ee(g),X=.5*(g.pageX+F.x),te=.5*(g.pageY+F.y);f.set(X,te)}m.subVectors(f,u).multiplyScalar(i.rotateSpeed);const V=i.domElement;O(2*Math.PI*m.x/V.clientHeight),z(2*Math.PI*m.y/V.clientHeight),u.copy(f)}function fe(g){if(R.length===1)x.set(g.pageX,g.pageY);else{const V=Ee(g),F=.5*(g.pageX+V.x),X=.5*(g.pageY+V.y);x.set(F,X)}p.subVectors(x,_).multiplyScalar(i.panSpeed),H(p.x,p.y),_.copy(x)}function De(g){const V=Ee(g),F=g.pageX-V.x,X=g.pageY-V.y,te=Math.sqrt(F*F+X*X);A.set(0,te),E.set(0,Math.pow(A.y/d.y,i.zoomSpeed)),J(E.y),d.copy(A);const we=(g.pageX+V.x)*.5,Ne=(g.pageY+V.y)*.5;oe(we,Ne)}function _e(g){i.enableZoom&&De(g),i.enablePan&&fe(g)}function pe(g){i.enableZoom&&De(g),i.enableRotate&&Re(g)}function Be(g){i.enabled!==!1&&(R.length===0&&(i.domElement.setPointerCapture(g.pointerId),i.domElement.addEventListener("pointermove",b),i.domElement.addEventListener("pointerup",v)),!he(g)&&(Ie(g),g.pointerType==="touch"?Ce(g):B(g)))}function b(g){i.enabled!==!1&&(g.pointerType==="touch"?ie(g):Z(g))}function v(g){switch(ye(g),R.length){case 0:i.domElement.releasePointerCapture(g.pointerId),i.domElement.removeEventListener("pointermove",b),i.domElement.removeEventListener("pointerup",v),i.dispatchEvent(ll),s=r.NONE;break;case 1:const V=R[0],F=D[V];Ce({pointerId:V,pageX:F.x,pageY:F.y});break}}function B(g){let V;switch(g.button){case 0:V=i.mouseButtons.LEFT;break;case 1:V=i.mouseButtons.MIDDLE;break;case 2:V=i.mouseButtons.RIGHT;break;default:V=-1}switch(V){case Mi.DOLLY:if(i.enableZoom===!1)return;ge(g),s=r.DOLLY;break;case Mi.ROTATE:if(g.ctrlKey||g.metaKey||g.shiftKey){if(i.enablePan===!1)return;ke(g),s=r.PAN}else{if(i.enableRotate===!1)return;ce(g),s=r.ROTATE}break;case Mi.PAN:if(g.ctrlKey||g.metaKey||g.shiftKey){if(i.enableRotate===!1)return;ce(g),s=r.ROTATE}else{if(i.enablePan===!1)return;ke(g),s=r.PAN}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(js)}function Z(g){switch(s){case r.ROTATE:if(i.enableRotate===!1)return;K(g);break;case r.DOLLY:if(i.enableZoom===!1)return;q(g);break;case r.PAN:if(i.enablePan===!1)return;ee(g);break}}function $(g){i.enabled===!1||i.enableZoom===!1||s!==r.NONE||(g.preventDefault(),i.dispatchEvent(js),re(Q(g)),i.dispatchEvent(ll))}function Q(g){const V=g.deltaMode,F={clientX:g.clientX,clientY:g.clientY,deltaY:g.deltaY};switch(V){case 1:F.deltaY*=16;break;case 2:F.deltaY*=100;break}return g.ctrlKey&&!y&&(F.deltaY*=10),F}function ve(g){g.key==="Control"&&(y=!0,i.domElement.getRootNode().addEventListener("keyup",se,{passive:!0,capture:!0}))}function se(g){g.key==="Control"&&(y=!1,i.domElement.getRootNode().removeEventListener("keyup",se,{passive:!0,capture:!0}))}function le(g){i.enabled===!1||i.enablePan===!1||Se(g)}function Ce(g){switch(Fe(g),R.length){case 1:switch(i.touches.ONE){case Si.ROTATE:if(i.enableRotate===!1)return;Te(g),s=r.TOUCH_ROTATE;break;case Si.PAN:if(i.enablePan===!1)return;Ae(g),s=r.TOUCH_PAN;break;default:s=r.NONE}break;case 2:switch(i.touches.TWO){case Si.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;Le(g),s=r.TOUCH_DOLLY_PAN;break;case Si.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;Ue(g),s=r.TOUCH_DOLLY_ROTATE;break;default:s=r.NONE}break;default:s=r.NONE}s!==r.NONE&&i.dispatchEvent(js)}function ie(g){switch(Fe(g),s){case r.TOUCH_ROTATE:if(i.enableRotate===!1)return;Re(g),i.update();break;case r.TOUCH_PAN:if(i.enablePan===!1)return;fe(g),i.update();break;case r.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;_e(g),i.update();break;case r.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;pe(g),i.update();break;default:s=r.NONE}}function xe(g){i.enabled!==!1&&g.preventDefault()}function Ie(g){R.push(g.pointerId)}function ye(g){delete D[g.pointerId];for(let V=0;V<R.length;V++)if(R[V]==g.pointerId){R.splice(V,1);return}}function he(g){for(let V=0;V<R.length;V++)if(R[V]==g.pointerId)return!0;return!1}function Fe(g){let V=D[g.pointerId];V===void 0&&(V=new We,D[g.pointerId]=V),V.set(g.pageX,g.pageY)}function Ee(g){const V=g.pointerId===R[0]?R[1]:R[0];return D[V]}i.domElement.addEventListener("contextmenu",xe),i.domElement.addEventListener("pointerdown",Be),i.domElement.addEventListener("pointercancel",v),i.domElement.addEventListener("wheel",$,{passive:!1}),i.domElement.getRootNode().addEventListener("keydown",ve,{passive:!0,capture:!0}),this.update()}}class pg extends Xl{constructor(e=null){super();const t=new ln;t.deleteAttribute("uv");const i=new _i({side:Ot}),r=new _i,s=new Kl(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const o=new Xe(t,i);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);const a=new Xe(t,r);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);const l=new Xe(t,r);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);const c=new Xe(t,r);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const h=new Xe(t,r);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);const u=new Xe(t,r);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);const f=new Xe(t,r);f.position.set(-2.193,-.369,-5.547),f.rotation.set(0,.516,0),f.scale.set(3.875,3.487,2.986),this.add(f);const m=new Xe(t,Bi(50));m.position.set(-16.116,14.37,8.208),m.scale.set(.1,2.428,2.739),this.add(m);const _=new Xe(t,Bi(50));_.position.set(-16.109,18.021,-8.207),_.scale.set(.1,2.425,2.751),this.add(_);const x=new Xe(t,Bi(17));x.position.set(14.904,12.198,-1.832),x.scale.set(.15,4.265,6.331),this.add(x);const p=new Xe(t,Bi(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);const d=new Xe(t,Bi(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);const A=new Xe(t,Bi(100));A.position.set(0,20,0),A.scale.set(1,.1,1),this.add(A)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Bi(n){const e=new Er;return e.color.setScalar(n),e}/*!
 * satellite-js v5.0.0
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */var cn=Math.PI,ut=cn*2,ur=cn/180,mg=1440,gg=398600.8,qt=6378.135,Cn=60/Math.sqrt(qt*qt*qt/gg),$s=qt*Cn/60,_g=1/Cn,di=.001082616,vg=-253881e-11,xg=-165597e-11,ui=vg/di,Mr=2/3;function Mg(n,e){for(var t=[31,n%4===0?29:28,31,30,31,30,31,31,30,31,30,31],i=Math.floor(e),r=1,s=0;i>s+t[r-1]&&r<12;)s+=t[r-1],r+=1;var o=r,a=i-s,l=(e-i)*24,c=Math.floor(l);l=(l-c)*60;var h=Math.floor(l),u=(l-h)*60;return{mon:o,day:a,hr:c,minute:h,sec:u}}function hl(n,e,t,i,r,s){var o=arguments.length>6&&arguments[6]!==void 0?arguments[6]:0;return 367*n-Math.floor(7*(n+Math.floor((e+9)/12))*.25)+Math.floor(275*e/9)+t+17210135e-1+((o/6e4+s/60+r)/60+i)/24}function Ea(n,e,t,i,r,s,o){if(n instanceof Date){var a=n;return hl(a.getUTCFullYear(),a.getUTCMonth()+1,a.getUTCDate(),a.getUTCHours(),a.getUTCMinutes(),a.getUTCSeconds(),a.getUTCMilliseconds())}return hl(n,e,t,i,r,s,o)}function $l(n,e){var t=n.e3,i=n.ee2,r=n.peo,s=n.pgho,o=n.pho,a=n.pinco,l=n.plo,c=n.se2,h=n.se3,u=n.sgh2,f=n.sgh3,m=n.sgh4,_=n.sh2,x=n.sh3,p=n.si2,d=n.si3,A=n.sl2,E=n.sl3,T=n.sl4,L=n.t,w=n.xgh2,R=n.xgh3,D=n.xgh4,y=n.xh2,M=n.xh3,C=n.xi2,O=n.xi3,z=n.xl2,Y=n.xl3,j=n.xl4,H=n.zmol,J=n.zmos,W=e.init,oe=e.opsmode,ue=e.ep,ce=e.inclp,ge=e.nodep,ke=e.argpp,K=e.mp,q,ee,re,Se,Te,Ae,P,Le,Ue,Re,fe,De,_e,pe,Be,b,v,B,Z,$,Q,ve=119459e-10,se=.01675,le=.00015835218,Ce=.0549;Q=J+ve*L,W==="y"&&(Q=J),$=Q+2*se*Math.sin(Q),v=Math.sin($),Re=.5*v*v-.25,fe=-.5*v*Math.cos($);var ie=c*Re+h*fe,xe=p*Re+d*fe,Ie=A*Re+E*fe+T*v,ye=u*Re+f*fe+m*v,he=_*Re+x*fe;Q=H+le*L,W==="y"&&(Q=H),$=Q+2*Ce*Math.sin(Q),v=Math.sin($),Re=.5*v*v-.25,fe=-.5*v*Math.cos($);var Fe=i*Re+t*fe,Ee=C*Re+O*fe,qe=z*Re+Y*fe+j*v,g=w*Re+R*fe+D*v,V=y*Re+M*fe;return De=ie+Fe,Be=xe+Ee,b=Ie+qe,_e=ye+g,pe=he+V,W==="n"&&(De-=r,Be-=a,b-=l,_e-=s,pe-=o,ce+=Be,ue+=De,Se=Math.sin(ce),re=Math.cos(ce),ce>=.2?(pe/=Se,_e-=re*pe,ke+=_e,ge+=pe,K+=b):(Ae=Math.sin(ge),Te=Math.cos(ge),q=Se*Ae,ee=Se*Te,P=pe*Te+Be*re*Ae,Le=-pe*Ae+Be*re*Te,q+=P,ee+=Le,ge%=ut,ge<0&&oe==="a"&&(ge+=ut),B=K+ke+re*ge,Ue=b+_e-Be*ge*Se,B+=Ue,Z=ge,ge=Math.atan2(q,ee),ge<0&&oe==="a"&&(ge+=ut),Math.abs(Z-ge)>cn&&(ge<Z?ge+=ut:ge-=ut),K+=b,ke=B-K-re*ge)),{ep:ue,inclp:ce,nodep:ge,argpp:ke,mp:K}}function Sg(n){var e=n.epoch,t=n.ep,i=n.argpp,r=n.tc,s=n.inclp,o=n.nodep,a=n.np,l,c,h,u,f,m,_,x,p,d,A,E,T,L,w,R,D,y,M,C,O,z,Y,j,H,J,W,oe,ue,ce,ge,ke,K,q,ee,re,Se,Te,Ae,P,Le,Ue,Re,fe,De,_e,pe,Be,b,v,B,Z,$,Q,ve,se,le,Ce,ie,xe,Ie,ye,he,Fe=.01675,Ee=.0549,qe=29864797e-13,g=47968065e-14,V=.39785416,F=.91744867,X=.1945905,te=-.98088458,we=a,Ne=t,Je=Math.sin(o),Qe=Math.cos(o),Ve=Math.sin(i),et=Math.cos(i),rt=Math.sin(s),de=Math.cos(s),nt=Ne*Ne,lt=1-nt,yt=Math.sqrt(lt),je=0,Pn=0,Qt=0,Ln=0,Dn=0,en=e+18261.5+r/1440,Bt=(4.523602-.00092422029*en)%ut,pt=Math.sin(Bt),S=Math.cos(Bt),U=.91375164-.03568096*S,G=Math.sqrt(1-U*U),k=.089683511*pt/G,N=Math.sqrt(1-k*k),ne=5.8351514+.001944368*en,me=.39785416*pt/G,be=N*S+.91744867*k*pt;me=Math.atan2(me,be),me+=ne-Bt;var Pe=Math.cos(me),He=Math.sin(me);C=X,O=te,j=F,H=V,z=Qe,Y=Je,A=qe;for(var Ge=1/we,ze=0;ze<2;)ze+=1,l=C*z+O*j*Y,h=-O*z+C*j*Y,_=-C*Y+O*j*z,x=O*H,p=O*Y+C*j*z,d=C*H,c=de*_+rt*x,u=de*p+rt*d,f=-rt*_+de*x,m=-rt*p+de*d,E=l*et+c*Ve,T=h*et+u*Ve,L=-l*Ve+c*et,w=-h*Ve+u*et,R=f*Ve,D=m*Ve,y=f*et,M=m*et,Ie=12*E*E-3*L*L,ye=24*E*T-6*L*w,he=12*T*T-3*w*w,Z=3*(l*l+c*c)+Ie*nt,$=6*(l*h+c*u)+ye*nt,Q=3*(h*h+u*u)+he*nt,ve=-6*l*f+nt*(-24*E*y-6*L*R),se=-6*(l*m+h*f)+nt*(-24*(T*y+E*M)+-6*(L*D+w*R)),le=-6*h*m+nt*(-24*T*M-6*w*D),Ce=6*c*f+nt*(24*E*R-6*L*y),ie=6*(u*f+c*m)+nt*(24*(T*R+E*D)-6*(w*y+L*M)),xe=6*u*m+nt*(24*T*D-6*w*M),Z=Z+Z+lt*Ie,$=$+$+lt*ye,Q=Q+Q+lt*he,pe=A*Ge,_e=-.5*pe/yt,Be=pe*yt,De=-15*Ne*Be,b=E*L+T*w,v=T*L+E*w,B=T*w-E*L,ze===1&&(J=De,W=_e,oe=pe,ue=Be,ce=b,ge=v,ke=B,K=Z,q=$,ee=Q,re=ve,Se=se,Te=le,Ae=Ce,P=ie,Le=xe,Ue=Ie,Re=ye,fe=he,C=Pe,O=He,j=U,H=G,z=N*Qe+k*Je,Y=Je*N-Qe*k,A=g);var Ze=(4.7199672+(.2299715*en-ne))%ut,at=(6.2565837+.017201977*en)%ut,ot=2*J*ge,mt=2*J*ke,$e=2*W*Se,Oe=2*W*(Te-re),_t=-2*oe*q,it=-2*oe*(ee-K),Ht=-2*oe*(-21-9*nt)*Fe,tn=2*ue*Re,nn=2*ue*(fe-Ue),jn=-18*ue*Fe,ht=-2*W*P,kt=-2*W*(Le-Ae),vn=2*De*v,Tt=2*De*B,$n=2*_e*se,ms=2*_e*(le-ve),Tr=-2*pe*$,yc=-2*pe*(Q-Z),Ec=-2*pe*(-21-9*nt)*Ee,Tc=2*Be*ye,bc=2*Be*(he-Ie),Ac=-18*Be*Ee,wc=-2*_e*ie,Rc=-2*_e*(xe-Ce);return{snodm:Je,cnodm:Qe,sinim:rt,cosim:de,sinomm:Ve,cosomm:et,day:en,e3:Tt,ee2:vn,em:Ne,emsq:nt,gam:ne,peo:je,pgho:Ln,pho:Dn,pinco:Pn,plo:Qt,rtemsq:yt,se2:ot,se3:mt,sgh2:tn,sgh3:nn,sgh4:jn,sh2:ht,sh3:kt,si2:$e,si3:Oe,sl2:_t,sl3:it,sl4:Ht,s1:De,s2:_e,s3:pe,s4:Be,s5:b,s6:v,s7:B,ss1:J,ss2:W,ss3:oe,ss4:ue,ss5:ce,ss6:ge,ss7:ke,sz1:K,sz2:q,sz3:ee,sz11:re,sz12:Se,sz13:Te,sz21:Ae,sz22:P,sz23:Le,sz31:Ue,sz32:Re,sz33:fe,xgh2:Tc,xgh3:bc,xgh4:Ac,xh2:wc,xh3:Rc,xi2:$n,xi3:ms,xl2:Tr,xl3:yc,xl4:Ec,nm:we,z1:Z,z2:$,z3:Q,z11:ve,z12:se,z13:le,z21:Ce,z22:ie,z23:xe,z31:Ie,z32:ye,z33:he,zmol:Ze,zmos:at}}function yg(n){var e=n.cosim,t=n.argpo,i=n.s1,r=n.s2,s=n.s3,o=n.s4,a=n.s5,l=n.sinim,c=n.ss1,h=n.ss2,u=n.ss3,f=n.ss4,m=n.ss5,_=n.sz1,x=n.sz3,p=n.sz11,d=n.sz13,A=n.sz21,E=n.sz23,T=n.sz31,L=n.sz33,w=n.t,R=n.tc,D=n.gsto,y=n.mo,M=n.mdot,C=n.no,O=n.nodeo,z=n.nodedot,Y=n.xpidot,j=n.z1,H=n.z3,J=n.z11,W=n.z13,oe=n.z21,ue=n.z23,ce=n.z31,ge=n.z33,ke=n.ecco,K=n.eccsq,q=n.emsq,ee=n.em,re=n.argpm,Se=n.inclm,Te=n.mm,Ae=n.nm,P=n.nodem,Le=n.irez,Ue=n.atime,Re=n.d2201,fe=n.d2211,De=n.d3210,_e=n.d3222,pe=n.d4410,Be=n.d4422,b=n.d5220,v=n.d5232,B=n.d5421,Z=n.d5433,$=n.dedt,Q=n.didt,ve=n.dmdt,se=n.dnodt,le=n.domdt,Ce=n.del1,ie=n.del2,xe=n.del3,Ie=n.xfact,ye=n.xlamo,he=n.xli,Fe=n.xni,Ee,qe,g,V,F,X,te,we,Ne,Je,Qe,Ve,et,rt,de,nt,lt,yt,je,Pn,Qt,Ln,Dn,en,Bt,pt,S,U,G,k,N,ne,me=17891679e-13,be=21460748e-13,Pe=22123015e-14,He=17891679e-13,Ge=73636953e-16,ze=21765803e-16,Ze=.0043752690880113,at=37393792e-14,ot=11428639e-14,mt=.00015835218,$e=119459e-10;Le=0,Ae<.0052359877&&Ae>.0034906585&&(Le=1),Ae>=.00826&&Ae<=.00924&&ee>=.5&&(Le=2);var Oe=c*$e*m,_t=h*$e*(p+d),it=-$e*u*(_+x-14-6*q),Ht=f*$e*(T+L-6),tn=-$e*h*(A+E);(Se<.052359877||Se>cn-.052359877)&&(tn=0),l!==0&&(tn/=l);var nn=Ht-e*tn;$=Oe+i*mt*a,Q=_t+r*mt*(J+W),ve=it-mt*s*(j+H-14-6*q);var jn=o*mt*(ce+ge-6),ht=-mt*r*(oe+ue);(Se<.052359877||Se>cn-.052359877)&&(ht=0),le=nn+jn,se=tn,l!==0&&(le-=e/l*ht,se+=ht/l);var kt=0,vn=(D+R*Ze)%ut;if(ee+=$*w,Se+=Q*w,re+=le*w,P+=se*w,Te+=ve*w,Le!==0){if(k=Math.pow(Ae/Cn,Mr),Le===2){N=e*e;var Tt=ee;ee=ke;var $n=q;q=K,ne=ee*q,rt=-.306-(ee-.64)*.44,ee<=.65?(de=3.616-13.247*ee+16.29*q,lt=-19.302+117.39*ee-228.419*q+156.591*ne,yt=-18.9068+109.7927*ee-214.6334*q+146.5816*ne,je=-41.122+242.694*ee-471.094*q+313.953*ne,Pn=-146.407+841.88*ee-1629.014*q+1083.435*ne,Qt=-532.114+3017.977*ee-5740.032*q+3708.276*ne):(de=-72.099+331.819*ee-508.738*q+266.724*ne,lt=-346.844+1582.851*ee-2415.925*q+1246.113*ne,yt=-342.585+1554.908*ee-2366.899*q+1215.972*ne,je=-1052.797+4758.686*ee-7193.992*q+3651.957*ne,Pn=-3581.69+16178.11*ee-24462.77*q+12422.52*ne,ee>.715?Qt=-5149.66+29936.92*ee-54087.36*q+31324.56*ne:Qt=1464.74-4664.75*ee+3763.64*q),ee<.7?(en=-919.2277+4988.61*ee-9064.77*q+5542.21*ne,Ln=-822.71072+4568.6173*ee-8491.4146*q+5337.524*ne,Dn=-853.666+4690.25*ee-8624.77*q+5341.4*ne):(en=-37995.78+161616.52*ee-229838.2*q+109377.94*ne,Ln=-51752.104+218913.95*ee-309468.16*q+146349.42*ne,Dn=-40023.88+170470.89*ee-242699.48*q+115605.82*ne),Bt=l*l,Ee=.75*(1+2*e+N),qe=1.5*Bt,V=1.875*l*(1-2*e-3*N),F=-1.875*l*(1+2*e-3*N),te=35*Bt*Ee,we=39.375*Bt*Bt,Ne=9.84375*l*(Bt*(1-2*e-5*N)+.33333333*(-2+4*e+6*N)),Je=l*(4.92187512*Bt*(-2-4*e+10*N)+6.56250012*(1+2*e-3*N)),Qe=29.53125*l*(2-8*e+N*(-12+8*e+10*N)),Ve=29.53125*l*(-2-8*e+N*(12+8*e-10*N)),U=Ae*Ae,G=k*k,S=3*U*G,pt=S*He,Re=pt*Ee*rt,fe=pt*qe*de,S*=k,pt=S*at,De=pt*V*lt,_e=pt*F*yt,S*=k,pt=2*S*Ge,pe=pt*te*je,Be=pt*we*Pn,S*=k,pt=S*ot,b=pt*Ne*Qt,v=pt*Je*Dn,pt=2*S*ze,B=pt*Qe*Ln,Z=pt*Ve*en,ye=(y+O+O-(vn+vn))%ut,Ie=M+ve+2*(z+se-Ze)-C,ee=Tt,q=$n}Le===1&&(et=1+q*(-2.5+.8125*q),lt=1+2*q,nt=1+q*(-6+6.60937*q),Ee=.75*(1+e)*(1+e),g=.9375*l*l*(1+3*e)-.75*(1+e),X=1+e,X*=1.875*X*X,Ce=3*Ae*Ae*k*k,ie=2*Ce*Ee*et*me,xe=3*Ce*X*nt*Pe*k,Ce=Ce*g*lt*be*k,ye=(y+O+t-vn)%ut,Ie=M+Y+ve+le+se-(C+Ze)),he=ye,Fe=C,Ue=0,Ae=C+kt}return{em:ee,argpm:re,inclm:Se,mm:Te,nm:Ae,nodem:P,irez:Le,atime:Ue,d2201:Re,d2211:fe,d3210:De,d3222:_e,d4410:pe,d4422:Be,d5220:b,d5232:v,d5421:B,d5433:Z,dedt:$,didt:Q,dmdt:ve,dndt:kt,dnodt:se,domdt:le,del1:Ce,del2:ie,del3:xe,xfact:Ie,xlamo:ye,xli:he,xni:Fe}}function dl(n){var e=(n-2451545)/36525,t=-62e-7*e*e*e+.093104*e*e+(876600*3600+8640184812866e-6)*e+67310.54841;return t=t*ur/240%ut,t<0&&(t+=ut),t}function Zl(){return(arguments.length<=0?void 0:arguments[0])instanceof Date||arguments.length>1?dl(Ea.apply(void 0,arguments)):dl.apply(void 0,arguments)}function Eg(n){var e=n.ecco,t=n.epoch,i=n.inclo,r=n.opsmode,s=n.no,o=e*e,a=1-o,l=Math.sqrt(a),c=Math.cos(i),h=c*c,u=Math.pow(Cn/s,Mr),f=.75*di*(3*h-1)/(l*a),m=f/(u*u),_=u*(1-m*m-m*(1/3+134*m*m/81));m=f/(_*_),s/=1+m;var x=Math.pow(Cn/s,Mr),p=Math.sin(i),d=x*a,A=1-5*h,E=-A-h-h,T=1/x,L=d*d,w=x*(1-e),R="n",D;if(r==="a"){var y=t-7305,M=Math.floor(y+1e-8),C=y-M,O=.017202791694070362,z=1.7321343856509375,Y=5075514194322695e-30,j=O+ut;D=(z+O*M+j*C+y*y*Y)%ut,D<0&&(D+=ut)}else D=Zl(t+24332815e-1);return{no:s,method:R,ainv:T,ao:x,con41:E,con42:A,cosio:c,cosio2:h,eccsq:o,omeosq:a,posq:L,rp:w,rteosq:l,sinio:p,gsto:D}}function Tg(n){var e=n.irez,t=n.d2201,i=n.d2211,r=n.d3210,s=n.d3222,o=n.d4410,a=n.d4422,l=n.d5220,c=n.d5232,h=n.d5421,u=n.d5433,f=n.dedt,m=n.del1,_=n.del2,x=n.del3,p=n.didt,d=n.dmdt,A=n.dnodt,E=n.domdt,T=n.argpo,L=n.argpdot,w=n.t,R=n.tc,D=n.gsto,y=n.xfact,M=n.xlamo,C=n.no,O=n.atime,z=n.em,Y=n.argpm,j=n.inclm,H=n.xli,J=n.mm,W=n.xni,oe=n.nodem,ue=n.nm,ce=.13130908,ge=2.8843198,ke=.37448087,K=5.7686396,q=.95240898,ee=1.8014998,re=1.050833,Se=4.4108898,Te=.0043752690880113,Ae=720,P=-720,Le=259200,Ue,Re,fe,De,_e,pe,Be,b,v=0,B=0,Z=(D+R*Te)%ut;if(z+=f*w,j+=p*w,Y+=E*w,oe+=A*w,J+=d*w,e!==0){(O===0||w*O<=0||Math.abs(w)<Math.abs(O))&&(O=0,W=C,H=M),w>0?Ue=Ae:Ue=P;for(var $=381;$===381;)e!==2?(Be=m*Math.sin(H-ce)+_*Math.sin(2*(H-ge))+x*Math.sin(3*(H-ke)),_e=W+y,pe=m*Math.cos(H-ce)+2*_*Math.cos(2*(H-ge))+3*x*Math.cos(3*(H-ke)),pe*=_e):(b=T+L*O,fe=b+b,Re=H+H,Be=t*Math.sin(fe+H-K)+i*Math.sin(H-K)+r*Math.sin(b+H-q)+s*Math.sin(-b+H-q)+o*Math.sin(fe+Re-ee)+a*Math.sin(Re-ee)+l*Math.sin(b+H-re)+c*Math.sin(-b+H-re)+h*Math.sin(b+Re-Se)+u*Math.sin(-b+Re-Se),_e=W+y,pe=t*Math.cos(fe+H-K)+i*Math.cos(H-K)+r*Math.cos(b+H-q)+s*Math.cos(-b+H-q)+l*Math.cos(b+H-re)+c*Math.cos(-b+H-re)+2*(o*Math.cos(fe+Re-ee)+a*Math.cos(Re-ee)+h*Math.cos(b+Re-Se)+u*Math.cos(-b+Re-Se)),pe*=_e),Math.abs(w-O)>=Ae?$=381:(B=w-O,$=0),$===381&&(H+=_e*Ue+Be*Le,W+=Be*Ue+pe*Le,O+=Ue);ue=W+Be*B+pe*B*B*.5,De=H+_e*B+Be*B*B*.5,e!==1?(J=De-2*oe+2*Z,v=ue-C):(J=De-oe-Y+Z,v=ue-C),ue=C+v}return{atime:O,em:z,argpm:Y,inclm:j,xli:H,mm:J,xni:W,nodem:oe,dndt:v,nm:ue}}function Jl(n,e){var t,i,r,s,o,a,l,c,h,u,f,m,_,x,p,d,A,E,T,L,w,R,D,y,M,C,O,z=15e-13;n.t=e,n.error=0;var Y=n.mo+n.mdot*n.t,j=n.argpo+n.argpdot*n.t,H=n.nodeo+n.nodedot*n.t;h=j,w=Y;var J=n.t*n.t;if(D=H+n.nodecf*J,A=1-n.cc1*n.t,E=n.bstar*n.cc4*n.t,T=n.t2cof*J,n.isimp!==1){l=n.omgcof*n.t;var W=1+n.eta*Math.cos(Y);a=n.xmcof*(W*W*W-n.delmo),d=l+a,w=Y+d,h=j-d,m=J*n.t,_=m*n.t,A=A-n.d2*J-n.d3*m-n.d4*_,E+=n.bstar*n.cc5*(Math.sin(w)-n.sinmao),T=T+n.t3cof*m+_*(n.t4cof+n.t*n.t5cof)}R=n.no;var oe=n.ecco;if(L=n.inclo,n.method==="d"){x=n.t;var ue={irez:n.irez,d2201:n.d2201,d2211:n.d2211,d3210:n.d3210,d3222:n.d3222,d4410:n.d4410,d4422:n.d4422,d5220:n.d5220,d5232:n.d5232,d5421:n.d5421,d5433:n.d5433,dedt:n.dedt,del1:n.del1,del2:n.del2,del3:n.del3,didt:n.didt,dmdt:n.dmdt,dnodt:n.dnodt,domdt:n.domdt,argpo:n.argpo,argpdot:n.argpdot,t:n.t,tc:x,gsto:n.gsto,xfact:n.xfact,xlamo:n.xlamo,no:n.no,atime:n.atime,em:oe,argpm:h,inclm:L,xli:n.xli,mm:w,xni:n.xni,nodem:D,nm:R},ce=Tg(ue);oe=ce.em,h=ce.argpm,L=ce.inclm,w=ce.mm,D=ce.nodem,R=ce.nm}if(R<=0)return n.error=2,[!1,!1];var ge=Math.pow(Cn/R,Mr)*A*A;if(R=Cn/Math.pow(ge,1.5),oe-=E,oe>=1||oe<-.001)return n.error=1,[!1,!1];oe<1e-6&&(oe=1e-6),w+=n.no*T,M=w+h+D,D%=ut,h%=ut,M%=ut,w=(M-h-D)%ut;var ke=Math.sin(L),K=Math.cos(L),q=oe;if(y=L,u=h,O=D,C=w,s=ke,r=K,n.method==="d"){var ee={inclo:n.inclo,init:"n",ep:q,inclp:y,nodep:O,argpp:u,mp:C,opsmode:n.operationmode},re=$l(n,ee);if(q=re.ep,O=re.nodep,u=re.argpp,C=re.mp,y=re.inclp,y<0&&(y=-y,O+=cn,u-=cn),q<0||q>1)return n.error=3,[!1,!1]}n.method==="d"&&(s=Math.sin(y),r=Math.cos(y),n.aycof=-.5*ui*s,Math.abs(r+1)>15e-13?n.xlcof=-.25*ui*s*(3+5*r)/(1+r):n.xlcof=-.25*ui*s*(3+5*r)/z);var Se=q*Math.cos(u);d=1/(ge*(1-q*q));var Te=q*Math.sin(u)+d*n.aycof,Ae=C+u+O+d*n.xlcof*Se,P=(Ae-O)%ut;c=P,p=9999.9;for(var Le=1;Math.abs(p)>=1e-12&&Le<=10;)i=Math.sin(c),t=Math.cos(c),p=1-t*Se-i*Te,p=(P-Te*t+Se*i-c)/p,Math.abs(p)>=.95&&(p>0?p=.95:p=-.95),c+=p,Le+=1;var Ue=Se*t+Te*i,Re=Se*i-Te*t,fe=Se*Se+Te*Te,De=ge*(1-fe);if(De<0)return n.error=4,[!1,!1];var _e=ge*(1-Ue),pe=Math.sqrt(ge)*Re/_e,Be=Math.sqrt(De)/_e,b=Math.sqrt(1-fe);d=Re/(1+b);var v=ge/_e*(i-Te-Se*d),B=ge/_e*(t-Se+Te*d);f=Math.atan2(v,B);var Z=(B+B)*v,$=1-2*v*v;d=1/De;var Q=.5*di*d,ve=Q*d;n.method==="d"&&(o=r*r,n.con41=3*o-1,n.x1mth2=1-o,n.x7thm1=7*o-1);var se=_e*(1-1.5*ve*b*n.con41)+.5*Q*n.x1mth2*$;if(se<1)return n.error=6,{position:!1,velocity:!1};f-=.25*ve*n.x7thm1*Z;var le=O+1.5*ve*r*Z,Ce=y+1.5*ve*r*s*$,ie=pe-R*Q*n.x1mth2*Z/Cn,xe=Be+R*Q*(n.x1mth2*$+1.5*n.con41)/Cn,Ie=Math.sin(f),ye=Math.cos(f),he=Math.sin(le),Fe=Math.cos(le),Ee=Math.sin(Ce),qe=Math.cos(Ce),g=-he*qe,V=Fe*qe,F=g*Ie+Fe*ye,X=V*Ie+he*ye,te=Ee*Ie,we=g*ye-Fe*Ie,Ne=V*ye-he*Ie,Je=Ee*ye,Qe={x:se*F*qt,y:se*X*qt,z:se*te*qt},Ve={x:(ie*F+xe*we)*$s,y:(ie*X+xe*Ne)*$s,z:(ie*te+xe*Je)*$s};return{position:Qe,velocity:Ve}}function bg(n,e){var t=e.opsmode,i=e.epoch,r=e.xbstar,s=e.xecco,o=e.xargpo,a=e.xinclo,l=e.xmo,c=e.xno,h=e.xnodeo,u,f,m,_,x,p,d,A,E,T,L,w,R,D,y,M,C,O,z,Y,j,H,J,W,oe,ue,ce,ge,ke,K,q,ee,re,Se,Te,Ae,P,Le,Ue,Re,fe,De,_e,pe,Be,b,v,B,Z,$,Q,ve,se,le,Ce,ie,xe=15e-13;n.isimp=0,n.method="n",n.aycof=0,n.con41=0,n.cc1=0,n.cc4=0,n.cc5=0,n.d2=0,n.d3=0,n.d4=0,n.delmo=0,n.eta=0,n.argpdot=0,n.omgcof=0,n.sinmao=0,n.t=0,n.t2cof=0,n.t3cof=0,n.t4cof=0,n.t5cof=0,n.x1mth2=0,n.x7thm1=0,n.mdot=0,n.nodedot=0,n.xlcof=0,n.xmcof=0,n.nodecf=0,n.irez=0,n.d2201=0,n.d2211=0,n.d3210=0,n.d3222=0,n.d4410=0,n.d4422=0,n.d5220=0,n.d5232=0,n.d5421=0,n.d5433=0,n.dedt=0,n.del1=0,n.del2=0,n.del3=0,n.didt=0,n.dmdt=0,n.dnodt=0,n.domdt=0,n.e3=0,n.ee2=0,n.peo=0,n.pgho=0,n.pho=0,n.pinco=0,n.plo=0,n.se2=0,n.se3=0,n.sgh2=0,n.sgh3=0,n.sgh4=0,n.sh2=0,n.sh3=0,n.si2=0,n.si3=0,n.sl2=0,n.sl3=0,n.sl4=0,n.gsto=0,n.xfact=0,n.xgh2=0,n.xgh3=0,n.xgh4=0,n.xh2=0,n.xh3=0,n.xi2=0,n.xi3=0,n.xl2=0,n.xl3=0,n.xl4=0,n.xlamo=0,n.zmol=0,n.zmos=0,n.atime=0,n.xli=0,n.xni=0,n.bstar=r,n.ecco=s,n.argpo=o,n.inclo=a,n.mo=l,n.no=c,n.nodeo=h,n.operationmode=t;var Ie=78/qt+1,ye=42/qt,he=ye*ye*ye*ye;n.init="y",n.t=0;var Fe={ecco:n.ecco,epoch:i,inclo:n.inclo,no:n.no,method:n.method,opsmode:n.operationmode},Ee=Eg(Fe),qe=Ee.ao,g=Ee.con42,V=Ee.cosio,F=Ee.cosio2,X=Ee.eccsq,te=Ee.omeosq,we=Ee.posq,Ne=Ee.rp,Je=Ee.rteosq,Qe=Ee.sinio;if(n.no=Ee.no,n.con41=Ee.con41,n.gsto=Ee.gsto,n.a=Math.pow(n.no*_g,-2/3),n.alta=n.a*(1+n.ecco)-1,n.altp=n.a*(1-n.ecco)-1,n.error=0,te>=0||n.no>=0){if(n.isimp=0,Ne<220/qt+1&&(n.isimp=1),ce=Ie,j=he,O=(Ne-1)*qt,O<156){ce=O-78,O<98&&(ce=20);var Ve=(120-ce)/qt;j=Ve*Ve*Ve*Ve,ce=ce/qt+1}z=1/we,b=1/(qe-ce),n.eta=qe*n.ecco*b,w=n.eta*n.eta,L=n.ecco*n.eta,Y=Math.abs(1-w),p=j*Math.pow(b,4),d=p/Math.pow(Y,3.5),_=d*n.no*(qe*(1+1.5*w+L*(4+w))+.375*di*b/Y*n.con41*(8+3*w*(8+w))),n.cc1=n.bstar*_,x=0,n.ecco>1e-4&&(x=-2*p*b*ui*n.no*Qe/n.ecco),n.x1mth2=1-F,n.cc4=2*n.no*d*qe*te*(n.eta*(2+.5*w)+n.ecco*(.5+2*w)-di*b/(qe*Y)*(-3*n.con41*(1-2*L+w*(1.5-.5*L))+.75*n.x1mth2*(2*w-L*(1+w))*Math.cos(2*n.argpo))),n.cc5=2*d*qe*te*(1+2.75*(w+L)+L*w),A=F*F,_e=1.5*di*z*n.no,pe=.5*_e*di*z,Be=-.46875*xg*z*z*n.no,n.mdot=n.no+.5*_e*Je*n.con41+.0625*pe*Je*(13-78*F+137*A),n.argpdot=-.5*_e*g+.0625*pe*(7-114*F+395*A)+Be*(3-36*F+49*A),B=-_e*V,n.nodedot=B+(.5*pe*(4-19*F)+2*Be*(3-7*F))*V,v=n.argpdot+n.nodedot,n.omgcof=n.bstar*x*Math.cos(n.argpo),n.xmcof=0,n.ecco>1e-4&&(n.xmcof=-Mr*p*n.bstar/L),n.nodecf=3.5*te*B*n.cc1,n.t2cof=1.5*n.cc1,Math.abs(V+1)>15e-13?n.xlcof=-.25*ui*Qe*(3+5*V)/(1+V):n.xlcof=-.25*ui*Qe*(3+5*V)/xe,n.aycof=-.5*ui*Qe;var et=1+n.eta*Math.cos(n.mo);if(n.delmo=et*et*et,n.sinmao=Math.sin(n.mo),n.x7thm1=7*F-1,2*cn/n.no>=225){n.method="d",n.isimp=1,fe=0,y=n.inclo;var rt={epoch:i,ep:n.ecco,argpp:n.argpo,tc:fe,inclp:n.inclo,nodep:n.nodeo,np:n.no,e3:n.e3,ee2:n.ee2,peo:n.peo,pgho:n.pgho,pho:n.pho,pinco:n.pinco,plo:n.plo,se2:n.se2,se3:n.se3,sgh2:n.sgh2,sgh3:n.sgh3,sgh4:n.sgh4,sh2:n.sh2,sh3:n.sh3,si2:n.si2,si3:n.si3,sl2:n.sl2,sl3:n.sl3,sl4:n.sl4,xgh2:n.xgh2,xgh3:n.xgh3,xgh4:n.xgh4,xh2:n.xh2,xh3:n.xh3,xi2:n.xi2,xi3:n.xi3,xl2:n.xl2,xl3:n.xl3,xl4:n.xl4,zmol:n.zmol,zmos:n.zmos},de=Sg(rt);n.e3=de.e3,n.ee2=de.ee2,n.peo=de.peo,n.pgho=de.pgho,n.pho=de.pho,n.pinco=de.pinco,n.plo=de.plo,n.se2=de.se2,n.se3=de.se3,n.sgh2=de.sgh2,n.sgh3=de.sgh3,n.sgh4=de.sgh4,n.sh2=de.sh2,n.sh3=de.sh3,n.si2=de.si2,n.si3=de.si3,n.sl2=de.sl2,n.sl3=de.sl3,n.sl4=de.sl4,f=de.sinim,u=de.cosim,E=de.em,T=de.emsq,H=de.s1,J=de.s2,W=de.s3,oe=de.s4,ue=de.s5,ge=de.ss1,ke=de.ss2,K=de.ss3,q=de.ss4,ee=de.ss5,re=de.sz1,Se=de.sz3,Te=de.sz11,Ae=de.sz13,P=de.sz21,Le=de.sz23,Ue=de.sz31,Re=de.sz33,n.xgh2=de.xgh2,n.xgh3=de.xgh3,n.xgh4=de.xgh4,n.xh2=de.xh2,n.xh3=de.xh3,n.xi2=de.xi2,n.xi3=de.xi3,n.xl2=de.xl2,n.xl3=de.xl3,n.xl4=de.xl4,n.zmol=de.zmol,n.zmos=de.zmos,C=de.nm,Z=de.z1,$=de.z3,Q=de.z11,ve=de.z13,se=de.z21,le=de.z23,Ce=de.z31,ie=de.z33;var nt={inclo:y,init:n.init,ep:n.ecco,inclp:n.inclo,nodep:n.nodeo,argpp:n.argpo,mp:n.mo,opsmode:n.operationmode},lt=$l(n,nt);n.ecco=lt.ep,n.inclo=lt.inclp,n.nodeo=lt.nodep,n.argpo=lt.argpp,n.mo=lt.mp,R=0,D=0,M=0;var yt={cosim:u,emsq:T,argpo:n.argpo,s1:H,s2:J,s3:W,s4:oe,s5:ue,sinim:f,ss1:ge,ss2:ke,ss3:K,ss4:q,ss5:ee,sz1:re,sz3:Se,sz11:Te,sz13:Ae,sz21:P,sz23:Le,sz31:Ue,sz33:Re,t:n.t,tc:fe,gsto:n.gsto,mo:n.mo,mdot:n.mdot,no:n.no,nodeo:n.nodeo,nodedot:n.nodedot,xpidot:v,z1:Z,z3:$,z11:Q,z13:ve,z21:se,z23:le,z31:Ce,z33:ie,ecco:n.ecco,eccsq:X,em:E,argpm:R,inclm:y,mm:M,nm:C,nodem:D,irez:n.irez,atime:n.atime,d2201:n.d2201,d2211:n.d2211,d3210:n.d3210,d3222:n.d3222,d4410:n.d4410,d4422:n.d4422,d5220:n.d5220,d5232:n.d5232,d5421:n.d5421,d5433:n.d5433,dedt:n.dedt,didt:n.didt,dmdt:n.dmdt,dnodt:n.dnodt,domdt:n.domdt,del1:n.del1,del2:n.del2,del3:n.del3,xfact:n.xfact,xlamo:n.xlamo,xli:n.xli,xni:n.xni},je=yg(yt);n.irez=je.irez,n.atime=je.atime,n.d2201=je.d2201,n.d2211=je.d2211,n.d3210=je.d3210,n.d3222=je.d3222,n.d4410=je.d4410,n.d4422=je.d4422,n.d5220=je.d5220,n.d5232=je.d5232,n.d5421=je.d5421,n.d5433=je.d5433,n.dedt=je.dedt,n.didt=je.didt,n.dmdt=je.dmdt,n.dnodt=je.dnodt,n.domdt=je.domdt,n.del1=je.del1,n.del2=je.del2,n.del3=je.del3,n.xfact=je.xfact,n.xlamo=je.xlamo,n.xli=je.xli,n.xni=je.xni}n.isimp!==1&&(m=n.cc1*n.cc1,n.d2=4*qe*b*m,De=n.d2*b*n.cc1/3,n.d3=(17*qe+ce)*De,n.d4=.5*De*qe*b*(221*qe+31*ce)*n.cc1,n.t3cof=n.d2+2*m,n.t4cof=.25*(3*n.d3+n.cc1*(12*n.d2+10*m)),n.t5cof=.2*(3*n.d4+12*n.cc1*n.d3+6*n.d2*n.d2+15*m*(2*n.d2+m)))}Jl(n,0),n.init="n"}function Ag(n,e){var t="i",i=1440/(2*cn),r=0,s={};s.error=0,s.satnum=n.substring(2,7),s.epochyr=parseInt(n.substring(18,20),10),s.epochdays=parseFloat(n.substring(20,32)),s.ndot=parseFloat(n.substring(33,43)),s.nddot=parseFloat(".".concat(parseInt(n.substring(44,50),10),"E").concat(n.substring(50,52))),s.bstar=parseFloat("".concat(n.substring(53,54),".").concat(parseInt(n.substring(54,59),10),"E").concat(n.substring(59,61))),s.inclo=parseFloat(e.substring(8,16)),s.nodeo=parseFloat(e.substring(17,25)),s.ecco=parseFloat(".".concat(e.substring(26,33))),s.argpo=parseFloat(e.substring(34,42)),s.mo=parseFloat(e.substring(43,51)),s.no=parseFloat(e.substring(52,63)),s.no/=i,s.inclo*=ur,s.nodeo*=ur,s.argpo*=ur,s.mo*=ur,s.epochyr<57?r=s.epochyr+2e3:r=s.epochyr+1900;var o=Mg(r,s.epochdays),a=o.mon,l=o.day,c=o.hr,h=o.minute,u=o.sec;return s.jdsatepoch=Ea(r,a,l,c,h,u),bg(s,{opsmode:t,satn:s.satnum,epoch:s.jdsatepoch-24332815e-1,xbstar:s.bstar,xecco:s.ecco,xargpo:s.argpo,xinclo:s.inclo,xmo:s.mo,xno:s.no,xnodeo:s.nodeo}),s}function wg(n){return Rg(n)||Cg(n)||Pg(n)||Lg()}function Rg(n){if(Array.isArray(n))return oa(n)}function Cg(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function Pg(n,e){if(n){if(typeof n=="string")return oa(n,e);var t=Object.prototype.toString.call(n).slice(8,-1);if(t==="Object"&&n.constructor&&(t=n.constructor.name),t==="Map"||t==="Set")return Array.from(n);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return oa(n,e)}}function oa(n,e){(e==null||e>n.length)&&(e=n.length);for(var t=0,i=new Array(e);t<e;t++)i[t]=n[t];return i}function Lg(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Dg(){for(var n=arguments.length,e=new Array(n),t=0;t<n;t++)e[t]=arguments[t];var i=e[0],r=Array.prototype.slice.call(e,1),s=Ea.apply(void 0,wg(r)),o=(s-i.jdsatepoch)*mg;return Jl(i,o)}function Ig(n,e){for(var t=6378.137,i=6356.7523142,r=Math.sqrt(n.x*n.x+n.y*n.y),s=(t-i)/t,o=2*s-s*s,a=Math.atan2(n.y,n.x)-e;a<-cn;)a+=ut;for(;a>cn;)a-=ut;for(var l=20,c=0,h=Math.atan2(n.z,Math.sqrt(n.x*n.x+n.y*n.y)),u;c<l;)u=1/Math.sqrt(1-o*(Math.sin(h)*Math.sin(h))),h=Math.atan2(n.z+t*u*o*Math.sin(h),r),c+=1;var f=r/Math.cos(h)-t*u;return{longitude:a,latitude:h,height:f}}const ul={ENG:{title:"⬡ FALCON 9 TRACKER",subtitle:"Ultimate Realism · SpaceX Falcon 9",targetAcquired:"TARGET ACQUIRED",systemStatus:"System Status",techSpecs:"TECHNICAL SPECIFICATIONS",gestures:"MAGIC GESTURES (1-HAND)",openHandKey:"Open Hand",openHandAction:"Rotate Rocket",pointingKey:"Pointing",pointingAction:"Select Part",pinchKey:"Pinch",pinchAction:"Grab & Drag Part",peaceKey:"Peace",peaceAction:"Zoom In/Out",thumbsUpKey:"Thumbs Up",thumbsUpAction:"Assemble Rocket",thumbsDownKey:"Thumbs Down",thumbsDownAction:"Explode Rocket",sabrKey:"Sabr",sabrAction:"X-Ray Skeleton Mode",aiSensor:"AI SENSOR",enableCam:"Click to enable camera",startSensor:"✋ START SENSOR",stopSensor:"⛔ STOP SENSOR",initializing:"FALCON 9 INITIALIZING",loadingTextures:"Loading ultra-realistic PBR textures...",noHand:"— NO HAND —",trackingHand:"✅ Tracking 1 Hand",status:{nominal:"Nominal",active:"Active",stowed:"Stowed",pressurized:"Pressurized",intact:"Intact",stable:"Stable",ignited:"Ignited",standby:"Standby",fueled:"Fueled",sealed:"Sealed",armed:"Armed",locked:"Locked"},stats:{material:"Material",propellant:"Propellant",dryMass:"Dry Mass",height:"Height",components:"Components",shielding:"Shielding",dataRate:"Data Rate",deployment:"Deployment",span:"Span",pressure:"Pressure",gas:"Gas",force:"Force",maxTemp:"Max Temp",config:"Configuration",maxLoad:"Max Load",thrust:"Thrust",isp:"ISP",cycle:"Cycle",gimbal:"Gimbal",restarts:"Restarts",pusher:"Pusher",purpose:"Purpose",actuation:"Actuation",fluid:"Fluid",mass:"Mass",propMass:"Propellant Mass",burnTime:"Burn Time",expansion:"Expansion Ratio",separation:"Separation",diameter:"Diameter",capacity:"Payload Capacity",heatShield:"Heat Shield",recovery:"Recovery",type:"Type"},parts:{booster:{name:"FIRST STAGE BOOSTER",desc:"Reusable booster fuel tank containing RP-1 and LOX."},raceway:{name:"AVIONICS RACEWAY",desc:"Houses critical wiring, telemetry cables and avionics along the booster body."},leg:{name:"LANDING LEG",desc:"Carbon fiber landing leg for vertical propulsive landing."},actuator:{name:"DEPLOYMENT ACTUATOR",desc:"High-pressure helium actuator to deploy the landing leg."},octaweb:{name:"OCTAWEB SHIELD",desc:"Protective heat shield covering the engine compartment during reentry."},thrustStructure:{name:"THRUST STRUCTURE",desc:"Distributes the massive thrust force from the engines to the booster."},merlin1d:{name:"MERLIN 1D ENGINE",desc:"Sea-level optimized rocket engine."},merlinCenter:{name:"MERLIN 1D (CENTER)",desc:"Center engine used for initial boost, reentry burn, and landing."},interstage:{name:"CARBON INTERSTAGE",desc:"Connects stages. Made of carbon composite material."},rcs:{name:"RCS THRUSTER BLOCK",desc:"Nitrogen gas thruster used to flip and orient the booster."},hinge:{name:"GRID FIN HINGE",desc:"Heavy-duty hinge mechanism connecting the grid fin."},gridFin:{name:"TITANIUM GRID FIN",desc:"Heat-resistant aerodynamic fin used to steer the booster."},secondStage:{name:"SECOND STAGE TANK",desc:"Upper stage carrying LOX and RP-1 for the vacuum engine."},merlinVac:{name:"MERLIN VACUUM (MVac)",desc:"Highly expanded nozzle optimized for vacuum efficiency."},fairingBase:{name:"FAIRING BASE RING",desc:"Pneumatic separation interface between second stage and payload."},fairingBody:{name:"PAYLOAD FAIRING (BODY)",desc:"Carbon composite shell protecting the satellite payload."},fairingNose:{name:"FAIRING (NOSE CONE)",desc:"Aerodynamic tip reducing drag during atmospheric ascent."},sepJoint:{name:"SEPARATION JOINT",desc:"Explosive bolts and pneumatic pushers to split the fairing in half."}}},UZB:{title:"⬡ FALCON 9 KUZATUVCHISI",subtitle:"Maksimal Reallik · SpaceX Falcon 9",targetAcquired:"MAQSAD ANIQLANDI",systemStatus:"Tizim Holati",techSpecs:"TEXNIK XUSUSIYATLAR",gestures:"MOJIZAVIY IMO-ISHORALAR (1 QO'L)",openHandKey:"Ochiq Qo'l",openHandAction:"Raketani Aylantirish",pointingKey:"Ko'rsatish",pointingAction:"Qismni Tanlash",pinchKey:"Chirpay",pinchAction:"Qismni Ushlash va Sudrash",peaceKey:"Tinchlik",peaceAction:"Yaqinlashtirish/Uzoqlashtirish",thumbsUpKey:"Zo'r",thumbsUpAction:"Raketani Yig'ish",thumbsDownKey:"Yomon",thumbsDownAction:"Raketani Bo'laklash",sabrKey:"Sabr",sabrAction:"Rentgen Sklet Rejimi",aiSensor:"AI SENSORI",enableCam:"Kamerani yoqish uchun bosing",startSensor:"✋ SENSORNI BOSHLASH",stopSensor:"⛔ SENSORNI TO'XTATISH",initializing:"FALCON 9 TAYYORLANMOQDA",loadingTextures:"Ultra-realistik PBR teksturalar yuklanmoqda...",noHand:"— QO'L ANIQLANMADI —",trackingHand:"✅ 1 ta qo'l kuzatilmoqda",status:{nominal:"Nominal",active:"Faol",stowed:"Yig'ilgan",pressurized:"Bosim Ostida",intact:"Butun",stable:"Barqaror",ignited:"Yoqilgan",standby:"Kutishda",fueled:"Yoqilg'i Bilan",sealed:"Yopiq",armed:"Qurollangan",locked:"Qulflangan"},stats:{material:"Material",propellant:"Yoqilg'i",dryMass:"Quruq Massasi",height:"Balandligi",components:"Tarkibiy Qismlar",shielding:"Himoya Qatlami",dataRate:"Ma'lumot Uzatish",deployment:"Ochilishi",span:"Kengligi",pressure:"Bosim",gas:"Gaz",force:"Kuch",maxTemp:"Maksimal Harorat",config:"Konfiguratsiya",maxLoad:"Maksimal Yuk",thrust:"Tortish Kuchi",isp:"ISP (Solishtirma Impuls)",cycle:"Sikl",gimbal:"Gimbal (Burilish)",restarts:"Qayta Ishga Tushirish",pusher:"Itargich",purpose:"Maqsadi",actuation:"Yuritma",fluid:"Suyuqlik",mass:"Massasi",propMass:"Yoqilg'i Massasi",burnTime:"Yonish Vaqti",expansion:"Kengayish Koeffitsienti",separation:"Ajralish",diameter:"Diametri",capacity:"Yuk Ko'tarish Quvvati",heatShield:"Issiqlik Qalqoni",recovery:"Qaytarib Olish",type:"Turi"},parts:{booster:{name:"BIRINCHI BOSQICH TEZLATGICHI",desc:"RP-1 va LOX o'z ichiga olgan qayta ishlatiladigan yonilg'i baki."},raceway:{name:"AVIONIKA KANALI",desc:"Booster tanasi bo'ylab muhim simlar, telemetriya kabellari va avionika joylashgan."},leg:{name:"QO'NISH OYOG'I",desc:"Vertikal qo'nish uchun uglerod tolali qo'nish oyog'i."},actuator:{name:"OYOQ YURITMASI",desc:"Qo'nish oyog'ini ochish uchun yuqori bosimli geliy yuritmasi."},octaweb:{name:"OCTAWEB QALQONI",desc:"Qayta kirish paytida dvigatel bo'linmasini yopuvchi himoya issiqlik qalqoni."},thrustStructure:{name:"TORTISH TUZILMASI",desc:"Dvigatellarning ulkan tortish kuchini raketaga taqsimlaydi."},merlin1d:{name:"MERLIN 1D DVIGATELI",desc:"Dengiz sathi uchun optimallashtirilgan raketa dvigateli."},merlinCenter:{name:"MERLIN 1D (MARKAZIY)",desc:"Dastlabki ko'tarilish, qayta kirish va qo'nish uchun ishlatiladigan markaziy dvigatel."},interstage:{name:"UGLERODLI BOSQICHLARARO QISM",desc:"Bosqichlarni birlashtiradi. Uglerodli kompozit materialdan tayyorlangan."},rcs:{name:"RCS YO'NALISH DVIGATELI",desc:"Raketani aylantirish va yo'naltirish uchun ishlatiladigan azotli dvigatel."},hinge:{name:"GRID FIN SHARNIRI",desc:"Grid finni birlashtiruvchi og'ir yuk sharnir mexanizmi."},gridFin:{name:"TITANLI GRID FIN",desc:"Raketani boshqarish uchun ishlatiladigan issiqqa chidamli aerodinamik qanot."},secondStage:{name:"IKKINCHI BOSQICH BAKI",desc:"Vakuum dvigateli uchun LOX va RP-1 tashiydigan yuqori bosqich."},merlinVac:{name:"MERLIN VACUUM (MVac)",desc:"Vakuum samaradorligi uchun optimallashtirilgan kengaytirilgan nozula."},fairingBase:{name:"QOPLAMA ASOSI HALQASI",desc:"Ikkinchi bosqich va foydali yuk o'rtasidagi pnevmatik ajralish interfeysi."},fairingBody:{name:"FOYDALI YUK QOPLAMASI (TANA)",desc:"Sun'iy yo'ldoshni himoya qiluvchi uglerodli kompozit qobiq."},fairingNose:{name:"QOPLAMA (BURUN QISMI)",desc:"Atmosfera bo'ylab ko'tarilishda qarshilikni kamaytiradigan uch qismi."},sepJoint:{name:"AJRALISH BO'G'INI",desc:"Qoplamani ikkiga bo'lish uchun portlovchi boltlar va pnevmatik itargichlar."}}},RUS:{title:"⬡ FALCON 9 ТРЕКЕР",subtitle:"Ультимативный Реализм · SpaceX Falcon 9",targetAcquired:"ЦЕЛЬ ЗАХВАЧЕНА",systemStatus:"Статус Системы",techSpecs:"ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ",gestures:"МАГИЧЕСКИЕ ЖЕСТЫ (1 РУКА)",openHandKey:"Открытая ладонь",openHandAction:"Вращать Ракету",pointingKey:"Указание",pointingAction:"Выбрать Деталь",pinchKey:"Щипок",pinchAction:"Схватить и Тащить",peaceKey:"Мир",peaceAction:"Зум +/-",thumbsUpKey:"Класс",thumbsUpAction:"Собрать Ракету",thumbsDownKey:"Плохо",thumbsDownAction:"Разобрать Ракету",sabrKey:"Сабр",sabrAction:"Рентген-режим",aiSensor:"ИИ-СЕНСОР",enableCam:"Нажмите для включения камеры",startSensor:"✋ ВКЛЮЧИТЬ СЕНСОР",stopSensor:"⛔ ВЫКЛЮЧИТЬ СЕНСОР",initializing:"FALCON 9 ИНИЦИАЛИЗАЦИЯ",loadingTextures:"Загрузка ультра-реалистичных PBR текстур...",noHand:"— РУКА НЕ НАЙДЕНА —",trackingHand:"✅ Отслеживание 1 руки",status:{nominal:"Номинально",active:"Активно",stowed:"Сложено",pressurized:"Под давлением",intact:"Цело",stable:"Стабильно",ignited:"Запущено",standby:"Ожидание",fueled:"Заправлено",sealed:"Герметично",armed:"Готово",locked:"Заблокировано"},stats:{material:"Материал",propellant:"Топливо",dryMass:"Сухая Масса",height:"Высота",components:"Компоненты",shielding:"Экранирование",dataRate:"Скорость Данных",deployment:"Развертывание",span:"Размах",pressure:"Давление",gas:"Газ",force:"Сила",maxTemp:"Макс. Температура",config:"Конфигурация",maxLoad:"Макс. Нагрузка",thrust:"Тяга",isp:"Удельный Импульс",cycle:"Цикл",gimbal:"Подвес (Gimbal)",restarts:"Повторные запуски",pusher:"Толкатель",purpose:"Назначение",actuation:"Привод",fluid:"Жидкость",mass:"Масса",propMass:"Масса Топлива",burnTime:"Время Горения",expansion:"Степень Расширения",separation:"Разделение",diameter:"Диаметр",capacity:"Грузоподъемность",heatShield:"Тепловой Щит",recovery:"Возврат",type:"Тип"},parts:{booster:{name:"ПЕРВАЯ СТУПЕНЬ (БУСТЕР)",desc:"Многоразовый топливный бак с RP-1 и LOX."},raceway:{name:"КАНАЛ АВИОНИКИ",desc:"Содержит критическую проводку, кабели телеметрии и авионику вдоль корпуса."},leg:{name:"ПОСАДОЧНАЯ ОПОРА",desc:"Углеволоконная опора для вертикальной реактивной посадки."},actuator:{name:"ПРИВОД ОПОРЫ",desc:"Гелиевый привод высокого давления для выпуска посадочной опоры."},octaweb:{name:"ЩИТ OCTAWEB",desc:"Защитный тепловой щит, закрывающий двигательный отсек при входе в атмосферу."},thrustStructure:{name:"СИЛОВАЯ КОНСТРУКЦИЯ",desc:"Распределяет огромную силу тяги от двигателей на корпус бустера."},merlin1d:{name:"ДВИГАТЕЛЬ MERLIN 1D",desc:"Ракетный двигатель, оптимизированный для работы на уровне моря."},merlinCenter:{name:"MERLIN 1D (ЦЕНТР)",desc:"Центральный двигатель, используемый для разгона, входа в атмосферу и посадки."},interstage:{name:"УГЛЕРОДНЫЙ МЕЖСТУПЕНЬ",desc:"Соединяет ступени. Изготовлен из углеродного композита."},rcs:{name:"БЛОК ДВИГАТЕЛЕЙ RCS",desc:"Азотный двигатель для переворота и ориентации бустера."},hinge:{name:"ШАРНИР РЕШЕТЧАТОГО РУЛЯ",desc:"Мощный шарнирный механизм, соединяющий решетчатый руль."},gridFin:{name:"ТИТАНОВЫЙ РУЛЬ",desc:"Термостойкий аэродинамический руль для управления бустером."},secondStage:{name:"БАК ВТОРОЙ СТУПЕНИ",desc:"Верхняя ступень, несущая LOX и RP-1 для вакуумного двигателя."},merlinVac:{name:"MERLIN VACUUM (MVac)",desc:"Сильно расширенное сопло, оптимизированное для эффективности в вакууме."},fairingBase:{name:"ОСНОВАНИЕ ОБТЕКАТЕЛЯ",desc:"Пневматический интерфейс разделения между второй ступенью и нагрузкой."},fairingBody:{name:"ПОЛЕЗНЫЙ ОБТЕКАТЕЛЬ (КОРПУС)",desc:"Углекомпозитная оболочка, защищающая полезную нагрузку."},fairingNose:{name:"ОБТЕКАТЕЛЬ (НОСОВОЙ КОНУС)",desc:"Аэродинамический наконечник, снижающий сопротивление воздуха."},sepJoint:{name:"СТЫК РАЗДЕЛЕНИЯ",desc:"Разрывные болты и пневмотолкатели для разделения обтекателя."}}}},ae=ul[lang]||ul.ENG,Ug=document.querySelector("#app");Ug.innerHTML=`
  <canvas id="scene"></canvas>
  <div id="scanline"></div>
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  
  <div id="virtual-cursor"></div>

  <div class="hud top-left">
    <h1>${ae.title}</h1>
    <p>${ae.subtitle}</p>
  </div>

  <div class="hud top-right" id="rocket-inspector" style="display: none; width: 320px;">
    <div class="panel-title" style="margin-bottom: 8px; color: #a78bfa;">${ae.targetAcquired}</div>
    <h2 id="part-name" style="font-family:'Orbitron'; font-size:1.2rem; color:#60a5fa; margin-bottom:8px; text-transform: uppercase;">—</h2>
    
    <div class="metric"><span>${ae.systemStatus}</span><strong id="part-status" class="green">—</strong></div>
    
    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(96, 165, 250, 0.2);">
      <div style="font-size: 0.85rem; color: #a78bfa; margin-bottom: 6px;">${ae.techSpecs}</div>
      <table style="width: 100%; font-size: 0.8rem; color: #cbd5e1; border-collapse: collapse;" id="part-stats-table">
        <!-- Stats will be injected here -->
      </table>
    </div>

    <div style="font-size:0.8rem; color:#94a3b8; margin-top:12px; line-height:1.5; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; border-left: 2px solid #60a5fa;" id="part-desc">—</div>
  </div>

  <div class="hud bottom-left">
    <strong>${ae.gestures}</strong>
    <p><span class="key">🖐 ${ae.openHandKey}</span> ${ae.openHandAction}</p>
    <p><span class="key">☝️ ${ae.pointingKey}</span> ${ae.pointingAction}</p>
    <p><span class="key">🤏 ${ae.pinchKey}</span> ${ae.pinchAction}</p>
    <p><span class="key">✌️ ${ae.peaceKey}</span> ${ae.peaceAction}</p>
    <p><span class="key">👍 ${ae.thumbsUpKey}</span> ${ae.thumbsUpAction}</p>
    <p><span class="key">👎 ${ae.thumbsDownKey}</span> ${ae.thumbsDownAction}</p>
    <p><span class="key">☝️ ${ae.sabrKey}</span> ${ae.sabrAction}</p>
  </div>

  <div class="hud" id="gesture-panel">
    <div class="panel-title">${ae.aiSensor}</div>
    <div class="gesture-video-wrap">
      <video id="gesture-video" playsinline autoplay muted></video>
      <canvas id="gesture-canvas"></canvas>
    </div>
    <div id="gesture-status">${ae.enableCam}</div>
    <div id="gesture-label">—</div>
    <button class="gesture-toggle" id="gesture-btn">${ae.startSensor}</button>
  </div>

  <div id="loading">
    <div class="loading-ring"></div>
    <h2>${ae.initializing}</h2>
    <p id="loading-msg">${ae.loadingTextures}</p>
  </div>
`;const Ng=document.querySelector("#scene"),gn=new ng({canvas:Ng,antialias:!0,alpha:!1});gn.setPixelRatio(Math.min(devicePixelRatio,2));gn.setSize(innerWidth,innerHeight);gn.toneMapping=_l;gn.toneMappingExposure=1.3;gn.shadowMap.enabled=!0;gn.shadowMap.type=ml;const Jt=new Xl;Jt.background=new tt(65795);Jt.fog=new _a(65795,.015);const Og=new ia(gn);Jt.environment=Og.fromScene(new pg,.04).texture;const Yt=new Xt(45,innerWidth/innerHeight,.01,1e3);Yt.position.set(0,4,35);const mn=new fg(Yt,gn.domElement);mn.enableDamping=!0;mn.dampingFactor=.06;mn.minDistance=5;mn.maxDistance=60;mn.target.set(0,0,0);Jt.add(new hg(527386,.5));const Ta=new jl(16777215,2.5);Ta.position.set(15,20,15);Ta.castShadow=!0;Jt.add(Ta);const Ql=new jl(4219135,1.5);Ql.position.set(-15,5,-15);Jt.add(Ql);const ec=new Kl(16728080,5,25);ec.position.set(0,-11,0);Jt.add(ec);const tc=new og,ss=tc.load("/rocket_metal.png");ss.wrapS=ss.wrapT=ji;ss.repeat.set(1,4);const la=tc.load("/burnt_metal.png");la.wrapS=la.wrapT=ji;const Yn=document.createElement("canvas");Yn.width=512;Yn.height=2048;const _n=Yn.getContext("2d");_n.fillStyle="#ffffff";_n.fillRect(0,0,Yn.width,Yn.height);_n.translate(Yn.width/2,Yn.height/2);_n.rotate(-Math.PI/2);_n.fillStyle="#111";_n.font="bold 160px sans-serif";_n.textAlign="center";_n.textBaseline="middle";_n.letterSpacing="10px";_n.fillText("S P A C E X",0,0);const ca=new ig(Yn);ca.wrapS=ca.wrapT=ji;const Rt=new dr;Jt.add(Rt);const rr=new _i({map:ss,roughness:.25,metalness:.6}),Fg=new _i({map:ca,roughness:.25,metalness:.6}),nc=new _i({map:la,roughness:.8,metalness:.7}),xi=new _i({color:1710618,roughness:.4,metalness:.9}),ba=new _i({color:1118481,roughness:.7,metalness:.8}),ic=new Er({color:16723968,transparent:!0,opacity:.8}),zg=new Er({color:65484,wireframe:!0,transparent:!0,opacity:.5}),fi=[];function Mt(n,e,t,i,r){const s=n.position.clone();n.userData={isPart:!0,name:e,status:t,desc:i,stats:r,origPos:s,expPos:new I(s.x+(Math.random()-.5)*30,s.y+(Math.random()-.5)*20,s.z+(Math.random()-.5)*30),isGrabbed:!1},fi.push(n),Rt.add(n)}const rc=new Xe(new Ft(.9,.9,12,64),Fg);rc.position.y=-3;Mt(rc,ae.parts.booster.name,ae.status.nominal,ae.parts.booster.desc,{Material:"Al-Li Alloy",Propellant:"LOX / RP-1","Dry Mass":"22,200 kg",Height:"41.2 m"});const sc=new Xe(new ln(.15,12,.1),xi);sc.position.set(.85,-3,.3);Mt(sc,ae.parts.raceway.name,ae.status.active,ae.parts.raceway.desc,{Components:"Power cables, Telemetry",Shielding:"Ablative Cork","Data Rate":"20 Gbps"});for(let n=0;n<4;n++){const e=n*Math.PI/2,t=new Xe(new Ft(.08,.15,3.8,16),xi);t.position.set(Math.cos(e)*.85,-7.2,Math.sin(e)*.85),t.rotation.x=Math.sin(e)*.04,t.rotation.z=-Math.cos(e)*.04,Mt(t,`${ae.parts.leg.name} ${n+1}`,ae.status.stowed,ae.parts.leg.desc,{Material:"Carbon Fiber / Honeycomb",Deployment:"Pneumatic",Span:"18 m (Deployed)"});const i=new Xe(new Ft(.04,.04,2,16),rr);i.position.set(Math.cos(e)*.95,-8.2,Math.sin(e)*.95),i.rotation.x=Math.sin(e)*.1,i.rotation.z=-Math.cos(e)*.1,Mt(i,`${ae.parts.actuator.name} ${n+1}`,ae.status.pressurized,ae.parts.actuator.desc,{Pressure:"4000 PSI",Gas:"Helium (He)",Force:"120 kN"})}const ac=new Xe(new Ft(.95,.95,.8,64),nc);ac.position.y=-9.4;Mt(ac,ae.parts.octaweb.name,ae.status.intact,ae.parts.octaweb.desc,{Material:"Inconel & Ablative","Max Temp":"1,400 °C",Configuration:"8 Outer + 1 Center"});const Aa=new Xe(new Ma(.6,.1,16,32),xi);Aa.rotation.x=Math.PI/2;Aa.position.y=-9.8;Mt(Aa,ae.parts.thrustStructure.name,ae.status.stable,ae.parts.thrustStructure.desc,{Material:"Titanium Billet","Max Load":"7,600 kN"});const oc=new Ft(.15,.32,.7,32),lc=new fs(.28,16,16);for(let n=0;n<8;n++){const e=n*Math.PI*2/8,t=new Xe(oc,ba);t.position.set(Math.cos(e)*.55,-10.15,Math.sin(e)*.55);const i=new Xe(lc,ic);i.position.y=-.2,i.scale.y=1.5,t.add(i),Mt(t,`${ae.parts.merlin1d.name} ${n+1}`,ae.status.ignited,ae.parts.merlin1d.desc,{Thrust:"845 kN",ISP:"282 s (Sea Level)",Cycle:"Gas Generator"})}const wa=new Xe(oc,ba);wa.position.set(0,-10.15,0);const Ra=new Xe(lc,ic);Ra.position.y=-.2;Ra.scale.y=1.5;wa.add(Ra);Mt(wa,ae.parts.merlinCenter.name,ae.status.ignited,ae.parts.merlinCenter.desc,{Thrust:"845 kN",Gimbal:"±5 degrees",Restarts:"Multiple"});const cc=new Xe(new Ft(.9,.9,2.5,64),nc);cc.position.y=4.25;Mt(cc,ae.parts.interstage.name,ae.status.nominal,ae.parts.interstage.desc,{Material:"Carbon Composite",Pusher:"Pneumatic Separation"});const hc=new ln(.2,.2,.1),dc=new Xe(hc,xi);dc.position.set(.85,4.75,0);Mt(dc,`${ae.parts.rcs.name} 1`,ae.status.active,ae.parts.rcs.desc,{Gas:"Cold Nitrogen",Purpose:"Attitude Control"});const uc=new Xe(hc,xi);uc.position.set(-.85,4.75,0);Mt(uc,`${ae.parts.rcs.name} 2`,ae.status.active,ae.parts.rcs.desc,{Gas:"Cold Nitrogen",Purpose:"Attitude Control"});for(let n=0;n<4;n++){const e=n*Math.PI/2+Math.PI/4,t=new Xe(new Ft(.08,.08,.3),rr);t.rotation.z=Math.PI/2,t.position.set(Math.cos(e)*.95,4.8,Math.sin(e)*.95),Mt(t,`${ae.parts.hinge.name} ${n+1}`,ae.status.locked,ae.parts.hinge.desc,{Actuation:"Hydraulic",Fluid:"Aviation Fluid"});const i=new Xe(new ln(.8,1.4,.05),xi);i.position.set(Math.cos(e)*1,5.5,Math.sin(e)*1),i.rotation.y=-e,Mt(i,`${ae.parts.gridFin.name} ${n+1}`,ae.status.stowed,ae.parts.gridFin.desc,{Material:"Cast Titanium","Max Temp":"1,000 °C"})}const fc=new Xe(new Ft(.9,.9,4.5,64),rr);fc.position.y=7.75;Mt(fc,ae.parts.secondStage.name,ae.status.fueled,ae.parts.secondStage.desc,{Mass:"4,000 kg (Dry)","Propellant Mass":"111,500 kg","Burn Time":"397 s"});const pc=new Xe(new Ft(.3,.8,1.8,32),ba);pc.position.y=4.6;Mt(pc,ae.parts.merlinVac.name,ae.status.standby,ae.parts.merlinVac.desc,{Thrust:"981 kN (Vacuum)",ISP:"348 s","Expansion Ratio":"165:1"});const mc=new Xe(new Ft(.9,1.05,1.5,64),rr);mc.position.y=10.75;Mt(mc,ae.parts.fairingBase.name,ae.status.sealed,ae.parts.fairingBase.desc,{Separation:"Pneumatic pushers",Diameter:"5.2 m"});const gc=new Xe(new Ft(1.05,1.05,3,64),rr);gc.position.y=13;Mt(gc,ae.parts.fairingBody.name,ae.status.sealed,ae.parts.fairingBody.desc,{Material:"Carbon composite/Al core","Payload Capacity":"22,800 kg (LEO)"});const _c=new Xe(new xa(1.05,3.5,64),rr);_c.position.y=16.25;Mt(_c,ae.parts.fairingNose.name,ae.status.sealed,ae.parts.fairingNose.desc,{"Heat Shield":"Ablative coat",Recovery:"Parachute / Ship net"});const vc=new Xe(new Ft(1.06,1.06,.05,64),xi);vc.position.y=11.5;Mt(vc,ae.parts.sepJoint.name,ae.status.armed,ae.parts.sepJoint.desc,{Type:"Frangible Joint"});const bn=new Xe(new fs(1),zg);bn.visible=!1;Jt.add(bn);const xc=new jt,Mc=6e3,Jr=new Float32Array(Mc*3);for(let n=0;n<Mc;n++){const e=na.randFloat(60,300),t=Math.random()*Math.PI*2,i=Math.acos(na.randFloatSpread(2));Jr[n*3]=e*Math.sin(i)*Math.cos(t),Jr[n*3+1]=e*Math.cos(i),Jr[n*3+2]=e*Math.sin(i)*Math.sin(t)}xc.setAttribute("position",new Kt(Jr,3));Jt.add(new ql(xc,new va({size:.15,color:11193599,transparent:!0,opacity:.8})));let gr=[];const Sr=new jt;let qi=new Float32Array(0);Sr.setAttribute("position",new Kt(qi,3));const Bg=new ql(Sr,new va({color:16769399,size:.18,sizeAttenuation:!0,transparent:!0,opacity:.9}));Jt.add(Bg);async function Hg(){const n=document.getElementById("loading-msg");try{const e=await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json");if(!e.ok)throw new Error(`Celestrak Error: ${e.status}`);const t=await e.text();let i;try{i=JSON.parse(t)}catch{throw new Error("Invalid JSON")}gr=i.map(r=>{const s=r.TLE_LINE1||r.tle_line1,o=r.TLE_LINE2||r.tle_line2;if(!s||!o)return null;try{return Ag(s.trim(),o.trim())}catch{return null}}).filter(Boolean).slice(0,1500),qi=new Float32Array(gr.length*3),Sr.setAttribute("position",new Kt(qi,3)),Sr.computeBoundingSphere(),document.getElementById("loading").style.opacity="0",setTimeout(()=>document.getElementById("loading").remove(),800)}catch(e){console.error(e),n.textContent=lang==="ENG"?"Failed to load satellites. Offline Mode.":lang==="UZB"?"Sun'iy yo'ldoshlarni yuklab bo'lmadi. Oflayn rejim.":"Не удалось загрузить спутники. Оффлайн-режим.",setTimeout(()=>document.getElementById("loading").remove(),1500)}}Hg();function kg(){if(!gr.length)return;const n=new Date,e=Zl(n),t=1/300;for(let i=0;i<gr.length;i++){const r=Dg(gr[i],n);if(r.position){const s=Ig(r.position,e),o=5+s.height*t,a=o*Math.cos(s.latitude)*Math.cos(s.longitude),l=o*Math.sin(s.latitude),c=-o*Math.cos(s.latitude)*Math.sin(s.longitude);qi[i*3]=a,qi[i*3+1]=l,qi[i*3+2]=c}}Sr.attributes.position.needsUpdate=!0}let ps=!1,_r=null;const ai=document.getElementById("gesture-video"),Ut=document.getElementById("gesture-canvas"),Wt=Ut.getContext("2d"),fr=document.getElementById("gesture-status"),ha=document.getElementById("gesture-label"),yr=document.getElementById("gesture-btn"),wt=document.getElementById("virtual-cursor"),er=new dg;let zt=new We(-2,-2),kn=null,Nt=null,Ca=new An(new I(0,0,1),0),ii=0,ri=0,Gi=null,$r=!1;function Gg(n){const e=n[0],t=n[4],i=n[8],r=n[5],s=n[12],o=n[16],a=n[20],l=t.y<r.y&&t.y<e.y-.1,c=t.y>e.y+.1,h=i.y<r.y,u=s.y<n[9].y,f=o.y<n[13].y,m=a.y<n[17].y,_=(1-i.x)*innerWidth,x=i.y*innerHeight;zt.x=_/innerWidth*2-1,zt.y=-(x/innerHeight)*2+1;const p=Math.hypot(t.x-i.x,t.y-i.y),d=Math.hypot(t.x-n[6].x,t.y-n[6].y),A=h&&!u&&!f&&!m&&d<.09;function E(){$r&&($r=!1,fi.forEach(T=>{T.material.wireframe=!1,T.material.__origColor&&T.material.color.copy(T.material.__origColor),T.material.__origOpacity!==void 0&&(T.material.opacity=T.material.__origOpacity),T.material.transparent=T.material.__origTransparent||!1}))}if(A)return wt.style.opacity="0",zt.set(-2,-2),$r||($r=!0,fi.forEach(T=>{T.material.__origColor=T.material.color.clone(),T.material.__origOpacity=T.material.opacity,T.material.__origTransparent=T.material.transparent,T.material.wireframe=!0,T.material.transparent=!0,T.material.opacity=.3,T.material.color.set(65484)})),`☝️ ${ae.sabrAction}`;if(p<.07){if(wt.style.opacity="1",wt.style.transform=`translate(${_}px, ${x}px) scale(0.6)`,wt.style.background="rgba(251, 191, 36, 0.7)",wt.style.borderColor="#f59e0b",!Nt&&kn&&(Nt=kn,mn.enabled=!1),Nt){er.setFromCamera(zt,Yt);const T=new I;return er.ray.intersectPlane(Ca,T),Nt.position.lerp(T,.2),Nt.userData.isGrabbed=!0,`🤏 ${ae.pinchAction}`}return`🤏 ${ae.pinchKey}`}else Nt&&(Nt.userData.isGrabbed=!1,Nt=null,mn.enabled=!0),wt.style.background="rgba(96, 165, 250, 0.4)",wt.style.borderColor="#60a5fa";if(h&&u&&!f&&!m&&!l){wt.style.opacity="0",zt.set(-2,-2);const L=60-Math.hypot(e.x-n[9].x,e.y-n[9].y)*150;return Yt.position.z+=(L-Yt.position.z)*.1,Yt.position.z=Math.max(5,Math.min(Yt.position.z,60)),`✌️ ${ae.peaceAction}`}if(!h&&!u&&!f&&!m&&l)return wt.style.opacity="0",zt.set(-2,-2),E(),Gi="assemble",ii=0,ri=0,`👍 ${ae.thumbsUpAction}`;if(!h&&!u&&!f&&!m&&c)return wt.style.opacity="0",zt.set(-2,-2),E(),Gi="explode",ii=0,ri=0,`👎 ${ae.thumbsDownAction}`;if(h&&!u&&!f&&!m&&!l&&!c&&!A)return wt.style.opacity="1",wt.style.transform=`translate(${_}px, ${x}px) scale(1)`,ii*=.8,ri*=.8,`☝️ ${ae.pointingAction}`;if(wt.style.opacity="0",zt.set(-2,-2),h&&u&&f&&m){const T=(.5-e.x)*.15,L=(e.y-.5)*.15;return ri+=(T-ri)*.4,ii+=(L-ii)*.4,Rt.rotation.y+=ri,Rt.rotation.x=Math.max(-.4,Math.min(.4,Rt.rotation.x+ii)),`🖐 ${ae.openHandAction}`}return ii*=.8,ri*=.8,"—"}function Vg(n){Wt.clearRect(0,0,Ut.width,Ut.height);const e=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]];Wt.strokeStyle="#60a5fa",Wt.fillStyle="#60a5fa",Wt.lineWidth=2,e.forEach(([t,i])=>{Wt.beginPath(),Wt.moveTo(n[t].x*Ut.width,n[t].y*Ut.height),Wt.lineTo(n[i].x*Ut.width,n[i].y*Ut.height),Wt.stroke()}),n.forEach(t=>{Wt.beginPath(),Wt.arc(t.x*Ut.width,t.y*Ut.height,3,0,Math.PI*2),Wt.fill()})}async function Wg(){fr.textContent=lang==="ENG"?"Loading MediaPipe...":lang==="UZB"?"MediaPipe yuklanmoqda...":"Загрузка MediaPipe...";try{window.Hands||await new Promise((t,i)=>{const r=document.createElement("script");r.src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",r.crossOrigin="anonymous",r.onload=t,r.onerror=i,document.head.appendChild(r)}),fr.textContent=lang==="ENG"?"Starting camera...":lang==="UZB"?"Kamerani ishga tushirish...":"Запуск камеры...",_r=await navigator.mediaDevices.getUserMedia({video:{width:320,height:240,facingMode:"user"}}),ai.srcObject=_r,await new Promise(t=>ai.onloadedmetadata=t),Ut.width=ai.videoWidth,Ut.height=ai.videoHeight;const n=new window.Hands({locateFile:t=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${t}`});n.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.7,minTrackingConfidence:.7}),n.onResults(t=>{t.multiHandLandmarks&&t.multiHandLandmarks.length>0?(Vg(t.multiHandLandmarks[0]),ha.textContent=Gg(t.multiHandLandmarks[0])):(Wt.clearRect(0,0,Ut.width,Ut.height),ha.textContent=ae.noHand,wt.style.opacity="0",zt.set(-2,-2))}),window.Camera||await new Promise((t,i)=>{const r=document.createElement("script");r.src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",r.crossOrigin="anonymous",r.onload=t,r.onerror=i,document.head.appendChild(r)}),new window.Camera(ai,{onFrame:async()=>{await n.send({image:ai})},width:320,height:240}).start(),fr.textContent=ae.trackingHand,ps=!0,yr.textContent=ae.stopSensor,yr.classList.add("active")}catch{fr.textContent=lang==="ENG"?"❌ Camera error":lang==="UZB"?"❌ Kamera xatosi":"❌ Ошибка камеры"}}function Xg(){_r&&(_r.getTracks().forEach(n=>n.stop()),_r=null),ai.srcObject=null,Wt.clearRect(0,0,Ut.width,Ut.height),fr.textContent=ae.enableCam,ha.textContent="—",yr.textContent=ae.startSensor,yr.classList.remove("active"),ps=!1,wt.style.opacity="0",zt.set(-2,-2)}yr.addEventListener("click",()=>{ps?Xg():Wg()});let Pa=!1;window.addEventListener("mousedown",()=>{Pa=!0});window.addEventListener("mouseup",()=>{Pa=!1,Nt=null,mn.enabled=!0});window.addEventListener("mousemove",n=>{if(!(ps&&wt.style.opacity==="1")&&(zt.x=n.clientX/innerWidth*2-1,zt.y=-(n.clientY/innerHeight)*2+1,Pa&&(!Nt&&kn&&(Nt=kn,mn.enabled=!1),Nt))){er.setFromCamera(zt,Yt);const e=new I;er.ray.intersectPlane(Ca,e),Nt.position.lerp(e,.2)}});window.addEventListener("resize",()=>{Yt.aspect=innerWidth/innerHeight,Yt.updateProjectionMatrix(),gn.setSize(innerWidth,innerHeight)});let fl=0;function Sc(){requestAnimationFrame(Sc);const n=performance.now();if(mn.update(),n-fl>500&&(kg(),fl=n),Gi==="explode"){let e=0;fi.forEach(t=>{t.position.lerp(t.userData.expPos,.08),t.position.distanceTo(t.userData.expPos)<.1&&e++}),Rt.rotation.y+=(0-Rt.rotation.y)*.08,Rt.rotation.x+=(0-Rt.rotation.x)*.08,e===fi.length&&Math.abs(Rt.rotation.y)<.01&&(Gi=null)}else if(Gi==="assemble"){let e=0;fi.forEach(t=>{t.position.lerp(t.userData.origPos,.08),t.position.distanceTo(t.userData.origPos)<.01&&(t.position.copy(t.userData.origPos),e++)}),Rt.rotation.y+=(0-Rt.rotation.y)*.08,Rt.rotation.x+=(0-Rt.rotation.x)*.08,e===fi.length&&Math.abs(Rt.rotation.y)<.01&&(Gi=null)}if(Nt){document.body.style.cursor="grabbing";const e=new gi().setFromObject(Nt),t=e.getCenter(new I),i=e.getSize(new I);bn.geometry=new ln(i.x*1.05,i.y*1.05,i.z*1.05),bn.position.copy(t)}else{er.setFromCamera(zt,Yt);const e=er.intersectObjects(Rt.children,!1);let t=null;for(let r=0;r<e.length;r++){let s=e[r].object;if(s.userData&&s.userData.isPart){t=s;break}}const i=document.getElementById("rocket-inspector");if(t){if(document.body.style.cursor="grab",kn!==t){kn=t,i.style.display="block",document.getElementById("part-name").textContent=t.userData.name,document.getElementById("part-status").textContent=t.userData.status,document.getElementById("part-desc").textContent=t.userData.desc;const a=document.getElementById("part-stats-table");if(a.innerHTML="",t.userData.stats)for(const[l,c]of Object.entries(t.userData.stats)){const h=l.charAt(0).toLowerCase()+l.slice(1).replace(/\s+/g,""),u=ae.stats[h]||l;a.innerHTML+=`
              <tr>
                <td style="padding: 4px 0; color: #94a3b8;">${u}:</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #f8fafc;">${c}</td>
              </tr>
            `}Ca.setFromNormalAndCoplanarPoint(Yt.getWorldDirection(new I),t.position)}bn.visible=!0;const r=new gi().setFromObject(t),s=r.getCenter(new I),o=r.getSize(new I);bn.geometry=new ln(o.x*1.05,o.y*1.05,o.z*1.05),bn.position.copy(s),bn.material.opacity=.4+.2*Math.sin(n*.01)}else document.body.style.cursor="default",kn&&(kn=null,i.style.display="none",bn.visible=!1)}gn.render(Jt,Yt)}Sc();

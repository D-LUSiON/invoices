!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("ng.common"),require("ng.forms"),require("rxjs"),require("ng.core")):"function"==typeof define&&define.amd?define(["ng.common","ng.forms","rxjs","ng.core"],t):"object"==typeof exports?exports.shared=t(require("ng.common"),require("ng.forms"),require("rxjs"),require("ng.core")):e.shared=t(e["ng.common"],e["ng.forms"],e.rxjs,e["ng.core"])}("undefined"!=typeof self?self:this,(function(e,t,r,s){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,(function(t){return e[t]}).bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}({0:function(e,t,r){e.exports=r("zUnb")},"0S4P":function(t,r){t.exports=e},"3xDq":function(e,r){e.exports=t},Vgaj:function(e,t){e.exports=r},vOrQ:function(e,t){e.exports=s},zUnb:function(e,t,r){"use strict";r.r(t);var s=r("vOrQ"),n=r("3xDq"),o=r("Vgaj");class i{transform(e,...t){return"object"==typeof e?Object.keys(e):null}}class a{transform(e,...t){return console.log(e),""}}class c{transform(e,...t){return e instanceof Array?"asc"===t[0]?e.sort((e,t)=>isNaN(+e)||isNaN(+t)?e>t?1:e<t?-1:0:+e>+t?1:+e<+t?-1:0):"desc"===t[0]?e.sort((e,t)=>isNaN(+e)||isNaN(+t)?e<t?1:e>t?-1:0:+e<+t?1:+e>+t?-1:0):e:e}}class u{transform(e,t,r,s){return"number"!=typeof e?e:(t||(t=2),r||(r=""),s||(s="start"),`${"start"===s?r:""}${e.toFixed(2)}${"end"===s?r:""}`)}}class h{static forRoot(){return{ngModule:h,providers:[]}}}class l{constructor(e){this.order=1,e&&(e.hasOwnProperty("title")&&(this.title=e.title),e.hasOwnProperty("name")&&(this.name=e.name),e.hasOwnProperty("description")&&(this.description=e.description),e.hasOwnProperty("path")&&(this.path=e.path),e.hasOwnProperty("icon")&&(this.icon=e.icon),e.hasOwnProperty("position")&&(this.position=e.position),e.hasOwnProperty("order")&&(this.order=e.order),e.hasOwnProperty("deps")&&(this.deps=e.deps),e.hasOwnProperty("enabled")&&(this.enabled=e.enabled),e.hasOwnProperty("listComponent")&&(this.listComponent=e.listComponent),e.hasOwnProperty("previewComponent")&&(this.previewComponent=e.previewComponent),e.hasOwnProperty("editComponent")&&(this.editComponent=e.editComponent))}}class d{constructor(e){this.component_data={},this.title=e.title?e.title:"New tab",this.component=e.component,this.component_data=e.component_data||{}}}let p=(()=>{class e{constructor(){console.log("Hello from shared service")}}return e.ngInjectableDef=Object(s["ɵɵdefineInjectable"])({factory:function(){return new e},token:e,providedIn:"root"}),e})(),f=(()=>{class e{constructor(){this.state$=new o.BehaviorSubject(null),console.log("Hello from AppStateSharedService")}}return e.ngInjectableDef=Object(s["ɵɵdefineInjectable"])({factory:function(){return new e},token:e,providedIn:"root"}),e})();function b(e){return"function"==typeof e}let m=!1;const y={Promise:void 0,set useDeprecatedSynchronousErrorHandling(e){if(e){const e=new Error;console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n"+e.stack)}else m&&console.log("RxJS: Back to a better error behavior. Thank you. <3");m=e},get useDeprecatedSynchronousErrorHandling(){return m}};function g(e){setTimeout(()=>{throw e})}const w={closed:!0,next(e){},error(e){if(y.useDeprecatedSynchronousErrorHandling)throw e;g(e)},complete(){}},_=Array.isArray||(e=>e&&"number"==typeof e.length);function v(e){return null!==e&&"object"==typeof e}function x(e){return Error.call(this),this.message=e?`${e.length} errors occurred during unsubscription:\n${e.map((e,t)=>`${t+1}) ${e.toString()}`).join("\n  ")}`:"",this.name="UnsubscriptionError",this.errors=e,this}x.prototype=Object.create(Error.prototype);const E=x;let S=(()=>{class e{constructor(e){this.closed=!1,this._parent=null,this._parents=null,this._subscriptions=null,e&&(this._unsubscribe=e)}unsubscribe(){let e,t=!1;if(this.closed)return;let{_parent:r,_parents:s,_unsubscribe:n,_subscriptions:o}=this;this.closed=!0,this._parent=null,this._parents=null,this._subscriptions=null;let i=-1,a=s?s.length:0;for(;r;)r.remove(this),r=++i<a&&s[i]||null;if(b(n))try{n.call(this)}catch(c){t=!0,e=c instanceof E?T(c.errors):[c]}if(_(o))for(i=-1,a=o.length;++i<a;){const r=o[i];if(v(r))try{r.unsubscribe()}catch(c){t=!0,e=e||[],c instanceof E?e=e.concat(T(c.errors)):e.push(c)}}if(t)throw new E(e)}add(t){let r=t;switch(typeof t){case"function":r=new e(t);case"object":if(r===this||r.closed||"function"!=typeof r.unsubscribe)return r;if(this.closed)return r.unsubscribe(),r;if(!(r instanceof e)){const t=r;(r=new e)._subscriptions=[t]}break;default:if(!t)return e.EMPTY;throw new Error("unrecognized teardown "+t+" added to Subscription.")}if(r._addParent(this)){const e=this._subscriptions;e?e.push(r):this._subscriptions=[r]}return r}remove(e){const t=this._subscriptions;if(t){const r=t.indexOf(e);-1!==r&&t.splice(r,1)}}_addParent(e){let{_parent:t,_parents:r}=this;return t!==e&&(t?r?-1===r.indexOf(e)&&(r.push(e),!0):(this._parents=[e],!0):(this._parent=e,!0))}}return e.EMPTY=function(e){return e.closed=!0,e}(new e),e})();function T(e){return e.reduce((e,t)=>e.concat(t instanceof E?t.errors:t),[])}const O="function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random();class P extends S{constructor(e,t,r){switch(super(),this.syncErrorValue=null,this.syncErrorThrown=!1,this.syncErrorThrowable=!1,this.isStopped=!1,arguments.length){case 0:this.destination=w;break;case 1:if(!e){this.destination=w;break}if("object"==typeof e){e instanceof P?(this.syncErrorThrowable=e.syncErrorThrowable,this.destination=e,e.add(this)):(this.syncErrorThrowable=!0,this.destination=new j(this,e));break}default:this.syncErrorThrowable=!0,this.destination=new j(this,e,t,r)}}[O](){return this}static create(e,t,r){const s=new P(e,t,r);return s.syncErrorThrowable=!1,s}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){this.isStopped||(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe())}_next(e){this.destination.next(e)}_error(e){this.destination.error(e),this.unsubscribe()}_complete(){this.destination.complete(),this.unsubscribe()}_unsubscribeAndRecycle(){const{_parent:e,_parents:t}=this;return this._parent=null,this._parents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parent=e,this._parents=t,this}}class j extends P{constructor(e,t,r,s){let n;super(),this._parentSubscriber=e;let o=this;b(t)?n=t:t&&(n=t.next,r=t.error,s=t.complete,t!==w&&(b((o=Object.create(t)).unsubscribe)&&this.add(o.unsubscribe.bind(o)),o.unsubscribe=this.unsubscribe.bind(this))),this._context=o,this._next=n,this._error=r,this._complete=s}next(e){if(!this.isStopped&&this._next){const{_parentSubscriber:t}=this;y.useDeprecatedSynchronousErrorHandling&&t.syncErrorThrowable?this.__tryOrSetError(t,this._next,e)&&this.unsubscribe():this.__tryOrUnsub(this._next,e)}}error(e){if(!this.isStopped){const{_parentSubscriber:t}=this,{useDeprecatedSynchronousErrorHandling:r}=y;if(this._error)r&&t.syncErrorThrowable?(this.__tryOrSetError(t,this._error,e),this.unsubscribe()):(this.__tryOrUnsub(this._error,e),this.unsubscribe());else if(t.syncErrorThrowable)r?(t.syncErrorValue=e,t.syncErrorThrown=!0):g(e),this.unsubscribe();else{if(this.unsubscribe(),r)throw e;g(e)}}}complete(){if(!this.isStopped){const{_parentSubscriber:e}=this;if(this._complete){const t=()=>this._complete.call(this._context);y.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?(this.__tryOrSetError(e,t),this.unsubscribe()):(this.__tryOrUnsub(t),this.unsubscribe())}else this.unsubscribe()}}__tryOrUnsub(e,t){try{e.call(this._context,t)}catch(r){if(this.unsubscribe(),y.useDeprecatedSynchronousErrorHandling)throw r;g(r)}}__tryOrSetError(e,t,r){if(!y.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{t.call(this._context,r)}catch(s){return y.useDeprecatedSynchronousErrorHandling?(e.syncErrorValue=s,e.syncErrorThrown=!0,!0):(g(s),!0)}return!1}_unsubscribe(){const{_parentSubscriber:e}=this;this._context=null,this._parentSubscriber=null,e.unsubscribe()}}class C extends P{constructor(e,t,r){super(),this.parent=e,this.outerValue=t,this.outerIndex=r,this.index=0}_next(e){this.parent.notifyNext(this.outerValue,e,this.outerIndex,this.index++,this)}_error(e){this.parent.notifyError(e,this),this.unsubscribe()}_complete(){this.parent.notifyComplete(this),this.unsubscribe()}}const N="function"==typeof Symbol&&Symbol.observable||"@@observable";function k(){}let A=(()=>{class e{constructor(e){this._isScalar=!1,e&&(this._subscribe=e)}lift(t){const r=new e;return r.source=this,r.operator=t,r}subscribe(e,t,r){const{operator:s}=this,n=function(e,t,r){if(e){if(e instanceof P)return e;if(e[O])return e[O]()}return e||t||r?new P(e,t,r):new P(w)}(e,t,r);if(n.add(s?s.call(n,this.source):this.source||y.useDeprecatedSynchronousErrorHandling&&!n.syncErrorThrowable?this._subscribe(n):this._trySubscribe(n)),y.useDeprecatedSynchronousErrorHandling&&n.syncErrorThrowable&&(n.syncErrorThrowable=!1,n.syncErrorThrown))throw n.syncErrorValue;return n}_trySubscribe(e){try{return this._subscribe(e)}catch(t){y.useDeprecatedSynchronousErrorHandling&&(e.syncErrorThrown=!0,e.syncErrorValue=t),function(e){for(;e;){const{closed:t,destination:r,isStopped:s}=e;if(t||s)return!1;e=r&&r instanceof P?r:null}return!0}(e)?e.error(t):console.warn(t)}}forEach(e,t){return new(t=R(t))((t,r)=>{let s;s=this.subscribe(t=>{try{e(t)}catch(n){r(n),s&&s.unsubscribe()}},r,t)})}_subscribe(e){const{source:t}=this;return t&&t.subscribe(e)}[N](){return this}pipe(...e){return 0===e.length?this:((t=e)?1===t.length?t[0]:function(e){return t.reduce((e,t)=>t(e),e)}:k)(this);var t}toPromise(e){return new(e=R(e))((e,t)=>{let r;this.subscribe(e=>r=e,e=>t(e),()=>e(r))})}}return e.create=t=>new e(t),e})();function R(e){if(e||(e=y.Promise||Promise),!e)throw new Error("no Promise impl found");return e}const I=e=>t=>{for(let r=0,s=e.length;r<s&&!t.closed;r++)t.next(e[r]);t.closed||t.complete()},H=e=>t=>(e.then(e=>{t.closed||(t.next(e),t.complete())},e=>t.error(e)).then(null,g),t);function F(){return"function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator"}const U=F(),z=e=>t=>{const r=e[U]();for(;;){const e=r.next();if(e.done){t.complete();break}if(t.next(e.value),t.closed)break}return"function"==typeof r.return&&t.add(()=>{r.return&&r.return()}),t},D=e=>t=>{const r=e[N]();if("function"!=typeof r.subscribe)throw new TypeError("Provided object does not correctly implement Symbol.observable");return r.subscribe(t)},M=e=>e&&"number"==typeof e.length&&"function"!=typeof e;function q(e){return!!e&&"function"!=typeof e.subscribe&&"function"==typeof e.then}const L=e=>{if(e instanceof A)return t=>e._isScalar?(t.next(e.value),void t.complete()):e.subscribe(t);if(e&&"function"==typeof e[N])return D(e);if(M(e))return I(e);if(q(e))return H(e);if(e&&"function"==typeof e[U])return z(e);{const t=v(e)?"an invalid object":`'${e}'`;throw new TypeError(`You provided ${t} where a stream was expected.`+" You can provide an Observable, Promise, Array, or Iterable.")}};class V extends P{notifyNext(e,t,r,s,n){this.destination.next(t)}notifyError(e,t){this.destination.error(e)}notifyComplete(e){this.destination.complete()}}function B(e,t){return function(r){if("function"!=typeof e)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return r.lift(new $(e,t))}}class ${constructor(e,t){this.project=e,this.thisArg=t}call(e,t){return t.subscribe(new K(e,this.project,this.thisArg))}}class K extends P{constructor(e,t,r){super(e),this.project=t,this.count=0,this.thisArg=r||this}_next(e){let t;try{t=this.project.call(this.thisArg,e,this.count++)}catch(r){return void this.destination.error(r)}this.destination.next(t)}}class J{constructor(e,t=Number.POSITIVE_INFINITY){this.project=e,this.concurrent=t}call(e,t){return t.subscribe(new X(e,this.project,this.concurrent))}}class X extends V{constructor(e,t,r=Number.POSITIVE_INFINITY){super(e),this.project=t,this.concurrent=r,this.hasCompleted=!1,this.buffer=[],this.active=0,this.index=0}_next(e){this.active<this.concurrent?this._tryNext(e):this.buffer.push(e)}_tryNext(e){let t;const r=this.index++;try{t=this.project(e,r)}catch(s){return void this.destination.error(s)}this.active++,this._innerSub(t,e,r)}_innerSub(e,t,r){const s=new C(this,void 0,void 0);this.destination.add(s),function(e,t,r,s,n=new C(e,r,s)){n.closed||L(t)(n)}(this,e,t,r,s)}_complete(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()}notifyNext(e,t,r,s,n){this.destination.next(t)}notifyComplete(e){const t=this.buffer;this.remove(e),this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()}}class W{constructor(e,t){this.predicate=e,this.thisArg=t}call(e,t){return t.subscribe(new Y(e,this.predicate,this.thisArg))}}class Y extends P{constructor(e,t,r){super(e),this.predicate=t,this.thisArg=r,this.count=0}_next(e){let t;try{t=this.predicate.call(this.thisArg,e,this.count++)}catch(r){return void this.destination.error(r)}t&&this.destination.next(e)}}var G=r("0S4P");class Q{}class Z{}class ee{constructor(e){this.normalizedNames=new Map,this.lazyUpdate=null,e?this.lazyInit="string"==typeof e?()=>{this.headers=new Map,e.split("\n").forEach(e=>{const t=e.indexOf(":");if(t>0){const r=e.slice(0,t),s=r.toLowerCase(),n=e.slice(t+1).trim();this.maybeSetNormalizedName(r,s),this.headers.has(s)?this.headers.get(s).push(n):this.headers.set(s,[n])}})}:()=>{this.headers=new Map,Object.keys(e).forEach(t=>{let r=e[t];const s=t.toLowerCase();"string"==typeof r&&(r=[r]),r.length>0&&(this.headers.set(s,r),this.maybeSetNormalizedName(t,s))})}:this.headers=new Map}has(e){return this.init(),this.headers.has(e.toLowerCase())}get(e){this.init();const t=this.headers.get(e.toLowerCase());return t&&t.length>0?t[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(e){return this.init(),this.headers.get(e.toLowerCase())||null}append(e,t){return this.clone({name:e,value:t,op:"a"})}set(e,t){return this.clone({name:e,value:t,op:"s"})}delete(e,t){return this.clone({name:e,value:t,op:"d"})}maybeSetNormalizedName(e,t){this.normalizedNames.has(t)||this.normalizedNames.set(t,e)}init(){this.lazyInit&&(this.lazyInit instanceof ee?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(e=>this.applyUpdate(e)),this.lazyUpdate=null))}copyFrom(e){e.init(),Array.from(e.headers.keys()).forEach(t=>{this.headers.set(t,e.headers.get(t)),this.normalizedNames.set(t,e.normalizedNames.get(t))})}clone(e){const t=new ee;return t.lazyInit=this.lazyInit&&this.lazyInit instanceof ee?this.lazyInit:this,t.lazyUpdate=(this.lazyUpdate||[]).concat([e]),t}applyUpdate(e){const t=e.name.toLowerCase();switch(e.op){case"a":case"s":let r=e.value;if("string"==typeof r&&(r=[r]),0===r.length)return;this.maybeSetNormalizedName(e.name,t);const s=("a"===e.op?this.headers.get(t):void 0)||[];s.push(...r),this.headers.set(t,s);break;case"d":const n=e.value;if(n){let e=this.headers.get(t);if(!e)return;0===(e=e.filter(e=>-1===n.indexOf(e))).length?(this.headers.delete(t),this.normalizedNames.delete(t)):this.headers.set(t,e)}else this.headers.delete(t),this.normalizedNames.delete(t)}}forEach(e){this.init(),Array.from(this.normalizedNames.keys()).forEach(t=>e(this.normalizedNames.get(t),this.headers.get(t)))}}class te{encodeKey(e){return re(e)}encodeValue(e){return re(e)}decodeKey(e){return decodeURIComponent(e)}decodeValue(e){return decodeURIComponent(e)}}function re(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/gi,"$").replace(/%2C/gi,",").replace(/%3B/gi,";").replace(/%2B/gi,"+").replace(/%3D/gi,"=").replace(/%3F/gi,"?").replace(/%2F/gi,"/")}class se{constructor(e={}){if(this.updates=null,this.cloneFrom=null,this.encoder=e.encoder||new te,e.fromString){if(e.fromObject)throw new Error("Cannot specify both fromString and fromObject.");this.map=function(e,t){const r=new Map;return e.length>0&&e.split("&").forEach(e=>{const s=e.indexOf("="),[n,o]=-1==s?[t.decodeKey(e),""]:[t.decodeKey(e.slice(0,s)),t.decodeValue(e.slice(s+1))],i=r.get(n)||[];i.push(o),r.set(n,i)}),r}(e.fromString,this.encoder)}else e.fromObject?(this.map=new Map,Object.keys(e.fromObject).forEach(t=>{const r=e.fromObject[t];this.map.set(t,Array.isArray(r)?r:[r])})):this.map=null}has(e){return this.init(),this.map.has(e)}get(e){this.init();const t=this.map.get(e);return t?t[0]:null}getAll(e){return this.init(),this.map.get(e)||null}keys(){return this.init(),Array.from(this.map.keys())}append(e,t){return this.clone({param:e,value:t,op:"a"})}set(e,t){return this.clone({param:e,value:t,op:"s"})}delete(e,t){return this.clone({param:e,value:t,op:"d"})}toString(){return this.init(),this.keys().map(e=>{const t=this.encoder.encodeKey(e);return this.map.get(e).map(e=>t+"="+this.encoder.encodeValue(e)).join("&")}).join("&")}clone(e){const t=new se({encoder:this.encoder});return t.cloneFrom=this.cloneFrom||this,t.updates=(this.updates||[]).concat([e]),t}init(){null===this.map&&(this.map=new Map),null!==this.cloneFrom&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(e=>this.map.set(e,this.cloneFrom.map.get(e))),this.updates.forEach(e=>{switch(e.op){case"a":case"s":const t=("a"===e.op?this.map.get(e.param):void 0)||[];t.push(e.value),this.map.set(e.param,t);break;case"d":if(void 0===e.value){this.map.delete(e.param);break}{let t=this.map.get(e.param)||[];const r=t.indexOf(e.value);-1!==r&&t.splice(r,1),t.length>0?this.map.set(e.param,t):this.map.delete(e.param)}}}),this.cloneFrom=this.updates=null)}}function ne(e){return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer}function oe(e){return"undefined"!=typeof Blob&&e instanceof Blob}function ie(e){return"undefined"!=typeof FormData&&e instanceof FormData}class ae{constructor(e,t,r,s){let n;if(this.url=t,this.body=null,this.reportProgress=!1,this.withCredentials=!1,this.responseType="json",this.method=e.toUpperCase(),function(e){switch(e){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}(this.method)||s?(this.body=void 0!==r?r:null,n=s):n=r,n&&(this.reportProgress=!!n.reportProgress,this.withCredentials=!!n.withCredentials,n.responseType&&(this.responseType=n.responseType),n.headers&&(this.headers=n.headers),n.params&&(this.params=n.params)),this.headers||(this.headers=new ee),this.params){const e=this.params.toString();if(0===e.length)this.urlWithParams=t;else{const r=t.indexOf("?");this.urlWithParams=t+(-1===r?"?":r<t.length-1?"&":"")+e}}else this.params=new se,this.urlWithParams=t}serializeBody(){return null===this.body?null:ne(this.body)||oe(this.body)||ie(this.body)||"string"==typeof this.body?this.body:this.body instanceof se?this.body.toString():"object"==typeof this.body||"boolean"==typeof this.body||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return null===this.body?null:ie(this.body)?null:oe(this.body)?this.body.type||null:ne(this.body)?null:"string"==typeof this.body?"text/plain":this.body instanceof se?"application/x-www-form-urlencoded;charset=UTF-8":"object"==typeof this.body||"number"==typeof this.body||Array.isArray(this.body)?"application/json":null}clone(e={}){const t=e.method||this.method,r=e.url||this.url,s=e.responseType||this.responseType,n=void 0!==e.body?e.body:this.body,o=void 0!==e.withCredentials?e.withCredentials:this.withCredentials,i=void 0!==e.reportProgress?e.reportProgress:this.reportProgress;let a=e.headers||this.headers,c=e.params||this.params;return void 0!==e.setHeaders&&(a=Object.keys(e.setHeaders).reduce((t,r)=>t.set(r,e.setHeaders[r]),a)),e.setParams&&(c=Object.keys(e.setParams).reduce((t,r)=>t.set(r,e.setParams[r]),c)),new ae(t,r,n,{params:c,headers:a,reportProgress:i,responseType:s,withCredentials:o})}}const ce=function(){var e={Sent:0,UploadProgress:1,ResponseHeader:2,DownloadProgress:3,Response:4,User:5};return e[e.Sent]="Sent",e[e.UploadProgress]="UploadProgress",e[e.ResponseHeader]="ResponseHeader",e[e.DownloadProgress]="DownloadProgress",e[e.Response]="Response",e[e.User]="User",e}();class ue{constructor(e,t=200,r="OK"){this.headers=e.headers||new ee,this.status=void 0!==e.status?e.status:t,this.statusText=e.statusText||r,this.url=e.url||null,this.ok=this.status>=200&&this.status<300}}class he extends ue{constructor(e={}){super(e),this.type=ce.ResponseHeader}clone(e={}){return new he({headers:e.headers||this.headers,status:void 0!==e.status?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}}class le extends ue{constructor(e={}){super(e),this.type=ce.Response,this.body=void 0!==e.body?e.body:null}clone(e={}){return new le({body:void 0!==e.body?e.body:this.body,headers:e.headers||this.headers,status:void 0!==e.status?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}}class de extends ue{constructor(e){super(e,0,"Unknown Error"),this.name="HttpErrorResponse",this.ok=!1,this.message=this.status>=200&&this.status<300?`Http failure during parsing for ${e.url||"(unknown url)"}`:`Http failure response for ${e.url||"(unknown url)"}: ${e.status} ${e.statusText}`,this.error=e.error||null}}function pe(e,t){return{body:t,headers:e.headers,observe:e.observe,params:e.params,reportProgress:e.reportProgress,responseType:e.responseType,withCredentials:e.withCredentials}}class fe{constructor(e){this.handler=e}request(e,t,r={}){let s;if(e instanceof ae)s=e;else{let n=void 0;n=r.headers instanceof ee?r.headers:new ee(r.headers);let o=void 0;r.params&&(o=r.params instanceof se?r.params:new se({fromObject:r.params})),s=new ae(e,t,void 0!==r.body?r.body:null,{headers:n,params:o,reportProgress:r.reportProgress,responseType:r.responseType||"json",withCredentials:r.withCredentials})}const n=Object(o.of)(s).pipe(function e(t,r,s=Number.POSITIVE_INFINITY){return"function"==typeof r?n=>n.pipe(e((e,s)=>(function(e,t){return e instanceof A?e:new A(L(e))})(t(e,s)).pipe(B((t,n)=>r(e,t,s,n))),s)):("number"==typeof r&&(s=r),e=>e.lift(new J(t,s)))}(e=>this.handler.handle(e),i,1));var i;if(e instanceof ae||"events"===r.observe)return n;const a=n.pipe((c=e=>e instanceof le,function(e){return e.lift(new W(c,void 0))}));var c;switch(r.observe||"body"){case"body":switch(s.responseType){case"arraybuffer":return a.pipe(B(e=>{if(null!==e.body&&!(e.body instanceof ArrayBuffer))throw new Error("Response is not an ArrayBuffer.");return e.body}));case"blob":return a.pipe(B(e=>{if(null!==e.body&&!(e.body instanceof Blob))throw new Error("Response is not a Blob.");return e.body}));case"text":return a.pipe(B(e=>{if(null!==e.body&&"string"!=typeof e.body)throw new Error("Response is not a string.");return e.body}));case"json":default:return a.pipe(B(e=>e.body))}case"response":return a;default:throw new Error(`Unreachable: unhandled observe type ${r.observe}}`)}}delete(e,t={}){return this.request("DELETE",e,t)}get(e,t={}){return this.request("GET",e,t)}head(e,t={}){return this.request("HEAD",e,t)}jsonp(e,t){return this.request("JSONP",e,{params:(new se).append(t,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,t={}){return this.request("OPTIONS",e,t)}patch(e,t,r={}){return this.request("PATCH",e,pe(r,t))}post(e,t,r={}){return this.request("POST",e,pe(r,t))}put(e,t,r={}){return this.request("PUT",e,pe(r,t))}}class be{constructor(e,t){this.next=e,this.interceptor=t}handle(e){return this.interceptor.intercept(e,this.next)}}const me=new s.InjectionToken("HTTP_INTERCEPTORS");class ye{intercept(e,t){return t.handle(e)}}const ge=/^\)\]\}',?\n/;class we{}class _e{constructor(){}build(){return new XMLHttpRequest}}class ve{constructor(e){this.xhrFactory=e}handle(e){if("JSONP"===e.method)throw new Error("Attempted to construct Jsonp request without JsonpClientModule installed.");return new o.Observable(t=>{const r=this.xhrFactory.build();if(r.open(e.method,e.urlWithParams),e.withCredentials&&(r.withCredentials=!0),e.headers.forEach((e,t)=>r.setRequestHeader(e,t.join(","))),e.headers.has("Accept")||r.setRequestHeader("Accept","application/json, text/plain, */*"),!e.headers.has("Content-Type")){const t=e.detectContentTypeHeader();null!==t&&r.setRequestHeader("Content-Type",t)}if(e.responseType){const t=e.responseType.toLowerCase();r.responseType="json"!==t?t:"text"}const s=e.serializeBody();let n=null;const o=()=>{if(null!==n)return n;const t=1223===r.status?204:r.status,s=r.statusText||"OK",o=new ee(r.getAllResponseHeaders()),i=function(e){return"responseURL"in e&&e.responseURL?e.responseURL:/^X-Request-URL:/m.test(e.getAllResponseHeaders())?e.getResponseHeader("X-Request-URL"):null}(r)||e.url;return n=new he({headers:o,status:t,statusText:s,url:i})},i=()=>{let{headers:s,status:n,statusText:i,url:a}=o(),c=null;204!==n&&(c=void 0===r.response?r.responseText:r.response),0===n&&(n=c?200:0);let u=n>=200&&n<300;if("json"===e.responseType&&"string"==typeof c){const e=c;c=c.replace(ge,"");try{c=""!==c?JSON.parse(c):null}catch(h){c=e,u&&(u=!1,c={error:h,text:c})}}u?(t.next(new le({body:c,headers:s,status:n,statusText:i,url:a||void 0})),t.complete()):t.error(new de({error:c,headers:s,status:n,statusText:i,url:a||void 0}))},a=e=>{const{url:s}=o(),n=new de({error:e,status:r.status||0,statusText:r.statusText||"Unknown Error",url:s||void 0});t.error(n)};let c=!1;const u=s=>{c||(t.next(o()),c=!0);let n={type:ce.DownloadProgress,loaded:s.loaded};s.lengthComputable&&(n.total=s.total),"text"===e.responseType&&r.responseText&&(n.partialText=r.responseText),t.next(n)},h=e=>{let r={type:ce.UploadProgress,loaded:e.loaded};e.lengthComputable&&(r.total=e.total),t.next(r)};return r.addEventListener("load",i),r.addEventListener("error",a),e.reportProgress&&(r.addEventListener("progress",u),null!==s&&r.upload&&r.upload.addEventListener("progress",h)),r.send(s),t.next({type:ce.Sent}),()=>{r.removeEventListener("error",a),r.removeEventListener("load",i),e.reportProgress&&(r.removeEventListener("progress",u),null!==s&&r.upload&&r.upload.removeEventListener("progress",h)),r.abort()}})}}const xe=new s.InjectionToken("XSRF_COOKIE_NAME"),Ee=new s.InjectionToken("XSRF_HEADER_NAME");class Se{}class Te{constructor(e,t,r){this.doc=e,this.platform=t,this.cookieName=r,this.lastCookieString="",this.lastToken=null,this.parseCount=0}getToken(){if("server"===this.platform)return null;const e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=Object(G["ɵparseCookieValue"])(e,this.cookieName),this.lastCookieString=e),this.lastToken}}class Oe{constructor(e,t){this.tokenService=e,this.headerName=t}intercept(e,t){const r=e.url.toLowerCase();if("GET"===e.method||"HEAD"===e.method||r.startsWith("http://")||r.startsWith("https://"))return t.handle(e);const s=this.tokenService.getToken();return null===s||e.headers.has(this.headerName)||(e=e.clone({headers:e.headers.set(this.headerName,s)})),t.handle(e)}}class Pe{constructor(e,t){this.backend=e,this.injector=t,this.chain=null}handle(e){if(null===this.chain){const e=this.injector.get(me,[]);this.chain=e.reduceRight((e,t)=>new be(e,t),this.backend)}return this.chain.handle(e)}}class je{static disable(){return{ngModule:je,providers:[{provide:Oe,useClass:ye}]}}static withOptions(e={}){return{ngModule:je,providers:[e.cookieName?{provide:xe,useValue:e.cookieName}:[],e.headerName?{provide:Ee,useValue:e.headerName}:[]]}}}class Ce{}class Ne{get electron(){return this._electron?this._electron:window&&window.require?(this._electron=window.require("electron"),this._electron):null}get isElectronApp(){return!!window.navigator.userAgent.match(/Electron/)}get isMacOS(){return this.isElectronApp&&"darwin"===process.platform}get isWindows(){return this.isElectronApp&&"win32"===process.platform}get isLinux(){return this.isElectronApp&&"linux"===process.platform}get isX86(){return this.isElectronApp&&"ia32"===process.arch}get isX64(){return this.isElectronApp&&"x64"===process.arch}get isArm(){return this.isElectronApp&&"arm"===process.arch}get desktopCapturer(){return this.electron?this.electron.desktopCapturer:null}get ipcRenderer(){return this.electron?this.electron.ipcRenderer:null}get remote(){return this.electron?this.electron.remote:null}get webFrame(){return this.electron?this.electron.webFrame:null}get clipboard(){return this.electron?this.electron.clipboard:null}get crashReporter(){return this.electron?this.electron.crashReporter:null}get process(){return this.remote?this.remote.process:null}get nativeImage(){return this.electron?this.electron.nativeImage:null}get screen(){return this.electron?this.remote.screen:null}get shell(){return this.electron?this.electron.shell:null}}class ke extends Ne{constructor(){super()}}class Ae{}var Re=s["ɵcmf"](h,[],(function(e){return s["ɵmod"]([s["ɵmpd"](512,s.ComponentFactoryResolver,s["ɵCodegenComponentFactoryResolver"],[[8,[]],[3,s.ComponentFactoryResolver],s.NgModuleRef]),s["ɵmpd"](4608,Se,Te,[G.DOCUMENT,s.PLATFORM_ID,xe]),s["ɵmpd"](4608,Oe,Oe,[Se,Ee]),s["ɵmpd"](5120,me,(function(e){return[e]}),[Oe]),s["ɵmpd"](4608,_e,_e,[]),s["ɵmpd"](6144,we,null,[_e]),s["ɵmpd"](4608,ve,ve,[we]),s["ɵmpd"](6144,Z,null,[ve]),s["ɵmpd"](4608,Q,Pe,[Z,s.Injector]),s["ɵmpd"](4608,fe,fe,[Q]),s["ɵmpd"](4608,Ne,ke,[]),s["ɵmpd"](4608,n.FormBuilder,n.FormBuilder,[]),s["ɵmpd"](4608,n["ɵangular_packages_forms_forms_o"],n["ɵangular_packages_forms_forms_o"],[]),s["ɵmpd"](1073742336,je,je,[]),s["ɵmpd"](1073742336,Ce,Ce,[]),s["ɵmpd"](1073742336,Ae,Ae,[]),s["ɵmpd"](1073742336,n["ɵangular_packages_forms_forms_d"],n["ɵangular_packages_forms_forms_d"],[]),s["ɵmpd"](1073742336,n.ReactiveFormsModule,n.ReactiveFormsModule,[]),s["ɵmpd"](1073742336,n.FormsModule,n.FormsModule,[]),s["ɵmpd"](1073742336,h,h,[]),s["ɵmpd"](256,xe,"XSRF-TOKEN",[]),s["ɵmpd"](256,Ee,"X-XSRF-TOKEN",[])])}));r.d(t,"AppStateSharedService",(function(){return f})),r.d(t,"Extension",(function(){return l})),r.d(t,"SharedModule",(function(){return h})),r.d(t,"SharedServiceService",(function(){return p})),r.d(t,"Tab",(function(){return d})),r.d(t,"ɵa",(function(){return i})),r.d(t,"ɵb",(function(){return a})),r.d(t,"ɵc",(function(){return c})),r.d(t,"ɵd",(function(){return u})),r.d(t,"SharedModuleNgFactory",(function(){return Re})),t.default=Re}})}));
//# sourceMappingURL=shared.js.map
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("ng.common"),require("ng.forms"),require("rxjs"),require("shared"),require("ng.core")):"function"==typeof define&&define.amd?define(["ng.common","ng.forms","rxjs","shared","ng.core"],t):"object"==typeof exports?exports.providers=t(require("ng.common"),require("ng.forms"),require("rxjs"),require("shared"),require("ng.core")):e.providers=t(e["ng.common"],e["ng.forms"],e.rxjs,e.shared,e["ng.core"])}("undefined"!=typeof self?self:this,(function(e,t,r,s,n){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,(function(t){return e[t]}).bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}({0:function(e,t,r){e.exports=r("zUnb")},"0S4P":function(t,r){t.exports=e},"3xDq":function(e,r){e.exports=t},Vgaj:function(e,t){e.exports=r},cfyg:function(e,t){e.exports=s},vOrQ:function(e,t){e.exports=n},zUnb:function(e,t,r){"use strict";r.r(t);class s{constructor(){}ngOnInit(){}}class n{constructor(){}ngOnInit(){}}class o{constructor(){}ngOnInit(){}}let i=(()=>{class e{}return e.title="Providers",e.description="Providers module for listing, previewing and editing",e.icon="address-book",e.listComponent=s,e.previewComponent=n,e.editComponent=o,e})();var a=r("vOrQ"),l=a["ɵcrt"]({encapsulation:0,styles:[[""]],data:{}});function u(e){return a["ɵvid"](0,[(e()(),a["ɵeld"](0,0,null,null,1,"p",[],null,null,null,null,null)),(e()(),a["ɵted"](-1,null,["providers-list works!"]))],null,null)}function c(e){return a["ɵvid"](0,[(e()(),a["ɵeld"](0,0,null,null,1,"app-providers-list",[],null,null,null,u,l)),a["ɵdid"](1,114688,null,0,s,[],null,null)],(function(e,t){e(t,1,0)}),null)}var h=a["ɵccf"]("app-providers-list",s,c,{},{},[]),d=a["ɵcrt"]({encapsulation:0,styles:[[""]],data:{}});function p(e){return a["ɵvid"](0,[(e()(),a["ɵeld"](0,0,null,null,1,"p",[],null,null,null,null,null)),(e()(),a["ɵted"](-1,null,["provider-preview works!"]))],null,null)}function f(e){return a["ɵvid"](0,[(e()(),a["ɵeld"](0,0,null,null,1,"app-provider-preview",[],null,null,null,p,d)),a["ɵdid"](1,114688,null,0,n,[],null,null)],(function(e,t){e(t,1,0)}),null)}var b=a["ɵccf"]("app-provider-preview",n,f,{},{},[]),m=a["ɵcrt"]({encapsulation:0,styles:[[""]],data:{}});function y(e){return a["ɵvid"](0,[(e()(),a["ɵeld"](0,0,null,null,1,"p",[],null,null,null,null,null)),(e()(),a["ɵted"](-1,null,["provider-edit works!"]))],null,null)}function g(e){return a["ɵvid"](0,[(e()(),a["ɵeld"](0,0,null,null,1,"app-provider-edit",[],null,null,null,y,m)),a["ɵdid"](1,114688,null,0,o,[],null,null)],(function(e,t){e(t,1,0)}),null)}var w=a["ɵccf"]("app-provider-edit",o,g,{},{},[]),v=r("0S4P"),_=r("Vgaj");function x(e){return"function"==typeof e}let E=!1;const T={Promise:void 0,set useDeprecatedSynchronousErrorHandling(e){if(e){const e=new Error;console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n"+e.stack)}else E&&console.log("RxJS: Back to a better error behavior. Thank you. <3");E=e},get useDeprecatedSynchronousErrorHandling(){return E}};function S(e){setTimeout(()=>{throw e})}const O={closed:!0,next(e){},error(e){if(T.useDeprecatedSynchronousErrorHandling)throw e;S(e)},complete(){}},C=Array.isArray||(e=>e&&"number"==typeof e.length);function P(e){return null!==e&&"object"==typeof e}function j(e){return Error.call(this),this.message=e?`${e.length} errors occurred during unsubscription:\n${e.map((e,t)=>`${t+1}) ${e.toString()}`).join("\n  ")}`:"",this.name="UnsubscriptionError",this.errors=e,this}j.prototype=Object.create(Error.prototype);const k=j;let N=(()=>{class e{constructor(e){this.closed=!1,this._parent=null,this._parents=null,this._subscriptions=null,e&&(this._unsubscribe=e)}unsubscribe(){let e,t=!1;if(this.closed)return;let{_parent:r,_parents:s,_unsubscribe:n,_subscriptions:o}=this;this.closed=!0,this._parent=null,this._parents=null,this._subscriptions=null;let i=-1,a=s?s.length:0;for(;r;)r.remove(this),r=++i<a&&s[i]||null;if(x(n))try{n.call(this)}catch(l){t=!0,e=l instanceof k?A(l.errors):[l]}if(C(o))for(i=-1,a=o.length;++i<a;){const r=o[i];if(P(r))try{r.unsubscribe()}catch(l){t=!0,e=e||[],l instanceof k?e=e.concat(A(l.errors)):e.push(l)}}if(t)throw new k(e)}add(t){let r=t;switch(typeof t){case"function":r=new e(t);case"object":if(r===this||r.closed||"function"!=typeof r.unsubscribe)return r;if(this.closed)return r.unsubscribe(),r;if(!(r instanceof e)){const t=r;(r=new e)._subscriptions=[t]}break;default:if(!t)return e.EMPTY;throw new Error("unrecognized teardown "+t+" added to Subscription.")}if(r._addParent(this)){const e=this._subscriptions;e?e.push(r):this._subscriptions=[r]}return r}remove(e){const t=this._subscriptions;if(t){const r=t.indexOf(e);-1!==r&&t.splice(r,1)}}_addParent(e){let{_parent:t,_parents:r}=this;return t!==e&&(t?r?-1===r.indexOf(e)&&(r.push(e),!0):(this._parents=[e],!0):(this._parent=e,!0))}}return e.EMPTY=function(e){return e.closed=!0,e}(new e),e})();function A(e){return e.reduce((e,t)=>e.concat(t instanceof k?t.errors:t),[])}const R="function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random();class I extends N{constructor(e,t,r){switch(super(),this.syncErrorValue=null,this.syncErrorThrown=!1,this.syncErrorThrowable=!1,this.isStopped=!1,arguments.length){case 0:this.destination=O;break;case 1:if(!e){this.destination=O;break}if("object"==typeof e){e instanceof I?(this.syncErrorThrowable=e.syncErrorThrowable,this.destination=e,e.add(this)):(this.syncErrorThrowable=!0,this.destination=new z(this,e));break}default:this.syncErrorThrowable=!0,this.destination=new z(this,e,t,r)}}[R](){return this}static create(e,t,r){const s=new I(e,t,r);return s.syncErrorThrowable=!1,s}next(e){this.isStopped||this._next(e)}error(e){this.isStopped||(this.isStopped=!0,this._error(e))}complete(){this.isStopped||(this.isStopped=!0,this._complete())}unsubscribe(){this.closed||(this.isStopped=!0,super.unsubscribe())}_next(e){this.destination.next(e)}_error(e){this.destination.error(e),this.unsubscribe()}_complete(){this.destination.complete(),this.unsubscribe()}_unsubscribeAndRecycle(){const{_parent:e,_parents:t}=this;return this._parent=null,this._parents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parent=e,this._parents=t,this}}class z extends I{constructor(e,t,r,s){let n;super(),this._parentSubscriber=e;let o=this;x(t)?n=t:t&&(n=t.next,r=t.error,s=t.complete,t!==O&&(x((o=Object.create(t)).unsubscribe)&&this.add(o.unsubscribe.bind(o)),o.unsubscribe=this.unsubscribe.bind(this))),this._context=o,this._next=n,this._error=r,this._complete=s}next(e){if(!this.isStopped&&this._next){const{_parentSubscriber:t}=this;T.useDeprecatedSynchronousErrorHandling&&t.syncErrorThrowable?this.__tryOrSetError(t,this._next,e)&&this.unsubscribe():this.__tryOrUnsub(this._next,e)}}error(e){if(!this.isStopped){const{_parentSubscriber:t}=this,{useDeprecatedSynchronousErrorHandling:r}=T;if(this._error)r&&t.syncErrorThrowable?(this.__tryOrSetError(t,this._error,e),this.unsubscribe()):(this.__tryOrUnsub(this._error,e),this.unsubscribe());else if(t.syncErrorThrowable)r?(t.syncErrorValue=e,t.syncErrorThrown=!0):S(e),this.unsubscribe();else{if(this.unsubscribe(),r)throw e;S(e)}}}complete(){if(!this.isStopped){const{_parentSubscriber:e}=this;if(this._complete){const t=()=>this._complete.call(this._context);T.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?(this.__tryOrSetError(e,t),this.unsubscribe()):(this.__tryOrUnsub(t),this.unsubscribe())}else this.unsubscribe()}}__tryOrUnsub(e,t){try{e.call(this._context,t)}catch(r){if(this.unsubscribe(),T.useDeprecatedSynchronousErrorHandling)throw r;S(r)}}__tryOrSetError(e,t,r){if(!T.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{t.call(this._context,r)}catch(s){return T.useDeprecatedSynchronousErrorHandling?(e.syncErrorValue=s,e.syncErrorThrown=!0,!0):(S(s),!0)}return!1}_unsubscribe(){const{_parentSubscriber:e}=this;this._context=null,this._parentSubscriber=null,e.unsubscribe()}}class F extends I{constructor(e,t,r){super(),this.parent=e,this.outerValue=t,this.outerIndex=r,this.index=0}_next(e){this.parent.notifyNext(this.outerValue,e,this.outerIndex,this.index++,this)}_error(e){this.parent.notifyError(e,this),this.unsubscribe()}_complete(){this.parent.notifyComplete(this),this.unsubscribe()}}const H="function"==typeof Symbol&&Symbol.observable||"@@observable";function U(){}let M=(()=>{class e{constructor(e){this._isScalar=!1,e&&(this._subscribe=e)}lift(t){const r=new e;return r.source=this,r.operator=t,r}subscribe(e,t,r){const{operator:s}=this,n=function(e,t,r){if(e){if(e instanceof I)return e;if(e[R])return e[R]()}return e||t||r?new I(e,t,r):new I(O)}(e,t,r);if(n.add(s?s.call(n,this.source):this.source||T.useDeprecatedSynchronousErrorHandling&&!n.syncErrorThrowable?this._subscribe(n):this._trySubscribe(n)),T.useDeprecatedSynchronousErrorHandling&&n.syncErrorThrowable&&(n.syncErrorThrowable=!1,n.syncErrorThrown))throw n.syncErrorValue;return n}_trySubscribe(e){try{return this._subscribe(e)}catch(t){T.useDeprecatedSynchronousErrorHandling&&(e.syncErrorThrown=!0,e.syncErrorValue=t),function(e){for(;e;){const{closed:t,destination:r,isStopped:s}=e;if(t||s)return!1;e=r&&r instanceof I?r:null}return!0}(e)?e.error(t):console.warn(t)}}forEach(e,t){return new(t=L(t))((t,r)=>{let s;s=this.subscribe(t=>{try{e(t)}catch(n){r(n),s&&s.unsubscribe()}},r,t)})}_subscribe(e){const{source:t}=this;return t&&t.subscribe(e)}[H](){return this}pipe(...e){return 0===e.length?this:((t=e)?1===t.length?t[0]:function(e){return t.reduce((e,t)=>t(e),e)}:U)(this);var t}toPromise(e){return new(e=L(e))((e,t)=>{let r;this.subscribe(e=>r=e,e=>t(e),()=>e(r))})}}return e.create=t=>new e(t),e})();function L(e){if(e||(e=T.Promise||Promise),!e)throw new Error("no Promise impl found");return e}const D=e=>t=>{for(let r=0,s=e.length;r<s&&!t.closed;r++)t.next(e[r]);t.closed||t.complete()},q=e=>t=>(e.then(e=>{t.closed||(t.next(e),t.complete())},e=>t.error(e)).then(null,S),t);function V(){return"function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator"}const B=V(),$=e=>t=>{const r=e[B]();for(;;){const e=r.next();if(e.done){t.complete();break}if(t.next(e.value),t.closed)break}return"function"==typeof r.return&&t.add(()=>{r.return&&r.return()}),t},K=e=>t=>{const r=e[H]();if("function"!=typeof r.subscribe)throw new TypeError("Provided object does not correctly implement Symbol.observable");return r.subscribe(t)},J=e=>e&&"number"==typeof e.length&&"function"!=typeof e;function X(e){return!!e&&"function"!=typeof e.subscribe&&"function"==typeof e.then}const W=e=>{if(e instanceof M)return t=>e._isScalar?(t.next(e.value),void t.complete()):e.subscribe(t);if(e&&"function"==typeof e[H])return K(e);if(J(e))return D(e);if(X(e))return q(e);if(e&&"function"==typeof e[B])return $(e);{const t=P(e)?"an invalid object":`'${e}'`;throw new TypeError(`You provided ${t} where a stream was expected.`+" You can provide an Observable, Promise, Array, or Iterable.")}};class Y extends I{notifyNext(e,t,r,s,n){this.destination.next(t)}notifyError(e,t){this.destination.error(e)}notifyComplete(e){this.destination.complete()}}function G(e,t){return function(r){if("function"!=typeof e)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return r.lift(new Q(e,t))}}class Q{constructor(e,t){this.project=e,this.thisArg=t}call(e,t){return t.subscribe(new Z(e,this.project,this.thisArg))}}class Z extends I{constructor(e,t,r){super(e),this.project=t,this.count=0,this.thisArg=r||this}_next(e){let t;try{t=this.project.call(this.thisArg,e,this.count++)}catch(r){return void this.destination.error(r)}this.destination.next(t)}}class ee{constructor(e,t=Number.POSITIVE_INFINITY){this.project=e,this.concurrent=t}call(e,t){return t.subscribe(new te(e,this.project,this.concurrent))}}class te extends Y{constructor(e,t,r=Number.POSITIVE_INFINITY){super(e),this.project=t,this.concurrent=r,this.hasCompleted=!1,this.buffer=[],this.active=0,this.index=0}_next(e){this.active<this.concurrent?this._tryNext(e):this.buffer.push(e)}_tryNext(e){let t;const r=this.index++;try{t=this.project(e,r)}catch(s){return void this.destination.error(s)}this.active++,this._innerSub(t,e,r)}_innerSub(e,t,r){const s=new F(this,void 0,void 0);this.destination.add(s),function(e,t,r,s,n=new F(e,r,s)){n.closed||W(t)(n)}(this,e,t,r,s)}_complete(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()}notifyNext(e,t,r,s,n){this.destination.next(t)}notifyComplete(e){const t=this.buffer;this.remove(e),this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()}}class re{constructor(e,t){this.predicate=e,this.thisArg=t}call(e,t){return t.subscribe(new se(e,this.predicate,this.thisArg))}}class se extends I{constructor(e,t,r){super(e),this.predicate=t,this.thisArg=r,this.count=0}_next(e){let t;try{t=this.predicate.call(this.thisArg,e,this.count++)}catch(r){return void this.destination.error(r)}t&&this.destination.next(e)}}class ne{}class oe{}class ie{constructor(e){this.normalizedNames=new Map,this.lazyUpdate=null,e?this.lazyInit="string"==typeof e?()=>{this.headers=new Map,e.split("\n").forEach(e=>{const t=e.indexOf(":");if(t>0){const r=e.slice(0,t),s=r.toLowerCase(),n=e.slice(t+1).trim();this.maybeSetNormalizedName(r,s),this.headers.has(s)?this.headers.get(s).push(n):this.headers.set(s,[n])}})}:()=>{this.headers=new Map,Object.keys(e).forEach(t=>{let r=e[t];const s=t.toLowerCase();"string"==typeof r&&(r=[r]),r.length>0&&(this.headers.set(s,r),this.maybeSetNormalizedName(t,s))})}:this.headers=new Map}has(e){return this.init(),this.headers.has(e.toLowerCase())}get(e){this.init();const t=this.headers.get(e.toLowerCase());return t&&t.length>0?t[0]:null}keys(){return this.init(),Array.from(this.normalizedNames.values())}getAll(e){return this.init(),this.headers.get(e.toLowerCase())||null}append(e,t){return this.clone({name:e,value:t,op:"a"})}set(e,t){return this.clone({name:e,value:t,op:"s"})}delete(e,t){return this.clone({name:e,value:t,op:"d"})}maybeSetNormalizedName(e,t){this.normalizedNames.has(t)||this.normalizedNames.set(t,e)}init(){this.lazyInit&&(this.lazyInit instanceof ie?this.copyFrom(this.lazyInit):this.lazyInit(),this.lazyInit=null,this.lazyUpdate&&(this.lazyUpdate.forEach(e=>this.applyUpdate(e)),this.lazyUpdate=null))}copyFrom(e){e.init(),Array.from(e.headers.keys()).forEach(t=>{this.headers.set(t,e.headers.get(t)),this.normalizedNames.set(t,e.normalizedNames.get(t))})}clone(e){const t=new ie;return t.lazyInit=this.lazyInit&&this.lazyInit instanceof ie?this.lazyInit:this,t.lazyUpdate=(this.lazyUpdate||[]).concat([e]),t}applyUpdate(e){const t=e.name.toLowerCase();switch(e.op){case"a":case"s":let r=e.value;if("string"==typeof r&&(r=[r]),0===r.length)return;this.maybeSetNormalizedName(e.name,t);const s=("a"===e.op?this.headers.get(t):void 0)||[];s.push(...r),this.headers.set(t,s);break;case"d":const n=e.value;if(n){let e=this.headers.get(t);if(!e)return;0===(e=e.filter(e=>-1===n.indexOf(e))).length?(this.headers.delete(t),this.normalizedNames.delete(t)):this.headers.set(t,e)}else this.headers.delete(t),this.normalizedNames.delete(t)}}forEach(e){this.init(),Array.from(this.normalizedNames.keys()).forEach(t=>e(this.normalizedNames.get(t),this.headers.get(t)))}}class ae{encodeKey(e){return le(e)}encodeValue(e){return le(e)}decodeKey(e){return decodeURIComponent(e)}decodeValue(e){return decodeURIComponent(e)}}function le(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/gi,"$").replace(/%2C/gi,",").replace(/%3B/gi,";").replace(/%2B/gi,"+").replace(/%3D/gi,"=").replace(/%3F/gi,"?").replace(/%2F/gi,"/")}class ue{constructor(e={}){if(this.updates=null,this.cloneFrom=null,this.encoder=e.encoder||new ae,e.fromString){if(e.fromObject)throw new Error("Cannot specify both fromString and fromObject.");this.map=function(e,t){const r=new Map;return e.length>0&&e.split("&").forEach(e=>{const s=e.indexOf("="),[n,o]=-1==s?[t.decodeKey(e),""]:[t.decodeKey(e.slice(0,s)),t.decodeValue(e.slice(s+1))],i=r.get(n)||[];i.push(o),r.set(n,i)}),r}(e.fromString,this.encoder)}else e.fromObject?(this.map=new Map,Object.keys(e.fromObject).forEach(t=>{const r=e.fromObject[t];this.map.set(t,Array.isArray(r)?r:[r])})):this.map=null}has(e){return this.init(),this.map.has(e)}get(e){this.init();const t=this.map.get(e);return t?t[0]:null}getAll(e){return this.init(),this.map.get(e)||null}keys(){return this.init(),Array.from(this.map.keys())}append(e,t){return this.clone({param:e,value:t,op:"a"})}set(e,t){return this.clone({param:e,value:t,op:"s"})}delete(e,t){return this.clone({param:e,value:t,op:"d"})}toString(){return this.init(),this.keys().map(e=>{const t=this.encoder.encodeKey(e);return this.map.get(e).map(e=>t+"="+this.encoder.encodeValue(e)).join("&")}).join("&")}clone(e){const t=new ue({encoder:this.encoder});return t.cloneFrom=this.cloneFrom||this,t.updates=(this.updates||[]).concat([e]),t}init(){null===this.map&&(this.map=new Map),null!==this.cloneFrom&&(this.cloneFrom.init(),this.cloneFrom.keys().forEach(e=>this.map.set(e,this.cloneFrom.map.get(e))),this.updates.forEach(e=>{switch(e.op){case"a":case"s":const t=("a"===e.op?this.map.get(e.param):void 0)||[];t.push(e.value),this.map.set(e.param,t);break;case"d":if(void 0===e.value){this.map.delete(e.param);break}{let t=this.map.get(e.param)||[];const r=t.indexOf(e.value);-1!==r&&t.splice(r,1),t.length>0?this.map.set(e.param,t):this.map.delete(e.param)}}}),this.cloneFrom=this.updates=null)}}function ce(e){return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer}function he(e){return"undefined"!=typeof Blob&&e instanceof Blob}function de(e){return"undefined"!=typeof FormData&&e instanceof FormData}class pe{constructor(e,t,r,s){let n;if(this.url=t,this.body=null,this.reportProgress=!1,this.withCredentials=!1,this.responseType="json",this.method=e.toUpperCase(),function(e){switch(e){case"DELETE":case"GET":case"HEAD":case"OPTIONS":case"JSONP":return!1;default:return!0}}(this.method)||s?(this.body=void 0!==r?r:null,n=s):n=r,n&&(this.reportProgress=!!n.reportProgress,this.withCredentials=!!n.withCredentials,n.responseType&&(this.responseType=n.responseType),n.headers&&(this.headers=n.headers),n.params&&(this.params=n.params)),this.headers||(this.headers=new ie),this.params){const e=this.params.toString();if(0===e.length)this.urlWithParams=t;else{const r=t.indexOf("?");this.urlWithParams=t+(-1===r?"?":r<t.length-1?"&":"")+e}}else this.params=new ue,this.urlWithParams=t}serializeBody(){return null===this.body?null:ce(this.body)||he(this.body)||de(this.body)||"string"==typeof this.body?this.body:this.body instanceof ue?this.body.toString():"object"==typeof this.body||"boolean"==typeof this.body||Array.isArray(this.body)?JSON.stringify(this.body):this.body.toString()}detectContentTypeHeader(){return null===this.body?null:de(this.body)?null:he(this.body)?this.body.type||null:ce(this.body)?null:"string"==typeof this.body?"text/plain":this.body instanceof ue?"application/x-www-form-urlencoded;charset=UTF-8":"object"==typeof this.body||"number"==typeof this.body||Array.isArray(this.body)?"application/json":null}clone(e={}){const t=e.method||this.method,r=e.url||this.url,s=e.responseType||this.responseType,n=void 0!==e.body?e.body:this.body,o=void 0!==e.withCredentials?e.withCredentials:this.withCredentials,i=void 0!==e.reportProgress?e.reportProgress:this.reportProgress;let a=e.headers||this.headers,l=e.params||this.params;return void 0!==e.setHeaders&&(a=Object.keys(e.setHeaders).reduce((t,r)=>t.set(r,e.setHeaders[r]),a)),e.setParams&&(l=Object.keys(e.setParams).reduce((t,r)=>t.set(r,e.setParams[r]),l)),new pe(t,r,n,{params:l,headers:a,reportProgress:i,responseType:s,withCredentials:o})}}const fe=function(){var e={Sent:0,UploadProgress:1,ResponseHeader:2,DownloadProgress:3,Response:4,User:5};return e[e.Sent]="Sent",e[e.UploadProgress]="UploadProgress",e[e.ResponseHeader]="ResponseHeader",e[e.DownloadProgress]="DownloadProgress",e[e.Response]="Response",e[e.User]="User",e}();class be{constructor(e,t=200,r="OK"){this.headers=e.headers||new ie,this.status=void 0!==e.status?e.status:t,this.statusText=e.statusText||r,this.url=e.url||null,this.ok=this.status>=200&&this.status<300}}class me extends be{constructor(e={}){super(e),this.type=fe.ResponseHeader}clone(e={}){return new me({headers:e.headers||this.headers,status:void 0!==e.status?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}}class ye extends be{constructor(e={}){super(e),this.type=fe.Response,this.body=void 0!==e.body?e.body:null}clone(e={}){return new ye({body:void 0!==e.body?e.body:this.body,headers:e.headers||this.headers,status:void 0!==e.status?e.status:this.status,statusText:e.statusText||this.statusText,url:e.url||this.url||void 0})}}class ge extends be{constructor(e){super(e,0,"Unknown Error"),this.name="HttpErrorResponse",this.ok=!1,this.message=this.status>=200&&this.status<300?`Http failure during parsing for ${e.url||"(unknown url)"}`:`Http failure response for ${e.url||"(unknown url)"}: ${e.status} ${e.statusText}`,this.error=e.error||null}}function we(e,t){return{body:t,headers:e.headers,observe:e.observe,params:e.params,reportProgress:e.reportProgress,responseType:e.responseType,withCredentials:e.withCredentials}}class ve{constructor(e){this.handler=e}request(e,t,r={}){let s;if(e instanceof pe)s=e;else{let n=void 0;n=r.headers instanceof ie?r.headers:new ie(r.headers);let o=void 0;r.params&&(o=r.params instanceof ue?r.params:new ue({fromObject:r.params})),s=new pe(e,t,void 0!==r.body?r.body:null,{headers:n,params:o,reportProgress:r.reportProgress,responseType:r.responseType||"json",withCredentials:r.withCredentials})}const n=Object(_.of)(s).pipe(function e(t,r,s=Number.POSITIVE_INFINITY){return"function"==typeof r?n=>n.pipe(e((e,s)=>(function(e,t){return e instanceof M?e:new M(W(e))})(t(e,s)).pipe(G((t,n)=>r(e,t,s,n))),s)):("number"==typeof r&&(s=r),e=>e.lift(new ee(t,s)))}(e=>this.handler.handle(e),o,1));var o;if(e instanceof pe||"events"===r.observe)return n;const i=n.pipe((a=e=>e instanceof ye,function(e){return e.lift(new re(a,void 0))}));var a;switch(r.observe||"body"){case"body":switch(s.responseType){case"arraybuffer":return i.pipe(G(e=>{if(null!==e.body&&!(e.body instanceof ArrayBuffer))throw new Error("Response is not an ArrayBuffer.");return e.body}));case"blob":return i.pipe(G(e=>{if(null!==e.body&&!(e.body instanceof Blob))throw new Error("Response is not a Blob.");return e.body}));case"text":return i.pipe(G(e=>{if(null!==e.body&&"string"!=typeof e.body)throw new Error("Response is not a string.");return e.body}));case"json":default:return i.pipe(G(e=>e.body))}case"response":return i;default:throw new Error(`Unreachable: unhandled observe type ${r.observe}}`)}}delete(e,t={}){return this.request("DELETE",e,t)}get(e,t={}){return this.request("GET",e,t)}head(e,t={}){return this.request("HEAD",e,t)}jsonp(e,t){return this.request("JSONP",e,{params:(new ue).append(t,"JSONP_CALLBACK"),observe:"body",responseType:"json"})}options(e,t={}){return this.request("OPTIONS",e,t)}patch(e,t,r={}){return this.request("PATCH",e,we(r,t))}post(e,t,r={}){return this.request("POST",e,we(r,t))}put(e,t,r={}){return this.request("PUT",e,we(r,t))}}class _e{constructor(e,t){this.next=e,this.interceptor=t}handle(e){return this.interceptor.intercept(e,this.next)}}const xe=new a.InjectionToken("HTTP_INTERCEPTORS");class Ee{intercept(e,t){return t.handle(e)}}const Te=/^\)\]\}',?\n/;class Se{}class Oe{constructor(){}build(){return new XMLHttpRequest}}class Ce{constructor(e){this.xhrFactory=e}handle(e){if("JSONP"===e.method)throw new Error("Attempted to construct Jsonp request without JsonpClientModule installed.");return new _.Observable(t=>{const r=this.xhrFactory.build();if(r.open(e.method,e.urlWithParams),e.withCredentials&&(r.withCredentials=!0),e.headers.forEach((e,t)=>r.setRequestHeader(e,t.join(","))),e.headers.has("Accept")||r.setRequestHeader("Accept","application/json, text/plain, */*"),!e.headers.has("Content-Type")){const t=e.detectContentTypeHeader();null!==t&&r.setRequestHeader("Content-Type",t)}if(e.responseType){const t=e.responseType.toLowerCase();r.responseType="json"!==t?t:"text"}const s=e.serializeBody();let n=null;const o=()=>{if(null!==n)return n;const t=1223===r.status?204:r.status,s=r.statusText||"OK",o=new ie(r.getAllResponseHeaders()),i=function(e){return"responseURL"in e&&e.responseURL?e.responseURL:/^X-Request-URL:/m.test(e.getAllResponseHeaders())?e.getResponseHeader("X-Request-URL"):null}(r)||e.url;return n=new me({headers:o,status:t,statusText:s,url:i})},i=()=>{let{headers:s,status:n,statusText:i,url:a}=o(),l=null;204!==n&&(l=void 0===r.response?r.responseText:r.response),0===n&&(n=l?200:0);let u=n>=200&&n<300;if("json"===e.responseType&&"string"==typeof l){const e=l;l=l.replace(Te,"");try{l=""!==l?JSON.parse(l):null}catch(c){l=e,u&&(u=!1,l={error:c,text:l})}}u?(t.next(new ye({body:l,headers:s,status:n,statusText:i,url:a||void 0})),t.complete()):t.error(new ge({error:l,headers:s,status:n,statusText:i,url:a||void 0}))},a=e=>{const{url:s}=o(),n=new ge({error:e,status:r.status||0,statusText:r.statusText||"Unknown Error",url:s||void 0});t.error(n)};let l=!1;const u=s=>{l||(t.next(o()),l=!0);let n={type:fe.DownloadProgress,loaded:s.loaded};s.lengthComputable&&(n.total=s.total),"text"===e.responseType&&r.responseText&&(n.partialText=r.responseText),t.next(n)},c=e=>{let r={type:fe.UploadProgress,loaded:e.loaded};e.lengthComputable&&(r.total=e.total),t.next(r)};return r.addEventListener("load",i),r.addEventListener("error",a),e.reportProgress&&(r.addEventListener("progress",u),null!==s&&r.upload&&r.upload.addEventListener("progress",c)),r.send(s),t.next({type:fe.Sent}),()=>{r.removeEventListener("error",a),r.removeEventListener("load",i),e.reportProgress&&(r.removeEventListener("progress",u),null!==s&&r.upload&&r.upload.removeEventListener("progress",c)),r.abort()}})}}const Pe=new a.InjectionToken("XSRF_COOKIE_NAME"),je=new a.InjectionToken("XSRF_HEADER_NAME");class ke{}class Ne{constructor(e,t,r){this.doc=e,this.platform=t,this.cookieName=r,this.lastCookieString="",this.lastToken=null,this.parseCount=0}getToken(){if("server"===this.platform)return null;const e=this.doc.cookie||"";return e!==this.lastCookieString&&(this.parseCount++,this.lastToken=Object(v["ɵparseCookieValue"])(e,this.cookieName),this.lastCookieString=e),this.lastToken}}class Ae{constructor(e,t){this.tokenService=e,this.headerName=t}intercept(e,t){const r=e.url.toLowerCase();if("GET"===e.method||"HEAD"===e.method||r.startsWith("http://")||r.startsWith("https://"))return t.handle(e);const s=this.tokenService.getToken();return null===s||e.headers.has(this.headerName)||(e=e.clone({headers:e.headers.set(this.headerName,s)})),t.handle(e)}}class Re{constructor(e,t){this.backend=e,this.injector=t,this.chain=null}handle(e){if(null===this.chain){const e=this.injector.get(xe,[]);this.chain=e.reduceRight((e,t)=>new _e(e,t),this.backend)}return this.chain.handle(e)}}class Ie{static disable(){return{ngModule:Ie,providers:[{provide:Ae,useClass:Ee}]}}static withOptions(e={}){return{ngModule:Ie,providers:[e.cookieName?{provide:Pe,useValue:e.cookieName}:[],e.headerName?{provide:je,useValue:e.headerName}:[]]}}}class ze{}class Fe{get electron(){return this._electron?this._electron:window&&window.require?(this._electron=window.require("electron"),this._electron):null}get isElectronApp(){return!!window.navigator.userAgent.match(/Electron/)}get isMacOS(){return this.isElectronApp&&"darwin"===process.platform}get isWindows(){return this.isElectronApp&&"win32"===process.platform}get isLinux(){return this.isElectronApp&&"linux"===process.platform}get isX86(){return this.isElectronApp&&"ia32"===process.arch}get isX64(){return this.isElectronApp&&"x64"===process.arch}get isArm(){return this.isElectronApp&&"arm"===process.arch}get desktopCapturer(){return this.electron?this.electron.desktopCapturer:null}get ipcRenderer(){return this.electron?this.electron.ipcRenderer:null}get remote(){return this.electron?this.electron.remote:null}get webFrame(){return this.electron?this.electron.webFrame:null}get clipboard(){return this.electron?this.electron.clipboard:null}get crashReporter(){return this.electron?this.electron.crashReporter:null}get process(){return this.remote?this.remote.process:null}get nativeImage(){return this.electron?this.electron.nativeImage:null}get screen(){return this.electron?this.remote.screen:null}get shell(){return this.electron?this.electron.shell:null}}class He extends Fe{constructor(){super()}}class Ue{}var Me=r("3xDq"),Le=r("cfyg"),De=a["ɵcmf"](i,[],(function(e){return a["ɵmod"]([a["ɵmpd"](512,a.ComponentFactoryResolver,a["ɵCodegenComponentFactoryResolver"],[[8,[h,b,w]],[3,a.ComponentFactoryResolver],a.NgModuleRef]),a["ɵmpd"](4608,v.NgLocalization,v.NgLocaleLocalization,[a.LOCALE_ID,[2,v["ɵangular_packages_common_common_a"]]]),a["ɵmpd"](4608,ke,Ne,[v.DOCUMENT,a.PLATFORM_ID,Pe]),a["ɵmpd"](4608,Ae,Ae,[ke,je]),a["ɵmpd"](5120,xe,(function(e){return[e]}),[Ae]),a["ɵmpd"](4608,Oe,Oe,[]),a["ɵmpd"](6144,Se,null,[Oe]),a["ɵmpd"](4608,Ce,Ce,[Se]),a["ɵmpd"](6144,oe,null,[Ce]),a["ɵmpd"](4608,ne,Re,[oe,a.Injector]),a["ɵmpd"](4608,ve,ve,[ne]),a["ɵmpd"](4608,Fe,He,[]),a["ɵmpd"](4608,Me.FormBuilder,Me.FormBuilder,[]),a["ɵmpd"](4608,Me["ɵangular_packages_forms_forms_o"],Me["ɵangular_packages_forms_forms_o"],[]),a["ɵmpd"](1073742336,v.CommonModule,v.CommonModule,[]),a["ɵmpd"](1073742336,Ie,Ie,[]),a["ɵmpd"](1073742336,ze,ze,[]),a["ɵmpd"](1073742336,Ue,Ue,[]),a["ɵmpd"](1073742336,Me["ɵangular_packages_forms_forms_d"],Me["ɵangular_packages_forms_forms_d"],[]),a["ɵmpd"](1073742336,Me.ReactiveFormsModule,Me.ReactiveFormsModule,[]),a["ɵmpd"](1073742336,Me.FormsModule,Me.FormsModule,[]),a["ɵmpd"](1073742336,Le.SharedModule,Le.SharedModule,[]),a["ɵmpd"](1073742336,i,i,[]),a["ɵmpd"](256,Pe,"XSRF-TOKEN",[]),a["ɵmpd"](256,je,"X-XSRF-TOKEN",[])])}));r.d(t,"ProvidersModule",(function(){return i})),r.d(t,"ProvidersModuleNgFactory",(function(){return De})),t.default=De}})}));
//# sourceMappingURL=providers.js.map
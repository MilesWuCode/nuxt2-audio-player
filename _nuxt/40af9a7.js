(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{133:function(t,n,o){"use strict";var r=o(1),e=o(179),l=o.n(e);o(248),o(250);r.default.component("VueSlider",l.a)},184:function(t,n,o){o(185),t.exports=o(186)},244:function(t,n){},245:function(t,n,o){"use strict";o.r(n),o.d(n,"state",(function(){return r})),o.d(n,"actions",(function(){return e})),o.d(n,"mutations",(function(){return l}));o(246),o(14),o(247);var r=function(){return{album:null,list:[],current:null,loop:!1}},e={play:function(t,n){(0,t.commit)("setState",n)},prev:function(t){(0,t.commit)("prev")},next:function(t){(0,t.commit)("next")},loop:function(t){(0,t.commit)("loop")},stop:function(t){(0,t.commit)("setCurrent",null)}},l={setState:function(t,n){t.album=n.album,t.list=n.album.list.length>0?n.album.list:[],t.current=t.list.find((function(t){return t.id===n.id}))||t.list[0]||null},setCurrent:function(t,n){t.current=n},prev:function(t){var n=t.list.findIndex((function(n){return n.id===t.current.id}));-1!==n&&(!0===t.loop?t.current=t.list[Math.max(0===n?t.list.length-1:n-1,0)]:t.current=t.list[Math.max(n-1,0)])},next:function(t){var n=t.list.findIndex((function(n){return n.id===t.current.id}));-1!==n&&(!0===t.loop?t.current=t.list[Math.min(n+1===t.list.length?0:n+1,t.list.length-1)]:t.current=t.list[Math.min(n+1,t.list.length-1)])},loop:function(t){t.loop=!t.loop}}}},[[184,10,2,11]]]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[3,6,7],{253:function(t,l,n){"use strict";n.r(l);var e={name:"PlayAlbumButton",props:{album:{type:Object,required:!0}},methods:{onClick:function(){this.$store.dispatch("player/play",{album:this.album})}}},r=n(43),component=Object(r.a)(e,(function(){var t=this,l=t.$createElement;return(t._self._c||l)("button",{on:{click:t.onClick}},[t._v("\n  "+t._s(t.album.name)+"\n")])}),[],!1,null,null,null);l.default=component.exports},254:function(t,l,n){"use strict";n.r(l);var e={name:"PlayTrackButton",props:{album:{type:Object,required:!0},track:{type:Object,required:!0}},methods:{onClick:function(){this.$store.dispatch("player/play",{album:this.album,id:this.track.id})}}},r=n(43),component=Object(r.a)(e,(function(){var t=this,l=t.$createElement;return(t._self._c||l)("button",{on:{click:t.onClick}},[t._v("\n  "+t._s(t.track.name)+"\n")])}),[],!1,null,null,null);l.default=component.exports},269:function(t,l,n){"use strict";n.r(l);var e={name:"AlbumInfo",props:{album:{type:Object||null,default:null}}},r=n(43),component=Object(r.a)(e,(function(){var t=this,l=t.$createElement,n=t._self._c||l;return n("details",[n("summary",[t._v(t._s(t.album.name))]),t._v(" "),n("div",[n("PlayAlbumButton",{attrs:{album:t.album}}),t._v(" "),t._l(t.album.list,(function(l){return n("PlayTrackButton",{key:l.id,attrs:{album:t.album,track:l}})}))],2)])}),[],!1,null,null,null);l.default=component.exports;installComponents(component,{PlayAlbumButton:n(253).default,PlayTrackButton:n(254).default})}}]);
const { ROUTES_WITHOUT_CALL_IFRAME } = require("@cadence-frontend/constants");

var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function (d) {
	var e = 0;
	return function () {
		return e < d.length
			? {
					done: !1,
					value: d[e++],
			  }
			: {
					done: !0,
			  };
	};
};
$jscomp.arrayIterator = function (d) {
	return {
		next: $jscomp.arrayIteratorImpl(d),
	};
};
$jscomp.makeIterator = function (d) {
	var e = "undefined" != typeof Symbol && Symbol.iterator && d[Symbol.iterator];
	return e ? e.call(d) : $jscomp.arrayIterator(d);
};
$jscomp.arrayFromIterator = function (d) {
	for (var e, h = []; !(e = d.next()).done; ) h.push(e.value);
	return h;
};
$jscomp.arrayFromIterable = function (d) {
	return d instanceof Array ? d : $jscomp.arrayFromIterator($jscomp.makeIterator(d));
};
$jscomp.getRestArguments = function () {
	for (var d = Number(this), e = [], h = d; h < arguments.length; h++)
		e[h - d] = arguments[h];
	return e;
};
(function () {
	var d = (function () {
		var e = function (a) {
				console.error("ringover-sdk: " + a);
				return !1;
			},
			h = {
				small: {
					height: "500px",
					width: "350px",
				},
				medium: {
					height: "620px",
					width: "380px",
				},
				big: {
					height: "750px",
					width: "1050px",
				},
				auto: {
					height: "100%",
					width: "100%",
				},
			},
			n = function (a) {
				return JSON.parse(
					JSON.stringify({
						changePage: [],
						hangupCall: [],
						ringingCall: [],
						answeredCall: [],
						dialerReady: [],
						login: [],
					})
				);
			},
			k = n(),
			q = function (a) {
				var b = document.createElement("IFRAME"),
					c;
				for (c in a) b.style[c] = a[c];
				b.allow = "microphone;autoplay;clipboard-read;clipboard-write;";
				return b;
			},
			r = function (a) {
				var b = document.createElement("DIV"),
					c;
				for (c in a) b.style[c] = a[c];
				b.id =
					"ringover-tray-" +
					parseInt(
						(new Date().getTime() + Math.random()).toString().replace(".", "")
					).toString(16);
				return b;
			},
			l = function (a) {
				a.style.opacity = "1";
				a.style.maxHeight = "100%";
				"false" === a.dataset.animation && (a.style.display = "inline-block");
				return !0;
			},
			m = function (a) {
				"false" === a.dataset.animation && (a.style.display = "none");
				a.style.opacity = "0";
				a.style.maxHeight = "0px";
				return !1;
			},
			p = function (a, b) {
				if (
					b.data &&
					b.data.action === "ringingCall" &&
					ROUTES_WITHOUT_CALL_IFRAME.includes(window.location.pathname)
				)
					return;

				var c = a.iframe;
				if (b.data && b.data.action)
					switch (b.data.action) {
						case "checkSDK":
							c.contentWindow.postMessage(
								{
									action: "presenceSDK",
									location: window.location.origin,
								},
								"https://app.ringover.com"
							);
							break;
						case "changePage":
							if (a.lastPage === b.data.data.page) break;
							a.lastPage = b.data.data.page;
							if (k[b.data.action]) {
								var g = $jscomp.makeIterator(k[b.data.action]);
								for (c = g.next(); !c.done; c = g.next()) (c = c.value), c(b.data);
							}
							break;
						case "ringingCall":
							console.log("ringingCall");
							if (!ROUTES_WITHOUT_CALL_IFRAME.includes(window.location.pathname)) break;
							a.show();
							if (k[b.data.action])
								for (
									g = $jscomp.makeIterator(k[b.data.action]), c = g.next();
									!c.done;
									c = g.next()
								)
									(c = c.value), c(b.data);
							break;
						default:
							if (k[b.data.action])
								for (
									g = $jscomp.makeIterator(k[b.data.action]), c = g.next();
									!c.done;
									c = g.next()
								)
									(c = c.value), c(b.data);
					}
			},
			t = function (a) {
				a.iframe.onmessage = function () {
					var b = $jscomp.getRestArguments.apply(0, arguments);
					return p.apply(null, [a].concat($jscomp.arrayFromIterable(b)));
				};
				window.onmessage = function () {
					var b = $jscomp.getRestArguments.apply(0, arguments);
					return p.apply(null, [a].concat($jscomp.arrayFromIterable(b)));
				};
			},
			f = function (a) {
				var b = this;
				a = void 0 === a ? {} : a;
				this.status = -1;
				this.display = !1;
				this.style = JSON.parse(
					JSON.stringify({
						position: "fixed",
						display: "inline-block",
						zIndex: "9999",
						border: "1px solid #9CA3AC",
						borderRadius: "10px",
						transition: "all .5s linear",
						maxHeight: "0px",
						opacity: "0",
					})
				);
				if ("object" !== typeof a || Array.isArray(a) || null === a)
					return (
						(this.status = 0),
						e("Options object not conform. Please referer to documentation!")
					);
				this.container = document.body;
				if (a.container) {
					var c = document.getElementById(a.container);
					c
						? (this.container = c)
						: e("Container is not found. Document body used instead");
				}
				this.style.position =
					a.type && ["fixed", "relative", "absolute"].includes(a.type)
						? a.type
						: this.container != document.body
						? "relative"
						: "fixed";
				this.size =
					a.size && ["big", "medium", "small", "auto"].includes(a.size)
						? a.size
						: "medium";
				this.animation = !0;
				this.lastPage = null;
				void 0 === a.border || a.border || (this.style.border = "0 transparent");
				void 0 === a.animation ||
					a.animation ||
					((this.animation = !1),
					(this.style.transition = null),
					(this.style.display = "none"));
				a.position
					? (a.position.top && (this.style.top = a.position.top),
					  a.position.bottom && (this.style.bottom = a.position.bottom),
					  a.position.left && (this.style.left = a.position.left),
					  a.position.right && (this.style.right = a.position.right))
					: ["auto", "big"].includes(this.size)
					? ((this.style.top = "0"), (this.style.left = "0"))
					: ((this.style.right = "50px"), (this.style.bottom = "50px"));
				for (var g in h[this.size]) this.style[g] = h[this.size][g];
				this.iframe = q(this.style);
				this.iframe.dataset.animation = this.animation;
				this.tray = null;
				this.trayicon = !0;
				this.traystyle = JSON.parse(
					JSON.stringify({
						backgroundImage:
							"url(https://webcdn.ringover.com/app/img/logo/icon/icon.png)",
						backgroundRepeat: "no-repeat",
						backgroundSize: "contain",
						zIndex: "9999",
						width: "30px",
						height: "30px",
						cursor: "pointer",
					})
				);
				void 0 === a.trayicon || a.trayicon || (this.trayicon = !1);
				this.trayicon &&
					(a.trayposition
						? (a.trayposition.top && (this.traystyle.top = a.trayposition.top),
						  a.trayposition.bottom && (this.traystyle.bottom = a.trayposition.bottom),
						  a.trayposition.left && (this.traystyle.left = a.trayposition.left),
						  a.trayposition.right && (this.traystyle.right = a.trayposition.right))
						: ((this.traystyle.bottom =
								this.container != document.body ? "-30px" : "10px"),
						  (this.traystyle.right =
								this.container != document.body ? "-30px" : "10px")),
					(this.traystyle.position =
						this.container != document.body ? "absolute" : "fixed"),
					(this.tray = r(this.traystyle)),
					(this.tray.onclick = function (u) {
						return b.toggle();
					}),
					(this.iframe.dataset.tray = this.tray.id));
				t(this);
				this.iframe.src = "https://app.ringover.com";
			};
		f.prototype.checkStatus = function (a) {
			a = void 0 === a ? !1 : a;
			if (this.iframe)
				switch (this.status) {
					case 1:
					case 2:
						return !0;
					case -1:
						if (a) return !0;
						e("Iframe not ready!");
						break;
					case 0:
						e("Iframe not available!");
						break;
					default:
						e();
				}
			else e("Iframe not found");
			return !1;
		};
		f.prototype.generate = function () {
			if (this.checkStatus(1)) {
				if (2 === this.status) return e("Iframe already present in DOM");
				this.container.style.position = "relative";
				this.container.appendChild(this.iframe);
				this.tray && this.container.appendChild(this.tray);
				this.show();
				this.status = 2;
				return this.iframe;
			}
		};
		f.prototype.destroy = function () {
			this.checkStatus();
			if (1 === this.status) return e("Iframe not found in DOM");
			this.hide();
			this.tray && this.tray.parentNode && this.tray.parentNode.removeChild(this.tray);
			this.iframe.parentNode && this.iframe.parentNode.removeChild(this.iframe);
			this.status = 1;
			return !0;
		};
		f.prototype.show = function () {
			if (this.checkStatus(1)) return (this.display = l(this.iframe)), this.isDisplay();
		};
		f.prototype.hide = function () {
			if (this.checkStatus(1)) return (this.display = m(this.iframe)), this.isDisplay();
		};
		f.prototype.toggle = function (a) {
			a = void 0 === a ? null : a;
			if (this.checkStatus(1))
				return (
					(this.display =
						null === a
							? this.display
								? m(this.iframe)
								: l(this.iframe)
							: a
							? l(this.iframe)
							: m(this.iframe)),
					this.isDisplay()
				);
		};
		f.prototype.isDisplay = function () {
			return this.display;
		};
		f.prototype.dial = function (a) {
			if (!this.checkStatus()) return !1;
			this.iframe.contentWindow.postMessage(
				{
					action: "dial",
					number: a,
				},
				"https://app.ringover.com"
			);
			this.display = l(this.iframe);
			return !0;
		};
		f.prototype.changePage = function (a) {
			if (!this.checkStatus()) return !1;
			this.iframe.contentWindow.postMessage(
				{
					action: "changePage",
					page: a,
				},
				"https://app.ringover.com"
			);
			return !0;
		};
		f.prototype.reload = function () {
			if (!this.checkStatus()) return !1;
			this.iframe.contentWindow.postMessage(
				{
					action: "reload",
				},
				"https://app.ringover.com"
			);
			return !0;
		};
		f.prototype.logout = function () {
			if (!this.checkStatus()) return !1;
			this.iframe.contentWindow.postMessage(
				{
					action: "changePage",
					page: "logout",
				},
				"https://app.ringover.com"
			);
			return !0;
		};
		f.prototype.getCurrentPage = function () {
			return this.checkStatus() ? this.lastPage : !1;
		};
		f.prototype.on = function (a, b) {
			if (!this.checkStatus(1)) return !1;
			k[a] && k[a].push(b);
			return !0;
		};
		f.prototype.off = function () {
			if (!this.checkStatus(1)) return !1;
			k = n();
			return !0;
		};
		return f;
	})();
	"function" === typeof define && define.amd
		? (Object.defineProperty(exports, "__esModule", {
				value: !0,
		  }),
		  define(function () {
				return d;
		  }))
		: "undefined" !== typeof module && module.exports
		? (module.exports = d)
		: (this.RingoverSDK = d);
})();

/**
 * @license Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
! function() {
    var t, e, n, i, s, a, r, o, c, u, l, d, h, p, f, g, m, v, b, y, x, w, C, T, k, I, E;
    C = function() {
            "use strict";

            function t() {}
            return t.prototype = {
                fixesMapping: {},
                config: {}
            }, t.prototype.constructor = t, t.fixes = {}, t.prototype.process = function(t, e, n) {}, t.prototype.filterIssues = function(t, e) {
                if (this._filterIssue) {
                    var n = this,
                        i = function(t) {
                            return n._filterIssue.call(n, t, e)
                        };
                    t.filter(i)
                }
            }, t.prototype.getIssueDetails = function(t, e) {}, t.getFixType = function(e, n) {
                t.fixes[e] ? n && n(t.fixes[e]) : ! function(i) {
                    t.fixes[e] = i, n && n(i)
                }()
            }, t.prototype.getFixes = function(t, e, n) {
                var i = this.fixesMapping[t.id];
                if (i && i.length) {
                    var s, a = [],
                        r = function(t) {
                            a.push(t), a.length === i.length && e(a)
                        };
                    for (s = 0; s < i.length; s++) CKEDITOR.plugins.a11ychecker.quickFixes.getInstance({
                        name: i[s],
                        callback: r,
                        issue: t,
                        langCode: n
                    })
                } else e([])
            }, t.prototype.createConfig = function(t) {
                return {}
            }, t.prototype._filterIssue = null, t
        }(), T = function() {
            "use strict";

            function t(t, e) {
                CKEDITOR.tools.extend(this, t, !0), this.engine = e
            }
            return t.testability = {
                    ERROR: 1,
                    WARNING: .5,
                    NOTICE: 0
                },
                t.prototype = {
                    testability: t.testability.NOTICE,
                    element: null,
                    originalElement: null,
                    details: null,
                    engine: null,
                    id: null,
                    _ignored: null
                }, t.prototype.constructor = t, t.prototype.setIgnored = function(t) {
                    var e, n = (this.element.data("a11y-ignore") || "").split(",");
                    if (this._ignored = null, t) n[0] || 1 !== n.length ? n.push(this.id) : n[0] = this.id;
                    else
                        for (; - 1 !== (e = CKEDITOR.tools.indexOf(n, this.id));) n.splice(e, 1);
                    this.element.data("a11y-ignore", n.join(",") || !1)
                }, t.prototype.isIgnored = function() {
                    return null === this._ignored && (this._ignored = this.checkIgnored()), this._ignored
                }, t.prototype.ignore = function() {
                    this.setIgnored(!0)
                }, t.prototype.checkIgnored = function() {
                    var t = this.element.data("a11y-ignore") || "";
                    return -1 !== CKEDITOR.tools.indexOf(t.split(","), this.id)
                }, t.prototype.getDetails = function(t) {
                    if (this.details) t(this.details);
                    else {
                        var e = this;
                        this.engine.getIssueDetails(this, function(n) {
                            e.details = n, t(n)
                        })
                    }
                }, t
        }(), k = function() {
            "use strict";

            function t() {
                this.list = []
            }

            function e(t, e) {
                var n = 0;
                return n = t.element.getPosition(e.element) & CKEDITOR.POSITION_FOLLOWING ? 1 : -1;
            }
            return t.prototype = {
                list: [],
                currentIndex: -1
            }, t.prototype.constructor = t, t.prototype.each = function(t) {
                var e = this.list;
                if (e.map) e.map(t, this);
                else
                    for (var n = 0, i = e.length; i > n; n++) t.call(this, e[n])
            }, t.prototype.count = function(t) {
                if (t) {
                    var e = 0,
                        n = 0;
                    for (n = 0; n < this.list.length; n++) this.list[n].isIgnored() || (e += 1);
                    return e
                }
                return this.list.length
            }, t.prototype.addItem = function(t) {
                this.list.push(t)
            }, t.prototype.getItem = function(t) {
                var e = this.list[t];
                return e ? e : null
            }, t.prototype.clear = function() {
                this.list.splice(0, this.list.length), this.resetFocus()
            }, t.prototype.resetFocus = function() {
                if (-1 !== this.currentIndex) {
                    var t = this.getFocused();
                    this.currentIndex = -1, this.fire("focusChanged", {
                        current: null,
                        previous: t
                    })
                }
            }, t.prototype.getFocused = function() {
                return -1 != this.currentIndex ? this.getItem(this.currentIndex) : null
            }, t.prototype.moveTo = function(t) {
                if (!this.getItem(t)) return !1;
                var e = this.getFocused();
                return this.currentIndex = t, this.fire("focusChanged", {
                    current: this.getItem(t),
                    previous: e
                }), !0
            }, t.prototype.next = function() {
                return this.count() ? (this.currentIndex + 1 > this.count() - 1 ? 0 !== this.currentIndex && this.moveTo(0) : this.moveTo(this.currentIndex + 1), this.getFocused()) : null
            }, t.prototype.prev = function() {
                if (!this.count()) return null;
                var t = this.count() - 1;
                return 0 === this.currentIndex || -1 == this.currentIndex ? this.currentIndex != t && this.moveTo(t) : this.moveTo(this.currentIndex - 1), this.getFocused()
            }, t.prototype.getIssueByElement = function(t) {
                var e = null;
                return this.each(function(n) {
                    n.element.equals(t) && (e = n)
                }), e
            }, t.prototype.getIssuesByElement = function(t, e) {
                for (var n, i, s = [], a = this.list, r = 0, o = a.length; o > r; r++) n = a[r], i = !e || !n.isIgnored(), n.element.equals(t) && i && s.push(n);
                return s
            }, t.prototype.indexOf = function(t) {
                return CKEDITOR.tools.indexOf(this.list, t)
            }, t.prototype.getIssueByIndex = function(t) {
                var e = this.getItem(t);
                return e.element
            }, t.prototype.sort = function() {
                this.list.sort(e)
            }, t.prototype.filter = function(t) {
                return this.list = this.list.filter(t), this.list
            }, CKEDITOR.event.implementOn(t.prototype), t
        }(), I = function() {
            "use strict";

            function t(t, e, n, i) {
                this.title = t, this.descr = e, this.path = n || [], this.data = i
            }
            return t.prototype = {}, t.prototype.constructor = t, t
        }(), t = function() {
            "use strict";

            function t(t) {
                this.basePath = t || ""
            }
            t.prototype = {}, t.prototype.constructor = t;
            var e = {},
                n = {};
            return t.prototype.get = function(t) {
                var i, s, a = t.name,
                    r = t.callback;
                return e[a] ? void r(e[a]) : (n[a] || (n[a] = []), n[a].push(r), void(e[a] !== !1 && (i = {
                    name: a
                }, e[a] = !1, s = this.fire("requested", i), s !== !1 && this.requestQuickFix(t))))
            }, t.prototype.requestQuickFix = function(t) {
                CKEDITOR.scriptLoader.load(this.basePath + t.name + ".js")
            }, t.prototype.add = function(t, i) {
                var s, a = n[t] || [],
                    r = a.length;
                for (e[t] = i, s = 0; r > s; s++) a[s](i);
                delete n[t]
            }, t.prototype.setLoadedTypes = function(t) {
                e = t
            }, t.prototype.getLoadedTypes = function() {
                return e
            }, t.prototype.getWaitingCallbacks = function() {
                return n
            }, CKEDITOR.event.implementOn(t.prototype), t
        }(), e = function(t) {
            "use strict";

            function e(e) {
                t.call(this, e)
            }
            e.prototype = new t, e.prototype.constructor = e, e.prototype._langDictionary = {};
            var n = {},
                i = [];
            return e.prototype.get = function(e) {
                return e.langCode = e.langCode || "en", this.deferGetCall(e.langCode, arguments) ? void 0 : (CKEDITOR.plugins.a11ychecker.dev || (e.name = e.langCode + "/" + e.name), t.prototype.get.call(this, e))
            }, e.prototype.getInstance = function(t) {
                t = t || {};
                var e = t.name,
                    n = t.langCode || "en",
                    i = this;
                this.get({
                    name: e,
                    callback: function(s) {
                        var a = new s(t.issue);
                        CKEDITOR.plugins.a11ychecker.dev && (a.lang = i._langDictionary[n][e]), t.callback(a)
                    },
                    langCode: n
                })
            }, e.prototype.deferGetCall = function(t, e) {
                var n = CKEDITOR.tools.indexOf;
                return !CKEDITOR.plugins.a11ychecker.dev || this._langDictionary[t] ? !1 : (this._addDeferredGet(t, e), -1 === n(i, t) && (i.push(t), CKEDITOR.scriptLoader.load(this.basePath + "lang/" + t + ".js")), !0)
            }, e.prototype.add = function(e, n) {
                return t.prototype.add.call(this, e, n)
            }, e.prototype.lang = function(t, e) {
                this._langDictionary[t] = e;
                var i = n[t];
                if (i)
                    for (var s = i.length - 1; s >= 0; s--) this.get.apply(this, i[s])
            }, e.prototype._addDeferredGet = function(t, e) {
                n[t] ? n[t].push(e) : n[t] = [e]
            }, e.prototype._getDeferredGetCount = function(t) {
                return n[t] ? n[t].length : 0;
            }, e.prototype._clearDeferredGetQueue = function() {
                n = {}
            }, e
        }(t), n = function() {
            "use strict";

            function t(t) {
                this.controller = t, this._storedSel = null
            }
            return t.prototype = {}, t.prototype.constructor = t, t.prototype.init = function() {
                var t = this.controller,
                    e = t.editor;
                e && e.fire("lockSnapshot", {
                    dontUpdate: !0
                }), t.issues && t.editableDecorator.markIssues(t.issues), CKEDITOR.env.chrome && t.editor && (this._storedSel = t.editor.getSelection().createBookmarks())
            }, t.prototype.close = function() {
                var t = this.controller;
                t.editableDecorator.removeMarkup(), t.viewerController && t.viewerController.viewer.panel.hide(), t.issues && t.issues.resetFocus(), this._storedSel && this.controller.editor.getSelection().selectBookmarks(this._storedSel), this.controller.editor.fire("unlockSnapshot")
            }, t.prototype.unsetStoredSelection = function() {
                var t = this._storedSel;
                t && (this.removeBookmark(t), this._storedSel = null)
            }, t.prototype.removeBookmark = function(t) {
                for (var e = 0; e < t.length; e++) {
                    var n = t[e];
                    n.startNode.remove(), n.endNode && n.endNode.remove()
                }
            }, t
        }(), i = function() {
            "use strict";

            function t(t) {
                this.controller = t
            }
            return t.prototype = {}, t.prototype.constructor = t, t.prototype.init = function() {
                this.controller.viewerController.startListening()
            }, t.prototype.close = function() {
                this.controller.viewerController.stopListening()
            }, t
        }(), s = function() {
            "use strict";

            function t(t) {
                this.controller = t
            }
            return t.prototype = {}, t.prototype.constructor = t, t.prototype.init = function() {
                this.controller.editor.editable().addClass("cke_loading")
            }, t.prototype.close = function() {
                this.controller.editor.editable().removeClass("cke_loading")
            }, t
        }(), a = function() {
            "use strict";

            function t(t) {
                this.editor = t, t && this.addListeners()
            }

            function e(t) {
                return null !== t.data("cke-real-node-type")
            }

            function n(t, e, n) {
                n = String(n);
                var i = new RegExp("(\\s+" + e + '="\\d+")', "g"),
                    s = decodeURIComponent(t.data("cke-realelement")).replace(i, ""),
                    a = s.replace(/^(<\w+\s)/, "$1" + e + '="' + CKEDITOR.tools.htmlEncodeAttr(n) + '" ');
                t.data("cke-realelement", encodeURIComponent(a))
            }

            function i(t, e) {
                var n = new RegExp("(\\s+" + e + '="\\d+")', "g"),
                    i = decodeURIComponent(t.data("cke-realelement")).replace(n, "");
                t.data("cke-realelement", encodeURIComponent(i))
            }
            return t.prototype = {}, t.prototype.constructor = t, t.prototype.testabilityClasses = {
                0: "cke_a11yc_notice",
                .5: "cke_a11yc_warning",
                1: "cke_a11yc_error"
            }, t.ID_ATTRIBUTE_NAME = "quail-id", t.ID_ATTRIBUTE_NAME_FULL = "data-quail-id", t.INITIAL_ID_VALUE = 1, t.prototype.editable = function() {
                return this.editor.editable()
            }, t.prototype.markIssues = function(t) {
                var e, n, i = t.count();
                for (n = 0; i > n; n++) e = t.getItem(n), this.markIssueElement(e, t)
            }, t.prototype.addListeners = function() {
                var e = this.editor,
                    n = e.editable(),
                    i = this,
                    s = CKEDITOR.tools.bind(i.clickListener, i);
                if (!n) throw new Error("Editable not available");
                n.attachListener(n, "click", s), e.on("contentDom", function() {
                    var t = e.editable();
                    t.attachListener(t, "click", s)
                }), e.dataProcessor.htmlFilter.addRules({
                    elements: {
                        $: function(n) {
                            return e._.a11ychecker.disableFilterStrip || delete n.attributes[t.ID_ATTRIBUTE_NAME_FULL], e.config.a11ychecker_noIgnoreData && delete n.attributes["data-a11y-ignore"], n
                        }
                    }
                })
            }, t.prototype.applyMarkup = function() {
                var i = this.editable(),
                    s = !!this.editor.plugins.fakeobjects,
                    a = t.INITIAL_ID_VALUE;
                i.forEach(function(i) {
                    return i.data(t.ID_ATTRIBUTE_NAME, a), s && e(i) && n(i, t.ID_ATTRIBUTE_NAME_FULL, a), a += 1, !0
                }, CKEDITOR.NODE_ELEMENT, !1)
            }, t.prototype.decorateScratchpad = function(e) {
                e.data(t.ID_ATTRIBUTE_NAME, t.INITIAL_ID_VALUE)
            }, t.prototype.removeMarkup = function() {
                var n = this.editable(),
                    s = !!this.editor.plugins.fakeobjects,
                    a = this.unmarkIssueElement;
                n.forEach(function(n) {
                    n.removeAttribute && n.removeAttribute(t.ID_ATTRIBUTE_NAME_FULL), s && e(n) && i(n, t.ID_ATTRIBUTE_NAME_FULL), n.hasClass("cke_a11yc_issue") && a(n)
                }, CKEDITOR.NODE_ELEMENT, !1)
            }, t.prototype.clickListener = function(t) {
                var e = t.data.getTarget(),
                    n = this.editor._.a11ychecker;
                if (!e.hasClass("cke_a11yc_issue")) {
                    var i, s = e.getParents(!0);
                    for (e = null, i = 0; i < s.length; i++)
                        if (s[i].hasClass("cke_a11yc_issue")) {
                            e = s[i];
                            break
                        }
                }
                e && !e.hasClass("cke_a11yc_focused") ? (n.showIssueByElement(e, function() {
                    this.viewer.navigation.parts.next.focus()
                }), n.setMode(1)) : n.enabled && (n.mode.unsetStoredSelection && n.mode.unsetStoredSelection(),
                    n.setMode(2))
            }, t.prototype.resolveEditorElements = function(e) {
                var n, i, s, a, r = this.editable();
                for (s = 0, a = e.count(); a > s; s++) n = e.getItem(s), i = n.originalElement.data(t.ID_ATTRIBUTE_NAME), i === String(t.INITIAL_ID_VALUE) ? n.element = r : n.element = r.findOne("*[" + t.ID_ATTRIBUTE_NAME_FULL + '="' + i + '"]')
            }, t.prototype.markIgnoredIssue = function(t) {
                t.element.addClass("cke_a11yc_ignored")
            }, t.prototype.markIssueElement = function(t, e) {
                var n = t.element,
                    i = t.testability,
                    s = t.isIgnored() && !e.getIssuesByElement(n, !0).length;
                void 0 === i && (i = 1), n.addClass("cke_a11yc_issue"), s ? this.markIgnoredIssue(t) : (n.addClass(this.testabilityClasses[i]), n.removeClass("cke_a11yc_ignored"))
            }, t.prototype.unmarkIssueElement = function(t, e) {
                var n = t.removeClass ? t : t.element;
                e || n.removeClass("cke_a11yc_issue"), n.removeClass("cke_a11yc_error").removeClass("cke_a11yc_warning").removeClass("cke_a11yc_notice").removeClass("cke_a11yc_ignored").removeClass("cke_a11yc_focused")
            }, t
        }(), r = function() {
            "use strict";

            function t() {}
            return t.prototype = {
                preferredIssue: null
            }, t.prototype.constructor = t, t.prototype.set = function(t) {
                this.preferredIssue = t
            }, t.prototype.unset = function(t) {
                this.set(null)
            }, t.prototype.getFromList = function(e) {
                var n = null,
                    i = this.preferredIssue && this.preferredIssue.element,
                    s = !1;
                return 0 === e.count() ? n : i ? (i && t._nodeIsRemoved(i) && (i = t._retreiveElementFromSelection(i.getDocument())), e.each(function(t) {
                    s || (t.element.equals(i) ? (s = !0, n = t) : !n && t.element.getPosition(i) & CKEDITOR.POSITION_FOLLOWING && (n = t))
                }), n || e.getItem(0)) : e.getItem(0)
            }, t._retreiveElementFromSelection = function(t) {
                var e = t.getSelection();
                return e ? e.getCommonAncestor() : null
            }, t.prototype.getFromListIndex = function(t) {
                var e = this.getFromList(t);
                return e ? t.indexOf(e) : null
            }, t._nodeIsRemoved = function(t) {
                var e = t.getParents();
                return !(e[0] && "html" == e[0].getName())
            }, t
        }(), o = function() {
            "use strict";

            function t(t) {
                this.controller = t
            }
            return t.prototype = {
                show: function() {
                    this.getEditorCommand().setState(CKEDITOR.TRISTATE_ON)
                },
                hide: function() {
                    this._selectIssue(), this.getEditorCommand().setState(CKEDITOR.TRISTATE_OFF);
                },
                update: function() {
                    this.controller.issues.on("focusChanged", this.focusChanged, this)
                },
                focusChanged: function(t) {
                    var e = t.data;
                    e.previous && this.unmarkFocus(e.previous.element), e.current && this.markFocus(e.current.element)
                },
                unmarkFocus: function(t) {
                    t.removeClass("cke_a11yc_focused")
                },
                markFocus: function(t) {
                    t.addClass("cke_a11yc_focused")
                },
                getEditorCommand: function() {
                    return this.controller.editor.getCommand("a11ychecker")
                }
            }, t.prototype.constructor = t, t.prototype._selectIssue = function() {
                var t = this.controller,
                    e = t.issues.getFocused();
                e && t._withUndoManager(function() {
                    var n = t.editor,
                        i = t.mode;
                    t.editableDecorator.removeMarkup(), n.getSelection().selectElement(e.element), i.unsetStoredSelection && i.unsetStoredSelection(), n.fire("updateSnapshot"), i.unsetStoredSelection && (i._storedSel = n.getSelection().createBookmarks())
                })
            }, t
        }(), c = function() {
            "use strict";

            function t(t) {
                this.viewer = t, this.templates = {};
                for (var e in this.templateDefinitions) this.templates[e] = new CKEDITOR.template(this.templateDefinitions[e]);
                this.parts = {},
                    this.lang = t.editor.lang.a11ychecker, this.build()
            }
            return t.prototype = {
                templateDefinitions: {
                    wrapper: '<div class="cke_a11yc_ui_desc_wrapper"></div>',
                    title: '<strong class="cke_a11yc_ui_desc_title" aria-live="polite"></strong>',
                    info: '<p class="cke_a11yc_ui_desc_info" aria-live="polite"></p>'
                },
                setTitle: function(t) {
                    this.parts.title.setHtml(t)
                },
                setInfo: function(t) {
                    this.parts.info.setHtml(t)
                },
                build: function() {
                    this.parts = {
                        wrapper: CKEDITOR.dom.element.createFromHtml(this.templates.wrapper.output()),
                        title: CKEDITOR.dom.element.createFromHtml(this.templates.title.output()),
                        info: CKEDITOR.dom.element.createFromHtml(this.templates.info.output())
                    }, this.parts.title.appendTo(this.parts.wrapper), this.parts.info.appendTo(this.parts.wrapper)
                }
            }, CKEDITOR.event.implementOn(t.prototype), t
        }(), u = function() {
            "use strict";

            function t(t, e) {
                this.viewer = t, this.lang = e, this.templates = {};
                for (var n in this.templateDefinitions) this.templates[n] = new CKEDITOR.template(this.templateDefinitions[n]);
                this.templates.counterText = new CKEDITOR.template(this.lang.navigationCounter),
                    this.parts = {}, this.build()
            }

            function e(t, e) {
                return function(n) {
                    var i = n.data.getKeystroke();
                    i == t && (e.call(this), n.data.preventDefault())
                }
            }
            return t.prototype = {
                templateDefinitions: {
                    wrapper: '<div class="cke_a11yc_ui_navigation"></div>',
                    counter: '<div class="cke_a11yc_ui_navigation_counter" aria-live="polite"></div>',
                    buttonWrapper: '<div class="cke_a11yc_ui_button_wrapper"></div>',
                    button: '<a href="javascript:void(0)" hidefocus="true" class="cke_a11yc_ui_button cke_a11yc_ui_{class}" role="button"><span class="cke_a11yc_ui_button">{text}</span></a>'
                },
                update: function(t, e, n) {
                    var i = this.lang.testability,
                        s = i[void 0 !== n ? n : 1];
                    this.parts.counter.setText(this.templates.counterText.output({
                        current: t + 1,
                        total: e,
                        testability: s
                    }));
                    for (var a in i) this.parts.wrapper.removeClass("cke_a11yc_testability_" + i[a]);
                    this.parts.wrapper.addClass("cke_a11yc_testability_" + s)
                },
                build: function() {
                    this.parts = {
                        wrapper: CKEDITOR.dom.element.createFromHtml(this.templates.wrapper.output()),
                        counter: CKEDITOR.dom.element.createFromHtml(this.templates.counter.output()),
                        previous: CKEDITOR.dom.element.createFromHtml(this.templates.button.output({
                            title: this.lang.navigationPrevTitle,
                            "class": "previous",
                            text: this.lang.navigationPrev
                        })),
                        next: CKEDITOR.dom.element.createFromHtml(this.templates.button.output({
                            title: this.lang.navigationNextTitle,
                            "class": "next",
                            text: this.lang.navigationNext
                        }))
                    };
                    var t = CKEDITOR.dom.element.createFromHtml(this.templates.buttonWrapper.output()),
                        n = t.clone();
                    t.append(this.parts.previous), n.append(this.parts.next), this.parts.wrapper.append(this.parts.counter), this.parts.wrapper.append(t), this.parts.wrapper.append(n), this.parts.previous.unselectable(), this.parts.next.unselectable();
                    var i = e(32, function(t) {
                        this.fire("click")
                    });
                    this.parts.previous.on("keydown", i), this.parts.next.on("keydown", i), this.parts.previous.on("click", function() {
                        this.fire("previous")
                    }, this), this.parts.next.on("click", function() {
                        this.fire("next")
                    }, this)
                }
            }, CKEDITOR.event.implementOn(t.prototype), t
        }(), l = function() {
            "use strict";

            function t(t, e) {
                e && (CKEDITOR.tools.extend(this, e, !0),
                    this.name = t, this.id = CKEDITOR.tools.getNextId() + "_input", this.wrapper = CKEDITOR.dom.element.createFromHtml(this.wrapperTemplate.output({
                        label: this.label,
                        id: this.id
                    })))
            }
            return t.prototype = {
                wrapperTemplate: new CKEDITOR.template('<div role="presentation" class="cke_a11yc_ui_input_wrapper"><label class="cke_a11yc_ui_input_label" id="{id}_label" for="{id}">{label}</label></div>'),
                getValue: function() {
                    return this.input.getValue()
                },
                setValue: function(t) {
                    this.input.setValue(t)
                },
                setInitialValue: function() {
                    void 0 !== this.value && this.setValue(this.value)
                },
                remove: function() {
                    this.wrapper.remove()
                }
            }, t
        }(), d = function(t) {
            "use strict";
            var e = {
                Text: function(e, n) {
                    t.apply(this, arguments), this.input = CKEDITOR.dom.element.createFromHtml(this.inputTemplate.output({
                        id: this.id
                    })), this.input.appendTo(this.wrapper), this.setInitialValue()
                },
                Checkbox: function(e, n) {
                    t.apply(this, arguments), this.input = CKEDITOR.dom.element.createFromHtml(this.inputTemplate.output({
                        id: this.id
                    })), this.input.appendTo(this.wrapper), this.setInitialValue();
                },
                Select: function(e, n) {
                    var i, s;
                    t.apply(this, arguments), this.options = {}, this.input = CKEDITOR.dom.element.createFromHtml(this.inputTemplate.output({
                        id: this.id
                    }));
                    for (i in n.options) s = new CKEDITOR.dom.element("option"), s.setText(n.options[i]), s.setAttribute("value", i), s.appendTo(this.input), this.options[i] = s;
                    this.input.appendTo(this.wrapper), this.setInitialValue()
                }
            };
            return e.Text.prototype = CKEDITOR.tools.extend(new t, {
                inputTemplate: new CKEDITOR.template('<input class="cke_a11yc_ui_input cke_a11yc_ui_input_text" type="text" id={id} aria-labelledby="{id}_label" aria-required="true">')
            }), e.Checkbox.prototype = CKEDITOR.tools.extend(new t, {
                inputTemplate: new CKEDITOR.template('<input class="cke_a11yc_ui_input cke_a11yc_ui_input_checkbox" type="checkbox" id={id} aria-labelledby="{id}_label" aria-required="true">'),
                getValue: function() {
                    return this.input.$.checked
                }
            }, !0), e.Select.prototype = CKEDITOR.tools.extend(new t, {
                inputTemplate: new CKEDITOR.template('<select class="cke_a11yc_ui_input_select" id={id} aria-labelledby="{id}_label" aria-required="true"></select>')
            }), e
        }(l), h = function(t) {
            "use strict";

            function e(t) {
                this.viewer = t, this.templates = {};
                for (var e in this.templateDefinitions) this.templates[e] = new CKEDITOR.template(this.templateDefinitions[e]);
                this.inputs = {}, this.parts = {}, this.build()
            }

            function n(t, e) {
                return function(n) {
                    var i = n.data.getKeystroke(),
                        s = CKEDITOR.tools,
                        a = s.isArray(t) ? -1 !== s.indexOf(t, i) : i == t;
                    a && (e.call(this, n), n.data.preventDefault())
                }
            }
            return e.prototype = {
                templateDefinitions: {
                    wrapper: '<div role="presentation" class="cke_a11yc_ui_form"></div>',
                    fieldset: '<div role="presentation" class="cke_a11yc_ui_form_fieldset"></div>',
                    actionset: '<div role="presentation" class="cke_a11yc_ui_form_actionset"></div>',
                    buttonWrapper: '<div class="cke_a11yc_ui_button_wrapper {class}"></div>',
                    button: '<a href="javascript:void(0)" hidefocus="true" class="cke_a11yc_ui_button {class}" role="button"><span class="cke_a11yc_ui_button">{text}</span></a>'
                },
                addInput: function(e, n) {
                    this.inputs[e] = new(t[CKEDITOR.tools.capitalize(n.type)])(e, n), this.inputs[e].wrapper.appendTo(this.parts.fieldset),
                        this.fire("addInput", this.inputs[e])
                },
                removeInput: function(t) {
                    this.inputs[t].remove(), this.fire("removeInput", this.inputs[t]), this.inputs[t] = null
                },
                setInputs: function(t) {
                    this.removeInputs(), this.inputs = {};
                    for (var e in t) this.addInput(e, t[e])
                },
                removeInputs: function() {
                    for (var t in this.inputs) this.removeInput(t)
                },
                serialize: function() {
                    var t = {};
                    for (var e in this.inputs) t[e] = this.inputs[e].getValue();
                    return t
                },
                build: function() {
                    var t = this.viewer.editor.lang.a11ychecker;
                    this.parts = {
                        wrapper: CKEDITOR.dom.element.createFromHtml(this.templates.wrapper.output()),
                        fieldset: CKEDITOR.dom.element.createFromHtml(this.templates.fieldset.output()),
                        actionset: CKEDITOR.dom.element.createFromHtml(this.templates.actionset.output()),
                        quickfixButton: CKEDITOR.dom.element.createFromHtml(this.templates.button.output({
                            title: t.quickFixButtonTitle,
                            text: t.quickFixButton,
                            "class": "cke_a11yc_ui_button_ok"
                        })),
                        ignoreButton: CKEDITOR.dom.element.createFromHtml(this.templates.button.output({
                            title: t.ignoreBtnTitle,
                            text: t.ignoreBtn,
                            "class": "cke_a11yc_ui_button_ignore"
                        }))
                    }, this.parts.fieldset.appendTo(this.parts.wrapper), this.parts.actionset.appendTo(this.parts.wrapper);
                    var e = CKEDITOR.dom.element.createFromHtml(this.templates.buttonWrapper.output({
                            "class": "cke_a11yc_ui_button_ok_wrapper"
                        })),
                        i = CKEDITOR.dom.element.createFromHtml(this.templates.buttonWrapper.output({
                            "class": "cke_a11yc_ui_button_ignore_wrapper"
                        }));
                    this.parts.quickfixButton.appendTo(e), this.parts.ignoreButton.appendTo(i), e.appendTo(this.parts.actionset), i.appendTo(this.parts.actionset), this.parts.quickfixButton.on("click", function(t) {
                        this.fire("submit"), t.data.preventDefault()
                    }, this), this.parts.fieldset.on("keydown", n(13, function(t) {
                        this.fire("submit")
                    }), this), this.parts.quickfixButton.on("keydown", n(32, function(t) {
                        this.fire("submit")
                    }), this), this.parts.ignoreButton.on("click", function(t) {
                        this.fire("ignore"), t.data.preventDefault()
                    }, this), this.parts.ignoreButton.on("keydown", function(t) {
                        32 == t.data.getKeystroke() && (t.data.preventDefault(), this.fire("ignore"));
                    }, this)
                },
                show: function() {
                    this.parts.fieldset.show(), this.parts.quickfixButton.show()
                },
                hide: function() {
                    this.parts.fieldset.hide(), this.parts.quickfixButton.hide()
                },
                setIgnored: function(t) {
                    var e = this.parts.ignoreButton;
                    e.getFirst().setHtml(this.viewer.editor.lang.a11ychecker[t ? "stopIgnoreBtn" : "ignoreBtn"]), e.setAttribute("aria-pressed", t)
                }
            }, CKEDITOR.event.implementOn(e.prototype), e
        }(d), p = function() {
            "use strict";

            function t(t) {
                this.viewer = t, this.templates = {};
                for (var e in this.templateDefinitions) this.templates[e] = new CKEDITOR.template(this.templateDefinitions[e]);
                this.parts = {}, this.build()
            }
            return t.prototype = {
                templateDefinitions: {
                    wrapper: '<div class="cke_a11yc_ui_listening"></div>',
                    info: "<p>{text}</p>",
                    button: '<a href="javascript:void(0)" title="{title}" hidefocus="true" class="cke_a11yc_ui_button" role="button"><span class="cke_a11yc_ui_button">{text}</span></a>'
                },
                build: function() {
                    var t = this.viewer.editor.lang.a11ychecker;
                    this.parts = {
                        wrapper: CKEDITOR.dom.element.createFromHtml(this.templates.wrapper.output()),
                        info: CKEDITOR.dom.element.createFromHtml(this.templates.info.output({
                            text: t.listeningInfo
                        })),
                        button: CKEDITOR.dom.element.createFromHtml(this.templates.button.output({
                            title: t.listeningCheckAgain,
                            text: t.listeningCheckAgain
                        }))
                    }, this.parts.wrapper.append(this.parts.info), this.parts.wrapper.append(this.parts.button), this.parts.button.on("click", function() {
                        this.fire("check")
                    }, this)
                }
            }, CKEDITOR.event.implementOn(t.prototype), t
        }(), f = function() {
            "use strict";

            function t() {
                this.list = []
            }
            return t.prototype = {}, t.prototype.constructor = t, t.prototype.count = function() {
                return this.list.length
            }, t.prototype.addItem = function(t) {
                t.on("keydown", this.keyDownListener, this), this.list.push(t), this.sort()
            }, t.prototype.removeItem = function(t) {
                "number" != typeof t && (t = CKEDITOR.tools.indexOf(this.list, t)), this.list[t].removeListener("keydown", this.keyDownListener), this.list.splice(t, 1)
            }, t.prototype.getItem = function(t) {
                return this.list[t]
            }, t.prototype.keyDownListener = function(t) {
                var e = CKEDITOR.tools.indexOf(this.list, t.sender),
                    n = t.data.getKey(),
                    i = t.data.getKeystroke();
                if (-1 !== e && 1 !== this.list.length && 9 == n) {
                    var s = i & CKEDITOR.SHIFT,
                        a = s ? this.getPrev(e) : this.getNext(e);
                    a && (a.focus(), t.data.preventDefault(1), t.data.stopPropagation())
                }
            }, t.prototype.getNext = function(t) {
                var e, n = 0,
                    i = this.list.length;
                "number" == typeof t && i > t + 1 && (n = t + 1), e = this.getItem(n);
                var s, a;
                for (s = 1; i - 1 > s && !e.isVisible(); s++) a = n + s, a >= i && (a -= i), e = this.getItem(a);
                return s != i - 1 || e.isVisible() ? e : void 0
            }, t.prototype.getPrev = function(t) {
                var e, n = this.list.length,
                    i = n - 1;
                "number" == typeof t && t > 0 && (i = t - 1), e = this.getItem(i);
                var s, a;
                for (s = 1; n - 1 > s && !e.isVisible(); s++) a = i - s, 0 > a && (a = n + a), e = this.getItem(a);
                return s != n - 1 || e.isVisible() ? e : void 0
            }, t.prototype.sort = function() {
                this.list.sort(this._sort)
            }, t.prototype._sort = function(t, e) {
                var n = 0;
                return n = t.getPosition(e) & CKEDITOR.POSITION_FOLLOWING ? 1 : -1
            }, t
        }(), g = function() {
            "use strict";

            function t(t, e) {
                this.viewer = t, CKEDITOR.tools.extend(this, e), this.panelShowListeners = this.panelShowListeners(t), this.activePanelShowlisteners = []
            }
            return t.prototype = {
                enterMode: function() {
                    this.init && this.init(this.viewer), this.addPanelShowListeners()
                },
                leaveMode: function() {
                    this.close && this.close(this.viewer), this.removePanelShowListeners()
                },
                addPanelShowListener: function(t) {
                    this.activePanelShowlisteners.push(t)
                },
                addPanelShowListeners: function(t) {
                    if (this.panelShowListeners)
                        for (var e = 0; e < this.panelShowListeners.length; e++) this.addPanelShowListener(this.viewer.panel.addShowListener(this.panelShowListeners[e]))
                },
                removePanelShowListeners: function() {
                    for (var t; t = this.activePanelShowlisteners.pop();) t.removeListener()
                }
            }, t
        }(), m = function(t, e, n, i, s, a) {
            "use strict";

            function r(t, e) {
                this.editor = t, this.panel = new CKEDITOR.ui.balloonPanel(t, e), this.focusManager = new s, this.modes = {}, this.mode = null, this.lang = t.lang.a11ychecker;
                var n = this;
                this.panel.registerFocusable = function(t) {
                    n.focusManager.addItem(t), n.editor.focusManager.add(t)
                }, this.panel.deregisterFocusable = function(t) {
                    n.focusManager.removeItem(t), n.editor.focusManager.remove(t)
                }, this.panel.addShowListener(function() {
                    return this.parts.close.on("click", function(t) {
                        this.blur(), this.hide(), t.data.preventDefault()
                    }, this)
                }), this.panel.addShowListener(function() {
                    return this.parts.panel.on("keydown", function(t) {
                        var e = t.data.getKeystroke();
                        27 == e && (this.blur(), this.hide(), t.data.preventDefault())
                    }, this)
                }), this.setupNavigation(), this.setupDescription(), this.setupForm(), this.setupListeningIndicator(), this.panel.registerFocusable(this.panel.parts.close), this.setupModes(), this.setMode("checking"), this._fixAria()
            }
            return r.SCROLL_THROTTLING_RATE = 50, r.prototype = {
                modesDefinition: {
                    listening: {
                        attachToViewport: function(t) {
                            t.panel.parts.panel.setStyles({
                                right: "10px",
                                bottom: "10px"
                            })
                        },
                        attachToEditable: function(t) {
                            var e = t.editor.ui.space("contents"),
                                n = e.getClientRect(),
                                i = t.editor.document.getDocumentElement().getClientRect(),
                                s = CKEDITOR.document.getWindow(),
                                a = s.getViewPaneSize();
                            t.panel.parts.panel.setStyles({
                                right: n.width - i.width + 10 + "px",
                                bottom: a.height - n.bottom + 10 + "px"
                            })
                        },
                        init: function(t) {
                            var e = this;
                            t.panel.parts.panel.addClass("cke_a11yc_mode_listening"), t.panel.resize(250, "auto"),
                                CKEDITOR.tools.setTimeout(function() {
                                    var n = t.panel.parts.panel.getClientRect(),
                                        i = CKEDITOR.document.getWindow(),
                                        s = i.getViewPaneSize();
                                    t.panel.parts.panel.setStyles({
                                        position: "fixed",
                                        top: null,
                                        left: null,
                                        right: s.width - n.right + "px",
                                        bottom: s.height - n.bottom + "px"
                                    }), CKEDITOR.tools.setTimeout(function() {
                                        var n = t.editor.getCommand("maximize");
                                        e[n && 1 === n.state ? "attachToEditable" : "attachToViewport"](t)
                                    }, 0)
                                }, 0, this)
                        },
                        close: function(t) {
                            t.panel.parts.panel.removeClass("cke_a11yc_mode_listening"), t.panel.resize(t.panel.width, t.panel.height), t.panel.parts.panel.setStyles({
                                position: "absolute",
                                right: null,
                                bottom: null
                            })
                        },
                        panelShowListeners: function(t) {
                            var e = this;
                            return [function() {
                                return this.editor.on("maximize", function(n) {
                                    e[1 === n.data ? "attachToEditable" : "attachToViewport"](t)
                                })
                            }]
                        }
                    },
                    checking: {
                        panelShowListeners: function(t) {
                            return [function() {
                                var e = t.editor,
                                    n = CKEDITOR.tools.eventsBuffer(r.SCROLL_THROTTLING_RATE, function() {
                                        var n = e._.a11ychecker.issues.getFocused();
                                        n && t.panel.attach(n.element, !1)
                                    });
                                return this.editor.window.on("scroll", n.input);
                            }, function() {
                                return this.editor.on("resize", function() {
                                    this.blur(), this.hide()
                                }, this)
                            }]
                        }
                    }
                },
                setupNavigation: function() {
                    this.navigation = new e(this, this.editor.lang.a11ychecker), this.panel.registerFocusable(this.navigation.parts.previous), this.panel.registerFocusable(this.navigation.parts.next), this.panel.parts.content.append(this.navigation.parts.wrapper)
                },
                setupDescription: function() {
                    this.description = new t(this), this.panel.parts.content.append(this.description.parts.wrapper)
                },
                setupForm: function() {
                    this.form = new n(this, this.editor.lang.a11ychecker), this.form.on("addInput", function(t) {
                        this.panel.registerFocusable(t.data.input)
                    }, this), this.form.on("removeInput", function(t) {
                        this.panel.deregisterFocusable(t.data.input)
                    }, this), this.panel.registerFocusable(this.form.parts.ignoreButton), this.panel.registerFocusable(this.form.parts.quickfixButton), this.panel.parts.content.append(this.form.parts.wrapper)
                },
                setupListeningIndicator: function() {
                    this.listeningIndicator = new i(this), this.panel.registerFocusable(this.listeningIndicator.parts.button),
                        this.panel.parts.content.append(this.listeningIndicator.parts.wrapper)
                },
                setupModes: function() {
                    for (var t in this.modesDefinition) this.modes[t] = new a(this, this.modesDefinition[t])
                },
                setMode: function(t) {
                    this.mode && this.modes[this.mode].leaveMode(), this.modes[t].enterMode(), this.mode = t
                },
                _fixAria: function() {
                    var t = this,
                        e = t.panel.parts.panel,
                        n = CKEDITOR.tools.getNextId(),
                        i = CKEDITOR.tools.getNextId(),
                        s = CKEDITOR.tools.getNextId();
                    t.panel.parts.title.setAttribute("id", n), t.navigation.parts.counter.setAttribute("id", i), t.description.parts.wrapper.setAttribute("id", s), e.setAttribute("aria-labelledby", n + " " + i), e.setAttribute("aria-describedby", s)
                }
            }, r
        }(c, u, h, p, f, g), v = function(t) {
            "use strict";

            function e(e, n) {
                var i = e.editor;
                this.editor = i;
                var s = this.viewer = new t(i, n);
                this.a11ychecker = e, s.panel.on("attach", function() {
                    if (CKEDITOR.env.chrome) {
                        var t = s.panel.parts.panel,
                            n = new CKEDITOR.dom.range(t.getDocument()),
                            i = t.findOne(".cke_balloon_title");
                        n.setStart(i, 0), n.setEnd(i, 0), t.getDocument().getSelection().selectRanges([n]);
                    }
                    this.update(e.issues.getFocused())
                }, this), s.panel.parts.close.on("click", function(t) {
                    this.a11ychecker.close()
                }, this), s.navigation.on("previous", function(t) {
                    e.prev()
                }), s.navigation.on("next", function(t) {
                    e.next()
                }), s.form.on("submit", this.quickFixAccepted, null, null, 8), s.form.on("ignore", e.ignoreIssue, e), s.form.on("ignore", function() {
                    this.updateForm(e.issues.getFocused())
                }, this), this.on("next", function(t) {
                    s.navigation.parts.next.focus()
                }, null, null, 20), this.on("prev", function(t) {
                    s.navigation.parts.previous.focus()
                }, null, null, 20), s.listeningIndicator.on("check", function() {
                    e.check({
                        ui: !0
                    }), e.editor.focus()
                }, this)
            }
            return e.prototype = {
                update: function(t) {
                    var e = this.a11ychecker.issues;
                    this.viewer.navigation.update(e.indexOf(t), e.count(), t.testability), this.updateDescription(t), this.updateForm(t)
                },
                updateDescription: function(t) {
                    var e = this.viewer.description;
                    t.getDetails(function(t) {
                        e.setTitle(t.title), e.setInfo(t.descr)
                    })
                },
                updateForm: function(t) {
                    var e = this,
                        n = e.viewer.form,
                        i = e.a11ychecker.getQuickFixLang();
                    n.setIgnored(t.isIgnored()), n.setInputs({}), n.hide(), t.engine.getFixes(t, function(t) {
                        var i = t.length;
                        i && (e.quickFixSelected = t[0]);
                        for (var s = 0; i > s; s++) t[s].display(n, e.editor);
                        i && n.show()
                    }, i)
                },
                quickFixAccepted: function(t) {
                    var e, n = this.viewer.editor,
                        i = n._.a11ychecker,
                        s = i.viewerController,
                        a = this.serialize(),
                        r = s.quickFixSelected;
                    if (r)
                        if (e = r.validate(a), e.length) {
                            alert(e.join(","));
                            var o = CKEDITOR.tools.objectKeys(this.inputs);
                            o.length && this.inputs[o[0]].input.focus(), t.cancel()
                        } else i.applyQuickFix(r, a);
                    else console.erorr("No quickfix available!"), t.cancel()
                },
                showIssue: function(t, e) {
                    t.element.scrollIntoView(), this.viewer.panel.attach(t.element), e && (e.event && this.fire(e.event), e.callback && e.callback.call(this))
                },
                startListening: function() {
                    this.viewer.setMode("listening"), this.viewer.panel.show(), this.editor.focus()
                },
                stopListening: function() {
                    this.viewer.panel.hide(), this.viewer.setMode("checking")
                }
            }, CKEDITOR.event.implementOn(e.prototype), e
        }(m), b = function() {
            "use strict";

            function t(e) {
                if (this.controller = e,
                    e) {
                    var n = t.parseConfig(e.editor.config.a11ychecker_keystrokes);
                    this.setEditorHotkeys(e.editor, n), this.setBalloonHotkeys(e.viewerController, n)
                }
            }
            return t.prototype = {}, t.prototype.constructor = t, t.prototype.setEditorHotkeys = function(t, e) {
                for (var n in e) t.setKeystroke(Number(n), e[n])
            }, t.prototype.setBalloonHotkeys = function(t, e) {
                var n = this,
                    i = n.controller.editor,
                    s = t.viewer.panel,
                    a = s.parts.panel;
                s.addShowListener(function() {
                    return a.on("keydown", n.getBalloonKeydown(i, e))
                })
            }, t.prototype.getBalloonKeydown = function(t, e) {
                return function(n) {
                    var i = e[n.data.getKeystroke()];
                    i && (t.execCommand(i), n.data.preventDefault())
                }
            }, t.parseConfig = function(t) {
                var e, n, i = {},
                    s = t || {},
                    a = {
                        open: CKEDITOR.CTRL + CKEDITOR.ALT + 69,
                        next: CKEDITOR.CTRL + 69,
                        prev: CKEDITOR.CTRL + CKEDITOR.SHIFT + 69,
                        listen: CKEDITOR.SHIFT + 27,
                        close: 27
                    };
                for (n in a) void 0 === s[n] && (s[n] = a[n]), e = "open" == n ? "" : "." + n, i[s[n]] = "a11ychecker" + e;
                return i
            }, t
        }(), y = function() {
            "use strict";

            function t() {}
            return t.getPreferredLanguage = function(t, e, n, i) {
                i = i || window.navigator;
                var s = [t, e, "en"],
                    a = /([a-z]+)(?:-([a-z]+))?/,
                    r = i.language || i.userLanguage,
                    o = CKEDITOR.tools.indexOf;
                r && s.splice(1, 0, r);
                for (var c = 0, u = s.length; u > c; c++)
                    if (s[c]) {
                        var l = s[c].toLowerCase(),
                            d = l.match(a),
                            h = d[1],
                            p = d[2];
                        if (p && -1 !== o(n, l)) return l;
                        if (-1 !== o(n, h)) return h
                    }
                return null
            }, t
        }(), x = function(t, e, n, i, s, a, r, o, c) {
            "use strict";

            function u(t) {
                this._ = {}, this.editor = t, this.editableDecorator = new i(this.editor), this.ui = new a(this), this.preferredIssueFinder = new s, t && (this.viewerController = new r(this, {
                    title: t.lang.a11ychecker.balloonLabel
                }), this.attachEditorListeners(t), this.hotkeyManager = new o(this))
            }
            return u.modes = {
                CHECKING: 1,
                LISTENING: 2,
                BUSY: 3
            }, u.prototype = {
                issues: null,
                viewerController: null,
                enabled: !1,
                disableFilterStrip: !1
            }, u.prototype.constructor = u, u.prototype.setEngine = function(t) {
                this.engine = t
            }, u.prototype.exec = function(t) {
                return this.enabled ? void this.close() : (this.issues && this.issues.clear(), this.enable(), void this.check({
                    ui: !0,
                    callback: t
                }))
            }, u.prototype.listen = function() {
                if (this.enabled) {
                    var t = u.modes;
                    if (this.modeType === t.LISTENING) this.check();
                    else {
                        var e = this.issues.getFocused() && this.issues.getFocused().element;
                        this.setMode(t.LISTENING), e && this.editor.getSelection().selectElement(e)
                    }
                }
            }, u.prototype.check = function(t) {
                t = t || {};
                var e, n = this,
                    i = n.editor;
                this.setMode(u.modes.BUSY), t.ui && this.ui.show(), e = this.getTempOutput(), this.editableDecorator.applyMarkup(), this.editableDecorator.decorateScratchpad(e), this.disableFilterStrip = !0, e.setHtml(i.getData()), this.disableFilterStrip = !1, CKEDITOR.document.getBody().append(e);
                var s = function(e) {
                    n._engineProcessed.call(n, e, t)
                };
                this.engine.process(this, e, s)
            }, u.prototype.disable = function() {
                this.enabled && (this.enabled = !1, this.fire("disabled"))
            }, u.prototype.enable = function() {
                this.enabled || (this.enabled = !0, this.fire("enabled"), this.setMode(u.modes.CHECKING))
            }, u.prototype.next = function(t) {
                var e, n = this.issues;
                0 !== n.count() && (e = this.issues.next(), this.viewerController.showIssue(e, {
                    event: "next",
                    callback: t
                }))
            }, u.prototype.prev = function(t) {
                var e, n = this.issues;
                0 !== n.count() && (e = this.issues.prev(), this.viewerController.showIssue(e, {
                    event: "prev",
                    callback: t
                }))
            }, u.prototype.showIssue = function(t, e) {
                var n, i, s = this.issues,
                    a = t,
                    r = function() {
                        this.viewer.navigation.parts.next.focus(), e && e.call(this)
                    };
                return "number" != typeof a && (a = s.indexOf(a)), n = s.getItem(a), n && n == s.getFocused() ? (r.call(this.viewerController), !0) : (i = s.moveTo(a), i && this.viewerController && this.viewerController.showIssue(s.getItem(a), {
                    callback: r
                }), i)
            }, u.prototype.showIssueByElement = function(t, e) {
                var n = this.issues.getIssueByElement(t);
                return n ? this.showIssue(n, e) : !1
            }, u.prototype.ignoreIssue = function() {
                var t = this.issues.getFocused();
                t && (t.setIgnored(!t.isIgnored()), this.editableDecorator.markIssueElement(t, this.issues))
            }, u.prototype.close = function() {
                this.enabled && (this.ui.hide(), this.disable(), this.issues.clear(), this.preferredIssueFinder.unset(), this.mode.close(), this.mode = null, this.modeType = null)
            }, u.prototype.setMode = function(i) {
                var s, a = {};
                if (a[u.modes.CHECKING] = t, a[u.modes.LISTENING] = e, a[u.modes.BUSY] = n, s = a[i], !s) throw new Error("Invalid mode value, use Controller.modes members");
                i !== this.modeType && (this.mode && this.mode.close(),
                    this.mode = new s(this), this.mode.init(), this.modeType = i)
            }, u.prototype.attachEditorListeners = function(t) {
                var e = this,
                    n = ["a11ychecker", "a11ychecker.listen", "a11ychecker.next", "a11ychecker.prev", "a11ychecker.close", "wysiwyg", "source"];
                t.on("beforeSetMode", function() {
                    e.close()
                }), t.on("beforeCommandExec", function(t) {
                    var i = String(t.data.name); - 1 === CKEDITOR.tools.indexOf(n, i) && e.enabled && e.setMode(u.modes.LISTENING)
                }, null, null, 9999)
            }, u.prototype.applyQuickFix = function(t, e) {
                this._withUndoManager(function() {
                    var e = this.mode,
                        n = this.editor;
                    this.editableDecorator.removeMarkup(), t.markSelection(n, n.getSelection()), e.unsetStoredSelection && e.unsetStoredSelection(), this.editor.fire("updateSnapshot")
                }), t.fix(e, CKEDITOR.tools.bind(this._onQuickFix, this))
            }, u.prototype._onQuickFix = function(t) {
                this._withUndoManager(function() {
                    this.editor.fire("saveSnapshot")
                });
                var e = {
                        quickFix: t,
                        issue: t.issue
                    },
                    n = this.fire("fixed", e, this.editor);
                n !== !1 && this.check({
                    ui: !0
                })
            }, u.prototype._setIssueList = function(t) {
                var e = this;
                t.sort(),
                    t.on("focusChanged", function(t) {
                        var n = t.data.current;
                        n && e.preferredIssueFinder.set(n)
                    }), e.issues = t
            }, u.prototype.onNoIssues = function() {
                alert(this.editor.lang.a11ychecker.noIssuesMessage), this.close()
            }, u.prototype.getTempOutput = function() {
                var t = this._;
                return t.scratchpad || (t.scratchpad = CKEDITOR.document.createElement("div"), t.scratchpad.setStyle("display", "none")), t.scratchpad
            }, u.prototype.getQuickFixLang = function() {
                var t = this.editor,
                    e = t.config,
                    n = t.plugins.a11ychecker.quickFixesLang.split(",");
                return c.getPreferredLanguage(e.language, e.defaultLanguage, n) || n[0]
            }, u.prototype._engineProcessed = function(t, e) {
                var n, i, s = this;
                s.editableDecorator.resolveEditorElements(t), s._setIssueList(t), s.setMode(u.modes.CHECKING), e.ui && s.ui.update(), n = s.fire("checked", {
                    issues: t
                }), e.callback && e.callback.call(s, t.count(!0) === !0, t), n !== !1 && (t.count() ? (i = s.preferredIssueFinder.getFromListIndex(t) || 0, i >= t.count() && (i = 0), s.showIssue(t.getItem(i))) : s.onNoIssues())
            }, u.prototype._withUndoManager = function(t) {
                var e = this.editor,
                    n = !!e.undoManager.locked;
                n && e.fire("unlockSnapshot"), t.call(this), n && e.fire("lockSnapshot", {
                    dontUpdate: !0
                })
            }, CKEDITOR.event.implementOn(u.prototype), u
        }(n, i, s, a, r, o, v, b, y), E = function() {
            "use strict";

            function t() {}
            return t.prototype = {
                guideline: ["aAdjacentWithSameResourceShouldBeCombined", "aImgAltNotRepetitive", "aLinksAreSeparatedByPrintableCharacters", "aMustNotHaveJavascriptHref", "aSuspiciousLinkText", "blockquoteNotUsedForIndentation", "documentVisualListsAreMarkedUp", "headerH1", "headerH2", "headerH3", "headerH4", "imgAltIsDifferent", "imgAltIsTooLong", "imgAltNotEmptyInAnchor", "imgAltTextNotRedundant", "imgHasAlt", "imgShouldNotHaveTitle", "pNotUsedAsHeader", "tableDataShouldHaveTh", "imgWithEmptyAlt"]
            }, t
        }(),
        function() {
            "use strict";

            function t(t) {
                return o(t) ? r(t, "a11ychecker.next", "next") : void 0
            }

            function n(t) {
                return o(t) ? r(t, "a11ychecker.prev", "prev") : void 0
            }

            function i(t) {
                return r(t, "a11ychecker", "exec")
            }

            function s(t) {
                return t._.a11ychecker.listen()
            }

            function a(t) {
                return t._.a11ychecker.close()
            }

            function r(t, e, n) {
                return t._.a11ychecker[n](function() {
                    t.fire("afterCommandExec", {
                        name: e,
                        command: t.getCommand(e),
                        commandData: {}
                    })
                })
            }

            function o(t) {
                var e = t._.a11ychecker;
                return e && e.modeType === e.constructor.modes.CHECKING
            }

            function c(t) {
                var e = this.config,
                    n = e.contentsCss;
                CKEDITOR.tools.isArray(n) || (e.contentsCss = n ? [n] : []), e.contentsCss.push(t)
            }
            var u = "a11ychecker";
            CKEDITOR.plugins.add(u, {
                requires: "balloonpanel",
                lang: "en,nl,de",
                quickFixesLang: "en,nl,de",
                icons: u,
                hidpi: !0,
                onLoad: function() {
                    var t = this.path;
                    CKEDITOR.document.appendStyleSheet(t + "skins/moono/a11ychecker.css"),
                        function(e, n, i, s, a) {
                            CKEDITOR.tools.extend(CKEDITOR.plugins.a11ychecker, {
                                Engine: e,
                                Issue: n,
                                IssueList: i,
                                IssueDetails: s
                            }), CKEDITOR.plugins.a11ychecker.quickFixes = new a(t + "quickfix/")
                        }(C, T, k, I, e)
                },
                beforeInit: function(t) {
                    var e = this;
                    t.config.a11ychecker_noIgnoreData || t.filter.allow("*[data-a11y-ignore]", "a11ychecker"), this.createTemporaryNamespace(t), t.once("instanceReady", function() {
                        ! function(n) {
                            var i = new n(t),
                                s = t._.a11ychecker;
                            t._.a11ychecker = i, s.getEngineType(function(n) {
                                i.setEngine(new n(e)),
                                    i.engine.config = i.engine.createConfig(t), s.fire("loaded", null, t)
                            })
                        }(x)
                    }), e.commandRegister.call(e, t), e.guiRegister(t)
                },
                guiRegister: function(t) {
                    var e = this.path + "styles/contents.css",
                        n = t.addContentsCss || c;
                    t.ui.addButton && t.ui.addButton("A11ychecker", {
                        label: t.lang.a11ychecker.toolbar,
                        command: u,
                        toolbar: "document,10"
                    }), n.call(t, e)
                },
                commandRegister: function(e) {
                    e.addCommand(u, {
                        exec: i,
                        async: !0,
                        canUndo: !1,
                        editorFocus: !1
                    }), e.addCommand(u + ".listen", {
                        exec: s,
                        canUndo: !1,
                        editorFocus: !1
                    }), e.addCommand(u + ".next", {
                        exec: t,
                        async: !0,
                        canUndo: !1,
                        editorFocus: !1
                    }), e.addCommand(u + ".prev", {
                        exec: n,
                        async: !0,
                        canUndo: !1,
                        editorFocus: !1
                    }), e.addCommand(u + ".close", {
                        exec: a
                    })
                },
                createTemporaryNamespace: function(t) {
                    t._.a11ychecker = {
                        getEngineType: function(t) {
                            function e(t) {
                                this.jsonPath = (t ? t.path : "") + "libs/quail/"
                            }
                            var n, i, s = CKEDITOR.plugins.a11ychecker,
                                a = s.Engine,
                                r = s.IssueList,
                                o = s.Issue,
                                c = s.IssueDetails,
                                u = window.jQuery || window.$;
                            ! function(t) {
                                i = t
                            }(E),
                            function() {
                                u.fn.quail || ! function(t) {
                                    Function.prototype.bind = Function.prototype.bind || function(t) {
                                        if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                                        var e = Array.prototype.slice,
                                            n = e.call(arguments, 1),
                                            i = this,
                                            s = function() {},
                                            a = function() {
                                                return i.apply(this instanceof s ? this : t || window, n.concat(e.call(arguments)))
                                            };
                                        return s.prototype = this.prototype, a.prototype = new s, a
                                    };
                                    var e = {
                                        options: {},
                                        components: {},
                                        lib: {},
                                        testabilityTranslation: {
                                            0: "suggestion",
                                            .5: "moderate",
                                            1: "severe"
                                        },
                                        html: null,
                                        strings: {},
                                        accessibilityResults: {},
                                        accessibilityTests: null,
                                        guidelines: {
                                            wcag: {
                                                setup: function(t, e, n) {
                                                    n = n || {};
                                                    for (var i in this.successCriteria)
                                                        if (this.successCriteria.hasOwnProperty(i)) {
                                                            var s = this.successCriteria[i];
                                                            s.registerTests(t), e && e.listenTo && "function" == typeof e.listenTo && n.successCriteriaEvaluated && e.listenTo(s, "successCriteriaEvaluated", n.successCriteriaEvaluated)
                                                        }
                                                },
                                                successCriteria: {}
                                            }
                                        },
                                        tests: {},
                                        textSelector: ":not(:empty)",
                                        suspectPHeaderTags: ["strong", "b", "em", "i", "u", "font"],
                                        suspectPCSSStyles: ["color", "font-weight", "font-size", "font-family"],
                                        focusElements: "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
                                        emoticonRegex: /((?::|;|B|P|=)(?:-)?(?:\)|\(|o|O|D|P))/g,
                                        selfClosingTags: ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"],
                                        optionalClosingTags: ["p", "li", "th", "tr", "td"],
                                        run: function(n) {
                                            function i(t, e, n) {
                                                if (n.guideline && n.guideline.length) {
                                                    t.tests = t.lib.TestCollection([], {
                                                        scope: t.html || null
                                                    });
                                                    for (var i = 0, s = n.guideline.length; s > i; ++i) {
                                                        var a = n.guideline[i];
                                                        e[a] && (e[a].scope = t.html || null, t.tests.set(a, e[a]))
                                                    }
                                                } else t.tests = t.lib.TestCollection(e, {
                                                    scope: t.html || null
                                                })
                                            }

                                            function s() {
                                                if ("undefined" != typeof n.customTests)
                                                    for (var t in n.customTests) n.customTests.hasOwnProperty(t) && (n.customTests[t].scope = e.html || null, e.tests.set(t, n.customTests[t]));
                                                var i = function() {};
                                                for (var s in e.guidelines) e.guidelines[s] && "function" == typeof e.guidelines[s].setup && e.guidelines[s].setup(e.tests, this, {
                                                    successCriteriaEvaluated: n.successCriteriaEvaluated || i
                                                });
                                                e.tests.run({
                                                    preFilter: n.preFilter || function() {},
                                                    caseResolve: n.caseResolve || function() {},
                                                    testComplete: n.testComplete || function() {},
                                                    testCollectionComplete: n.testCollectionComplete || function() {},
                                                    complete: n.complete || function() {}
                                                })
                                            }
                                            if (n.reset && (e.accessibilityResults = {}), e.tests = e.lib.TestCollection([], {
                                                    scope: e.html || null
                                                }), "undefined" != typeof quailBuilderTests) e.tests = e.lib.TestCollection(quailBuilderTests, {
                                                scope: e.html || null
                                            }), s.call(e);
                                            else if ("wcag2" === n.guideline) e.lib.wcag2.run(n);
                                            else if (n.accessibilityTests) i(e, n.accessibilityTests, n), s.call(e);
                                            else {
                                                var a = n.jsonPath;
                                                "string" == typeof n.guideline && (a += "/guidelines/" + n.guideline), t.ajax({
                                                    url: a + "/tests.json",
                                                    dataType: "json",
                                                    success: function(t) {
                                                        "object" == typeof t && (i(e, t, n), s.call(e))
                                                    },
                                                    error: function(jqXHR,textStatus,errorThrown) {
                                                        console.log(textStatus);
                                                        throw new Error("Tests could not be loaded")
                                                    }
                                                })
                                            }
                                        },
                                        listenTo: function(t, e, n) {
                                            n = n.bind(this), t.registerListener.call(t, e, n)
                                        },
                                        getConfiguration: function(t) {
                                            var e = this.tests.find(t),
                                                n = e && e.get("guidelines"),
                                                i = n && this.options.guidelineName && n[this.options.guidelineName],
                                                s = i && i.configuration;
                                            return s ? s : !1
                                        },
                                        isUnreadable: function(t) {
                                            return "string" != typeof t ? !0 : t.trim().length ? !1 : !0
                                        },
                                        isDataTable: function(e) {
                                            if (e.find("tr").length < 3) return !1;
                                            if (e.find("th[scope]").length) return !0;
                                            var n = e.find("tr:has(td)").length,
                                                i = e.find("td[rowspan], td[colspan]"),
                                                s = !0;
                                            if (i.length) {
                                                var a = {};
                                                i.each(function() {
                                                    "undefined" == typeof a[t(this).index()] && (a[t(this).index()] = 0), a[t(this).index()]++
                                                }), t.each(a, function(t, e) {
                                                    n > e && (s = !1)
                                                })
                                            }
                                            var r = e.find("table");
                                            if (r.length) {
                                                var o = {};
                                                r.each(function() {
                                                    var e = t(this).parent("td").index();
                                                    e !== !1 && "undefined" == typeof o[e] && (o[e] = 0), o[e]++
                                                }), t.each(o, function(t, e) {
                                                    n > e && (s = !1)
                                                })
                                            }
                                            return s
                                        },
                                        getTextContents: function(t) {
                                            if (t.is("p, pre, blockquote, ol, ul, li, dl, dt, dd, figure, figcaption")) return t.text();
                                            for (var e = "", n = t[0].childNodes, i = 0, s = n.length; s > i; i += 1) 3 === n[i].nodeType && (e += n[i].nodeValue);
                                            return e
                                        },
                                        validURL: function(t) {
                                            return -1 === t.search(" ")
                                        },
                                        cleanString: function(t) {
                                            return t.toLowerCase().replace(/^\s\s*/, "")
                                        },
                                        containsReadableText: function(n, i) {
                                            if (n = n.clone(),
                                                n.find("option").remove(), !e.isUnreadable(n.text())) return !0;
                                            if (!e.isUnreadable(n.attr("alt"))) return !0;
                                            if (i) {
                                                var s = !1;
                                                if (n.find("*").each(function() {
                                                        e.containsReadableText(t(this), !0) && (s = !0)
                                                    }), s) return !0
                                            }
                                            return !1
                                        }
                                    };
                                    if (window && (window.quail = e), t.fn.quail = function(t) {
                                            return this.length ? (e.options = t, e.html = this, e.run(t), this) : this
                                        }, t.expr[":"].quailCss = function(e, n, i) {
                                            var s = i[3].split(/\s*=\s*/);
                                            return t(e).css(s[0]).search(s[1]) > -1
                                        }, e.components.acronym = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                var e = t(this),
                                                    s = {},
                                                    a = {};
                                                e.find("acronym[title], abbr[title]").each(function() {
                                                    a[t(this).text().toUpperCase().trim()] = t(this).attr("title")
                                                }), e.find("p, div, h1, h2, h3, h4, h5").each(function() {
                                                    var e = this,
                                                        r = t(e),
                                                        o = r.text().split(" "),
                                                        c = [];
                                                    o.length > 1 && r.text().toUpperCase() !== r.text() ? (t.each(o, function(t, e) {
                                                            e.length < 2 || (e = e.replace(/[^a-zA-Zs]/, ""), e.toUpperCase() === e && "undefined" == typeof a[e.toUpperCase().trim()] && ("undefined" == typeof s[e.toUpperCase()] && c.push(e), s[e.toUpperCase()] = e))
                                                        }),
                                                        n.add(i(c.length ? {
                                                            element: e,
                                                            expected: r.closest(".quail-test").data("expected"),
                                                            info: {
                                                                acronyms: c
                                                            },
                                                            status: "failed"
                                                        } : {
                                                            element: e,
                                                            expected: r.closest(".quail-test").data("expected"),
                                                            status: "passed"
                                                        }))) : n.add(i({
                                                        element: e,
                                                        expected: r.closest(".quail-test").data("expected"),
                                                        status: "passed"
                                                    }))
                                                })
                                            })
                                        }, e.components.color = function() {
                                            function n(t, n, i, s, a, r) {
                                                t.add(n({
                                                    element: i,
                                                    expected: function(t, n) {
                                                        return e.components.resolveExpectation(t, n)
                                                    }(i, a),
                                                    message: r,
                                                    status: s
                                                }))
                                            }

                                            function i(e) {
                                                return "" !== t.trim(e)
                                            }

                                            function s(n) {
                                                var i = n.parentNode,
                                                    s = t(i);
                                                return 1 !== i.nodeType ? !1 : -1 !== ["script", "style", "title", "object", "applet", "embed", "template", "noscript"].indexOf(i.nodeName.toLowerCase()) ? !1 : e.isUnreadable(s.text()) ? !1 : !0
                                            }

                                            function a(t) {
                                                function e(t) {
                                                    return Object.keys(t).length
                                                }
                                                var n = {},
                                                    i = t.groupCasesBySelector(),
                                                    s = "";
                                                for (var a in i)
                                                    if (i.hasOwnProperty(a)) {
                                                        var r = i[a];
                                                        r.each(function(t, e) {
                                                            e.get("status") === n && (n[a] = s)
                                                        })
                                                    }
                                                return e(n) === e(i)
                                            }
                                            var r = {
                                                cache: {},
                                                getLuminosity: function(t, e) {
                                                    var n = "getLuminosity_" + t + "_" + e;
                                                    if (t = r.parseColor(t),
                                                        e = r.parseColor(e), void 0 !== r.cache[n]) return r.cache[n];
                                                    var i, s, a = t.r / 255,
                                                        o = t.g / 255,
                                                        c = t.b / 255,
                                                        u = .03928 >= a ? a / 12.92 : Math.pow((a + .055) / 1.055, 2.4),
                                                        l = .03928 >= o ? o / 12.92 : Math.pow((o + .055) / 1.055, 2.4),
                                                        d = .03928 >= c ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4),
                                                        h = e.r / 255,
                                                        p = e.g / 255,
                                                        f = e.b / 255,
                                                        g = .03928 >= h ? h / 12.92 : Math.pow((h + .055) / 1.055, 2.4),
                                                        m = .03928 >= p ? p / 12.92 : Math.pow((p + .055) / 1.055, 2.4),
                                                        v = .03928 >= f ? f / 12.92 : Math.pow((f + .055) / 1.055, 2.4);
                                                    return i = .2126 * u + .7152 * l + .0722 * d, s = .2126 * g + .7152 * m + .0722 * v, r.cache[n] = Math.round((Math.max(i, s) + .05) / (Math.min(i, s) + .05) * 10) / 10, r.cache[n]
                                                },
                                                fetchImageColorAtPixel: function(t, e, n) {
                                                    e = "undefined" != typeof e ? e : 1, n = "undefined" != typeof n ? n : 1;
                                                    var i = document.createElement("canvas"),
                                                        s = i.getContext("2d");
                                                    s.drawImage(t, 0, 0);
                                                    var a = s.getImageData(e, n, 1, 1).data;
                                                    return "rgb(" + a[0] + "," + a[1] + "," + a[2] + ")"
                                                },
                                                testElmContrast: function(t, e, n) {
                                                    var i = r.getColor(e, "background");
                                                    return r.testElmBackground(t, e, i, n)
                                                },
                                                testElmBackground: function(t, e, n, i) {
                                                    var s, a = r.getColor(e, "foreground");
                                                    return "wcag" === t ? s = r.passesWCAGColor(e, a, n, i) : "wai" === t && (s = r.passesWAIColor(a, n)),
                                                        s
                                                },
                                                passesWCAGColor: function(t, n, i, s) {
                                                    var a = e.components.convertToPx(t.css("fontSize"));
                                                    if ("undefined" == typeof s)
                                                        if (a >= 18) s = 3;
                                                        else {
                                                            var o = t.css("fontWeight");
                                                            s = a >= 14 && ("bold" === o || parseInt(o, 10) >= 700) ? 3 : 4.5
                                                        }
                                                    return r.getLuminosity(n, i) > s
                                                },
                                                passesWAIColor: function(t, e) {
                                                    var n = r.getWAIErtContrast(t, e),
                                                        i = r.getWAIErtBrightness(t, e);
                                                    return n > 500 && i > 125
                                                },
                                                getWAIErtContrast: function(t, e) {
                                                    var n = r.getWAIDiffs(t, e);
                                                    return n.red + n.green + n.blue
                                                },
                                                getWAIErtBrightness: function(t, e) {
                                                    var n = r.getWAIDiffs(t, e);
                                                    return (299 * n.red + 587 * n.green + 114 * n.blue) / 1e3
                                                },
                                                getWAIDiffs: function(t, e) {
                                                    return {
                                                        red: Math.abs(t.r - e.r),
                                                        green: Math.abs(t.g - e.g),
                                                        blue: Math.abs(t.b - e.b)
                                                    }
                                                },
                                                getColor: function(e, n) {
                                                    var i = r;
                                                    e.attr("data-cacheId") || e.attr("data-cacheId", "id_" + Math.random());
                                                    var s = "getColor_" + n + "_" + e.attr("data-cacheId");
                                                    if (void 0 !== r.cache[s]) return r.cache[s];
                                                    if ("foreground" === n) return r.cache[s] = e.css("color") ? e.css("color") : "rgb(0,0,0)", r.cache[s];
                                                    var a = e.css("background-color");
                                                    return r.hasBackgroundColor(a) ? (r.cache[s] = a, r.cache[s]) : (e.parents().each(function() {
                                                        var e = t(this).css("background-color");
                                                        return r.hasBackgroundColor(e) ? i.cache[s] = e : void 0
                                                    }), r.cache[s] = "rgb(255,255,255)", r.cache[s])
                                                },
                                                getForeground: function(t) {
                                                    return r.getColor(t, "foreground")
                                                },
                                                parseColor: function(t) {
                                                    return "object" == typeof t ? t : "#" === t.substr(0, 1) ? {
                                                        r: parseInt(t.substr(1, 2), 16),
                                                        g: parseInt(t.substr(3, 2), 16),
                                                        b: parseInt(t.substr(5, 2), 16),
                                                        a: !1
                                                    } : "rgb" === t.substr(0, 3) ? (t = t.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(","), {
                                                        r: t[0],
                                                        g: t[1],
                                                        b: t[2],
                                                        a: "undefined" == typeof t[3] ? !1 : t[3]
                                                    }) : void 0
                                                },
                                                getBackgroundImage: function(e) {
                                                    e.attr("data-cacheId") || e.attr("data-cacheId", "id_" + Math.random());
                                                    var n = "getBackgroundImage_" + e.attr("data-cacheId");
                                                    if (void 0 !== r.cache[n]) return r.cache[n];
                                                    for (e = e[0]; e && 1 === e.nodeType && "BODY" !== e.nodeName && "HTML" !== e.nodeName;) {
                                                        var i = t(e).css("background-image");
                                                        if (i && "none" !== i && -1 !== i.search(/^(.*?)url(.*?)$/i)) return r.cache[n] = i.replace("url(", "").replace(/['"]/g, "").replace(")", ""), r.cache[n];
                                                        e = e.parentNode
                                                    }
                                                    return r.cache[n] = !1, !1
                                                },
                                                getBackgroundGradient: function(e) {
                                                    e.attr("data-cacheId") || e.attr("data-cacheId", "id_" + Math.random());
                                                    var n = "getBackgroundGradient_" + e.attr("data-cacheId");
                                                    if (void 0 !== r.cache[n]) return r.cache[n];
                                                    var i = function(e) {
                                                        return "" !== t.trim(e)
                                                    };
                                                    for (e = e[0]; e && 1 === e.nodeType && "BODY" !== e.nodeName && "HTML" !== e.nodeName;) {
                                                        if (r.hasBackgroundColor(t(e).css("background-color"))) return r.cache[n] = !1, !1;
                                                        var s = t(e).css("backgroundImage");
                                                        if (s && "none" !== s && -1 !== s.search(/^(.*?)gradient(.*?)$/i)) {
                                                            var a = s.match(/gradient(\(.*\))/g);
                                                            if (a.length > 0) return a = a[0].replace(/(linear|radial|from|\bto\b|gradient|top|left|bottom|right|\d*%)/g, ""), r.cache[n] = t.grep(a.match(/(rgb\([^\)]+\)|#[a-z\d]*|[a-z]*)/g), i), r.cache[n]
                                                        }
                                                        e = e.parentNode
                                                    }
                                                    return r.cache[n] = !1, !1
                                                },
                                                getAverageRGB: function(t) {
                                                    var e = t.src;
                                                    if (void 0 !== r.cache[e]) return r.cache[e];
                                                    var n, i, s, a, o = 5,
                                                        c = {
                                                            r: 0,
                                                            g: 0,
                                                            b: 0
                                                        },
                                                        u = document.createElement("canvas"),
                                                        l = u.getContext && u.getContext("2d"),
                                                        d = -4,
                                                        h = {
                                                            r: 0,
                                                            g: 0,
                                                            b: 0,
                                                            a: 0
                                                        },
                                                        p = 0;
                                                    if (!l) return r.cache[e] = c, c;
                                                    s = u.height = t.height, i = u.width = t.width, l.drawImage(t, 0, 0);
                                                    try {
                                                        n = l.getImageData(0, 0, i, s)
                                                    } catch (f) {
                                                        return r.cache[e] = c, c
                                                    }
                                                    for (a = n.data.length;
                                                        (d += 4 * o) < a;) ++p, h.r += n.data[d], h.g += n.data[d + 1], h.b += n.data[d + 2];
                                                    return h.r = ~~(h.r / p), h.g = ~~(h.g / p), h.b = ~~(h.b / p), r.cache[e] = h, h
                                                },
                                                colorToHex: function(t) {
                                                    var e = /rgba?\((\d+), (\d+), (\d+)/.exec(t);
                                                    return e ? "#" + (1 << 24 | e[1] << 16 | e[2] << 8 | e[3]).toString(16).substr(1) : t
                                                },
                                                hasBackgroundColor: function(t) {
                                                    return "rgba(0, 0, 0, 0)" !== t && "transparent" !== t
                                                },
                                                traverseVisualTreeForBackground: function(e, n) {
                                                    e.attr("data-cacheId") || e.attr("data-cacheId", "id_" + Math.random());
                                                    var s = "traverseVisualTreeForBackground_" + e.attr("data-cacheId") + "_" + n;
                                                    if (void 0 !== r.cache[s]) return r.cache[s];
                                                    var a, o = [];
                                                    e[0].scrollIntoView();
                                                    var c = e.offset().left - t(window).scrollLeft(),
                                                        u = e.offset().top - t(window).scrollTop();
                                                    o.push({
                                                        element: e,
                                                        visibility: e.css("visibility")
                                                    }), e.css("visibility", "hidden");
                                                    for (var l = document.elementFromPoint(c, u); void 0 === a && l && "BODY" !== l.tagName && "HTML" !== l.tagName;) {
                                                        l = t(l);
                                                        var d, h = l.css("backgroundColor");
                                                        switch (n) {
                                                            case "background-color":
                                                                r.hasBackgroundColor(h) && (a = h);
                                                                break;
                                                            case "background-gradient":
                                                                if (r.hasBackgroundColor(h)) {
                                                                    a = !1;
                                                                    continue
                                                                }
                                                                if (d = l.css("backgroundImage"), d && "none" !== d && -1 !== d.search(/^(.*?)gradient(.*?)$/i)) {
                                                                    var p = d.match(/gradient(\(.*\))/g);
                                                                    p.length > 0 && (p = p[0].replace(/(linear|radial|from|\bto\b|gradient|top|left|bottom|right|\d*%)/g, ""), a = t.grep(p.match(/(rgb\([^\)]+\)|#[a-z\d]*|[a-z]*)/g), i))
                                                                }
                                                                break;
                                                            case "background-image":
                                                                if (r.hasBackgroundColor(h)) {
                                                                    a = !1;
                                                                    continue
                                                                }
                                                                d = l.css("backgroundImage"), d && "none" !== d && -1 !== d.search(/^(.*?)url(.*?)$/i) && (a = d.replace("url(", "").replace(/['"]/g, "").replace(")", ""))
                                                        }
                                                        o.push({
                                                            element: l,
                                                            visibility: l.css("visibility")
                                                        }), l.css("visibility", "hidden"), l = document.elementFromPoint(c, u)
                                                    }
                                                    for (var f = 0; f < o.length; f++) o[f].element.css("visibility", o[f].visibility);
                                                    return r.cache[s] = a, a
                                                },
                                                getBehindElementBackgroundColor: function(t) {
                                                    return r.traverseVisualTreeForBackground(t, "background-color")
                                                },
                                                getBehindElementBackgroundGradient: function(t) {
                                                    return r.traverseVisualTreeForBackground(t, "background-gradient");
                                                },
                                                getBehindElementBackgroundImage: function(t) {
                                                    return r.traverseVisualTreeForBackground(t, "background-image")
                                                }
                                            };
                                            return {
                                                colors: r,
                                                textShouldBeTested: s,
                                                postInvoke: a,
                                                buildCase: n
                                            }
                                        }(), e.components.content = {
                                            findContent: function(e) {
                                                var n = e;
                                                return e.is("[role=main]") ? e : e.find("[role=main]").length ? e.find("[role=main]").first() : 0 === e.find("p").length ? e : (e.find("p").each(function() {
                                                    var e = t(this).parent(),
                                                        i = e.get(0),
                                                        s = e.data("content-score") || 0;
                                                    e.data("content-score") || (s = e.find("p").length, i.className.match(/(comment|meta|footer|footnote)/) ? s -= 50 : i.className.match(/((^|\\s)(post|hentry|entry[-]?(content|text|body)?|article[-]?(content|text|body)?)(\\s|$))/) && (s += 25), i.id.match(/(comment|meta|footer|footnote)/) ? s -= 50 : i.id.match(/^(post|hentry|entry[-]?(content|text|body)?|article[-]?(content|text|body)?)$/) && (s += 25), e.data("content-score", s)), s += t(this).text().split(",").length, ("undefined" == typeof n.data("content-score") || s > n.data("content-score")) && (n = e)
                                                }), n)
                                            }
                                        }, e.components.convertToPx = function(n) {
                                            if (n.search("px") > -1) return parseInt(n, 10);
                                            var i = t('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: ' + n + '; line-height: 1; border:0;">&nbsp;</div>').appendTo(e.html),
                                                s = i.height();
                                            return i.remove(), s
                                        }, e.components.event = function(e, n, i, s) {
                                            var a = n.get("$scope"),
                                                r = s.selector && a.find(s.selector) || a.find("*"),
                                                o = s.searchEvent || "",
                                                c = s.correspondingEvent || "";
                                            r.each(function() {
                                                var s, a = o.replace("on", ""),
                                                    r = e.components.hasEventListener(t(this), a);
                                                t._data && (s = t._data(this, "events"));
                                                var u = s && s[a] && !!s[a].length,
                                                    l = !!c.length,
                                                    d = e.components.hasEventListener(t(this), c.replace("on", "")),
                                                    h = t(this).closest(".quail-test").data("expected"),
                                                    p = n.add(i({
                                                        element: this,
                                                        expected: h
                                                    }));
                                                p.set(!r && !u || l && d ? {
                                                    status: "passed"
                                                } : {
                                                    status: "failed"
                                                })
                                            })
                                        }, e.components.hasEventListener = function(e, n) {
                                            return "undefined" != typeof t(e).attr("on" + n) ? !0 : t._data(t(e)[0], "events") && "undefined" != typeof t._data(t(e)[0], "events")[n] ? !0 : t(e).is("a[href], input, button, video, textarea") && "undefined" != typeof t(e)[0][n] && ("click" === n || "focus" === n) && t(e)[0][n].toString().search(/^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/i) > -1 ? !1 : "undefined" != typeof t(e)[0][n];
                                        }, e.components.headingLevel = function(e, n, i, s) {
                                            var a = !1;
                                            n.get("$scope").find(":header").each(function() {
                                                var r = parseInt(t(this).get(0).tagName.substr(-1, 1), 10),
                                                    o = this;
                                                n.add(i(a === s.headingLevel && r > a + 1 ? {
                                                    element: o,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(o),
                                                    status: "failed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(o),
                                                    status: "passed"
                                                })), a = r
                                            })
                                        }, e.components.htmlSource = {
                                            getHtml: function(n) {
                                                var i = this;
                                                if ("undefined" != typeof e.options.htmlSource && e.options.htmlSource) return void n(e.options.htmlSource, i.parseHtml(e.options.htmlSource));
                                                var s = t.ajax({
                                                    url: window.location.href,
                                                    async: !1
                                                });
                                                s && "undefined" != typeof s.responseText && n(s.responseText, i.parseHtml(s.responseText))
                                            },
                                            traverse: function(e, n, i, s) {
                                                var a = this;
                                                "undefined" == typeof s && n(e, i, !1), "undefined" != typeof e.children && (e.childCount = 1, t.each(e.children, function(t, i) {
                                                    n(i, e.childCount, e), a.traverse(i, n, e.childCount, !0), "tag" === i.type && e.childCount++
                                                })), t.isArray(e) && t.each(e, function(t, e) {
                                                    a.traverse(e, n)
                                                })
                                            },
                                            addSelector: function(t, e, n) {
                                                if ("tag" === t.type && "undefined" != typeof t.name && "undefined" == typeof t.selector) {
                                                    t.selector = n && "undefined" != typeof n.selector ? n.selector.slice() : [];
                                                    var i = t.name;
                                                    return "undefined" != typeof t.attributes && ("undefined" != typeof t.attributes.id ? i += "#" + t.attributes.id[0] : "undefined" != typeof t.attributes["class"] && (i += "." + t.attributes["class"][0].replace(/\s/, "."))), !e || "undefined" != typeof t.attributes && "undefined" != typeof t.attributes.id || (i += ":nth-child(" + e + ")"), t.selector.push(i), t.selector
                                                }
                                            },
                                            parseHtml: function(t) {
                                                if ("undefined" == typeof Tautologistics) return !1;
                                                t = t.replace(/<!doctype ([^>]*)>/g, "");
                                                var e = new Tautologistics.NodeHtmlParser.HtmlBuilder(function() {}, {}),
                                                    n = new Tautologistics.NodeHtmlParser.Parser(e);
                                                n.parseComplete(t);
                                                var i = e.dom,
                                                    s = this;
                                                return this.traverse(i, s.addSelector), i
                                            }
                                        }, "undefined" != typeof Tautologistics) {
                                        var n = {
                                            Text: "text",
                                            Tag: "tag",
                                            Attr: "attr",
                                            CData: "cdata",
                                            Comment: "comment"
                                        };
                                        Tautologistics.NodeHtmlParser.HtmlBuilder.prototype.write = function(t) {
                                            if (this._done && this.handleCallback(new Error("Writing to the builder after done() called is not allowed without a reset()")), this._options.includeLocation && t.type !== n.Attr && (t.location = this._getLocation(), this._updateLocation(t)), t.type !== n.Text || !this._options.ignoreWhitespace || !HtmlBuilder.reWhitespace.test(t.data)) {
                                                var e, i;
                                                if (this._tagStack.last())
                                                    if (e = this._tagStack.last(), t.type === n.Tag)
                                                        if ("/" === t.name.charAt(0)) {
                                                            var s = this._options.caseSensitiveTags ? t.name.substring(1) : t.name.substring(1).toLowerCase();
                                                            if (e.name === s && (e.closingTag = !0), !this.isEmptyTag(t)) {
                                                                for (var a = this._tagStack.length - 1; a > -1 && this._tagStack[a--].name !== s;);
                                                                if (a > -1 || this._tagStack[0].name === s)
                                                                    for (; a < this._tagStack.length - 1;) this._tagStack.pop()
                                                            }
                                                        } else t.type === n.Attr ? (e.attributes || (e.attributes = {}), "undefined" == typeof e.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()] && (e.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()] = []), e.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()].push(t.data)) : (i = this._copyElement(t),
                                                            e.children || (e.children = []), e.children.push(i), this.isEmptyTag(i) || this._tagStack.push(i), t.type === n.Tag && (this._lastTag = i));
                                                else e = this._tagStack.last(), t.type === n.Attr ? (e.attributes || (e.attributes = {}), "undefined" == typeof e.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()] && (e.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()] = []), e.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()].push(t.data)) : (e.children || (e.children = []), e.children.push(this._copyElement(t)));
                                                else t.type === n.Tag ? "/" !== t.name.charAt(0) && (i = this._copyElement(t), i.closingTag = !0, this.dom.push(i), this.isEmptyTag(i) || this._tagStack.push(i), this._lastTag = i) : t.type === n.Attr && this._lastTag ? (this._lastTag.attributes || (this._lastTag.attributes = {}), "undefined" == typeof this._lastTag.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()] && (this._lastTag.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()] = []), this._lastTag.attributes[this._options.caseSensitiveAttr ? t.name : t.name.toLowerCase()].push(t.data)) : this.dom.push(this._copyElement(t));
                                            }
                                        }
                                    }
                                    var i = function() {
                                        var t, e, n, i, s, a, r, o = "<",
                                            c = ">",
                                            u = "/",
                                            l = "/",
                                            d = "!",
                                            h = new RegExp("[dD]"),
                                            p = new RegExp("[a-z0-9-]"),
                                            f = new RegExp("^<!--.*-->"),
                                            g = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"],
                                            m = ["pre", "code", "textarea", "script", "style"],
                                            v = ["p", "li", "tr", "th", "td"],
                                            b = function(t, e) {
                                                return {
                                                    name: n,
                                                    line: t + 1,
                                                    "char": e
                                                }
                                            },
                                            y = function(t) {
                                                var e = new Error("Ending tag not found for: " + t.name + " at line: " + t.line + " char: " + t["char"] + " starting tags: " + i[0].name);
                                                throw e.lineData = t, e
                                            },
                                            x = function(t) {
                                                var e = new Error("Comment ending not found for: `comment` at line: " + t.line + " char: " + t["char"]);
                                                throw e.lineData = t, e
                                            },
                                            w = function(t) {
                                                var e = new Error("Ending `/` not found for: `" + t.name + "` at line: " + t.line + " char: " + t["char"]);
                                                throw e.lineData = t.name, e
                                            },
                                            C = function(n) {
                                                e = t, t = n
                                            },
                                            T = function(t) {
                                                s -= t
                                            },
                                            k = function(t, e, s) {
                                                if (p.test(t)) n += t;
                                                else if (t === u) C(_);
                                                else if (t === d) n = "", C(O);
                                                else if (g.indexOf(n) > -1) r.strict_self_closing_tags ? C(I) : (n = "", C(S));
                                                else {
                                                    var a = b(e, s);
                                                    i.push(a), m.indexOf(n) > -1 ? (n = "", T(1), C(F)) : (n = "", T(1), C(E))
                                                }
                                            },
                                            I = function(t, e, i) {
                                                t === l ? (n = "", C(q)) : t === c && w(b(e, i))
                                            },
                                            E = function(t) {
                                                t === c && C(q)
                                            },
                                            S = function(t) {
                                                t === o && C(k)
                                            },
                                            _ = function(t) {
                                                function e() {
                                                    var t = i.pop();
                                                    t.name === n ? C(S) : v.indexOf(t.name) > -1 ? e() : y(t)
                                                }
                                                p.test(t) ? n += t : (e(), n = "")
                                            },
                                            D = function(t) {
                                                t === u ? C(_) : (T(1), C(k))
                                            },
                                            q = function(t) {
                                                t === o && C(D)
                                            },
                                            F = function(t) {
                                                t === o && C(R)
                                            },
                                            R = function(t) {
                                                t === u && C(A)
                                            },
                                            A = function(t) {
                                                if (p.test(t)) n += t;
                                                else {
                                                    var e = i.pop();
                                                    e.name === n ? C(S) : y(e), n = ""
                                                }
                                            },
                                            O = function(t) {
                                                h.test(t) ? (n = "", C(S)) : (T(3), C(L))
                                            },
                                            L = function(t, e, n) {
                                                a || (a = {
                                                    content: "",
                                                    line: e + 1,
                                                    "char": n + 1,
                                                    name: "comment"
                                                }), a.content += t, f.test(a.content) && (a = null, C(S))
                                            },
                                            N = function(e, o) {
                                                var c = null;
                                                try {
                                                    var u, l = e.split("\n");
                                                    C(S), n = "", i = [], a = null, r = o || {};
                                                    for (var d = 0, h = l.length; h > d; d++)
                                                        for (s = 0, u = l[d].length; u > s && t; s++) t(l[d][s], d, s);
                                                    if (a) x(a);
                                                    else if (i.length > 0) {
                                                        var p = i[i.length - 1]; - 1 === v.indexOf(p.name) && y(p)
                                                    }
                                                    c = null
                                                } catch (f) {
                                                    c = f.message
                                                } finally {
                                                    return c
                                                }
                                            };
                                        return N
                                    };
                                    e.components.htmlTagValidator = i(), e.components.label = function(e, n, i, s) {
                                            var a = n.get("$scope");
                                            a.each(function() {
                                                var a = t(this);
                                                a.find(s.selector).each(function() {
                                                    n.add(i(t(this).parent("label").length && a.find("label[for=" + t(this).attr("id") + "]").length && e.containsReadableText(t(this).parent("label")) || e.containsReadableText(a.find("label[for=" + t(this).attr("id") + "]")) ? {
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected"),
                                                        status: "passed"
                                                    } : {
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected"),
                                                        status: "failed"
                                                    }))
                                                })
                                            })
                                        }, e.components.labelProximity = function(e, n, i, s) {
                                            var a = n.get("$scope");
                                            a.find(s.selector).each(function() {
                                                var e = a.find("label[for=" + t(this).attr("id") + "]").first();
                                                n.add(i(e.length && t(this).parent().is(e.parent()) ? {
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: "passed"
                                                } : {
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.components.language = {
                                            maximumDistance: 300,
                                            textDirection: {
                                                rtl: /[\u0600-\u06FF]|[\u0750-\u077F]|[\u0590-\u05FF]|[\uFE70-\uFEFF]/gm,
                                                ltr: /[\u0041-\u007A]|[\u00C0-\u02AF]|[\u0388-\u058F]/gm
                                            },
                                            textDirectionChanges: {
                                                rtl: /[\u200E]|&rlm;/gm,
                                                ltr: /[\u200F]|&lrm;/gm
                                            },
                                            scripts: {
                                                basicLatin: {
                                                    regularExpression: /[\u0041-\u007F]/g,
                                                    languages: ["ceb", "en", "eu", "ha", "haw", "id", "la", "nr", "nso", "so", "ss", "st", "sw", "tlh", "tn", "ts", "xh", "zu", "af", "az", "ca", "cs", "cy", "da", "de", "es", "et", "fi", "fr", "hr", "hu", "is", "it", "lt", "lv", "nl", "no", "pl", "pt", "ro", "sk", "sl", "sq", "sv", "tl", "tr", "ve", "vi"]
                                                },
                                                arabic: {
                                                    regularExpression: /[\u0600-\u06FF]/g,
                                                    languages: ["ar", "fa", "ps", "ur"]
                                                },
                                                cryllic: {
                                                    regularExpression: /[\u0400-\u04FF]|[\u0500-\u052F]/g,
                                                    languages: ["bg", "kk", "ky", "mk", "mn", "ru", "sr", "uk", "uz"]
                                                }
                                            },
                                            scriptSingletons: {
                                                bn: /[\u0980-\u09FF]/g,
                                                bo: /[\u0F00-\u0FFF]/g,
                                                el: /[\u0370-\u03FF]/g,
                                                gu: /[\u0A80-\u0AFF]/g,
                                                he: /[\u0590-\u05FF]/g,
                                                hy: /[\u0530-\u058F]/g,
                                                ja: /[\u3040-\u309F]|[\u30A0-\u30FF]/g,
                                                ka: /[\u10A0-\u10FF]/g,
                                                km: /[\u1780-\u17FF]|[\u19E0-\u19FF]/g,
                                                kn: /[\u0C80-\u0CFF]/g,
                                                ko: /[\u1100-\u11FF]|[\u3130-\u318F]|[\uAC00-\uD7AF]/g,
                                                lo: /[\u0E80-\u0EFF]/g,
                                                ml: /[\u0D00-\u0D7F]/g,
                                                mn: /[\u1800-\u18AF]/g,
                                                or: /[\u0B00-\u0B7F]/g,
                                                pa: /[\u0A00-\u0A7F]/g,
                                                si: /[\u0D80-\u0DFF]/g,
                                                ta: /[\u0B80-\u0BFF]/g,
                                                te: /[\u0C00-\u0C7F]/g,
                                                th: /[\u0E00-\u0E7F]/g,
                                                zh: /[\u3100-\u312F]|[\u2F00-\u2FDF]/g
                                            },
                                            getDocumentLanguage: function(t, n) {
                                                var i = navigator.language || navigator.userLanguage;
                                                return "undefined" != typeof e.options.language && (i = e.options.language), t.parents("[lang]").length && (i = t.parents("[lang]:first").attr("lang")), "undefined" != typeof t.attr("lang") && (i = t.attr("lang")), i = i.toLowerCase().trim(), n ? i.split("-")[0] : i
                                            }
                                        }, e.components.placeholder = function(e, n, i, s) {
                                            var a = function(e, s) {
                                                n.add(i({
                                                    element: e,
                                                    expected: t(e).closest(".quail-test").data("expected"),
                                                    status: s
                                                }))
                                            };
                                            n.get("$scope").find(s.selector).each(function() {
                                                var n = "";
                                                if ("none" === t(this).css("display") && !t(this).is("title")) return void a(this, "inapplicable");
                                                if ("undefined" != typeof s.attribute) {
                                                    if (("undefined" == typeof t(this).attr(s.attribute) || "tabindex" === s.attribute && t(this).attr(s.attribute) <= 0) && !s.content) return void a(this, "failed");
                                                    t(this).attr(s.attribute) && "undefined" !== t(this).attr(s.attribute) && (n += t(this).attr(s.attribute));
                                                }
                                                if (("undefined" == typeof s.attribute || !s.attribute || s.content) && (n += t(this).text(), t(this).find("img[alt]").each(function() {
                                                        n += t(this).attr("alt")
                                                    })), "string" == typeof n && n.length > 0) {
                                                    n = e.cleanString(n);
                                                    var i = /^([0-9]*)(k|kb|mb|k bytes|k byte)$/g,
                                                        r = i.exec(n.toLowerCase());
                                                    r && r[0].length ? a(this, "failed") : s.empty && e.isUnreadable(n) ? a(this, "failed") : e.strings.placeholders.indexOf(n) > -1 ? a(this, "failed") : a(this, "passed")
                                                } else s.empty && "number" != typeof n && a(this, "failed")
                                            })
                                        }, e.components.resolveExpectation = function(e, n) {
                                            var i, s = t(e).closest(".quail-test"),
                                                a = s.data("expected");
                                            n || (i = s.data("expected"));
                                            var r = "string" == typeof a && a.split("|");
                                            if (n && 0 === r.length && a.indexOf(":") > -1 && (r = [a]), r.length > 0 && 1 === e.nodeType)
                                                for (var o, c, u = 0, l = r.length; l > u; ++u)
                                                    if (o = r[u].split(":"), n) {
                                                        if (o[0] === n) {
                                                            if (!o[1] || "ignore" === o[1]) return;
                                                            i = o[1]
                                                        }
                                                    } else if (c = t(o[0], s), 1 === c.length && e === c.get(0)) {
                                                if (!o[1] || "ignore" === o[1]) return;
                                                i = o[1]
                                            }
                                            return i
                                        }, e.components.selector = function(e, n, i, s) {
                                            this.get("$scope").each(function() {
                                                var i = t(this),
                                                    a = t(this).find(s.selector);
                                                a.length ? a.each(function() {
                                                    var i, a = t(this);
                                                    i = s.test && !a.is(s.test) ? "passed" : "failed", n.add(e.lib.Case({
                                                        element: this,
                                                        expected: a.closest(".quail-test").data("expected"),
                                                        status: i
                                                    }))
                                                }) : n.add(e.lib.Case({
                                                    element: void 0,
                                                    expected: i.data("expected") || i.find("[data-expected]").data("expected"),
                                                    status: s.test ? "inapplicable" : "passed"
                                                }))
                                            })
                                        }, e.statistics = {
                                            setDecimal: function(t, e) {
                                                var n = Math.pow(10, e || 0);
                                                return e ? Math.round(n * t) / n : t
                                            },
                                            average: function(t, n) {
                                                for (var i = t.length, s = 0; i--;) s += t[i];
                                                return e.statistics.setDecimal(s / t.length, n)
                                            },
                                            variance: function(t, n) {
                                                for (var i = e.statistics.average(t, n), s = t.length, a = 0; s--;) a += Math.pow(t[s] - i, 2);
                                                return a /= t.length, e.statistics.setDecimal(a, n)
                                            },
                                            standardDeviation: function(t, n) {
                                                var i = Math.sqrt(e.statistics.variance(t, n));
                                                return e.statistics.setDecimal(i, n)
                                            }
                                        }, e.components.textStatistics = {
                                            cleanText: function(t) {
                                                return t.replace(/[,:;()\-]/, " ").replace(/[\.!?]/, ".").replace(/[ ]*(\n|\r\n|\r)[ ]*/, " ").replace(/([\.])[\. ]+/, "$1").replace(/[ ]*([\.])/, "$1").replace(/[ ]+/, " ").toLowerCase();
                                            },
                                            sentenceCount: function(t) {
                                                return t.split(".").length + 1
                                            },
                                            wordCount: function(t) {
                                                return t.split(" ").length + 1
                                            },
                                            averageWordsPerSentence: function(t) {
                                                return this.wordCount(t) / this.sentenceCount(t)
                                            },
                                            averageSyllablesPerWord: function(e) {
                                                var n = this,
                                                    i = 0,
                                                    s = n.wordCount(e);
                                                return s ? (t.each(e.split(" "), function(t, e) {
                                                    i += n.syllableCount(e)
                                                }), i / s) : 0
                                            },
                                            syllableCount: function(t) {
                                                var e = t.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g);
                                                return e && 0 !== e.length ? e.length : 1
                                            }
                                        }, e.components.video = {
                                            isVideo: function(e) {
                                                var n = !1;
                                                return t.each(this.providers, function() {
                                                    e.is(this.selector) && this.isVideo(e) && (n = !0)
                                                }), n
                                            },
                                            findVideos: function(e, n) {
                                                t.each(this.providers, function(i, s) {
                                                    e.find(this.selector).each(function() {
                                                        var e = t(this);
                                                        s.isVideo(e) && s.hasCaptions(e, n)
                                                    })
                                                })
                                            },
                                            providers: {
                                                youTube: {
                                                    selector: "a, iframe",
                                                    apiUrl: "http://gdata.youtube.com/feeds/api/videos/?q=%video&caption&v=2&alt=json",
                                                    isVideo: function(t) {
                                                        return this.getVideoId(t) !== !1 ? !0 : !1
                                                    },
                                                    getVideoId: function(t) {
                                                        var e = t.is("iframe") ? "src" : "href",
                                                            n = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/,
                                                            i = t.attr(e).match(n);
                                                        return i && 11 === i[7].length ? i[7] : !1
                                                    },
                                                    hasCaptions: function(e, n) {
                                                        var i = this.getVideoId(e);
                                                        t.ajax({
                                                            url: this.apiUrl.replace("%video", i),
                                                            async: !1,
                                                            dataType: "json",
                                                            success: function(t) {
                                                                n(e, t.feed.openSearch$totalResults.$t > 0)
                                                            }
                                                        })
                                                    }
                                                },
                                                flash: {
                                                    selector: "object",
                                                    isVideo: function(e) {
                                                        var n = !1;
                                                        return 0 === e.find("param").length ? !1 : (e.find("param[name=flashvars]").each(function() {
                                                            t(this).attr("value").search(/\.(flv|mp4)/i) > -1 && (n = !0)
                                                        }), n)
                                                    },
                                                    hasCaptions: function(e, n) {
                                                        var i = !1;
                                                        e.find("param[name=flashvars]").each(function() {
                                                            (t(this).attr("value").search("captions") > -1 && t(this).attr("value").search(".srt") > -1 || t(this).attr("value").search("captions.pluginmode") > -1) && (i = !0)
                                                        }), n(e, i)
                                                    }
                                                },
                                                videoElement: {
                                                    selector: "video",
                                                    isVideo: function(t) {
                                                        return t.is("video")
                                                    },
                                                    hasCaptions: function(n, i) {
                                                        var s = n.find("track[kind=subtitles], track[kind=captions]");
                                                        if (!s.length) return void i(n, !1);
                                                        var a = e.components.language.getDocumentLanguage(n, !0);
                                                        n.parents("[lang]").length && (a = n.parents("[lang]").first().attr("lang").split("-")[0]);
                                                        var r = !1;
                                                        return s.each(function() {
                                                            if (!t(this).attr("srclang") || t(this).attr("srclang").toLowerCase() === a) {
                                                                r = !0;
                                                                try {
                                                                    var e = t.ajax({
                                                                        url: t(this).attr("src"),
                                                                        type: "HEAD",
                                                                        async: !1,
                                                                        error: function() {}
                                                                    });
                                                                    404 === e.status && (r = !1)
                                                                } catch (n) {}
                                                            }
                                                        }), r ? void i(n, !0) : void i(n, !1)
                                                    }
                                                }
                                            }
                                        }, e.strings.colors = {
                                            aliceblue: "f0f8ff",
                                            antiquewhite: "faebd7",
                                            aqua: "00ffff",
                                            aquamarine: "7fffd4",
                                            azure: "f0ffff",
                                            beige: "f5f5dc",
                                            bisque: "ffe4c4",
                                            black: "000000",
                                            blanchedalmond: "ffebcd",
                                            blue: "0000ff",
                                            blueviolet: "8a2be2",
                                            brown: "a52a2a",
                                            burlywood: "deb887",
                                            cadetblue: "5f9ea0",
                                            chartreuse: "7fff00",
                                            chocolate: "d2691e",
                                            coral: "ff7f50",
                                            cornflowerblue: "6495ed",
                                            cornsilk: "fff8dc",
                                            crimson: "dc143c",
                                            cyan: "00ffff",
                                            darkblue: "00008b",
                                            darkcyan: "008b8b",
                                            darkgoldenrod: "b8860b",
                                            darkgray: "a9a9a9",
                                            darkgreen: "006400",
                                            darkkhaki: "bdb76b",
                                            darkmagenta: "8b008b",
                                            darkolivegreen: "556b2f",
                                            darkorange: "ff8c00",
                                            darkorchid: "9932cc",
                                            darkred: "8b0000",
                                            darksalmon: "e9967a",
                                            darkseagreen: "8fbc8f",
                                            darkslateblue: "483d8b",
                                            darkslategray: "2f4f4f",
                                            darkturquoise: "00ced1",
                                            darkviolet: "9400d3",
                                            deeppink: "ff1493",
                                            deepskyblue: "00bfff",
                                            dimgray: "696969",
                                            dodgerblue: "1e90ff",
                                            firebrick: "b22222",
                                            floralwhite: "fffaf0",
                                            forestgreen: "228b22",
                                            fuchsia: "ff00ff",
                                            gainsboro: "dcdcdc",
                                            ghostwhite: "f8f8ff",
                                            gold: "ffd700",
                                            goldenrod: "daa520",
                                            gray: "808080",
                                            green: "008000",
                                            greenyellow: "adff2f",
                                            honeydew: "f0fff0",
                                            hotpink: "ff69b4",
                                            indianred: "cd5c5c",
                                            indigo: "4b0082",
                                            ivory: "fffff0",
                                            khaki: "f0e68c",
                                            lavender: "e6e6fa",
                                            lavenderblush: "fff0f5",
                                            lawngreen: "7cfc00",
                                            lemonchiffon: "fffacd",
                                            lightblue: "add8e6",
                                            lightcoral: "f08080",
                                            lightcyan: "e0ffff",
                                            lightgoldenrodyellow: "fafad2",
                                            lightgrey: "d3d3d3",
                                            lightgreen: "90ee90",
                                            lightpink: "ffb6c1",
                                            lightsalmon: "ffa07a",
                                            lightseagreen: "20b2aa",
                                            lightskyblue: "87cefa",
                                            lightslategray: "778899",
                                            lightsteelblue: "b0c4de",
                                            lightyellow: "ffffe0",
                                            lime: "00ff00",
                                            limegreen: "32cd32",
                                            linen: "faf0e6",
                                            magenta: "ff00ff",
                                            maroon: "800000",
                                            mediumaquamarine: "66cdaa",
                                            mediumblue: "0000cd",
                                            mediumorchid: "ba55d3",
                                            mediumpurple: "9370d8",
                                            mediumseagreen: "3cb371",
                                            mediumslateblue: "7b68ee",
                                            mediumspringgreen: "00fa9a",
                                            mediumturquoise: "48d1cc",
                                            mediumvioletred: "c71585",
                                            midnightblue: "191970",
                                            mintcream: "f5fffa",
                                            mistyrose: "ffe4e1",
                                            moccasin: "ffe4b5",
                                            navajowhite: "ffdead",
                                            navy: "000080",
                                            oldlace: "fdf5e6",
                                            olive: "808000",
                                            olivedrab: "6b8e23",
                                            orange: "ffa500",
                                            orangered: "ff4500",
                                            orchid: "da70d6",
                                            palegoldenrod: "eee8aa",
                                            palegreen: "98fb98",
                                            paleturquoise: "afeeee",
                                            palevioletred: "d87093",
                                            papayawhip: "ffefd5",
                                            peachpuff: "ffdab9",
                                            peru: "cd853f",
                                            pink: "ffc0cb",
                                            plum: "dda0dd",
                                            powderblue: "b0e0e6",
                                            purple: "800080",
                                            red: "ff0000",
                                            rosybrown: "bc8f8f",
                                            royalblue: "4169e1",
                                            saddlebrown: "8b4513",
                                            salmon: "fa8072",
                                            sandybrown: "f4a460",
                                            seagreen: "2e8b57",
                                            seashell: "fff5ee",
                                            sienna: "a0522d",
                                            silver: "c0c0c0",
                                            skyblue: "87ceeb",
                                            slateblue: "6a5acd",
                                            slategray: "708090",
                                            snow: "fffafa",
                                            springgreen: "00ff7f",
                                            steelblue: "4682b4",
                                            tan: "d2b48c",
                                            teal: "008080",
                                            thistle: "d8bfd8",
                                            tomato: "ff6347",
                                            turquoise: "40e0d0",
                                            violet: "ee82ee",
                                            wheat: "f5deb3",
                                            white: "ffffff",
                                            whitesmoke: "f5f5f5",
                                            yellow: "ffff00",
                                            yellowgreen: "9acd32"
                                        }, e.strings.languageCodes = ["bh", "bi", "nb", "bs", "br", "bg", "my", "es", "ca", "km", "ch", "ce", "ny", "ny", "zh", "za", "cu", "cu", "cv", "kw", "co", "cr", "hr", "cs", "da", "dv", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "nl", "fr", "ff", "gd", "gl", "lg", "ka", "de", "ki", "el", "kl", "gn", "gu", "ht", "ht", "ha", "he", "hz", "hi", "ho", "hu", "is", "io", "ig", "id", "ia", "ie", "iu", "ik", "ga", "it", "ja", "jv", "kl", "kn", "kr", "ks", "kk", "ki", "rw", "ky", "kv", "kg", "ko", "kj", "ku", "kj", "ky", "lo", "la", "lv", "lb", "li", "li", "li", "ln", "lt", "lu", "lb", "mk", "mg", "ms", "ml", "dv", "mt", "gv", "mi", "mr", "mh", "ro", "ro", "mn", "na", "nv", "nv", "nd", "nr", "ng", "ne", "nd", "se", "no", "nb", "nn", "ii", "ny", "nn", "ie", "oc", "oj", "cu", "cu", "cu", "or", "om", "os", "os", "pi", "pa", "ps", "fa", "pl", "pt", "pa", "ps", "qu", "ro", "rm", "rn", "ru", "sm", "sg", "sa", "sc", "gd", "sr", "sn", "ii", "sd", "si", "si", "sk", "sl", "so", "st", "nr", "es", "su", "sw", "ss", "sv", "tl", "ty", "tg", "ta", "tt", "te", "th", "bo", "ti", "to", "ts", "tn", "tr", "tk", "tw", "ug", "uk", "ur", "ug", "uz", "ca", "ve", "vi", "vo", "wa", "cy", "fy", "wo", "xh", "yi", "yo", "za", "zu"],
                                        e.strings.newWindow = [/new (browser )?(window|frame)/, /popup (window|frame)/], e.strings.placeholders = ["title", "untitled", "untitled document", "this is the title", "the title", "content", " ", "new page", "new", "nbsp", "&nbsp;", "spacer", "image", "img", "photo", "frame", "frame title", "iframe", "iframe title", "legend"], e.strings.redundant = {
                                            inputImage: ["submit", "button"],
                                            link: ["link to", "link", "go to", "click here", "link", "click", "more"],
                                            required: ["*"]
                                        }, e.strings.siteMap = ["site map", "map", "sitemap"], e.strings.skipContent = [/(jump|skip) (.*) (content|main|post)/i], e.strings.suspiciousLinks = ["click here", "click", "more", "here", "read more", "download", "add", "delete", "clone", "order", "view", "read", "clic aqu&iacute;", "clic", "haga clic", "m&aacute;s", "aqu&iacute;", "image"], e.strings.symbols = ["|", "*", /\*/g, "<br>*", "&bull;", "&#8226", "♦", "›", "»", "‣", "▶", ".", "◦", "✓", "◽", "•", "—", "◾"], e.KINGStrongList = function(e, n, i) {
                                            n.get("$scope").find("strong").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set({
                                                    status: t(this).parent().is("li") ? "passed" : "failed"
                                                })
                                            })
                                        }, e.KINGUseCurrencyAsSymbol = function(e, n, i) {
                                            function s(s, a) {
                                                var r = ["dollar", "euro", "pound", "franc", "krona", "rupee", "ruble", "dinar"],
                                                    o = new RegExp("\\d{1,}\\s*(" + r.join("|") + ")\\w*\\b|(" + r.join("|") + ")\\w*\\b\\s*\\d{1,}", "ig"),
                                                    c = e.getTextContents(t(a)),
                                                    u = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                n.add(u), u.set({
                                                    status: o.test(c) ? "failed" : "passed"
                                                })
                                            }
                                            n.get("$scope").find("p").each(s)
                                        }, e.KINGUseLongDateFormat = function(e, n, i) {
                                            function s(e, s) {
                                                var a, r = /\d{1,2}([.\/-])\d{1,2}\1\d{2,4}/g,
                                                    o = s.childNodes,
                                                    c = !1,
                                                    u = [],
                                                    l = 0;
                                                for (a = o.length; a > l; l++) o[l].nodeType === Node.TEXT_NODE && u.push(o[l]);
                                                for (l = 0; l < u.length && !c; l++) {
                                                    var d = u[l].nodeValue;
                                                    r.test(d) && (c = !0)
                                                }
                                                var h = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(h), h.set({
                                                    status: c ? "failed" : "passed"
                                                })
                                            }
                                            var a = "a, article, aside, b, blockquote, caption, cite, dd, del, div, em, figcaption, footer, h1, h2, h3, h4, h5, h6, header, i, label, legend, li, mark, nav, option, p, q, s, section, small, span, strong, sub, summary, sup, td, th, title, u";
                                            n.get("$scope").find(a).each(s)
                                        }, e.KINGUsePercentageWithSymbol = function(e, n, i) {
                                            function s(s, a) {
                                                var r = ["percent", "pct\\."],
                                                    o = new RegExp("\\d{1,}\\s*(" + r.join("|") + ")|(" + r.join("|") + ")\\s*\\d{1,}", "ig"),
                                                    c = e.getTextContents(t(a)),
                                                    u = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                n.add(u), u.set({
                                                    status: o.test(c) ? "failed" : "passed"
                                                })
                                            }
                                            n.get("$scope").find("p").each(s)
                                        }, e.aAdjacentWithSameResourceShouldBeCombined = function(e, n, i) {
                                            function s(e, n) {
                                                var i = t(n),
                                                    s = i.find("a + a").length > 0,
                                                    o = i.find("a");
                                                o.each(s ? a : r)
                                            }

                                            function a(e, s) {
                                                var a = t(s),
                                                    r = s.getAttribute("href"),
                                                    o = a.find("+ a");
                                                if (o.length) {
                                                    var c = o[0].getAttribute("href"),
                                                        u = "passed",
                                                        l = i({
                                                            element: s,
                                                            expected: a.closest(".quail-test").data("expected")
                                                        });
                                                    r === c && (u = "failed"), n.add(l), l.set({
                                                        status: u
                                                    })
                                                }
                                            }

                                            function r(e, s) {
                                                var a = i({
                                                    element: s
                                                });
                                                n.add(a), a.set({
                                                    status: "inapplicable",
                                                    expected: t(s).closest(".quail-test").data("expected")
                                                })
                                            }
                                            n.get("$scope").each(s)
                                        }, e.aImgAltNotRepetitive = function(e, n, i) {
                                            n.get("$scope").find("a img[alt]").each(function() {
                                                var s = n.add(i({
                                                        element: this
                                                    })),
                                                    a = t(this).closest(".quail-test").data("expected");
                                                s.set(e.cleanString(t(this).attr("alt")) === e.cleanString(t(this).parent("a").text()) ? {
                                                    expected: a,
                                                    status: "failed"
                                                } : {
                                                    expected: a,
                                                    status: "passed"
                                                })
                                            })
                                        }, e.aInPHasADistinctStyle = function(e, n, i) {
                                            function s(t) {
                                                return t.outerWidth() - t.innerWidth() > 0 || t.outerHeight() - t.innerHeight() > 0
                                            }

                                            function a(e, n) {
                                                var i = !1,
                                                    a = ["font-weight", "font-style"],
                                                    r = e.css("text-decoration");
                                                return "none" !== r && r !== n.css("text-decoration") && (i = !0), "rgba(0, 0, 0, 0)" !== e.css("background-color") && a.push("background"), t.each(a, function(t, s) {
                                                    i || e.css(s) === n.css(s) || (i = !0)
                                                }), i || s(e)
                                            }

                                            function r(t) {
                                                var e = "block" === t.css("display"),
                                                    n = t.css("position"),
                                                    i = "relative" !== n && "static" !== n;
                                                return e || i
                                            }
                                            var o = /^([\s|-]|>|<|\\|\/|&(gt|lt);)*$/i;
                                            n.get("$scope").each(function() {
                                                var e = t(this),
                                                    s = e.find("p a[href]:visible");
                                                s.each(function() {
                                                    var e = t(this),
                                                        s = e.closest("p"),
                                                        c = e.parent(),
                                                        u = i({
                                                            element: this,
                                                            expected: e.closest(".quail-test").data("expected")
                                                        });
                                                    n.add(u);
                                                    var l = e.text().trim(),
                                                        d = s.clone().find("a[href]").remove().end().text();
                                                    "" === l || d.match(o) ? u.set("status", "inapplicable") : e.css("color") === s.css("color") ? u.set("status", "passed") : a(e, s) ? u.set("status", "passed") : r(e) ? u.set("status", "passed") : e.find("img").length > 0 ? u.set("status", "passed") : c.text().trim() === l && a(c, s) ? u.set("status", "passed") : u.set("status", "failed")
                                                })
                                            })
                                        }, e.aLinkTextDoesNotBeginWithRedundantWord = function(e, n, i) {
                                            n.get("$scope").find("a").each(function() {
                                                var s = t(this),
                                                    a = "";
                                                t(this).find("img[alt]").length && (a += t(this).find("img[alt]:first").attr("alt")), a += t(this).text(), a = a.toLowerCase();
                                                var r;
                                                t.each(e.strings.redundant.link, function(t, e) {
                                                    a.search(e) > -1 && (r = n.add(i({
                                                        element: this,
                                                        expected: s.closest(".quail-test").data("expected"),
                                                        status: "failed"
                                                    })))
                                                }), r || n.add(i({
                                                    element: this,
                                                    expected: s.closest(".quail-test").data("expected"),
                                                    status: "passed"
                                                }))
                                            })
                                        }, e.aLinkWithNonText = function(e, n, i) {
                                            n.get("$scope").find("a").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                if (n.add(s), !t(this).is("a:has(img, object, embed)[href]")) return void s.set({
                                                    status: "inapplicable"
                                                });
                                                if (!e.isUnreadable(t(this).text())) return void s.set({
                                                    status: "passed"
                                                });
                                                var a = 0;
                                                t(this).find("img, object, embed").each(function() {
                                                    (t(this).is("img") && e.isUnreadable(t(this).attr("alt")) || !t(this).is("img") && e.isUnreadable(t(this).attr("title"))) && a++
                                                }), s.set(t(this).find("img, object, embed").length === a ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.aLinksAreSeparatedByPrintableCharacters = function(e, n, i) {
                                            n.get("$scope").find("a").each(function() {
                                                var s = n.add(i({
                                                        element: this
                                                    })),
                                                    a = t(this).closest(".quail-test").data("expected");
                                                t(this).next("a").length && s.set(e.isUnreadable(t(this).get(0).nextSibling.wholeText) ? {
                                                    expected: a,
                                                    status: "failed"
                                                } : {
                                                    expected: a,
                                                    status: "passed"
                                                })
                                            })
                                        }, e.aLinksDontOpenNewWindow = function(e, n, i) {
                                            n.get("$scope").find("a").not("[target=_new], [target=_blank]").each(function() {
                                                n.add(i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: "passed"
                                                }))
                                            }), n.get("$scope").find("a[target=_new], a[target=_blank]").each(function() {
                                                var s = t(this),
                                                    a = !1,
                                                    r = 0,
                                                    o = s.text() + " " + s.attr("title"),
                                                    c = "";
                                                do c = e.strings.newWindow[r], o.search(c) > -1 && (a = !0), ++r; while (!a && r < e.strings.newWindow.length);
                                                n.add(i(a ? {
                                                    element: this,
                                                    expected: s.closest(".quail-test").data("expected"),
                                                    status: "passed"
                                                } : {
                                                    element: this,
                                                    expected: s.closest(".quail-test").data("expected"),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.aLinksNotSeparatedBySymbols = function(e, n, i) {
                                            n.get("$scope").find("a").each(function() {
                                                var s = t(this);
                                                if (s.next("a").length) {
                                                    var a = s.get(0).nextSibling.wholeText;
                                                    "string" == typeof a ? -1 !== e.strings.symbols.indexOf(a.toLowerCase().trim()) && n.add(i({
                                                        element: this,
                                                        expected: s.closest(".quail-test").data("expected"),
                                                        status: "failed"
                                                    })) : n.add(i({
                                                        element: this,
                                                        expected: s.closest(".quail-test").data("expected"),
                                                        status: "passed"
                                                    }))
                                                } else n.add(i({
                                                    status: "inapplicable"
                                                }))
                                            })
                                        }, e.aMustContainText = function(e, n, i) {
                                            n.get("$scope").find("a").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                return n.add(s), t(this).attr("href") && "none" !== t(this).css("display") ? void s.set(e.containsReadableText(t(this), !0) ? {
                                                    status: "passed"
                                                } : {
                                                    status: "failed"
                                                }) : void s.set({
                                                    status: "inapplicable"
                                                })
                                            })
                                        }, e.aSuspiciousLinkText = function(e, n, i) {
                                            n.get("$scope").find("a").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                if (n.add(s), !t(this).attr("href")) return void s.set({
                                                    status: "inapplicable"
                                                });
                                                var a = t(this).text();
                                                t(this).find("img[alt]").each(function() {
                                                    a += t(this).attr("alt")
                                                }), s.set(e.strings.suspiciousLinks.indexOf(e.cleanString(a)) > -1 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.animatedGifMayBePresent = function(e, n, i) {
                                            function s(t, e, n) {
                                                if ("gif" !== e) return void n(!1);
                                                var i = new XMLHttpRequest;
                                                i.open("GET", t, !0), i.responseType = "arraybuffer", i.addEventListener("load", function() {
                                                    var t = new Uint8Array(i.response),
                                                        e = 0;
                                                    if (71 !== t[0] || 73 !== t[1] || 70 !== t[2] || 56 !== t[3]) return void n(!1);
                                                    for (var s = 0; s < t.length - 9; s++)
                                                        if (0 !== t[s] || 33 !== t[s + 1] || 249 !== t[s + 2] || 4 !== t[s + 3] || 0 !== t[s + 8] || 44 !== t[s + 9] && 33 !== t[s + 9] || e++, e > 1) return void n(!0);
                                                    n(!1)
                                                }), i.send()
                                            }
                                            n.get("$scope").find("img").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var a = t(this).attr("src"),
                                                    r = t(this).attr("src").split(".").pop().toLowerCase();
                                                return "gif" !== r ? void e.set({
                                                    status: "inapplicable"
                                                }) : void s(a, r, function(t) {
                                                    return t ? void e.set({
                                                        status: "cantTell"
                                                    }) : void e.set({
                                                        status: "inapplicable"
                                                    })
                                                })
                                            })
                                        }, e.appletContainsTextEquivalent = function(e, n, i) {
                                            n.get("$scope").find('applet[alt=""], applet:not(applet[alt])').each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s), s.set(e.isUnreadable(t(this).text()) ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.ariaOrphanedContent = function(e, n, i) {
                                            var s = n.get("$scope");
                                            s.each(function() {
                                                var e = t(this),
                                                    s = !!e.attr("role"),
                                                    a = !!e.find("[role]").length;
                                                if (!s && !a) return void n.add(i({
                                                    expected: e.data("expected"),
                                                    status: "inapplicable"
                                                }));
                                                var r = e.find("*:not(*[role] *, *[role], script, meta, link)");
                                                r.length ? r.each(function() {
                                                    n.add(i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected"),
                                                        status: "failed"
                                                    }))
                                                }) : n.add(i({
                                                    expected: e.data("expected"),
                                                    status: "passed"
                                                }))
                                            })
                                        }, e.audioMayBePresent = function(e, n, i) {
                                            var s = ["mp3", "m4p", "ogg", "oga", "opus", "wav", "wma", "wv"];
                                            n.get("$scope").each(function() {
                                                var e = t(this),
                                                    a = !1;
                                                e.find("object, audio").each(function() {
                                                    a = !0, n.add(i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected"),
                                                        status: "cantTell"
                                                    }))
                                                }), e.find("a[href]").each(function() {
                                                    var e = t(this),
                                                        r = e.attr("href").split(".").pop(); - 1 !== t.inArray(r, s) && (a = !0, n.add(i({
                                                        element: this,
                                                        expected: e.closest(".quail-test").data("expected"),
                                                        status: "cantTell"
                                                    })))
                                                }), a || n.add(i({
                                                    element: this,
                                                    status: "inapplicable",
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                }))
                                            })
                                        }, e.blockquoteUseForQuotations = function(e, n, i) {
                                            n.get("$scope").find("p").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                return n.add(e), t(this).parents("blockquote").length > 0 ? void e.set({
                                                    status: "inapplicable"
                                                }) : void e.set(t(this).text().substr(0, 1).search(/'|"|«|“|「/) > -1 && t(this).text().substr(-1, 1).search(/'|"|»|„|」/) > -1 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.closingTagsAreUsed = function(e, n, i) {
                                            e.components.htmlSource.getHtml(function(s, a) {
                                                e.components.htmlSource.traverse(a, function(s) {
                                                    if ("tag" === s.type && t.isArray(s.selector)) {
                                                        var a;
                                                        a = /#/.test(s.selector.slice(-1)[0]) ? s.selector.slice(-1)[0] : s.selector.join(" > ");
                                                        var r = t(a, n.get("$scope")).get(0);
                                                        r || (r = s.raw || a), n.add(i("undefined" != typeof s.closingTag || s.closingTag || -1 !== e.selfClosingTags.indexOf(s.name.toLowerCase()) ? {
                                                            element: r,
                                                            expected: "object" == typeof r && 1 === r.nodeType && t(r).closest(".quail-test").data("expected") || null,
                                                            status: "passed"
                                                        } : {
                                                            element: r,
                                                            expected: "object" == typeof r && 1 === r.nodeType && t(r).closest(".quail-test").data("expected") || null,
                                                            status: "failed"
                                                        }))
                                                    }
                                                })
                                            })
                                        }, e.colorBackgroundGradientContrast = function(e, n, i, s) {
                                            function a(t, e, n, i, s) {
                                                var a, u, l, d = r.getBackgroundGradient(i);
                                                if (d) {
                                                    for (var h = 0; h < d.length; h++) "rgb" === d[h].substr(0, 3) && (d[h] = r.colorToHex(d[h]));
                                                    for (u = new Rainbow, u.setSpectrumByArray(d), l = d.length * n.gradientSampleMultiplier, a = !1, h = 0; !a && l > h; h++) {
                                                        var p = r.testElmBackground(n.algorithm, i, "#" + u.colourAt(h));
                                                        p || (o(t, e, s, "failed", c, "The background gradient makes the text unreadable"), a = !0)
                                                    }
                                                    a || o(t, e, s, "passed", c, "The background gradient does not affect readability")
                                                }
                                            }
                                            var r = e.components.color.colors,
                                                o = e.components.color.buildCase,
                                                c = "colorBackgroundGradientContrast";
                                            n.get("$scope").each(function() {
                                                for (var r = document.evaluate("descendant::text()[normalize-space()]", this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), c = [], u = r.iterateNext(); u;) e.components.color.textShouldBeTested(u) && c.push(u.parentNode), u = r.iterateNext();
                                                0 === c.length && o(n, i, null, "inapplicable", "", "There is no text to evaluate"), c.forEach(function(e) {
                                                    a(n, i, s, t(e), e)
                                                })
                                            })
                                        }, e.colorBackgroundImageContrast = function(e, n, i, s) {
                                            function a(t, e, n, i, s) {
                                                var a = r.getBackgroundImage(i);
                                                if (a) {
                                                    var u = document.createElement("img");
                                                    u.crossOrigin = "Anonymous", u.onload = function() {
                                                        var a = r.getAverageRGB(u),
                                                            l = r.testElmBackground(n.algorithm, i, a);
                                                        l ? o(t, e, s, "passed", c, "The element's background image does not affect readability") : o(t, e, s, "failed", c, "The element's background image makes the text unreadable");
                                                    }, u.onerror = u.onabort = function() {
                                                        o(t, e, s, "cantTell", c, "The element's background image could not be loaded (" + a + ")")
                                                    }, u.src = a
                                                }
                                            }
                                            var r = e.components.color.colors,
                                                o = e.components.color.buildCase,
                                                c = "colorBackgroundImageContrast";
                                            n.get("$scope").each(function() {
                                                for (var r = document.evaluate("descendant::text()[normalize-space()]", this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), c = [], u = r.iterateNext(); u;) e.components.color.textShouldBeTested(u) && c.push(u.parentNode), u = r.iterateNext();
                                                0 === c.length && o(n, i, null, "inapplicable", "", "There is no text to evaluate"), c.forEach(function(e) {
                                                    a(n, i, s, t(e), e)
                                                })
                                            })
                                        }, e.colorElementBehindBackgroundGradientContrast = function(e, n, i, s) {
                                            function a(t, e, n, i, s) {
                                                var a, u;
                                                if (i.is("option") || (a = r.getBehindElementBackgroundGradient(i)), a) {
                                                    for (var l = 0; l < a.length; l++) "rgb" === a[l].substr(0, 3) && (a[l] = r.colorToHex(a[l]));
                                                    var d = new Rainbow;
                                                    d.setSpectrumByArray(a);
                                                    var h = a.length * n.gradientSampleMultiplier;
                                                    for (u = !1, l = 0; !u && h > l; l++) u = !r.testElmBackground(n.algorithm, i, "#" + d.colourAt(l));
                                                    u ? o(t, e, s, "failed", c, "The background gradient of the element behind this element makes the text unreadable") : o(t, e, s, "passed", c, "The background gradient of the element behind this element does not affect readability")
                                                }
                                            }
                                            var r = e.components.color.colors,
                                                o = e.components.color.buildCase,
                                                c = "colorElementBehindBackgroundGradientContrast";
                                            n.get("$scope").each(function() {
                                                for (var r = document.evaluate("descendant::text()[normalize-space()]", this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), c = [], u = r.iterateNext(); u;) e.components.color.textShouldBeTested(u) && c.push(u.parentNode), u = r.iterateNext();
                                                0 === c.length && o(n, i, null, "inapplicable", "", "There is no text to evaluate"), c.forEach(function(e) {
                                                    a(n, i, s, t(e), e)
                                                })
                                            })
                                        }, e.colorElementBehindBackgroundImageContrast = function(e, n, i, s) {
                                            function a(t, e, n, i, s) {
                                                var a;
                                                if (i.is("option") || (a = r.getBehindElementBackgroundImage(i)), a) {
                                                    var u = document.createElement("img");
                                                    u.crossOrigin = "Anonymous", u.onload = function() {
                                                        var a = r.getAverageRGB(u),
                                                            l = r.testElmBackground(n.algorithm, i, a);
                                                        l ? o(t, e, s, "passed", c, "The background image of the element behind this element does not affect readability") : o(t, e, s, "failed", c, "The background image of the element behind this element makes the text unreadable")
                                                    }, u.onerror = u.onabort = function() {
                                                        o(t, e, s, "cantTell", c, "The background image of the element behind this element could not be loaded (" + a + ")")
                                                    }, u.src = a
                                                }
                                            }
                                            var r = e.components.color.colors,
                                                o = e.components.color.buildCase,
                                                c = "colorElementBehindBackgroundImageContrast";
                                            n.get("$scope").each(function() {
                                                for (var r = document.evaluate("descendant::text()[normalize-space()]", this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), c = [], u = r.iterateNext(); u;) e.components.color.textShouldBeTested(u) && c.push(u.parentNode), u = r.iterateNext();
                                                0 === c.length && o(n, i, null, "inapplicable", "", "There is no text to evaluate"), c.forEach(function(e) {
                                                    a(n, i, s, t(e), e)
                                                })
                                            })
                                        }, e.colorElementBehindContrast = function(e, n, i, s) {
                                            function a(t, e, n, i, s) {
                                                var a;
                                                if (i.is("option") || (a = r.getBehindElementBackgroundColor(i)), a) {
                                                    var u = r.testElmBackground(n.algorithm, i, a);
                                                    u ? o(t, e, s, "passed", c, "The element behind this element does not affect readability") : o(t, e, s, "failed", c, "The element behind this element makes the text unreadable")
                                                }
                                            }
                                            var r = e.components.color.colors,
                                                o = e.components.color.buildCase,
                                                c = "colorElementBehindContrast";
                                            n.get("$scope").each(function() {
                                                for (var r = document.evaluate("descendant::text()[normalize-space()]", this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), c = [], u = r.iterateNext(); u;) e.components.color.textShouldBeTested(u) && c.push(u.parentNode), u = r.iterateNext();
                                                0 === c.length && o(n, i, null, "inapplicable", "", "There is no text to evaluate"), c.forEach(function(e) {
                                                    a(n, i, s, t(e), e)
                                                })
                                            })
                                        }, e.colorFontContrast = function(e, n, i, s) {
                                            function a(t, e, n, i, s) {
                                                r.testElmContrast(n.algorithm, i) ? o(t, e, s, "passed", c, "The font contrast of the text is sufficient for readability") : o(t, e, s, "failed", c, "The font contrast of the text impairs readability")
                                            }
                                            var r = e.components.color.colors,
                                                o = e.components.color.buildCase,
                                                c = "colorFontContrast";
                                            n.get("$scope").each(function() {
                                                for (var r = document.evaluate("descendant::text()[normalize-space()]", this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null), c = [], u = r.iterateNext(); u;) e.components.color.textShouldBeTested(u) && c.push(u.parentNode), u = r.iterateNext();
                                                0 === c.length && o(n, i, null, "inapplicable", "", "There is no text to evaluate"), c.forEach(function(e) {
                                                    a(n, i, s, t(e), e)
                                                })
                                            })
                                        }, e.contentPositioningShouldNotChangeMeaning = function(e, n, i) {
                                            var s = ["top", "left", "right", "bottom"],
                                                a = {},
                                                r = !1;
                                            n.get("$scope").find("*:has(*:quailCss(position=absolute))").each(function() {
                                                a = {
                                                    top: {},
                                                    left: {},
                                                    right: {},
                                                    bottom: {}
                                                }, r = !1;
                                                var e = t(this);
                                                e.find("h1, h2, h3, h4, h5, h6, p, blockquote, ol, li, ul, dd, dt").filter(":quailCss(position=absolute)").each(function() {
                                                    for (var e = 0; e < s.length; e++) "undefined" != typeof t(this).css(s[e]) && "auto" !== t(this).css(s[e]) && ("undefined" == typeof a[s[e]][t(this).css(s[e])] && (a[s[e]][t(this).css(s[e])] = 0), a[s[e]][t(this).css(s[e])]++)
                                                }), t.each(s, function() {
                                                    t.each(a[this], function() {
                                                        this > 2 && !r && (r = !0, n.add(i({
                                                            element: e.get(0),
                                                            expected: e.closest(".quail-test").data("expected"),
                                                            status: "failed"
                                                        })))
                                                    })
                                                })
                                            })
                                        }, e.definitionListsAreUsed = function(e, n, i) {
                                            n.get("$scope").find("dl").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set({
                                                    status: "inapplicable"
                                                })
                                            }), n.get("$scope").find("p, li").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var s = t(this);
                                                t(this).find("span, strong, em, b, i").each(function() {
                                                    if (t(this).text().length < 50 && 0 === s.text().search(t(this).text())) {
                                                        if (t(this).is("span") && t(this).css("font-weight") === s.css("font-weight") && t(this).css("font-style") === s.css("font-style")) return void e.set({
                                                            status: "passed"
                                                        });
                                                        e.set({
                                                            status: "failed"
                                                        })
                                                    }
                                                })
                                            })
                                        }, e.doNotUseGraphicalSymbolToConveyInformation = function(e, n, i) {
                                            n.get("$scope").find(e.textSelector + ":not(abbr, acronym)").each(function() {
                                                var s = "✓",
                                                    a = "?xo[]()+-!*xX",
                                                    r = t(this).text(),
                                                    o = r.replace(/[\W\s]+/g, "");
                                                0 === o.length ? -1 === s.indexOf(r) && n.add(i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                })) : n.add(i(1 === r.length && a.indexOf(r) >= 0 ? {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "passed"
                                                }))
                                            }), n.get("$scope").find(e.textSelector).filter("abbr, acronym").each(function() {
                                                n.add(i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "inapplicable"
                                                }))
                                            })
                                        }, e.doctypeProvided = function(e, n, i) {
                                            var s = n.get("$scope").get(0);
                                            n.add(i(0 !== t(s.doctype).length || document.doctype ? {
                                                element: s,
                                                expected: "pass",
                                                status: "passed"
                                            } : {
                                                element: s,
                                                expected: "fail",
                                                status: "failed"
                                            }))
                                        }, e.documentAbbrIsUsed = function(t, e, n) {
                                            t.components.acronym(t, e, n, "abbr")
                                        }, e.documentAcronymsHaveElement = function(t, e, n) {
                                            t.components.acronym(t, e, n, "acronym")
                                        }, e.documentIDsMustBeUnique = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                0 === t(this).children().length && n.add(i({
                                                    element: this,
                                                    status: "inapplicable",
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                }))
                                            }), n.get("$scope").find(":not([id])").each(function() {
                                                n.add(i({
                                                    element: this,
                                                    status: "inapplicable",
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                }))
                                            }), n.get("$scope").each(function() {
                                                var s = {};
                                                t(this).find("[id]").each(function() {
                                                    var a = i({
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this)
                                                    });
                                                    n.add(a), "undefined" == typeof s[t(this).attr("id")] && 0 === Object.keys(s).length ? (a.set({
                                                        status: "inapplicable"
                                                    }), s[t(this).attr("id")] = t(this).attr("id")) : "undefined" == typeof s[t(this).attr("id")] ? (a.set({
                                                        status: "passed"
                                                    }), s[t(this).attr("id")] = t(this).attr("id")) : a.set({
                                                        status: "failed"
                                                    })
                                                })
                                            })
                                        }, e.documentIsWrittenClearly = function(e, n, i) {
                                            n.get("$scope").find(e.textSelector).each(function() {
                                                var s = e.components.textStatistics.cleanText(t(this).text()),
                                                    a = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                return n.add(a), e.isUnreadable(s) ? void a.set({
                                                    status: "inapplicable"
                                                }) : void a.set(Math.round(206.835 - 1.015 * e.components.textStatistics.averageWordsPerSentence(s) - 84.6 * e.components.textStatistics.averageSyllablesPerWord(s)) < 60 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.documentLangIsISO639Standard = function(e, n, i) {
                                            var s = n.get("$scope").is("html") ? n.get("$scope") : n.get("$scope").find("html").first(),
                                                a = i({
                                                    element: s[0],
                                                    expected: s.closest(".quail-test").length ? s.closest(".quail-test").data("expected") : s.data("expected")
                                                }),
                                                r = s.attr("lang"),
                                                o = !1;
                                            n.add(a), s.is("html") && "undefined" != typeof r ? (t.each(e.strings.languageCodes, function(t, e) {
                                                o || 0 !== r.indexOf(e) || (o = !0)
                                            }), a.set(o ? null === r.match(/^[a-z]{2}(-[A-Z]{2})?$/) ? {
                                                status: "failed"
                                            } : {
                                                status: "passed"
                                            } : {
                                                status: "failed"
                                            })) : a.set({
                                                status: "inapplicable"
                                            })
                                        }, e.documentStrictDocType = function(t, e, n) {
                                            e.add(n("undefined" != typeof document.doctype && document.doctype && -1 !== document.doctype.systemId.search("strict") ? {
                                                element: document,
                                                expected: e.get("$scope").data("expected"),
                                                status: "passed"
                                            } : {
                                                element: document,
                                                expected: e.get("$scope").data("expected"),
                                                status: "failed"
                                            }))
                                        }, e.documentTitleIsShort = function(t, e, n) {
                                            var i = e.get("$scope").find("head title:first"),
                                                s = n({
                                                    element: i,
                                                    expected: i.closest(".quail-test").data("expected")
                                                });
                                            return e.add(s), i.length ? void s.set({
                                                status: i.text().length > 150 ? "failed" : "passed"
                                            }) : void s.set({
                                                element: e.get("$scope"),
                                                status: "inapplicable"
                                            })
                                        }, e.documentValidatesToDocType = function() {
                                            "undefined" == typeof document.doctype
                                        }, e.documentVisualListsAreMarkedUp = function(e, n, i) {
                                            var s = ["♦", "›", "»", "‣", "▶", "◦", "✓", "◽", "•", "—", "◾", "-\\D", "\\\\", "\\*(?!\\*)", "\\.\\s", "x\\s", "&bull;", "&#8226;", "&gt;", "[0-9]+\\.", "\\(?[0-9]+\\)", "[\\u25A0-\\u25FF]", "[IVX]{1,5}\\.\\s"],
                                                a = RegExp("(^|<br[^>]*>)[\\s]*(" + s.join("|") + ")", "gi");
                                            n.get("$scope").find(e.textSelector).each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var s = t(this).html().match(a);
                                                e.set({
                                                    status: s && s.length > 2 ? "failed" : "passed"
                                                })
                                            })
                                        }, e.elementAttributesAreValid = function(e, n, i) {
                                            e.components.htmlSource.getHtml(function(s, a) {
                                                a && e.components.htmlSource.traverse(a, function(e) {
                                                    if ("undefined" != typeof e.raw && t.isArray(e.selector)) {
                                                        var s, a = !1;
                                                        s = /#/.test(e.selector.slice(-1)[0]) ? e.selector.slice(-1)[0] : e.selector.join(" > ");
                                                        var r = t(s, n.get("$scope")).get(0);
                                                        r || (r = e.raw || s);
                                                        var o = e.raw.match(/\'|\"/g);
                                                        o && o.length % 2 !== 0 && (n.add(i({
                                                            element: r,
                                                            expected: "object" == typeof r && 1 === r.nodeType && t(r).closest(".quail-test").data("expected") || null,
                                                            status: "failed"
                                                        })), a = !0), e.raw.search(/([a-z]*)=(\'|\")([a-z\.]*)(\'|\")[a-z]/i) > -1 && (n.add(i({
                                                            element: r,
                                                            expected: "object" == typeof r && 1 === r.nodeType && t(r).closest(".quail-test").data("expected") || null,
                                                            status: "failed"
                                                        })), a = !0);
                                                        var c = e.raw.split("=");
                                                        c.shift(), t.each(c, function() {
                                                            -1 === this.search(/\'|\"/) && this.search(/\s/i) > -1 && (n.add(i({
                                                                element: r,
                                                                expected: "object" == typeof r && 1 === r.nodeType && t(r).closest(".quail-test").data("expected") || null,
                                                                status: "failed"
                                                            })), a = !0)
                                                        }), a || n.add(i({
                                                            element: r,
                                                            expected: "object" == typeof r && 1 === r.nodeType && t(r).closest(".quail-test").data("expected") || null,
                                                            status: "passed"
                                                        }))
                                                    }
                                                })
                                            })
                                        }, e.elementsDoNotHaveDuplicateAttributes = function(e, n, i) {
                                            e.components.htmlSource.getHtml(function(s, a) {
                                                a && e.components.htmlSource.traverse(a, function(e) {
                                                    if ("tag" === e.type && t.isArray(e.selector)) {
                                                        var s;
                                                        s = /#/.test(e.selector.slice(-1)[0]) ? e.selector.slice(-1)[0] : e.selector.join(" > ");
                                                        var a = t(s, n.get("$scope")).get(0);
                                                        if (a || (a = e.raw || s), "undefined" != typeof e.attributes) {
                                                            var r = [];
                                                            t.each(e.attributes, function(t, e) {
                                                                e.length > 1 && r.push(e)
                                                            }), n.add(i(r.length ? {
                                                                element: a,
                                                                expected: "object" == typeof a && 1 === a.nodeType && t(a).closest(".quail-test").data("expected") || null,
                                                                info: r,
                                                                status: "failed"
                                                            } : {
                                                                element: a,
                                                                expected: "object" == typeof a && 1 === a.nodeType && t(a).closest(".quail-test").data("expected") || null,
                                                                info: r,
                                                                status: "passed"
                                                            }))
                                                        }
                                                    }
                                                })
                                            })
                                        }, e.embedHasAssociatedNoEmbed = function(e, n, i) {
                                            n.get("$scope").find("embed").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set({
                                                    status: t(this).find("noembed").length || t(this).next().is("noembed") ? "passed" : "failed"
                                                })
                                            })
                                        }, e.emoticonsExcessiveUse = function(e, n, i) {
                                            n.get("$scope").find(e.textSelector).each(function() {
                                                var s = 0,
                                                    a = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                n.add(a), t.each(t(this).text().split(" "), function(t, n) {
                                                    n.search(e.emoticonRegex) > -1 && s++
                                                }), a.set(0 === s ? {
                                                    status: "inapplicable"
                                                } : {
                                                    status: s > 4 ? "failed" : "passed"
                                                })
                                            })
                                        }, e.emoticonsMissingAbbr = function(e, n, i) {
                                            n.get("$scope").find(e.textSelector + ":not(abbr, acronym)").each(function() {
                                                var s = t(this),
                                                    a = s.clone(),
                                                    r = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                n.add(r), a.find("abbr, acronym").each(function() {
                                                    t(this).remove()
                                                });
                                                var o = "passed";
                                                t.each(a.text().split(" "), function(t, n) {
                                                    n.search(e.emoticonRegex) > -1 && (o = "failed")
                                                }), r.set({
                                                    status: o
                                                })
                                            })
                                        }, e.focusIndicatorVisible = function(e, n, i) {
                                            n.get("$scope").find(e.focusElements).each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s);
                                                var a = {
                                                    borderWidth: t(this).css("border-width"),
                                                    borderColor: t(this).css("border-color"),
                                                    backgroundColor: t(this).css("background-color"),
                                                    boxShadow: t(this).css("box-shadow")
                                                };
                                                if (t(this).focus(), a.backgroundColor.trim() !== t(this).css("background-color").trim()) return t(this).blur(), void s.set({
                                                    status: "passed"
                                                });
                                                var r = e.components.convertToPx(t(this).css("border-width"));
                                                if (r > 2 && r !== e.components.convertToPx(a.borderWidth)) return t(this).blur(), void s.set({
                                                    status: "passed"
                                                });
                                                var o = t(this).css("box-shadow") && "none" !== t(this).css("box-shadow") ? t(this).css("box-shadow").match(/(-?\d+px)|(rgb\(.+\))/g) : !1;
                                                return o && t(this).css("box-shadow") !== a.boxShadow && e.components.convertToPx(o[3]) > 3 ? (t(this).blur(), void s.set({
                                                    status: "passed"
                                                })) : (t(this).blur(), void s.set({
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.formWithRequiredLabel = function(e, n, i) {
                                            var s, a = e.strings.redundant,
                                                r = !1;
                                            a.required[a.required.indexOf("*")] = /\*/g, n.get("$scope").each(function() {
                                                var o = t(this);
                                                o.find("label").each(function() {
                                                    var o = t(this).text().toLowerCase(),
                                                        c = t(this),
                                                        u = n.add(i({
                                                            element: this,
                                                            expected: function(t) {
                                                                return e.components.resolveExpectation(t);
                                                            }(this)
                                                        }));
                                                    for (var l in a.required) o.search(l) >= 0 && !n.get("$scope").find("#" + c.attr("for")).attr("aria-required") && u.set({
                                                        status: "failed"
                                                    });
                                                    r = c.css("color") + c.css("font-weight") + c.css("background-color"), s && r !== s && u.set({
                                                        status: "failed"
                                                    }), s = r, "undefined" == typeof u.get("status") && u.set({
                                                        status: "passed"
                                                    })
                                                })
                                            })
                                        }, e.headerTextIsTooLong = function(e, n, i) {
                                            var s = 128;
                                            n.get("$scope").find("h1, h2, h3, h4, h5, h6").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: t(this).text().replace(/^\s+|\s+$/gm, "").length > s ? "failed" : "passed"
                                                });
                                                n.add(e)
                                            })
                                        }, e.headersAttrRefersToATableCell = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                var e = this,
                                                    s = i({
                                                        element: e,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                n.add(s);
                                                var a = t(e).find("th[headers], td[headers]");
                                                return 0 === a.length ? void s.set({
                                                    status: "inapplicable"
                                                }) : void a.each(function() {
                                                    var n = t(this).attr("headers").split(/\s+/);
                                                    t.each(n, function(n, i) {
                                                        return "" === i || t(e).find("th#" + i + ",td#" + i).length > 0 ? void s.set({
                                                            status: "passed"
                                                        }) : void s.set({
                                                            status: "failed"
                                                        })
                                                    })
                                                })
                                            })
                                        }, e.headersUseToMarkSections = function(e, n, i) {
                                            n.get("$scope").find("p").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var s = t(this);
                                                s.find("strong:first, em:first, i:first, b:first").each(function() {
                                                    e.set({
                                                        status: s.text().trim() === t(this).text().trim() ? "failed" : "passed"
                                                    })
                                                })
                                            }), n.get("$scope").find("ul, ol").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var s = t(this);
                                                if (s.prevAll(":header").length || s.find("li").length !== s.find("li:has(a)").length) return void e.set({
                                                    status: "passed"
                                                });
                                                var a = !0;
                                                s.find("li:has(a)").each(function() {
                                                    t(this).text().trim() !== t(this).find("a:first").text().trim() && (a = !1)
                                                }), a && e.set({
                                                    status: "failed"
                                                })
                                            })
                                        }, e.headersUsedToIndicateMainContent = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                var s = t(this),
                                                    a = e.components.content.findContent(s);
                                                n.add(i("undefined" == typeof a || 0 !== a.find(":header").length && a.find(e.textSelector).first().is(":header") ? {
                                                    element: a.get(0),
                                                    expected: a.closest(".quail-test").data("expected"),
                                                    status: "passed"
                                                } : {
                                                    element: a.get(0),
                                                    expected: a.closest(".quail-test").data("expected"),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.idRefHasCorrespondingId = function(e, n, i) {
                                            n.get("$scope").find("label[for], *[aria-activedescendant]").each(function() {
                                                var e = t(this),
                                                    s = i({
                                                        element: this,
                                                        expected: e.closest(".quail-test").data("expected")
                                                    });
                                                n.add(s);
                                                var a = e.attr("for") || e.attr("aria-activedescendant");
                                                s.set(0 === n.get("$scope").find("#" + a).length ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.idrefsHasCorrespondingId = function(e, n, i) {
                                            function s(e) {
                                                var n = [],
                                                    i = ["headers", "aria-controls", "aria-describedby", "aria-flowto", "aria-labelledby", "aria-owns"];
                                                return t.each(i, function(t, i) {
                                                    var s = e.attr(i);
                                                    return "undefined" != typeof s && s !== !1 ? void(n = s) : void 0
                                                }), n.split(/\s+/)
                                            }
                                            n.get("$scope").each(function() {
                                                var e = t(this).find("td[headers], th[headers], [aria-controls], [aria-describedby], [aria-flowto], [aria-labelledby], [aria-owns]");
                                                return 0 === e.length ? void n.add(i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: "inapplicable"
                                                })) : void e.each(function() {
                                                    var e = this,
                                                        a = n.add(i({
                                                            element: this,
                                                            expected: t(this).closest(".quail-test").data("expected")
                                                        })),
                                                        r = s(t(e)),
                                                        o = "passed";
                                                    t.each(r, function(e, n) {
                                                        return "" !== n && 0 === t("#" + n).length ? void(o = "failed") : void 0
                                                    }), a.set({
                                                        status: o
                                                    })
                                                })
                                            })
                                        }, e.imgAltIsDifferent = function(e, n, i) {
                                            n.get("$scope").find("img:not([src])").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: "inapplicable"
                                                });
                                                n.add(e)
                                            }), n.get("$scope").find("img[alt][src]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(t(this).attr("src") === t(this).attr("alt") || t(this).attr("src").split("/").pop() === t(this).attr("alt") ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.imgAltIsTooLong = function(e, n, i) {
                                            n.get("$scope").find("img[alt]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set({
                                                    status: t(this).attr("alt").length > 100 ? "failed" : "passed"
                                                })
                                            })
                                        }, e.imgAltNotEmptyInAnchor = function(e, n, i) {
                                            n.get("$scope").find("a[href]:has(img)").each(function() {
                                                var s = t(this),
                                                    a = s.text(),
                                                    r = i({
                                                        element: this,
                                                        expected: s.closest(".quail-test").data("expected")
                                                    });
                                                n.add(r), s.find("img[alt]").each(function() {
                                                    a += " " + t(this).attr("alt")
                                                }), r.set(e.isUnreadable(a) ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.imgAltTextNotRedundant = function(e, n, i) {
                                            var s = {};
                                            n.get("$scope").find("img[alt]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), "undefined" == typeof s[t(this).attr("alt")] ? s[t(this).attr("alt")] = t(this).attr("src") : e.set(s[t(this).attr("alt")] !== t(this).attr("src") ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.imgGifNoFlicker = function(e, n, i) {
                                            n.get("$scope").find('img[src$=".gif"]').each(function() {
                                                var e = t(this),
                                                    s = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                n.add(s), t.ajax({
                                                    url: e.attr("src"),
                                                    dataType: "text",
                                                    success: function(t) {
                                                        s.set(-1 !== t.search("NETSCAPE2.0") ? {
                                                            status: "failed"
                                                        } : {
                                                            status: "inapplicable"
                                                        })
                                                    }
                                                })
                                            })
                                        }, e.imgHasLongDesc = function(e, n, i) {
                                            n.get("$scope").find("img[longdesc]").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s), s.set(t(this).attr("longdesc") !== t(this).attr("alt") && e.validURL(t(this).attr("longdesc")) ? {
                                                    status: "passed"
                                                } : {
                                                    status: "failed"
                                                })
                                            })
                                        }, e.imgImportantNoSpacerAlt = function(e, n, i) {
                                            n.get("$scope").find("img[alt]").each(function() {
                                                var s = t(this).width() ? t(this).width() : parseInt(t(this).attr("width"), 10),
                                                    a = t(this).height() ? t(this).height() : parseInt(t(this).attr("height"), 10),
                                                    r = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                n.add(r), r.set(e.isUnreadable(t(this).attr("alt").trim()) && t(this).attr("alt").length > 0 && s > 50 && a > 50 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.imgMapAreasHaveDuplicateLink = function(e, n, i) {
                                            var s = {};
                                            n.get("$scope").find("a").each(function() {
                                                s[t(this).attr("href")] = t(this).attr("href")
                                            }), n.get("$scope").find("img[usemap]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var a = t(this),
                                                    r = n.get("$scope").find(a.attr("usemap"));
                                                r.length || (r = n.get("$scope").find('map[name="' + a.attr("usemap").replace("#", "") + '"]')), r.length ? r.find("area").each(function() {
                                                    e.set("undefined" == typeof s[t(this).attr("href")] ? {
                                                        status: "failed"
                                                    } : {
                                                        status: "passed"
                                                    })
                                                }) : e.set({
                                                    status: "inapplicable"
                                                })
                                            })
                                        }, e.imgNonDecorativeHasAlt = function(e, n, i) {
                                            n.get("$scope").find("img[alt]").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s), s.set(e.isUnreadable(t(this).attr("alt")) && (t(this).width() > 100 || t(this).height() > 100) ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.imgWithMathShouldHaveMathEquivalent = function(e, n, i) {
                                            n.get("$scope").find("img:not(img:has(math), img:has(tagName))").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), t(this).parent().find("math").length || e.set({
                                                    status: "failed"
                                                })
                                            })
                                        }, e.inputCheckboxRequiresFieldset = function(e, n, i) {
                                            n.get("$scope").find(":checkbox").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(t(this).parents("fieldset").length ? {
                                                    status: "passed"
                                                } : {
                                                    status: "failed"
                                                })
                                            })
                                        }, e.inputImageAltIsNotFileName = function(e, n, i) {
                                            n.get("$scope").find("input[type=image][alt]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(t(this).attr("src") === t(this).attr("alt") ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.inputImageAltIsShort = function(e, n, i) {
                                            n.get("$scope").find("input[type=image]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(t(this).attr("alt").length > 100 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.inputImageAltNotRedundant = function(e, n, i) {
                                            n.get("$scope").find("input[type=image][alt]").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s), s.set(e.strings.redundant.inputImage.indexOf(e.cleanString(t(this).attr("alt"))) > -1 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.inputWithoutLabelHasTitle = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                var s = t(this).find("input, select, textarea");
                                                if (0 === s.length) {
                                                    var a = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected"),
                                                        status: "inapplicable"
                                                    });
                                                    return void n.add(a)
                                                }
                                                s.each(function() {
                                                    var s = i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    });
                                                    return n.add(s), "none" === t(this).css("display") ? void s.set({
                                                        status: "inapplicable"
                                                    }) : void s.set(n.get("$scope").find("label[for=" + t(this).attr("id") + "]").length || t(this).attr("title") && !e.isUnreadable(t(this).attr("title")) ? {
                                                        status: "passed"
                                                    } : {
                                                        status: "failed"
                                                    })
                                                })
                                            })
                                        }, e.labelMustBeUnique = function(e, n, i) {
                                            var s = {};
                                            n.get("$scope").find("label[for]").each(function() {
                                                "undefined" == typeof s[t(this).attr("for")] && (s[t(this).attr("for")] = 0), s[t(this).attr("for")]++
                                            }), n.get("$scope").find("label[for]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: 1 === s[t(this).attr("for")] ? "passed" : "failed"
                                                });
                                                n.add(e)
                                            })
                                        }, e.labelsAreAssignedToAnInput = function(e, n, i) {
                                            n.get("$scope").find("label").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(t(this).attr("for") && n.get("$scope").find("#" + t(this).attr("for")).length && n.get("$scope").find("#" + t(this).attr("for")).is(":input") ? {
                                                    status: "passed"
                                                } : {
                                                    status: "failed"
                                                })
                                            })
                                        }, e.languageChangesAreIdentified = function(e, n, i) {
                                            var s, a, r, o, c, u, l = n.get("$scope"),
                                                d = e.components.language.getDocumentLanguage(l, !0),
                                                h = function(n, i, s, a) {
                                                    var r, o = n.find("[lang=" + i + "]");
                                                    return 0 === o.length ? !0 : (s = s.length, o.each(function() {
                                                        r = e.getTextContents(t(this)).match(a), r && (s -= r.length)
                                                    }), s > 0)
                                                },
                                                p = function(t) {
                                                    return t.attr("lang") ? t.attr("lang").trim().toLowerCase().split("-")[0] : t.parents("[lang]").length ? t.parents("[lang]:first").attr("lang").trim().toLowerCase().split("-")[0] : e.components.language.getDocumentLanguage(l, !0)
                                                };
                                            l.find(e.textSelector).each(function() {
                                                c = this, o = t(this), d = p(o), s = e.getTextContents(o), u = !1,
                                                    t.each(e.components.language.scriptSingletons, function(t, a) {
                                                        t !== d && (r = s.match(a), r && r.length && h(o, t, r, a) && (n.add(i({
                                                            element: c,
                                                            expected: function(t) {
                                                                return e.components.resolveExpectation(t)
                                                            }(c),
                                                            info: {
                                                                language: t
                                                            },
                                                            status: "failed"
                                                        })), u = !0))
                                                    }), t.each(e.components.language.scripts, function(t, l) {
                                                        -1 === l.languages.indexOf(d) && (r = s.match(l.regularExpression), r && r.length && h(o, t, r, a) && (n.add(i({
                                                            element: c,
                                                            expected: function(t) {
                                                                return e.components.resolveExpectation(t)
                                                            }(c),
                                                            info: {
                                                                language: t
                                                            },
                                                            status: "failed"
                                                        })), u = !0))
                                                    }), "undefined" != typeof guessLanguage && !o.find("[lang]").length && o.text().trim().length > 400 && guessLanguage.info(o.text(), function(t) {
                                                        t[0] !== d && (n.add(i({
                                                            element: c,
                                                            expected: function(t) {
                                                                return e.components.resolveExpectation(t)
                                                            }(c),
                                                            info: {
                                                                language: t[0]
                                                            },
                                                            status: "failed"
                                                        })), u = !0)
                                                    }), u || n.add(i({
                                                        element: c,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(c),
                                                        status: "passed"
                                                    }))
                                            })
                                        }, e.languageDirAttributeIsUsed = function(e, n, i) {
                                            function s() {
                                                var s = t(this),
                                                    r = s.attr("dir");
                                                if (!r) {
                                                    var o = s.closest("[dir]").attr("dir");
                                                    r = o || r
                                                }
                                                "string" == typeof r && (r = r.toLowerCase()), "undefined" == typeof a[r] && (r = "ltr");
                                                var c = "ltr" === r ? "rtl" : "ltr",
                                                    u = e.getTextContents(s),
                                                    l = u.match(a[c]);
                                                if (l) {
                                                    var d = l.length;
                                                    s.find("[dir=" + c + "]").each(function() {
                                                        var t = s[0].textContent.match(a[c]);
                                                        t && (d -= t.length)
                                                    });
                                                    var h = n.add(i({
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this)
                                                    }));
                                                    h.set({
                                                        status: d > 0 ? "failed" : "passed"
                                                    })
                                                }
                                            }
                                            var a = e.components.language.textDirection;
                                            n.get("$scope").each(function() {
                                                t(this).find(e.textSelector).each(s)
                                            })
                                        }, e.languageDirectionPunctuation = function(e, n, i) {
                                            var s = n.get("$scope"),
                                                a = {},
                                                r = /[\u2000-\u206F]|[!"#$%&'\(\)\]\[\*+,\-.\/:;<=>?@^_`{|}~]/gi,
                                                o = s.attr("dir") ? s.attr("dir").toLowerCase() : "ltr",
                                                c = "ltr" === o ? "rtl" : "ltr",
                                                u = e.components.language.textDirection;
                                            s.each(function() {
                                                var s = t(this);
                                                s.find(e.textSelector).each(function() {
                                                    var s = t(this);
                                                    o = s.attr("dir") ? s.attr("dir").toLowerCase() : s.parent("[dir]").first().attr("dir") ? s.parent("[dir]").first().attr("dir").toLowerCase() : o, "undefined" == typeof u[o] && (o = "ltr"),
                                                        c = "ltr" === o ? "rtl" : "ltr";
                                                    var l = e.getTextContents(s),
                                                        d = l.match(u[c]),
                                                        h = n.add(i({
                                                            element: this,
                                                            expected: function(t) {
                                                                return e.components.resolveExpectation(t)
                                                            }(this)
                                                        }));
                                                    if (!d) return void h.set({
                                                        status: "inapplicable"
                                                    });
                                                    for (var p = l.search(u[c]), f = l.lastIndexOf(d.pop()); a = r.exec(l);)
                                                        if (a.index === p - 1 || a.index === f + 1) return void h.set({
                                                            status: "failed"
                                                        });
                                                    h.set({
                                                        status: "passed"
                                                    })
                                                })
                                            })
                                        }, e.languageUnicodeDirection = function(e, n, i) {
                                            var s = n.get("$scope"),
                                                a = e.components.language.textDirection,
                                                r = e.components.language.textDirectionChanges;
                                            s.each(function() {
                                                var s = t(this);
                                                s.find(e.textSelector).each(function() {
                                                    var s = n.add(i({
                                                            element: this,
                                                            expected: function(t) {
                                                                return e.components.resolveExpectation(t)
                                                            }(this)
                                                        })),
                                                        o = t(this),
                                                        c = o.text().trim(),
                                                        u = -1 !== c.substr(0, 1).search(a.ltr) ? "rtl" : "ltr";
                                                    s.set(-1 === c.search(a[u]) ? {
                                                        status: "inapplicable"
                                                    } : -1 !== c.search(r[u]) ? {
                                                        status: "passed"
                                                    } : {
                                                        status: "failed"
                                                    })
                                                })
                                            })
                                        }, e.linkHasAUniqueContext = function(e, n, i) {
                                            function s(e) {
                                                for (var n = t(e), i = n, s = a(n.text()); !i.is("body, html") && -1 === u.indexOf(i.css("display"));) i = i.parent();
                                                var r = i.text().match(/[^\.!\?]+[\.!\?]+/g);
                                                null === r && (r = [i.text()]);
                                                for (var o = 0; o < r.length; o += 1)
                                                    if (-1 !== a(r[o]).indexOf(s)) return r[o].trim()
                                            }

                                            function a(t) {
                                                var e = t.match(/\w+/g);
                                                return null !== e && (t = e.join(" ")), t.toLowerCase()
                                            }

                                            function r(t, e) {
                                                return a("" + t) !== a("" + e)
                                            }

                                            function o(e, n) {
                                                if (e.href === n.href) return !1;
                                                if (r(e.title, n.title)) return !1;
                                                var i = t(e).closest("p, li, dd, dt, td, th"),
                                                    o = t(n).closest("p, li, dd, dt, td, th");
                                                if (0 !== i.length && 0 !== o.length && r(c(i), c(o))) return !1;
                                                if (i.is("td, th") && !o.is("td, th")) return !1;
                                                if (i.is("td, th") && o.is("td, th")) {
                                                    var u = !1,
                                                        l = [];
                                                    if (i.tableHeaders().each(function() {
                                                            l.push(a(t(this).text()))
                                                        }), o.tableHeaders().each(function() {
                                                            var e = a(t(this).text()),
                                                                n = l.indexOf(e); - 1 === n ? u = !0 : l.splice(n, 1)
                                                        }), u || l.length > 0) return !1
                                                }
                                                return r(s(e), s(n)) ? !1 : !0
                                            }

                                            function c(t) {
                                                var e = t.text();
                                                return t.find("img[alt]").each(function() {
                                                    e += " " + this.alt.trim()
                                                }), a(e)
                                            }
                                            var u = ["block", "flex", "list-item", "table", "table-caption", "table-cell"];
                                            n.get("$scope").each(function() {
                                                var e = t(this),
                                                    s = e.find("a[href]:visible"),
                                                    a = {};
                                                if (0 === s.length) {
                                                    var r = i({
                                                        element: this,
                                                        status: "inapplicable",
                                                        expected: e.closest(".quail-test").data("expected")
                                                    });
                                                    n.add(r)
                                                }
                                                s.each(function() {
                                                    var e = c(t(this));
                                                    "undefined" == typeof a[e] && (a[e] = []), a[e].push(this)
                                                }), t.each(a, function(e, s) {
                                                    for (; s.length > 1;) {
                                                        for (var a = s.pop(), r = !1, c = s.length - 1; c >= 0; c -= 1) {
                                                            var u = s[c];
                                                            o(a, u) && (r = !0, s.splice(c, 1), n.add(i({
                                                                element: u,
                                                                status: "failed",
                                                                expected: t(u).closest(".quail-test").data("expected")
                                                            })))
                                                        }
                                                        n.add(i({
                                                            element: a,
                                                            status: r ? "failed" : "passed",
                                                            expected: t(a).closest(".quail-test").data("expected")
                                                        }))
                                                    }
                                                    1 === s.length && n.add(i({
                                                        element: s[0],
                                                        status: "passed",
                                                        expected: t(s[0]).closest(".quail-test").data("expected")
                                                    }))
                                                })
                                            })
                                        }, e.listNotUsedForFormatting = function(e, n, i) {
                                            n.get("$scope").find("ol, ul").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(t(this).find("li").length < 2 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.listOfLinksUseList = function(e, n, i) {
                                            var s = /(♦|›|»|‣|▶|.|◦|>|✓|◽|•|—|◾|\||\*|&bull;|&#8226;)/g;
                                            n.get("$scope").find("a").each(function() {
                                                var a = n.add(i({
                                                        element: this
                                                    })),
                                                    r = t(this).closest(".quail-test").data("expected");
                                                if (t(this).next("a").length) {
                                                    var o = t(this).get(0).nextSibling.wholeText.replace(s, "");
                                                    a.set(!t(this).parent("li").length && e.isUnreadable(o) ? {
                                                        expected: r,
                                                        status: "failed"
                                                    } : {
                                                        expected: r,
                                                        status: "passed"
                                                    })
                                                }
                                            })
                                        }, e.newWindowIsOpened = function(e, n, i) {
                                            var s, a = window.open;
                                            window.open = function(t) {
                                                n.each(function(e, n) {
                                                    var i = n.get("element").href;
                                                    i.indexOf(t) > -1 && n.set("status", "failed")
                                                })
                                            }, n.get("$scope").find("a").each(function() {
                                                s = i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this)
                                                }), n.add(s), t(this).trigger("click")
                                            }), window.open = a
                                        }, e.pNotUsedAsHeader = function(e, n, i) {
                                            n.get("$scope").find("p").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s), t(this).text().search(".") >= 1 && s.set({
                                                    status: "inapplicable"
                                                });
                                                var a = !1;
                                                if (t(this).text().search(".") < 1) {
                                                    var r = t(this),
                                                        o = r.prev("p");
                                                    t.each(e.suspectPHeaderTags, function(e, n) {
                                                        r.find(n).length && r.find(n).each(function() {
                                                            t(this).text().trim() === r.text().trim() && (s.set({
                                                                status: "failed"
                                                            }), a = !0)
                                                        })
                                                    }), o.length && t.each(e.suspectPCSSStyles, function(t, e) {
                                                        return r.css(e) !== o.css(e) ? (s.set({
                                                            status: "failed"
                                                        }), a = !0, !1) : void 0
                                                    }), "bold" === r.css("font-weight") && (s.set({
                                                        status: "failed"
                                                    }), a = !0)
                                                }
                                                a || s.set({
                                                    status: "passed"
                                                })
                                            })
                                        }, e.paragraphIsWrittenClearly = function(e, n, i) {
                                            n.get("$scope").find("p").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s);
                                                var a = e.components.textStatistics.cleanText(t(this).text());
                                                s.set(Math.round(206.835 - 1.015 * e.components.textStatistics.averageWordsPerSentence(a) - 84.6 * e.components.textStatistics.averageSyllablesPerWord(a)) < 60 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.preShouldNotBeUsedForTabularLayout = function(e, n, i) {
                                            n.get("$scope").find("pre").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var s = t(this).text().split(/[\n\r]+/);
                                                e.set({
                                                    status: s.length > 1 && t(this).text().search(/\t/) > -1 ? "failed" : "passed"
                                                })
                                            })
                                        }, e.scriptFocusIndicatorVisible = function() {
                                            e.html.find(e.focusElements).each(function() {
                                                var n, i, s, a;
                                                s = [];
                                                for (var r = 0, o = document.styleSheets.length; o > r; ++r) {
                                                    n = document.styleSheets[r], i = n.cssRules || n.rules;
                                                    for (var c = i.length - 1; c >= 0; --c) a = i[c], a.selectorText && -1 !== a.selectorText.indexOf(":focus") && (s.push({
                                                        css: a.cssText,
                                                        index: c,
                                                        sheet: r
                                                    }), n.deleteRule(c))
                                                }
                                                var u = {
                                                    borderWidth: t(this).css("border-width"),
                                                    borderColor: t(this).css("border-color"),
                                                    backgroundColor: t(this).css("background-color"),
                                                    boxShadow: t(this).css("box-shadow"),
                                                    outlineWidth: t(this).css("outline-width"),
                                                    outlineColor: t(this).css("outline-color")
                                                };
                                                t(this).focus();
                                                var l = e.components.convertToPx(t(this).css("outline-width"));
                                                if (l > 2 && l !== e.components.convertToPx(u.outlineWidth)) return void t(this).blur();
                                                if (u.backgroundColor !== t(this).css("background-color")) return void t(this).blur();
                                                var d = e.components.convertToPx(t(this).css("border-width"));
                                                if (d > 2 && d !== e.components.convertToPx(u.borderWidth)) return void t(this).blur();
                                                var h = t(this).css("box-shadow") && "none" !== t(this).css("box-shadow") ? t(this).css("box-shadow").match(/(-?\d+px)|(rgb\(.+\))/g) : !1;
                                                if (h && t(this).css("box-shadow") !== u.boxShadow && e.components.convertToPx(h[3]) > 3) return void t(this).blur();
                                                t(this).blur();
                                                for (var p, f = s.length - 1; f >= 0; --r) p = s[f], document.styleSheets[p.sheet].insertRule(p.css, p.index);
                                                e.testFails("scriptFocusIndicatorVisible", t(this))
                                            })
                                        }, e.selectJumpMenu = function(e, n, i) {
                                            var s = n.get("$scope");
                                            0 !== s.find("select").length && s.find("select").each(function() {
                                                n.add(i(0 === t(this).parent("form").find(":submit").length && e.components.hasEventListener(t(this), "change") ? {
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: "failed"
                                                } : {
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected"),
                                                    status: "passed"
                                                }))
                                            })
                                        }, e.siteMap = function(e, n, i) {
                                            var s = !0,
                                                a = i({
                                                    element: n.get("$scope").get(0),
                                                    expected: n.get("$scope").data("expected")
                                                });
                                            n.add(a), n.get("$scope").find("a").each(function() {
                                                if ("passed" !== a.get("status")) {
                                                    var n = t(this).text().toLowerCase();
                                                    return t.each(e.strings.siteMap, function(t, e) {
                                                        return n.search(e) > -1 ? void(s = !1) : void 0
                                                    }), s === !1 ? void a.set({
                                                        status: "failed"
                                                    }) : void(s && a.set({
                                                        status: "passed"
                                                    }))
                                                }
                                            })
                                        }, e.skipToContentLinkProvided = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                var s = t(this),
                                                    a = !1;
                                                s.find('a[href*="#"]').each(function() {
                                                    if (!a)
                                                        for (var r = t(this), o = r.attr("href").split("#").pop(), c = s.find("#" + o), u = e.strings.skipContent.slice(); !a && u.length;) {
                                                            var l = u.pop();
                                                            if (r.text().search(l) > -1 && c.length) {
                                                                if (r.focus(), r.is(":visible") && "hidden" !== r.css("visibility")) return a = !0, void n.add(i({
                                                                    element: r.get(0),
                                                                    expected: r.closest(".quail-test").data("expected"),
                                                                    status: "passed"
                                                                }));
                                                                r.blur()
                                                            }
                                                        }
                                                }), a || n.add(i({
                                                    expected: s.data("expected") || s.find("[data-expected]").data("expected"),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.tabIndexFollowsLogicalOrder = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                var s = t(this),
                                                    a = 0;
                                                s.find("[tabindex]").each(function() {
                                                    var s = t(this),
                                                        r = s.attr("tabindex");
                                                    n.add(i(parseInt(r, 10) >= 0 && parseInt(r, 10) !== a + 1 ? {
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this),
                                                        status: "failed"
                                                    } : {
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this),
                                                        status: "passed"
                                                    })), a++
                                                })
                                            })
                                        }, e.tableAxisHasCorrespondingId = function(e, n, i) {
                                            n.get("$scope").find("[axis]").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(0 === t(this).parents("table").first().find("th#" + t(this).attr("axis")).length ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.tableHeaderLabelMustBeTerse = function(e, n, i) {
                                            n.get("$scope").find("th, table tr:first td").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e), e.set(t(this).text().length > 20 && (!t(this).attr("abbr") || t(this).attr("abbr").length > 20) ? {
                                                    status: "failed"
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.tableLayoutDataShouldNotHaveTh = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                var s = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(s), s.set(0 !== t(this).find("th").length ? e.isDataTable(t(this)) ? {
                                                    status: "passed"
                                                } : {
                                                    status: "failed"
                                                } : {
                                                    status: "inapplicable"
                                                })
                                            })
                                        }, e.tableLayoutHasNoCaption = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                n.add(i(t(this).find("caption").length ? e.isDataTable(t(this)) ? {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "passed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "inapplicable"
                                                }))
                                            })
                                        }, e.tableLayoutHasNoSummary = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                var s = t(this);
                                                s.find("table[summary]").each(function() {
                                                    var s = n.add(i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected")
                                                    }));
                                                    s.set(e.isDataTable(t(this)) || e.isUnreadable(t(this).attr("summary")) ? {
                                                        status: "passed"
                                                    } : {
                                                        status: "failed"
                                                    })
                                                })
                                            })
                                        }, e.tableLayoutMakesSenseLinearized = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                e.isDataTable(t(this)) || n.add(i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t);
                                                    }(this),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.tableNotUsedForLayout = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                n.add(i(e.isDataTable(t(this)) ? {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "passed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.tableShouldUseHeaderIDs = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                var s = t(this),
                                                    a = !1;
                                                e.isDataTable(s) && (s.find("th").each(function() {
                                                    a || t(this).attr("id") || (a = !0, n.add(i({
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this),
                                                        status: "failed"
                                                    })))
                                                }), a || s.find("td[header]").each(function() {
                                                    a || t.each(t(this).attr("header").split(" "), function(t, r) {
                                                        s.find("#" + r).length || (a = !0, n.add(i({
                                                            element: this,
                                                            expected: function(t) {
                                                                return e.components.resolveExpectation(t)
                                                            }(this),
                                                            status: "failed"
                                                        })))
                                                    })
                                                }))
                                            })
                                        }, e.tableSummaryDoesNotDuplicateCaption = function(e, n, i) {
                                            n.get("$scope").find("table[summary]:has(caption)").each(function() {
                                                n.add(i(e.cleanString(t(this).attr("summary")) === e.cleanString(t(this).find("caption:first").text()) ? {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "passed"
                                                }))
                                            })
                                        }, e.tableSummaryIsNotTooLong = function(e, n, i) {
                                            n.get("$scope").find("table[summary]").each(function() {
                                                t(this).attr("summary").trim().length > 100 && n.add(i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.tableUseColGroup = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                e.isDataTable(t(this)) && !t(this).find("colgroup").length && n.add(i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.tableUsesAbbreviationForHeader = function(e, n, i) {
                                            n.get("$scope").find("th:not(th[abbr])").each(function() {
                                                t(this).text().length > 20 && n.add(i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t);
                                                    }(this),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.tableUsesScopeForRow = function(e, n, i) {
                                            n.get("$scope").find("table").each(function() {
                                                t(this).find("td:first-child").each(function() {
                                                    var s = t(this).next("td");
                                                    ("bold" === t(this).css("font-weight") && "bold" !== s.css("font-weight") || t(this).find("strong").length && !s.find("strong").length) && n.add(i({
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this),
                                                        status: "failed"
                                                    }))
                                                }), t(this).find("td:last-child").each(function() {
                                                    var s = t(this).prev("td");
                                                    ("bold" === t(this).css("font-weight") && "bold" !== s.css("font-weight") || t(this).find("strong").length && !s.find("strong").length) && n.add(i({
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this),
                                                        status: "failed"
                                                    }))
                                                })
                                            })
                                        }, e.tableWithMoreHeadersUseID = function(e, n, i) {
                                            n.get("$scope").find("table:has(th)").each(function() {
                                                var s = t(this),
                                                    a = 0;
                                                s.find("tr").each(function() {
                                                    t(this).find("th").length && a++, a > 1 && !t(this).find("th[id]").length && n.add(i({
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t);
                                                        }(this),
                                                        status: "failed"
                                                    }))
                                                })
                                            })
                                        }, e.tabularDataIsInTable = function(e, n, i) {
                                            n.get("$scope").find("pre").each(function() {
                                                n.add(i(t(this).html().search("	") >= 0 ? {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "passed"
                                                }))
                                            })
                                        }, e.tagsAreNestedCorrectly = function(t, e, n) {
                                            t.components.htmlSource.getHtml(function(i) {
                                                var s = t.components.htmlTagValidator(i),
                                                    a = n({
                                                        expected: e.get("$scope").filter(".quail-test").eq(0).data("expected")
                                                    });
                                                e.add(a), a.set(s ? {
                                                    status: "failed",
                                                    html: s
                                                } : {
                                                    status: "passed"
                                                })
                                            })
                                        }, e.textIsNotSmall = function(e, n, i) {
                                            n.get("$scope").find(e.textSelector).each(function() {
                                                var s = t(this).css("font-size");
                                                s.search("em") > 0 && (s = e.components.convertToPx(s)), s = parseInt(s.replace("px", ""), 10), n.add(i(10 > s ? {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this),
                                                    status: "failed"
                                                } : {
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t);
                                                    }(this),
                                                    status: "passed"
                                                }))
                                            })
                                        }, e.userInputMayBeRequired = function(e, n, i) {
                                            n.get("$scope").each(function() {
                                                var e = i({
                                                    element: this,
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                });
                                                n.add(e);
                                                var s = t(this).find("form"),
                                                    a = 0,
                                                    r = t(this).find("input:not(form input, [type=button],[type=reset],[type=image],[type=submit],[type=hidden])");
                                                return s.each(function() {
                                                    var e = t(this).find("input:not([type=button],[type=reset],[type=image],[type=submit],[type=hidden])");
                                                    e.length > 1 && (a = e.length)
                                                }), a > 0 ? void e.set({
                                                    status: "cantTell"
                                                }) : r.length > 1 ? void e.set({
                                                    status: "cantTell"
                                                }) : void e.set({
                                                    status: "inapplicable"
                                                })
                                            })
                                        }, e.videoMayBePresent = function(e, n, i) {
                                            var s = ["webm", "flv", "ogv", "ogg", "avi", "mov", "qt", "wmv", "asf", "mp4", "m4p", "m4v", "mpg", "mp2", "mpeg", "mpg", "mpe", "mpv", "m2v", "3gp", "3g2"],
                                                a = ["//www.youtube.com/embed/", "//player.vimeo.com/video/"];
                                            n.get("$scope").each(function() {
                                                var e = t(this),
                                                    r = !1;
                                                e.find("object, video").each(function() {
                                                    r = !0, n.add(i({
                                                        element: this,
                                                        expected: t(this).closest(".quail-test").data("expected"),
                                                        status: "cantTell"
                                                    }))
                                                }), e.find("a[href]").each(function() {
                                                    var e = t(this),
                                                        a = e.attr("href").split(".").pop(); - 1 !== t.inArray(a, s) && (r = !0, n.add(i({
                                                        element: this,
                                                        expected: e.closest(".quail-test").data("expected"),
                                                        status: "cantTell"
                                                    })))
                                                }), e.find("iframe").each(function() {
                                                    (-1 !== this.src.indexOf(a[0]) || -1 !== this.src.indexOf(a[1])) && (r = !0, n.add(i({
                                                        element: this,
                                                        expected: e.closest(".quail-test").data("expected"),
                                                        status: "cantTell"
                                                    })))
                                                }), r || n.add(i({
                                                    element: this,
                                                    status: "inapplicable",
                                                    expected: t(this).closest(".quail-test").data("expected")
                                                }))
                                            })
                                        }, e.videosEmbeddedOrLinkedNeedCaptions = function(t, e, n) {
                                            t.components.video.findVideos(e.get("$scope"), function(i, s) {
                                                e.add(n(s ? {
                                                    element: i[0],
                                                    expected: function(e) {
                                                        return t.components.resolveExpectation(e)
                                                    }(i),
                                                    status: "passed"
                                                } : {
                                                    element: i[0],
                                                    expected: function(e) {
                                                        return t.components.resolveExpectation(e)
                                                    }(i),
                                                    status: "failed"
                                                }))
                                            })
                                        }, e.whiteSpaceInWord = function(e, n, i) {
                                            var s, a;
                                            n.get("$scope").find(e.textSelector).each(function() {
                                                a = t(this).text() ? t(this).text().match(/[^\s\\]/g) : !1,
                                                    s = t(this).text() ? t(this).text().match(/[^\s\\]\s[^\s\\]/g) : !1, n.add(i(a && s && s.length > 3 && s.length >= a.length / 2 - 2 ? {
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this),
                                                        status: "failed"
                                                    } : {
                                                        element: this,
                                                        expected: function(t) {
                                                            return e.components.resolveExpectation(t)
                                                        }(this),
                                                        status: "passed"
                                                    }))
                                            })
                                        }, e.whiteSpaceNotUsedForFormatting = function(e, n, i) {
                                            n.get("$scope").find(e.textSelector).each(function() {
                                                var s = n.add(i({
                                                    element: this,
                                                    expected: function(t) {
                                                        return e.components.resolveExpectation(t)
                                                    }(this)
                                                }));
                                                if (0 === t(this).find("br").length) return void s.set({
                                                    status: "passed"
                                                });
                                                var a = t(this).html().toLowerCase().split(/(<br\ ?\/?>)+/),
                                                    r = 0;
                                                t.each(a, function(t, e) {
                                                    -1 !== e.search(/(\s|\&nbsp;){2,}/g) && r++
                                                }), s.set(r > 1 ? {
                                                    status: "failed"
                                                } : {
                                                    status: "cantTell"
                                                })
                                            })
                                        }, e.lib.Case = function() {
                                            function e(t) {
                                                return new e.fn.init(t)
                                            }
                                            return e.fn = e.prototype = {
                                                constructor: e,
                                                init: function(t) {
                                                    this.listeners = {}, this.timeout = null, this.attributes = t || {};
                                                    var e = this;
                                                    return this.attributes.status && "untested" !== this.attributes.status ? setTimeout(function() {
                                                        e.resolve()
                                                    }, 0) : (this.attributes.status = "untested", this.timeout = setTimeout(function() {
                                                        e.giveup()
                                                    }, 350)), this
                                                },
                                                attributes: null,
                                                get: function(t) {
                                                    return this.attributes[t]
                                                },
                                                set: function(t, e) {
                                                    var n = !1;
                                                    if ("object" == typeof t)
                                                        for (var i in t) t.hasOwnProperty(i) && ("status" === i && (n = !0), this.attributes[i] = t[i]);
                                                    else "status" === t && (n = !0), this.attributes[t] = e;
                                                    return n && this.resolve(), this
                                                },
                                                hasStatus: function(t) {
                                                    "object" != typeof t && (t = [t]);
                                                    for (var e = this.get("status"), n = 0, i = t.length; i > n; ++n)
                                                        if (t[n] === e) return !0;
                                                    return !1
                                                },
                                                resolve: function() {
                                                    clearTimeout(this.timeout);
                                                    var t, e = this.attributes.element;
                                                    e && e.nodeType && 1 === e.nodeType && (this.attributes.selector = this.defineUniqueSelector(e), this.attributes.html || (this.attributes.html = "", "HTML" === e.nodeName || "BODY" === e.nodeName ? this.attributes.html = "<" + e.nodeName + ">" : "string" == typeof e.outerHTML && (t = e.outerHTML.trim().replace(/(\r\n|\n|\r)/gm, "").replace(/>\s+</g, "><"), t.length > 200 && (t = t.substr(0, 200) + "... [truncated]"), this.attributes.html = t))), this.dispatch("resolve", this);
                                                },
                                                giveup: function() {
                                                    clearTimeout(this.timeout), this.attributes.status = "notTested", this.dispatch("timeout", this)
                                                },
                                                listenTo: function(t, e, n) {
                                                    n = n.bind(this), t.registerListener.call(t, e, n)
                                                },
                                                registerListener: function(t, e) {
                                                    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e)
                                                },
                                                dispatch: function(t) {
                                                    if (this.listeners[t] && this.listeners[t].length) {
                                                        var e = [].slice.call(arguments);
                                                        this.listeners[t].forEach(function(t) {
                                                            t.apply(null, e)
                                                        })
                                                    }
                                                },
                                                defineUniqueSelector: function(e) {
                                                    function n(e) {
                                                        return 1 === t(e).length
                                                    }

                                                    function i(t) {
                                                        var e = "",
                                                            n = t.id || "";
                                                        return n.length > 0 && (e = "#" + n), e
                                                    }

                                                    function s(t) {
                                                        var e = "",
                                                            n = t.className || "";
                                                        return n.length > 0 && (n = n.split(/\s+/), n = o(n, function(t) {
                                                            return /active|enabled|disabled|first|last|only|collapsed|open|clearfix|processed/.test(t)
                                                        }), n.length > 0) ? "." + n.join(".") : e
                                                    }

                                                    function a(t) {
                                                        var e, n = "",
                                                            i = ["href", "type"];
                                                        if ("undefined" == typeof t || "undefined" == typeof t.attributes || null === t.attributes) return n;
                                                        for (var s = 0, a = i.length; a > s; s++) e = t.attributes[i[s]] && t.attributes[i[s]].value,
                                                            e && (n += "[" + i[s] + '="' + e + '"]');
                                                        return n
                                                    }

                                                    function r(t) {
                                                        var e = "",
                                                            r = "",
                                                            o = !1,
                                                            c = !0;
                                                        do {
                                                            if (r = "", (r = i(t)).length > 0) {
                                                                e = r + " " + e;
                                                                break
                                                            }!o && (r = s(t)).length > 0 && (e = r + " " + e, n(e) && (o = !0)), c && ((r = a(t)).length > 0 && (e = r + e), e = t.nodeName.toLowerCase() + e, c = !1), t = t.parentNode
                                                        } while (t && 1 === t.nodeType && "BODY" !== t.nodeName && "HTML" !== t.nodeName);
                                                        return e.trim()
                                                    }

                                                    function o(t, e) {
                                                        for (var n = [], i = 0, s = t.length; s > i; i++) e.call(null, t[i]) || n.push(t[i]);
                                                        return n
                                                    }
                                                    return e && r(e)
                                                },
                                                push: [].push,
                                                sort: [].sort,
                                                concat: [].concat,
                                                splice: [].splice
                                            }, e.fn.init.prototype = e.fn, e
                                        }(), e.lib.Section = function() {
                                            function t(e, n) {
                                                return new t.fn.init(e, n)
                                            }
                                            return t.fn = t.prototype = {
                                                constructor: t,
                                                init: function(t, n) {
                                                    if (!t) return this;
                                                    if (this.id = t, n.techniques && n.techniques.length) {
                                                        for (var i = 0, s = n.techniques.length; s > i; ++i) this.push(e.lib.Technique(n.techniques[i]));
                                                        return this
                                                    }
                                                    return this
                                                },
                                                length: 0,
                                                each: function(t) {
                                                    for (var e = [].slice.call(arguments, 1), n = 0, i = this.length; i > n; ++n) e.unshift(this[n]), e.unshift(n), t.apply(this[n], e);
                                                    return this
                                                },
                                                find: function(t) {
                                                    for (var e = 0, n = this.length; n > e; ++e)
                                                        if (this[e].get("name") === t) return this[e];
                                                    return null
                                                },
                                                set: function(t, n) {
                                                    for (var i = 0, s = this.length; s > i; ++i)
                                                        if (this[i].get("name") === t) return this[i].set(n), this[i];
                                                    var a = e.lib.Test(t, n);
                                                    return this.push(a), a
                                                },
                                                addTechnique: function(t) {
                                                    this.push(t)
                                                },
                                                regiterTechniqueTestResult: function() {},
                                                push: [].push,
                                                sort: [].sort,
                                                splice: [].splice
                                            }, t.fn.init.prototype = t.fn, t
                                        }(), e.lib.SuccessCriteria = function() {
                                            function n(t) {
                                                return new n.fn.init(t)
                                            }

                                            function i(t) {
                                                return Object.keys(t).length
                                            }
                                            return n.fn = n.prototype = {
                                                constructor: n,
                                                init: function(t) {
                                                    return this.listeners = {}, this.attributes = this.attributes || {}, this.attributes.status = "untested", this.attributes.results = {}, this.attributes.totals = {}, this.set(t || {}), this
                                                },
                                                length: 0,
                                                attributes: null,
                                                get: function(e) {
                                                    if ("$scope" === e) {
                                                        var n = this.attributes.scope,
                                                            i = t(this.attributes.scope);
                                                        return this.attributes[e] ? this.attributes[e] : n ? i : t(document)
                                                    }
                                                    return this.attributes[e]
                                                },
                                                set: function(t, e) {
                                                    var n = !1;
                                                    if ("object" == typeof t)
                                                        for (var i in t) t.hasOwnProperty(i) && ("status" === i && (n = !0),
                                                            this.attributes[i] = t[i]);
                                                    else this.attributes[t] = e;
                                                    return this
                                                },
                                                each: function(t) {
                                                    for (var e = [].slice.call(arguments, 1), n = 0, i = this.length; i > n; ++n) {
                                                        e.unshift(this[n]), e.unshift(n);
                                                        var s = t.apply(this[n], e);
                                                        if (s === !1) break
                                                    }
                                                    return this
                                                },
                                                add: function(t) {
                                                    this.find(t.get("selector")) || this.push(t)
                                                },
                                                find: function(t) {
                                                    for (var e = 0, n = this.length; n > e; ++e)
                                                        if (this[e].get("selector") === t) return this[e];
                                                    return null
                                                },
                                                registerTests: function(t) {
                                                    var e = this.get("preEvaluator"),
                                                        n = "undefined" != typeof e,
                                                        i = !0;
                                                    n && (i = e.call(this, t)), i || this.set("status", "inapplicable"), this.set("tests", t), this.listenTo(t, "complete", this.evaluate)
                                                },
                                                filterTests: function(t) {
                                                    var n = new e.lib.TestCollection,
                                                        i = this.get("name");
                                                    if (!i) throw new Error("Success Criteria instances require a name in order to have tests filtered.");
                                                    var s = i.split(":")[1];
                                                    return t.each(function(t, e) {
                                                        var i = e.getGuidelineCoverage("wcag");
                                                        for (var a in i) i.hasOwnProperty(a) && a === s && n.add(e)
                                                    }), n
                                                },
                                                addConclusion: function(t, n) {
                                                    this.get("results")[t] || (this.get("results")[t] = e.lib.Test()),
                                                        this.get("results")[t].push(n), this.get("totals")[t] || (this.get("totals")[t] = 0), ++this.get("totals")[t], this.get("totals").cases || (this.get("totals").cases = 0), ++this.get("totals").cases
                                                },
                                                evaluate: function(t, e) {
                                                    if ("inapplicable" !== this.get("status")) {
                                                        var n = this,
                                                            s = this.filterTests(e);
                                                        0 === s.length ? this.set("status", "noTestCoverage") : (s.each(function(t, e) {
                                                            e.each(function(t, e) {
                                                                n.addConclusion(e.get("status"), e)
                                                            })
                                                        }), 0 === i(this.get("results")) ? this.set("status", "noResults") : this.set("status", "tested"))
                                                    }
                                                    this.report()
                                                },
                                                report: function() {
                                                    var t = Array.prototype.slice.call(arguments);
                                                    t = [].concat(["successCriteriaEvaluated", this, this.get("tests")], t), this.dispatch.apply(this, t)
                                                },
                                                listenTo: function(t, e, n) {
                                                    n = n.bind(this), t.registerListener.call(t, e, n)
                                                },
                                                registerListener: function(t, e) {
                                                    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e)
                                                },
                                                dispatch: function(t) {
                                                    if (this.listeners[t] && this.listeners[t].length) {
                                                        var e = [].slice.call(arguments);
                                                        this.listeners[t].forEach(function(t) {
                                                            t.apply(null, e)
                                                        });
                                                    }
                                                },
                                                push: [].push,
                                                sort: [].sort,
                                                splice: [].splice
                                            }, n.fn.init.prototype = n.fn, n
                                        }(), e.lib.Technique = function() {
                                            function t(e, n) {
                                                return new t.fn.init(e, n)
                                            }
                                            return t.fn = t.prototype = {
                                                constructor: t,
                                                init: function(t, e) {
                                                    return this.listeners = {}, t ? (this.attributes = e || {}, this.attributes.name = t, this) : this
                                                },
                                                length: 0,
                                                attributes: {},
                                                each: function(t) {
                                                    for (var e = [].slice.call(arguments, 1), n = 0, i = this.length; i > n; ++n) e.unshift(this[n]), e.unshift(n), t.apply(this[n], e);
                                                    return this
                                                },
                                                get: function(t) {
                                                    return this.attributes[t]
                                                },
                                                set: function(t, e) {
                                                    if ("object" == typeof t)
                                                        for (var n in t) t.hasOwnProperty(n) && (this.attributes[n] = t[n]);
                                                    else this.attributes[t] = e;
                                                    return this
                                                },
                                                addTest: function() {},
                                                report: function(t, e) {
                                                    window.console && window.console.log(this.get("name"), e.status, e, e[0] && e[0].status)
                                                },
                                                listenTo: function(t, e, n) {
                                                    n = n.bind(this), t.registerListener.call(t, e, n)
                                                },
                                                registerListener: function(t, e) {
                                                    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e)
                                                },
                                                dispatch: function(t) {
                                                    if (this.listeners[t] && this.listeners[t].length) {
                                                        var e = [].slice.call(arguments);
                                                        this.listeners[t].forEach(function(t) {
                                                            t.apply(null, e)
                                                        })
                                                    }
                                                },
                                                push: [].push,
                                                sort: [].sort,
                                                splice: [].splice
                                            }, t.fn.init.prototype = t.fn, t
                                        }(), e.lib.Test = function() {
                                            function n(t, e) {
                                                return new n.fn.init(t, e)
                                            }

                                            function i(t) {
                                                t = "undefined" == typeof t ? !0 : t, this.each(function(e, n) {
                                                    n.get("status") || (t = !1)
                                                }), t ? (this.testComplete = null, this.attributes.complete = !0, this.determineStatus()) : this.testComplete()
                                            }

                                            function s(t, e, n) {
                                                var i, s;
                                                return function() {
                                                    var a = this,
                                                        r = arguments,
                                                        o = function() {
                                                            i = null, n || (s = t.apply(a, r))
                                                        },
                                                        c = n && !i;
                                                    return clearTimeout(i), i = setTimeout(o, e), c && (s = t.apply(a, r)), s
                                                }
                                            }
                                            return n.fn = n.prototype = {
                                                constructor: n,
                                                init: function(t, e) {
                                                    return this.listeners = {}, this.length = 0, t ? (this.attributes = e || {}, this.attributes.name = t, this.attributes.status = "untested", this.attributes.complete = !1, this) : this
                                                },
                                                length: 0,
                                                attributes: null,
                                                each: function(t) {
                                                    for (var e = [].slice.call(arguments, 1), n = 0, i = this.length; i > n; ++n) e.unshift(this[n]), e.unshift(n), t.apply(this[n], e);
                                                    return this
                                                },
                                                get: function(e) {
                                                    if ("$scope" === e) {
                                                        var n = this.attributes.scope,
                                                            i = t(this.attributes.scope);
                                                        return this.attributes[e] ? this.attributes[e] : n ? i : t(document)
                                                    }
                                                    return this.attributes[e]
                                                },
                                                set: function(t, e) {
                                                    var n = !1;
                                                    if ("object" == typeof t)
                                                        for (var i in t) t.hasOwnProperty(i) && ("status" === i && (n = !0), this.attributes[i] = t[i]);
                                                    else "status" === t && (n = !0), this.attributes[t] = e;
                                                    return n && this.resolve(), this
                                                },
                                                add: function(t) {
                                                    return this.listenTo(t, "resolve", this.caseResponded), this.listenTo(t, "timeout", this.caseResponded), t.status && t.dispatch("resolve", t), this.push(t), t
                                                },
                                                invoke: function() {
                                                    if (this.testComplete) throw new Error("The test " + this.get("name") + " is already running.");
                                                    if (this.attributes.complete) throw new Error("The test " + this.get("name") + " has already been run.");
                                                    var t = this.get("type"),
                                                        n = this.get("options") || {},
                                                        a = this.get("callback"),
                                                        r = this;
                                                    if (this.testComplete = s(i.bind(this), 400), this.testComplete(!1), "custom" === t)
                                                        if ("function" == typeof a) try {
                                                            a.call(this, e, r, e.lib.Case, n)
                                                        } catch (o) {
                                                            window.console && window.console.error && window.console.error(o);
                                                        } else {
                                                            if ("custom" !== t || "function" != typeof e[a]) throw new Error("The callback " + a + " cannot be invoked.");
                                                            try {
                                                                e[a].call(this, e, r, e.lib.Case, n)
                                                            } catch (o) {
                                                                window.console && window.console.error && window.console.error(o)
                                                            }
                                                        } else {
                                                            if ("function" != typeof e.components[t]) throw new Error("The component type " + t + " is not defined.");
                                                            try {
                                                                e.components[t].call(this, e, r, e.lib.Case, n)
                                                            } catch (o) {
                                                                window.console && window.console.error && window.console.error(o)
                                                            }
                                                        }
                                                    return this.testComplete(), this
                                                },
                                                findByStatus: function(t) {
                                                    if (t) {
                                                        var e = new n;
                                                        "string" == typeof t && (t = [t]);
                                                        for (var i = 0, s = t.length; s > i; ++i) {
                                                            var a = t[i];
                                                            this.each(function(t, n) {
                                                                var i = n.get("status");
                                                                i === a && e.add(n)
                                                            })
                                                        }
                                                        return e
                                                    }
                                                },
                                                findCasesBySelector: function(t) {
                                                    var e = this.groupCasesBySelector();
                                                    return e.hasOwnProperty(t) ? e[t] : new n
                                                },
                                                findCaseByHtml: function(t) {
                                                    for (var n, i = 0, s = this.length; s > i; ++i)
                                                        if (n = this[i], t === n.get("html")) return n;
                                                    return e.lib.Case()
                                                },
                                                groupCasesBySelector: function() {
                                                    var t = {};
                                                    return this.each(function(e, i) {
                                                        var s = i.get("selector");
                                                        t[s] || (t[s] = new n),
                                                            t[s].add(i)
                                                    }), t
                                                },
                                                groupCasesByHtml: function() {
                                                    var t = {};
                                                    return this.each(function(e, i) {
                                                        var s = i.get("html");
                                                        t[s] || (t[s] = new n), t[s].add(i)
                                                    }), t
                                                },
                                                getGuidelineCoverage: function(t) {
                                                    var e = this.get("guidelines");
                                                    return e && e[t] || {}
                                                },
                                                caseResponded: function(t, e) {
                                                    this.dispatch(t, this, e), "function" == typeof this.testComplete && this.testComplete()
                                                },
                                                determineStatus: function() {
                                                    var t, n = this.get("type");
                                                    e.components[n] && "function" == typeof e.components[n].postInvoke && (t = e.components[n].postInvoke.call(this, this)), this.set(t === !0 ? {
                                                        status: "passed"
                                                    } : this.findByStatus(["cantTell"]).length === this.length ? {
                                                        status: "cantTell"
                                                    } : this.findByStatus(["inapplicable"]).length === this.length ? {
                                                        status: "inapplicable"
                                                    } : this.findByStatus(["failed", "untested"]).length ? {
                                                        status: "failed"
                                                    } : {
                                                        status: "passed"
                                                    })
                                                },
                                                resolve: function() {
                                                    this.dispatch("complete", this)
                                                },
                                                testComplete: null,
                                                listenTo: function(t, e, n) {
                                                    n = n.bind(this), t.registerListener.call(t, e, n)
                                                },
                                                registerListener: function(t, e) {
                                                    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e);
                                                },
                                                dispatch: function(t) {
                                                    if (this.listeners[t] && this.listeners[t].length) {
                                                        var e = [].slice.call(arguments);
                                                        this.listeners[t].forEach(function(t) {
                                                            t.apply(null, e)
                                                        })
                                                    }
                                                },
                                                push: [].push,
                                                sort: [].sort,
                                                concat: [].concat,
                                                splice: [].splice
                                            }, n.fn.init.prototype = n.fn, n
                                        }(), e.lib.TestCollection = function() {
                                            function t(e) {
                                                return new t.fn.init(e)
                                            }

                                            function n() {
                                                var t = !0;
                                                this.each(function(e, n) {
                                                    n.get("complete") || (t = !1)
                                                }), t ? (this.testsComplete = null, this.dispatch("complete", this)) : this.testsComplete()
                                            }

                                            function i(t, e, n) {
                                                var i, s;
                                                return function() {
                                                    var a = this,
                                                        r = arguments,
                                                        o = function() {
                                                            i = null, n || (s = t.apply(a, r))
                                                        },
                                                        c = n && !i;
                                                    return clearTimeout(i), i = setTimeout(o, e), c && (s = t.apply(a, r)), s
                                                }
                                            }
                                            return t.fn = t.prototype = {
                                                constructor: t,
                                                init: function(t, n) {
                                                    if (this.listeners = {}, n = n || {}, !t) return this;
                                                    if ("object" == typeof t) {
                                                        var i;
                                                        for (var s in t) t.hasOwnProperty(s) && (t[s].scope = t[s].scope || n.scope, i = new e.lib.Test(s, t[s]), this.listenTo(i, "results", this.report), this.push(i));
                                                        return this
                                                    }
                                                    return this
                                                },
                                                length: 0,
                                                run: function(t) {
                                                    var e = this;
                                                    return t = t || {},
                                                        this.each(function(n, i) {
                                                            t.preFilter && e.listenTo(i, "resolve", function(e, n, i) {
                                                                var s = t.preFilter(e, n, i);
                                                                s === !1 && (i.attributes.status = "notTested", i.attributes.expected = null)
                                                            }), t.caseResolve && e.listenTo(i, "resolve", t.caseResolve), t.testComplete && e.listenTo(i, "complete", t.testComplete)
                                                        }), t.testCollectionComplete && e.listenTo(e, "complete", t.testCollectionComplete), this.testsComplete = i(n.bind(this), 500), this.each(function(t, e) {
                                                            e.invoke()
                                                        }), this.testsComplete(), this
                                                },
                                                each: function(t) {
                                                    for (var e = [].slice.call(arguments, 1), n = 0, i = this.length; i > n; ++n) {
                                                        e.unshift(this[n]), e.unshift(n);
                                                        var s = t.apply(this[n], e);
                                                        if (s === !1) break
                                                    }
                                                    return this
                                                },
                                                add: function(t) {
                                                    this.find(t.get("name")) || this.push(t)
                                                },
                                                find: function(t) {
                                                    for (var e = 0, n = this.length; n > e; ++e)
                                                        if (this[e].get("name") === t) return this[e];
                                                    return null
                                                },
                                                findByGuideline: function(e) {
                                                    var n = {
                                                        wcag: function(n, i) {
                                                            function s(e, n, i) {
                                                                var s = new t;
                                                                return this.each(function(t, a) {
                                                                    var r = a.get("guidelines"),
                                                                        o = r[e] && r[e][n] && r[e][n].techniques;
                                                                    if (o)
                                                                        for (var c = 0, u = o.length; u > c; ++c) o[c] === i && (s.listenTo(a, "results", s.report),
                                                                            s.add(a))
                                                                }), s
                                                            }
                                                            var a = n.id,
                                                                r = i.get("name");
                                                            return a && r ? s.call(this, e, a, r) : void 0
                                                        }
                                                    };
                                                    if (n[e]) {
                                                        var i = [].slice.call(arguments, 1);
                                                        return n[e].apply(this, i)
                                                    }
                                                },
                                                findByStatus: function(e) {
                                                    if (e) {
                                                        var n = new t;
                                                        "string" == typeof e && (e = [e]);
                                                        for (var i = 0, s = e.length; s > i; ++i) {
                                                            var a = e[i];
                                                            this.each(function(t, e) {
                                                                var i = e.get("status");
                                                                i === a && n.add(e)
                                                            })
                                                        }
                                                        return n
                                                    }
                                                },
                                                set: function(t, n) {
                                                    for (var i = 0, s = this.length; s > i; ++i)
                                                        if (this[i].get("name") === t) return this[i].set(n), this[i];
                                                    var a = e.lib.Test(t, n);
                                                    return this.push(a), a
                                                },
                                                testsComplete: null,
                                                report: function() {
                                                    this.dispatch.apply(this, arguments)
                                                },
                                                listenTo: function(t, e, n) {
                                                    n = n.bind(this), t.registerListener.call(t, e, n)
                                                },
                                                registerListener: function(t, e) {
                                                    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(e)
                                                },
                                                dispatch: function(t) {
                                                    if (this.listeners[t] && this.listeners[t].length) {
                                                        var e = [].slice.call(arguments);
                                                        this.listeners[t].forEach(function(t) {
                                                            t.apply(null, e)
                                                        })
                                                    }
                                                },
                                                push: [].push,
                                                sort: [].sort,
                                                splice: [].splice
                                            }, t.fn.init.prototype = t.fn, t
                                        }(), e.lib.WCAGGuideline = function() {
                                            var t = function(e) {
                                                return new t.fn.init(e)
                                            };
                                            return t.fn = t.prototype = {
                                                constructor: t,
                                                init: function(t) {
                                                    if (!t) return this;
                                                    this.techniques = [];
                                                    var n, i, s, a, r;
                                                    if ("object" == typeof t) {
                                                        if (t.guidelines) {
                                                            n = t.guidelines;
                                                            for (var o in n)
                                                                if (n.hasOwnProperty(o)) {
                                                                    if (i = n[o], i.techniques && i.techniques.length && (s = i.techniques, delete i.techniques), i = e.lib.Section(o, i), s.length)
                                                                        for (var c = 0, u = s.length; u > c; ++c) {
                                                                            if (a = s[c], !t.techniques[a]) throw new Error("Definition for Technique " + a + " is missing from the guideline specification");
                                                                            r = this.findTechnique(a), r || (r = e.lib.Technique(a, t.techniques[a]), this.techniques.push(r)), i.addTechnique(r)
                                                                        }
                                                                    this.push(i)
                                                                }
                                                        }
                                                        return this
                                                    }
                                                    return this
                                                },
                                                length: 0,
                                                each: function(t) {
                                                    for (var e = [].slice.call(arguments, 1), n = 0, i = this.length; i > n; ++n) e.unshift(this[n]), e.unshift(n), t.apply(this[n], e);
                                                    return this
                                                },
                                                find: function(t) {
                                                    for (var e = 0, n = this.length; n > e; ++e)
                                                        if (this[e].get("name") === t) return this[e];
                                                    return null
                                                },
                                                findTechnique: function(t) {
                                                    for (var e = 0, n = this.techniques.length; n > e; ++e)
                                                        if (this.techniques[e].get("name") === t) return this.techniques[e];
                                                    return null
                                                },
                                                set: function(t, n) {
                                                    for (var i = 0, s = this.length; s > i; ++i)
                                                        if (this[i].get("name") === t) return this[i].set(n), this[i];
                                                    var a = e.lib.Test(t, n);
                                                    return this.push(a), a
                                                },
                                                evaluate: function() {},
                                                results: function() {},
                                                push: [].push,
                                                sort: [].sort,
                                                splice: [].splice
                                            }, t.fn.init.prototype = t.fn, t
                                        }(),
                                        function(t) {
                                            function e(e, n, i, s) {
                                                var a = n.attr("rowspan") || 1,
                                                    r = n.attr("scope");
                                                if ("col" === r) return !0;
                                                if (-1 !== c.indexOf(r)) return !1;
                                                for (var o = 0; o < a * e[s].length - 1; o += 1) {
                                                    var u = t(e[s + o % a][~~(o / a)]);
                                                    if (u.is("td")) return !1
                                                }
                                                return !0
                                            }

                                            function n(n, i, s, a) {
                                                var r = i.attr("colspan") || 1,
                                                    o = i.attr("scope");
                                                if ("row" === o) return !0;
                                                if (-1 !== c.indexOf(o) || e(n, i, s, a)) return !1;
                                                for (var u = 0; u < r * n.length - 1; u += 1) {
                                                    var l = t(n[~~(u / r)][s + u % r]);
                                                    if (l.is("td")) return !1
                                                }
                                                return !0
                                            }

                                            function i(i, s, a, r, o) {
                                                var c, u, l = t(),
                                                    d = t(i[a][s]),
                                                    h = [];
                                                for (d.is("th") ? (u = [{
                                                        cell: d,
                                                        x: s,
                                                        y: a
                                                    }], c = !0) : (c = !1, u = []); s >= 0 && a >= 0; s += r, a += o) {
                                                    var p = t(i[a][s]),
                                                        f = 0 === r ? "col" : "row";
                                                    if (p.is("th")) {
                                                        c = !0, u.push({
                                                            cell: p,
                                                            x: s,
                                                            y: a
                                                        });
                                                        var g = !1; - 1 === o && n(i, p, s, a) || -1 === r && e(i, p, s, a) ? g = !0 : t.each(h, function(e, n) {
                                                            var i = +p.attr(f + "span") || 1,
                                                                c = +t(n.cell).attr(f + "span") || 1;
                                                            i === c && (-1 === o && n.x === s || -1 === r && n.y === a) && (g = !0)
                                                        }), g === !1 && (l = l.add(p))
                                                    } else p.is("td") && c === !0 && (c = !1, h.push(u), u = t())
                                                }
                                                return l
                                            }

                                            function s(e) {
                                                var n = e.closest("table"),
                                                    i = e.attr("headers").split(/\s/),
                                                    s = t();
                                                return t.each(i, function(e, i) {
                                                    s = s.add(t("th#" + i + ", td#" + i, n))
                                                }), s
                                            }

                                            function a(t, e) {
                                                for (var n, i = 0, s = 0; void 0 === n;) {
                                                    if (void 0 === t[s]) return;
                                                    t[s][i] === e[0] ? n = i : i + 1 === t[s].length ? (s += 1, i = 0) : i += 1
                                                }
                                                return {
                                                    x: n,
                                                    y: s
                                                }
                                            }

                                            function r(e, n) {
                                                var s, r = t(),
                                                    o = a(n, e),
                                                    c = +e.attr("rowspan") || 1,
                                                    u = +e.attr("colspan") || 1;
                                                for (s = 0; u > s; s++) r = r.add(i(n, o.x + s, o.y, 0, -1));
                                                for (s = 0; c > s; s++) r = r.add(i(n, o.x, o.y + s, -1, 0));
                                                return r
                                            }

                                            function o(e, n) {
                                                var i = a(n, e),
                                                    s = t();
                                                e.closest("thead, tbody, tfoot").find("th[scope=rowgroup]").each(function() {
                                                    var e = a(n, t(this));
                                                    e.x <= i.x && e.y <= i.y && (s = s.add(this))
                                                })
                                            }
                                            var c = ["row", "col", "rowgroup", "colgroup"];
                                            t.fn.getTableMap = function() {
                                                var e = [];
                                                return this.find("tr").each(function(n) {
                                                    "undefined" == typeof e[n] && (e[n] = []);
                                                    var i = e[n];
                                                    t(this).children().each(function() {
                                                        var s, a, r, o = t(this),
                                                            c = +o.attr("rowspan") || 1,
                                                            u = +o.attr("colspan") || 1;
                                                        for (a = 0, r = i.length; r >= a; a += 1) void 0 === s && void 0 === i[a] && (s = a);
                                                        for (a = 0, r = u * c; r > a; a += 1) void 0 === e[n + ~~(a / u)] && (e[n + ~~(a / u)] = []), e[n + ~~(a / u)][s + a % u] = this
                                                    })
                                                }), e
                                            }, t.fn.tableHeaders = function() {
                                                var e = t();
                                                return this.each(function() {
                                                    var n = t(this);
                                                    if (!n.is(":not(td, th)"))
                                                        if (n.is("[headers]")) e = e.add(s(n));
                                                        else {
                                                            var i = n.closest("table").getTableMap();
                                                            e = e.add(r(n, i)).add(o(n, i))
                                                        }
                                                }), e.not(":empty").not(this)
                                            }
                                        }(jQuery), e.lib.wcag2 = function() {
                                            function n(e) {
                                                e.wcag2Structure && e.accessibilityTests && e.preconditionTests ? i(e, e.wcag2Structure, e.accessibilityTests, e.preconditionTests) : t.when(t.ajax(e.jsonPath + "/wcag2.json", a), t.ajax(e.jsonPath + "/tests.json", a), t.ajax(e.jsonPath + "/preconditions.json", a)).done(function(t, n, s) {
                                                    i(e, t[0], n[0], s[0])
                                                })
                                            }

                                            function i(n, i, a, r) {
                                                var o, c, u, l = [];
                                                o = t.map(i, function(t) {
                                                    return new e.lib.wcag2.Criterion(t, a, r, n.subject)
                                                }), t.each(o, function(t, e) {
                                                    l.push.apply(l, e.getTests())
                                                }), u = [], c = [], t.each(l, function(t, e) {
                                                    -1 === u.indexOf(e.title.en) && (u.push(e.title.en),
                                                        c.push(e))
                                                }), t(e.html).quail({
                                                    accessibilityTests: c,
                                                    testCollectionComplete: s(o, n.testCollectionComplete)
                                                })
                                            }

                                            function s(e, n) {
                                                return function(i, s) {
                                                    "complete" === i && (s = t.map(e, function(t) {
                                                        return t.getResult(s)
                                                    })), n(i, s)
                                                }
                                            }
                                            var a = {
                                                async: !1,
                                                dataType: "json"
                                            };
                                            return {
                                                run: n
                                            }
                                        }(), e.guidelines.wcag.successCriteria["1.1.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.1.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {
                                                F3: "Using CSS to include images that convey important information",
                                                F13: "Having a text alternative that does not include information that is conveyed by color differences in the image",
                                                F20: "Not updating text alternatives when changes to non-text content occur",
                                                F30: "Using text alternatives that are not alternatives (e.g., filenames or placeholder text)",
                                                F38: "Not marking up decorative images in HTML in a way that allows assistive technology to ignore them",
                                                F39: 'Providing a text alternative that is not null (e.g., alt="spacer" or alt="image") for images that should be ignored by assistive technology',
                                                F65: 'Omitting the alt attribute or text alternative on img elements, area elements, and input elements of type "image"',
                                                F67: "Providing long descriptions for non-text content that does not serve the same purpose or does not present the same information",
                                                F71: "Using text look-alikes to represent text without providing a text alternative",
                                                F72: "Using ASCII art without providing a text alternative"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G93: "Providing open (always visible) captions",
                                                G87: "Providing closed captions"
                                            }, n.failures = {
                                                F74: "Not labeling a synchronized media alternative to text as an alternative",
                                                F75: "Providing synchronized media without captions when the synchronized media presents more information than is presented on the page",
                                                F8: "Captions omitting some dialogue or important sound effects"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.4"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.4",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G9: "Creating captions for live synchronized media",
                                                G93: "Providing open (always visible) captions",
                                                G87: "Providing closed captions using any readily available media format that has a video player that supports closed captioning"
                                            }, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.5"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.5",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G78: "Providing a second, user-selectable, audio track that includes audio descriptions",
                                                G173: "Providing a version of a movie with audio descriptions",
                                                "SC1.2.8": "Providing a movie with extended audio descriptions",
                                                G8: "Providing a movie with extended audio descriptions",
                                                G203: "Using a static text alternative to describe a talking head video"
                                            }, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.7"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.7",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.8"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.8",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.2.9"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.2.9",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.3.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.3.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G115: "Using semantic elements to mark up structure AND H49: Using semantic markup to mark emphasized or special text",
                                                G117: "Using text to convey information that is conveyed by variations in presentation of text",
                                                G140: "Separating information and structure from presentation to enable different presentations",
                                                G138: "Using semantic markup whenever color cues are used",
                                                H48: "Using ol, ul and dl for lists or groups of links",
                                                H42: "Using h1-h6 to identify headings",
                                                SCR21: "Using functions of the Document Object Model (DOM) to add content to a page (Scripting)",
                                                H51: "Using table markup to present tabular information",
                                                H39: "Using caption elements to associate data table captions with data tables",
                                                H73: "Using the summary attribute of the table element to give an overview of data tables",
                                                H63: "Using the scope attribute to associate header cells and data cells in data tables",
                                                H43: "Using id and headers attributes to associate data cells with header cells in data tables",
                                                H44: "Using label elements to associate text labels with form controls",
                                                H65: "Using the title attribute to identify form controls when the label element cannot be used",
                                                H71: "Providing a description for groups of form controls using fieldset and legend elements",
                                                H85: "Using OPTGROUP to group OPTION elements inside a SELECT",
                                                ARIA11: "Using ARIA landmarks to identify regions of a page (ARIA)",
                                                ARIA12: "Using role=heading to identify headings (ARIA)",
                                                ARIA13: "Using aria-labelledby to name regions and landmarks (ARIA)",
                                                ARIA16: "Using aria-labelledby to provide a name for user interface controls (ARIA)",
                                                ARIA17: "Using grouping roles to identify related form controls (ARIA)"
                                            }, n.failures = {
                                                F2: "Using changes in text presentation to convey information without using the appropriate markup or text",
                                                F17: "Insufficient information in DOM to determine one-to-one relationships (e.g., between labels with same id) in HTML",
                                                F42: "Using scripting events to emulate links in a way that is not programmatically determinable",
                                                F43: "Using structural markup in a way that does not represent relationships in the content",
                                                F87: "Inserting non-decorative content by using :before and :after pseudo-elements and the content property in CSS",
                                                F46: "Using th elements, caption elements, or non-empty summary attributes in layout tables",
                                                F48: "Using the pre element to markup tabular information",
                                                F90: "Incorrectly associating table headers and content via the headers and id attributes",
                                                F91: "Not correctly marking up table headers",
                                                F33: "Using white space characters to create multiple columns in plain text content",
                                                F34: "Using white space characters to format tables in plain text content",
                                                F68: "Association of label and user interface controls not being programmatically determinable"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["1.3.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.3.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G57: "Ordering the content in a meaningful sequence (scope: for all the content in the Web page)",
                                                H34: "Using a Unicode right-to-left mark (RLM) or left-to-right mark (LRM) to mix text direction inline (languageUnicodeDirection)",
                                                H56: "Using the dir attribute on an inline element to resolve problems with nested directional runs",
                                                C6: "Positioning content based on structural markup (CSS)",
                                                C8: "Using CSS letter-spacing to control spacing within a word",
                                                C27: "Making the DOM order match the visual order (CSS)"
                                            }, n.failures = {
                                                F49: "Using an HTML layout table that does not make sense when linearized",
                                                F32: "Using white space characters to control spacing within a word (whiteSpaceInWord)",
                                                F1: "Changing the meaning of content by positioning information with CSS",
                                                F34: "Using white space characters to format tables in plain text content (tabularDataIsInTable)",
                                                F33: "Using white space characters to create multiple columns in plain text content (tabularDataIsInTable)"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["1.3.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.3.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G96: "Providing textual identification of items that otherwise rely only on sensory information to be understood"
                                            }, n.failures = {
                                                F14: "Identifying content only by its shape or location",
                                                F26: "Using a graphical symbol alone to convey information"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.2"] = function(e) {
                                            function n() {
                                                return !!t("audio, video, object, embed").length
                                            }
                                            var i = e.lib.SuccessCriteria({
                                                name: "wcag:1.4.2",
                                                preEvaluator: n
                                            });
                                            return i.techniques = {
                                                G60: "Playing a sound that turns off automatically within three seconds",
                                                G170: "Providing a control near the beginning of the Web page that turns off sounds that play automatically",
                                                G171: "Playing sounds only on user request"
                                            }, i.failures = {
                                                F23: "Playing a sound longer than 3 seconds where there is no mechanism to turn it off"
                                            }, i
                                        }(e), e.guidelines.wcag.successCriteria["1.4.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G148: "Not specifying background color, not specifying text color, and not using technology features that change those defaults",
                                                G174: "Providing a control with a sufficient contrast ratio that allows users to switch to a presentation that uses sufficient contrast",
                                                G18: "Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text for situation A AND G145: Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text for situation B"
                                            }, n.failures = {
                                                F24: "Specifying foreground colors without specifying background colors or vice versa",
                                                F83: "Using background images that do not provide sufficient contrast with foreground text (or images of text)"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.4"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.4",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G142: "Using a technology that has commonly-available user agents that support zoom",
                                                C12: "Using percent for font sizes",
                                                C13: "Using named font sizes",
                                                C14: "Using em units for font, sizes",
                                                SCR34: "Calculating size and ,position in a way that scales with text size (Scripting)",
                                                G146: "Using liquid layout",
                                                G178: "Providing controls on the Web page that allow users to incrementally change the size of all text on the page up to 200 percent",
                                                G179: "Ensuring that there is no loss of content or functionality when the text resizes and text containers do not change their width"
                                            }, n.failures = {
                                                F69: "Resizing visually rendered text up to 200 percent causes the text, image or controls to be clipped, truncated or obscured",
                                                F80: "Text-based form controls do not resize when visually rendered text is resized up to 200%"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.5"] = function(t) {
                                            function e() {
                                                return !!document.querySelectorAll("img, map").length
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.5",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                C22: "Using CSS to control visual presentation of text (CSS)",
                                                C30: "Using CSS to replace text with images of text and providing user interface controls to switch",
                                                G140: "Separating information and structure from presentation to enable different presentations"
                                            }, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.6"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.6",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.7"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.7",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.8"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.8",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["1.4.9"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:1.4.9",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.1.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.1.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.1.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.1.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.1.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.1.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.2.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.2.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.2.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.2.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.2.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.2.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.2.4"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.2.4",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.2.5"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.2.5",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.3.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.3.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.3.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.3.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G1: "Adding a link at the top of each page that goes directly to the main content area",
                                                G123: "Adding a link at the beginning of a block of repeated content to go to the end of the block",
                                                G124: "Adding links at the top of the page to each area of the content",
                                                H69: "Providing heading elements at the beginning of each section of content",
                                                H70: "Using frame elements to group blocks of repeated material AND H64: Using the title attribute of the frame and iframe elements",
                                                SCR28: "Using an expandable and collapsible menu to bypass block of content"
                                            }, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.10"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.10",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.4"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.4",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.5"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.5",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {},
                                                n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.6"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.6",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.7"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.7",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.8"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.8",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["2.4.9"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:2.4.9",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.1.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.1.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.1.2"] = function(t) {
                                            function e() {
                                                return !0;
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.1.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.1.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.1.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.1.4"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.1.4",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.1.5"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.1.5",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.1.6"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.1.6",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.2.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.2.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G107: 'Using "activate" rather than "focus" as a trigger for changes of context'
                                            }, n.failures = {
                                                F52: "Opening a new window as soon as a new page is loaded",
                                                F55: "Using script to remove focus when focus is received"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["3.2.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.2.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G80: "Providing a submit button to initiate a change of context",
                                                H32: "Providing submit buttons",
                                                H84: "Using a button with a select element to perform an action",
                                                G13: "Describing what will happen before a change to a form control that causes a change of context to occur is made",
                                                SCR19: "Using an onchange event on a select element without causing a change of context"
                                            }, n.failures = {
                                                F36: "Automatically submitting a form and presenting new content without prior warning when the last field in the form is given a value",
                                                F37: "Launching a new window without prior warning when the status of a radio button, check box or select list is changed",
                                                F76: "Providing instruction material about the change of context by change of setting in a user interface element at a location that users may bypass"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["3.2.3"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.2.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G61: "Presenting repeated components in the same relative order each time they appear"
                                            }, n.failures = {
                                                F66: "Presenting navigation links in a different relative order on different pages"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["3.2.4"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.2.4",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G197: "Using labels, names, and text alternatives consistently for content that has the same functionality AND following the sufficient techniques for Success Criterion 1.1.1 and sufficient techniques for Success Criterion 4.1.2 for providing labels, names, and text alternatives."
                                            }, n.failures = {
                                                F31: "Using two different labels for the same function on different Web pages within a set of Web pages"
                                            }, n
                                        }(e), e.guidelines.wcag.successCriteria["3.2.5"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.2.5",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.3.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.3.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.3.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.3.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.3.3"] = function(t) {
                                            function e() {
                                                function t(t) {
                                                    return !!this.querySelectorAll('[type="' + t + '"]').length
                                                }

                                                function e(t) {
                                                    var e = Object.keys(t)[0];
                                                    return !!this.querySelectorAll("[" + e + '="' + t[e] + '"]').length
                                                }
                                                var n = ["checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "month", "number", "password", "radio", "range", "search", "tel", "time", "url", "week"],
                                                    i = [{
                                                        required: "required"
                                                    }, {
                                                        "aria-required": "true"
                                                    }];
                                                return document.querySelectorAll("form").length ? n.some(t, document) || i.some(e, document) ? !0 : void 0 : !1
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.3.3",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                G83: "Providing text descriptions to identify required fields that were not completed",
                                                ARIA2: "Identifying a required field with the aria-required property",
                                                ARIA18: "Using aria-alertdialog to Identify Errors (ARIA)",
                                                G85: "Providing a text description when user input falls outside the required format or values",
                                                G177: "Providing suggested correction text",
                                                SCR18: "Providing client-side validation and alert (Scripting)",
                                                SCR32: "Providing client-side validation and adding error text via the DOM (Scripting)",
                                                G84: "Providing a text description when the user provides information that is not in the list of allowed values"
                                            }, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.3.4"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.3.4",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n;
                                        }(e), e.guidelines.wcag.successCriteria["3.3.5"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.3.5",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["3.3.6"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:3.3.6",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["4.1.1"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:4.1.1",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {}, n.failures = {}, n
                                        }(e), e.guidelines.wcag.successCriteria["4.1.2"] = function(t) {
                                            function e() {
                                                return !0
                                            }
                                            var n = t.lib.SuccessCriteria({
                                                name: "wcag:4.1.2",
                                                preEvaluator: e
                                            });
                                            return n.techniques = {
                                                ARIA14: "Using aria-label to provide an invisible label where a visible label cannot be used",
                                                ARIA16: "Using aria-labelledby to provide a name for user interface controls",
                                                G108: "Using markup features to expose the name and role, allow user-settable properties to be directly set, and provide notification of changes using technology-specific techniques below:",
                                                H91: "Using HTML form controls and links",
                                                H44: "Using label elements to associate text labels with form controls",
                                                H64: "Using the title attribute of the frame and iframe elements",
                                                H65: "Using the title attribute to identify form controls when the label element cannot be used",
                                                H88: "Using HTML according to spec"
                                            }, n.failures = {
                                                F59: "Using script to make div or span a user interface control in HTML without providing a role for the control (This failure may be solved in the future using DHTML roadmap techniques.)",
                                                F20: "Not updating text alternatives when changes to non-text content occur",
                                                F68: "Association of label and user interface controls not being programmatically determined",
                                                F79: "Focus state of a user interface component not being programmatically determinable or no notification of change of focus state available",
                                                F86: "Not providing names for each part of a multi-part form field, such as a US telephone number",
                                                F89: "Using null alt on an image where the image is the only content in a link"
                                            }, n
                                        }(e),
                                        e.lib.wcag2.Criterion = function() {
                                            function n(n, i) {
                                                var s = e.lib.wcag2.EarlAssertion.getResultPriority,
                                                    a = {
                                                        result: i
                                                    };
                                                return t.each(n, function(t, e) {
                                                    s(a) < s(e) && (a.result = e.outcome.result)
                                                }), a
                                            }

                                            function i(i, s, a, r) {
                                                var o = [],
                                                    c = {},
                                                    u = i["default"] || "untested",
                                                    l = i.id;
                                                if (t.isArray(i.testAggregators) && (o = t.map(i.testAggregators, function(t) {
                                                        return new e.lib.wcag2.TestAggregator(t, s, r)
                                                    })), t.isArray(i.preconditions)) {
                                                    var d = {
                                                        type: "stacking",
                                                        tests: i.preconditions
                                                    };
                                                    o.push(new e.lib.wcag2.TestAggregator(d, a, r))
                                                }
                                                return c.getResult = function(i) {
                                                    var s, a = [];
                                                    return t.each(o, function(t, e) {
                                                        var n = e.getResults(i);
                                                        a.push.apply(a, n)
                                                    }), s = new e.lib.wcag2.EarlAssertion({
                                                        testRequirement: l,
                                                        outcome: n(a, u),
                                                        subject: r
                                                    }), a.length > 0 && (s.hasPart = a), s
                                                }, c.getTests = function() {
                                                    var e = [];
                                                    return t.each(o, function(t, n) {
                                                        e.push.apply(e, n.tests)
                                                    }), e
                                                }, c
                                            }
                                            return i
                                        }(), e.lib.wcag2.EarlAssertion = function() {
                                            function e(e) {
                                                t.extend(this, e, s), this.outcome = t.extend({}, this.outcome)
                                            }
                                            var n, i = ["untested", "inapplicable", "passed", "cantTell", "failed"],
                                                s = {
                                                    type: "assertion",
                                                    subject: n,
                                                    assertedBy: {
                                                        type: "earl:Software",
                                                        name: "QuailJS"
                                                    },
                                                    mode: "automated"
                                                };
                                            return window && window.location && (n = window.location.href), e.getResultPriority = function(t) {
                                                return "object" == typeof t && (t = t.outcome ? t.outcome.result : t.result), i.indexOf(t)
                                            }, e
                                        }(), e.lib.wcag2.TestAggregator = function() {
                                            function n(e, n) {
                                                t.each(e, function(t, e) {
                                                    e.each(function() {
                                                        n.call(this, e, this)
                                                    })
                                                })
                                            }

                                            function i(e) {
                                                var n = [],
                                                    i = [];
                                                return t.each(e, function(t, e) {
                                                    var n = [];
                                                    e.each(function() {
                                                        n.push(this.get("element")), u.add(this)
                                                    }), i.push(n)
                                                }), t.each(i, function(e, i) {
                                                    if (0 === e) return void(n = i);
                                                    var s = [];
                                                    t.each(i, function(t, e) {
                                                        -1 !== n.indexOf(e) && s.push(e)
                                                    }), n = s
                                                }), n
                                            }

                                            function s(t) {
                                                var e = [];
                                                return n(t, function(t, n) {
                                                    var i = n.get("element"); - 1 === e.indexOf(i) && (e.push(i), u.add(n))
                                                }), e
                                            }

                                            function a(n, i) {
                                                var s = [];
                                                return t.each(n, function(t, n) {
                                                    var a = new e.lib.wcag2.EarlAssertion(i);
                                                    n && (a.outcome.pointer = u.getPointer(n)), s.push(a)
                                                }), s
                                            }

                                            function r(t, s) {
                                                var r = jQuery.unique(i(s)),
                                                    o = a(jQuery.unique(r), {
                                                        testCase: t.id,
                                                        outcome: {
                                                            result: "failed"
                                                        }
                                                    });
                                                return n(s, function(n, i) {
                                                    var s = i.get("status"),
                                                        a = e.lib.wcag2.EarlAssertion.getResultPriority,
                                                        c = o[r.indexOf(i.get("element"))];
                                                    if (t[s] && (s = t[s]), c && a(c) >= a(s)) {
                                                        var u = c.outcome.pointer;
                                                        c.outcome = {
                                                            result: s,
                                                            info: n.get("title")
                                                        }, u && (c.outcome.pointer = u)
                                                    }
                                                }), o
                                            }

                                            function o(t, i) {
                                                var r = s(i),
                                                    o = a(r, {
                                                        testCase: t.id,
                                                        outcome: {
                                                            result: "untested"
                                                        }
                                                    });
                                                return n(i, function(n, i) {
                                                    var s = i.get("status"),
                                                        a = e.lib.wcag2.EarlAssertion.getResultPriority,
                                                        c = o[r.indexOf(i.get("element"))];
                                                    t[s] && (s = t[s]), c && a(c) < a(s) && (c.outcome = {
                                                        result: s,
                                                        info: n.get("title")
                                                    })
                                                }), o
                                            }

                                            function c(e, n, i) {
                                                t.extend(this, {
                                                    id: e.tests.join("+"),
                                                    subject: i
                                                }, e), this.tests = t.map(this.tests, function(t) {
                                                    return n[t]
                                                })
                                            }
                                            var u = {
                                                elms: [],
                                                pointers: [],
                                                add: function(t) {
                                                    var e; - 1 === u.elms.indexOf(t.get("element")) && (t.get("html") && (e = [{
                                                        type: "CharSnippetCompoundPointer",
                                                        chars: t.get("html"),
                                                        CSSSelector: t.get("selector")
                                                    }]), u.elms.push(t.get("element")), u.pointers.push(e))
                                                },
                                                getPointer: function(t) {
                                                    var e = u.elms.indexOf(t);
                                                    return u.pointers[e]
                                                }
                                            };
                                            return c.prototype.filterDataToTests = function(e) {
                                                var n = t.map(this.tests, function(t) {
                                                        return t.name
                                                    }),
                                                    i = [];
                                                return t.each(e, function(t, e) {
                                                    -1 !== n.indexOf(e.get("name")) && i.push(e)
                                                }), i
                                            }, c.prototype.getResults = function(t) {
                                                var n, i, s = this.filterDataToTests(t);
                                                return 1 === s.length || "combined" === this.type ? n = r(this, s) : "stacking" === this.type ? n = o(this, s) : window && window.console.error("Unknown type for aggregator " + this.id), n ? (0 === n.length && (i = new e.lib.wcag2.EarlAssertion({
                                                    testCase: this.id,
                                                    subject: this.subject,
                                                    outcome: {
                                                        result: "inapplicable"
                                                    }
                                                }), n.push(i)), n) : void 0
                                            }, c
                                        }()
                                }(jQuery)
                            }(), n = u.fn.quail, e.prototype = new a, e.prototype.constructor = e, e.prototype.fixesMapping = {
                                imgHasAlt: ["ImgAlt"],
                                imgImportantNoSpacerAlt: ["ImgAlt"],
                                KINGUseLongDateFormat: ["DateUnfold"],
                                aAdjacentWithSameResourceShouldBeCombined: ["AnchorsMerge"],
                                imgAltNotEmptyInAnchor: ["ImgAlt"],
                                imgAltIsDifferent: ["ImgAlt"],
                                imgShouldNotHaveTitle: ["AttributeRename"],
                                tableUsesCaption: ["AddTableCaption"],
                                imgAltIsTooLong: ["ImgAlt"],
                                pNotUsedAsHeader: ["ParagraphToHeader"],
                                headerH1: ["ParagraphToHeader"],
                                headerH2: ["ParagraphToHeader"],
                                headerH3: ["ParagraphToHeader"],
                                headerH4: ["ParagraphToHeader"],
                                headerH5: ["ParagraphToHeader"],
                                headerH6: ["ParagraphToHeader"],
                                tableDataShouldHaveTh: ["TableHeaders"],
                                imgWithEmptyAlt: ["ImgAltNonEmpty"]
                            }, e.prototype.issueDetails = {}, e.prototype.process = function(t, e, n) {
                                var i = window.jQuery,
                                    s = t.editor.config.a11ychecker_quailParams || {},
                                    a = this,
                                    r = {
                                        reset: !0,
                                        guideline: this.config.guideline,
                                        testCollectionComplete: function(i, s) {
                                            var r = a.getIssuesFromCollection(s, t.editor);
                                            a.filterIssues(r, e), n && n(r)
                                        }
                                    };
                                CKEDITOR.tools.extend(s, r, !0), s.jsonPath || (s.jsonPath = this.jsonPath), i(e.$).quail(s)
                            }, e.prototype.getIssuesFromCollection = function(t, e) {
                                var n = new r,
                                    i = this;
                                return t.each(function(t, s) {
                                    var a = s.get("name");
                                    "failed" === s.get("status") && (i.issueDetails[a] || (i.issueDetails[a] = i.getIssueDetailsFromTest(s, e)), i.addIssuesFromTest(s, n))
                                }), n
                            }, e.prototype.getIssueDetailsFromTest = function(t, e) {
                                function n(t, e) {
                                    var n = CKEDITOR.tools.objectKeys(t),
                                        i = y.getPreferredLanguage(e.language, e.defaultLanguage, n);
                                    return String(t[i])
                                }
                                var i = [],
                                    s = t.get("guidelines").wcag,
                                    a = s && CKEDITOR.tools.objectKeys(s)[0];
                                a && (i.push("WCAG2.0"), i.push(a), i.push(s[a].techniques.join(",")));
                                var r = t.get("title") || {},
                                    o = t.get("description") || {};
                                return new c(n(r, e.config), n(o, e.config), i)
                            }, e.prototype.addIssuesFromTest = function(t, e) {
                                var n = this,
                                    i = t.get("name"),
                                    s = t.get("testability");
                                t.each(function(t, a) {
                                    if (n.isValidTestCase(a)) {
                                        var r, c = a.attributes;
                                        "failed" == c.status && (r = new o({
                                            originalElement: new CKEDITOR.dom.element(c.element),
                                            testability: s,
                                            id: i
                                        }, n), e.addItem(r))
                                    }
                                })
                            }, e.prototype.isValidTestCase = function(t) {
                                var e = t.attributes.element;
                                return e instanceof HTMLElement && null !== e.parentNode
                            }, e.prototype.getIssueDetails = function(t, e) {
                                e(this.issueDetails[t.id])
                            }, e.prototype._filterIssue = function(t, e) {
                                var n, i = t.originalElement;
                                return i instanceof CKEDITOR.dom.element == !1 ? !1 : (n = i.$, n && n.tagName ? !0 : !1)
                            }, e.prototype.createConfig = function(t) {
                                var e = new i,
                                    n = t.config.a11ychecker_quailParams;
                                return n && n.guideline && (e.guideline = n.guideline), e
                            }, t(e)
                        }
                    }, CKEDITOR.event.implementOn(t._.a11ychecker)
                }
            }), CKEDITOR.plugins.a11ychecker = {
                rev: "5d497a5ade75e9fbe46c4bb70880197ede1c4152"
            }
        }(), w = void 0
}();

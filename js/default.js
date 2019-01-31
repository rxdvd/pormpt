var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// navbar stuff
var NavBar = function (_React$Component) {
    _inherits(NavBar, _React$Component);

    function NavBar() {
        _classCallCheck(this, NavBar);

        return _possibleConstructorReturn(this, (NavBar.__proto__ || Object.getPrototypeOf(NavBar)).apply(this, arguments));
    }

    _createClass(NavBar, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "nav",
                null,
                React.createElement(NavHeader, { text: "pormpt" }),
                React.createElement(NavLinks, null)
            );
        }
    }]);

    return NavBar;
}(React.Component);

var NavHeader = function (_React$Component2) {
    _inherits(NavHeader, _React$Component2);

    function NavHeader() {
        _classCallCheck(this, NavHeader);

        return _possibleConstructorReturn(this, (NavHeader.__proto__ || Object.getPrototypeOf(NavHeader)).apply(this, arguments));
    }

    _createClass(NavHeader, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "nav-header" },
                this.props.text
            );
        }
    }]);

    return NavHeader;
}(React.Component);

var NavLinks = function (_React$Component3) {
    _inherits(NavLinks, _React$Component3);

    function NavLinks(props) {
        _classCallCheck(this, NavLinks);

        var _this3 = _possibleConstructorReturn(this, (NavLinks.__proto__ || Object.getPrototypeOf(NavLinks)).call(this, props));

        _this3.handleClick = _this3.handleClick.bind(_this3);
        return _this3;
    }

    _createClass(NavLinks, [{
        key: "handleClick",
        value: function handleClick() {
            var dialog = document.querySelector(".full-dialog");
            if (dialog == null) {
                dialog = document.createElement("div");
                dialog.className = "full-dialog";
                document.querySelector(".container").appendChild(dialog);
                ReactDOM.render(React.createElement(AboutDialogBox, null), dialog);
            } else {
                dialog.parentElement.removeChild(dialog);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var links = [["OwO", "javascript:void(0);", this.handleClick]];
            var listLinks = links.map(function (e) {
                return React.createElement(NavItem, { key: e[0], name: e[0], url: e[1], onClick: e[2] });
            });
            return React.createElement(
                "div",
                { className: "nav-links" },
                listLinks
            );
        }
    }]);

    return NavLinks;
}(React.Component);

var NavItem = function (_React$Component4) {
    _inherits(NavItem, _React$Component4);

    function NavItem() {
        _classCallCheck(this, NavItem);

        return _possibleConstructorReturn(this, (NavItem.__proto__ || Object.getPrototypeOf(NavItem)).apply(this, arguments));
    }

    _createClass(NavItem, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "a",
                { href: this.props.url, onClick: this.props.onClick, className: "nav-item" },
                React.createElement(
                    "div",
                    null,
                    this.props.name
                )
            );
        }
    }]);

    return NavItem;
}(React.Component);

var AboutDialogBox = function (_React$Component5) {
    _inherits(AboutDialogBox, _React$Component5);

    function AboutDialogBox(props) {
        _classCallCheck(this, AboutDialogBox);

        var _this5 = _possibleConstructorReturn(this, (AboutDialogBox.__proto__ || Object.getPrototypeOf(AboutDialogBox)).call(this, props));

        _this5.handleClick = _this5.handleClick.bind(_this5);
        return _this5;
    }

    _createClass(AboutDialogBox, [{
        key: "handleClick",
        value: function handleClick(e) {
            document.querySelector(".container").removeChild(document.querySelector(".full-dialog"));
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "h1",
                    null,
                    "What's this?"
                ),
                React.createElement(
                    "p",
                    null,
                    "This is a random generator that generates prompts for pieces of music that you can try to compose. There are a few things in place to try and make it not come up with complete nonsense but most of the time they won't make perfect sense either.",
                    React.createElement("br", null),
                    React.createElement("br", null),
                    "Just so you don't have to spam the button too much to make it come up with anything remotely possible to create, I have included the option to turn off tags and also you can freeze parts of the prompt by clicking on them so they won't get randomized.",
                    React.createElement("br", null),
                    React.createElement("br", null),
                    "By default it will come up with ideas that are based on video game music, but you can turn that off too."
                )
            );
        }
    }]);

    return AboutDialogBox;
}(React.Component);

// main stuff


var Generator = function (_React$Component6) {
    _inherits(Generator, _React$Component6);

    function Generator(props) {
        _classCallCheck(this, Generator);

        var _this6 = _possibleConstructorReturn(this, (Generator.__proto__ || Object.getPrototypeOf(Generator)).call(this, props));

        var categories = [["time_sig", "Time Signatures"], ["rhythm_adj", "Rhythm Descriptors"], ["tempo", "Tempo"], ["emotive_adj", "Mood Descriptors"], ["game", "Video Games"], ["genre", "Genres"], ["style", "Musical Forms"], ["key_sig", "Keys"], ["scale", "Scales and Modes"], ["instr", "Instrumentation"]];

        _this6.state = {
            prompt: "",
            category: "time_sig",
            options: {},
            listCats: categories,
            searchbar: "",
            held: {}
        };

        _this6.handleHold = _this6.handleHold.bind(_this6);
        _this6.handleRandomize = _this6.handleRandomize.bind(_this6);
        _this6.handleCopy = _this6.handleCopy.bind(_this6);
        _this6.handleCategorySelect = _this6.handleCategorySelect.bind(_this6);
        _this6.handleOptionCheck = _this6.handleOptionCheck.bind(_this6);
        _this6.handleOptionCheckMany = _this6.handleOptionCheckMany.bind(_this6);
        _this6.handleOptionSearch = _this6.handleOptionSearch.bind(_this6);

        var listOptions = [];
        var getOptionsLoop = function getOptionsLoop(n, done) {
            ajax("/list/" + categories[n][0]).then(function (res) {
                var o = {};
                res.split(",").forEach(function (e) {
                    o[e] = true;
                });
                listOptions[n] = o;
                if (++n < categories.length) {
                    getOptionsLoop(n, done);
                } else {
                    done();
                }
            }, function (err) {
                console.error(err);
            });
        };
        var initOptions = function initOptions() {
            if (localStorage.getItem("wordlist_options") != null) {
                try {
                    var O = JSON.parse(localStorage.getItem("wordlist_options"));

                    var comparison = [];
                    for (k in O) {
                        comparison.push(Object.keys(O[k]).join());
                    }comparison = comparison.join();

                    if (comparison != listOptions.map(function (e) {
                        return Object.keys(e).join();
                    }).join()) {
                        for (var i = 0; i < listOptions.length; i++) {
                            for (k in listOptions[i]) {
                                if (typeof O[categories[i][0]][k] == "undefined") {
                                    O[categories[i][0]][k] = false;
                                }
                            }
                            for (k in O[categories[i][0]]) {
                                if (!Object.keys(listOptions[i]).includes(k)) {
                                    delete O[categories[i][0]][k];
                                }
                            }
                        }
                    }
                    _this6.state.options = O;
                    localStorage.setItem("wordlist_options", JSON.stringify(_this6.state.options));
                    _this6.forceUpdate();
                    _this6.handleRandomize(false);
                    return;
                } catch (err) {
                    console.error(err);
                    localStorage.removeItem("wordlist_options");
                }
            }
            for (var _i = 0; _i < listOptions.length; _i++) {
                _this6.state.options[categories[_i][0]] = listOptions[_i];
            }
            _this6.forceUpdate();
            _this6.handleRandomize(false);
        };
        getOptionsLoop(0, initOptions);
        return _this6;
    }

    _createClass(Generator, [{
        key: "handleHold",
        value: function handleHold(cat) {
            var h = this.state.held;
            h[cat] = h[cat] ? false : true;
            this.setState({
                held: h
            });
        }
    }, {
        key: "handleRandomize",
        value: function handleRandomize() {
            var _this7 = this;

            var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            document.querySelector("#randomize-button").disabled = true;
            if (flag) {
                header = document.querySelector(".nav-header").textContent;
                lastLetter = header.slice(-1);
                firstLetter = header.slice(0, 1);
                header = header.slice(1, -1);
                for (var i = 0; i < 10; i++) {
                    var char = header.charAt(Math.floor(Math.random() * header.length));
                    header = header.replace(char, "");
                    header += char;
                }
                header = firstLetter + header + lastLetter;
                document.querySelector(".nav-header").textContent = header;
            }
            var excludes = [];
            for (x in this.state.options) {
                for (y in this.state.options[x]) {
                    if (!this.state.options[x][y]) {
                        excludes.push(y);
                    }
                }
            }
            excludes = excludes.length ? "?exclude=" + excludes.join(",") : "";
            ajax("/generate" + excludes).then(function (response) {
                if (_this7.state.prompt) {
                    var newPrompt = _this7.state.prompt.split(",").map(function (e, i) {
                        return _this7.state.held[_this7.state.listCats[i][0]] ? e : response.split(",")[i];
                    });
                    _this7.setState({
                        prompt: newPrompt.join(",")
                    });
                    document.querySelector("#randomize-button").disabled = false;
                } else {
                    _this7.setState({ prompt: response });
                }
            }, function (err) {
                console.error(err);
            });
        }
    }, {
        key: "handleCopy",
        value: function handleCopy() {
            var copyText = this.state.prompt.split(",").join(" ");
            var hiddenInput = document.createElement("textarea");
            hiddenInput.value = copyText;
            hiddenInput.style.opacity = 0;
            document.body.appendChild(hiddenInput);
            hiddenInput.focus();
            hiddenInput.select();
            document.execCommand("copy");
            document.body.removeChild(hiddenInput);

            var tags = document.querySelectorAll(".generator-output > span");
            [].forEach.call(tags, function (e) {
                e.style.animation = "copytext 0.4s";
                setTimeout(function () {
                    e.style.animation = null;
                }, 500);
            });
        }
    }, {
        key: "handleCategorySelect",
        value: function handleCategorySelect(selection) {
            this.setState({
                category: selection
            });
        }
    }, {
        key: "handleOptionCheck",
        value: function handleOptionCheck(selection) {
            var o = this.state.options;
            o[this.state.category][selection] = o[this.state.category][selection] ? false : true;
            this.setState({ options: o });
            localStorage.setItem("wordlist_options", JSON.stringify(this.state.options));
        }
    }, {
        key: "handleOptionCheckMany",
        value: function handleOptionCheckMany(flag) {
            var bool = flag.includes("all") ? true : false;
            var o = this.state.options;
            for (k in o[this.state.category]) {
                if (k.includes(this.state.searchbar)) {
                    o[this.state.category][k] = bool;
                }
            }
            this.setState({ options: o });
            localStorage.setItem("wordlist_options", JSON.stringify(this.state.options));
            [].forEach.call(document.querySelectorAll("input[type=checkbox]"), function (e) {
                e.checked = bool;
            });
        }
    }, {
        key: "handleOptionSearch",
        value: function handleOptionSearch(value) {
            this.setState({
                searchbar: value
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(GeneratorMain, { onRandomize: this.handleRandomize, onCopy: this.handleCopy, prompt: this.state.prompt, categories: this.state.listCats.map(function (e) {
                        return e[0];
                    }), onElementClick: this.handleHold, heldData: this.state.held }),
                React.createElement(GeneratorOptions, { onCheckMany: this.handleOptionCheckMany, onCategorySelect: this.handleCategorySelect, category: this.state.category, options: this.state.options, categories: this.state.listCats, onCheck: this.handleOptionCheck, onSearch: this.handleOptionSearch, search: this.state.searchbar })
            );
        }
    }]);

    return Generator;
}(React.Component);

var GeneratorMain = function (_React$Component7) {
    _inherits(GeneratorMain, _React$Component7);

    function GeneratorMain() {
        _classCallCheck(this, GeneratorMain);

        return _possibleConstructorReturn(this, (GeneratorMain.__proto__ || Object.getPrototypeOf(GeneratorMain)).apply(this, arguments));
    }

    _createClass(GeneratorMain, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "generator" },
                React.createElement(GeneratorOutput, { heldData: this.props.heldData, prompt: this.props.prompt, categories: this.props.categories, onElementClick: this.props.onElementClick }),
                React.createElement(ButtonPanel, { onRandomize: this.props.onRandomize, onCopy: this.props.onCopy })
            );
        }
    }]);

    return GeneratorMain;
}(React.Component);

var GeneratorOutput = function (_React$Component8) {
    _inherits(GeneratorOutput, _React$Component8);

    function GeneratorOutput(props) {
        _classCallCheck(this, GeneratorOutput);

        var _this9 = _possibleConstructorReturn(this, (GeneratorOutput.__proto__ || Object.getPrototypeOf(GeneratorOutput)).call(this, props));

        _this9.handleClick = _this9.handleClick.bind(_this9);
        return _this9;
    }

    _createClass(GeneratorOutput, [{
        key: "handleClick",
        value: function handleClick(e) {
            this.props.onElementClick(e.target.id);
        }
    }, {
        key: "render",
        value: function render() {
            var _this10 = this;

            var prompt = this.props.prompt.split(",");
            var listKeys = this.props.categories;
            var listComponents = prompt.map(function (e, i) {
                if (e.trim() != "False") {
                    return React.createElement(
                        "span",
                        { className: _this10.props.heldData[listKeys[i]] ? "held" : "", key: listKeys[i], id: listKeys[i], onClick: _this10.handleClick },
                        e
                    );
                }
            });
            return React.createElement(
                "div",
                { className: "generator-output" },
                listComponents
            );
        }
    }]);

    return GeneratorOutput;
}(React.Component);

var ButtonPanel = function (_React$Component9) {
    _inherits(ButtonPanel, _React$Component9);

    function ButtonPanel(props) {
        _classCallCheck(this, ButtonPanel);

        var _this11 = _possibleConstructorReturn(this, (ButtonPanel.__proto__ || Object.getPrototypeOf(ButtonPanel)).call(this, props));

        _this11.handleClick = _this11.handleClick.bind(_this11);
        return _this11;
    }

    _createClass(ButtonPanel, [{
        key: "handleClick",
        value: function handleClick(e) {
            switch (e.target.textContent) {
                case "randomize":
                    this.props.onRandomize();
                    break;
                case "copy":
                    this.props.onCopy();
                    break;
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "button-panel" },
                React.createElement(
                    "button",
                    { id: "randomize-button", onClick: this.handleClick },
                    "randomize"
                ),
                React.createElement(
                    "button",
                    { onClick: this.handleClick },
                    "copy"
                )
            );
        }
    }]);

    return ButtonPanel;
}(React.Component);

var GeneratorOptions = function (_React$Component10) {
    _inherits(GeneratorOptions, _React$Component10);

    function GeneratorOptions(props) {
        _classCallCheck(this, GeneratorOptions);

        var _this12 = _possibleConstructorReturn(this, (GeneratorOptions.__proto__ || Object.getPrototypeOf(GeneratorOptions)).call(this, props));

        _this12.handleCheck = _this12.handleCheck.bind(_this12);
        _this12.handleCheckMany = _this12.handleCheckMany.bind(_this12);
        _this12.handleSearch = _this12.handleSearch.bind(_this12);
        return _this12;
    }

    _createClass(GeneratorOptions, [{
        key: "handleCheckMany",
        value: function handleCheckMany(e) {
            this.props.onCheckMany(e.target.id);
        }
    }, {
        key: "handleCheck",
        value: function handleCheck(selection) {
            this.props.onCheck(selection);
        }
    }, {
        key: "handleSearch",
        value: function handleSearch(value) {
            this.props.onSearch(value);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "generator-options" },
                React.createElement(GeneratorOptionsSelect, { category: this.props.category, onCategorySelect: this.props.onCategorySelect, categories: this.props.categories }),
                React.createElement(GeneratorOptionsSearchBar, { onSearch: this.handleSearch }),
                React.createElement(
                    "button",
                    { className: "mark-all-none", id: "mark-all", onClick: this.handleCheckMany },
                    "mark"
                ),
                React.createElement(
                    "button",
                    { className: "mark-all-none", id: "mark-none", onClick: this.handleCheckMany },
                    "unmark"
                ),
                React.createElement(GeneratorOptionsList, { options: this.props.options[this.props.category], onCheck: this.handleCheck, search: this.props.search })
            );
        }
    }]);

    return GeneratorOptions;
}(React.Component);

var GeneratorOptionsSelect = function (_React$Component11) {
    _inherits(GeneratorOptionsSelect, _React$Component11);

    function GeneratorOptionsSelect(props) {
        _classCallCheck(this, GeneratorOptionsSelect);

        var _this13 = _possibleConstructorReturn(this, (GeneratorOptionsSelect.__proto__ || Object.getPrototypeOf(GeneratorOptionsSelect)).call(this, props));

        _this13.handleChange = _this13.handleChange.bind(_this13);
        return _this13;
    }

    _createClass(GeneratorOptionsSelect, [{
        key: "handleChange",
        value: function handleChange(e) {
            this.props.onCategorySelect(e.target.value);
        }
    }, {
        key: "render",
        value: function render() {
            var listOpts = this.props.categories;
            var mapOpts = listOpts.map(function (e) {
                return React.createElement(
                    "option",
                    { key: e[0], value: e[0] },
                    e[1]
                );
            });
            return React.createElement(
                "select",
                { value: this.props.category, onChange: this.handleChange },
                mapOpts
            );
        }
    }]);

    return GeneratorOptionsSelect;
}(React.Component);

var GeneratorOptionsSearchBar = function (_React$Component12) {
    _inherits(GeneratorOptionsSearchBar, _React$Component12);

    function GeneratorOptionsSearchBar(props) {
        _classCallCheck(this, GeneratorOptionsSearchBar);

        var _this14 = _possibleConstructorReturn(this, (GeneratorOptionsSearchBar.__proto__ || Object.getPrototypeOf(GeneratorOptionsSearchBar)).call(this, props));

        _this14.handleSearch = _this14.handleSearch.bind(_this14);
        return _this14;
    }

    _createClass(GeneratorOptionsSearchBar, [{
        key: "handleSearch",
        value: function handleSearch(e) {
            this.props.onSearch(e.target.value);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement("input", { type: "text", placeholder: "search", onChange: this.handleSearch });
        }
    }]);

    return GeneratorOptionsSearchBar;
}(React.Component);

var GeneratorOptionsList = function (_React$Component13) {
    _inherits(GeneratorOptionsList, _React$Component13);

    function GeneratorOptionsList(props) {
        _classCallCheck(this, GeneratorOptionsList);

        var _this15 = _possibleConstructorReturn(this, (GeneratorOptionsList.__proto__ || Object.getPrototypeOf(GeneratorOptionsList)).call(this, props));

        _this15.handleCheck = _this15.handleCheck.bind(_this15);
        return _this15;
    }

    _createClass(GeneratorOptionsList, [{
        key: "handleCheck",
        value: function handleCheck(e) {
            this.props.onCheck(e.target.nextElementSibling.textContent);
        }
    }, {
        key: "render",
        value: function render() {
            var _this16 = this;

            var listOpts = void 0;
            try {
                listOpts = Object.keys(this.props.options);

                if (this.props.search.length > 0) {
                    listOpts = listOpts.filter(function (e) {
                        return e.includes(_this16.props.search);
                    });
                }
                listOpts.sort();
                listOpts = listOpts.map(function (k) {
                    return React.createElement(
                        "div",
                        { key: k },
                        React.createElement("input", { type: "checkbox", value: k, defaultChecked: _this16.props.options[k], onChange: _this16.handleCheck }),
                        React.createElement(
                            "label",
                            null,
                            k
                        )
                    );
                });
            } catch (err) {
                listOpts = [];
            }
            return React.createElement(
                "div",
                { className: "generator-options-list" },
                listOpts
            );
        }
    }]);

    return GeneratorOptionsList;
}(React.Component);

var App = function (_React$Component14) {
    _inherits(App, _React$Component14);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(NavBar, null),
                React.createElement(Generator, null)
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.querySelector("#root"));

function ajax(url) {
    return new Promise(function (success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    success(xhr.responseText);
                } else {
                    failure(xhr.status);
                }
            }
        };
        xhr.send();
    });
}
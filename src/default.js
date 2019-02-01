// navbar stuff
class NavBar extends React.Component{
    render(){
        return (
            <nav>
                <NavHeader text="pormpt"/>
                <NavLinks />
            </nav>
        )
    }
}

class NavHeader extends React.Component{
    render(){
        return <div className="nav-header">{this.props.text}</div>
    }
}

class NavLinks extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        let dialog = document.querySelector(".full-dialog");
        if(dialog == null){
            dialog = document.createElement("div");
            dialog.className = "full-dialog";
            document.querySelector(".container").appendChild(dialog);
            ReactDOM.render(
                <AboutDialogBox />,
                dialog
            );
        }else{
            dialog.parentElement.removeChild(dialog);
        }
    }

    render(){
        const links = [
            ["OwO", "javascript:void(0);", this.handleClick]
        ];
        const listLinks = links.map(e => 
            <NavItem key={e[0]} name={e[0]} url={e[1]} onClick={e[2]} />
        );
        return (
            <div className="nav-links">
                {listLinks}
            </div>
        )
    }
}

class NavItem extends React.Component{
    render(){
        return (
            <a href={this.props.url} onClick={this.props.onClick} className="nav-item">
                <div>{this.props.name}</div>
            </a>
        )
    }
}

class AboutDialogBox extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        document.querySelector(".container").removeChild(document.querySelector(".full-dialog"));
    }

    render(){
        return (
            <div>
                <h1>What's this?</h1>
                <p>
                    This is a random generator that generates prompts for pieces of music that you can try to compose.
                    There are a few things in place to try and make it not come up with complete nonsense
                    but most of the time they won't make perfect sense either.<br/><br/>
                    Just so you don't have to spam the button too much to make it come up with anything remotely 
                    possible to create, I have included the option to turn off tags and also you can freeze parts 
                    of the prompt by clicking on them so they won't get randomized.<br/><br/>
                    By default it will come up with ideas that are based on video game music, but you can turn that off too.
                </p>
            </div>
        )
    }
}

// main stuff
class Generator extends React.Component{
    constructor(props){
        super(props);

        const categories = [
            ["time_sig", "Time Signatures"],
            ["rhythm_adj", "Rhythm Descriptors"],
            ["tempo", "Tempo"],
            ["emotive_adj", "Mood Descriptors"],
            ["game", "Video Games"],
            ["genre", "Genres"],
            ["style", "Musical Forms"],
            ["key_sig", "Keys"],
            ["scale", "Scales and Modes"],
            ["instr", "Instrumentation"]
        ];

        this.state = {
            prompt: "",
            category: "time_sig",
            options: {},
            listCats: categories,
            searchbar: "",
            held: {}
        };

        this.handleHold = this.handleHold.bind(this);
        this.handleRandomize = this.handleRandomize.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleOptionCheck = this.handleOptionCheck.bind(this);
        this.handleOptionCheckMany = this.handleOptionCheckMany.bind(this);
        this.handleOptionSearch = this.handleOptionSearch.bind(this);

        var listOptions = [];
        const getOptionsLoop = function(n, done){
            ajax("/list/" + categories[n][0]).then(
                (res) => {
                    let o = {};
                    res.split(",").forEach(e => {o[e] = true;});
                    listOptions[n] = o;
                    if(++n < categories.length){
                        getOptionsLoop(n, done);
                    }else{
                        done();
                    }
                },
                (err) => {
                    console.error(err);
                }
            );
        };
        const initOptions = () => {
            if(localStorage.getItem("wordlist_options") != null){
                try{
                    let O = JSON.parse(localStorage.getItem("wordlist_options"));

                    let comparison = [];
                    for(k in O) comparison.push(Object.keys(O[k]).join());
                    comparison = comparison.join();

                    if(comparison != listOptions.map(e => Object.keys(e).join()).join()){
                        for(let i = 0; i < listOptions.length; i++){
                            for(k in listOptions[i]){
                                if(typeof(O[categories[i][0]][k]) == "undefined"){
                                    O[categories[i][0]][k] = false;
                                }
                            }
                            for(k in O[categories[i][0]]){
                                if(!Object.keys(listOptions[i]).includes(k)){
                                    delete O[categories[i][0]][k];
                                }
                            }
                        }
                    }
                    this.state.options = O;
                    localStorage.setItem("wordlist_options", JSON.stringify(this.state.options));
                    this.forceUpdate();
                    this.handleRandomize(false);
                    return;
                }catch(err){
                    console.error(err);
                    localStorage.removeItem("wordlist_options");
                }
            }
            for(let i = 0; i < listOptions.length; i++){
                this.state.options[categories[i][0]] = listOptions[i];
            }
            this.forceUpdate();
            this.handleRandomize(false);
        };
        getOptionsLoop(0, initOptions);
    }

    handleHold(cat){
        let h = this.state.held;
        h[cat] = h[cat] ? false : true;
        this.setState({
            held: h
        });
    }

    handleRandomize(flag=true){
        document.querySelector("#randomize-button").disabled = true;
        if(flag){
            header = document.querySelector(".nav-header").textContent;
            lastLetter = header.slice(-1);
            firstLetter = header.slice(0, 1);
            header = header.slice(1, -1);
            for(let i = 0; i < 10; i++){
                let char = header.charAt(Math.floor(Math.random() * header.length));
                header = header.replace(char, "");
                header += char;
            }
            header = firstLetter + header + lastLetter;
            document.querySelector(".nav-header").textContent = header;
        }
        let excludes = [];
        for(x in this.state.options){
            for(y in this.state.options[x]){
                if(!this.state.options[x][y]){
                    excludes.push(y);
                }
            }
        }
        excludes = excludes.length ? "?exclude=" + excludes.join(",") : "";
        ajax("/generate" + excludes).then(
            (response) => {
                document.querySelector("#randomize-button").disabled = false;
                if(this.state.prompt){
                    let newPrompt = this.state.prompt.split(",").map((e, i) =>
                        this.state.held[this.state.listCats[i][0]] ? e : response.split(",")[i]
                    );
                    this.setState({
                        prompt: newPrompt.join(",")
                    });
                }else{
                    this.setState({prompt: response});
                }
            },
            (err) => {
                document.querySelector("#randomize-button").disabled = false;
                console.error(err);
            }
        );
    }

    handleCopy(){
        const copyText = this.state.prompt.split(",").join(" ");
        let hiddenInput = document.createElement("textarea");
        hiddenInput.value = copyText;
        hiddenInput.style.opacity = 0;
        document.body.appendChild(hiddenInput);
        hiddenInput.focus();
        hiddenInput.select();
        document.execCommand("copy");
        document.body.removeChild(hiddenInput);
        
        let tags = document.querySelectorAll(".generator-output > span");
        [].forEach.call(tags, e => {
            e.style.animation = "copytext 0.4s";
            setTimeout(() => {
                e.style.animation = null;
            }, 500);
        });
    }

    handleCategorySelect(selection){
        this.setState({
            category: selection
        });
    }

    handleOptionCheck(selection){
        let o = this.state.options;
        o[this.state.category][selection] = o[this.state.category][selection] ? false : true;
        this.setState({options: o});
        localStorage.setItem("wordlist_options", JSON.stringify(this.state.options));
    }

    handleOptionCheckMany(flag){
        let bool = flag.includes("all") ? true : false;
        let o = this.state.options;
        for(k in o[this.state.category]){
            if(k.includes(this.state.searchbar)){
                o[this.state.category][k] = bool;
            }
        }
        this.setState({options: o});
        localStorage.setItem("wordlist_options", JSON.stringify(this.state.options));
        [].forEach.call(document.querySelectorAll("input[type=checkbox]"), e => {
            e.checked = bool;
        });
    }

    handleOptionSearch(value){
        this.setState({
            searchbar: value
        });
    }

    render(){
        return (
            <div className="container">
                <GeneratorMain onRandomize={this.handleRandomize} onCopy={this.handleCopy} prompt={this.state.prompt} categories={this.state.listCats.map(e => e[0])} onElementClick={this.handleHold} heldData={this.state.held} />
                <GeneratorOptions onCheckMany={this.handleOptionCheckMany} onCategorySelect={this.handleCategorySelect} category={this.state.category} options={this.state.options} categories={this.state.listCats} onCheck={this.handleOptionCheck} onSearch={this.handleOptionSearch} search={this.state.searchbar}/>
            </div>
        )
    }
}

class GeneratorMain extends React.Component{
    render(){
        return (
            <div className="generator">
                <GeneratorOutput heldData={this.props.heldData} prompt={this.props.prompt} categories={this.props.categories} onElementClick={this.props.onElementClick}/>
                <ButtonPanel onRandomize={this.props.onRandomize} onCopy={this.props.onCopy}/>
            </div>
        )
    }
}

class GeneratorOutput extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        this.props.onElementClick(e.target.id);
    }

    render(){
        const prompt = this.props.prompt.split(",");
        const listKeys = this.props.categories;
        const listComponents = prompt.map((e, i) => {
            if(e.trim() != "False"){
                return <span className={this.props.heldData[listKeys[i]] ? "held" : ""} key={listKeys[i]} id={listKeys[i]} onClick={this.handleClick}>{e}</span>
            }
        });
        return (
            <div className="generator-output">
                {listComponents}
            </div>
        )
    }
}

class ButtonPanel extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        switch(e.target.textContent){
            case "randomize":
                this.props.onRandomize();
                break;
            case "copy":
                this.props.onCopy();
                break;
        }
    }

    render(){
        return (
            <div className="button-panel">
                <button id="randomize-button" onClick={this.handleClick}>randomize</button>
                <button onClick={this.handleClick}>copy</button>
            </div>
        )
    }
}

class GeneratorOptions extends React.Component{
    constructor(props){
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleCheckMany = this.handleCheckMany.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleCheckMany(e){
        this.props.onCheckMany(e.target.id);
    }

    handleCheck(selection){
        this.props.onCheck(selection);
    }

    handleSearch(value){
        this.props.onSearch(value);
    }

    render(){
        return (
            <div className="generator-options">
                <GeneratorOptionsSelect category={this.props.category} onCategorySelect={this.props.onCategorySelect} categories={this.props.categories}/>
                <GeneratorOptionsSearchBar onSearch={this.handleSearch} />
                <button className="mark-all-none" id="mark-all" onClick={this.handleCheckMany}>mark</button>
                <button className="mark-all-none" id="mark-none" onClick={this.handleCheckMany}>unmark</button>
                <GeneratorOptionsList options={this.props.options[this.props.category]} onCheck={this.handleCheck} search={this.props.search}/>
            </div>
        )
    }
}

class GeneratorOptionsSelect extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.props.onCategorySelect(e.target.value);
    }

    render(){
        const listOpts = this.props.categories;
        const mapOpts = listOpts.map(e => 
            <option key={e[0]} value={e[0]}>
                {e[1]}
            </option>
        );
        return (
            <select value={this.props.category} onChange={this.handleChange}>
                {mapOpts}
            </select>
        )
    }
}

class GeneratorOptionsSearchBar extends React.Component{
    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(e){
        this.props.onSearch(e.target.value);
    }

    render(){
        return (
            <input type="text" placeholder="search" onChange={this.handleSearch}></input>
        )
    }
}

class GeneratorOptionsList extends React.Component{
    constructor(props){
        super(props);
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck(e){
        this.props.onCheck(e.target.nextElementSibling.textContent)
    }

    render(){
        let listOpts;
        try{
            listOpts = Object.keys(this.props.options);

            if(this.props.search.length > 0){
                listOpts = listOpts.filter(e => e.includes(this.props.search));
            }
            listOpts.sort();
            listOpts = listOpts.map(k => 
                <div key={k}>
                    <input type="checkbox" value={k} defaultChecked={this.props.options[k]} onChange={this.handleCheck} />
                    <label>{k}</label>
                </div>
            );
        }catch(err){
            listOpts = [];
        }
        return (
            <div className="generator-options-list">
                {listOpts}
            </div>
        )
    }
}

class App extends React.Component{
    render(){
        return (
            <div>
                <NavBar />
                <Generator />
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.querySelector("#root")
);

function ajax(url){
    return new Promise((success, failure) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    success(xhr.responseText);
                }else{
                    failure(xhr.status);
                }
            }
        };
        xhr.send();
    });
}
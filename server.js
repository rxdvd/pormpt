const spawn = require("child_process").spawnSync;
const app = require("express")();

app.set("port", (process.env.PORT || 5000)); //heroku

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get("/css/:f", (req, res) => {
    res.sendFile(__dirname + "/css/" + req.params.f)
});

app.get("/js/:f", (req, res) => {
    res.sendFile(__dirname + "/js/" + req.params.f)
});

app.get("/generate", (req, res) => {
    let pythonParams = ["generator.py", "-A"];
    if(typeof(req.query.exclude) != "undefined"){
        pythonParams.push("-x");
        pythonParams.push(req.query.exclude);
    }
    const data = spawn("python3", pythonParams).stdout;
    res.send(data.toString());
});

app.get("/list/:f", (req, res, next) => {
    const data = spawn("python3", ["list.py", req.params.f]).stdout;
    if(!data.toString().includes("false")){
        res.send(data.toString().replace("\n", ""));
    }else{
        res.status(404);
        res.send("nothing but ghosts here...");
    }
});

app.listen(app.get("port"), () => console.log("listening"));
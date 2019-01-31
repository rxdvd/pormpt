const spawn = require("child_process").spawn;
const app = require("express")();
const port = 8888;

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
    const pythonProcess = spawn("python3", pythonParams);
    pythonProcess.stdout.on("data", (data) => {
        res.send(data.toString());
    });
});

app.get("/list/:f", (req, res, next) => {
    const pythonProcess = spawn("python3", ["list.py", req.params.f]);
    pythonProcess.stdout.on("data", (data) => {
        if(!data.toString().includes("false")){
            res.send(data.toString().replace("\n", ""));
        }else{
            next();
        }
    });
});

app.all("*", (req, res) => {
    res.status(404);
    res.send("404");
});

app.listen(port, () => console.log("listening on port :8888"));
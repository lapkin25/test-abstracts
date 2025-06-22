

async function pyodide_init() {
    //console.log("Starting...");
    let pyodide = await loadPyodide();
    //console.log("Pyodide loaded");
    
    // interruptBuffer[0] = 0;
    // pyodide.setInterruptBuffer(interruptBuffer);

    return pyodide;
}

// let pyodideReadyPromise = pyodide_init();

async function pyodide_load_packages(pyodideReadyPromise, package_names)
{
    let pyodide = await pyodideReadyPromise;
    await pyodide.loadPackage(package_names);
}

async function pyodide_load_packages_from_code(pyodideReadyPromise, code)
{
    let pyodide = await pyodideReadyPromise;
    await pyodide.loadPackagesFromImports(code);
}

async function pyodide_set_stdout(pyodideReadyPromise, cb)
{
    let pyodide = await pyodideReadyPromise;
    pyodide.setStdout({batched: cb});
}

async function pyodide_set_stdin(pyodideReadyPromise, cb)
{
    let pyodide = await pyodideReadyPromise;
    pyodide.setStdin({stdin: cb});
}

function pyodide_evaluate_python(pyodide, codeString) {
    var result = {
        out: '',
        hasError: false
    };

    try {
        result.out = pyodide.runPython(codeString);

    } catch (err) {
        result.hasError = true;
        result.out = err;
    }

    return result;
}

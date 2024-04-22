

/*
TODO:
use workers
Async work
canvas, matplot, sliders, etc. interactive elements
Остановка кода по кнопке и таймауту
сообщение о скачивающихся пакетах
строка состояния
*/

let editor_system_initialized = false;
let editorModules = new Map();
let moduleArray = new Array();


async function onClickRun(e)
{
    let editorID = e.currentTarget.getAttribute("editor-id");
    let editor = moduleArray[editorID];
    if(!editor.runing)
    {
        editor_output_add_line(editor, "Wait...");
        
        editor.pyodide = await editor.pyodideReadyPromise;
        
        let codeStr = editor_get_string(editor);
        await pyodide_load_packages_from_code(editor.pyodideReadyPromise, codeStr);

        editor.running = true;
        
        let func = editor.runCallback;
        if (func != undefined)
        {
            func();
        }
        else
        {
            editor_output_add_line(editor, "Error: OnClickRun callback is not registered!");
        }

        editor.running = false;
    }
    else
    {
        editor_output_add_line(editor, "Code is already running...");
    }
}

function convert_to_string(stdin_value)
{
    if(typeof stdin_value == 'string')
    {
        return stdin_value;
    }
    else if(typeof stdin_value == 'number' || typeof stdin_value == 'bigint')
    {
        return stdin_value.toString();
    }
}

function editor_run_python(editor, stdin_value)
{
    if(Array.isArray(stdin_value))
    {
        editor.stdin = stdin_value.map(convert_to_string);
    }
    else
    {
        editor.stdin = [ convert_to_string(stdin_value) ];
    }

    editor.stdout.length = 0;

    let codeStr = editor_get_string(editor);
    let result = pyodide_evaluate_python(editor.pyodide, codeStr);

    editor.stdin_call_count = 0;
    editor.stdin.length = 0;
    return result;
}

function editor_interrupt(editor)
{

}

function editor_output_add_line(editor, lineStr)
{
    editor.elements.output.innerHTML += `<span>${lineStr}</span>`;
}

function editor_output_set_text(editor, lineStr)
{
    editor.elements.output.innerHTML = `<span>${lineStr}</span>`;
}

function editor_output_clear(editor)
{
    editor.elements.output.innerHTML = '';
}

function editor_find(module_name)
{
    let moduleID = editorModules.get(module_name);
    if(moduleID != undefined)
    {
        return moduleArray[moduleID];
    }

    return undefined;
}

var editor_theme_name = 'my-unique-theme123';
function editor_is_dark()
{
    return editor_theme_name == 'dark';
}

function parseHTML()
{
    var isDarkTheme = editor_is_dark();
    var placeholderCollection = document.getElementsByTagName("python-editor");
    for(let placeholder of placeholderCollection)
    {
        let moduleNameAttr = placeholder.attributes["module-name"];
        if(moduleNameAttr == undefined)
        {
            console.warn(`Warning: tag 'python-editor' has no attribute 'module-name'`);
            continue;
        }

        let module_name = moduleNameAttr.value;
        let module = editor_find(module_name);
        if(module == undefined)
        {
            console.warn(`Warning: module ${module_name} is not created!`);
            continue;
        }

        if(module.initialized)
        {
            console.warn(`Warning: it seems to be repeating module neme ${module_name}`);
            continue;
        }

        if(isDarkTheme)
        {
            module.elements.output.classList.add('editor-dark');
        }

        placeholder.appendChild(module.elements.output);
        placeholder.insertBefore(module.elements.wrapper, module.elements.output);
        placeholder.insertBefore(module.elements.buttonRun, module.elements.wrapper);

        module.editor = editorBundle.createEditor(module.elements.wrapper, module.predefinedStr, isDarkTheme);

        module.initialized = true;
    }

    for(let module of moduleArray)
    {
        if(!module.initialized)
        {
            console.warn(`Warning: module ${module.name} has no HTML placeholder.`);
        }
    }
}

function editor_register_run_callback(editor, callback_fn)
{
    //testFunctions.set(module_name, callback_fn);
    editor.runCallback = callback_fn;
}

function editor_set_string(editorObj, str)
{
    //console.log("set string: " + str);
    //console.log(editorObj.editor);

    if(editor_system_initialized)
    {
        editorObj.editor.state.doc.setValue(str);
    }
    else
    {
        editorObj.predefinedStr = str;
    }

    pyodide_load_packages_from_code(editorObj.pyodideReadyPromise, str);
}

function editor_get_string(editorObj)
{
    if(editor_system_initialized)
    {
        return editorObj.editor.state.doc.toString();
    }
    else
    {
        return editorObj.predefinedStr;
    }
}

function initEditorSystem()
{
    parseHTML();

    editor_system_initialized = true;
    console.log("Editor API initialized");
}

function initEditorSystemOnce()
{
    if(!editor_system_initialized)
    {
        initEditorSystem();
    }
}

function editor_create(module_name)
{
    if(editorModules.has(module_name))
    {
        console.warn(`Warning: module ${module_name} is already created!`);
        return;
    }

    var newIdx = moduleArray.length;
    
    /* Creating button */
    let buttonText = document.createTextNode("Run");
    let buttonEl = document.createElement("button");
    buttonEl.classList.add('editor-button-run');
    buttonEl.appendChild(buttonText);
    buttonEl.addEventListener("click", onClickRun);
    buttonEl.setAttribute("editor-id", newIdx);

    /* Creating wrapper */
    let editorWrapperEl = document.createElement("div");
    editorWrapperEl.classList.add('editor-wrapper');

    /* Creating output */
    let outputEl = document.createElement("pre");
    outputEl.classList.add('editor-output');

    let editor = {
        name: module_name,
        stdin: new Array(),
        stdin_call_count: 0,
        stdout: new Array(),
        initialized: false,
        running: false,
        editor: undefined,
        runCallback: undefined,
        predefinedStr: '',
        pyodideReadyPromise: pyodide_init(),
        elements: {
            wrapper: editorWrapperEl,
            buttonRun: buttonEl,
            output: outputEl
        }
    };

    editor_register_stdout(editor, (msg) => {
        editor.stdout.push(msg);
    });

    editor_register_stdin(editor, () => {
        if(editor.stdin_call_count < editor.stdin.length)
        {
            return editor.stdin[editor.stdin_call_count++];
        }
        return undefined;
    });

    moduleArray.push(editor);
    editorModules.set(module_name, newIdx);

    return moduleArray[newIdx];
}

function editor_register_stdin(editor, stdin_cb)
{
    pyodide_set_stdin(editor.pyodideReadyPromise, stdin_cb);
}

function editor_register_stdout(editor, stdout_cb)
{
    pyodide_set_stdout(editor.pyodideReadyPromise, stdout_cb);
}

function editor_change_theme(dark)
{
    let effect = editorBundle.toggleEditorTheme(dark);
    for (mod of moduleArray)
    {
        if(mod.initialized)
        {
            mod.editor.dispatch({
                effects: effect
            });
        }
    }

    if(dark)
    {
        for (mod of moduleArray)
        {
            if(mod.initialized)
            {
                mod.elements.output.classList.add('editor-dark');
            }
        }
    }
    else
    {
        for (mod of moduleArray)
        {
            if(mod.initialized)
            {
                mod.elements.output.classList.remove('editor-dark');
            }
        }
    }
}

var isDark = false;
function toggleEditorTheme()
{
    isDark = !isDark;

    editor_change_theme(isDark);
}

setInterval(() => {
    let theme_name = document.documentElement.dataset.theme;
    if(theme_name != undefined && theme_name != editor_theme_name)
    {
        editor_change_theme(theme_name == "dark");
        editor_theme_name = theme_name;
    }
}, 400);

// https://www.w3schools.com/jsref/event_onload.asp
document.addEventListener("DOMContentLoaded", (event) => {
    //Проверить на двойное срабатывание
    initEditorSystemOnce();
});

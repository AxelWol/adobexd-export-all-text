const { Artboard, Rectangle, Ellipse, Text, Color, Group, selection } = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;

let panel;

// Markup for the panel
function create() {
    const HTML =
        `<style>
            .break {
                flex-wrap: wrap;
            }
            label.row > span {
                color: #8E8E8E;
                width: 20px;
                text-align: right;
                font-size: 9px;
            }
            label.row input {
                flex: 1 1 auto;
            }
            .show {
                display: block;
            }
            .hide {
                display: none;
            }
        </style>

        <form method="dialog" id="main">
            <div class="row break">
                <label class="row">
                    <span>File</span>&nbsp;
                    <input type="number" uxp-quiet="true" id="txtFilename" value="" placeholder="text-export.csv" />
                </label>
            </div>
            <footer>
                <div><button id="export" type="click" uxp-variant="cta">Export</button></div>
                <div>&nbsp;</div>
                <div><button id="import" type="click" uxp-variant="cta">Import</button></div>
            </footer>
        </form>

        <p id="warning">This plugin requires you to enter a filename to export/import all text resources to/from.
        Please enter a filename (only the name). The file and path will be picked in the following dialog.<br />
        <br />The CSV format is: ArtboardId;ArtboardName;TextId;Text<br />
        <br />Contact and help: axelwolters@hotmail.com</p>
        `;

    function importAllText() {
        console.log("Init");
        const { editDocument } = require("application");
        const fileName = Number(document.querySelector("#txtFilename").value);
        
        editDocument({ editLabel: "Import all text resources" }, 
            async function (selection, root) {
            console.log("----Start Action Import");

            await readFromFile(fileName, root);

            console.log("----End Action");
            });
        }        

    function exportAllText() {
        console.log("Init");
        const { editDocument } = require("application");
        const fileName = Number(document.querySelector("#txtFilename").value);

        editDocument({ editLabel: "Export all text resources" }, 
            async function (selection, root) {
            console.log("----Start Action Export");

            // File buffer
            let fileContent = [];
            // Add UTF-8 BOM
            fileContent.push("\ufeff");
            // Add CSV Header
            fileContent.push("ArtboardId;ArtboardName;TextId;Text" + "\r\n");

            // console.log(root);
            root.children.forEach(node => {
                if (node instanceof Artboard) {
                    // Expand artboard
                    let artboard = node;
                    // console.log("Found artboard: " + artboard.name);
                    artboard.children.forEach(child => {
                        extractText(fileContent, artboard.name, artboard.guid, child);
                    });
                } else if (node instanceof Text) {
                    extractText(fileContent, "No Artboard", "00000000-0000-0000-0000-000000000000", node);
                }
                else {
                    // No artboard, no Text
                }
            });
            
            let allContent = fileContent.join('');
            console.log("Collected: \r\n" + allContent);
            await writeToFile(fileName, allContent);
            console.log("----End Action");
        });
    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("#export").addEventListener("click", exportAllText);
    panel.querySelector("#import").addEventListener("click", importAllText);

    return panel;
}

// Show panel
function show(event) {
    console.log("Show");
    if (!panel) event.node.appendChild(create());
}

// Update panel
function update() {
    console.log("Update");
    let form = document.querySelector("form");
    let warning = document.querySelector("#warning");
    form.className = "show";
    warning.className = "show";
}

// Main entry point
module.exports = {
    panels: {
        exportAllTextFileDialog: {
            show,
            update
        }
    }
};

// Helper
async function readFromFile(fileName, root) {

    // Create a filename for the file to read the data from
    let realFileName = "text-export.csv";
    if (fileName) {
        realFileName = fileName;
    }

    // Display file picker for selecting a file to open
    const file = await fs.getFileForOpening({allowMultiple: false, types: ["csv"]});
    if (!file) {
        // no files selected
        return console.log("User canceled file picker.");
    } else {
        console.log("User picked file: " + file.name);
        const data = await file.read();
        console.log("File " + realFileName + " opened.");
        // console.log(data);
        const grid = parseFileData(data);
        console.log("Read " + grid.length + " lines.");

        console.log("Grid parsed. Starting replacement...")
        console.log(root);
        root.children.forEach(node => {
            if (node instanceof Artboard) {
                // Expand artboard
                let artboard = node;
                // console.log("Found artboard: " + artboard.name);
                artboard.children.forEach(child => {
                    replaceText(grid, artboard.name, artboard.guid, child);
                });
            } else if (node instanceof Text) {
                replaceText(grid, "No Artboard", "00000000-0000-0000-0000-000000000000", node);
            }
            else {
                // No artboard, no Text
            }
        });
    }
}

async function writeToFile(fileName, content) {

    // Create a filename for a file that will store the rendition
    let realFileName = "text-export.csv";
    if (fileName) {
        realFileName = fileName;
    }

    // Get a folder by showing the user the system folder picker
    const file = await fs.getFileForSaving(realFileName, { types: [ "csv"]});

    // Exit if user doesn't select a folder
    if (!file) return console.log("User canceled file picker.");

    file.write(content);
    console.log("Created output file: " + realFileName);
}

function parseFileData(csvText) {
    const separator = ';';
    const newline = '\r';
    var grid = parseCsv(csvText, separator, newline);
    return grid;
}

function parseCsv(data, fieldSep, newLine) {
    fieldSep = fieldSep || ',';
    newLine = newLine || '\n';
    var nSep = '\x1D';
    var qSep = '\x1E';
    var cSep = '\x1F';
    var nSepRe = new RegExp(nSep, 'g');
    var qSepRe = new RegExp(qSep, 'g');
    var cSepRe = new RegExp(cSep, 'g');
    var fieldRe = new RegExp('(?<=(^|[' + fieldSep + '\\n]))"(|[\\s\\S]+?(?<![^"]"))"(?=($|[' + fieldSep + '\\n]))', 'g');
    var grid = [];
    data.replace(/\r/g, '').replace(/\n+$/, '').replace(fieldRe, function(match, p1, p2) {
        return p2.replace(/\n/g, nSep).replace(/""/g, qSep).replace(/,/g, cSep);
    }).split(/\n/).forEach(function(line) {
        var row = line.split(fieldSep).map(function(cell) {
            return cell.replace(nSepRe, newLine).replace(qSepRe, '"').replace(cSepRe, ',');
        });
        grid.push(row);
    });
    return grid;
}

function replaceText(grid, artboardName, artboardId, node)
{
    // console.log("Checking node type");
    if (node === undefined) {
        return;
    } else if (node instanceof Text) {
        let text = node.text;
        // console.log("Found Text: " + text + " with ID: " + node.guid);
        processEntry(grid, artboardId, artboardName, node);
    } else if (node instanceof Group) {
        // console.log("Expanding group" + node.name + ":");
        node.children.forEach(item => {
            replaceText(grid, artboardName, artboardId, item);
        });
    } else {
        //console.log("Ignoring: " + node.name);
    }
}

function extractText(ct, artboardName, artboardId, node)
{
    if (node === undefined) {
        return;
    } else if (node instanceof Text) {
        let text = node.text;
        // console.log("Found Text: " + text + " with ID: " + node.guid);
        writeLine(ct, artboardId, artboardName, node.guid, text);
    } else if (node instanceof Group) {
        // console.log("Expanding group" + node.name + ":");
        node.children.forEach(item => {
            extractText(ct, artboardName, artboardId, item);
        });
    } else {
        // console.log("Ignoring: " + node.name);
    }
}

function processEntry(grid, artboardId, artboardName, node) {
    // console.log("Process entry with id: " + node.guid);
    const nodeId = node.guid;
    const len = grid.length;
    for (var i=0; i<len; i++) {
        const item = grid[i];
        const gId = item[2];
        if (node.guid === gId) {
            console.log("Found grid item: " + item[2]);
            const newText = item[3];
            node.text = replaceTokens(newText);
            console.log("Replaced text with new value: " + node.text);
            break;
        }
    }
}

function replaceTokens(inp) {
    let out = inp.replace('{{semicolon}}', ';');
    out = out.replace('{{cr}}{{lf}}', '\r\n');
    out = out.replace('{{cr}}{{lf}}', '\n\r');
    out = out.replace('{{cr}}', '\r');
    out = out.replace('{{lf}}', '\n');
    out = out.replace('{{tab}}', '\t');
    out = out.replace('{{x1}}', '\uee88');
    out = out.replace('{{*}}', '\uee80');
    out = out.replace('{{_}}', '\x91');
    out = out.replace('{{x2}}', '\x87');
    out = out.replace('{{nul}}', '\x00');
    out = out.replace('{{soh}}', '\x01');
    out = out.replace('{{stx}}', '\x02');
    out = out.replace('{{etx}}', '\x03');
    out = out.replace('{{eot}}', '\x04');
    out = out.replace('{{enq}}', '\x05');
    out = out.replace('{{ack}}', '\x06');
    out = out.replace('{{bel}}', '\x07');
    out = out.replace('{{bs}}', '\x08');
    out = out.replace('{{tab}}', '\x09');
    out = out.replace('{{lf}}', '\x0a');
    out = out.replace('{{vt}}', '\x0b');
    out = out.replace('{{ff}}', '\x0c');
    out = out.replace('{{cr}}', '\x0d');
    out = out.replace('{{so}}', '\x0e');
    out = out.replace('{{si}}', '\x0f');
    return out;
}

// s -> s
function strip(s) {
        return s.split('').filter(function (x) {
            var n = x.charCodeAt(0);
 
            return 31 < n;
        }).join('');
    }

function writeLine(ct, ai, an, ti, t) {
        // create CSV entry
        let filteredText = t.replace(';', '{{semicolon}}');
        filteredText = filteredText.replace('\r\n', '{{cr}}{{lf}}');
        filteredText = filteredText.replace('\n\r', '{{cr}}{{lf}}');
        filteredText = filteredText.replace('\r', '{{cr}}');
        filteredText = filteredText.replace('\n', '{{lf}}');
        filteredText = filteredText.replace('\t', '{{tab}}');
        filteredText = filteredText.replace('\uee88', '{{x1}}');
        filteredText = filteredText.replace('\uee80', '{{*}}');
        filteredText = filteredText.replace('\x91', '{{_}}');
        filteredText = filteredText.replace('\x87', '{{x2}}');
        filteredText = filteredText.replace('\x00', '{{nul}}');
        filteredText = filteredText.replace('\x01', '{{soh}}');
        filteredText = filteredText.replace('\x02', '{{stx}}');
        filteredText = filteredText.replace('\x03', '{{etx}}');
        filteredText = filteredText.replace('\x04', '{{eot}}');
        filteredText = filteredText.replace('\x05', '{{enq}}');
        filteredText = filteredText.replace('\x06', '{{ack}}');
        filteredText = filteredText.replace('\x07', '{{bel}}');
        filteredText = filteredText.replace('\x08', '{{bs}}');
        filteredText = filteredText.replace('\x09', '{{tab}}');
        filteredText = filteredText.replace('\x0a', '{{lf}}');
        filteredText = filteredText.replace('\x0b', '{{vt}}');
        filteredText = filteredText.replace('\x0c', '{{ff}}');
        filteredText = filteredText.replace('\x0d', '{{cr}}');
        filteredText = filteredText.replace('\x0e', '{{so}}');
        filteredText = filteredText.replace('\x0f', '{{si}}');
        filteredText = strip(filteredText);

        let line = ai + ";" + an + ";" + ti + ";" + filteredText;
        // console.log(line);
        ct.push(line + "\r\n");
}

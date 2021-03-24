const { Artboard, Rectangle, Ellipse, Text, Color, Group, selection } = require("scenegraph");
const { alert, error } = require("../lib/dialogs.js");
const fs = require("uxp").storage.localFileSystem;

let panel;

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
                    <span>Filename:&nbsp;</span>
                    <input type="number" uxp-quiet="true" id="txtFilename" value="" placeholder="Filename" />
                </label>
            </div>
            <footer><button id="ok" type="submit" uxp-variant="cta">Start Export</button></footer>
        </form>

        <p id="warning">This plugin requires you to enter a filename to export all text resources to. Please enter a filename.</p>
        `;

    function exportAllText() {
        console.log("Init");
        const { editDocument } = require("application");
        const fileName = Number(document.querySelector("#txtFilename").value);

        editDocument({ editLabel: "Export all text resources" }, function (selection, root) {
            console.log("----Start Action");

            console.log(root);

            root.children.forEach(node => {
                if (node instanceof Artboard) {
                    // Expand artboard
                    let artboard = node;
                    // console.log("Found artboard: " + artboard.name);
                    artboard.children.forEach(child => {
                        extractText(artboard.name, artboard.guid, child);
                    });
                } else if (node instanceof Text) {
                    extractText("No Artboard", "00000000-0000-0000-0000-000000000000", node);
                }
                else {
                    // No artboard, no Text
                }
            });
        
            console.log("----End Action");
        });
    }

    function extractText(artboardName, artboardId, node)
    {
        if (node === undefined) {
            return;
        } else if (node instanceof Text) {
            let text = node.text;
            // console.log("Found Text: " + text + " with ID: " + node.guid);
            writeLine(artboardId, artboardName, node.guid, text);
        } else if (node instanceof Group) {
            // console.log("Expanding group" + node.name + ":");
            node.children.forEach(item => {
                extractText(artboardName, artboardId, item);
            });
        } else {
            // console.log("Ignoring: " + node.name);
        }
    }

    function writeLine(ai, an, ti, t) {
            // create CSV entry
            let filteredText = t.replace(';', '\;');
            let line = ai + ";" + an + ";" + ti + ";" + filteredText;
            console.log(line);
    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("form").addEventListener("submit", exportAllText);

    return panel;
}

function show(event) {
    console.log("Show");
    if (!panel) event.node.appendChild(create());
}

function update() {
    console.log("Update");
    let form = document.querySelector("form");
    let warning = document.querySelector("#warning");
    form.className = "show";
    warning.className = "show";
}


module.exports = {
    panels: {
        exportAllTextFileDialog: {
            show,
            update
        }
    }
};

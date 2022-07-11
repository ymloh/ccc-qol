all_lines = {
    "lines_speaking": {
        "section_title": "Intro",
        "lines": {
            "details": {"line": "You're speaking with [name, string], thanks for the details. Let me have a look for you now"},
            "case no.": {"line": "You're speaking with [name, string], thanks for the case number. Let me have a look for you now"},
            "track no.": {"line": "You're speaking with [name, string], thanks for the tracking number. Let me have a look for you now"},
            "track no. confirm": {"line": "You're speaking with [name, string], thanks for the tracking number. Could you please also confirm the name and address on the parcel?"},
            "thanks": {"line": "You're speaking with [name, string], thanks for getting in touch."},
            "confirm track/receiver": {"line": "You're speaking with [name, string], thanks for getting in touch. Sure, could you please confirm the tracking number, receiver name and delivery address?"},
            "no physical scans": {"line": "You're speaking with [name, string], thanks for the details. I have checked and this parcel only has electronic manifest information. It has no physical scans"},
            "can't investigate": {"line": "You're speaking with [name, string], thanks for the details. I have checked and this parcel only has electronic manifest information. It has not been physically scanned into our network, so we can't investigate"},
            "have a look now": {"line": "Thanks for confirming those details. Let me have a look for you now"},
        }
    },
    "lines_concluding": {
        "section_title": "Concluding",
        "lines": {
            "still there?": {"line": "Are you still there?"},
            "anything else?": {"line": "Did you need anything else for the moment?"}, 
            "have a great day": {"line": "You're welcome. Have a great day"},
        }
    },
    "detailed": {
        "section_title": "Detailed",
        "lines": {
            "": {"line": ""},
        }
    },
    "overdue": {
        "section_title": "Overdue",
        "lines": {
            "few days": {
                "line": "Thanks for waiting. This parcel was estimated to be delivered by [date], so it is a few days overdue\
                        at this stage. We do have up to three weeks delay in the delivery network at the moment. Please log\
                        a case in the portal for this one under Late/Missing Parcel. Our team will monitor the parcel's\
                        progress and contact you back if the parcel is not delivered as expected by the end of this time",
            },
            "over two weeks": {
                "line": "Thanks for waiting. This parcel was expected to be delivered on [date], so it's over two weeks\
                overdue at this stage. Currently, there's delays of up to three weeks in the delivery network,\
                meaning that this could be delivered as late as [date]. We are asking our customers to log cases in\
                the portal under Late/Missing Parcel for these overdue parcels. Once a case has been logged, we will\
                monitor the parcel's progress and contact you back if the parcel is not delivered by the end of that\
                time",
            }
        }
    }
}

const valid_types = ["text", "date"]

function updateName() {
    for (const [k, v] of Object.entries(all_lines)) {
        for (let [kk, vv] of Object.entries(v["lines"])) {
            vv["line"] = vv["line"].replace("[name, string]", localStorage.getItem("name"))
            // console.log(vv["line"])
        }
    }
}

function newModal(fields, callback) {
    const modal = document.createElement("div")
    let userInput = {}
    for (const field of fields) {
        if (!field["label"] 
        || !field["type"] 
        || !valid_types.includes(field["type"])) {
            console.error(`Modal info incomplete, skipping this one: ${field["label"]} - ${field["type"]}.`)
            continue
        }
        const input = document.createElement("input")
        input.name = field["label"]
        input.type = field["type"]
        input.placeholder = field["label"]
        input.addEventListener("input", function() {
            userInput[field["label"]] = this.value
            // console.table(userInput)
        })
        modal.appendChild(input)
    }

    function closeModal() { modal.parentNode.removeChild(modal) }
    
    const buttonsDiv = document.createElement("div")
    // buttonsDiv.style = `display: flex; width: 50%; border: 2px solid red;`
    const doneButton = document.createElement("button")
    const cancelButton = document.createElement("button")
    cancelButton.innerText = "✖"
    cancelButton.addEventListener("click", closeModal)
    buttonsDiv.appendChild(cancelButton)
    doneButton.innerText = "✔"
    doneButton.addEventListener("click", () => {
        // console.log(userInput)
        callback(userInput)
        updateName()
        closeModal()
    })
    buttonsDiv.appendChild(doneButton)

    modal.appendChild(buttonsDiv)
    // modal.innerText = "Test"
    modal.classList.add("main_panel", "modal")
    return modal
}

window.addEventListener('load', () => {
    // check for existing config
    if (!localStorage.getItem("name")) {
        const askForName = newModal([
            { "label": "Name", "type": "text" }
        ], (userInput) => localStorage.setItem("name", userInput["Name"]))
        document.body.appendChild(askForName)
    } else {
        updateName()
    }

    const main_panel = document.querySelector(".main_panel")
    const preview_panel = document.querySelector("#preview")

    preview_panel.addEventListener('animationend', function() {
        this.classList.remove('copied')
    })

    for (const section in all_lines) {
        const lines_speaking_panel = document.createElement("div")
        lines_speaking_panel.classList.add("button_panel")

        const section_title_div = document.createElement("div")
        section_title_div.classList.add("title")
        section_title_div.innerText = all_lines[section]["section_title"]

        lines_speaking_panel.appendChild(section_title_div)

        let lines = all_lines[section]["lines"]

        for (const line_title in lines) {
            const button = document.createElement("button")
            button.innerText = line_title
            lines_speaking_panel.appendChild(button)
            const line = lines[line_title]["line"]

            button.addEventListener('mouseover', function() {
                preview_panel.innerText = line
            })

            
            button.addEventListener('mousedown', function() {
                navigator.clipboard.writeText(line)
                preview_panel.classList.remove('copied')
                void preview_panel.offsetWidth
                preview_panel.classList.add("copied")
                cooling_down = true
                // document.querySelector("#preview").classList.toggle("copied")
            })
        }
        main_panel.appendChild(lines_speaking_panel)
    }
})


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
            "POD": {"line": "Thanks for waiting. I've just emailed you the POD with reference number [Ref no., text] in the subject line"},
            "Ret to Sender req": {"line": "Thanks for waiting. I've sent the return to sender request and your reference number is [Ref no., text].\nThis parcel should receive a scan advising it has been returned to sender within 24 hours"},
            "checking RMC now": {"line": "Thanks for the details. I am checking the Returned Mail Centre now"},
        }
    },
    "overdue": {
        "section_title": "Overdue",
        "lines": {
            "few days": {
                "line": "Thanks for waiting. This parcel was estimated to be delivered by [Estimated delivery date, date], so it is a few days overdue \
at this stage. We do have up to three weeks delay in the delivery network at the moment. Please log \
a case in the portal for this one under Late/Missing Parcel. Our team will monitor the parcel's \
progress and contact you back if the parcel is not delivered as expected by the end of this time",
            },
            "over two weeks": {
                "line": "Thanks for waiting. This parcel was expected to be delivered on [Estimated delivery date, date], so it's over two weeks \
overdue at this stage. Currently, there's delays of up to three weeks in the delivery network, \
meaning that this could be delivered as late as [Latest delivery date, date]. We are asking our customers to log cases in \
the portal under Late/Missing Parcel for these overdue parcels. Once a case has been logged, we will \
monitor the parcel's progress and contact you back if the parcel is not delivered by the end of that \
time",
            },
            "may be sost": {"line": "Thanks for waiting. This parcel is very overdue for delivery and might be lost. Do you have a description of the contents so I can check our Returned Mail Centre?"},
        }
    },
    "conclude": {
        "section_title": "Concluding",
        "lines": {
            "LIT": {"line": "Thanks again for waiting. There are no matches for this item in the Returned Mail Centre and no \
further information on its whereabouts in the delivery network. As we have no further avenues for \
investigation, I'm sorry to advise this parcel is deemed lost in transit (LIT)"},
            "Log as Late/Missing": {"line": "Thanks for waiting. This parcel seems to have arrived at one of our delivery centres on [Arrival date, date], but for \
some reason did not go out for delivery. You will need to log a case in the portal under \"Late/Missing \
Parcel\" for this one so we can contact the delivery centre to check where the parcel is"},
            "Can't change addresses": {"line": "You're speaking with Yvonne, thanks for getting in touch. Customer Service can't change addresses - \
you will need to do this through the Redirect feature in the portal that you are in now, under the \
\"Manage your delivery\" section"},
            "Delivery issue": {"line": "Thanks for waiting. We have a photo of this delivery which I've emailed you with reference number \
[Reference no., text] in the subject line. If the customer does not recognise the photo, please log a case in the \
portal under \"Delivery Issue\" and we will contact the delivery centre to investigate where this was \
delivered to"},
            "overdue; investigate": {"line": "Thanks for waiting. This was expected to be delivered by [Expected delivered, date], so it is [it is ... overdue, text] overdue and needs to \
be investigated by our International team. They are not available on chat. You can contact them by \
either calling our business line on 13 11 18 and asking to be transferred, or you can log a case in the \
portal under Late/Missing Parcel and they will respond to you"}
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
    generateButtons()
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

        const inputDiv = document.querySelector("#input-div-template").cloneNode(true)
        inputDiv.style.display = "block"

        const label = inputDiv.querySelector("label")
        label.innerText = field["label"]
        
        const input = inputDiv.querySelector("input")
        input.name = field["label"]
        input.type = field["type"]
        if (field["type"] === 'date') {
            input.value = new Date().toISOString().substring(0, 10)
        }
        input.placeholder = field["label"]
        input.addEventListener("input", function() {
            userInput[field["label"]] = {"value": this.value, "type": field["type"]}
        })
        modal.appendChild(inputDiv)
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
        closeModal()
    })
    buttonsDiv.appendChild(doneButton)

    modal.appendChild(buttonsDiv)
    // modal.innerText = "Test"
    modal.classList.add("main_panel", "modal")

    document.body.appendChild(modal)
    return modal
}

function generateButtons() {
    const preview_panel = document.querySelector("#preview")
    const main_panel = document.querySelector(".main_panel")


    for (let elem of main_panel.querySelectorAll(":not(:first-child)")) elem.remove()

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
            let line = lines[line_title]["line"]

            button.addEventListener('mouseover', function() {
                preview_panel.innerText = line
            })

            let inputFields = line.match(/\[[\w\s]*,\s?\w+\]/g)


            if (!inputFields) {
                button.addEventListener('mousedown', function() {
                    navigator.clipboard.writeText(line)
                    preview_panel.classList.remove('copied')
                    void preview_panel.offsetWidth
                    preview_panel.classList.add("copied")
                    cooling_down = true
                    // document.querySelector("#preview").classList.toggle("copied")
                })
            } else {
                inputFields = inputFields.map(x => x.replace(/[\[\]]/g, "").split(", "))
                inputFields = inputFields.map(x => {return {"label": x[0], "type": x[1]}})
                button.addEventListener('mousedown', () => {
                    newModal(inputFields, (userInput) => {
                        let alteredLine = line
                        for (const [key, obj] of Object.entries(userInput)) {
                            // console.log(`replacing: \[${key},\s?\w+\]`)
                            let val
                            if (obj["type"] === "date") val = new Date(obj["value"]).toLocaleDateString('en-AU', {weekday: 'long', month: 'long', day: 'numeric'})
                            else val = obj["value"]
                            alteredLine = alteredLine.replace(new RegExp(`\\[${key},\\s?\\w+\\]`), val)
                        }
                        navigator.clipboard.writeText(alteredLine)
                    })
                })
            }
        }
        main_panel.appendChild(lines_speaking_panel)
    }

}

window.addEventListener('load', () => {
    // check for existing config
    if (!localStorage.getItem("name")) {
        newModal([
            { "label": "Name", "type": "text" }
        ], (userInput) => {
            localStorage.setItem("name", userInput["Name"]["value"])
            updateName()
        })
    } else {
        updateName()
    }

    const preview_panel = document.querySelector("#preview")

    preview_panel.addEventListener('animationend', function() {
        this.classList.remove('copied')
    })

    generateButtons()
})



        class Timeline {
            entries = [];
            constructor() {
                this.entries = [];
            }
            // addEntry(date,content){

            // }
            addEntry(entry) {
                this.entries.push(entry);
                this.sort();
            }
            sort() {
                this.entries = this.entries.sort(this.compare);
            }
            compare(d1, d2) {
                if (d1.date < d2.date) {
                    return -1;
                }
                if (d1.date > d2.date) {
                    return 1;
                }
                return 0;
            }
            getEntries() {
                return this.entries;
            }
        }
        class TimeElement {
            constructor(dateTime, content) {
                this.date = dateTime;
                this.content = content;
            }
        }
        var timeline = new Timeline();
        function loaded() {
            console.log("Loaded");
            //generateTimeline();
        }
        //TODO maybe refactor.
        function generateTimeline(entries) {

            let cssCode = document.getElementById('cssCode');
            let htmlCode = document.getElementById('htmlCode');
            let elements = entries;
            let latest = elements[elements.length - 1].date.getFullYear();
            let earliest = elements[0].date.getFullYear();
            let range = latest - earliest + 1;
            //generate CSS for elements.
            console.log(range);
            let tempRows = calculateTemplateRows(range);
            console.log(tempRows);
            let timelineCSS = `height:50vh;\n
                               display: grid;\n 
                               grid-template-columns:48% 1% auto;\n
                               grid-template-rows:${tempRows};\n`;
            let barCSS = `grid-column: 2/3;
                          grid-row: 1/${range*12};
                          border-radius: 10px;
                          background-color: #49a078;`;
            let cssString = `.timeline{${timelineCSS}}\n;
                             .bar{${barCSS}} `;
            let cssEntries = [];
            
            for (let x = 0; x < elements.length; x++) {
                //calculate row pos;
                let pos = x + 1;
                let calculatedRow = (latest - elements[x].date.getFullYear()) * 12 + (12 - elements[x].date.getMonth());

                let rowPos = (calculatedRow + 1) + "/" + (calculatedRow + 2);
                console.log(elements[x].date + " " + rowPos);
                let colPos = "1/2";
                let alignment = "right";
                if (pos % 2 == 0) {
                    colPos = "3/4";
                    alignment = "left";
                }
                let innerCSS = `text-align:${alignment};\npadding:10;\ngrid-column:${colPos };\ngrid-row:${rowPos};\n`;
                cssEntries.push(innerCSS);
                cssString += `.t${x + 1}{\n${innerCSS}}\n`;
            }
            cssCode.innerText = cssString;
            //generate HTML for elements
            let htmlString = `<div class="timeline" id="timeline" style="${timelineCSS}"><div class="bar" style="${barCSS}"></div>`;
            let outputHTML = '<div class="timeline" id="timeline"><div class="bar"></div>';

            for (let x = 0; x < elements.length; x++) {
                let templatedString = `<div class="t${x + 1}" style="${cssEntries[x]}">
                                        <div class="timelineDate">${elements[x].date.toLocaleDateString("en-US")}</div>
                                        <div class="timelineContent">${elements[x].content}</div>
                                      </div>`;
                let outputString = `<div class="t${x + 1}>
                                        <div class="timelineDate">${elements[x].date.toLocaleDateString("en-US")}</div>
                                        <div class="timelineContent">${elements[x].content}</div>
                                      </div>`;
                outputHTML += outputString;
                htmlString += templatedString;
            }
            htmlString += '</div>';
            htmlCode.innerText = outputHTML;
            document.getElementById("timelinePreview").innerHTML += htmlString;
        }
        /// 
        /// Calculate number of rows needed by total number of years displayed.
        function calculateTemplateRows(years) {
            returnStr = ''; //need to double check on string immutibility in js.
            let percent = 100 / (years * 12);
            console.log(percent);
            for (let x = 0; x < (years * 12); x++) {
                returnStr += percent + "% ";
            }
            returnStr += ";";
            return returnStr;
        }
        function createDate() {
            let cont = document.createElement('div');
            cont.className = 'formElement';
            let label = document.createElement('label');
            label.setAttribute('for', 'date');
            label.innerText = "Date:";
            let date = document.createElement('input');
            date.type = 'date';
            date.name = 'date';

            cont.appendChild(label);
            cont.appendChild(date);
            return cont;
        }
        function createText() {
            let cont = document.createElement('div');
            cont.className = 'formElement';
            let tLabel = document.createElement('label');
            tLabel.setAttribute('for', 'desc');
            tLabel.innerText = "Content:";
            let text = document.createElement('input');
            text.name = 'desc';
            cont.appendChild(tLabel);
            cont.appendChild(text);
            return cont;
        }
        function addEntry() {
            let element = document.getElementById("entries");
            let container = document.createElement('div');
            container.className = "entry";
            container.appendChild(createDate());
            container.appendChild(createText());
            element.appendChild(container);
        }
        function processEntries() {
            let entries = document.getElementsByClassName("entry");
            //console.log(entries);
            //timelineEntries = [];
            for (let x = 0; x < entries.length; x++) {
                let inputs = entries[x].getElementsByTagName('input');
                let time = inputs[0].value;
                let content = inputs[1].value;
                timeline.addEntry(new TimeElement(new Date(time), content));
            }


            generateTimeline(timeline.getEntries());
        }

        class Timeline {
            entries = [];
            constructor() {
                this.entries = [];
                this.numYears=0;
                this.numMonths = 0;
            }
            // addEntry(date,content){

            // }
            addEntry(entry) {
                this.entries.push(entry);
                this.sort();
                this.calculateRange();
            }
            calculateRange(){
                if(this.entries.length<=1){
                    this.numYears=0;
                    return;
                }
                let test = this.entries[this.entries.length-1].date - this.entries[0].date;
                this.numYears = (this.entries[this.entries.length-1].date.getFullYear()-this.entries[0].date.getFullYear());
                this.numMonths = (12 * this.numYears);
                this.numMonths += this.entries[this.entries.length-1].date.getMonth();
                this.numMonths -= this.entries[0].date.getMonth()+1;
                this.numMonths+=1;
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
        function getRange(earliest,latest){
            let years = latest.getFullYear()-earliest.getFullYear();
            let range  = 0;
            if(years <1){
                range = latest.getMonth();
            }else{
                range =  (12*years)+(latest.getMonth()+1);          // (12 * (years+1)) + latest.getMonth()+1;
            }
            return range+1;
        }

        function calculatePosition(latest, date){
            let years = latest.getFullYear()-date.getFullYear();
            let r = (12*years);
            if(years <1){
                return date.getMonth();
            }
            return r;
        }
        //TODO maybe refactor.
        function generateTimeline(timeline) {
            console.log(timeline.numMonths);
            let cssCode = document.getElementById('cssCode');
            let htmlCode = document.getElementById('htmlCode');

            let months = timeline.numMonths;
             let tempRows = calculateTemplateRows(months);
            console.log(months);
            let timelineCSS = `height:50vh;\n
                               display: grid;\n 
                               grid-template-columns:48% 1% auto;\n
                               grid-template-rows:${tempRows};\n`;
            let barCSS = `grid-column: 2/3;
                          grid-row: 1/${months};
                          border-radius: 10px;
                          background-color: #49a078;`;
            let cssString = `.timeline{${timelineCSS}}\n;
                             .bar{${barCSS}} `;
            let cssEntries = [];
            let newestYear = timeline.entries[timeline.entries.length-1].date.getFullYear();
            for(let x = 0 ; x< timeline.entries.length; x++){
                let m = timeline.entries[x].date.getMonth();
                let y = timeline.entries[x].date.getFullYear();
                let diff = timeline.numYears - (newestYear-y);
                let inverseMonths = 12 * diff;
                let startCol = timeline.numMonths-(m+inverseMonths);
                //console.log(m+" "+inverseMonths +" "+(timeline.numMonths-(m+inverseMonths)));
                let rowPos = (startCol-1 ) + "/" + (startCol );
                let colPos = "1/2";
                let alignment = "right";
                if (x % 2 == 0) {
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

            for (let x = 0; x < timeline.entries.length; x++) {
                let templatedString = `<div class="t${x + 1}" style="${cssEntries[x]}">
                                        <div class="timelineDate">${timeline.entries[x].date.toLocaleDateString("en-US")}</div>
                                        <div class="timelineContent">${timeline.entries[x].content}</div>
                                      </div>`;
                let outputString = `<div class="t${x + 1}>
                                        <div class="timelineDate">${timeline.entries[x].date.toLocaleDateString("en-US")}</div>
                                        <div class="timelineContent">${timeline.entries[x].content}</div>
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
        function calculateTemplateRows(range) {

            returnStr = ''; //need to double check on string immutibility in js.
            let percent = 100 / range;
            console.log(percent);
            for (let x = 0; x <range; x++) {
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
        function loaded(){
            timeline.addEntry(new TimeElement(new Date('1/22/2018'),'a'));
            //timeline.addEntry(new TimeElement(new Date('2/22/2018'),'a'));
            timeline.addEntry(new TimeElement(new Date('3/12/2018'),'a'));
            timeline.addEntry(new TimeElement(new Date('1/12/2019'),'a'));
            timeline.addEntry(new TimeElement(new Date('11/02/2019'),'a'));
            generateTimeline(timeline);
            // let a = new Date('1/22/2020');
            // let b = new Date('2/21/2019');
            // let c = new Date('07/08/2018');
            // console.log(getRange(c,a));
            // console.log(b+" "+calculatePosition(c,a,b))
        }
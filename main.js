
        class Timeline {
            entries = [];
            constructor() {
                this.entries = [];
                this.numYears=0;
                this.numMonths = 0;
                this.maxRow = -1;
            }
            // addEntry(date,content){

            // }
            addEntry(entry) {
                this.entries.push(entry);
                this.sort();
                this.calculateRange();
                this.calculatePositions();
            }
            calculateRange(){
                if(this.entries.length<=1){
                    this.numYears=0;
                    return;
                }
                this.newestYear = this.entries[this.entries.length-1].date.getFullYear();
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
            calculatePositions(){
                //calculate each entries position. 
                this.calculateRange();
                //get the last month (most recent) and invert it so that we can scale the timeline to start on that month.
                let lastMonth = (12 - this.entries[this.entries.length -1].date.getMonth());
                for(let x =0; x<this.entries.length; x++){
                    let month = this.entries[x].date.getMonth();
                    let year = this.entries[x].date.getFullYear();
                    let yearDifference = this.newestYear - year;
                    //invert the current month number
                    let monthNumber = (12 - month);
                    //scale by the position based on its year
                    monthNumber+=(yearDifference*12);
                    //remove the extra space that is added so that the last month is the first entry on the timeline.
                    monthNumber-=lastMonth;
                    //adding one so that the timeline doesn't end at the same point as the last item.
                    this.maxRow = monthNumber>this.maxRow ? monthNumber+1: this.maxRow;
                    this.entries[x].position = monthNumber;
                    //console.log(month +" "+year+" : "+monthNumber+" "+lastMonth);
                    
                }
                console.log(this.entries);
            }
        }
        class TimeElement {
            constructor(dateTime, content) {
                this.date = dateTime;
                this.content = content;
                this.position ='';
            }
        }
        
        function calculatePosition(latest, date){
            let years = latest.getFullYear()-date.getFullYear();
            let r = (12*years);
            if(years <1){
                return date.getMonth();
            }
            return r;
        }
        function makeBarCSS(numberMonths,mobile){
            let gridCol = "2/3";
            if(mobile){
                gridCol = "1/2"
            }
            let barCSS = `grid-column: ${gridCol};
                          grid-row: 1/${numberMonths+1};
                          border-radius: 10px;
                          background-color: #49a078;`;
            return barCSS;
        }
        function makeTimelineCSS(rows,mobile){
            let cols = "48% 1% auto";
            if(mobile){
                cols = "1% 48% auto"
            }
            let timeline = `height:50vh;\n
            display: grid;\n 
            grid-template-columns:${cols};\n
            grid-template-rows:${rows};\n`;
            return timeline;
        }
        function generateCSS(timeline,mobile){
            let months = timeline.maxRow;
            let tempRows = calculateTemplateRows(months);
            let timelineCSS = makeTimelineCSS(tempRows,mobile);
            let barCSS = makeBarCSS(months,mobile);
            let cssString = `.timeline{\n${timelineCSS}}\n;
                             .bar{${barCSS}\n} \n`;
            let cssEntries = [];
            let newestYear = timeline.entries[timeline.entries.length-1].date.getFullYear();
            for(let x = 0 ; x< timeline.entries.length; x++){

                let rowPos = (timeline.entries[x].position ) + "/" + (timeline.entries[x].position +1);
                let colPos = "1/2";
                let alignment = "right";
                if (x % 2 == 0) {
                    colPos = "3/4";
                    alignment = "left";
                }
                if(mobile){
                    colPos = "2/3";
                    alignment="left";
                }
                let innerCSS = `text-align:${alignment};\n
                            adding:10;\n
                            grid-column:${colPos };\n
                            grid-row:${rowPos};\n`;
                cssEntries.push(innerCSS);
                cssString += `.t${x + 1}{\n${innerCSS}}\n`;
            }
            return [cssString,cssEntries];
        }
        //TODO maybe refactor.
        function generateTimeline(timeline,mobile=false) {
            console.log(timeline.maxRow);
            let cssCode = document.getElementById('cssCode');
            let htmlCode = document.getElementById('htmlCode');
            let css = generateCSS(timeline,mobile);
            cssCode.innerText = css[0];
            let cssEntries = css[1];
            //generate HTML for elements
            let tempRows = calculateTemplateRows(timeline.maxRow);
            let timelineCSS = makeTimelineCSS(tempRows,mobile);
            let barCSS = makeBarCSS(timeline.numMonths,mobile);
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
            htmlCode.innerText = "";
            htmlCode.innerText = outputHTML;
            document.getElementById("timelinePreview").innerHTML = htmlString;
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
            let timeline = new Timeline();
            for (let x = 0; x < entries.length; x++) {
                let inputs = entries[x].getElementsByTagName('input');
                let time = inputs[0].value;
                let content = inputs[1].value;
                console.log(time);
                timeline.addEntry(new TimeElement(new Date(time), content));
            }
            timeline.sort();
            generateTimeline(timeline,false);
        }
        function loaded(){
            // let timeline = new Timeline();
            //  timeline.addEntry(new TimeElement(new Date('04/01/2020'),'a'));
            //  timeline.addEntry(new TimeElement(new Date('3/12/2018'),'a'));
            //  timeline.addEntry(new TimeElement(new Date('01/12/2020'),'a'));
            //  timeline.addEntry(new TimeElement(new Date('1/22/2018'),'a'));
            // timeline.addEntry(new TimeElement(new Date('2/22/2019'),'a'));
            // timeline.calculatePositions();

            //   generateTimeline(timeline);
            // let a = new Date('1/22/2020');
            // let b = new Date('2/21/2019');
            // let c = new Date('07/08/2018');
            // console.log(getRange(c,a));
            // console.log(b+" "+calculatePosition(c,a,b))
        }
function details(){
    // HTML elements in Tasks Log
    const slider = document.getElementById("current_progress");
    const percent = document.getElementById("percent");
    const namelist = document.getElementById("namelist")
    const taskslist = document.getElementById("taskslist")
    const hours = document.getElementById("hours")
    const btn_submit = document.getElementById("submit_progress")
    const tables_area = document.getElementById("tables_area")
    const projecttitle = document.getElementById("project_title")
    const projectheader = document.getElementById("project_header")

    // HTML elements in estimation
    const e_slider = document.getElementById("e_current_progress");
    const e_percent = document.getElementById("e_percent");
    const e_namelist = document.getElementById("e_namelist")
    const e_taskslistname = document.getElementsByName("e_tasklist")
    const e_taskslist = document.getElementById("e_taskslist")
    const submit_est = document.getElementById("submit_est")
    const est_table = document.getElementById("est-table")
    const tasksbox = document.getElementById("tasksbox")
    const btn_tasksbox = document.getElementById("btn_tasksbox")

    // Firestore
    const db = firebase.firestore()

    // Get project ID from URL passed from add_projects.js
    var url_string = window.location.href;
    var url = new URL(url_string);
    var pname = decodeURIComponent(url.searchParams.get("project"));
    // Get current project document
    const projRef = db.collection("projects").doc(pname)

    projRef.get().then(function(doc) {
        if (doc.exists) {
            //Write project title on top
            let u = doc.data().unit
            let t = doc.data().title
            projecttitle.innerHTML = u + ": "+ t
            projectheader.innerHTML = u + ": "+ t
            // create member option using DOM
            let members = doc.data().members

            // EST section: Puts student list as option for every member except lecturer/owner
            // for (m in members){
            //     let studentDoc = db.collection("students").doc(members[m])
            //     studentDoc.get().then(function(doc){
            //         if (doc.data().status!="lecturer"){
            //             const newOption = document.createElement('option');
            //             const optionText = document.createTextNode(doc.data().name);
            //             // set option text
            //             newOption.appendChild(optionText);
            //             // and option value
            //             newOption.setAttribute('value',doc.data().name);
            //             // add the option to the select box
            //             e_namelist.appendChild(newOption);
            //         }
            //     })
                
            // }
            
            // LOG section: Puts student list as option for every member except lecturer/owner
            firebase.auth().onAuthStateChanged(function(user) {
                const id = user.email.substring(0,8)
                if (members.includes(id)){
                    members = [id]
                }
                else{
                    console.log("Are you an admin?")
                }
                for (m in members){
                    let studentDoc = db.collection("students").doc(members[m])
                    studentDoc.get().then(function(doc){
                        const newOption = document.createElement('option');
                        const optionText = document.createTextNode(doc.data().name);
                        // set option text
                        newOption.appendChild(optionText);
                        // and option value
                        newOption.setAttribute('value',doc.data().name);
                        // add the option to the select box
                        namelist.appendChild(newOption);
                    })
                }
            });

            firebase.auth().onAuthStateChanged(function(user) {
                const id = user.email.substring(0,8)
                if (members.includes(id)){
                    members = [id]
                }
                else{
                    console.log("Are you an admin?")
                }
                for (m in members){
                    let studentDoc = db.collection("students").doc(members[m])
                    studentDoc.get().then(function(doc){
                        const newOption = document.createElement('option');
                        const optionText = document.createTextNode(doc.data().name);
                        // set option text
                        newOption.appendChild(optionText);
                        // and option value
                        newOption.setAttribute('value',doc.data().name);
                        // add the option to the select box
                        e_namelist.appendChild(newOption);
                    })
                }
            });

            // Get tasks list
            let task_arr = doc.data().tasks
            task_arr.sort()
            let progress = doc.data().total_progress
            
            for (t in task_arr){

                //EST section: Put all tasks as option unconditionally
                const newOption = document.createElement('option');
                const optionText = document.createTextNode(task_arr[t]);
                // set option text
                newOption.appendChild(optionText);
                // and option value
                newOption.setAttribute('value',task_arr[t]);
                // add the option to the select box
                e_taskslist.appendChild(newOption);

                // LOG section: Put task as option only if the total progress is less than 100
                if (progress!=undefined && progress[task_arr[t]]<100 ){
                    const newOption = document.createElement('option');
                    const optionText = document.createTextNode(task_arr[t]);
                    // set option text
                    newOption.appendChild(optionText);
                    // and option value
                    newOption.setAttribute('value',task_arr[t]);
                    // add the option to the select box
                    taskslist.appendChild(newOption);
                }

                //LOG section: Draw tables based on the number of tasks
                //Create new title
                const task_text = document.createTextNode(task_arr[t])
                const new_title = document.createElement("h4")
                new_title.appendChild(task_text)
                tables_area.appendChild(new_title)

                //Create new table
                const new_table =  document.createElement("table")
                new_table.setAttribute("class","mdl-data-table mdl-js-data-table mdl-shadow--2dp")
                const new_header = document.createElement("thead")
                const new_hrow = document.createElement("tr")

                // Time header
                const time_header = document.createElement("th")
                time_header.setAttribute("class","mdl-data-table__cell--non-numeric")
                const time_text = document.createTextNode("Time")
                time_header.appendChild(time_text)
                new_hrow.appendChild(time_header)

                //Add Member column
                //HTML code: <th class="mdl-data-table__cell--non-numeric">Member</th>
                const member_header = document.createElement("th")
                member_header.setAttribute("class","mdl-data-table__cell--non-numeric")
                const member_text = document.createTextNode("Member")
                member_header.appendChild(member_text)
                new_hrow.appendChild(member_header)

                //Add Progess column
                //HTML code:<th>Progress (%)</th>
                const progress_header = document.createElement("th")
                const progress_text = document.createTextNode("Progress (%)")
                progress_header.appendChild(progress_text)
                new_hrow.appendChild(progress_header)

                //Add Time spent column
                //HTML code: <th>Time Spent (hours)</th>
                const spent_header = document.createElement("th")
                const spent_text = document.createTextNode("Time Spent (hours)")
                spent_header.appendChild(spent_text)
                new_hrow.appendChild(spent_header)

                //Append the header row to header atb
                new_header.appendChild(new_hrow)
                //Append header row w/ titles to the table
                new_table.appendChild(new_header)

                //Create body
                const new_body = document.createElement("tbody")
                new_body.setAttribute("id",task_arr[t])
                //Create a blank row so we can add records dynamically later
                const blank_row = document.createElement("tr")
                new_body.appendChild(blank_row)
                //Append body to table
                new_table.appendChild(new_body)

                //Append body to the area and set break line
                tables_area.appendChild(new_table)
                tables_area.appendChild(document.createElement("br"))

            }

            //LOG section: Draw table contents
            const log_arr=doc.data().log
            if (log_arr.length>0){
                for (l in log_arr){
                    const current_table = document.getElementById(log_arr[l].task)
                    const row = current_table.insertRow(1)
                    const cell1 = row.insertCell(0);
                    cell1.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell1.innerHTML=log_arr[l].time
                    const cell2 = row.insertCell(1);
                    cell2.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell2.innerHTML=log_arr[l].name
                    const cell3 = row.insertCell(2);
                    cell3.innerHTML=log_arr[l].progress
                    const cell4 = row.insertCell(3);
                    cell4.innerHTML=log_arr[l].hours
                }
            }

            let est_arr = doc.data().estimate.sort(compare)
            if (est_arr.length>0){
                for(e in est_arr){
                    const row = est_table.insertRow(-1)
                    const cell1 = row.insertCell(0);
                    cell1.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell1.innerHTML=est_arr[e].task
                    const cell2 = row.insertCell(1);
                    cell2.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell2.innerHTML=est_arr[e].member
                    const cell3 = row.insertCell(2);
                    cell3.innerHTML=est_arr[e].percent

                }
            }

            function compare(a,b){
                const t1 = a.task
                const t2 = b.task

                let comparison = 0;
                if (t1 > t2) {
                    comparison = 1;
                } else if (t1 < t2) {
                    comparison = -1;
                }
                return comparison;
            }

            function getEstforTask(t){
                let est_arr = doc.data().estimate
                return est_arr.filter(e=>(e.task==t))
            }

            
            //Boundary check on input fields, disable submit buttons if there exist invalid values
            //Enables button when conditions are met
            function enable_button(){
                const due = doc.data().due_date
                const now = new Date()
				// LOG section
                if (Number(slider.value)>0 && Number(hours.value)>0 && taskslist.value!="" || Date.parse(due)<now){
                    btn_submit.disabled=false
                }
                else{
                    btn_submit.disabled=true
                }
				
				// EST section
				// Users are allowed to submit 0 as percent
                if (e_taskslist.value!="" || Date.parse(due)<now){
                    submit_est.disabled=false
                }
                else{
                    submit_est.disabled=true
                }

                // Tasks box
                if (tasksbox.value!="" || Date.parse(due)<now){
                    btn_tasksbox.disabled=false
                }
                else{
                    btn_tasksbox.disabled=true
                }
            }

            // Update the current slider value (each time you drag the slider handle)
            // Check if button should be enabled when there is input at progress field
            percent.innerHTML = slider.value+"%"; // Change the slider value dynamically
            slider.addEventListener("input", function() {
                percent.innerHTML = this.value+"%";
                enable_button();
            })
            
            // EST section: slider
            e_percent.innerHTML = e_slider.value+"%"; // Change the slider value dynamically
            e_slider.addEventListener("input", function() {
                e_percent.innerHTML = this.value+"%";
                enable_button();
            })
               

            //Check if button should be enabled when there is input at hours field
            hours.addEventListener("input", function(){
                enable_button();
            })

            // LOG section
            taskslist.addEventListener("input",function(){
                enable_button();
            })

            // EST section
            e_taskslist.addEventListener("input",function(){
                enable_button();
            })

            tasksbox.addEventListener("input",function(){
                enable_button();
            })

        }
        else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });

    


    function update_log(){
        let in_percent=Number(slider.value)
        let in_hours = Number(hours.value)
        let in_member = namelist.value
        let in_task = taskslist.value

        // Get their email id
        var user = firebase.auth().currentUser;
        var uid = ""
        if (user != null) {
            uid = user.email.substring(0,8);
        }

        // Sanitize percent inputs
        // By limiting total progress to 100, if the total exceed 100, minus the excess
        projRef.get().then(function(doc){
            const current_progress = doc.data().total_progress[in_task]
            let next = current_progress+in_percent
            if (next>100){
                in_percent=in_percent-(next-100)
            }

            //Updates the list of logs and update the total progress map at the same time
            const now = new Date()
            const batch = db.batch()
            batch.update(projRef, {
                log:firebase.firestore.FieldValue.arrayUnion(
                    {
                        time: now.toLocaleString(),
                        name:in_member,
                        progress:in_percent,
                        hours:in_hours,
                        task:in_task,
                        id: uid
                    }
                )
            })

            batch.update(projRef, {
                ["total_progress." + in_task]: firebase.firestore.FieldValue.increment(in_percent)
            });

            batch.commit()
            .then(() => {
                console.log('Success!')
                window.location.reload()
            })
            .catch(err => console.log('Failed!', err));
        })

    }

    function update_est(){
        let in_percent=Number(e_slider.value)
        let in_member = e_namelist.value
        let in_task = e_taskslist.value
        let acc_percent=0 
        let est = {}

        // Get their email id @dvd
        var user = firebase.auth().currentUser;
        var uid = ""
        if (user != null) {
            uid = user.email.substring(0,8);
        }
        
        projRef.get().then(function(doc){

            const estimate_list = doc.data().estimate
            // Add new task in tasks list if not exist
            projRef.update({
                tasks: firebase.firestore.FieldValue.arrayUnion(in_task)
            })

            for (e in estimate_list){
                // Look for existing member+task combination
                if (estimate_list[e].task == in_task && estimate_list[e].member==in_member){
                    est = estimate_list[e];
                    break;
                }    
            }

            for (e in estimate_list){
                 // Accumulate the total estimated contribution on task, not stored
                 if (estimate_list[e].task==in_task && estimate_list[e]!=est){
                    acc_percent+=estimate_list[e].percent
                 }
            }

            // If the entry will make total>100, make it so that it is within 100
            if (acc_percent+in_percent>100){
                in_percent = 100 - acc_percent
            }

            // If this is a new task created by student, add a new field in total progress
            if (doc.data().total_progress[in_task]==undefined){ 
                projRef.update({
                    ["total_progress." + in_task]: 0
                })
            }

            
            // Updates will only be done when the actual in_percent is more than 0
            // If the student is already contributing (means he wants to update his contribution)
            // Update the record by deleting the old one then add a new record in place
            // else just add the new record 
            if (est.task!=undefined){
                projRef.update({
                    estimate: firebase.firestore.FieldValue.arrayRemove(est)
                })
            }

            projRef.update({
                estimate: firebase.firestore.FieldValue.arrayUnion(
                    {
                        task: in_task,
                        member: in_member,
                        percent: in_percent,
                        id: uid
                    }
                )
            }).then(()=>{
                window.location.reload()
            })
                
        })

    }

    function update_tasksbox(){
        let tasks_input = tasksbox.value.split(",");
        let tasks_arr = tasks_input.map(t=>t.replaceAll(".",' ').trim()).filter(t=>t!="")
        const batch = db.batch()

        // Updates items in tasks box
        if (tasks_arr.length>0){
                
            // Add new tasks into total_progress map
            for (let i=0; i<tasks_arr.length; i++){
                batch.update(projRef,{
                    tasks: firebase.firestore.FieldValue.arrayUnion(tasks_arr[i]),
                    ["total_progress." + tasks_arr[i]]: 0
                })
            }
            
            batch.commit().then(()=>{
                window.location.reload();
            })
        }
        
    }

    // Create confirm box before any operation is done when submit button is clicked
    btn_submit.addEventListener("click", function(){
        const warning = confirm("You cannot edit/delete your log later!\nDo you want to submit your progress?")
        if (warning){
            update_log();
        }
    })

    //Submit estimate 
    submit_est.addEventListener("click",function(){
        const warning = confirm("You can still update (but NOT delete) your log later!\nDo you want to submit the data?")
        if (warning){
            update_est();
        }
    })

    // Submit tasks box
    btn_tasksbox.addEventListener("click", function(){
        const warning = confirm("You cannot delete your tasks later!\nDo you want to submit the data?")
        if (warning){
            update_tasksbox();
        }
    })
}

function comment() {
    const chatLog = document.querySelector('#chat');
    //const form = document.querySelector('#message-form');
    const form = document.getElementById("message-form");
    const form_btn = document.getElementById("form_btn");

    //var user = firebase.auth().currentUser;
    //var userName;

    const db = firebase.firestore();

    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var pname = decodeURIComponent(url.searchParams.get("project"));
    const projRef = db.collection("projects").doc(pname);

    //Saving the any submitted comments
    form_btn.addEventListener('click', function () {
        console.log("CLICK")
        //e.preventDefault(); //normally when the send button is pressed it will refresh the page

        // For todays date;
        Date.prototype.today = function () {
            return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
        }
        // For the time now
        Date.prototype.timeNow = function () {
            return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }

        var currentDate = new Date();
        var dateTime = currentDate.today() + ", " + currentDate.timeNow();
        var user = firebase.auth().currentUser;
        var userName;
        if (user != null) {
            userName = user.displayName
        }
        else {
            userName = "Error"
        }

        const batch = db.batch()
        batch.update(projRef, {
            chatlog: firebase.firestore.FieldValue.arrayUnion(
                {
                    name: userName, // change this to current user
                    time: dateTime,
                    usermsg: form.usermsg.value
                }
            )

        })

        batch.commit()
            .then(() => {
                console.log('Success!'),
                location.reload(); })
            .catch(err => console.log('Failed!', err));
            
        
        // Clear input after submission
        form.usermsg.value = '';
 
    })

    projRef.get().then(function (doc) {
        const chatlog_arr = doc.data().chatlog;
        if (chatlog_arr.length != 0) {
            for (l in chatlog_arr) {

                let li = document.createElement('li');
                let name = document.createElement('span');
                let usermsg = document.createElement('span');

                name.textContent = chatlog_arr[l].name + " " + chatlog_arr[l].time;
                usermsg.textContent = chatlog_arr[l].usermsg;

                li.appendChild(name)

                li.appendChild(usermsg);
                chatLog.appendChild(li);

                // console.log(li)

            }
        }

    })
}

function graph(){

    const bar_opacity = 0.7

    //Create random rgba color
    function random_rgba(barOpacity = bar_opacity) {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + barOpacity + ')';
    }
    
    //Change opacity
    function changeOpacity(s, newOpacity) {
        return s.replace(bar_opacity + ")", newOpacity + ")")
    }

    // Firestore
    const db = firebase.firestore()

    // Get project ID from URL passed from add_projects.js
    var url_string = window.location.href;
    var url = new URL(url_string);
    var pname = decodeURIComponent(url.searchParams.get("project"));
    // Get current project document
    const projRef = db.collection("projects").doc(pname)
    var members = [] // String[]
    var members_name = [] // String[]

    function getMembers(){
        return projRef.get().then(function(doc) {
            if(doc.exists){
                members = doc.data().members // String[]
            }
        }).catch(function(error) {
            console.log("Error getting cached document:", error);
        });
    }

    function getMembersName(){
        //Get each member by name
        return db.collection("students").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                if(members.includes(doc.data().id)){
                    var data = doc.data()
                    var index = members.indexOf(data.id)
                    members_name[index] = data.name
                    if(data.status == "lecturer" || data.status == "administrator"){
                        members.splice(index,1)
                        members_name.splice(index,1)
                    }
                }
            });
        });
    }

    function createGraph() {
        return projRef.get().then(function(doc){
            if(doc.exists){
                //Get entry values
                tasks = doc.data().tasks // String[]
                log = doc.data().log; // [id,hours,name,progress,task,time]
                estimate = doc.data().estimate; //[id,member,percent,task]

                //initialize data for graph
                var newHourWorkedDataSets = [{label: "Click to remove task from chart"}]
                var newContributionDataSets = [{label: "Click to remove member from chart",stack: 'Stack 0',}]
                var newTotalHourWorkedDataSets = []
                var newTotalEstimationContributionDataSets = []
                var newTotalActualContributionDataSets = []

                //for each task, loop through each log
                for(var i = 0; i < tasks.length; i++){
                    //assign random color
                    var newColor = random_rgba();
                    var newBorderColor = "rgba(0,0,0,0.7)";

                    // to modify comparison data, add properties here
                    var newComparisonData = {
                        type: 'bar', 
                        label: '# hours worked for ' + tasks[i], 
                        data: new Array(members.length).fill(0), //fill with array of 0's
                        backgroundColor: newColor,
                        borderColor: newBorderColor,
                        borderWidth: 1
                    }
                    for(var j = 0; j < log.length; j++){
                        if(log[j].task == tasks[i]){
                            // Get the member id of that log
                            var dataIndex = members.indexOf(log[j].id);
                            //Increase the value of the corresponding graph for that member
                            newComparisonData.data[dataIndex] = newComparisonData.data[dataIndex] + log[j].hours
                        }
                    }
                    newHourWorkedDataSets.push(newComparisonData)
                }
                
                // for each member, get their estimation vs actual con
                for(var i = 0; i < members.length; i++){
                    //assign random color
                    var newColor = random_rgba();
                    var newBorderColor = "rgba(0,0,0,0.7)";
                    // to modify estimation data, add properties here
                    var newEstimationData = {
                        type: 'bar', 
                        label:  members_name[i] + ' estimation (%)', 
                        stack: 'Stack 0',
                        data: new Array(tasks.length).fill(0), //fill with array of 0's
                        backgroundColor: newColor,
                        borderColor: newBorderColor,
                        borderWidth: 1
                    }
                    // to modify estimation data, add properties here
                    var newActualContributionData = {
                        type: 'bar', 
                        label: members_name[i] + ' actual (%)',
                        stack: 'Stack 1',
                        data: new Array(tasks.length).fill(0), //fill with array of 0's
                        backgroundColor: newColor,
                        borderColor: newBorderColor,
                        borderWidth: 1,
                    }
                    for(var j = 0; j < estimate.length; j++){
                        if(estimate[j].id == members[i]){
                            // Get the member id of that log
                            var dataIndex = tasks.indexOf(estimate[j].task);
                            //Increase the value of the corresponding graph for that member
                            newEstimationData.data[dataIndex] = newEstimationData.data[dataIndex] + estimate[j].percent
                        }
                    }
                    for(var j = 0; j < log.length; j++){
                        if(log[j].id == members[i]){
                            // Get the member id of that log
                            var dataIndex = tasks.indexOf(log[j].task);
                            //Increase the value of the corresponding graph for that member
                            newActualContributionData.data[dataIndex] = newActualContributionData.data[dataIndex] + log[j].progress
                        }
                    }
                    newContributionDataSets.push(newEstimationData)
                    newContributionDataSets.push(newActualContributionData)
                }

                ///////////// Handle pie chart ///////////////
                var newTotalData = {
                    label: "total hours spent",
                    data: new Array(members.length).fill(0),
                    backgroundColor: new Array(members.length).fill('red')
                }
                for(var k = 0; k < log.length; k++){
                    var dataIndex = members.indexOf(log[k].id);
                    newTotalData.data[dataIndex] = newTotalData.data[dataIndex] + log[k].hours
                    newTotalData.backgroundColor[dataIndex] = random_rgba()
                }
                newTotalHourWorkedDataSets.push(newTotalData)
                
                var newTotalEstimationContributionData = {
                    label: "total contribution",
                    data: new Array(members.length).fill(0),
                    backgroundColor: new Array(members.length).fill('red')
                }
                var newTotalActualContributionData = {
                    label: "total contribution",
                    data: new Array(members.length).fill(0),
                    backgroundColor: new Array(members.length).fill('red')
                }
                for(var j = 0; j < estimate.length; j++){
                    // Get the member id of that log
                    var dataIndex = members.indexOf(estimate[j].id);
                    //Increase the value of the corresponding graph for that member
                    newTotalEstimationContributionData.data[dataIndex] = newTotalEstimationContributionData.data[dataIndex] + estimate[j].percent
                }
                for(var j = 0; j < log.length; j++){
                    // Get the member id of that log
                    var dataIndex = members.indexOf(log[j].id);
                    //Increase the value of the corresponding graph for that member
                    newTotalActualContributionData.data[dataIndex] = newTotalActualContributionData.data[dataIndex] + log[j].progress
                }

                for(var i = 0; i < members.length; i++){
                    var newColor = random_rgba()
                    newTotalEstimationContributionData.backgroundColor[i] = newColor
                    newTotalActualContributionData.backgroundColor[i] = newColor
                }
                
                function sum(total, num){
                    return total + num;
                }
                function getAverageEstimation(num){
                    return roundTwoDecimal(num/totalEstimationPercentage*100);
                }
                function getAverageActual(num){
                    return roundTwoDecimal(num/totalActualPercentage*100);
                }
                function roundTwoDecimal(num){
                    return (Math.round(num * 100) / 100).toFixed(2).replace(".00","")
                }

                var totalEstimationPercentage = newTotalEstimationContributionData.data.reduce(sum)
                var totalActualPercentage = newTotalActualContributionData.data.reduce(sum)

                newTotalEstimationContributionData.data = newTotalEstimationContributionData.data.map(getAverageEstimation)
                newTotalActualContributionData.data = newTotalActualContributionData.data.map(getAverageActual)
                
                newTotalEstimationContributionDataSets.push(newTotalEstimationContributionData)
                newTotalActualContributionDataSets.push(newTotalActualContributionData)

                // DATA SETS //
                const hour_worked_chart_data = {
                    labels: members_name,
                    datasets: newHourWorkedDataSets
                }

                const estimation_chart_data = {
                    labels: tasks,
                    datasets: newContributionDataSets
                }

                const total_chart_data = {
                    labels: members_name,
                    datasets: newTotalHourWorkedDataSets
                }
                const total_est_chart_data = {
                    labels: members_name,
                    datasets: newTotalEstimationContributionDataSets
                }
                const total_act_chart_data = {
                    labels: members_name,
                    datasets: newTotalActualContributionDataSets
                }

                // Change default options for ALL charts
                Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
                    color: 'black'
                });
                // To modify hour worked chart, add options here
                const hour_worked_chart_options = {
                    plugins: {
                        datalabels: {
                            display: function(context) {
                                return context.dataset.data[context.dataIndex] > 0; 
                            }
                        }
                    },
                    legend: {
                        position: 'left',
                        align: 'start',
                        labels: {
                            padding: 10
                        }
                    },
                    title: {
                        display: true,
                        text: 'Hour Spent on Each Task',
                        fontSize: 24
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            stacked: true
                        }],
                        xAxes: [{
                            stacked: true,
                            barPercentage: 0.7
                        }]
                    }
                }

                // To modify estimation chart, add options here
                const estimation_chart_options = {
                    plugins: {
                        datalabels: {
                            display: function(context) {
                                    return context.dataset.data[context.dataIndex] > 0; 
                            },
                            formatter: function(value, context) {
                                return context.dataset.data[context.dataIndex];
                            }
                        }
                    },
                    legend: {
                        position: 'left',
                        align: 'start',
                    },
                    title: {
                        display: true,
                        text: ['Estimated Contribution vs Actual Contribution', 'Left: Estimation, Right: Actual Contribution'],
                        fontSize: 24
                    },layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 20,
                            bottom: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            },
                            stacked: true
                        }],
                        xAxes: [{
                            stacked: true,
                            ticks: {
                                mirror: true
                            }
                        }]
                    }
                }

                //To modify total chart, add options here
                const total_chart_options = {
                    plugins: {
                        datalabels: {
                            display: function(context) {
                                return context.dataset.data[context.dataIndex] > 0; 
                            }
                        }
                    },
                    legend: {
                        position: 'left',
                        align: 'start',
                        labels: {
                            padding: 10
                        }
                    },
                    title: {
                        display: true,
                        text: 'Total Hour Spent (hours)',
                        fontSize: 24
                    }
                }
                //To modify total actual contribution chart, add options here
                const total_act_chart_options = {
                    plugins: {
                        datalabels: {
                            display: function(context) {
                                return context.dataset.data[context.dataIndex] > 0; 
                            }
                        }
                    },
                    legend: {
                        position: 'left',
                        align: 'start',
                        labels: {
                            padding: 10
                        }
                    },
                    title: {
                        display: true,
                        text: 'Total Actual Contribution (%)',
                        fontSize: 24
                    }
                }
                //To modify total estimated contribution chart, add options here
                const total_est_chart_options = {
                    plugins: {
                        datalabels: {
                            display: function(context) {
                                return context.dataset.data[context.dataIndex] > 0; 
                            }
                        }
                    },
                    legend: {
                        position: 'left',
                        align: 'start',
                        labels: {
                            padding: 10
                        }
                    },
                    title: {
                        display: true,
                        text: 'Total Estimated Contribution (%)',
                        fontSize: 24
                    }
                }
                // render the graphs
                var ctx = document.getElementById('hour_worked_bar_chart');
                var myComparisonChart = new Chart(ctx, {
                    type: 'bar',
                    data: hour_worked_chart_data,
                    options: hour_worked_chart_options
                });

                var cty = document.getElementById('estimation_bar_chart');
                var myTotalChart = new Chart(cty, {
                    type: 'bar',
                    data: estimation_chart_data,
                    options: estimation_chart_options
                });

                var ctz = document.getElementById('comparison_pie_chart');
                var myTotalChart = new Chart(ctz, {
                    type: 'pie',
                    data: total_chart_data,
                    options: total_chart_options
                });

                var cta = document.getElementById('est_cont_pie_chart');
                var myTotalChart = new Chart(cta, {
                    type: 'pie',
                    data: total_est_chart_data,
                    options: total_est_chart_options
                });

                var ctb = document.getElementById('act_cont_pie_chart');
                var myTotalChart = new Chart(ctb, {
                    type: 'pie',
                    data: total_act_chart_data,
                    options: total_act_chart_options
                });

        } else{
            console.log("ERROR, Document doesn't exists")
        }

        }
        )
    }

    // Call all operations
    getMembers().then(getMembersName().then(() => createGraph().then()))

    
}
window.onload = function(){
    details();
    comment();
    graph();
}

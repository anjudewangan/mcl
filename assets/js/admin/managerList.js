// console.log("manager list");
// let progressData = "";
// let Inprogress = "";
//  area = "";
// user = JSON.parse(localStorage.getItem("user"))
// let managerData = {};
// let complain_length =0;
// fetch(excalated_matrix_api).then((res)=>{
//     return res.json();
// }).then((data)=>{
//    data.map((value,index)=>{
//       if(value.UserID == user){
//         //  console.log(value.Area)
//          area = value.Area;
//          category = value.Category;
//          managerName = value.Name;
//       }
//    })
// })

// fetch(caller_api).then((res)=>{
//      return res.json();
// }).then((data)=>{
//     let count = 0;
//     managerData = data;
//     let magager_List = "";
//     data.map((value,index)=>{
//         let dataUpperCase = value.Category.toUpperCase();
//         // console.log(dataUpperCase , area , value.Colony ,category )
//        if(value.Colony == area && dataUpperCase == category ){
//         Inprogress = value.Inprogress;
//         count++;
//           magager_List +=`
//           <tr>
//           <td>${count}</td>
//           <td onclick="popup(${index})">${value.Complain_Number}</td>
//           <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${value.CompleteTime}} </td>
//           <td>${value.Ocupent_Name}</td>
//           <td>${value.Category}</td>
//           <td>${value.Work}</td>
//           <td>${value.Complain}</td>
//           <td><span class="text-danger f-w-700 f-12">${value.Inprogress}</span></td>
//           <td><button type="button" class="btn btn-primary-gradien btn-action"
//                   data-bs-toggle="modal" data-bs-target="#technicianPopup" onclick="userSelect(${index})"><i class="fa fa-user" aria-hidden="true"></i></button>
//               <button type="button" class="btn btn-success-gradien btn-action"
//                   data-bs-toggle="modal" data-bs-target="#updateStatusPopup" onclick="progress(${index})"><i class="fa fa-repeat" aria-hidden="true"></i></button>
//           </td>
//       </tr>
//           `
//         }
//         document.getElementById("m_complain_list").innerHTML = magager_List;
//     })
// })

// let userAssing = "";
// let indexValue = "";
// function userSelect(indexData){
//     // console.log(indexData)
//     indexValue = indexData;
// fetch(addTech_api).then((res)=>{
//     return res.json();
//   }).then((data)=>{
//    let addTech = "";
//    data.map((value,index)=>{
//     // console.log(value)
//     if(value.Manager_Name.match(managerName)){
//       addTech +=`
//       <option>${value.Name}</option>
//       `
//     }
//       document.getElementById("userOption").innerHTML = addTech;
//     })
//   })
// }

// function getData(){
//     userAssing =  document.getElementById("userOption").value;
// }

// function assTechnician(){
//     fetch(addTech_api).then((res)=>{
//         return res.json();
//     }).then((data)=>{
//        data.map((value,index)=>{
//          if(value.Name == userAssing){
//             technician_assing(value.Name , value.Email_Id);
//             // console.log(userAssing , value.Name );
//            fetch(caller_api).then((res)=>{
//                     return res.json();
//                 }).then((data)=>{
//                     data.map((values)=>{
//                         if(values.Overseers.match(managerName) && value.Technician_Name =="" ){
//                             let path2show = caller_api+"/"+`${values._id}`;
//                             fetch(path2show, {
//                                 method: 'PATCH',
//                                 body: JSON.stringify({
//                                     Technician_Name:value.Name,
//                                     Technician_Number:value.Contact,
//                                 }),
//                                 headers: {
//                                     'Content-type': 'application/json'
//                                 }
//                             }).then(()=>{
//                                 alert("Successfully Assing")
//                             })
//                         }
//                         else{
//                             alert("You have already assign technician");
//                         }
//                     })
//                 })

//          }

//        })
//     })
// }

// let totalComplain = 0;
// let totalOpen = 0;
// let totalClose = 0;

// // technician get a email to assing
// function technician_assing(name , email){
//     technician_data(name,email);
//       fetch(addTech_api).then((res)=>{
//          return res.json();
//       }).then((data)=>{
//           data.map((value)=>{
//              InprogressValue = value.Inprogress;
//              if(value.Name==name && value.Email_Id == email && value.Inprogress != "Close" ){
//                 totalComplain++;
//                 let path2show = addTech_api+"/"+`${value._id}`;
//                 fetch(path2show, {
//                     method: 'PATCH',
//                     body: JSON.stringify({
//                         Total_complaints:totalComplain,
//                         Open_complaints:totalComplain,
//                     }),
//                     headers: {
//                         'Content-type': 'application/json'
//                     }
//                 })
//              }
//           })
//       })
// }

// fetch(caller_api).then((res)=>{
//     return res.json();
// }).then((data)=>{
//    let count = 0;
//    managerData = data;
//    let magager_List = "";
//    data.map((value,index)=>{
//        let dataUpperCase = value.Category.toUpperCase();
//     //    console.log(dataUpperCase , area , value.Colony ,category )
//        let result = value.Colony.trim();
//     //    console.log(result +"COLONY Trim")
//       if(result == area && dataUpperCase == category && value.Overseers.match(managerName) ){
//        Inprogress = value.Inprogress;
//        count++;
//          magager_List +=`
//          <tr>
//          <td>${count}</td>
//          <td onclick="popup(${index})">${value.Complain_Number}</td>
//          <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${value.CompleteTime}} </td>
//          <td>${value.Ocupent_Name}</td>
//          <td>${value.Category}</td>
//          <td>${value.Work}</td>
//          <td>${value.Complain}</td>
//          <td><span class="text-danger f-w-700 f-12">${value.Inprogress}</span></td>
//          <td><button type="button" class="btn btn-primary-gradien btn-action"
//                  data-bs-toggle="modal" data-bs-target="#technicianPopup" onclick="userSelect(${index})"><i class="fa fa-user" aria-hidden="true"></i></button>
//              <button type="button" class="btn btn-success-gradien btn-action"
//                  data-bs-toggle="modal" data-bs-target="#updateStatusPopup" onclick="progress(${index})"><i class="fa fa-repeat" aria-hidden="true"></i></button>
//          </td>
//      </tr>
//          `
//        }
//        document.getElementById("m_complain_list").innerHTML = magager_List;
//    })
// })

// // console.log(Inprogress)
// if(Inprogress == "Close"){
//     fetch(addTech_api).then((res)=>{
//         return res.json();
//      }).then((data)=>{
//          data.map((value,index)=>{
//             if(value.Name == name && value.Email_Id == email){
//              let values = value.Total_complaints;
//              let open =  values--;
//              let close =  values++;
//                let path2show = addTech_api+"/"+`${value._id}`;
//                fetch(path2show, {
//                    method: 'PATCH',
//                    body: JSON.stringify({
//                     Open_complaints:open,
//                        Close_complaints:close,
//                    }),
//                    headers: {
//                        'Content-type': 'application/json'
//                    }
//                }).then(()=>{
//                    alert("successfully Assing")
//                })
//             }
//          })
//      })
// }

// // update technician data
// function technician_data(name ,email){
// fetch(addTech_api).then((res)=>{
//     return res.json();
// }).then((data)=>{
//     // let datalength = data.length;
//    data.map((value,index)=>{
//     if(value.Name == name && value.Email_Id == email){
//        totalComplain =  value.Total_complaints
//        totalOpen =  value.Open_complaints
//         totalClose =  value.Close_complaints
//       }
//    })
// })

// }

// let progressIndex = 0;
// function progress(index){
// //   console.log(index)
//    progressIndex = index;
//   document.getElementById("floatingTextarea2").value;
// }

// function progressBar(){
//     // console.log(progressData)
//    progressData =  document.getElementById("progressOption").value;
// //    console.log(progressData)
// }

// function complainProgress(){
//     // console.log("progress bar value")
//     var currentdate = new Date();
//     var month= +(currentdate.getMonth()) + 1;

//     var datetime = currentdate.getDate() + "/" + month + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":"
//     + currentdate.getMinutes() + ":" + currentdate.getSeconds();

//     const myArray = datetime.split("  ")
//     date = myArray[0]
//     time = myArray[1]

//    let textArea =  document.getElementById("floatingTextarea2").value;
// //    console.log("submit", textArea , user)

//    if(progressData == "In Progress"){
//     // console.log("updated" , managerName)
//     fetch(caller_api).then((res)=>{
//         return res.json();
//         }).then((data)=>{
//             data.map((values,indexvalue)=>{
//                 if(values.Overseers.match(managerName) && indexvalue == progressIndex ){
//                     // inprogress();
//                     let path2show = caller_api+"/"+`${values._id}`;
//                     // console.log(path2show)
//                     fetch(path2show, {
//                         method: 'PATCH',
//                         body: JSON.stringify({
//                             Inprogress:progressData,
//                             InprogressRemarks:textArea,
//                             InprogressDate:date,
//                             InprogressTime:time,
//                         }),
//                         headers: {
//                             'Content-type': 'application/json'
//                         }
//                     }).then(()=>{
//                         alert("Successfully progress bar updated")
//                     })
//                 }
//             })
//         })
//    }
//   else{
//     fetch(caller_api).then((res)=>{
//         return res.json();
//         }).then((data)=>{
//             data.map((values,indexvalue)=>{
//                 if(values.Overseers.match(managerName) && indexvalue == progressIndex){
//                     // complete();
//                     let path2show = caller_api+"/"+`${values._id}`;
//                     fetch(path2show, {
//                         method: 'PATCH',
//                         body: JSON.stringify({
//                             Inprogress:progressData,
//                             CompleteRemarks:textArea,
//                             CompleteDate:date,
//                             CompleteTime:time,
//                         }),
//                         headers: {
//                             'Content-type': 'application/json'
//                         }
//                     }).then(()=>{
//                         alert("Successfully progress bar updated")
//                     })
//                 }
//             })
//         })
//   }

// }

// function popup(indexData){
//     $('#complaintPopup').modal('show')
//     managerData.map((value,index)=>{
//         if(index==indexData){
//        const popupData =` <div class="row">
//             <div class="col-auto mb-3">
//                 <p>Complaint no.:
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Complain_Number}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Registered date:
//                     <u class="bg-light-info text-dark py-2 px-1">${new Date(value.Complaint_Date).toLocaleDateString()} ${value.CompleteTime}} </u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Occupant name:
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Ocupent_Name}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Contact no :
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Contact_Number}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>QTR no.:
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Qr_No}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Colony :
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Colony}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Area:
//                     <u class="bg-light-info text-dark py-2 px-1">${value.AREA}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>EIS/PIS no :
//                     <u class="bg-light-info text-dark py-2 px-1">${value.EIS_No}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Complaint Category:
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Sub_Category}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Complaint Details:
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Complain}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Department
//                     <u class="bg-light-info text-dark py-2 px-1">${value.Category}</u>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//                 <p>Status:
//                     <span class="text-primary">${value.Inprogress}</span>
//                 </p>
//             </div>
//             <div class="col-auto mb-3">
//             <p>Assingn by:
//                <u class="bg-light-info text-dark py-2 px-1">${value.Overseers}</u>
//             </p>
//         </div>
//           <div class="col-auto mb-3">
//              <p>Assign to:
//                <u class="bg-light-info text-dark py-2 px-1">${value.Technician_Name}</u>
//              </p>
//           </div>
//             <div class="mb-3">
//                 <div class="card card-timeline border-none">
//                           <ul class="bs4-order-tracking">
//     <li class="step">
//         <div class="bg-primary mb-1">Open</div> <span
//             class="text-primary">${new Date(value.Complaint_Date).toLocaleDateString()} ${value.CompleteTime}}</span>
//     </li>
//     <li class="step">
//         <div class="bg-warning mb-1">Progress</div> <span
//             class="text-warning">${value.InprogressDate}</span>
//     </li>
//     <li class="step">
//             <div class="bg-info mb-1">Complete</div> <span
//                 class="badge-info">${new Date(value.Complaint_Date).toLocaleDateString()} ${value.CompleteTime}}</span>
//     </li>
//     <li class="step">
//         <div class="bg-success mb-1">Close</div> <span
//             class="text-success">${value.Feedback_date}</span>
//     </li>
//     <li class="step">
//             <div class="bg-danger mb-1">Escalated</div> <span
//                 class="badge-danger">${new Date(value.Complaint_Date).toLocaleDateString()} ${value.CompleteTime}}</span>
//     </li>
// </ul>
//                 </div>
//             </div>
//         </div>`
//         document.getElementById("showComplain").innerHTML = popupData;
//        }
//     })
// }

// function searchBar(){
//    let progress =  document.getElementById("proStatus").value
//    console.log(progress)
//    let magager_List = "";
//    let count = 0;
//    managerData.filter((value,index)=>{
//     let dataUpperCase = value.Category.toUpperCase();
//     let result = value.Colony.trim();
//     if(value.Inprogress == progress && result == area && dataUpperCase == category && value.Overseers.match(managerName)  ){
//         // console.log(value.Inprogress+"complete data");
//         count++;
//         magager_List +=`
//         <tr>
//         <td>${count}</td>
//         <td onclick="popup(${index})">${value.Complain_Number}</td>
//         <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${value.CompleteTime}}</td>
//         <td>${value.Ocupent_Name}</td>
//         <td>${value.Category}</td>
//         <td>${value.Work}</td>
//         <td>${value.Complain}</td>
//         <td><span class="text-danger f-w-700 f-12">${value.Inprogress}</span></td>
//         <td><button type="button" class="btn btn-primary-gradien btn-action"
//                 data-bs-toggle="modal" data-bs-target="#technicianPopup" onclick="userSelect(${index})"><i class="fa fa-user" aria-hidden="true"></i></button>
//             <button type="button" class="btn btn-success-gradien btn-action"
//                 data-bs-toggle="modal" data-bs-target="#updateStatusPopup" onclick="progress(${index})"><i class="fa fa-repeat" aria-hidden="true"></i></button>
//         </td>
//     // </tr>
//         `
//      }
//    })

//      document.getElementById("m_complain_list").innerHTML = magager_List;

// }

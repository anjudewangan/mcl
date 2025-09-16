const cors = require("cors");
const { StringDecoder } = require("string_decoder");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const fs = require("fs");
const https = require("https");

const { StreamParser, Parser } = require("@json2csv/plainjs");
const contentDisposition = require("content-disposition");
const Duplex = require("stream").Duplex;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { checkAuthentication } = require("./middlewares");
const escalationJob = require("./cronJobs/complainEscalation");
app.set("trust proxy", 1);
require("dotenv").config();

const port = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const mongoStore = MongoStore.create({
  mongoUrl: process.env.DB_URI,
  ttl: 14 * 24 * 60 * 60, // = 14 days. Default
});
// Initialize Session Storage
app.use(
  session({
    secret: "this^&*9908is$%^34%$23$5secret1256325password",
    store: mongoStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Ensures the cookie is only sent over HTTPS
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Makes the cookie accessible only through the HTTP(S) protocol, not client-side scripts
    },
  })
);

mongoose.set("strictQuery", false);

let mongodb_icasqui_uri = process.env.DB_URI;

mongoose.connect(
  mongodb_icasqui_uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("successfully connected");
  }
);

const complain_data = require('./models/complainSchema')

const caller = require("./models/callerSchema");

const admin = require("./models/adminSchema");

const employee_data = require("./models/employeeSchema")

const addTech_manager = require("./models/technicianSchema")

const escalated_matrix = require("./models/escalatedSchema")

const jobs = require("./models/jobsSchema")

const contact = require('./models/contactSchema')

const updateEmployee = require("./models/updateEmployeeSchema")

const Session = require('./models/sessionSchema')

app.get("/session", async (req, res) => {
  console.log("request session");
  if (req.session.user) {
    return res.send("ok");
  } else {
    return res.status(400).send("Not Authorized");
  }
});

// caller data get
app.get("/caller_data", checkAuthentication, function (req, res, next) {
  caller
    .find({})
    .then(function (students) {
      res.send(students);
      // console.log(students)
    })
    .catch(next);
});

app.get("/admin_data", checkAuthentication, function (req, res, next) {
  admin
    .find({})
    .then(function (students) {
      res.send(students);
      // console.log(students)
    })
    .catch(next);
});

// Employee data get
app.get("/employee_data", checkAuthentication, function (req, res, next) {
  employee_data
    .find({})
    .then(function (students) {
      res.send(students);
      // console.log(students)
    })
    .catch(next);
});

// new complain get
app.get("/newComplain", checkAuthentication, function (req, res, next) {
  complain_data
    .find({})
    .then(function (students) {
      res.send(students);
      // console.log(students)
    })
    .catch(next);
});

// add technician get
app.get("/addTech", checkAuthentication, function (req, res, next) {
  addTech_manager
    .find({})
    .then(function (students) {
      res.send(students);
      // console.log(students)
    })
    .catch(next);
});

// escalated matrix data get
app.get("/escalated_matrix", checkAuthentication, async function (req, res) {
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const skip = limit * page - limit;

  const pipline = [
    {
      $match: {
        $and: [{ _id: { $exists: true } }],
      },
    },
  ];
  if (req.query.search) {
    pipline[0]["$match"]["$and"].push({
      Area: { $regex: req.query.search, $options: "i" },
    });
  }

  const data = await escalated_matrix.aggregate([
    ...pipline,
    {
      $skip: skip,
    },
    { $limit: limit },
  ]);
  const count = await escalated_matrix.aggregate([
    ...pipline,
    { $count: "count" },
  ]);
  return res.json([{ employee: data, totalCount: [count[0]] }]);
});

// new employee data get
app.get(
  "/escalated_matrix/:id",
  checkAuthentication,
  function (req, res, next) {
    const id = req.params.id;
    escalated_matrix
      .findById(id)
      .then(function (students) {
        res.json(students);
      })
      .catch(next);
  }
);

// delete employee data
app.delete("/escalated_matrix/:id", checkAuthentication, (req, res) => {
  const id = req.params.id;
  escalated_matrix.findOneAndRemove({ _id: id }, function (err, doc) {
    escalated_matrix.find({ _id: id }, function (err, data) {
      res.json(data);
    });
  });
});

// add technician get
app.get("/addTech/:id", checkAuthentication, function (req, res, next) {
  addTech_manager
    .find({})
    .then(function (students) {
      res.send(students);
      // console.log(students)
    })
    .catch(next);
});

// new complaints data get
app.get("/newComplain/:id", checkAuthentication, async (req, res, next) => {
  const id = req.params.id;
  const complain = await complain_data.findById(id);
  res.json(complain);
});

app.get("/complain/escalated", checkAuthentication, async (req, res) => {
  const searchParam = req.query.search;
  const statusParam = req.query.status;
  const area = req.query.area;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const skip = limit * page - limit;
  const agregatePipline = [
    {
      $lookup: {
        from: "jobs",
        localField: "jobs",
        foreignField: "_id",
        as: "job_doc",
      },
    },
    {
      $match: {
        $and: [
          { Complaint_Time: { $exists: true } },
          { jobs: { $exists: true } },
          { job_doc: { $size: 1 } },
          {
            $expr: {
              $function: {
                body: `function (timel2, escalationTime) {
                  return escalationTime >= timel2[0].timel2;
                }`,
                args: [
                  "$job_doc",
                  {
                    $dateDiff: {
                      startDate: "$Complaint_Time",
                      endDate: {
                        $cond: {
                          if: {
                            $function: {
                              body: `function (complainTime) {
                                        if (complainTime) {
                                          return true;
                                          }
                                        return false;
                                }`,
                              args: ["$Close_Time"],
                              lang: "js",
                            },
                          },
                          then: "$Close_Time",
                          else: new Date(),
                        },
                      },
                      unit: "hour",
                    },
                  },
                ],
                lang: "js",
              },
            },
          },
        ],
      },
    },
  ];
  if (startDate) {
    agregatePipline[1]["$match"]["$and"].push({
      Complaint_Date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
  }
  if (req.query.category) {
    agregatePipline[1]["$match"]["$and"].push({ Category: req.query.category });
  }
  if (["managerl2", "managerl3", "manager"].includes(req.query.role)) {
    agregatePipline[1]["$match"]["$and"].push({ Colony: area });
  }
  if (statusParam) {
    agregatePipline[1]["$match"]["$and"].push({
      $expr: {
        $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, statusParam],
      },
    });
  }
  if (searchParam) {
    if (Number(searchParam)) {
      agregatePipline[1]["$match"]["$and"].unshift({
        EIS_No: searchParam,
      });
    } else {
      agregatePipline[1]["$match"]["$and"].unshift({
        Complain_Number: searchParam,
      });
    }
  }

  let complains = await complain_data.aggregate([
    ...agregatePipline,
    { $skip: skip },
    { $limit: limit },
  ]);
  const count = await complain_data.aggregate([
    ...agregatePipline,
    { $count: "count" },
  ]);

  res.json([{ Complains: complains, totalCount: [count[0]] }]);
});

app.get("/export/escalated", checkAuthentication, async (req, res) => {
  const searchParam = req.query.search;
  const statusParam = req.query.status;
  const area = req.query.area;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const agregatePipline = [
    {
      $lookup: {
        from: "jobs",
        localField: "jobs",
        foreignField: "_id",
        as: "job_doc",
      },
    },
    {
      $match: {
        $and: [
          { Complaint_Time: { $exists: true } },
          { jobs: { $exists: true } },
          { job_doc: { $size: 1 } },
          {
            $expr: {
              $function: {
                body: `function (timel2, escalationTime) {
                  return escalationTime >= timel2[0].timel2;
                }`,
                args: [
                  "$job_doc",
                  {
                    $dateDiff: {
                      startDate: "$Complaint_Time",
                      endDate: {
                        $cond: {
                          if: {
                            $function: {
                              body: `function (complainTime) {
                                        if (complainTime) {
                                          return true;
                                          }
                                        return false;
                                }`,
                              args: ["$Close_Time"],
                              lang: "js",
                            },
                          },
                          then: "$Close_Time",
                          else: new Date(),
                        },
                      },
                      unit: "hour",
                    },
                  },
                ],
                lang: "js",
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        Complaint_Date: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$Complaint_Date",
            timezone: "Asia/Kolkata",
          },
        },
        CloseTime: {
          $cond: {
            if: {
              $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Close"],
            },
            then: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$Close_Time",
                timezone: "Asia/Kolkata",
              },
            },
            else: undefined,
          },
        },
        ProgressStatus: { $arrayElemAt: ["$Inprogress", -1] },
        ProgressDate: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Complete"],
                },
                then: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $arrayElemAt: ["$CompleteDate", -1] },
                    timezone: "Asia/Kolkata",
                  },
                },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "In Progress"],
                },
                then: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $arrayElemAt: ["$InprogressDate", -1] },
                    timezone: "Asia/Kolkata",
                  },
                },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Re Open"],
                },
                then: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $arrayElemAt: ["$Feedback_date", -1] },
                    timezone: "Asia/Kolkata",
                  },
                },
              },
            ],
            default: undefined,
          },
        },
        ProgressRemarks: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Complete"],
                },
                then: { $arrayElemAt: ["$CompleteRemarks", -1] },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Close"],
                },
                then: { $arrayElemAt: ["$Queries", -1] },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "In Progress"],
                },
                then: { $arrayElemAt: ["$InprogressRemarks", -1] },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Re Open"],
                },
                then: { $arrayElemAt: ["$Queries", -1] },
              },
            ],
            default: undefined,
          },
        },
        OtherReason: {
          $cond: {
            if: {
              $eq: [
                { $arrayElemAt: ["$Complaint_resolve", -1] },
                "Other Reason",
              ],
            },
            then: { $arrayElemAt: ["$Queries", -1] },
            else: undefined,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        SN: 0,
        Message_to_occupent: 0,
        Message_to_Manager: 0,
        jobs: 0,
        Close_Time: 0,
        InprogressTime: 0,
        CompleteTime: 0,
        InprogressRemarks: 0,
        CompleteRemarks: 0,
        Complaint_resolve: 0,
        Completion_of_work: 0,
        Completed_in_time: 0,
        Overseers_curstomer_rating: 0,
        Call_customer_rating: 0,
        CompleteDate: 0,
        InprogressDate: 0,
        Inprogress: 0,
        Active: 0,
        Feedback_date: 0,
        Queries: 0,
        Work: 0,
        Complaint_Time: 0,
        "Message to Manager": 0,
        "Message to occupent": 0,
      },
    },
  ];
  if (startDate) {
    agregatePipline[1]["$match"]["$and"].push({
      Complaint_Date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
  }
  if (req.query.category) {
    agregatePipline[1]["$match"]["$and"].push({ Category: req.query.category });
  }
  if (["managerl2", "managerl3", "manager"].includes(req.query.role)) {
    agregatePipline[1]["$match"]["$and"].push({ Colony: area });
  }
  if (statusParam) {
    agregatePipline[1]["$match"]["$and"].push({
      $expr: {
        $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, statusParam],
      },
    });
  }
  if (searchParam) {
    if (Number(searchParam)) {
      agregatePipline[1]["$match"]["$and"].unshift({
        EIS_No: searchParam,
      });
    } else {
      agregatePipline[1]["$match"]["$and"].unshift({
        Complain_Number: searchParam,
      });
    }
  }

  let complains = await complain_data.aggregate([...agregatePipline]);
  const buffer = jsonToCsvBuffer(complains);
  const filePath = `Data-${Date.now()}.csv`;
  res.contentType("application/octet-stream");
  res.attachment();
  res.set("Content-Disposition", `${contentDisposition(filePath)}`);
  return bufferToStream(buffer).pipe(res);
});

// new employee data get

app.get("/employee_data/:id", checkAuthentication, function (req, res, next) {
  employee_data
    .find({})
    .then(function (students) {
      res.send(students);
      // console.log(students)
    })
    .catch(next);
});

// delete technician
app.delete("/caller_data/:id", checkAuthentication, (req, res) => {
  const id = req.params.id;
  caller.findOneAndRemove({ _id: id }, function (err, doc) {
    caller.find({ _id: id }, function (err, data) {
      res.json(data);
    });
  });
});

// delete employee data
app.delete("/employee_data/:id", checkAuthentication, (req, res) => {
  const id = req.params.id;
  employee_data.findOneAndRemove({ _id: id }, function (err, doc) {
    employee_data.find({ _id: id }, function (err, data) {
      res.json(data);
    });
  });
});

// delete technician
app.delete("/addTech/:id", checkAuthentication, (req, res) => {
  const id = req.params.id;
  addTech_manager.findOneAndRemove({ _id: id }, function (err, doc) {
    addTech_manager.find({ _id: id }, function (err, data) {
      res.json(data);
    });
  });
});

// Middleware to check if user is authenticated
app.get("/", (req, res) => {
  res.sendFile(__dirname + "index.html");
  // res.sendFile(path.join(__dirname, 'components', 'exporter-dashboard.html'));
});

// caller data
app.post("/caller_data", checkAuthentication, (req, res) => {
  const { UserName, Password, Contact, Email_Id, Date } = req.body;
  const user = new caller({
    UserName,
    Password,
    Contact,
    Email_Id,
    Date,
  });
  console.log(req.body.Name);
  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "caller successfully Register" });
    }
  });
});

// admin data
app.post("/admin_data", checkAuthentication, (req, res) => {
  const { UserName, Password, Contact, Email_Id, Date } = req.body;
  const user = new admin({
    UserName,
    Password,
    Contact,
    Email_Id,
    Date,
  });

  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "caller successfully Register" });
    }
  });
});

// manager data
app.post("/escalated_matrix", checkAuthentication, (req, res) => {
  const {
    Name,
    Contact,
    Email_Id,
    Area,
    UserID,
    Password,
    Level,
    Category,
    Designation,
  } = req.body;
  const user = new escalated_matrix({
    Name,
    Contact,
    Email_Id,
    Area,
    UserID,
    Password,
    Level,
    Category,
    Designation,
  });
  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "caller successfully Register" });
    }
  });
});

// manager data
app.post("/employee_data", checkAuthentication, (req, res) => {
  const { EIS, Name, Contact, COLONY, AREA, Designation, Qr, DEPT } = req.body;
  const user = new employee_data({
    EIS,
    Name,
    Password: EIS,
    Contact,
    COLONY,
    AREA,
    Designation,
    Qr,
    DEPT,
  });
  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "caller successfully Register" });
    }
  });
});

app.post("/newComplain", checkAuthentication, async (req, res) => {
  const {
    Complain_Number,
    Ocupent_Name,
    EIS_No,
    Contact_Number,
    Qr_No,
    Work,
    Colony,
    AREA,
    Active,
    Category,
    Sub_Category,
    Complain,
    Overseers,
    Complaint_Date,
    Complaint_Time,
    Technician_Name,
    Technician_Number,
    InprogressDate,
    InprogressTime,
    CompleteDate,
    CompleteTime,
    InprogressRemarks,
    CompleteRemarks,
    Completion_of_work,
    Completed_in_time,
    Complaint_resolve,
    Overseers_curstomer_rating,
    Call_customer_rating,
    Queries,
    Feedback_date,
    Message_to_occupent,
    Message_to_Manager,
    Close_Time,
  } = req.body;

  let job = "";
  if (Sub_Category === "Other") {
    job = await jobs.findOne({ name: "Other" });
  } else {
    job = await jobs.findOne({ name: Work });
  }
  const user = await complain_data.create({
    Complain_Number,
    Ocupent_Name,
    EIS_No,
    Contact_Number,
    Qr_No,
    Work,
    Colony,
    AREA,
    Active,
    Category,
    Sub_Category,
    Complain,
    Overseers,
    Complaint_Date,
    Complaint_Time,
    Technician_Name,
    Technician_Number,
    Inprogress: ["Open"],
    InprogressDate,
    InprogressTime,
    CompleteDate,
    CompleteTime,
    InprogressRemarks,
    CompleteRemarks,
    Completion_of_work,
    Completed_in_time,
    Complaint_resolve,
    Overseers_curstomer_rating,
    Call_customer_rating,
    Queries,
    Feedback_date,
    Message_to_occupent,
    Message_to_Manager,
    jobs: job ? job._id : "",
    Close_Time,
  });
  const message_body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: `${Contact_Number}`,
    type: "template",
    template: {
      name: "new_complain_occupant",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: `${Complain_Number}`,
            },
          ],
        },
      ],
    },
  };
  await fetch(`https://graph.facebook.com/v19.0/297672320097658/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json ",
      Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(message_body),
  });
  res.json(user);
});

// add new technician manager
app.post("/addTech", checkAuthentication, (req, res) => {
  // console.log(req.body.UnitName);
  const {
    Name,
    Contact,
    Email_Id,
    Location,
    Employee_Id,
    Category,
    Date,
    Time,
    Manager_Name,
    Total_complaints,
    Open_complaints,
    Close_complaints,
  } = req.body;

  //  const {name , email , subject , message} = req.body
  const addTech = new addTech_manager({
    Name,
    Contact,
    Email_Id,
    Location,
    Category,
    Employee_Id,
    Date,
    Time,
    Manager_Name,
    Total_complaints,
    Open_complaints,
    Close_complaints,
  });
  //  console.log(req.body.Name)
  addTech.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send({ message: "Succussful Register" });
    }
  });
});
// add new technician manager end

app.patch("/addTech/:id", checkAuthentication, (req, res) => {
  let id = req.params.id;
  let Name = req.body.Name;
  let Contact = req.body.Contact;
  let Email_Id = req.body.Email_Id;
  let Date = req.body.Date;
  let Time = req.body.Time;
  let Total_complaints = req.body.Total_complaints;
  let Open_complaints = req.body.Open_complaints;
  let Close_complaints = req.body.Close_complaints;
  addTech_manager
    .findByIdAndUpdate(
      id,
      {
        $set: {
          Name: Name,
          Contact: Contact,
          Email_Id: Email_Id,
          Date: Date,
          Time: Time,
          Total_complaints: Total_complaints,
          Open_complaints: Open_complaints,
          Close_complaints: Close_complaints,
        },
      },
      { new: true }
    )
    .then((updatedUser) => {
      res.send("User updated by Show value through PATCH");
    });
});

app.patch("/newComplain/:id", checkAuthentication, async (req, res) => {
  let id = req.params.id;
  let Technician_Name = req.body.Technician_Name;

  let Technician_Number = req.body.Technician_Number;
  let Inprogress = req.body.Inprogress;
  let CompleteRemarks = req.body.CompleteRemarks;
  let CompleteDate = req.body.CompleteDate;
  let InprogressTime = req.body.InprogressTime;
  let CompleteTime = req.body.CompleteTime;
  let InprogressRemarks = req.body.InprogressRemarks;
  let InprogressDate = req.body.InprogressDate;
  let Completion_of_work = req.body.Completion_of_work;
  let Completed_in_time = req.body.Completed_in_time;
  let Complaint_resolve = req.body.Complaint_resolve;
  let Overseers_curstomer_rating = req.body.Overseers_curstomer_rating;
  let Call_customer_rating = req.body.Call_customer_rating;
  let Queries = req.body.Queries;
  let Feedback_date = req.body.Feedback_date;
  let Close_Time = req.body.Close_Time;

  const complain = await complain_data.findByIdAndUpdate(
    id,
    {
      $set: {
        Technician_Name: Technician_Name,
        Technician_Number: Technician_Number,
        Overseers_curstomer_rating: Overseers_curstomer_rating,
        Call_customer_rating: Call_customer_rating,
        Close_Time: Close_Time,
      },
      $push: {
        Inprogress: Inprogress,
        CompleteRemarks: CompleteRemarks,
        CompleteDate: CompleteDate,
        InprogressTime: InprogressTime,
        CompleteTime: CompleteTime,
        InprogressRemarks: InprogressRemarks,
        InprogressDate: InprogressDate,
        Completion_of_work: Completion_of_work,
        Completed_in_time: Completed_in_time,
        Complaint_resolve: Complaint_resolve,
        Queries: Queries,
        Feedback_date: Feedback_date,
      },
    },
    { new: true }
  );
  if (Inprogress === "Close") {
    const message_body = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `${complain.Contact_Number}`,
      type: "template",
      template: {
        name: "close_complain_occupant",
        language: {
          code: "en",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: `${complain.Complain_Number}`,
              },
            ],
          },
        ],
      },
    };
    await fetch(`https://graph.facebook.com/v19.0/297672320097658/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json ",
        Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(message_body),
    });
  }
  res.send("User updated by Show value through PATCH");
});

app.patch("/employee_data/:id", checkAuthentication, async (req, res) => {
  let id = req.params.id;
  let Name = req.body.Name;
  let Contact = req.body.Contact;
  let Email_Id = req.body.Email_Id;
  let COLONY = req.body.COLONY;
  let Designation = req.body.Designation;
  let Qr = req.body.Qr;
  let DEPT = req.body.DEPT;
  let AREA = req.body.AREA;
  let Date = req.body.Date;

  employee_data
    .findOneAndUpdate(
      { EIS: id },
      {
        $set: {
          Name: Name,
          Contact: Contact,
          Email_Id: Email_Id,
          COLONY: COLONY,
          Designation: Designation,
          Qr: Qr,
          DEPT: DEPT,
          AREA: AREA,
          Date: Date,
        },
      },
      { new: true }
    )
    .then(() => {
      res.send("User updated by Show value through PATCH");
    });
});

// Update manager progile
app.patch("/escalated_matrix/:id", checkAuthentication, (req, res) => {
  let id = req.params.id;
  let Name = req.body.Name;
  let Contact = req.body.Contact;
  let Area = req.body.Area;
  let Level = req.body.Level;
  let Category = req.body.Category;
  let Designation = req.body.Designation;
  escalated_matrix
    .findByIdAndUpdate(
      id,
      {
        $set: {
          Name: Name,
          Contact: Contact,
          Area: Area,
          Level: Level,
          Category: Category,
          Designation: Designation,
        },
      },
      { new: true }
    )
    .then((updatedUser) => {
      res.send("User updated by Show value through PATCH");
    });
});

app.put("/updateTech/:id", checkAuthentication, async (req, res) => {
  const id = req.params.id;
  const { option } = req.body;
  const tech = await addTech_manager.findById(id);
  if (option == "addComplain") {
    tech.Total_complaints++;
    tech.Open_complaints++;
  }
  if (option == "closeComplain") {
    tech.Open_complaints--;
    tech.Close_complaints++;
  }
  await tech.save();
  res.send("updated tech");
});

app.post("/jobs", checkAuthentication, async (req, res) => {
  const { filter, value } = req.body;
  const jobsData = await jobs.find().where(filter).equals(value);
  res.json(jobsData);
});

app.get("/complains", checkAuthentication, async (req, res) => {
  const category = req.query.category;
  const data = await complain_data.aggregate([
    {
      $match: {
        Category: category,
      },
    },
    {
      $addFields: {
        lastStatus: {
          $arrayElemAt: ["$Inprogress", -1],
        },
      },
    },
    {
      $project: {
        Colony: 1,
        status: {
          $cond: {
            if: { $eq: ["$lastStatus", "Close"] },
            then: "Close",
            else: "Open",
          },
        },
      },
    },
    {
      $group: {
        _id: { area: "$Colony", status: "$status" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.area",
        statusCounts: {
          $push: { k: "$_id.status", v: "$count" },
        },
      },
    },
    {
      $addFields: {
        statusCounts: {
          $arrayToObject: {
            $concatArrays: [
              [
                { k: "Open", v: 0 },
                { k: "Close", v: 0 },
              ], // Default values
              "$statusCounts",
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        area: "$_id",
        statusCounts: {
          Open: {
            $ifNull: ["$statusCounts.Open", 0],
          },
          Close: {
            $ifNull: ["$statusCounts.Close", 0],
          },
        },
      },
    },
    {
      $sort: { area: 1 }, // Sort by area alphabetically
    },
    {
      $group: {
        _id: null,
        result: {
          $push: { k: "$area", v: "$statusCounts" },
        },
      },
    },
    {
      $project: {
        _id: 0,
        result: { $arrayToObject: "$result" },
      },
    },
  ]);
  const colonies = await escalated_matrix
    .find({ Level: 1 })
    .select({ Area: 1, _id: 0 });

  colonies.forEach((colony) => {
    // check if colony present in result if not then assign default values
    if (!data[0].result[colony.Area])
      data[0].result[colony.Area] = { Close: 0, Open: 0 };
  });
  delete data[0].result[""];
  return res.json({ ...data[0].result });
});

app.post("/contactUs", checkAuthentication, async (req, res) => {
  const { fullName, email, phoneNumber, subject, message } = req.body;
  try {
    await contact.create({ fullName, email, phoneNumber, subject, message });
    res.send("done").status(200);
  } catch (e) {
    res.status(500);
  }
});

app.get("/pagination", checkAuthentication, async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const limit = 10;
    const page = Number(req.query.page) || 1;
    const skip = limit * page - limit;
    const status = req.query.status;
    const area = req.query.area ? req.query.area.replace("%20", " ") : "";

    const matchObject = {
      $match: {
        $and: [
          {
            $or: [
              { null: status },
              {
                $expr: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, status],
                },
              },
            ],
          },
        ],
      },
    };
    if (startDate) {
      switch (status) {
        case "In Progress": {
          matchObject["$match"]["$and"].push({
            $expr: {
              $and: [
                {
                  $gte: [
                    { $arrayElemAt: ["$InprogressDate", -1] },
                    new Date(startDate),
                  ],
                },
                {
                  $lte: [
                    { $arrayElemAt: ["$InprogressDate", -1] },
                    new Date(endDate),
                  ],
                },
              ],
            },
          });
          break;
        }
        case "Complete": {
          matchObject["$match"]["$and"].push({
            $expr: {
              $and: [
                {
                  $gte: [
                    { $arrayElemAt: ["$CompleteDate", -1] },
                    new Date(startDate),
                  ],
                },
                {
                  $lte: [
                    { $arrayElemAt: ["$CompleteDate", -1] },
                    new Date(endDate),
                  ],
                },
              ],
            },
          });
          break;
        }
        case "Close": {
          matchObject["$match"]["$and"].push({
            Close_Time: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          });
          break;
        }
        default: {
          matchObject["$match"]["$and"].push({
            Complaint_Date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          });
          break;
        }
      }
    }
    if (req.query.todayClose) {
      matchObject["$match"]["$and"].push({
        Close_Time: { $gte: todayDate() },
      });
    }
    if (req.query.today) {
      matchObject["$match"]["$and"].push({
        Complaint_Date: { $gte: todayDate() },
      });
    }
    if (req.query.eis) {
      matchObject["$match"]["$and"].push({ EIS_No: req.query.eis });
    }
    if (req.query.area) {
      matchObject["$match"]["$and"].push({ Colony: area });
    }
    if (req.query.category) {
      matchObject["$match"]["$and"].push({ Category: req.query.category });
    }
    const data = await complain_data.aggregate([
      { ...matchObject },
      { $skip: skip },
      { $limit: limit },
    ]);
    const count = await complain_data.aggregate([
      { ...matchObject },
      { $count: "count" },
    ]);

    res.json([
      { Complains: data, totalCount: count.length > 0 ? count : { count: 0 } },
    ]);
  } catch (error) {
    res.json(error);
  }
});

function todayDate() {
  const currentdate = new Date();
  const month = +currentdate.getMonth() + 1;
  const datetime =
    month + "/" + currentdate.getDate() + "/" + currentdate.getFullYear();
  const timestamp = new Date(datetime);
  return timestamp;
}

app.get("/search", checkAuthentication, async (req, res) => {
  try {
    const searchParam = req.query.search;
    const limit = 10;
    const page = Number(req.query.page) || 1;
    const skip = limit * page - limit;
    const area = req.query.area ? req.query.area.replace("%20", " ") : "";
    const findObj = {
      $and: [],
    };
    if (Number(searchParam)) {
      findObj["$and"].push({ EIS_No: searchParam });
    } else {
      findObj["$and"].push({ Complain_Number: searchParam });
    }
    if (req.query.category) {
      findObj["$and"].push({ Category: req.query.category });
    }
    if (req.query.today) {
      findObj["$and"].push({
        Complaint_Date: { $gte: todayDate() },
      });
    }
    if (req.query.todayClose) {
      findObj["$and"].push({
        Close_Time: { $gte: todayDate() },
      });
    }
    if (req.query.eis) {
      findObj["$and"].push({ EIS_No: req.query.eis });
    }
    if (req.query.status) {
      findObj["$and"].push({
        $expr: {
          $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, req.query.status],
        },
      });
    }
    if (req.query.area) {
      findObj["$and"].push({
        Colony: area,
      });
    }

    const data = await complain_data.find(findObj).skip(skip).limit(limit);
    const count = await complain_data.find(findObj).count();
    res.json([{ Complains: data, totalCount: [{ count: count ? count : 0 }] }]);
  } catch (error) {
    res.json(error);
  }
});

app.get("/colony", checkAuthentication, async (req, res) => {
  const colony = await escalated_matrix
    .find({ $and: [{ Level: 1 }, { Category: "CIVIL" }] })
    .select({ Area: 1, _id: 0 });
  res.json(colony);
});

app.get("/employee-complain", checkAuthentication, async (req, res) => {
  const eis = Number(req.query.eis);
  const complains = await complain_data.aggregate([
    { $match: { EIS_No: req.query.eis } },
    {
      $project: {
        Complain_Number: 1,
        Inprogress: 1,
        Complaint_Date: 1,
        Complaint_Time: 1,
      },
    },
  ]);
  res.json(complains);
});

app.get("/employee-detalis", checkAuthentication, async (req, res) => {
  const employeDetails = await employee_data.find({ EIS: req.query.eis });
  res.json(employeDetails);
});

app.post("/login", async (req, res, next) => {
  const { userName, password } = req.body;
  let correctPassword;
  let employee = await employee_data.findOne(
    {
      $and: [{ EIS: userName }, { Password: password }],
    },
    { Password: 0 }
  );

  let role = "employee";
  if (employee) {
    correctPassword = true;
  }
  if (!employee) {
    employee = await escalated_matrix.findOne(
      {
        $and: [{ UserID: userName }, { Password: password }],
      },
      { Password: 0 }
    );

    if (employee) {
      role =
        employee.Level === 5 ? "super-admin" : `managerl${userName.slice(-1)}`;
      correctPassword = true;
    }
  }
  if (!employee) {
    employee = await caller.findOne(
      {
        $and: [{ UserName: userName }, { Password: password }],
      },
      { Password: 0 }
    );

    if (employee) {
      correctPassword = true;
      role = "caller";
    }
  }
  if (!employee) {
    employee = await admin.findOne(
      {
        $and: [{ UserName: userName }, { Password: password }],
      },
      { Password: 0 }
    );

    if (employee) {
      correctPassword = true;
      role = "admin";
    }
  }
  if (!correctPassword) {
    res.json({ error: "invalid user Credentials" });
    next();
    return;
  }
  if (employee.UserName) {
    employee._doc = { ...employee._doc, Name: employee.UserName };
  }
  req.session.user = employee;
  res.json({ employee, role });
});

app.get("/logout", async (req, res) => {
  req.session.destroy();

  res.send(`Session deleted `);
});
// chat code
function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// old parser
function parseJsonToCsv(data) {
  const opts = {};
  const asyncOpts = {};
  const parser = new StreamParser(opts, asyncOpts);
  let csv = "";
  parser.onData = (chunk) => (csv += chunk.toString());
  parser.onError = (err) => console.error(err);

  parser.write(JSON.stringify(data));
  return csv;
}

function jsonToCsvBuffer(jsonArray) {
  let csvString = "";

  // Identify all fields
  const allFields = [
    "Complain_Number",
    "Complaint_Date",
    "Category",
    "Ocupent_Name",
    "EIS_No",
    "Contact_Number",
    "Qr_No",
    "Colony",
    "Overseers",
    "Complain",
    "Technician_Name",
    "Technician_Number",
    "AREA",
    "Sub_Category",
    "CloseTime",
    "ProgressStatus",
    "ProgressDate",
    "ProgressRemarks",
    "OtherReason",
  ];

  // Create header row
  csvString += [...allFields].join(",") + "\n";

  // Add data rows
  jsonArray.forEach((obj) => {
    csvString +=
      [...allFields]
        .map((field) =>
          obj[field]
            ? typeof obj[field] === "string"
              ? obj[field].replace(/[\n,]/g, " ")
              : obj[field]
            : ""
        )
        .join(",") + "\n";
  });
  return Buffer.from(csvString, "utf-8");
}
app.get("/export", checkAuthentication, async (req, res) => {
  const status = req.query.status;
  const area = req.query.area;
  const category = req.query.category;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const findObj = [
    { $match: { $and: [] } },
    {
      $addFields: {
        Complaint_Date: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$Complaint_Date",
            timezone: "Asia/Kolkata",
          },
        },
        CloseTime: {
          $cond: {
            if: {
              $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Close"],
            },
            then: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$Close_Time",
                timezone: "Asia/Kolkata",
              },
            },
            else: undefined,
          },
        },
        ProgressStatus: { $arrayElemAt: ["$Inprogress", -1] },
        ProgressDate: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Complete"],
                },
                then: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $arrayElemAt: ["$CompleteDate", -1] },
                    timezone: "Asia/Kolkata",
                  },
                },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "In Progress"],
                },
                then: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $arrayElemAt: ["$InprogressDate", -1] },
                    timezone: "Asia/Kolkata",
                  },
                },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Re Open"],
                },
                then: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: { $arrayElemAt: ["$Feedback_date", -1] },
                    timezone: "Asia/Kolkata",
                  },
                },
              },
            ],
            default: undefined,
          },
        },
        ProgressRemarks: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Complete"],
                },
                then: { $arrayElemAt: ["$CompleteRemarks", -1] },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Close"],
                },
                then: { $arrayElemAt: ["$Queries", -1] },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "In Progress"],
                },
                then: { $arrayElemAt: ["$InprogressRemarks", -1] },
              },
              {
                case: {
                  $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, "Re Open"],
                },
                then: { $arrayElemAt: ["$Queries", -1] },
              },
            ],
            default: undefined,
          },
        },
        OtherReason: {
          $cond: {
            if: {
              $eq: [
                { $arrayElemAt: ["$Complaint_resolve", -1] },
                "Other Reason",
              ],
            },
            then: { $arrayElemAt: ["$Queries", -1] },
            else: undefined,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        SN: 0,
        Message_to_occupent: 0,
        Message_to_Manager: 0,
        jobs: 0,
        Close_Time: 0,
        InprogressTime: 0,
        CompleteTime: 0,
        InprogressRemarks: 0,
        CompleteRemarks: 0,
        Complaint_resolve: 0,
        Completion_of_work: 0,
        Completed_in_time: 0,
        Overseers_curstomer_rating: 0,
        Call_customer_rating: 0,
        CompleteDate: 0,
        InprogressDate: 0,
        Inprogress: 0,
        Active: 0,
        Feedback_date: 0,
        Queries: 0,
        Work: 0,
        Complaint_Time: 0,
        "Message to Manager": 0,
        "Message to occupent": 0,
      },
    },
  ];
  findObj[0]["$match"]["$and"];
  if (startDate) {
    switch (status) {
      case "In Progress": {
        findObj[0]["$match"]["$and"].push({
          $expr: {
            $and: [
              {
                $gte: [
                  { $arrayElemAt: ["$InprogressDate", -1] },
                  new Date(startDate),
                ],
              },
              {
                $lte: [
                  { $arrayElemAt: ["$InprogressDate", -1] },
                  new Date(endDate),
                ],
              },
            ],
          },
        });
        break;
      }
      case "Complete": {
        findObj[0]["$match"]["$and"].push({
          $expr: {
            $and: [
              {
                $gte: [
                  { $arrayElemAt: ["$CompleteDate", -1] },
                  new Date(startDate),
                ],
              },
              {
                $lte: [
                  { $arrayElemAt: ["$CompleteDate", -1] },
                  new Date(endDate),
                ],
              },
            ],
          },
        });
        break;
      }
      case "Close": {
        findObj[0]["$match"]["$and"].push({
          Close_Time: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        });
        break;
      }
      default: {
        findObj[0]["$match"]["$and"].push({
          Complaint_Date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        });
        break;
      }
    }
  }
  if (status) {
    findObj[0]["$match"]["$and"].push({
      $expr: {
        $eq: [{ $arrayElemAt: ["$Inprogress", -1] }, status],
      },
    });
  }
  if (area) {
    findObj[0]["$match"]["$and"].push({
      Colony: area,
    });
  }
  if (category) {
    findObj[0]["$match"]["$and"].push({
      Category: category,
    });
  }

  if (findObj[0]["$match"]["$and"].length === 0) {
    findObj[0]["$match"]["$and"].push({ _id: { $exists: true } });
  }

  const data = await complain_data.aggregate([...findObj]);
  // const buffer = Buffer.from(parseJsonToCsv(data), "utf-8");
  const buffer = jsonToCsvBuffer(data);
  const filePath = `Data-${Date.now()}.csv`;
  res.contentType("application/octet-stream");
  res.attachment();
  res.set("Content-Disposition", `${contentDisposition(filePath)}`);
  return bufferToStream(buffer).pipe(res);
});

app.get("/manager-details", checkAuthentication, async (req, res) => {
  const findObj = {
    $and: [{ _id: { $exists: true } }],
  };
  const category = req.query.category;
  const level = req.query.level ? Number(req.query.level) : false;
  const area = req.query.area;
  if (category) {
    findObj["$and"].push({ Category: category });
  }
  if (level) {
    findObj["$and"].push({ Level: level });
  }
  if (area) {
    findObj["$and"].push({ Area: area });
  }
  const managerDetails = await escalated_matrix.find(findObj);
  res.json(managerDetails);
});

app.patch("/update-password", checkAuthentication, async (req, res) => {
  const { currentPassword, newPassword, userID } = req.body;
  if (req.query.reset) {
    await employee_data.findOneAndUpdate(
      { EIS: req.query.eis },
      { Password: req.query.eis },
      { new: true }
    );
    return res.json({ message: "Done" });
  }

  const employee = await employee_data.findOneAndUpdate(
    { $and: [{ EIS: userID }, { Password: currentPassword }] },
    { Password: newPassword },
    { new: true }
  );
  if (!employee) {
    return res.status(401).json({ error: "Invalid Old Password" });
  }
  try {
    await Session.deleteMany({
      session: { $regex: req.session.user.Name },
      _id: { $ne: req.sessionID },
    });
  } catch (error) {
    res.send("Error Deleting session info");
  }

  return res.json({ message: "Updated Succesfully" });
});

app.patch(
  "/update-password-escalated-matrix",
  checkAuthentication,
  async (req, res) => {
    const { currentPassword, newPassword, userID } = req.body;
    if (req.query.reset) {
      await escalated_matrix.findOneAndUpdate(
        { UserID: req.query.userId },
        { Password: req.query.userId },
        { new: true }
      );
      return res.json({ message: "Done" });
    }
    const employee = await escalated_matrix.findOneAndUpdate(
      { $and: [{ UserID: userID }, { Password: currentPassword }] },
      { Password: newPassword },
      { new: true }
    );
    if (!employee) {
      return res.status(401).json({ error: "Invalid Old Password" });
    }
    try {
      await Session.deleteMany({
        session: { $regex: req.session.user.Name },
        _id: { $ne: req.sessionID },
      });
    } catch (error) {
      res.send("Error Deleting session info");
    }
    return res.json({ message: "Updated Succesfully" });
  }
);

app.post("/update-employee", checkAuthentication, async (req, res) => {
  const body = req.body;
  delete body._id;
  await updateEmployee.create(body);
  res.send("Ok");
});

app.get("/update-employee", checkAuthentication, async (req, res) => {
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const skip = limit * page - limit;
  const findObj = {};
  if (req.query.eis) {
    findObj["EIS"] = req.query.eis;
  }
  const employees = await updateEmployee.find(findObj).skip(skip).limit(limit);
  const count = await updateEmployee.find(findObj).count();
  res.json([{ employees, totalCount: [{ count: count ? count : 0 }] }]);
});

app.patch("/update-employee/:eis", checkAuthentication, async (req, res) => {
  const eis = req.params.eis;
  const reject = req.query.reject;
  const updatedEmployee = await updateEmployee.findOneAndDelete({ EIS: eis });

  if (!reject) {
    await employee_data.findOneAndUpdate(
      { EIS: eis },
      {
        Qr: updatedEmployee["Qr"],
        COLONY: updatedEmployee["COLONY"],
        AREA: updatedEmployee["AREA"],
        DEPT: updatedEmployee["DEPT"],
        Contact: updatedEmployee["Contact"],
        Designation: updatedEmployee["Designation"],
      },
      { new: true }
    );
  }
  res.send("Ok");
});

app.post("/send-complaint-msg", checkAuthentication, async (req, res) => {
  const { mobile, templateId, msg } = req.body;
  console.log(
    templateId,
    msg,
    mobile,
    `https://www.txtguru.in/imobile/api.php?username=patiodigital.com&password=29000803&source=PATIOD&dmobile=91${mobile}&dlttempid=${templateId}&message=${msg}`
  );
  const response = await fetch(
    `https://www.txtguru.in/imobile/api.php?username=patiodigital.com&password=29000803&source=PATIOD&dmobile=91${mobile}&dlttempid=${templateId}&message=${msg}`
  );
  console.log(await response.text());
  return res.send("ok");
});

app.use('/escalated', require("./routes/escalatedComplains"))

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "contact.html"));
});
app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "privacy.html"));
});
app.get("/support", (req, res) => {
  res.sendFile(path.join(__dirname, "support.html"));
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  // escalationJob.start()
});

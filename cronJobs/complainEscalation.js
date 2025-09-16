const mongoose = require("mongoose");
const Complains = require("../models/complainSchema");
const { CronJob } = require("cron");

async function escalateComplaints() {
  console.time("escalateComplaints");
  // query to find complaints that need escalation
  // 1. Not closed complaints
  // 2. Calculate the time difference between Complaint_Date and current date
  // 3. Compare the time difference with the timel2 and timel3 fields from the jobs collection
  // 4. If the time difference is greater than or equal to timel2, escalate to L2
  // 5. If the time difference is greater than or equal to timel3, escalate to L3
  const query = [
    {
      $match: {
        SN: { $not: { $regex: "^old" } },
        $expr: {
          $ne: [
            { $arrayElemAt: ["$Inprogress", -1] },
            "Close"
          ]
        },
        $or: [{ Escalation: { $in: [false, null] } }, { Escalation_Level: { $in: [null, "L2", ""] } }],
      }
    },
    {
      $lookup: {
        from: "jobs",
        localField: "jobs",
        foreignField: "_id",
        as: "jobs"
      }
    },
    {
      $unwind: {
        path: "$jobs"
      }
    },
    {
      $addFields: {
        // Calculate the difference in hours between 'endDateField' and 'startDateField'
        durationInHours: {
          $dateDiff: {
            startDate: "$Complaint_Date",
            endDate: new Date(),
            unit: "hour" // Can be "year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"
          }
        }
      }
    },
    {
      $addFields: {
        escalation: {
          $switch: {
            branches: [
              {
                case: {
                  $gte: [
                    "$durationInHours",
                    "$jobs.timel3"
                  ]
                },
                then: "L3"
              },
              {
                case: {
                  $gte: [
                    "$durationInHours",
                    "$jobs.timel2"
                  ]
                },
                then: "L2"
              }
            ],
            default: "No scores found."
          }
        }
      }
    },
    {
      $group: {
        _id: "$escalation",
        documentIds: { $push: "$_id" }
      }
    }
  ]

  const complains = await Complains.aggregate(query)

  for (const compalin of complains) {
    await Complains.updateMany(
      { _id: { $in: compalin.documentIds } },
      { $set: { Escalation: true, Escalation_Level: compalin._id } }
    );
  }

  // trigger notification
  // await sendEscalationNotification(complains)
  console.timeEnd("escalateComplaints");
}

async function sendEscalationNotification(complains) {
  // send email notification to the concerned person
  for (const { _id, documentIds } of complains) {
    if (_id && documentIds.length) {
      // create batch of 10 for documentIds and run a sendMessage function for each documentId in the batch and wait for all to complete
      const batches = [];
      for (let i = 0; i < documentIds.length; i += 10) {
        batches.push(documentIds.slice(i, i + 10));
      }

      for (const batch of batches) {
        await Promise.all(batch.map(docId => processMessage(docId, _id)));
      }
      console.log(`Escalation Level ${_id} notifications sent for ${documentIds.length} complaints.`);
    }
  }
}

async function processMessage(complainId, level) {
  // send email notification to the concerned person
  const complain = await Complains.aggregate([{
    $match: {
      _id: new mongoose.Types.ObjectId(complainId),
      Escalation: true
    }
  },
  {
    $addFields: {
      level: {
        $toInt: {
          $substr: ["$Escalation_Level", 1, -1]
        }
      },
      Category: {
        $toUpper: "$Category"
      }
    }
  },
  {
    $lookup: {
      from: "escalated_matrixes",
      let: {
        category: "$Category",
        level: "$level",
        area: "$Colony"
      },
      pipeline: [
        {
          $match: {
            $and: [
              {
                $expr: {
                  $eq: ["$Level", "$$level"]
                }
              },
              {
                $expr: {
                  $eq: ["$Category", "$$category"]
                }
              },
              {
                $expr: {
                  $eq: ["$Area", "$$area"]
                }
              }
            ]
          }
        },
        {
          $project: {
            Contact: 1,
            _id: 0
          }
        }
      ],
      as: "manager"
    }
  },
  {
    $project: {
      manager: 1,
      Complain_Number: 1
    }
  }])

  if (complain.length && complain[0].manager.length) {
    await Promise.all(complain[0].manager.map(m => sendMessage(m.Contact, complain[0].Complain_Number)));
  }
}

async function sendMessage(contact, complainNo) {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate async email sending
  console.log(`Sending escalation email for complaint ${complainNo} to ${contact}`);
}

const job = new CronJob('*/1 * * * *', () => {
  escalateComplaints().catch(err => console.error('Error escalating complaints:', err));
});

module.exports = job;
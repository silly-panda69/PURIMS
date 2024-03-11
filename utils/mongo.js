import * as mongodb from "mongodb";
import { cache } from "react";
import { getSubject } from "./asjc";

const uri="mongodb://localhost:27017";
const client = new mongodb.MongoClient(uri);
const db = client.db("research");
const departments = db.collection("departments");
const authors = db.collection("authors");
const documents = db.collection("documents");
const sources = db.collection("sources");
const reference = db.collection("reference");
const shodhganga = db.collection("shodhganga");
const projects = db.collection("projects");
const users = db.collection("users");
const verification = db.collection("verification");

const error = { error: "The requested data was not found!" };

export const revalidate = 43200;

export const getSource = cache(async (ID) => {
  let result = await sources.findOne({ _id: ID });
  return result || error;
});

export const getAuthor = cache(async (ID) => {
  let result = await authors.findOne({ _id: ID });
  return result || error;
});

export const getAuthors = cache(
  async ({
    depts = null,
    sort = "docCount",
    order = "descending",
    page = 1,
    pageSize = 25,
    s = null,
  }) => {
    let skip = (page - 1) * pageSize;
    let query = {
      ...(depts && { dept: depts }),
      ...(s && {
        $text: {
          $search: s,
        },
        // score: {
        // 	$meta: "textScore",
        // },
      }),
    };
    // if (sort == "relevance" && !s) {
    // 	sort = "coverDate";
    // } else {
    // 	sort = { score: { $meta: "textScore" } };
    // }
    let count = await authors.countDocuments(query);
    let results = await authors
      .find(query)
      .sort(sort, order)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return { count, results };
  }
);

// export const getShodh = cache(
//   async ({
//     dept = "pu",
//     sort = "dc:date:awarded",
//     order = "descending",
//     regexp,
//     page = 1,
//     pageSize = 25,
//   } = {}) => {
//     let skip = (page - 1) * pageSize;
//     let query = {
//       dept: { $in: dept.split(",") },
//       ...(regexp && { "dc:contributor:guide": new RegExp(regexp, "i") }),
//     };
//     if (dept == "pu" || dept == "") query = {};
//     let count = await shodhganga.countDocuments(query);
//     let results = await shodhganga
//       .find(query)
//       .sort(sort, order)
//       .skip(skip)
//       .limit(pageSize)
//       .toArray();
//     return { count, results };
//   }
// );
//shodganga chages for searchbar 
export const getShodh = cache(
  async ({
    dept = null,
    sort = "dc:date:awarded",
    order = "descending",
    s = null, // Change parameter name to 's'
    page = 1,
    pageSize = 25,
  } = {}) => {
    console.log("dept is wds sds  ", dept)
    let skip = (page - 1) * pageSize;
    let query = {
      ...(dept && { dept: { $in: dept.split(",") } }),
      ...(s && {
        $text: {
          $search: s,
        },
      }),
    };

    //  if (s== null &&  dept=="pu"  ) query = {};
    if (s == null && dept == null) query = {};
    let count = await shodhganga.countDocuments(query);
    let results = await shodhganga
      .find(query)
      .sort(sort, order)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return { count, results };
  }
);





export const getProjects = cache(
  async ({
    dept = "pu",
    sort = "title",
    order = "ascending",
    status = "ongoing",
    page = 1,
    pageSize = 25,
  } = {}) => {
    let skip = (page - 1) * pageSize;
    let query = { dept: { $in: dept.split(",") } };
    if (dept == "pu" || dept == "") query = {};
    if (status !== "all") query.status = status;
    let count = await projects.countDocuments(query);
    let results = await projects
      .find(query)
      .sort(sort, order)
      .skip(skip)
      .limit(pageSize)
      .toArray();
    return { count, results };
  }
);

export const getDocs = cache(
  async ({
    depts = null,
    authors = null,
    page = 1,
    pageSize = 25,
    sort = "coverDate",
    order = "descending",
    type = null,
    pub = null,
    from = null,
    to = null,
    s = null,
    country = null,
    coauthor = null,
  }) => {
    let skip = (page - 1) * pageSize;
    let query = {
      ...(depts && { departments: depts }),
      ...(authors && { authorIDs: authors }),
      ...(coauthor && {
        authorIDs: { $all: [authors, ...coauthor.split(",")] },
      }),
      ...(type && { subType: { $in: type.split(",") } }),
      ...(pub && { "source.sourceID": { $in: pub.split(",") } }),
      ...(country && {
        "authors.affiliation.country": {
          $in: country.split(",").map((s) => s.toLowerCase()),
        },
      }),
      ...(from &&
        to && {
        coverDate: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      }),
      ...(s && {
        $text: {
          $search: s,
        },
        // score: {
        // 	$meta: "textScore",
        // },
      }),
    };
    // if (sort == "relevance" && !s) {
    // 	sort = "coverDate";
    // } else {
    // 	sort = { score: { $meta: "textScore" } };
    // }

    let count = await documents.countDocuments(query);
    let results = await documents
      .find(query)
      .sort(sort, order)
      .skip(skip)
      .limit(pageSize)
      .map((doc) => (delete doc.description, doc))
      .toArray();
    return { count, results };
  }
);

export const getDepts = cache(
  async ({
    sort = "citationCount",
    order = "descending",
    type = null,
  } = {}) => {
    let result = await departments
      .find({
        _id: { $ne: "pu" },
        ...(type && { categories: { $in: type.split(",") } }),
      })
      .sort(sort, order)
      .toArray();
    return result;
  }
);

export const getDepartmentNames = cache(async () => {
  let result = await departments
    .find({ _id: { $ne: "pu" } })
    .project({ name: true })
    .map((d) => d.name)
    .toArray();
  return result;
});

export const getDoc = cache(async (doi) => {
  let doc = await documents.findOne({ doi });
  return doc || error;
});

export const getDocByScopusID = cache(async (id) => {
  let doc = await documents.findOne({ _id: id });
  return doc || error;
});

export const getCoauthors = cache(async (auid, { from, to } = {}) => {
  let result = await documents
    .aggregate([
      {
        $match: {
          authorIDs: auid,
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $project: {
          authors: "$authors",
        },
      },
      {
        $unwind: {
          path: "$authors",
        },
      },
      {
        $group: {
          _id: "$authors.auid",
          givenName: {
            $addToSet: "$authors.givenName",
          },
          surname: {
            $addToSet: "$authors.surname",
          },
          count: {
            $sum: 1,
          },
          countries: {
            $addToSet: "$authors.affiliation.country",
          },
          inDB: {
            $max: "$authors.inDB",
          },
        },
      },
      {
        $match: {
          _id: { $ne: auid },
        },
      },
      {
        $project: {
          givenName: {
            $first: "$givenName",
          },
          surname: {
            $first: "$surname",
          },
          count: "$count",
          countries: {
            $reduce: {
              input: "$countries",
              initialValue: [],
              in: {
                $concatArrays: ["$$value", "$$this"],
              },
            },
          },
          inDB: "$inDB",
        },
      },
      {
        $addFields: {
          countries: {
            $reduce: {
              input: "$countries",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $cond: [
                      {
                        $in: ["$$this", "$$value"],
                      },
                      [],
                      ["$$this"],
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ])
    .toArray();
  return result;
});

export const getDepartment = cache(async (dept) => {
  let result = await departments.findOne({ _id: dept });
  return result || error;
});

export const getAuthorsByDept = cache(async (dept) => {
  let result;
  if(dept === 'pu')
   {
    result = await authors
    .find()
    .sort("citationCount", "descending")
    .toArray();
   }
  else{
    result = await authors
    .find({ ...(dept && { dept }) })
    .sort("citationCount", "descending")
    .toArray();
  }
  for (let auth of result) delete auth.charts;
  return result;
});

export const getDocRefsByScopusID = cache(async (id) => {
  let doc = await reference.findOne({ _id: id });
  return doc || error;
});

export const getMetrics = cache(async ({ auid, dept }, { from, to } = {}) => {
  let aggr = (await documents
    .aggregate([
      {
        $match: {
          ...(auid && { authorIDs: auid }),
          ...(dept && { departments: dept }),
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $project: {
          citedByCount: "$citedByCount",
          crossref: "$crossref.citedByCount",
          funded: { $toInt: "$hasFundingInfo" },
        },
      },
      {
        $group: {
          _id: null,
          citations: {
            $push: "$citedByCount",
          },
          funded: {
            $sum: "$funded",
          },
          crossrefCitations: {
            $sum: "$crossref",
          },
        },
      },
      {
        $project: {
          citations: {
            $sortArray: {
              input: "$citations",
              sortBy: -1,
            },
          },
          funded: "$funded",
          crossrefCitations: "$crossrefCitations",
        },
      },
    ])
    .next()) || { citations: [], funded: 0, crossrefCitations: 0 };

  let h = 0;
  while (h < aggr.citations.length) {
    if (aggr.citations[h] > h) {
      h++;
      continue;
    }
    break;
  }

  let g = 0;
  let sum = 0;
  while (g < aggr.citations.length) {
    sum += aggr.citations[g];
    if (sum >= g * g) {
      g++;
      continue;
    }
    break;
  }

  let result = {
    docCount: aggr.citations.length,
    i10Index: aggr.citations.filter((c) => c >= 10).length,
    hIndex: h,
    gIndex: g,
    fundedCount: aggr.funded,
    citationCount: aggr.citations.reduce((a, b) => a + b, 0),
    crossrefCitations: aggr.crossrefCitations,
  };

  if (dept) {
    result.projects = {
      planned: await projects.countDocuments({
        department: dept,
        status: "planned",
      }),
      ongoing: await projects.countDocuments({
        department: dept,
        status: "ongoing",
      }),
      completed: await projects.countDocuments({
        department: dept,
        status: "completed",
      }),
      stalled: await projects.countDocuments({
        department: dept,
        status: "stalled",
      }),
    };
  }

  return result;
});

export const getAuthorSocialMetrics = cache(async (auid, { from, to } = {}) => {
  let query = await documents
    .find(
      {
        authorIDs: auid,
        "plum.name": "socialMedia",
        ...(from &&
          to && {
          coverDate: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        }),
      },
      { projection: { plum: { $elemMatch: { name: "socialMedia" } } } }
    )
    .toArray();

  let socialMedia = {
    TWEET_COUNT: 0,
    FACEBOOK_COUNT: 0,
  };

  for (let { plum } of query) {
    for (let { name, total } of plum[0].count_types)
      if (socialMedia[name] >= 0) socialMedia[name] += parseInt(total);
  }

  return socialMedia;
});

export const getDepartmentSocialMetrics = cache(
  async (dept, { from, to } = {}) => {
    let query = await documents
      .find(
        {
          departments: dept,
          "plum.name": "socialMedia",
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
        { projection: { plum: { $elemMatch: { name: "socialMedia" } } } }
      )
      .toArray();

    let socialMedia = {
      TWEET_COUNT: 0,
      FACEBOOK_COUNT: 0,
    };

    for (let { plum } of query) {
      for (let { name, total } of plum[0].count_types)
        if (socialMedia[name] >= 0) socialMedia[name] += parseInt(total);
    }

    return socialMedia;
  }
);

// Charts
export const getAuthorSubtypeChart = cache(async (auid, { from, to } = {}) => {
  let chart = await documents
    .aggregate([
      {
        $match: {
          authorIDs: auid,
          "source.subType": {
            $exists: true,
          },
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $group: {
          _id: "$source.subType",
          value: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          id: "$_id",
          value: "$value",
        },
      },
    ])
    .toArray();
  return chart;
});

export const getAuthorYearlyChart = cache(async (auid, { from, to } = {}) => {
  let chart = await documents
    .aggregate([
      {
        $match: {
          authorIDs: auid,
          coverDate: {
            $exists: true,
          },
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $project: {
          x: {
            $year: "$coverDate",
          },
          funded: {
            $toInt: "$hasFundingInfo",
          },
        },
      },
      {
        $group: {
          _id: "$x",
          y: {
            $sum: 1,
          },
          funded: {
            $sum: "$funded",
          },
        },
      },
      {
        $project: {
          x: "$_id",
          y: "$y",
          funded: "$funded",
        },
      },
    ])
    .toArray();
  return chart;
});

export const getAuthorSubjectChart = cache(async (auid, { from, to } = {}) => {
  let chart = await documents
    .aggregate([
      {
        $match: {
          authorIDs: auid,
          subjectAreas: {
            $exists: true,
          },
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $project: {
          subjectAreas: "$subjectAreas",
        },
      },
      {
        $unwind: "$subjectAreas",
      },
      {
        $group: {
          _id: "$subjectAreas",
          value: {
            $sum: 1,
          },
        },
      },
    ])
    .toArray();

  for (let sub of chart) sub.id = getSubject(sub._id);
  return chart;
});

export const getAuthorPositions = cache(async (auid, { from, to } = {}) => {
  let firstCount = await documents.countDocuments({
    "authors.0.auid": auid,
    ...(from &&
      to && {
      coverDate: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    }),
  });

  let lastCount = await documents.countDocuments({
    $expr: { $eq: [{ $last: "$authors.auid" }, auid] },
    authorCount: { $gt: 2 },
    ...(from &&
      to && {
      coverDate: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    }),
  });

  let correspondingCount = await documents.countDocuments({
    correspondence: auid,
    ...(from &&
      to && {
      coverDate: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    }),
  });

  return {
    firstCount,
    lastCount,
    correspondingCount,
  };
});

export const getAuthorPubChart = cache(async (auid, { from, to } = {}) => {
  let chart = await documents
    .aggregate([
      {
        $match: {
          authorIDs: auid,
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $project: {
          sourceID: "$source.sourceID",
          source: "$source.publicationName",
        },
      },
      {
        $group: {
          _id: {
            sourceID: "$sourceID",
            source: "$source",
          },
          value: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "sources",
          localField: "_id.sourceID",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                citeScore: "$citeScore",
                snip: "$snip",
                sjr: "$sjr",
                impactFactorData: "$impactFactorData",
              },
            },
          ],
          as: "metrics",
        },
      },
      {
        $set: {
          metrics: {
            $arrayElemAt: ["$metrics", 0],
          },
        },
      },
      {
        $project: {
          id: "$_id.sourceID",
          label: "$_id.source",
          metrics: "$metrics",
          value: "$value",
        },
      },
    ])
    .toArray();

  return chart;
});

export const getAuthorWorldChart = cache(async (auid, { from, to } = {}) => {
  let chart = await documents
    .aggregate([
      {
        $match: {
          authorIDs: auid,
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $project: {
          authors: "$authors",
        },
      },
      {
        $unwind: {
          path: "$authors",
        },
      },
      {
        $unwind: {
          path: "$authors.affiliation",
        },
      },
      {
        $match: {
          "authors.affiliation.country": {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$authors.affiliation.country",
          value: {
            $addToSet: {
              $cond: {
                if: {
                  $eq: ["$authors.auid", auid],
                },
                then: "$$REMOVE",
                else: "$authors.auid",
              },
            },
          },
        },
      },
      {
        $project: {
          id: { $toUpper: "$_id" },
          value: {
            $size: "$value",
          },
        },
      },
    ])
    .toArray();

  return chart;
});

export const getDepartmentSubtypeChart = cache(
  async (dept, { from, to } = {}) => {
    let chart = await documents
      .aggregate([
        {
          $match: {
            departments: dept,
            "source.subType": {
              $exists: true,
            },
            ...(from &&
              to && {
              coverDate: {
                $gte: new Date(from),
                $lte: new Date(to),
              },
            }),
          },
        },
        {
          $group: {
            _id: "$source.subType",
            value: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            id: "$_id",
            value: "$value",
          },
        },
      ])
      .toArray();
    return chart;
  }
);

export const getDepartmentYearlyChart = cache(
  async (dept, { from, to } = {}) => {
    let chart = await documents
      .aggregate([
        {
          $match: {
            departments: dept,
            coverDate: {
              $exists: true,
            },
            ...(from &&
              to && {
              coverDate: {
                $gte: new Date(from),
                $lte: new Date(to),
              },
            }),
          },
        },
        {
          $project: {
            x: {
              $year: "$coverDate",
            },
            funded: {
              $toInt: "$hasFundingInfo",
            },
          },
        },
        {
          $group: {
            _id: "$x",
            y: {
              $sum: 1,
            },
            funded: {
              $sum: "$funded",
            },
          },
        },
        {
          $project: {
            x: "$_id",
            y: "$y",
            funded: "$funded",
          },
        },
      ])
      .toArray();
    return chart;
  }
);

export const getDepartmentSubjectChart = cache(
  async (dept, { from, to } = {}) => {
    let chart = await documents
      .aggregate([
        {
          $match: {
            departments: dept,
            subjectAreas: {
              $exists: true,
            },
            ...(from &&
              to && {
              coverDate: {
                $gte: new Date(from),
                $lte: new Date(to),
              },
            }),
          },
        },
        {
          $project: {
            subjectAreas: "$subjectAreas",
          },
        },
        {
          $unwind: "$subjectAreas",
        },
        {
          $group: {
            _id: "$subjectAreas",
            value: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    for (let sub of chart) sub.id = getSubject(sub._id);
    return chart;
  }
);

export const getDepartmentPubChart = cache(async (dept, { from, to } = {}) => {
  let chart = await documents
    .aggregate([
      {
        $match: {
          departments: dept,
          subjectAreas: {
            $exists: true,
          },
          ...(from &&
            to && {
            coverDate: {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          }),
        },
      },
      {
        $project: {
          sourceID: "$source.sourceID",
          source: "$source.publicationName",
        },
      },
      {
        $group: {
          _id: {
            sourceID: "$sourceID",
            source: "$source",
          },
          value: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "sources",
          localField: "_id.sourceID",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                citeScore: "$citeScore",
                snip: "$snip",
                sjr: "$sjr",
                impactFactorData: "$impactFactorData",
              },
            },
          ],
          as: "metrics",
        },
      },
      {
        $set: {
          metrics: {
            $arrayElemAt: ["$metrics", 0],
          },
        },
      },
      {
        $project: {
          id: "$_id.sourceID",
          label: "$_id.source",
          metrics: "$metrics",
          value: "$value",
        },
      },
    ])
    .toArray();

  return chart;
});

export const getDepartmentWorldChart = cache(
  async (dept, { from, to } = {}) => {
    let chart = await documents
      .aggregate([
        {
          $match: {
            departments: dept,
            ...(from &&
              to && {
              coverDate: {
                $gte: new Date(from),
                $lte: new Date(to),
              },
            }),
          },
        },
        {
          $project: {
            authors: "$authors",
          },
        },
        {
          $unwind: {
            path: "$authors",
          },
        },
        {
          $unwind: {
            path: "$authors.affiliation",
          },
        },
        {
          $match: {
            "authors.affiliation.country": {
              $ne: null,
            },
          },
        },
        {
          $group: {
            _id: "$authors.affiliation.country",
            value: {
              $addToSet: {
                $cond: {
                  if: {
                    $eq: ["$authors.inDB", true],
                  },
                  then: "$$REMOVE",
                  else: "$authors.auid",
                },
              },
            },
          },
        },
        {
          $project: {
            id: { $toUpper: "$_id" },
            value: {
              $size: "$value",
            },
          },
        },
      ])
      .toArray();

    return chart;
  }
);

export const getProfile = cache(async (ID, email) => {
  let result = await authors.findOne({
    scopusID: ID,
    "profile.email": email,
  });
  return result || error;
});

//for login page user route.js file
export const getLogin = cache(async (email, scopusID) => {
  const emailsInDatabase = await authors
    .find({}, { "profile.email": 1, _id: 0 })
    .toArray();
  //   console.log("shhhhhhhhhhhhhh",emailsInDatabase)
  const result = emailsInDatabase.find((doc) =>
    doc.profile.email.split(",").some((dbEmail) => dbEmail.trim() === email)
  );

  return result;
});

//for update page getting the author
export const getAuth = cache(async (ID) => {
  let result = await authors.findOne({ _id: ID });
  const authdata = {
    scopusID: result.scopusID,
    llm: result.llm,
    img: result.profile.img || ""
  };
  return authdata || error;
});

//for update api
export const updateauthor = cache(async (ID, authdata) => {
  const { llm, img } = authdata;
  let result = await authors.findOneAndUpdate(
    { _id: ID },
    {
      $set: {
        'profile.img': img || "",
        llm: llm,
      },
    }
  );

  return result;
});


// img: {
//   size: img.size || "",
//   type: img.type || "",
//   name: img.name || "",
//   lastModified: img.lastModified || "",
// },

//sky mongo queries

//check if email is already registered
export const checkUser = async (email) => {
  const result = await users.findOne({ email });
  //if user is already registered return false
  if (result) {
    return false;
    //else true
  } else {
    return true;
  }
}

//insert user in the database
export const insertUser = async (email, password) => {
  const result = await users.insertOne({ email, password, verified: false });
  if (result) {
    return true;
  } else {
    return false;
  }
}

//insert otp into the verification collection
export const insertToken = async (email, token) => {
  const result = await verification.insertOne({ email, token });
  if (result) {
    return true;
  } else {
    return false;
  }
}

//export const check user and verified
export const checkVerify = async (email) => {
  const result = await users.findOne({ email: email });
  if (result) {
    if (result.verified === false) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

//fetch otp
export const fetchToken = async (email) => {
  const result = await verification.findOne({ email: email });
  if (result) {
    return result.token;
  } else {
    return null;
  }
}

//fetch user data
export const fetchUser = async (email) => {
  const result = await users.findOne({ email });
  if (result) {
    return result;
  } else {
    return null;
  }
}

//get user project
export const fetchUserProject = async (auid) => {
  const result = await projects.find({
    $or: [
      {"principal_scopusID": auid},
      {"copis.scopusID": auid}
    ]
  }).toArray();
  const count = await projects.countDocuments({
    $or: [
      {"principal_scopusID": auid},
      {"copis.scopusID": auid}
    ]
  });
  return { result, count };
}

//remove one user project
export const removeUserProject = async (id) => {
  const objectId = new mongodb.ObjectId(id);
  const result = await projects.deleteOne({ _id: objectId });
  if (result) {
    return true;
  } else {
    return false;
  }
}

//get department by name
export const getDepartmentbyName = async () => {
  const result = await departments.find({}).toArray();
  if (result) {
    const data = result.map((item) => {
      if (item._id !== "pu") {
        return item._id;
      }
    });
    return data;
  } else {
    return null;
  }
}

//get all authors
export const getAllAuthor = async () => {
  const result = await authors.find({}).toArray();
  if (result) {
    return result;
  } else {
    return null;
  }
}

export const insertOneProject = async(
  title,
  status,
  dept,
  description,
  from,
  to,
  principal_name,
  principal_scopusID,
  amount_allocated,
  amount_received,
  installment,
  funding_agency,
  industry_partner,
  deliverables,
  copis,
)=>{
  const department=dept;
  const result=await projects.insertOne({
    title,
    status,
    department,
    description,
    amount_allocated,
    amount_received,
    installment,
    funding_agency,
    industry_partner,
    principal_name,
    principal_scopusID,
    from,
    to,
    copis,
    deliverables,
  });
  if(result && result.insertedId){
    return true;
  }else{
    return false;
  }
}

export const getOneProject=async(id)=>{
  const objectId=new mongodb.ObjectId(id)
  const result=await projects.findOne({_id: objectId});
  if(result){
    return result;
  }else{
    return null;
  }
}

export const updateOneProject=async(
  title,
  status,
  dept,
  description,
  from,
  to,
  principal_name,
  principal_scopusID,
  amount_allocated,
  amount_received,
  installment,
  funding_agency,
  industry_partner,
  deliverables,
  copis,
  id,
)=>{
  const department=dept;
  const objectId=new mongodb.ObjectId(id);
  const result=await projects.updateOne({_id: objectId},{
    $set: {
      title: title,
      status: status,
      department: department,
      description: description,
      amount_allocated: amount_allocated,
      amount_received: amount_received,
      installment: installment,
      funding_agency: funding_agency,
      industry_partner: industry_partner,
      principal_name: principal_name,
      principal_scopusID: principal_scopusID,
      from: from,
      to: to,
      copis: copis,
      deliverables: deliverables,
    }
  });
  if(result){
    return true;
  }else{
    return false;
  }
}

//check if the user is already registered or not
export const checkUserID=async(scopusID)=>{
  const result=await users.findOne({scopusID});
  //if user object exists
  if(result){
    return true;
  }else{
    return false;
  }
}

//update the user for scopus id
export const insertScopusID=async(email,scopusID)=>{
  const result=await users.updateOne({email},{
    $set: {
      scopusID: scopusID,
      role: "Super_Admin",
    }
  });
  if(result){
    return true;
  }else{
    return false;
  }
}

//check if scopus id exists in db
export const checkScopusID=async(scopusID)=>{
  const result=await authors.findOne({_id: scopusID});
  if(result){
    return true;
  }else{
    return false;
  }
}

export const insertVerified=async(email)=>{
  const result=await users.updateOne({email},{
    $set: {
      verified: true,
    }
  });
  await verification.deleteOne({email});
  if(result){
    return true;
  }else{
    return false;
  }
}

export const askToken=async(email,token)=>{
  const result=await verification.updateOne({email},{
    $set: {
      token: token
    },
  },{upsert: true});
  if(result){
    if(result.modifiedCount || result.upsertedCount){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

//UNIVERSITY LEVEL CARD DATA FOR TOTAL PHDS,RESEARCH FUNDS,RESEARCH PROJECTS
export const univprojects = cache(async () => {
  let result = await projects.countDocuments({});
  return result > 0 ? result : 0;
});

//project fund university level
export const univprojectfund = cache(async () => {
  const result = await projects
    .aggregate([
      {
        $group: {
          _id: null,
          totalFund: {
            $sum: "$amount_sanctioned.amount",
          },
        },
      },
    ])
    .toArray();

  return result.length > 0 ? result[0].totalFund : 0 ;
});

//university  phds 
export const univphds = cache(async () => {
  const result = await shodhganga
    .aggregate([
      {
        $group: {
          _id: 0,
          phds: {
            $sum: {
              $cond: {
                if: { $ne: ["$dc:type:degree", null] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    ])
    .toArray();
  return  result.length > 0 ? result[0].phds : 0 ;
});

//dept LEVEL CARD DATA FOR TOTAL PHDS,RESEARCH FUNDS,

//project funds department wise

export const deptprojectfund = cache(async (dept) => {


  const result = await projects
    .aggregate([
      ...(dept !== "pu"
      ? [
          {
            $match: {
              dept: dept,
            },
          },
        ]
      : []),
      {
        $group: {
          _id: null,
          totalFund: {
            $sum: "$amount_sanctioned.amount",
          },
        },
      },
    ])
    .toArray();
  return result.length > 0 ? result[0].totalFund : 0;
});

//department wise phds
export const deptwisephds = cache(async (dept) => {
  const aggregationPipeline = [
    // If the department is not "pu," add the $match stage
    ...(dept !== "pu"
      ? [
          {
            $match: {
              dept: dept,
            },
          },
        ]
      : []),
    {
      $group: {
        _id: 0,
        totalPhds: {
          $sum: {
            $cond: {
              if: { $ne: ["$dc:type:degree", null] },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
  ];

  const result = await shodhganga.aggregate(aggregationPipeline).toArray();

  return result.length > 0 ? result[0].totalPhds : 0 ;
});


//

//Author wise card detail
export const authorwisephds = cache(
  async (firstName = "", lastName = "", dept = "") => {
    const pipeline = [
      {
        $addFields: {
          "dc:contributor:guide_temp": {
            $replaceAll: {
              input: "$dc:contributor:guide",
              find: ".",
              replacement: "",
            },
          },
        },
      },

      {
        $match: {
          $and: [
            {
              "dc:contributor:guide_temp": {
                $regex: lastName
                  ? new RegExp(
                      `${firstName} ${lastName}|${lastName} ${firstName}|${firstName}, ${lastName}|${lastName}, ${firstName}`,
                      "i"
                    )
                  : new RegExp(`${firstName}`, "i"),
              },
            },
            {
              $or: [{ dept: dept }, { dept: { $exists: false } }],
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          phds: {
            $sum: {
              $cond: {
                if: { $ne: ["$dc:type:degree", null] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $unset: "dc:contributor:guide_temp",
      },
    ];
    const result = shodhganga.aggregate(pipeline);
    const resultphds = await result.toArray();
    return resultphds.length > 0 ? resultphds[0].phds : 0;
    // console.log('Result:', resultphds);
  }
);



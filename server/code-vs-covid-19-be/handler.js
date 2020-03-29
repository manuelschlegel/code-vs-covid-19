const connectToDatabase = require("./db"); // initialize connection

// simple Error constructor for handling HTTP error codes
function HTTPError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports.healthCheck = async () => {
  await connectToDatabase();
  console.log("Connection successful.");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Connection successful." })
  };
};

module.exports.create = async event => {
  try {
    const { User, Report } = await connectToDatabase();

    const reportRequest = JSON.parse(event.body);

    // Find and create user if he doesn't exist.
    const [user, created] = await User.findOrCreate({
      where: { userId: userId },
      defaults: {
        userId: reportRequest.userId,
        userMacAddress: reportRequest.userMacAddress,
        username: null,
        creationDate: reportRequest.timeStamp,
        userScore: 0,
        userRank: 0,
        userTitle: "Corona Rookie",
        userDailyConnections: 0
      }
    });

    console.log({ created }); // The boolean indicating whether this instance was just created
    if (created) {
      console.log({ user }); // This will certainly be 'Technical Lead JavaScript'
    }

    // Store report.
    const report = await Report.create(reportRequest);
    return {
      statusCode: 200,
      body: JSON.stringify(report)
    };
  } catch (err) {
    console.log({ err });
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the report."
    };
  }
};

module.exports.getAll = async () => {
  try {
    const { Report } = await connectToDatabase();
    const reports = await Report.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(reports)
    };
  } catch (err) {
    console.log({ err });
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the reports."
    };
  }
};

module.exports.getUser = async event => {
  try {
    const { User } = await connectToDatabase();
    const userId = event.pathParameters.id;
    const user = await User.find({
      where: { userId: userId }
    });

    // Find the user.
    if (!user) {
      return {
        statusCode: err.statusCode || 404,
        headers: { "Content-Type": "text/plain" },
        body: err.message || "Could not find the user."
      };
    }

    const json = {
      userId: user.userId,
      userScore: user.userScore,
      userRank: user.userRank,
      userTitle: user.userTitle,
      userDailyConnections: user.userDailyConnections,
      globalRanking: [
        { userRank: 1, userName: "DistanceKeeper", userScore: 18251 },
        { userRank: 2, userName: "Moeper", userScore: 15851 },
        { userRank: 3, userName: "NeverLeaveHouse", userScore: 13800 },
        {
          userRank: 4,
          userName: "SociallyIsolatedProgrammer",
          userScore: 13550
        },
        { userRank: 5, userName: "RemoteDoctor", userScore: 11200 }
      ]
    };

    return {
      statusCode: 200,
      body: JSON.stringify(json)
    };
  } catch (err) {
    console.log({ err });
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the User."
    };
  }
};

/*

module.exports.getOne = async event => {
  try {
    const { Report } = await connectToDatabase();
    const report = await Report.findById(event.pathParameters.id);
    if (!report)
      throw new HTTPError(
        404,
        `Report with id: ${event.pathParameters.id} was not found`
      );
    return {
      statusCode: 200,
      body: JSON.stringify(report)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not fetch the Report."
    };
  }
};

module.exports.getAll = async () => {
  try {
    const { Report } = await connectToDatabase();
    const reports = await Report.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(reports)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not fetch the reports."
    };
  }
};

module.exports.update = async event => {
  try {
    const input = JSON.parse(event.body);
    const { Report } = await connectToDatabase();
    const report = await Report.findById(event.pathParameters.id);
    if (!report)
      throw new HTTPError(
        404,
        `Report with id: ${event.pathParameters.id} was not found`
      );
    if (input.title) report.title = input.title;
    if (input.description) report.description = input.description;
    await report.save();
    return {
      statusCode: 200,
      body: JSON.stringify(report)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Report."
    };
  }
};

module.exports.destroy = async event => {
  try {
    const { Report } = await connectToDatabase();
    const report = await Report.findById(event.pathParameters.id);
    if (!report)
      throw new HTTPError(
        404,
        `Report with id: ${event.pathParameters.id} was not found`
      );
    await report.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(report)
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could destroy fetch the Report."
    };
  }
};

*/

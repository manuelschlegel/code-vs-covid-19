const Sequelize = require("sequelize");
const ReportModel = require("./models/Report");
const UserModel = require("./models/User");
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
    const { User, Report, sequelize } = await connectToDatabase();

    const reportRequest = JSON.parse(event.body);

    // Find and create user if he doesn't exist.
    const [user, created] = await User.findOrCreate({
      where: { id: reportRequest.userId },
      defaults: {
        id: reportRequest.userId,
        macAddress: reportRequest.userMacAddress,
        username: null,
        creationDate: reportRequest.timeStamp,
        lastScore: 0,
        dailyConnections: 0,
        title: "Corona Rookie"
      }
    });

    if (!user) {
      throw new HTTPError(
        err.statusCode || 500,
        err.message || "Could not find or create the user."
      );
    }

    // Increase user's daily connections, if user has not seen this macAdress yet.
    const hasAlreadySeenMacAddressQuery = await Report.findOne({
      where: {
        userId: reportRequest.userId,
        userMacAddress: reportRequest.userMacAddress,
        timeStampSinceMidnight: Sequelize.where(
          Sequelize.fn("date", Sequelize.col("timeStamp")),
          ">",
          new Date().getUTCFullYear() +
          "-" +
          new Date().getUTCMonth() +
          "-" +
          new Date().getUTCDate()
        )
      }
    });

    if (!hasAlreadySeenMacAddressQuery) {
      User.increment(["dailyConnections"], {
        where: { id: reportRequest.userId }
      });
    }

    // Store report.
    const report = await Report.create(reportRequest);

    const response = {
      hasAlreadySeenMacAddress: hasAlreadySeenMacAddressQuery ? true : false
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    throw new HTTPError(
      err.statusCode || 500,
      err.message || "Could not create the report."
    );
  }
};

module.exports.getAll = async () => {
  try {
    const { User, Report, sequelize } = await connectToDatabase();
    const reports = await Report.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(reports)
    };
  } catch (err) {
    throw new HTTPError(
      err.statusCode || 500,
      err.message || "Could not fetch the reports."
    );
  }
};

module.exports.getUser = async event => {
  try {
    const { User, Report, sequelize } = await connectToDatabase();

    // Find the user.
    const userId = event.pathParameters.id;
    const user = await User.findOne({
      where: { id: userId }
    });
    if (!user) {
      throw new HTTPError(
        err.statusCode || 500,
        err.message || "Could not find the user."
      );
    }

    // Get user scores and ranks.
    const [rankedUsers, metadata] = await sequelize.query(
      "SELECT * FROM code_vs_covid_19_db.users ORDER BY (lastScore - dailyConnections - POW(dailyConnections, 1.2)) DESC"
    );

    let currentRank = 0;
    for (const rankedUser of rankedUsers) {
      currentRank++;
      rankedUser.rank = currentRank;
      rankedUser.score = calculateScore(
        rankedUser.lastScore,
        rankedUser.dailyConnections
      );

      if (rankedUser.id === user.id) {
        user.rank = rankedUser.rank;
        user.score = rankedUser.score;
      }
    }
    topFiveRankedUsers = rankedUsers.slice(0, 5);

    const response = {
      userId: user.id,
      userScore: user.score,
      userRank: user.rank,
      userTitle: user.title,
      userDailyConnections: user.dailyConnections,
      globalRanking: topFiveRankedUsers
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (err) {
    throw new HTTPError(
      err.statusCode || 500,
      err.message || "Could not find the user."
    );
  }
};

module.exports.setAllUserLastScore = async () => {
  try {
    const { User, Report, sequelize } = await connectToDatabase();

    // Get all user scores.
    const [rankedUsers, metadata] = await sequelize.query(
      "SELECT * FROM code_vs_covid_19_db.users"
    );

    // Calculate new scores and update database.
    // This can be further otpimized for performance.
    for (const rankedUser of rankedUsers) {
      rankedUser.score = calculateScore(
        rankedUser.lastScore,
        rankedUser.dailyConnections
      );
      const result = await User.update(
        { lastScore: rankedUser.score },
        { where: { id: rankedUser.id } }
      );
    }

    return {
      statusCode: 200
    };
  } catch (err) {
    throw new HTTPError(
      err.statusCode || 500,
      err.message || "Something went wrong."
    );
  }
};

// HELPER FUNCTIONS
const calculateScore = (lastScore, dailyConnections) => {
  const minutes = new Date().getUTCMinutes() + new Date().getUTCHours() * 60;
  const score = Math.max(
    0,
    lastScore +
    (minutes * 100) / 1440 -
    dailyConnections -
    Math.pow(dailyConnections, 1.2)
  );
  const scoreRounded = Math.round(score);

  return scoreRounded;
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

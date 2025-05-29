$(document).ready(function () {
  fetchLeaderboardData();
});

///// Ladder Data /////

let ladderState = {
  season: 11,
  bracket: "2v2",
  region: "us",
};

const fetchLeaderboardData = (options = {}) => {
  ladderState = { ...ladderState, ...options };

  $.get("/api/leaderboard", {
    season: ladderState.season,
    bracket: ladderState.bracket,
    region: ladderState.region,
  })
    .done(function (data) {
      console.log(
        `Loaded ${
          ladderState.bracket
        } leaderboard for ${ladderState.region.toUpperCase()} server:`,
        data
      );
    })
    .fail(function (xhr, status, error) {
      console.error("Failed to fetch leaderboard:", error);
    });
};

///// Ladder filtering buttons /////

$("[data-leaderboard-param]").click(function () {
  const button = $(this);
  const paramName = button.data("leaderboard-param");
  const paramValue = button.data("value");

  const options = {};
  options[paramName] = paramValue;

  fetchLeaderboardData(options);
});

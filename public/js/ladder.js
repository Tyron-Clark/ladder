const fetchLeaderboardData = (season = 11, bracket = "2v2", region = "us") => {
  $.get("/api/leaderboard", {
    season: season,
    bracket: bracket,
    region: region,
  })
    .done(function (data) {
      console.log("leaderboard data:", data);
    })
    .fail(function (xhr, status, error) {
      console.error("failed to fetch leaderboard:", error);
    });
};

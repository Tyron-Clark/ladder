$(document).ready(function () {
  fetchLeaderboardData();
});

///// Ladder Data /////

let ladderState = {
  season: 11,
  bracket: "2v2",
  region: "us",
};

const formatSlugName = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const fetchLeaderboardData = (options = {}) => {
  ladderState = { ...ladderState, ...options };

  $.get("/api/leaderboard", {
    season: ladderState.season,
    bracket: ladderState.bracket,
    region: ladderState.region,
  })
    .done(function (response) {
      const entries = response.entries || [];

      const tbody = $("#ladderBody");
      tbody.empty();

      if (!entries.length) {
        tbody.append(
          `<tr><td colspan="6">No leaderboard data available.</td></tr>`
        );
        return;
      }

      ///// Display ladder data /////

      entries.forEach((entry, index) => {
        const player = entry.character;
        const stats = entry.season_match_statistics;
        const winloss = `${stats.won} - ${stats.lost}`;

        const row = `
          <tr class="playerRows">
            <td>${entry.rank}</td>
            <td>${player.name}</td>
            <td>${entry.rating}</td>
            <td>${player.spec} ${player.class}</td>
            <td>${formatSlugName(player.realm.slug)}</td>
            <td>${winloss}</td>
          </tr>`;

        tbody.append(row);
      });

      console.log(
        `Loaded ${
          ladderState.bracket
        } leaderboard for ${ladderState.region.toUpperCase()} server:`,
        entries
      );
    })
    .fail(function (xhr, status, error) {
      console.error("Failed to fetch leaderboard:", error);
      $("#ladderBody").html(
        `<tr><td colspan="6">Failed to load leaderboard data.</td></tr>`
      );
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

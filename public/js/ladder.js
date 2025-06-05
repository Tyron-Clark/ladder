// TODO: Pagination hasNextPage, hasPrevPage button diables

$(function () {
  fetchLeaderboardData();
  ///// Pagination Buttons /////
  $("#paginationNext, #paginationPrev, #paginationFirst, #paginationLast ").on(
    "click",
    function () {
      const button = this.id;
      let page = ladderState.currentPage;

      switch (button) {
        case "paginationNext":
          page = ladderState.currentPage + 1;
          break;
        case "paginationPrev":
          page = Math.max(1, ladderState.currentPage - 1);
          break;
        case "paginationFirst":
          page = 1;
          break;
        case "paginationLast":
          page = ladderState.totalPages;
          break;
      }

      if (page !== ladderState.currentPage) {
        fetchLeaderboardData({ currentPage: page });
      }
    }
  );
});

///// Ladder Data /////

let ladderState = {
  season: 11,
  bracket: "2v2",
  region: "us",
  currentPage: 1,
  totalPages: 1,
};
console.log(ladderState);
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
    page: ladderState.currentPage,
  })
    .done(function (response) {
      const entries = response.entries || [];
      const pagination = response.pagination;

      if (pagination && pagination.totalPages) {
        ladderState.totalPages = pagination.totalPages;
      }

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
        response
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

export const processLeaderboardData = (data, queryParams) => {
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 100;
  const search = queryParams.search || "";
  const bracket = queryParams.bracket || "2v2";
  const region = queryParams.region || "us";
  const season = queryParams.season || 11;

  let entries = data.entries || [];

  const totalEntries = entries.length;
  const totalPages = Math.ceil(totalEntries / limit); // Round up to handle partial pages
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  //Extract just the slice of data the user wants to see
  const paginatedEntries = entries.slice(startIndex, endIndex);

  return {
    entries: paginatedEntries,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalEntries: totalEntries,
      entriesPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      searchTerm: search || null,
      bracket: bracket,
      region: region,
      season: season,
      dataSource: "blizzard-api",
    },
  };
};
